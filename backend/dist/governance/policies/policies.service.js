"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PoliciesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliciesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const policy_entity_1 = require("./entities/policy.entity");
const policy_assignment_entity_1 = require("./entities/policy-assignment.entity");
const policy_review_entity_1 = require("./entities/policy-review.entity");
const policy_approval_entity_1 = require("./entities/policy-approval.entity");
const policy_version_entity_1 = require("./entities/policy-version.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const business_unit_entity_1 = require("../../common/entities/business-unit.entity");
const workflow_service_1 = require("../../workflow/services/workflow.service");
const workflow_entity_1 = require("../../workflow/entities/workflow.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
const workflow_execution_entity_1 = require("../../workflow/entities/workflow-execution.entity");
const policy_approval_service_1 = require("./services/policy-approval.service");
const policy_version_service_1 = require("./services/policy-version.service");
let PoliciesService = PoliciesService_1 = class PoliciesService {
    constructor(policyRepository, workflowExecutionRepository, policyAssignmentRepository, policyApprovalRepository, policyVersionRepository, userRepository, businessUnitRepository, policyReviewRepository, workflowService, notificationService, policyApprovalService, policyVersionService) {
        this.policyRepository = policyRepository;
        this.workflowExecutionRepository = workflowExecutionRepository;
        this.policyAssignmentRepository = policyAssignmentRepository;
        this.policyApprovalRepository = policyApprovalRepository;
        this.policyVersionRepository = policyVersionRepository;
        this.userRepository = userRepository;
        this.businessUnitRepository = businessUnitRepository;
        this.policyReviewRepository = policyReviewRepository;
        this.workflowService = workflowService;
        this.notificationService = notificationService;
        this.policyApprovalService = policyApprovalService;
        this.policyVersionService = policyVersionService;
        this.logger = new common_1.Logger(PoliciesService_1.name);
    }
    async create(createPolicyDto, userId) {
        const policy = this.policyRepository.create(Object.assign(Object.assign({}, createPolicyDto), { created_by: userId }));
        const savedPolicy = await this.policyRepository.save(policy);
        if (this.workflowService) {
            try {
                await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.POLICY, savedPolicy.id, workflow_entity_1.WorkflowTrigger.ON_CREATE, {
                    status: savedPolicy.status,
                    policy_type: savedPolicy.policy_type,
                }, true);
            }
            catch (error) {
                this.logger.error(`Failed to trigger workflows on policy creation: ${error.message}`, error.stack);
            }
        }
        if (this.notificationService && savedPolicy.owner_id) {
            try {
                await this.notificationService.create({
                    userId: savedPolicy.owner_id,
                    type: notification_entity_1.NotificationType.GENERAL,
                    priority: notification_entity_1.NotificationPriority.MEDIUM,
                    title: 'New Policy Created',
                    message: `Policy "${savedPolicy.title}" has been created and is now in ${savedPolicy.status} status.`,
                    entityType: 'policy',
                    entityId: savedPolicy.id,
                    actionUrl: `/dashboard/governance/policies/${savedPolicy.id}`,
                });
            }
            catch (error) {
                this.logger.error(`Failed to send notification on policy creation: ${error.message}`, error.stack);
            }
        }
        return savedPolicy;
    }
    async findAll(queryDto) {
        const { page = 1, limit = 25, status, policy_type, owner_id, search, sort } = queryDto;
        const skip = (page - 1) * limit;
        const where = {};
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
            queryBuilder.andWhere('(policy.title ILIKE :search OR policy.content ILIKE :search)', { search: `%${search}%` });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`policy.${field}`, order.toUpperCase());
        }
        else {
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
    async findOne(id) {
        const policy = await this.policyRepository.findOne({
            where: { id },
            relations: ['owner', 'creator', 'updater', 'control_objectives', 'supersedes_policy'],
        });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${id} not found`);
        }
        return policy;
    }
    async getWorkflowExecutions(policyId) {
        if (!this.workflowService) {
            return [];
        }
        const executions = await this.workflowExecutionRepository.find({
            where: {
                entityType: workflow_entity_1.EntityType.POLICY,
                entityId: policyId,
            },
            relations: ['workflow', 'assignedTo'],
            order: { createdAt: 'DESC' },
        });
        const executionsWithApprovals = await Promise.all(executions.map(async (execution) => {
            var _a, _b, _c, _d;
            const approvals = await this.workflowService.getApprovals(execution.id);
            return {
                id: execution.id,
                workflowId: execution.workflowId,
                workflowName: ((_a = execution.workflow) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                workflowType: ((_b = execution.workflow) === null || _b === void 0 ? void 0 : _b.type) || null,
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
                startedAt: (_c = execution.startedAt) === null || _c === void 0 ? void 0 : _c.toISOString(),
                completedAt: (_d = execution.completedAt) === null || _d === void 0 ? void 0 : _d.toISOString(),
                createdAt: execution.createdAt.toISOString(),
                approvals,
            };
        }));
        return executionsWithApprovals;
    }
    async getPendingApprovals(policyId, userId) {
        if (!this.workflowService) {
            return [];
        }
        const executions = await this.workflowExecutionRepository.find({
            where: {
                entityType: workflow_entity_1.EntityType.POLICY,
                entityId: policyId,
                status: 'in_progress',
            },
            relations: ['workflow'],
        });
        const allApprovals = [];
        for (const execution of executions) {
            const approvals = await this.workflowService.getApprovals(execution.id);
            const pendingApprovals = approvals.filter((a) => a.status === 'pending' && a.approverId === userId);
            allApprovals.push(...pendingApprovals.map((a) => {
                var _a;
                return (Object.assign(Object.assign({}, a), { workflowExecutionId: execution.id, workflowName: ((_a = execution.workflow) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown' }));
            }));
        }
        return allApprovals;
    }
    async publish(id, userId, assignToUserIds, assignToRoleIds, assignToBusinessUnitIds, notificationMessage) {
        const policy = await this.findOne(id);
        if (policy.status !== policy_entity_1.PolicyStatus.APPROVED && policy.status !== policy_entity_1.PolicyStatus.IN_REVIEW) {
            throw new Error('Policy must be approved or in review before publishing');
        }
        policy.status = policy_entity_1.PolicyStatus.PUBLISHED;
        policy.published_date = new Date();
        await this.policyRepository.save(policy);
        const userIdsToNotify = [];
        if (assignToUserIds && assignToUserIds.length > 0) {
            userIdsToNotify.push(...assignToUserIds);
            for (const userId of assignToUserIds) {
                await this.policyAssignmentRepository.save({
                    policy_id: id,
                    user_id: userId,
                    assigned_by: userId,
                    assigned_at: new Date(),
                });
            }
        }
        if (assignToRoleIds && assignToRoleIds.length > 0) {
            const usersByRole = await this.userRepository.find({
                where: { role: (0, typeorm_2.In)(assignToRoleIds) },
            });
            const roleUserIds = usersByRole.map((u) => u.id);
            userIdsToNotify.push(...roleUserIds);
            for (const role of assignToRoleIds) {
                await this.policyAssignmentRepository.save({
                    policy_id: id,
                    role,
                    assigned_by: userId,
                    assigned_at: new Date(),
                });
            }
        }
        if (assignToBusinessUnitIds && assignToBusinessUnitIds.length > 0) {
            const usersByBU = await this.userRepository.find({
                where: {},
            });
            for (const buId of assignToBusinessUnitIds) {
                await this.policyAssignmentRepository.save({
                    policy_id: id,
                    business_unit_id: buId,
                    assigned_by: userId,
                    assigned_at: new Date(),
                });
            }
        }
        if (this.notificationService && userIdsToNotify.length > 0) {
            const uniqueUserIds = [...new Set(userIdsToNotify)];
            for (const notifyUserId of uniqueUserIds) {
                try {
                    await this.notificationService.create({
                        userId: notifyUserId,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.HIGH,
                        title: 'New Policy Published',
                        message: notificationMessage || `Policy "${policy.title}" has been published and assigned to you.`,
                        entityType: 'policy',
                        entityId: id,
                        actionUrl: `/dashboard/governance/policies/${id}`,
                    });
                    const assignments = await this.policyAssignmentRepository.find({
                        where: { policy_id: id, user_id: notifyUserId },
                    });
                    for (const assignment of assignments) {
                        assignment.notification_sent = true;
                        assignment.notification_sent_at = new Date();
                        await this.policyAssignmentRepository.save(assignment);
                    }
                }
                catch (error) {
                    this.logger.error(`Failed to send notification to user ${notifyUserId}: ${error.message}`, error.stack);
                }
            }
        }
        if (this.workflowService) {
            try {
                await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.POLICY, policy.id, workflow_entity_1.WorkflowTrigger.ON_STATUS_CHANGE, {
                    status: policy.status,
                    oldStatus: policy_entity_1.PolicyStatus.APPROVED,
                    policy_type: policy.policy_type,
                }, true);
            }
            catch (error) {
                this.logger.error(`Failed to trigger workflows on policy publish: ${error.message}`, error.stack);
            }
        }
        return policy;
    }
    async getAssignedPolicies(userId, role, businessUnitId) {
        const assignments = await this.policyAssignmentRepository.find({
            where: [
                { user_id: userId },
                ...(role ? [{ role }] : []),
                ...(businessUnitId ? [{ business_unit_id: businessUnitId }] : []),
            ],
            relations: ['policy', 'policy.owner'],
            order: { assigned_at: 'DESC' },
        });
        return assignments.map((a) => a.policy).filter((p) => p.status === policy_entity_1.PolicyStatus.PUBLISHED);
    }
    async getPublicationStatistics() {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            startOfYear.setHours(0, 0, 0, 0);
            const [totalPublished, publishedThisMonth, publishedThisYear, assignments, acknowledged] = await Promise.all([
                this.policyRepository.count({ where: { status: policy_entity_1.PolicyStatus.PUBLISHED } }),
                this.policyRepository
                    .createQueryBuilder('policy')
                    .where('policy.status = :status', { status: policy_entity_1.PolicyStatus.PUBLISHED })
                    .andWhere('policy.published_date IS NOT NULL')
                    .andWhere('policy.published_date >= :startOfMonth', { startOfMonth: startOfMonth.toISOString().split('T')[0] })
                    .getCount(),
                this.policyRepository
                    .createQueryBuilder('policy')
                    .where('policy.status = :status', { status: policy_entity_1.PolicyStatus.PUBLISHED })
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
        }
        catch (error) {
            this.logger.error('Error getting publication statistics', error);
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
    async update(id, updatePolicyDto, userId) {
        var _a;
        const policy = await this.findOne(id);
        const oldStatus = policy.status;
        Object.assign(policy, Object.assign(Object.assign({}, updatePolicyDto), { updated_by: userId }));
        const savedPolicy = await this.policyRepository.save(policy);
        if (this.workflowService && oldStatus !== savedPolicy.status) {
            try {
                await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.POLICY, savedPolicy.id, workflow_entity_1.WorkflowTrigger.ON_STATUS_CHANGE, {
                    status: savedPolicy.status,
                    oldStatus,
                    policy_type: savedPolicy.policy_type,
                }, true);
                this.logger.log(`Triggered workflows for policy ${id} status change: ${oldStatus} → ${savedPolicy.status}`);
            }
            catch (error) {
                this.logger.error(`Failed to trigger workflows on policy status change: ${error.message}`, error.stack);
            }
        }
        if (this.notificationService && oldStatus !== savedPolicy.status) {
            try {
                const statusMessages = {
                    [policy_entity_1.PolicyStatus.DRAFT]: {
                        title: 'Policy Status Changed',
                        message: `Policy "${savedPolicy.title}" has been moved to Draft status.`,
                        priority: notification_entity_1.NotificationPriority.LOW,
                    },
                    [policy_entity_1.PolicyStatus.IN_REVIEW]: {
                        title: 'Policy Review Required',
                        message: `Policy "${savedPolicy.title}" is now in Review and requires your attention.`,
                        priority: notification_entity_1.NotificationPriority.HIGH,
                    },
                    [policy_entity_1.PolicyStatus.APPROVED]: {
                        title: 'Policy Approved',
                        message: `Policy "${savedPolicy.title}" has been approved and is ready for publication.`,
                        priority: notification_entity_1.NotificationPriority.MEDIUM,
                    },
                    [policy_entity_1.PolicyStatus.PUBLISHED]: {
                        title: 'Policy Published',
                        message: `Policy "${savedPolicy.title}" has been published and is now active.`,
                        priority: notification_entity_1.NotificationPriority.HIGH,
                    },
                    [policy_entity_1.PolicyStatus.ARCHIVED]: {
                        title: 'Policy Archived',
                        message: `Policy "${savedPolicy.title}" has been archived.`,
                        priority: notification_entity_1.NotificationPriority.LOW,
                    },
                };
                const notificationConfig = statusMessages[savedPolicy.status];
                if (notificationConfig) {
                    if (savedPolicy.owner_id) {
                        await this.notificationService.create({
                            userId: savedPolicy.owner_id,
                            type: savedPolicy.status === policy_entity_1.PolicyStatus.IN_REVIEW
                                ? notification_entity_1.NotificationType.POLICY_REVIEW_REQUIRED
                                : notification_entity_1.NotificationType.GENERAL,
                            priority: notificationConfig.priority,
                            title: notificationConfig.title,
                            message: notificationConfig.message,
                            entityType: 'policy',
                            entityId: savedPolicy.id,
                            actionUrl: `/dashboard/governance/policies/${savedPolicy.id}`,
                        });
                    }
                    if (savedPolicy.status === policy_entity_1.PolicyStatus.PUBLISHED && ((_a = savedPolicy.business_units) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        this.logger.log(`Policy ${savedPolicy.id} published - should notify business units: ${savedPolicy.business_units.join(', ')}`);
                    }
                }
            }
            catch (error) {
                this.logger.error(`Failed to send notification on policy status change: ${error.message}`, error.stack);
            }
        }
        if (this.workflowService) {
            try {
                await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.POLICY, savedPolicy.id, workflow_entity_1.WorkflowTrigger.ON_UPDATE, {
                    status: savedPolicy.status,
                    policy_type: savedPolicy.policy_type,
                }, true);
            }
            catch (error) {
                this.logger.error(`Failed to trigger ON_UPDATE workflows: ${error.message}`, error.stack);
            }
        }
        return savedPolicy;
    }
    async remove(id) {
        const policy = await this.findOne(id);
        await this.policyRepository.softRemove(policy);
    }
    async findVersions(id) {
        const currentPolicy = await this.findOne(id);
        const versions = await this.policyRepository.find({
            where: { title: currentPolicy.title },
            relations: ['owner', 'creator', 'updater'],
            order: { version_number: 'ASC' },
        });
        return versions;
    }
    async getPendingReviews(daysAhead = 90) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + daysAhead);
        return this.policyRepository
            .createQueryBuilder('policy')
            .where('policy.next_review_date IS NOT NULL')
            .andWhere('policy.next_review_date >= :today', { today })
            .andWhere('policy.next_review_date <= :futureDate', { futureDate })
            .andWhere('policy.status != :archived', { archived: policy_entity_1.PolicyStatus.ARCHIVED })
            .orderBy('policy.next_review_date', 'ASC')
            .getMany();
    }
    async getPoliciesDueForReview(days = 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + days);
        return this.policyRepository
            .createQueryBuilder('policy')
            .where('policy.next_review_date IS NOT NULL')
            .andWhere('policy.next_review_date <= :targetDate', { targetDate })
            .andWhere('policy.status != :archived', { archived: policy_entity_1.PolicyStatus.ARCHIVED })
            .orderBy('policy.next_review_date', 'ASC')
            .getMany();
    }
    async initiateReview(policyId, reviewDate, initiatedBy) {
        const policy = await this.findOne(policyId);
        if (!policy.next_review_date) {
            throw new Error('Policy does not have a scheduled review date');
        }
        const review = this.policyReviewRepository.create({
            policy_id: policyId,
            review_date: reviewDate,
            status: policy_review_entity_1.ReviewStatus.PENDING,
            initiated_by: initiatedBy,
        });
        return this.policyReviewRepository.save(review);
    }
    async completeReview(reviewId, outcome, reviewerId, notes, reviewSummary, recommendedChanges, nextReviewDate) {
        const review = await this.policyReviewRepository.findOne({
            where: { id: reviewId },
            relations: ['policy'],
        });
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID ${reviewId} not found`);
        }
        review.status = policy_review_entity_1.ReviewStatus.COMPLETED;
        review.outcome = outcome;
        review.reviewer_id = reviewerId;
        review.notes = notes || null;
        review.review_summary = reviewSummary || null;
        review.recommended_changes = recommendedChanges || null;
        review.completed_at = new Date();
        if (nextReviewDate && review.policy) {
            review.policy.next_review_date = nextReviewDate;
            await this.policyRepository.save(review.policy);
        }
        if ((outcome === policy_review_entity_1.ReviewOutcome.APPROVED || outcome === policy_review_entity_1.ReviewOutcome.NO_CHANGES) && !nextReviewDate && review.policy) {
            const nextDate = this.calculateNextReviewDate(review.policy.review_frequency, new Date());
            review.policy.next_review_date = nextDate;
            review.next_review_date = nextDate;
            await this.policyRepository.save(review.policy);
        }
        else if (nextReviewDate) {
            review.next_review_date = nextReviewDate;
        }
        return this.policyReviewRepository.save(review);
    }
    async getReviewHistory(policyId) {
        return this.policyReviewRepository.find({
            where: { policy_id: policyId },
            relations: ['reviewer', 'initiator', 'policy'],
            order: { review_date: 'DESC' },
        });
    }
    async getActiveReview(policyId) {
        return this.policyReviewRepository.findOne({
            where: {
                policy_id: policyId,
                status: (0, typeorm_2.In)([policy_review_entity_1.ReviewStatus.PENDING, policy_review_entity_1.ReviewStatus.IN_PROGRESS]),
            },
            relations: ['reviewer', 'initiator'],
            order: { created_at: 'DESC' },
        });
    }
    calculateNextReviewDate(frequency, fromDate) {
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
    async getReviewStatistics() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayStr = today.toISOString().split('T')[0];
            const [pending, overdue, dueIn30Days, dueIn60Days, dueIn90Days] = await Promise.all([
                this.policyReviewRepository.count({
                    where: { status: policy_review_entity_1.ReviewStatus.PENDING },
                }).catch(() => 0),
                this.policyRepository
                    .createQueryBuilder('policy')
                    .where('policy.next_review_date IS NOT NULL')
                    .andWhere('policy.next_review_date < :today', { today: todayStr })
                    .andWhere('policy.status != :archived', { archived: policy_entity_1.PolicyStatus.ARCHIVED })
                    .getCount()
                    .catch(() => 0),
                this.getPoliciesDueForReview(30).then((policies) => (policies === null || policies === void 0 ? void 0 : policies.length) || 0).catch(() => 0),
                this.getPoliciesDueForReview(60).then((policies) => (policies === null || policies === void 0 ? void 0 : policies.length) || 0).catch(() => 0),
                this.getPoliciesDueForReview(90).then((policies) => (policies === null || policies === void 0 ? void 0 : policies.length) || 0).catch(() => 0),
            ]);
            return {
                pending: pending || 0,
                overdue: overdue || 0,
                dueIn30Days: dueIn30Days || 0,
                dueIn60Days: dueIn60Days || 0,
                dueIn90Days: dueIn90Days || 0,
            };
        }
        catch (error) {
            this.logger.error('Error getting review statistics', error);
            return {
                pending: 0,
                overdue: 0,
                dueIn30Days: 0,
                dueIn60Days: 0,
                dueIn90Days: 0,
            };
        }
    }
    async setParentPolicy(policyId, parentPolicyId, userId, reason) {
        const policy = await this.findOne(policyId);
        if (parentPolicyId && parentPolicyId === policyId) {
            throw new Error('A policy cannot be its own parent');
        }
        if (parentPolicyId) {
            const parentPolicy = await this.findOne(parentPolicyId);
            if (!parentPolicy) {
                throw new common_1.NotFoundException(`Parent policy with ID ${parentPolicyId} not found`);
            }
            if (await this.isDescendantOf(parentPolicyId, policyId)) {
                throw new Error('Setting this parent would create a circular hierarchy');
            }
        }
        policy.parent_policy_id = parentPolicyId || null;
        policy.updated_by = userId;
        const savedPolicy = await this.policyRepository.save(policy);
        this.logger.log(`Policy hierarchy changed for ${policyId}: parent set to ${parentPolicyId}${reason ? ` (${reason})` : ''}`);
        return savedPolicy;
    }
    async isDescendantOf(ancestorId, potentialDescendantId) {
        const descendants = await this.getAllDescendants(ancestorId);
        return descendants.some((d) => d.id === potentialDescendantId);
    }
    async getParent(policyId) {
        const policy = await this.findOne(policyId);
        if (!policy.parent_policy_id) {
            return null;
        }
        return this.findOne(policy.parent_policy_id);
    }
    async getChildren(policyId, includeArchived = false) {
        const query = this.policyRepository
            .createQueryBuilder('policy')
            .where('policy.parent_policy_id = :policyId', { policyId });
        if (!includeArchived) {
            query.andWhere('policy.status != :archived', { archived: policy_entity_1.PolicyStatus.ARCHIVED });
        }
        return query.orderBy('policy.created_at', 'ASC').getMany();
    }
    async getAncestors(policyId) {
        const ancestors = [];
        let currentPolicy = await this.findOne(policyId);
        while (currentPolicy.parent_policy_id) {
            const parent = await this.findOne(currentPolicy.parent_policy_id);
            ancestors.unshift(parent);
            currentPolicy = parent;
        }
        return ancestors;
    }
    async getAllDescendants(policyId) {
        const descendants = [];
        const children = await this.getChildren(policyId);
        for (const child of children) {
            descendants.push(child);
            const grandChildren = await this.getAllDescendants(child.id);
            descendants.push(...grandChildren);
        }
        return descendants;
    }
    async getRoot(policyId) {
        const ancestors = await this.getAncestors(policyId);
        return ancestors.length > 0 ? ancestors[0] : this.findOne(policyId);
    }
    async getHierarchyTree(policyId, includeArchived = false) {
        const policy = await this.findOne(policyId);
        return this.buildHierarchyTree(policy, includeArchived);
    }
    async buildHierarchyTree(policy, includeArchived) {
        const children = await this.getChildren(policy.id, includeArchived);
        return {
            id: policy.id,
            title: policy.title,
            policy_type: policy.policy_type,
            status: policy.status,
            version: policy.version,
            parent_policy_id: policy.parent_policy_id,
            created_at: policy.created_at,
            children: await Promise.all(children.map((child) => this.buildHierarchyTree(child, includeArchived))),
        };
    }
    async getRootPolicies(includeArchived = false) {
        const query = this.policyRepository
            .createQueryBuilder('policy')
            .where('policy.parent_policy_id IS NULL');
        if (!includeArchived) {
            query.andWhere('policy.status != :archived', { archived: policy_entity_1.PolicyStatus.ARCHIVED });
        }
        return query.orderBy('policy.created_at', 'ASC').getMany();
    }
    async getAllHierarchies(includeArchived = false) {
        const rootPolicies = await this.getRootPolicies(includeArchived);
        return Promise.all(rootPolicies.map((policy) => this.buildHierarchyTree(policy, includeArchived)));
    }
    async getHierarchyLevel(policyId) {
        const ancestors = await this.getAncestors(policyId);
        return ancestors.length;
    }
    async getCompleteHierarchy(policyId) {
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
                depth: 1,
            })),
            descendantCount: allDescendants.length,
            maxDepth,
        };
    }
    async getMaxDepth(policyId, currentDepth = 0) {
        const children = await this.getChildren(policyId);
        if (children.length === 0) {
            return currentDepth;
        }
        const childDepths = await Promise.all(children.map((child) => this.getMaxDepth(child.id, currentDepth + 1)));
        return Math.max(...childDepths, currentDepth);
    }
    async createVersion(policyId, content, changeSummary, userId) {
        const policy = await this.findOne(policyId);
        const nextVersionNumber = (policy.version_number || 1) + 1;
        const nextVersion = `${Math.floor(nextVersionNumber / 10)}.${nextVersionNumber % 10}`;
        if (!this.policyVersionService) {
            throw new Error('PolicyVersionService is not available');
        }
        return this.policyVersionService.createVersion(policyId, content, nextVersion, nextVersionNumber, changeSummary, userId);
    }
    async getPolicyVersions(policyId) {
        if (!this.policyVersionService) {
            throw new Error('PolicyVersionService is not available');
        }
        return this.policyVersionService.getVersionsByPolicy(policyId);
    }
    async getLatestPolicyVersion(policyId) {
        if (!this.policyVersionService) {
            throw new Error('PolicyVersionService is not available');
        }
        return this.policyVersionService.getLatestVersion(policyId);
    }
    async comparePolicyVersions(versionId1, versionId2) {
        if (!this.policyVersionService) {
            throw new Error('PolicyVersionService is not available');
        }
        return this.policyVersionService.compareVersions(versionId1, versionId2);
    }
    async requestApprovals(policyId, approverIds) {
        if (!this.policyApprovalService) {
            throw new Error('PolicyApprovalService is not available');
        }
        const approvals = [];
        for (let i = 0; i < approverIds.length; i++) {
            const approval = await this.policyApprovalService.createApproval(policyId, approverIds[i], i + 1);
            approvals.push(approval);
            if (this.notificationService) {
                try {
                    const policy = await this.findOne(policyId);
                    await this.notificationService.create({
                        userId: approverIds[i],
                        type: notification_entity_1.NotificationType.WORKFLOW_APPROVAL_REQUIRED,
                        priority: notification_entity_1.NotificationPriority.HIGH,
                        title: 'Policy Approval Required',
                        message: `Policy "${policy.title}" requires your approval.`,
                        entityType: 'policy',
                        entityId: policyId,
                        actionUrl: `/dashboard/governance/policies/${policyId}/approvals`,
                    });
                }
                catch (error) {
                    this.logger.error(`Failed to send approval notification: ${error.message}`, error.stack);
                }
            }
        }
        return approvals;
    }
    async getPolicyApprovals(policyId) {
        if (!this.policyApprovalService) {
            throw new Error('PolicyApprovalService is not available');
        }
        return this.policyApprovalService.findApprovalsByPolicy(policyId);
    }
    async getPendingApprovalsForSystem() {
        if (!this.policyApprovalService) {
            throw new Error('PolicyApprovalService is not available');
        }
        return this.policyApprovalService.findPendingApprovals();
    }
    async approvePolicy(approvalId, comments) {
        if (!this.policyApprovalService) {
            throw new Error('PolicyApprovalService is not available');
        }
        const approval = await this.policyApprovalService.approvePolicy(approvalId, comments);
        const allApprovals = await this.policyApprovalService.findApprovalsByPolicy(approval.policy_id);
        const allApproved = allApprovals.every((a) => a.approval_status === 'approved' ||
            a.approval_status === 'revoked');
        if (allApproved) {
            await this.policyRepository.update(approval.policy_id, {
                status: policy_entity_1.PolicyStatus.APPROVED,
            });
            this.logger.log(`All approvals complete for policy: ${approval.policy_id}`);
        }
        return approval;
    }
    async rejectPolicy(approvalId, comments) {
        if (!this.policyApprovalService) {
            throw new Error('PolicyApprovalService is not available');
        }
        return this.policyApprovalService.rejectPolicy(approvalId, comments);
    }
    async getApprovalProgress(policyId) {
        if (!this.policyApprovalService) {
            throw new Error('PolicyApprovalService is not available');
        }
        return this.policyApprovalService.getApprovalProgress(policyId);
    }
};
exports.PoliciesService = PoliciesService;
exports.PoliciesService = PoliciesService = PoliciesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(1, (0, typeorm_1.InjectRepository)(workflow_execution_entity_1.WorkflowExecution)),
    __param(2, (0, typeorm_1.InjectRepository)(policy_assignment_entity_1.PolicyAssignment)),
    __param(3, (0, typeorm_1.InjectRepository)(policy_approval_entity_1.PolicyApproval)),
    __param(4, (0, typeorm_1.InjectRepository)(policy_version_entity_1.PolicyVersion)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(6, (0, typeorm_1.InjectRepository)(business_unit_entity_1.BusinessUnit)),
    __param(7, (0, typeorm_1.InjectRepository)(policy_review_entity_1.PolicyReview)),
    __param(8, (0, common_1.Optional)()),
    __param(9, (0, common_1.Optional)()),
    __param(10, (0, common_1.Optional)()),
    __param(11, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        workflow_service_1.WorkflowService,
        notification_service_1.NotificationService,
        policy_approval_service_1.PolicyApprovalService,
        policy_version_service_1.PolicyVersionService])
], PoliciesService);
//# sourceMappingURL=policies.service.js.map