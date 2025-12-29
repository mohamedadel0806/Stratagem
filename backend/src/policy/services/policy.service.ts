import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy, PolicyStatus } from '../entities/policy.entity';
import { PolicyResponseDto } from '../dto/policy-response.dto';
import { CreatePolicyDto } from '../dto/create-policy.dto';
import { UpdatePolicyDto } from '../dto/update-policy.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { EntityType, WorkflowTrigger } from '../../workflow/entities/workflow.entity';
import { PolicyQueryDto } from '../dto/policy-query.dto';
import { TenantContextService } from '../../common/context/tenant-context.service';

@Injectable()
export class PolicyService {
  constructor(
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @Inject(forwardRef(() => WorkflowService))
    private workflowService: WorkflowService,
    private tenantContextService: TenantContextService,
  ) { }

  async findAll(query?: PolicyQueryDto): Promise<{ data: PolicyResponseDto[]; total: number; page: number; limit: number }> {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    // Build query
    let queryBuilder = this.policyRepository.createQueryBuilder('policy');

    // Apply search (title or description)
    if (query?.search) {
      queryBuilder.where(
        '(policy.title ILIKE :search OR policy.description ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    // Apply filters
    if (query?.status) {
      queryBuilder.andWhere('policy.status = :status', { status: query.status });
    }
    if (query?.policyType) {
      queryBuilder.andWhere('policy.policyType = :policyType', { policyType: query.policyType });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination and ordering
    const policies = await queryBuilder
      .orderBy('policy.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      data: policies.map((policy) => this.toResponseDto(policy)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<PolicyResponseDto> {
    const policy = await this.policyRepository.findOne({ where: { id } });
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }
    return this.toResponseDto(policy);
  }

  async create(createPolicyDto: CreatePolicyDto, userId?: string): Promise<PolicyResponseDto> {
    const policyData = {
      title: createPolicyDto.title,
      description: createPolicyDto.description,
      policyType: createPolicyDto.policyType,
      status: createPolicyDto.status || PolicyStatus.DRAFT,
      version: createPolicyDto.version || '1.0',
      effectiveDate: createPolicyDto.effectiveDate ? new Date(createPolicyDto.effectiveDate) : null,
      reviewDate: createPolicyDto.reviewDate ? new Date(createPolicyDto.reviewDate) : null,
      ownerId: userId,
      tenantId: this.tenantContextService.getTenantId(),
      organizationId: this.tenantContextService.getTenantId(), // Keeping for backward compatibility
    };

    const policy = this.policyRepository.create(policyData);
    const savedPolicy = await this.policyRepository.save(policy);

    // Trigger workflows on create
    try {
      await this.workflowService.checkAndTriggerWorkflows(
        EntityType.POLICY,
        savedPolicy.id,
        WorkflowTrigger.ON_CREATE,
        { status: savedPolicy.status, policyType: savedPolicy.policyType },
      );
    } catch (error) {
      console.error('Error triggering workflows:', error);
      // Don't fail the create if workflow fails
    }

    return this.toResponseDto(savedPolicy);
  }

  async update(id: string, updatePolicyDto: UpdatePolicyDto): Promise<PolicyResponseDto> {
    const policy = await this.policyRepository.findOne({ where: { id } });
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    const updateData: any = {};
    if (updatePolicyDto.title !== undefined) updateData.title = updatePolicyDto.title;
    if (updatePolicyDto.description !== undefined) updateData.description = updatePolicyDto.description;
    if (updatePolicyDto.policyType !== undefined) updateData.policyType = updatePolicyDto.policyType;
    if (updatePolicyDto.status !== undefined) updateData.status = updatePolicyDto.status;
    if (updatePolicyDto.version !== undefined) updateData.version = updatePolicyDto.version;
    if (updatePolicyDto.effectiveDate !== undefined) {
      updateData.effectiveDate = updatePolicyDto.effectiveDate ? new Date(updatePolicyDto.effectiveDate) : null;
    }
    if (updatePolicyDto.reviewDate !== undefined) {
      updateData.reviewDate = updatePolicyDto.reviewDate ? new Date(updatePolicyDto.reviewDate) : null;
    }
    if (updatePolicyDto.documentUrl !== undefined) updateData.documentUrl = updatePolicyDto.documentUrl;
    if (updatePolicyDto.documentName !== undefined) updateData.documentName = updatePolicyDto.documentName;
    if (updatePolicyDto.documentMimeType !== undefined) updateData.documentMimeType = updatePolicyDto.documentMimeType;

    const oldStatus = policy.status;
    Object.assign(policy, updateData);
    const updatedPolicy = await this.policyRepository.save(policy);

    // Trigger workflows on update
    try {
      await this.workflowService.checkAndTriggerWorkflows(
        EntityType.POLICY,
        updatedPolicy.id,
        WorkflowTrigger.ON_UPDATE,
        { status: updatedPolicy.status, policyType: updatedPolicy.policyType },
      );

      // Trigger status change workflow if status changed
      if (oldStatus !== updatedPolicy.status) {
        await this.workflowService.checkAndTriggerWorkflows(
          EntityType.POLICY,
          updatedPolicy.id,
          WorkflowTrigger.ON_STATUS_CHANGE,
          { oldStatus, newStatus: updatedPolicy.status, policyType: updatedPolicy.policyType },
        );
      }
    } catch (error) {
      console.error('Error triggering workflows:', error);
      // Don't fail the update if workflow fails
    }

    return this.toResponseDto(updatedPolicy);
  }

  async uploadDocument(id: string, file: any): Promise<PolicyResponseDto> {
    const policy = await this.policyRepository.findOne({ where: { id } });
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    // Store file info in database
    policy.documentUrl = `/api/policies/${id}/document`;
    policy.documentName = file.originalname;
    policy.documentMimeType = file.mimetype;

    const updatedPolicy = await this.policyRepository.save(policy);
    return this.toResponseDto(updatedPolicy);
  }

  async remove(id: string): Promise<void> {
    const policy = await this.policyRepository.findOne({ where: { id } });
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }
    await this.policyRepository.remove(policy);
  }

  async bulkUpdateStatus(ids: string[], status: PolicyStatus): Promise<{ updated: number; policies: PolicyResponseDto[] }> {
    const policies = await this.policyRepository.find({
      where: ids.map(id => ({ id })),
    });

    if (policies.length === 0) {
      throw new NotFoundException('No policies found with the provided IDs');
    }

    // Update all policies with the new status
    policies.forEach(policy => {
      policy.status = status;
    });

    const updatedPolicies = await this.policyRepository.save(policies);

    return {
      updated: updatedPolicies.length,
      policies: updatedPolicies.map(policy => this.toResponseDto(policy)),
    };
  }

  private toResponseDto(policy: Policy): PolicyResponseDto {
    return {
      id: policy.id,
      title: policy.title,
      description: policy.description,
      policyType: policy.policyType,
      status: policy.status,
      version: policy.version,
      effectiveDate: policy.effectiveDate?.toISOString(),
      reviewDate: policy.reviewDate?.toISOString(),
      documentUrl: policy.documentUrl,
      documentName: policy.documentName,
      documentMimeType: policy.documentMimeType,
      createdAt: policy.createdAt.toISOString(),
    };
  }
}

