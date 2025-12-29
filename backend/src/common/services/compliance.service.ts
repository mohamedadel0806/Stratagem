import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplianceFramework } from '../entities/compliance-framework.entity';
import { ComplianceRequirement, RequirementStatus } from '../entities/compliance-requirement.entity';
import { ComplianceStatusResponseDto, FrameworkStatusDto } from '../dto/compliance-status-response.dto';
import { CreateFrameworkDto } from '../dto/create-framework.dto';
import { UpdateFrameworkDto } from '../dto/update-framework.dto';
import { CreateRequirementDto } from '../dto/create-requirement.dto';
import { UpdateRequirementDto } from '../dto/update-requirement.dto';
import { FrameworkResponseDto } from '../dto/framework-response.dto';
import { RequirementResponseDto } from '../dto/requirement-response.dto';
import { RequirementQueryDto } from '../dto/requirement-query.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { EntityType, WorkflowTrigger } from '../../workflow/entities/workflow.entity';
import { TenantContextService } from '../context/tenant-context.service';

@Injectable()
export class ComplianceService {
  constructor(
    @InjectRepository(ComplianceFramework)
    private frameworksRepository: Repository<ComplianceFramework>,
    @InjectRepository(ComplianceRequirement)
    private requirementsRepository: Repository<ComplianceRequirement>,
    @Inject(forwardRef(() => WorkflowService))
    private workflowService: WorkflowService,
    private tenantContextService: TenantContextService,
  ) { }

  async getStatus(): Promise<ComplianceStatusResponseDto> {
    const query = this.frameworksRepository
      .createQueryBuilder('framework')
      .leftJoinAndSelect('framework.requirements', 'requirement')
      .orderBy('framework.name', 'ASC')
      .select([
        'framework.id',
        'framework.name',
        'framework.frameworkCode',
        'framework.version',
        'framework.status',
        'requirement.id',
        'requirement.status',
      ]);

    const tenantId = this.tenantContextService.getTenantId();

    if (tenantId) {
      query.where('framework.tenantId = :tenantId', { tenantId });
    }

    const frameworks = await query.getMany();

    const frameworkStatuses: FrameworkStatusDto[] = frameworks.map((framework) => {
      const totalRequirements = framework.requirements.length;
      const compliantRequirements = framework.requirements.filter(
        (req) => req.status === RequirementStatus.COMPLIANT,
      ).length;
      const inProgressRequirements = framework.requirements.filter(
        (req) => req.status === RequirementStatus.IN_PROGRESS,
      ).length;

      const compliancePercentage =
        totalRequirements > 0
          ? Math.round((compliantRequirements / totalRequirements) * 100)
          : 0;

      // Determine trend (simplified - in real app, compare with historical data)
      const trend: 'improving' | 'stable' | 'declining' =
        inProgressRequirements > 0 ? 'improving' : compliancePercentage >= 80 ? 'stable' : 'declining';

      return {
        name: framework.name,
        compliancePercentage,
        requirementsMet: compliantRequirements,
        totalRequirements,
        trend,
      };
    });

    const overallCompliance =
      frameworkStatuses.length > 0
        ? Math.round(
          frameworkStatuses.reduce((sum, fw) => sum + fw.compliancePercentage, 0) /
          frameworkStatuses.length,
        )
        : 0;

    return {
      overallCompliance,
      frameworks: frameworkStatuses,
    };
  }

  // Framework CRUD operations
  async findAllFrameworks(): Promise<FrameworkResponseDto[]> {
    const frameworks = await this.frameworksRepository.find({
      order: { name: 'ASC' },
    });
    return frameworks.map((fw) => this.toFrameworkDto(fw));
  }

  async findFrameworkById(id: string): Promise<FrameworkResponseDto> {
    const framework = await this.frameworksRepository.findOne({ where: { id } });
    if (!framework) {
      throw new NotFoundException(`Framework with ID ${id} not found`);
    }
    return this.toFrameworkDto(framework);
  }

  async createFramework(createDto: CreateFrameworkDto): Promise<FrameworkResponseDto> {
    const tenantId = this.tenantContextService.getTenantId();
    const framework = this.frameworksRepository.create({
      ...createDto,
      tenantId: tenantId,
      organizationId: tenantId, // Keeping for backward compatibility
    });
    const saved = await this.frameworksRepository.save(framework);
    return this.toFrameworkDto(saved);
  }

  async updateFramework(id: string, updateDto: UpdateFrameworkDto): Promise<FrameworkResponseDto> {
    const framework = await this.frameworksRepository.findOne({ where: { id } });
    if (!framework) {
      throw new NotFoundException(`Framework with ID ${id} not found`);
    }
    Object.assign(framework, updateDto);
    const updated = await this.frameworksRepository.save(framework);
    return this.toFrameworkDto(updated);
  }

  async deleteFramework(id: string): Promise<void> {
    const framework = await this.frameworksRepository.findOne({ where: { id } });
    if (!framework) {
      throw new NotFoundException(`Framework with ID ${id} not found`);
    }
    await this.frameworksRepository.remove(framework);
  }

  // Requirement CRUD operations
  async findAllRequirements(query?: RequirementQueryDto): Promise<{ data: RequirementResponseDto[]; total: number; page: number; limit: number }> {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    // Build query
    let queryBuilder = this.requirementsRepository.createQueryBuilder('requirement');

    // Apply search (title or description)
    if (query?.search) {
      queryBuilder.where(
        '(requirement.title ILIKE :search OR requirement.description ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    // Apply filters
    if (query?.frameworkId) {
      queryBuilder.andWhere('requirement.frameworkId = :frameworkId', { frameworkId: query.frameworkId });
    }
    if (query?.status) {
      queryBuilder.andWhere('requirement.status = :status', { status: query.status });
    }
    if (query?.category) {
      queryBuilder.andWhere('requirement.category = :category', { category: query.category });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination and ordering
    // Limit max results to prevent performance issues
    const safeLimit = Math.min(limit, 500);
    const requirements = await queryBuilder
      .orderBy('requirement.createdAt', 'DESC')
      .skip(skip)
      .take(safeLimit)
      .getMany();

    return {
      data: requirements.map((req) => this.toRequirementDto(req)),
      total,
      page,
      limit: safeLimit,
    };
  }

  async findRequirementById(id: string): Promise<RequirementResponseDto> {
    const requirement = await this.requirementsRepository.findOne({ where: { id } });
    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${id} not found`);
    }
    return this.toRequirementDto(requirement);
  }

  async createRequirement(createDto: CreateRequirementDto): Promise<RequirementResponseDto> {
    // Verify framework exists
    const framework = await this.frameworksRepository.findOne({ where: { id: createDto.frameworkId } });
    if (!framework) {
      throw new NotFoundException(`Framework with ID ${createDto.frameworkId} not found`);
    }

    const tenantId = this.tenantContextService.getTenantId();
    const requirement = this.requirementsRepository.create({
      ...createDto,
      tenantId: tenantId,
      organizationId: tenantId, // Keeping for backward compatibility
      status: createDto.status || RequirementStatus.NOT_STARTED,
    });
    const saved = await this.requirementsRepository.save(requirement);

    // Trigger workflows on create
    try {
      await this.workflowService.checkAndTriggerWorkflows(
        EntityType.COMPLIANCE_REQUIREMENT,
        saved.id,
        WorkflowTrigger.ON_CREATE,
        { status: saved.status, frameworkId: saved.frameworkId, category: saved.category },
      );
    } catch (error) {
      console.error('Error triggering workflows:', error);
      // Don't fail the create if workflow fails
    }

    return this.toRequirementDto(saved);
  }

  async updateRequirement(id: string, updateDto: UpdateRequirementDto): Promise<RequirementResponseDto> {
    const requirement = await this.requirementsRepository.findOne({ where: { id } });
    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${id} not found`);
    }

    // If frameworkId is being updated, verify it exists
    if (updateDto.frameworkId && updateDto.frameworkId !== requirement.frameworkId) {
      const framework = await this.frameworksRepository.findOne({ where: { id: updateDto.frameworkId } });
      if (!framework) {
        throw new NotFoundException(`Framework with ID ${updateDto.frameworkId} not found`);
      }
    }

    const oldStatus = requirement.status;
    Object.assign(requirement, updateDto);
    const updated = await this.requirementsRepository.save(requirement);

    // Trigger workflows on update
    try {
      await this.workflowService.checkAndTriggerWorkflows(
        EntityType.COMPLIANCE_REQUIREMENT,
        updated.id,
        WorkflowTrigger.ON_UPDATE,
        { status: updated.status, frameworkId: updated.frameworkId, category: updated.category },
      );

      // Trigger status change workflow if status changed
      if (oldStatus !== updated.status) {
        await this.workflowService.checkAndTriggerWorkflows(
          EntityType.COMPLIANCE_REQUIREMENT,
          updated.id,
          WorkflowTrigger.ON_STATUS_CHANGE,
          { oldStatus, newStatus: updated.status, frameworkId: updated.frameworkId },
        );
      }
    } catch (error) {
      console.error('Error triggering workflows:', error);
      // Don't fail the update if workflow fails
    }

    return this.toRequirementDto(updated);
  }

  async deleteRequirement(id: string): Promise<void> {
    const requirement = await this.requirementsRepository.findOne({ where: { id } });
    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${id} not found`);
    }
    await this.requirementsRepository.remove(requirement);
  }

  async bulkUpdateRequirementStatus(ids: string[], status: RequirementStatus): Promise<{ updated: number; requirements: RequirementResponseDto[] }> {
    const requirements = await this.requirementsRepository.find({
      where: ids.map(id => ({ id })),
    });

    if (requirements.length === 0) {
      throw new NotFoundException('No requirements found with the provided IDs');
    }

    // Update all requirements with the new status
    requirements.forEach(requirement => {
      requirement.status = status;
    });

    const updatedRequirements = await this.requirementsRepository.save(requirements);

    return {
      updated: updatedRequirements.length,
      requirements: updatedRequirements.map(req => this.toRequirementDto(req)),
    };
  }

  private toFrameworkDto(framework: ComplianceFramework): FrameworkResponseDto {
    return {
      id: framework.id,
      name: framework.name,
      code: framework.code,
      description: framework.description,
      region: framework.region,
      createdAt: framework.createdAt.toISOString(),
      updatedAt: framework.updatedAt.toISOString(),
    };
  }

  async bulkCreateRequirements(
    frameworkId: string,
    requirements: Array<{
      title: string;
      description?: string;
      requirementCode?: string;
      category?: string;
      complianceDeadline?: string;
      applicability?: string;
      status?: RequirementStatus;
    }>,
    clearExisting: boolean = true,
  ): Promise<{ created: number; errors: string[]; deleted: number }> {
    // Verify framework exists
    const framework = await this.frameworksRepository.findOne({ where: { id: frameworkId } });
    if (!framework) {
      throw new NotFoundException(`Framework with ID ${frameworkId} not found`);
    }

    let deleted = 0;

    // Clear existing requirements if requested
    if (clearExisting) {
      const existingRequirements = await this.requirementsRepository.find({
        where: { frameworkId },
      });
      if (existingRequirements.length > 0) {
        await this.requirementsRepository.remove(existingRequirements);
        deleted = existingRequirements.length;
      }
    }

    const errors: string[] = [];
    let created = 0;

    for (const reqData of requirements) {
      try {
        const tenantId = this.tenantContextService.getTenantId();
        const requirement = this.requirementsRepository.create({
          title: reqData.title,
          description: reqData.description,
          requirementCode: reqData.requirementCode,
          category: reqData.category,
          complianceDeadline: reqData.complianceDeadline,
          applicability: reqData.applicability,
          frameworkId,
          tenantId: tenantId,
          organizationId: tenantId, // Keeping for backward compatibility
          status: reqData.status || RequirementStatus.NOT_STARTED,
        });
        await this.requirementsRepository.save(requirement);
        created++;
      } catch (error: any) {
        errors.push(`Failed to create "${reqData.title}": ${error.message}`);
      }
    }

    return { created, errors, deleted };
  }

  private toRequirementDto(requirement: ComplianceRequirement): RequirementResponseDto {
    return {
      id: requirement.id,
      title: requirement.title,
      description: requirement.description,
      requirementCode: requirement.requirementCode,
      category: requirement.category,
      complianceDeadline: requirement.complianceDeadline,
      applicability: requirement.applicability,
      frameworkId: requirement.frameworkId,
      status: requirement.status,
      createdAt: requirement.createdAt.toISOString(),
      updatedAt: requirement.updatedAt.toISOString(),
    };
  }
}

