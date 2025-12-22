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
var ControlObjectivesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlObjectivesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const control_objective_entity_1 = require("./entities/control-objective.entity");
const policy_entity_1 = require("../policies/entities/policy.entity");
const unified_control_entity_1 = require("../unified-controls/entities/unified-control.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let ControlObjectivesService = ControlObjectivesService_1 = class ControlObjectivesService {
    constructor(controlObjectiveRepository, policyRepository, unifiedControlRepository, notificationService) {
        this.controlObjectiveRepository = controlObjectiveRepository;
        this.policyRepository = policyRepository;
        this.unifiedControlRepository = unifiedControlRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(ControlObjectivesService_1.name);
    }
    async create(createDto, userId) {
        const policy = await this.policyRepository.findOne({
            where: { id: createDto.policy_id },
        });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${createDto.policy_id} not found`);
        }
        const controlObjective = this.controlObjectiveRepository.create(Object.assign(Object.assign({}, createDto), { created_by: userId }));
        const savedObjective = await this.controlObjectiveRepository.save(controlObjective);
        if (this.notificationService) {
            try {
                if (policy.owner_id) {
                    await this.notificationService.create({
                        userId: policy.owner_id,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.MEDIUM,
                        title: 'New Control Objective Added',
                        message: `Control objective "${savedObjective.objective_identifier}" has been added to policy "${policy.title}".`,
                        entityType: 'policy',
                        entityId: policy.id,
                        actionUrl: `/dashboard/governance/policies/${policy.id}`,
                    });
                }
                if (savedObjective.responsible_party_id) {
                    await this.notificationService.create({
                        userId: savedObjective.responsible_party_id,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.MEDIUM,
                        title: 'Control Objective Assigned to You',
                        message: `Control objective "${savedObjective.objective_identifier}" has been assigned to you.`,
                        entityType: 'policy',
                        entityId: policy.id,
                        actionUrl: `/dashboard/governance/policies/${policy.id}`,
                    });
                }
            }
            catch (error) {
                this.logger.error(`Failed to send notification on control objective creation: ${error.message}`, error.stack);
            }
        }
        return savedObjective;
    }
    async findAll(policyId) {
        const queryBuilder = this.controlObjectiveRepository
            .createQueryBuilder('co')
            .leftJoinAndSelect('co.responsible_party', 'responsible_party')
            .leftJoinAndSelect('co.creator', 'creator')
            .orderBy('co.display_order', 'ASC')
            .addOrderBy('co.created_at', 'ASC');
        if (policyId) {
            queryBuilder.where('co.policy_id = :policyId', { policyId });
        }
        return queryBuilder.getMany();
    }
    async findOne(id) {
        const controlObjective = await this.controlObjectiveRepository.findOne({
            where: { id },
            relations: ['policy', 'responsible_party', 'creator', 'updater', 'unified_controls'],
        });
        if (!controlObjective) {
            throw new common_1.NotFoundException(`Control objective with ID ${id} not found`);
        }
        return controlObjective;
    }
    async update(id, updateDto, userId) {
        const controlObjective = await this.findOne(id);
        const oldStatus = controlObjective.implementation_status;
        const oldResponsiblePartyId = controlObjective.responsible_party_id;
        Object.assign(controlObjective, Object.assign(Object.assign({}, updateDto), { updated_by: userId }));
        const savedObjective = await this.controlObjectiveRepository.save(controlObjective);
        if (this.notificationService) {
            try {
                if (oldStatus !== savedObjective.implementation_status && savedObjective.responsible_party_id) {
                    await this.notificationService.create({
                        userId: savedObjective.responsible_party_id,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.MEDIUM,
                        title: 'Control Objective Status Changed',
                        message: `Control objective "${savedObjective.objective_identifier}" implementation status has changed from ${oldStatus} to ${savedObjective.implementation_status}.`,
                        entityType: 'policy',
                        entityId: savedObjective.policy_id,
                        actionUrl: `/dashboard/governance/policies/${savedObjective.policy_id}`,
                    });
                }
                if (oldResponsiblePartyId !== savedObjective.responsible_party_id) {
                    if (savedObjective.responsible_party_id) {
                        await this.notificationService.create({
                            userId: savedObjective.responsible_party_id,
                            type: notification_entity_1.NotificationType.GENERAL,
                            priority: notification_entity_1.NotificationPriority.MEDIUM,
                            title: 'Control Objective Assigned to You',
                            message: `Control objective "${savedObjective.objective_identifier}" has been assigned to you.`,
                            entityType: 'policy',
                            entityId: savedObjective.policy_id,
                            actionUrl: `/dashboard/governance/policies/${savedObjective.policy_id}`,
                        });
                    }
                    if (oldResponsiblePartyId) {
                        await this.notificationService.create({
                            userId: oldResponsiblePartyId,
                            type: notification_entity_1.NotificationType.GENERAL,
                            priority: notification_entity_1.NotificationPriority.LOW,
                            title: 'Control Objective Assignment Changed',
                            message: `Control objective "${savedObjective.objective_identifier}" has been reassigned.`,
                            entityType: 'policy',
                            entityId: savedObjective.policy_id,
                            actionUrl: `/dashboard/governance/policies/${savedObjective.policy_id}`,
                        });
                    }
                }
            }
            catch (error) {
                this.logger.error(`Failed to send notification on control objective update: ${error.message}`, error.stack);
            }
        }
        return savedObjective;
    }
    async remove(id) {
        const controlObjective = await this.findOne(id);
        if (this.notificationService && controlObjective.responsible_party_id) {
            try {
                await this.notificationService.create({
                    userId: controlObjective.responsible_party_id,
                    type: notification_entity_1.NotificationType.GENERAL,
                    priority: notification_entity_1.NotificationPriority.MEDIUM,
                    title: 'Control Objective Removed',
                    message: `Control objective "${controlObjective.objective_identifier}" has been removed from the policy.`,
                    entityType: 'policy',
                    entityId: controlObjective.policy_id,
                    actionUrl: `/dashboard/governance/policies/${controlObjective.policy_id}`,
                });
            }
            catch (error) {
                this.logger.error(`Failed to send notification on control objective deletion: ${error.message}`, error.stack);
            }
        }
        await this.controlObjectiveRepository.softRemove(controlObjective);
    }
    async linkUnifiedControls(id, controlIds) {
        var _a;
        const controlObjective = await this.findOne(id);
        const controls = await this.unifiedControlRepository.find({
            where: { id: (0, typeorm_2.In)(controlIds) },
        });
        if (controls.length === 0 && controlIds.length > 0) {
            throw new common_1.NotFoundException('No unified controls found with the provided IDs');
        }
        const currentControlIds = new Set(((_a = controlObjective.unified_controls) === null || _a === void 0 ? void 0 : _a.map(c => c.id)) || []);
        const newControls = controls.filter(c => !currentControlIds.has(c.id));
        controlObjective.unified_controls = [
            ...(controlObjective.unified_controls || []),
            ...newControls
        ];
        return this.controlObjectiveRepository.save(controlObjective);
    }
    async unlinkUnifiedControls(id, controlIds) {
        const controlObjective = await this.findOne(id);
        if (!controlObjective.unified_controls) {
            return controlObjective;
        }
        controlObjective.unified_controls = controlObjective.unified_controls.filter(c => !controlIds.includes(c.id));
        return this.controlObjectiveRepository.save(controlObjective);
    }
    async getUnifiedControls(id) {
        const controlObjective = await this.findOne(id);
        return controlObjective.unified_controls || [];
    }
};
exports.ControlObjectivesService = ControlObjectivesService;
exports.ControlObjectivesService = ControlObjectivesService = ControlObjectivesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(control_objective_entity_1.ControlObjective)),
    __param(1, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(2, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __param(3, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], ControlObjectivesService);
//# sourceMappingURL=control-objectives.service.js.map