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
const workflow_service_1 = require("../../workflow/services/workflow.service");
const workflow_entity_1 = require("../../workflow/entities/workflow.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let PoliciesService = PoliciesService_1 = class PoliciesService {
    constructor(policyRepository, workflowService, notificationService) {
        this.policyRepository = policyRepository;
        this.workflowService = workflowService;
        this.notificationService = notificationService;
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
};
exports.PoliciesService = PoliciesService;
exports.PoliciesService = PoliciesService = PoliciesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(1, (0, common_1.Optional)()),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        workflow_service_1.WorkflowService,
        notification_service_1.NotificationService])
], PoliciesService);
//# sourceMappingURL=policies.service.js.map