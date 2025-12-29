import { Injectable, NotFoundException, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { UnifiedControl, ImplementationStatus, ControlStatus, ControlType } from './entities/unified-control.entity';
import { CreateUnifiedControlDto } from './dto/create-unified-control.dto';
import { UnifiedControlQueryDto } from './dto/unified-control-query.dto';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';
import { ControlDomain } from '../../governance/domains/entities/domain.entity';

@Injectable()
export class UnifiedControlsService {
  private readonly logger = new Logger(UnifiedControlsService.name);

  constructor(
    @InjectRepository(UnifiedControl)
    private controlRepository: Repository<UnifiedControl>,
    @InjectRepository(ControlDomain)
    private domainRepository: Repository<ControlDomain>,
    @Optional() private notificationService?: NotificationService,
  ) { }

  async create(createUnifiedControlDto: CreateUnifiedControlDto, userId: string, tenantId: string): Promise<UnifiedControl> {
    const control = this.controlRepository.create({
      ...createUnifiedControlDto,
      created_by: userId,
      tenant_id: tenantId,
    });

    const savedControl = await this.controlRepository.save(control);

    // Send notification if owner is assigned
    if (this.notificationService && savedControl.control_owner_id) {
      try {
        await this.notificationService.create({
          userId: savedControl.control_owner_id,
          type: NotificationType.GENERAL,
          priority: NotificationPriority.MEDIUM,
          title: 'New Control Assigned',
          message: `Control "${savedControl.title}" has been created and assigned to you.`,
          entityType: 'unified_control',
          entityId: savedControl.id,
          actionUrl: `/dashboard/governance/unified-controls/${savedControl.id}`,
        });
      } catch (error) {
        this.logger.error(`Failed to send notification: ${error.message}`, error.stack);
      }
    }

    return savedControl;
  }

  async findAll(queryDto: UnifiedControlQueryDto) {
    const { page = 1, limit = 25, control_type, status, implementation_status, domain, control_owner_id, search, sort } = queryDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<UnifiedControl> = {};

    if (control_type) {
      where.control_type = control_type;
    }

    if (status) {
      where.status = status;
    }

    if (implementation_status) {
      where.implementation_status = implementation_status;
    }

    if (domain) {
      where.domain = domain;
    }

    if (control_owner_id) {
      where.control_owner_id = control_owner_id;
    }

    const queryBuilder = this.controlRepository
      .createQueryBuilder('control')
      .leftJoinAndSelect('control.control_owner', 'control_owner')
      .leftJoinAndSelect('control.creator', 'creator')
      .leftJoinAndSelect('control.updater', 'updater');

    if (Object.keys(where).length > 0) {
      queryBuilder.where(where);
    }

    if (search) {
      queryBuilder.andWhere(
        '(control.title ILIKE :search OR control.description ILIKE :search OR control.control_identifier ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`control.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('control.created_at', 'DESC');
    }

    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<UnifiedControl> {
    const control = await this.controlRepository.findOne({
      where: { id },
      relations: ['control_owner', 'creator', 'updater'],
    });

    if (!control) {
      throw new NotFoundException(`Unified control with ID ${id} not found`);
    }

    return control;
  }

  async update(id: string, updateDto: Partial<CreateUnifiedControlDto>, userId: string): Promise<UnifiedControl> {
    const control = await this.findOne(id);
    const oldImplementationStatus = control.implementation_status;

    Object.assign(control, {
      ...updateDto,
      updated_by: userId,
    });

    const savedControl = await this.controlRepository.save(control);

    // Send notification when implementation status changes to implemented
    if (
      this.notificationService &&
      oldImplementationStatus !== savedControl.implementation_status &&
      savedControl.implementation_status === ImplementationStatus.IMPLEMENTED
    ) {
      try {
        // Notify control owner
        if (savedControl.control_owner_id) {
          await this.notificationService.create({
            userId: savedControl.control_owner_id,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.MEDIUM,
            title: 'Control Implementation Completed',
            message: `Control "${savedControl.title}" has been marked as implemented.`,
            entityType: 'control',
            entityId: savedControl.id,
            actionUrl: `/dashboard/governance/controls/${savedControl.id}`,
          });
        }

        // Notify creator
        if (savedControl.created_by) {
          await this.notificationService.create({
            userId: savedControl.created_by,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.LOW,
            title: 'Control Implementation Completed',
            message: `Control "${savedControl.title}" has been successfully implemented.`,
            entityType: 'control',
            entityId: savedControl.id,
            actionUrl: `/dashboard/governance/controls/${savedControl.id}`,
          });
        }
      } catch (error) {
        this.logger.error(`Failed to send notification on control implementation: ${error.message}`, error.stack);
      }
    }

    return savedControl;
  }

  async remove(id: string): Promise<void> {
    const control = await this.findOne(id);
    await this.controlRepository.softRemove(control);
  }

  // ==================== CONTROL LIBRARY METHODS (Story 3.1) ====================

  /**
   * Get control library statistics
   */
  async getLibraryStatistics(): Promise<{
    totalControls: number;
    activeControls: number;
    draftControls: number;
    deprecatedControls: number;
    byType: Record<string, number>;
    byComplexity: Record<string, number>;
    implementationRate: number;
  }> {
    try {
      const [total, active, draft, deprecated] = await Promise.all([
        this.controlRepository.count(),
        this.controlRepository.count({ where: { status: ControlStatus.ACTIVE } }),
        this.controlRepository.count({ where: { status: ControlStatus.DRAFT } }),
        this.controlRepository.count({ where: { status: ControlStatus.DEPRECATED } }),
      ]);

      // Get controls by type
      const byTypeResults = await this.controlRepository
        .createQueryBuilder('control')
        .select('control.control_type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('control.control_type')
        .getRawMany();

      const byType: Record<string, number> = {};
      byTypeResults.forEach((row) => {
        byType[row.type] = parseInt(row.count, 10);
      });

      // Get controls by complexity
      const byComplexityResults = await this.controlRepository
        .createQueryBuilder('control')
        .select('control.complexity', 'complexity')
        .addSelect('COUNT(*)', 'count')
        .groupBy('control.complexity')
        .getRawMany();

      const byComplexity: Record<string, number> = {};
      byComplexityResults.forEach((row) => {
        byComplexity[row.complexity] = parseInt(row.count, 10);
      });

      // Calculate implementation rate
      const implemented = await this.controlRepository.count({
        where: { implementation_status: ImplementationStatus.IMPLEMENTED },
      });
      const implementationRate = total > 0 ? Math.round((implemented / total) * 100) : 0;

      return {
        totalControls: total,
        activeControls: active,
        draftControls: draft,
        deprecatedControls: deprecated,
        byType,
        byComplexity,
        implementationRate,
      };
    } catch (error) {
      this.logger.error('Error getting control library statistics', error);
      return {
        totalControls: 0,
        activeControls: 0,
        draftControls: 0,
        deprecatedControls: 0,
        byType: {},
        byComplexity: {},
        implementationRate: 0,
      };
    }
  }

  /**
   * Get controls by domain
   */
  async getControlsByDomain(domainId: string, includeArchived: boolean = false) {
    const query = this.controlRepository.createQueryBuilder('control')
      .leftJoinAndSelect('control.control_owner', 'control_owner')
      .where('control.domain = :domain', { domain: domainId });

    if (!includeArchived) {
      query.andWhere('control.deleted_at IS NULL');
    }

    query.orderBy('control.created_at', 'DESC');

    return query.getMany();
  }

  /**
   * Get domain hierarchy tree with control counts
   */
  async getDomainHierarchyTree(parentId: string | null = null): Promise<any[]> {
    const query = this.domainRepository.createQueryBuilder('domain')
      .leftJoinAndSelect('domain.children', 'children')
      .where('domain.parent_id IS NULL');

    if (parentId) {
      query.where('domain.parent_id = :parentId', { parentId });
    }

    query.andWhere('domain.is_active = true')
      .orderBy('domain.display_order', 'ASC');

    const domains = await query.getMany();

    // Add control counts
    const tree = await Promise.all(
      domains.map(async (domain) => ({
        ...domain,
        controlCount: await this.controlRepository.count({ where: { domain: domain.id } }),
        children: await this.getDomainHierarchyTree(domain.id),
      })),
    );

    return tree;
  }

  /**
   * Get all available control types
   */
  async getControlTypes(): Promise<string[]> {
    return Object.values(ControlType);
  }

  /**
   * Get all active domains
   */
  async getActiveDomains(): Promise<ControlDomain[]> {
    return this.domainRepository.find({
      where: { is_active: true },
      order: { display_order: 'ASC' },
    });
  }

  /**
   * Browse control library with advanced filtering
   */
  async browseLibrary(filters: {
    domain?: string;
    type?: string;
    complexity?: string;
    status?: string;
    implementationStatus?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { domain, type, complexity, status, implementationStatus, search, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const query = this.controlRepository.createQueryBuilder('control')
      .leftJoinAndSelect('control.control_owner', 'control_owner')
      .where('control.deleted_at IS NULL');

    if (domain) {
      query.andWhere('control.domain = :domain', { domain });
    }

    if (type) {
      query.andWhere('control.control_type = :type', { type });
    }

    if (complexity) {
      query.andWhere('control.complexity = :complexity', { complexity });
    }

    if (status) {
      query.andWhere('control.status = :status', { status });
    }

    if (implementationStatus) {
      query.andWhere('control.implementation_status = :implementationStatus', { implementationStatus });
    }

    if (search) {
      query.andWhere(
        '(control.title ILIKE :search OR control.description ILIKE :search OR control.control_identifier ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    query.orderBy('control.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get related controls (similar by domain and type)
   */
  async getRelatedControls(controlId: string, limit: number = 5): Promise<UnifiedControl[]> {
    const control = await this.findOne(controlId);

    const relatedControls = await this.controlRepository
      .createQueryBuilder('control')
      .where('control.id != :controlId', { controlId })
      .andWhere('control.deleted_at IS NULL')
      .andWhere(
        '(control.domain = :domain OR control.control_type = :type)',
        { domain: control.domain, type: control.control_type },
      )
      .orderBy('control.created_at', 'DESC')
      .take(limit)
      .getMany();

    return relatedControls;
  }

  /**
   * Get control effectiveness data
   */
  async getControlEffectiveness(controlId: string): Promise<{
    controlId: string;
    title: string;
    implementationStatus: string;
    lastUpdated: Date;
    avgEffectiveness: number;
    testHistory: Array<{ date: Date; result: string }>;
  }> {
    const control = await this.findOne(controlId);

    return {
      controlId: control.id,
      title: control.title,
      implementationStatus: control.implementation_status,
      lastUpdated: control.updated_at,
      avgEffectiveness: 0, // To be calculated from test results
      testHistory: [], // To be populated from ControlTest entity
    };
  }

  /**
   * Export controls to CSV format
   */
  async exportControls(filters?: {
    domain?: string;
    type?: string;
    status?: string;
  }): Promise<string> {
    let query = this.controlRepository
      .createQueryBuilder('control')
      .select([
        'control.control_identifier',
        'control.title',
        'control.domain',
        'control.control_type',
        'control.complexity',
        'control.cost_impact',
        'control.status',
        'control.implementation_status',
      ])
      .where('control.deleted_at IS NULL');

    if (filters?.domain) {
      query = query.andWhere('control.domain = :domain', { domain: filters.domain });
    }

    if (filters?.type) {
      query = query.andWhere('control.control_type = :type', { type: filters.type });
    }

    if (filters?.status) {
      query = query.andWhere('control.status = :status', { status: filters.status });
    }

    const controls = await query.getRawMany();

    // Build CSV
    const headers = [
      'Control ID',
      'Title',
      'Domain',
      'Type',
      'Complexity',
      'Cost Impact',
      'Status',
      'Implementation Status',
    ];

    const rows = controls.map((c) => [
      c.control_control_identifier,
      c.control_title,
      c.control_domain,
      c.control_control_type,
      c.control_complexity,
      c.control_cost_impact,
      c.control_status,
      c.control_implementation_status,
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell || ''}"`).join(',')).join('\n');

    return csv;
  }

  /**
   * Import controls from array of data
   */
  async importControls(
    controlsData: Array<{
      control_identifier: string;
      title: string;
      domain?: string;
      control_type?: string;
      complexity?: string;
      cost_impact?: string;
      description?: string;
      control_procedures?: string;
      testing_procedures?: string;
    }>,
    userId: string,
  ): Promise<{
    created: number;
    skipped: number;
    errors: Array<{ row: number; error: string }>;
  }> {
    const result = { created: 0, skipped: 0, errors: [] as Array<{ row: number; error: string }> };

    for (let i = 0; i < controlsData.length; i++) {
      try {
        const data = controlsData[i];

        // Check if control already exists
        const existing = await this.controlRepository.findOne({
          where: { control_identifier: data.control_identifier },
        });

        if (existing) {
          result.skipped++;
          continue;
        }

        // Create control
        const control = this.controlRepository.create({
          control_identifier: data.control_identifier,
          title: data.title,
          domain: data.domain,
          control_type: data.control_type as any,
          complexity: data.complexity as any,
          cost_impact: data.cost_impact as any,
          description: data.description,
          control_procedures: data.control_procedures,
          testing_procedures: data.testing_procedures,
        });

        await this.controlRepository.save(control);
        result.created++;
      } catch (error) {
        result.errors.push({
          row: i + 1,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }

  /**
   * Get controls by multiple criteria (dashboard query)
   */
  async getControlsDashboard(): Promise<{
    recentControls: UnifiedControl[];
    draftControls: UnifiedControl[];
    implementedControls: UnifiedControl[];
    deprecatedControls: UnifiedControl[];
  }> {
    const [recentControls, draftControls, implementedControls, deprecatedControls] = await Promise.all([
      this.controlRepository
        .createQueryBuilder('control')
        .where('control.deleted_at IS NULL')
        .orderBy('control.created_at', 'DESC')
        .take(5)
        .getMany(),
      this.controlRepository
        .createQueryBuilder('control')
        .where('control.status = :status', { status: ControlStatus.DRAFT })
        .orderBy('control.created_at', 'DESC')
        .take(10)
        .getMany(),
      this.controlRepository
        .createQueryBuilder('control')
        .where('control.implementation_status = :status', { status: ImplementationStatus.IMPLEMENTED })
        .orderBy('control.updated_at', 'DESC')
        .take(10)
        .getMany(),
      this.controlRepository
        .createQueryBuilder('control')
        .where('control.status = :status', { status: ControlStatus.DEPRECATED })
        .orderBy('control.created_at', 'DESC')
        .take(10)
        .getMany(),
    ]);

    return {
      recentControls,
      draftControls,
      implementedControls,
      deprecatedControls,
    };
  }
}

