import { Injectable, NotFoundException, Logger, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, In } from 'typeorm';
import { Policy, PolicyStatus } from './entities/policy.entity';
import { PolicyAssignment } from './entities/policy-assignment.entity';
import { PolicyReview, ReviewStatus, ReviewOutcome } from './entities/policy-review.entity';
import { User, UserRole } from '../../users/entities/user.entity';
import { BusinessUnit } from '../../common/entities/business-unit.entity';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyQueryDto } from './dto/policy-query.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { EntityType, WorkflowTrigger } from '../../workflow/entities/workflow.entity';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';
import { WorkflowExecution } from '../../workflow/entities/workflow-execution.entity';

@Injectable()
export class PoliciesService {
  private readonly logger = new Logger(PoliciesService.name);

  constructor(
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(WorkflowExecution)
    private workflowExecutionRepository: Repository<WorkflowExecution>,
    @InjectRepository(PolicyAssignment)
    private policyAssignmentRepository: Repository<PolicyAssignment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(BusinessUnit)
    private businessUnitRepository: Repository<BusinessUnit>,
    @InjectRepository(PolicyReview)
    private policyReviewRepository: Repository<PolicyReview>,
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

  /**
   * Get workflow executions for a policy
   */
  async getWorkflowExecutions(policyId: string) {
    if (!this.workflowService) {
      return [];
    }

    const executions = await this.workflowExecutionRepository.find({
      where: {
        entityType: EntityType.POLICY,
        entityId: policyId,
      },
      relations: ['workflow', 'assignedTo'],
      order: { createdAt: 'DESC' },
    });

    const executionsWithApprovals = await Promise.all(
      executions.map(async (execution) => {
        const approvals = await this.workflowService!.getApprovals(execution.id);
        return {
          id: execution.id,
          workflowId: execution.workflowId,
          workflowName: execution.workflow?.name || 'Unknown',
          workflowType: execution.workflow?.type || null,
          status: execution.status,
          inputData: execution.inputData,
          outputData: execution.outputData,
          errorMessage: execution.errorMessage,
          assignedTo: execution.assignedTo
            ? {
                id: execution.assignedTo.id,
                name: `${execution.assignedTo.firstName || ''} ${execution.assignedTo.lastName || ''}`.trim() || execution.assignedTo.email,
              }
            : null,
          startedAt: execution.startedAt?.toISOString(),
          completedAt: execution.completedAt?.toISOString(),
          createdAt: execution.createdAt.toISOString(),
          approvals,
        };
      }),
    );

    return executionsWithApprovals;
  }

  /**
   * Get pending approvals for a policy
   */
  async getPendingApprovals(policyId: string, userId: string) {
    if (!this.workflowService) {
      return [];
    }

    const executions = await this.workflowExecutionRepository.find({
      where: {
        entityType: EntityType.POLICY,
        entityId: policyId,
        status: 'in_progress' as any,
      },
      relations: ['workflow'],
    });

    const allApprovals = [];
    for (const execution of executions) {
      const approvals = await this.workflowService.getApprovals(execution.id);
      const pendingApprovals = approvals.filter(
        (a) => a.status === 'pending' && a.approverId === userId,
      );
      allApprovals.push(
        ...pendingApprovals.map((a) => ({
          ...a,
          workflowExecutionId: execution.id,
          workflowName: execution.workflow?.name || 'Unknown',
        })),
      );
    }

    return allApprovals;
  }

  /**
   * Publish policy and assign to users/roles/business units
   */
  async publish(
    id: string,
    userId: string,
    assignToUserIds?: string[],
    assignToRoleIds?: string[],
    assignToBusinessUnitIds?: string[],
    notificationMessage?: string,
  ): Promise<Policy> {
    const policy = await this.findOne(id);

    if (policy.status !== PolicyStatus.APPROVED && policy.status !== PolicyStatus.IN_REVIEW) {
      throw new Error('Policy must be approved or in review before publishing');
    }

    // Update policy status
    policy.status = PolicyStatus.PUBLISHED;
    policy.published_date = new Date();
    await this.policyRepository.save(policy);

    // Get all users to assign to
    const userIdsToNotify: string[] = [];

    // Add specific users
    if (assignToUserIds && assignToUserIds.length > 0) {
      userIdsToNotify.push(...assignToUserIds);
      
      // Create assignments for specific users
      for (const userId of assignToUserIds) {
        await this.policyAssignmentRepository.save({
          policy_id: id,
          user_id: userId,
          assigned_by: userId,
          assigned_at: new Date(),
        });
      }
    }

    // Add users by role
    if (assignToRoleIds && assignToRoleIds.length > 0) {
      const usersByRole = await this.userRepository.find({
        where: { role: In(assignToRoleIds as UserRole[]) },
      });
      
      const roleUserIds = usersByRole.map((u) => u.id);
      userIdsToNotify.push(...roleUserIds);

      // Create assignments for roles
      for (const role of assignToRoleIds) {
        await this.policyAssignmentRepository.save({
          policy_id: id,
          role,
          assigned_by: userId,
          assigned_at: new Date(),
        });
      }
    }

    // Add users by business unit
    if (assignToBusinessUnitIds && assignToBusinessUnitIds.length > 0) {
      const usersByBU = await this.userRepository.find({
        where: { 
          // Assuming users have business_unit_id field - adjust based on actual schema
          // For now, we'll create assignments and let the frontend handle user lookup
        },
      });

      // Create assignments for business units
      for (const buId of assignToBusinessUnitIds) {
        await this.policyAssignmentRepository.save({
          policy_id: id,
          business_unit_id: buId,
          assigned_by: userId,
          assigned_at: new Date(),
        });
      }

      // If users have business_unit_id, add them to notify list
      // This would require checking the actual User entity structure
    }

    // Send notifications
    if (this.notificationService && userIdsToNotify.length > 0) {
      const uniqueUserIds = [...new Set(userIdsToNotify)];
      
      for (const notifyUserId of uniqueUserIds) {
        try {
          await this.notificationService.create({
            userId: notifyUserId,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.HIGH,
            title: 'New Policy Published',
            message: notificationMessage || `Policy "${policy.title}" has been published and assigned to you.`,
            entityType: 'policy',
            entityId: id,
            actionUrl: `/dashboard/governance/policies/${id}`,
          });

          // Update assignment notification status
          const assignments = await this.policyAssignmentRepository.find({
            where: { policy_id: id, user_id: notifyUserId },
          });
          
          for (const assignment of assignments) {
            assignment.notification_sent = true;
            assignment.notification_sent_at = new Date();
            await this.policyAssignmentRepository.save(assignment);
          }
        } catch (error) {
          this.logger.error(`Failed to send notification to user ${notifyUserId}: ${error.message}`, error.stack);
        }
      }
    }

    // Trigger workflows on publish
    if (this.workflowService) {
      try {
        await this.workflowService.checkAndTriggerWorkflows(
          EntityType.POLICY,
          policy.id,
          WorkflowTrigger.ON_STATUS_CHANGE,
          {
            status: policy.status,
            oldStatus: PolicyStatus.APPROVED,
            policy_type: policy.policy_type,
          },
          true,
        );
      } catch (error) {
        this.logger.error(`Failed to trigger workflows on policy publish: ${error.message}`, error.stack);
      }
    }

    return policy;
  }

  /**
   * Get assigned policies for a user
   */
  async getAssignedPolicies(userId: string, role?: string, businessUnitId?: string) {
    const assignments = await this.policyAssignmentRepository.find({
      where: [
        { user_id: userId },
        ...(role ? [{ role }] : []),
        ...(businessUnitId ? [{ business_unit_id: businessUnitId }] : []),
      ],
      relations: ['policy', 'policy.owner'],
      order: { assigned_at: 'DESC' },
    });

    return assignments.map((a) => a.policy).filter((p) => p.status === PolicyStatus.PUBLISHED);
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
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      startOfYear.setHours(0, 0, 0, 0);

      const [totalPublished, publishedThisMonth, publishedThisYear, assignments, acknowledged] = await Promise.all([
        this.policyRepository.count({ where: { status: PolicyStatus.PUBLISHED } }),
        this.policyRepository
          .createQueryBuilder('policy')
          .where('policy.status = :status', { status: PolicyStatus.PUBLISHED })
          .andWhere('policy.published_date IS NOT NULL')
          .andWhere('policy.published_date >= :startOfMonth', { startOfMonth: startOfMonth.toISOString().split('T')[0] })
          .getCount(),
        this.policyRepository
          .createQueryBuilder('policy')
          .where('policy.status = :status', { status: PolicyStatus.PUBLISHED })
          .andWhere('policy.published_date IS NOT NULL')
          .andWhere('policy.published_date >= :startOfYear', { startOfYear: startOfYear.toISOString().split('T')[0] })
          .getCount(),
        this.policyAssignmentRepository.count().catch(() => 0),
        this.policyAssignmentRepository.count({ where: { acknowledged: true } }).catch(() => 0),
      ]);

      const acknowledgmentRate = assignments > 0 ? Math.round((acknowledged / assignments) * 100) : 0;

      return {
        totalPublished: totalPublished || 0,
        publishedThisMonth: publishedThisMonth || 0,
        publishedThisYear: publishedThisYear || 0,
        assignmentsCount: assignments || 0,
        acknowledgedCount: acknowledged || 0,
        acknowledgmentRate,
      };
    } catch (error) {
      this.logger.error('Error getting publication statistics', error);
      // Return default values on error
      return {
        totalPublished: 0,
        publishedThisMonth: 0,
        publishedThisYear: 0,
        assignmentsCount: 0,
        acknowledgedCount: 0,
        acknowledgmentRate: 0,
      };
    }
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

  /**
   * Get pending reviews for policies
   */
  async getPendingReviews(daysAhead: number = 90): Promise<Policy[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysAhead);

    return this.policyRepository
      .createQueryBuilder('policy')
      .where('policy.next_review_date IS NOT NULL')
      .andWhere('policy.next_review_date >= :today', { today })
      .andWhere('policy.next_review_date <= :futureDate', { futureDate })
      .andWhere('policy.status != :archived', { archived: PolicyStatus.ARCHIVED })
      .orderBy('policy.next_review_date', 'ASC')
      .getMany();
  }

  /**
   * Get policies due for review (within specified days)
   */
  async getPoliciesDueForReview(days: number = 0): Promise<Policy[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + days);

    return this.policyRepository
      .createQueryBuilder('policy')
      .where('policy.next_review_date IS NOT NULL')
      .andWhere('policy.next_review_date <= :targetDate', { targetDate })
      .andWhere('policy.status != :archived', { archived: PolicyStatus.ARCHIVED })
      .orderBy('policy.next_review_date', 'ASC')
      .getMany();
  }

  /**
   * Initiate a policy review
   */
  async initiateReview(policyId: string, reviewDate: Date, initiatedBy: string): Promise<PolicyReview> {
    const policy = await this.findOne(policyId);

    if (!policy.next_review_date) {
      throw new Error('Policy does not have a scheduled review date');
    }

    const review = this.policyReviewRepository.create({
      policy_id: policyId,
      review_date: reviewDate,
      status: ReviewStatus.PENDING,
      initiated_by: initiatedBy,
    });

    return this.policyReviewRepository.save(review);
  }

  /**
   * Complete a policy review
   */
  async completeReview(
    reviewId: string,
    outcome: ReviewOutcome,
    reviewerId: string,
    notes?: string,
    reviewSummary?: string,
    recommendedChanges?: string,
    nextReviewDate?: Date,
  ): Promise<PolicyReview> {
    const review = await this.policyReviewRepository.findOne({
      where: { id: reviewId },
      relations: ['policy'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    review.status = ReviewStatus.COMPLETED;
    review.outcome = outcome;
    review.reviewer_id = reviewerId;
    review.notes = notes || null;
    review.review_summary = reviewSummary || null;
    review.recommended_changes = recommendedChanges || null;
    review.completed_at = new Date();

    // Update policy's next review date if provided
    if (nextReviewDate && review.policy) {
      review.policy.next_review_date = nextReviewDate;
      await this.policyRepository.save(review.policy);
    }

    // If outcome is approved or no changes, update next review date based on frequency
    if ((outcome === ReviewOutcome.APPROVED || outcome === ReviewOutcome.NO_CHANGES) && !nextReviewDate && review.policy) {
      const nextDate = this.calculateNextReviewDate(review.policy.review_frequency, new Date());
      review.policy.next_review_date = nextDate;
      review.next_review_date = nextDate;
      await this.policyRepository.save(review.policy);
    } else if (nextReviewDate) {
      review.next_review_date = nextReviewDate;
    }

    return this.policyReviewRepository.save(review);
  }

  /**
   * Get review history for a policy
   */
  async getReviewHistory(policyId: string): Promise<PolicyReview[]> {
    return this.policyReviewRepository.find({
      where: { policy_id: policyId },
      relations: ['reviewer', 'initiator', 'policy'],
      order: { review_date: 'DESC' },
    });
  }

  /**
   * Get active review for a policy
   */
  async getActiveReview(policyId: string): Promise<PolicyReview | null> {
    return this.policyReviewRepository.findOne({
      where: {
        policy_id: policyId,
        status: In([ReviewStatus.PENDING, ReviewStatus.IN_PROGRESS]),
      },
      relations: ['reviewer', 'initiator'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Calculate next review date based on review frequency
   */
  private calculateNextReviewDate(frequency: string, fromDate: Date): Date {
    const nextDate = new Date(fromDate);
    switch (frequency) {
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'annual':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      case 'biennial':
        nextDate.setFullYear(nextDate.getFullYear() + 2);
        break;
      case 'triennial':
        nextDate.setFullYear(nextDate.getFullYear() + 3);
        break;
      default:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
    return nextDate;
  }

  /**
   * Get review statistics
   */
  async getReviewStatistics(): Promise<{
    pending: number;
    overdue: number;
    dueIn30Days: number;
    dueIn60Days: number;
    dueIn90Days: number;
  }> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];

      const [pending, overdue, dueIn30Days, dueIn60Days, dueIn90Days] = await Promise.all([
        this.policyReviewRepository.count({
          where: { status: ReviewStatus.PENDING },
        }).catch(() => 0),
        this.policyRepository
          .createQueryBuilder('policy')
          .where('policy.next_review_date IS NOT NULL')
          .andWhere('policy.next_review_date < :today', { today: todayStr })
          .andWhere('policy.status != :archived', { archived: PolicyStatus.ARCHIVED })
          .getCount()
          .catch(() => 0),
        this.getPoliciesDueForReview(30).then((policies) => policies?.length || 0).catch(() => 0),
        this.getPoliciesDueForReview(60).then((policies) => policies?.length || 0).catch(() => 0),
        this.getPoliciesDueForReview(90).then((policies) => policies?.length || 0).catch(() => 0),
      ]);

      return {
        pending: pending || 0,
        overdue: overdue || 0,
        dueIn30Days: dueIn30Days || 0,
        dueIn60Days: dueIn60Days || 0,
        dueIn90Days: dueIn90Days || 0,
      };
    } catch (error) {
      this.logger.error('Error getting review statistics', error);
      // Return default values on error
      return {
        pending: 0,
        overdue: 0,
        dueIn30Days: 0,
        dueIn60Days: 0,
        dueIn90Days: 0,
      };
    }
  }

  // ==================== POLICY HIERARCHY SUPPORT (Story 2.1) ====================

  /**
   * Set or update parent policy (creates hierarchy relationship)
   */
  async setParentPolicy(
    policyId: string,
    parentPolicyId: string | null,
    userId: string,
    reason?: string,
  ): Promise<Policy> {
    const policy = await this.findOne(policyId);

    // Prevent circular hierarchy
    if (parentPolicyId && parentPolicyId === policyId) {
      throw new Error('A policy cannot be its own parent');
    }

    // Check for circular references
    if (parentPolicyId) {
      const parentPolicy = await this.findOne(parentPolicyId);
      if (!parentPolicy) {
        throw new NotFoundException(`Parent policy with ID ${parentPolicyId} not found`);
      }

      // Verify no circular dependency
      if (await this.isDescendantOf(parentPolicyId, policyId)) {
        throw new Error('Setting this parent would create a circular hierarchy');
      }
    }

    policy.parent_policy_id = parentPolicyId || null;
    policy.updated_by = userId;

    const savedPolicy = await this.policyRepository.save(policy);

    // Log hierarchy change
    this.logger.log(
      `Policy hierarchy changed for ${policyId}: parent set to ${parentPolicyId}${reason ? ` (${reason})` : ''}`,
    );

    return savedPolicy;
  }

  /**
   * Check if policy A is a descendant of policy B
   * Used to prevent circular hierarchies
   */
  async isDescendantOf(ancestorId: string, potentialDescendantId: string): Promise<boolean> {
    const descendants = await this.getAllDescendants(ancestorId);
    return descendants.some((d) => d.id === potentialDescendantId);
  }

  /**
   * Get parent policy
   */
  async getParent(policyId: string): Promise<Policy | null> {
    const policy = await this.findOne(policyId);

    if (!policy.parent_policy_id) {
      return null;
    }

    return this.findOne(policy.parent_policy_id);
  }

  /**
   * Get immediate child policies
   */
  async getChildren(policyId: string, includeArchived: boolean = false): Promise<Policy[]> {
    const query = this.policyRepository
      .createQueryBuilder('policy')
      .where('policy.parent_policy_id = :policyId', { policyId });

    if (!includeArchived) {
      query.andWhere('policy.status != :archived', { archived: PolicyStatus.ARCHIVED });
    }

    return query.orderBy('policy.created_at', 'ASC').getMany();
  }

  /**
   * Get all ancestor policies (from immediate parent up to root)
   */
  async getAncestors(policyId: string): Promise<Policy[]> {
    const ancestors: Policy[] = [];
    let currentPolicy = await this.findOne(policyId);

    while (currentPolicy.parent_policy_id) {
      const parent = await this.findOne(currentPolicy.parent_policy_id);
      ancestors.unshift(parent); // Add to beginning to maintain order
      currentPolicy = parent;
    }

    return ancestors;
  }

  /**
   * Get all descendants (recursive - children, grandchildren, etc.)
   */
  async getAllDescendants(policyId: string): Promise<Policy[]> {
    const descendants: Policy[] = [];

    const children = await this.getChildren(policyId);

    for (const child of children) {
      descendants.push(child);
      const grandChildren = await this.getAllDescendants(child.id);
      descendants.push(...grandChildren);
    }

    return descendants;
  }

  /**
   * Get root policy of hierarchy (policy with no parent)
   */
  async getRoot(policyId: string): Promise<Policy> {
    const ancestors = await this.getAncestors(policyId);
    return ancestors.length > 0 ? ancestors[0] : this.findOne(policyId);
  }

  /**
   * Get complete policy hierarchy with tree structure
   */
  async getHierarchyTree(policyId: string, includeArchived: boolean = false): Promise<any> {
    const policy = await this.findOne(policyId);
    return this.buildHierarchyTree(policy, includeArchived);
  }

  /**
   * Build hierarchy tree recursively
   */
  private async buildHierarchyTree(policy: Policy, includeArchived: boolean): Promise<any> {
    const children = await this.getChildren(policy.id, includeArchived);

    return {
      id: policy.id,
      title: policy.title,
      policy_type: policy.policy_type,
      status: policy.status,
      version: policy.version,
      parent_policy_id: policy.parent_policy_id,
      created_at: policy.created_at,
      children: await Promise.all(
        children.map((child) => this.buildHierarchyTree(child, includeArchived)),
      ),
    };
  }

  /**
   * Get root policies (policies with no parents)
   */
  async getRootPolicies(includeArchived: boolean = false): Promise<Policy[]> {
    const query = this.policyRepository
      .createQueryBuilder('policy')
      .where('policy.parent_policy_id IS NULL');

    if (!includeArchived) {
      query.andWhere('policy.status != :archived', { archived: PolicyStatus.ARCHIVED });
    }

    return query.orderBy('policy.created_at', 'ASC').getMany();
  }

  /**
   * Get complete hierarchy (all root policies with their trees)
   */
  async getAllHierarchies(includeArchived: boolean = false): Promise<any[]> {
    const rootPolicies = await this.getRootPolicies(includeArchived);
    return Promise.all(
      rootPolicies.map((policy) => this.buildHierarchyTree(policy, includeArchived)),
    );
  }

  /**
   * Get hierarchy level of a policy (0 for root, 1 for children of root, etc.)
   */
  async getHierarchyLevel(policyId: string): Promise<number> {
    const ancestors = await this.getAncestors(policyId);
    return ancestors.length;
  }

  /**
   * Get complete policy hierarchy information (ancestors, descendants, level)
   */
  async getCompleteHierarchy(policyId: string): Promise<any> {
    const policy = await this.findOne(policyId);
    const ancestors = await this.getAncestors(policyId);
    const children = await this.getChildren(policyId);
    const allDescendants = await this.getAllDescendants(policyId);
    const level = ancestors.length;
    const maxDepth = await this.getMaxDepth(policyId);

    return {
      id: policy.id,
      title: policy.title,
      policy_type: policy.policy_type,
      status: policy.status,
      version: policy.version,
      parent_policy_id: policy.parent_policy_id,
      level,
      isRoot: ancestors.length === 0,
      hasChildren: children.length > 0,
      ancestors: ancestors.map((a) => ({
        id: a.id,
        title: a.title,
        level: ancestors.indexOf(a),
      })),
      children: children.map((c) => ({
        id: c.id,
        title: c.title,
        policy_type: c.policy_type,
        status: c.status,
      })),
      descendants: allDescendants.map((d) => ({
        id: d.id,
        title: d.title,
        depth: 1, // Simplified: direct descendants are depth 1
      })),
      descendantCount: allDescendants.length,
      maxDepth,
    };
  }

  /**
   * Get maximum depth of descendants
   */
  async getMaxDepth(policyId: string, currentDepth: number = 0): Promise<number> {
    const children = await this.getChildren(policyId);

    if (children.length === 0) {
      return currentDepth;
    }

    const childDepths = await Promise.all(
      children.map((child) => this.getMaxDepth(child.id, currentDepth + 1)),
    );

    return Math.max(...childDepths, currentDepth);
  }
}

