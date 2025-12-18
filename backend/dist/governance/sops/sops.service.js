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
var SOPsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOPsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sop_entity_1 = require("./entities/sop.entity");
const sop_assignment_entity_1 = require("./entities/sop-assignment.entity");
const unified_control_entity_1 = require("../unified-controls/entities/unified-control.entity");
const workflow_service_1 = require("../../workflow/services/workflow.service");
const workflow_entity_1 = require("../../workflow/entities/workflow.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
const workflow_execution_entity_1 = require("../../workflow/entities/workflow-execution.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let SOPsService = SOPsService_1 = class SOPsService {
    constructor(sopRepository, controlRepository, workflowExecutionRepository, assignmentRepository, userRepository, workflowService, notificationService) {
        this.sopRepository = sopRepository;
        this.controlRepository = controlRepository;
        this.workflowExecutionRepository = workflowExecutionRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.workflowService = workflowService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(SOPsService_1.name);
    }
    async create(createSOPDto, userId) {
        const sop = this.sopRepository.create(Object.assign(Object.assign({}, createSOPDto), { created_by: userId }));
        const savedSOP = await this.sopRepository.save(sop);
        if (createSOPDto.control_ids && createSOPDto.control_ids.length > 0) {
            const controls = await this.controlRepository.find({
                where: { id: (0, typeorm_2.In)(createSOPDto.control_ids) },
            });
            savedSOP.controls = controls;
            await this.sopRepository.save(savedSOP);
        }
        if (this.workflowService) {
            try {
                await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.SOP, savedSOP.id, workflow_entity_1.WorkflowTrigger.ON_CREATE, {
                    status: savedSOP.status,
                    category: savedSOP.category,
                }, true);
            }
            catch (error) {
                this.logger.error(`Failed to trigger workflows on SOP creation: ${error.message}`, error.stack);
            }
        }
        return savedSOP;
    }
    async findAll(queryDto) {
        const { page = 1, limit = 25, status, category, owner_id, search, sort } = queryDto;
        const skip = (page - 1) * limit;
        const where = {};
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
            queryBuilder.andWhere('(sop.title ILIKE :search OR sop.purpose ILIKE :search OR sop.content ILIKE :search)', { search: `%${search}%` });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`sop.${field}`, order.toUpperCase());
        }
        else {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`SOP with ID ${id} not found`);
        }
        return sop;
    }
    async update(id, updateSOPDto, userId) {
        const sop = await this.findOne(id);
        const oldStatus = sop.status;
        Object.assign(sop, Object.assign(Object.assign({}, updateSOPDto), { updated_by: userId }));
        if (updateSOPDto.control_ids !== undefined) {
            if (updateSOPDto.control_ids.length > 0) {
                const controls = await this.controlRepository.find({
                    where: { id: (0, typeorm_2.In)(updateSOPDto.control_ids) },
                });
                sop.controls = controls;
            }
            else {
                sop.controls = [];
            }
        }
        const savedSOP = await this.sopRepository.save(sop);
        if (this.workflowService) {
            try {
                await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.SOP, savedSOP.id, workflow_entity_1.WorkflowTrigger.ON_UPDATE, {
                    status: savedSOP.status,
                    category: savedSOP.category,
                }, true);
            }
            catch (error) {
                this.logger.error(`Failed to trigger workflows on SOP update: ${error.message}`, error.stack);
            }
        }
        if (this.workflowService && oldStatus !== savedSOP.status) {
            try {
                await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.SOP, savedSOP.id, workflow_entity_1.WorkflowTrigger.ON_STATUS_CHANGE, {
                    status: savedSOP.status,
                    oldStatus,
                    category: savedSOP.category,
                }, true);
                this.logger.log(`Triggered workflows for SOP ${id} status change: ${oldStatus} → ${savedSOP.status}`);
            }
            catch (error) {
                this.logger.error(`Failed to trigger workflows on SOP status change: ${error.message}`, error.stack);
            }
        }
        if (this.notificationService && oldStatus !== savedSOP.status) {
            try {
                const statusMessages = {
                    [sop_entity_1.SOPStatus.DRAFT]: {
                        title: 'SOP Status Changed',
                        message: `SOP "${savedSOP.title}" has been moved to Draft status.`,
                        priority: notification_entity_1.NotificationPriority.LOW,
                    },
                    [sop_entity_1.SOPStatus.IN_REVIEW]: {
                        title: 'SOP Review Required',
                        message: `SOP "${savedSOP.title}" is now in Review and requires your attention.`,
                        priority: notification_entity_1.NotificationPriority.HIGH,
                    },
                    [sop_entity_1.SOPStatus.APPROVED]: {
                        title: 'SOP Approved',
                        message: `SOP "${savedSOP.title}" has been approved and is ready for publication.`,
                        priority: notification_entity_1.NotificationPriority.MEDIUM,
                    },
                    [sop_entity_1.SOPStatus.PUBLISHED]: {
                        title: 'SOP Published',
                        message: `SOP "${savedSOP.title}" has been published and is now active.`,
                        priority: notification_entity_1.NotificationPriority.HIGH,
                    },
                    [sop_entity_1.SOPStatus.ARCHIVED]: {
                        title: 'SOP Archived',
                        message: `SOP "${savedSOP.title}" has been archived.`,
                        priority: notification_entity_1.NotificationPriority.LOW,
                    },
                };
                const notificationConfig = statusMessages[savedSOP.status];
                if (notificationConfig && savedSOP.owner_id) {
                    await this.notificationService.create({
                        userId: savedSOP.owner_id,
                        type: savedSOP.status === sop_entity_1.SOPStatus.IN_REVIEW
                            ? notification_entity_1.NotificationType.GENERAL
                            : notification_entity_1.NotificationType.GENERAL,
                        priority: notificationConfig.priority,
                        title: notificationConfig.title,
                        message: notificationConfig.message,
                        entityType: 'sop',
                        entityId: savedSOP.id,
                        actionUrl: `/dashboard/governance/sops/${savedSOP.id}`,
                    });
                }
            }
            catch (error) {
                this.logger.error(`Failed to send notification on SOP status change: ${error.message}`, error.stack);
            }
        }
        return savedSOP;
    }
    async publish(id, userId, assignToUserIds, assignToRoleIds) {
        const sop = await this.findOne(id);
        if (sop.status !== sop_entity_1.SOPStatus.APPROVED) {
            throw new common_1.NotFoundException('SOP must be approved before publishing');
        }
        sop.status = sop_entity_1.SOPStatus.PUBLISHED;
        sop.published_date = new Date();
        sop.updated_by = userId;
        const savedSOP = await this.sopRepository.save(sop);
        if ((assignToUserIds && assignToUserIds.length > 0) || (assignToRoleIds && assignToRoleIds.length > 0)) {
            const assignments = [];
            if (assignToUserIds && assignToUserIds.length > 0) {
                for (const userId of assignToUserIds) {
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
            if (assignToRoleIds && assignToRoleIds.length > 0) {
                this.logger.log(`Role-based assignments for SOP ${id}: ${assignToRoleIds.join(', ')}`);
            }
            if (assignments.length > 0) {
                await this.assignmentRepository.save(assignments);
                this.logger.log(`Created ${assignments.length} assignments for SOP ${id}`);
            }
            if (this.notificationService && assignToUserIds && assignToUserIds.length > 0) {
                try {
                    for (const userId of assignToUserIds) {
                        await this.notificationService.create({
                            userId,
                            type: notification_entity_1.NotificationType.GENERAL,
                            priority: notification_entity_1.NotificationPriority.HIGH,
                            title: 'New SOP Published',
                            message: `SOP "${savedSOP.title}" has been published and assigned to you.`,
                            entityType: 'sop',
                            entityId: savedSOP.id,
                            actionUrl: `/dashboard/governance/sops/${savedSOP.id}`,
                        });
                    }
                }
                catch (error) {
                    this.logger.error(`Failed to send notifications: ${error.message}`, error.stack);
                }
            }
        }
        return savedSOP;
    }
    async remove(id) {
        const sop = await this.findOne(id);
        await this.sopRepository.softRemove(sop);
    }
    async getAssignedSOPs(userId, queryDto) {
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
        const where = {
            id: (0, typeorm_2.In)(sopIds),
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
            queryBuilder.andWhere('(sop.title ILIKE :search OR sop.purpose ILIKE :search OR sop.content ILIKE :search)', { search: `%${search}%` });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`sop.${field}`, order.toUpperCase());
        }
        else {
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
    async getPublicationStatistics() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const [totalPublished, publishedThisMonth, publishedThisYear, assignments, acknowledged] = await Promise.all([
            this.sopRepository.count({ where: { status: sop_entity_1.SOPStatus.PUBLISHED } }),
            this.sopRepository
                .createQueryBuilder('sop')
                .where('sop.status = :status', { status: sop_entity_1.SOPStatus.PUBLISHED })
                .andWhere('sop.published_date >= :startOfMonth', { startOfMonth })
                .getCount(),
            this.sopRepository
                .createQueryBuilder('sop')
                .where('sop.status = :status', { status: sop_entity_1.SOPStatus.PUBLISHED })
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
};
exports.SOPsService = SOPsService;
exports.SOPsService = SOPsService = SOPsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sop_entity_1.SOP)),
    __param(1, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __param(2, (0, typeorm_1.InjectRepository)(workflow_execution_entity_1.WorkflowExecution)),
    __param(3, (0, typeorm_1.InjectRepository)(sop_assignment_entity_1.SOPAssignment)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, common_1.Optional)()),
    __param(6, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        workflow_service_1.WorkflowService,
        notification_service_1.NotificationService])
], SOPsService);
//# sourceMappingURL=sops.service.js.map