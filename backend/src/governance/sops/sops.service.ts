import { Injectable, NotFoundException, Logger, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, In } from 'typeorm';
import { SOP, SOPStatus } from './entities/sop.entity';
import { SOPAssignment } from './entities/sop-assignment.entity';
import { CreateSOPDto } from './dto/create-sop.dto';
import { UpdateSOPDto } from './dto/update-sop.dto';
import { SOPQueryDto } from './dto/sop-query.dto';
import { UnifiedControl } from '../unified-controls/entities/unified-control.entity';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { EntityType, WorkflowTrigger } from '../../workflow/entities/workflow.entity';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';
import { WorkflowExecution } from '../../workflow/entities/workflow-execution.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class SOPsService {
  private readonly logger = new Logger(SOPsService.name);

  constructor(
    @InjectRepository(SOP)
    private sopRepository: Repository<SOP>,
    @InjectRepository(UnifiedControl)
    private controlRepository: Repository<UnifiedControl>,
    @InjectRepository(WorkflowExecution)
    private workflowExecutionRepository: Repository<WorkflowExecution>,
    @InjectRepository(SOPAssignment)
    private assignmentRepository: Repository<SOPAssignment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Optional() private workflowService?: WorkflowService,
    @Optional() private notificationService?: NotificationService,
  ) {}

  async create(createSOPDto: CreateSOPDto, userId: string): Promise<SOP> {
    const sop = this.sopRepository.create({
      ...createSOPDto,
      created_by: userId,
    });

    const savedSOP = await this.sopRepository.save(sop);

    // Link controls if provided
    if (createSOPDto.control_ids && createSOPDto.control_ids.length > 0) {
      const controls = await this.controlRepository.find({
        where: { id: In(createSOPDto.control_ids) },
      });
      savedSOP.controls = controls;
      await this.sopRepository.save(savedSOP);
    }

    // Trigger workflows on SOP creation
    if (this.workflowService) {
      try {
        await this.workflowService.checkAndTriggerWorkflows(
          EntityType.SOP,
          savedSOP.id,
          WorkflowTrigger.ON_CREATE,
          {
            status: savedSOP.status,
            category: savedSOP.category,
          },
          true, // useQueue: true
        );
      } catch (error) {
        this.logger.error(`Failed to trigger workflows on SOP creation: ${error.message}`, error.stack);
        // Don't throw - workflow failure shouldn't block SOP creation
      }
    }

    return savedSOP;
  }

  async findAll(queryDto: SOPQueryDto) {
    const { page = 1, limit = 25, status, category, owner_id, search, sort } = queryDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<SOP> = {};

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    if (owner_id) {
      where.owner_id = owner_id;
    }

    const queryBuilder = this.sopRepository
      .createQueryBuilder('sop')
      .leftJoinAndSelect('sop.owner', 'owner')
      .leftJoinAndSelect('sop.creator', 'creator')
      .leftJoinAndSelect('sop.updater', 'updater')
      .leftJoinAndSelect('sop.controls', 'controls');

    if (Object.keys(where).length > 0) {
      queryBuilder.where(where);
    }

    if (search) {
      queryBuilder.andWhere(
        '(sop.title ILIKE :search OR sop.purpose ILIKE :search OR sop.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Handle sorting
    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`sop.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('sop.created_at', 'DESC');
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

  async findOne(id: string): Promise<SOP> {
    const sop = await this.sopRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'creator',
        'updater',
        'controls',
      ],
    });

    if (!sop) {
      throw new NotFoundException(`SOP with ID ${id} not found`);
    }

    return sop;
  }

  async update(id: string, updateSOPDto: UpdateSOPDto, userId: string): Promise<SOP> {
    const sop = await this.findOne(id);
    const oldStatus = sop.status; // Track status before update

    Object.assign(sop, {
      ...updateSOPDto,
      updated_by: userId,
    });

    // Update controls if provided
    if (updateSOPDto.control_ids !== undefined) {
      if (updateSOPDto.control_ids.length > 0) {
        const controls = await this.controlRepository.find({
          where: { id: In(updateSOPDto.control_ids) },
        });
        sop.controls = controls;
      } else {
        sop.controls = [];
      }
    }

    const savedSOP = await this.sopRepository.save(sop);

    // Trigger workflows on update
    if (this.workflowService) {
      try {
        await this.workflowService.checkAndTriggerWorkflows(
          EntityType.SOP,
          savedSOP.id,
          WorkflowTrigger.ON_UPDATE,
          {
            status: savedSOP.status,
            category: savedSOP.category,
          },
          true, // useQueue: true
        );
      } catch (error) {
        this.logger.error(`Failed to trigger workflows on SOP update: ${error.message}`, error.stack);
        // Don't throw - workflow failure shouldn't block SOP update
      }
    }

    // Trigger workflows if status changed
    if (this.workflowService && oldStatus !== savedSOP.status) {
      try {
        await this.workflowService.checkAndTriggerWorkflows(
          EntityType.SOP,
          savedSOP.id,
          WorkflowTrigger.ON_STATUS_CHANGE,
          {
            status: savedSOP.status,
            oldStatus,
            category: savedSOP.category,
          },
          true, // useQueue: true
        );
        this.logger.log(`Triggered workflows for SOP ${id} status change: ${oldStatus} → ${savedSOP.status}`);
      } catch (error) {
        this.logger.error(`Failed to trigger workflows on SOP status change: ${error.message}`, error.stack);
      }
    }

    // Send notifications for status changes
    if (this.notificationService && oldStatus !== savedSOP.status) {
      try {
        const statusMessages: Record<SOPStatus, { title: string; message: string; priority: NotificationPriority }> = {
          [SOPStatus.DRAFT]: {
            title: 'SOP Status Changed',
            message: `SOP "${savedSOP.title}" has been moved to Draft status.`,
            priority: NotificationPriority.LOW,
          },
          [SOPStatus.IN_REVIEW]: {
            title: 'SOP Review Required',
            message: `SOP "${savedSOP.title}" is now in Review and requires your attention.`,
            priority: NotificationPriority.HIGH,
          },
          [SOPStatus.APPROVED]: {
            title: 'SOP Approved',
            message: `SOP "${savedSOP.title}" has been approved and is ready for publication.`,
            priority: NotificationPriority.MEDIUM,
          },
          [SOPStatus.PUBLISHED]: {
            title: 'SOP Published',
            message: `SOP "${savedSOP.title}" has been published and is now active.`,
            priority: NotificationPriority.HIGH,
          },
          [SOPStatus.ARCHIVED]: {
            title: 'SOP Archived',
            message: `SOP "${savedSOP.title}" has been archived.`,
            priority: NotificationPriority.LOW,
          },
        };

        const notificationConfig = statusMessages[savedSOP.status];
        if (notificationConfig && savedSOP.owner_id) {
          await this.notificationService.create({
            userId: savedSOP.owner_id,
            type: savedSOP.status === SOPStatus.IN_REVIEW
              ? NotificationType.GENERAL
              : NotificationType.GENERAL,
            priority: notificationConfig.priority,
            title: notificationConfig.title,
            message: notificationConfig.message,
            entityType: 'sop',
            entityId: savedSOP.id,
            actionUrl: `/dashboard/governance/sops/${savedSOP.id}`,
          });
        }
      } catch (error) {
        this.logger.error(`Failed to send notification on SOP status change: ${error.message}`, error.stack);
      }
    }

    return savedSOP;
  }

  async publish(id: string, userId: string, assignToUserIds?: string[], assignToRoleIds?: string[]): Promise<SOP> {
    const sop = await this.findOne(id);

    if (sop.status !== SOPStatus.APPROVED) {
      throw new NotFoundException('SOP must be approved before publishing');
    }

    sop.status = SOPStatus.PUBLISHED;
    sop.published_date = new Date();
    sop.updated_by = userId;

    const savedSOP = await this.sopRepository.save(sop);

    // Create assignments if provided
    if ((assignToUserIds && assignToUserIds.length > 0) || (assignToRoleIds && assignToRoleIds.length > 0)) {
      const assignments: SOPAssignment[] = [];

      // Create user assignments
      if (assignToUserIds && assignToUserIds.length > 0) {
        for (const userId of assignToUserIds) {
          // Check if assignment already exists
          const existing = await this.assignmentRepository.findOne({
            where: { sop_id: id, user_id: userId },
          });

          if (!existing) {
            const assignment = this.assignmentRepository.create({
              sop_id: id,
              user_id: userId,
              assigned_by: userId,
              assigned_at: new Date(),
            });
            assignments.push(assignment);
          }
        }
      }

      // Create role assignments (for now, we'll need to get users by role)
      // Note: This is a simplified implementation - in production, you'd query users by role
      if (assignToRoleIds && assignToRoleIds.length > 0) {
        this.logger.log(`Role-based assignments for SOP ${id}: ${assignToRoleIds.join(', ')}`);
        // TODO: Implement role-based user lookup and assignment
        // For now, role assignments are logged but not created
      }

      if (assignments.length > 0) {
        await this.assignmentRepository.save(assignments);
        this.logger.log(`Created ${assignments.length} assignments for SOP ${id}`);
      }

      // Send notifications to assigned users
      if (this.notificationService && assignToUserIds && assignToUserIds.length > 0) {
        try {
          for (const userId of assignToUserIds) {
            await this.notificationService.create({
              userId,
              type: NotificationType.GENERAL,
              priority: NotificationPriority.HIGH,
              title: 'New SOP Published',
              message: `SOP "${savedSOP.title}" has been published and assigned to you.`,
              entityType: 'sop',
              entityId: savedSOP.id,
              actionUrl: `/dashboard/governance/sops/${savedSOP.id}`,
            });
          }
        } catch (error) {
          this.logger.error(`Failed to send notifications: ${error.message}`, error.stack);
        }
      }
    }

    return savedSOP;
  }

  async remove(id: string): Promise<void> {
    const sop = await this.findOne(id);
    await this.sopRepository.softRemove(sop);
  }

  /**
   * Get SOPs assigned to a specific user
   */
  async getAssignedSOPs(userId: string, queryDto?: SOPQueryDto): Promise<{ data: SOP[]; meta: any }> {
    const { page = 1, limit = 25, status, category, search, sort } = queryDto || {};
    const skip = (page - 1) * limit;

    const assignments = await this.assignmentRepository.find({
      where: { user_id: userId },
      relations: ['sop', 'sop.owner', 'sop.creator'],
    });

    const sopIds = assignments.map((a) => a.sop_id);

    if (sopIds.length === 0) {
      return {
        data: [],
        meta: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const where: FindOptionsWhere<SOP> = {
      id: In(sopIds),
    };

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    const queryBuilder = this.sopRepository
      .createQueryBuilder('sop')
      .leftJoinAndSelect('sop.owner', 'owner')
      .leftJoinAndSelect('sop.creator', 'creator')
      .leftJoinAndSelect('sop.controls', 'controls')
      .where(where);

    if (search) {
      queryBuilder.andWhere(
        '(sop.title ILIKE :search OR sop.purpose ILIKE :search OR sop.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`sop.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('sop.created_at', 'DESC');
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

  /**
   * Get publication statistics
   */
  async getPublicationStatistics(): Promise<{
    totalPublished: number;
    publishedThisMonth: number;
    publishedThisYear: number;
    assignmentsCount: number;
    acknowledgedCount: number;
    acknowledgmentRate: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [totalPublished, publishedThisMonth, publishedThisYear, assignments, acknowledged] = await Promise.all([
      this.sopRepository.count({ where: { status: SOPStatus.PUBLISHED } }),
      this.sopRepository
        .createQueryBuilder('sop')
        .where('sop.status = :status', { status: SOPStatus.PUBLISHED })
        .andWhere('sop.published_date >= :startOfMonth', { startOfMonth })
        .getCount(),
      this.sopRepository
        .createQueryBuilder('sop')
        .where('sop.status = :status', { status: SOPStatus.PUBLISHED })
        .andWhere('sop.published_date >= :startOfYear', { startOfYear })
        .getCount(),
      this.assignmentRepository.count(),
      this.assignmentRepository.count({ where: { acknowledged: true } }),
    ]);

    const acknowledgmentRate = assignments > 0 ? Math.round((acknowledged / assignments) * 100) : 0;

    return {
      totalPublished,
      publishedThisMonth,
      publishedThisYear,
      assignmentsCount: assignments,
      acknowledgedCount: acknowledged,
      acknowledgmentRate,
    };
  }
}
