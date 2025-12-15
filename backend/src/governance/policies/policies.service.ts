import { Injectable, NotFoundException, Logger, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Policy, PolicyStatus } from './entities/policy.entity';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyQueryDto } from './dto/policy-query.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { EntityType, WorkflowTrigger } from '../../workflow/entities/workflow.entity';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';

@Injectable()
export class PoliciesService {
  private readonly logger = new Logger(PoliciesService.name);

  constructor(
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @Optional() private workflowService?: WorkflowService,
    @Optional() private notificationService?: NotificationService,
  ) {}

  async create(createPolicyDto: CreatePolicyDto, userId: string): Promise<Policy> {
    const policy = this.policyRepository.create({
      ...createPolicyDto,
      created_by: userId,
    });

    const savedPolicy = await this.policyRepository.save(policy);

    // Trigger workflows on policy creation
    if (this.workflowService) {
      try {
        await this.workflowService.checkAndTriggerWorkflows(
          EntityType.POLICY,
          savedPolicy.id,
          WorkflowTrigger.ON_CREATE,
          {
            status: savedPolicy.status,
            policy_type: savedPolicy.policy_type,
          },
          true, // useQueue: true - use Bull Queue for async execution
        );
      } catch (error) {
        this.logger.error(`Failed to trigger workflows on policy creation: ${error.message}`, error.stack);
        // Don't throw - workflow failure shouldn't block policy creation
      }
    }

    // Send notifications for policy creation
    if (this.notificationService && savedPolicy.owner_id) {
      try {
        await this.notificationService.create({
          userId: savedPolicy.owner_id,
          type: NotificationType.GENERAL,
          priority: NotificationPriority.MEDIUM,
          title: 'New Policy Created',
          message: `Policy "${savedPolicy.title}" has been created and is now in ${savedPolicy.status} status.`,
          entityType: 'policy',
          entityId: savedPolicy.id,
          actionUrl: `/dashboard/governance/policies/${savedPolicy.id}`,
        });
      } catch (error) {
        this.logger.error(`Failed to send notification on policy creation: ${error.message}`, error.stack);
      }
    }

    return savedPolicy;
  }

  async findAll(queryDto: PolicyQueryDto) {
    const { page = 1, limit = 25, status, policy_type, owner_id, search, sort } = queryDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Policy> = {};

    if (status) {
      where.status = status;
    }

    if (policy_type) {
      where.policy_type = policy_type;
    }

    if (owner_id) {
      where.owner_id = owner_id;
    }

    const queryBuilder = this.policyRepository
      .createQueryBuilder('policy')
      .leftJoinAndSelect('policy.owner', 'owner')
      .leftJoinAndSelect('policy.creator', 'creator')
      .leftJoinAndSelect('policy.updater', 'updater');

    if (Object.keys(where).length > 0) {
      queryBuilder.where(where);
    }

    if (search) {
      queryBuilder.andWhere(
        '(policy.title ILIKE :search OR policy.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Handle sorting
    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`policy.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('policy.created_at', 'DESC');
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

  async findOne(id: string): Promise<Policy> {
    const policy = await this.policyRepository.findOne({
      where: { id },
      relations: ['owner', 'creator', 'updater', 'control_objectives', 'supersedes_policy'],
    });

    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    return policy;
  }

  async update(id: string, updatePolicyDto: UpdatePolicyDto, userId: string): Promise<Policy> {
    const policy = await this.findOne(id);
    const oldStatus = policy.status; // Track status before update

    Object.assign(policy, {
      ...updatePolicyDto,
      updated_by: userId,
    });

    const savedPolicy = await this.policyRepository.save(policy);

    // Trigger workflows if status changed
    if (this.workflowService && oldStatus !== savedPolicy.status) {
      try {
        await this.workflowService.checkAndTriggerWorkflows(
          EntityType.POLICY,
          savedPolicy.id,
          WorkflowTrigger.ON_STATUS_CHANGE,
          {
            status: savedPolicy.status,
            oldStatus,
            policy_type: savedPolicy.policy_type,
          },
          true, // useQueue: true - use Bull Queue for async execution
        );
        this.logger.log(`Triggered workflows for policy ${id} status change: ${oldStatus} → ${savedPolicy.status}`);
      } catch (error) {
        this.logger.error(`Failed to trigger workflows on policy status change: ${error.message}`, error.stack);
        // Don't throw - workflow failure shouldn't block policy update
      }
    }

    // Send notifications for status changes
    if (this.notificationService && oldStatus !== savedPolicy.status) {
      try {
        const statusMessages: Record<PolicyStatus, { title: string; message: string; priority: NotificationPriority }> = {
          [PolicyStatus.DRAFT]: {
            title: 'Policy Status Changed',
            message: `Policy "${savedPolicy.title}" has been moved to Draft status.`,
            priority: NotificationPriority.LOW,
          },
          [PolicyStatus.IN_REVIEW]: {
            title: 'Policy Review Required',
            message: `Policy "${savedPolicy.title}" is now in Review and requires your attention.`,
            priority: NotificationPriority.HIGH,
          },
          [PolicyStatus.APPROVED]: {
            title: 'Policy Approved',
            message: `Policy "${savedPolicy.title}" has been approved and is ready for publication.`,
            priority: NotificationPriority.MEDIUM,
          },
          [PolicyStatus.PUBLISHED]: {
            title: 'Policy Published',
            message: `Policy "${savedPolicy.title}" has been published and is now active.`,
            priority: NotificationPriority.HIGH,
          },
          [PolicyStatus.ARCHIVED]: {
            title: 'Policy Archived',
            message: `Policy "${savedPolicy.title}" has been archived.`,
            priority: NotificationPriority.LOW,
          },
        };

        const notificationConfig = statusMessages[savedPolicy.status];
        if (notificationConfig) {
          // Notify policy owner
          if (savedPolicy.owner_id) {
            await this.notificationService.create({
              userId: savedPolicy.owner_id,
              type: savedPolicy.status === PolicyStatus.IN_REVIEW 
                ? NotificationType.POLICY_REVIEW_REQUIRED 
                : NotificationType.GENERAL,
              priority: notificationConfig.priority,
              title: notificationConfig.title,
              message: notificationConfig.message,
              entityType: 'policy',
              entityId: savedPolicy.id,
              actionUrl: `/dashboard/governance/policies/${savedPolicy.id}`,
            });
          }

          // If published, notify all assigned business units (if applicable)
          if (savedPolicy.status === PolicyStatus.PUBLISHED && savedPolicy.business_units?.length > 0) {
            // Note: In a real implementation, you'd fetch users from business units
            // For now, we'll just log this
            this.logger.log(`Policy ${savedPolicy.id} published - should notify business units: ${savedPolicy.business_units.join(', ')}`);
          }
        }
      } catch (error) {
        this.logger.error(`Failed to send notification on policy status change: ${error.message}`, error.stack);
      }
    }

    // Also trigger ON_UPDATE workflows
    if (this.workflowService) {
      try {
        await this.workflowService.checkAndTriggerWorkflows(
          EntityType.POLICY,
          savedPolicy.id,
          WorkflowTrigger.ON_UPDATE,
          {
            status: savedPolicy.status,
            policy_type: savedPolicy.policy_type,
          },
          true, // useQueue: true
        );
      } catch (error) {
        this.logger.error(`Failed to trigger ON_UPDATE workflows: ${error.message}`, error.stack);
      }
    }

    return savedPolicy;
  }

  async remove(id: string): Promise<void> {
    const policy = await this.findOne(id);
    await this.policyRepository.softRemove(policy);
  }

  async findVersions(id: string): Promise<Policy[]> {
    const currentPolicy = await this.findOne(id);
    
    // Find all policies with the same title (assuming same title = same policy family)
    // This includes the current policy and all its versions
    const versions = await this.policyRepository.find({
      where: { title: currentPolicy.title },
      relations: ['owner', 'creator', 'updater'],
      order: { version_number: 'ASC' },
    });

    return versions;
  }
}

