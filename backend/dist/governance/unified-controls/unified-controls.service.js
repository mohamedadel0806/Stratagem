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
var UnifiedControlsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedControlsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const unified_control_entity_1 = require("./entities/unified-control.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let UnifiedControlsService = UnifiedControlsService_1 = class UnifiedControlsService {
    constructor(controlRepository, notificationService) {
        this.controlRepository = controlRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(UnifiedControlsService_1.name);
    }
    async create(createDto, userId) {
        const control = this.controlRepository.create(Object.assign(Object.assign({}, createDto), { created_by: userId }));
        const savedControl = await this.controlRepository.save(control);
        if (this.notificationService && savedControl.control_owner_id) {
            try {
                await this.notificationService.create({
                    userId: savedControl.control_owner_id,
                    type: notification_entity_1.NotificationType.TASK_ASSIGNED,
                    priority: notification_entity_1.NotificationPriority.MEDIUM,
                    title: 'New Control Assigned',
                    message: `Control "${savedControl.title}" has been assigned to you as the control owner.`,
                    entityType: 'control',
                    entityId: savedControl.id,
                    actionUrl: `/dashboard/governance/controls/${savedControl.id}`,
                });
            }
            catch (error) {
                this.logger.error(`Failed to send notification on control creation: ${error.message}`, error.stack);
            }
        }
        return savedControl;
    }
    async findAll(queryDto) {
        const { page = 1, limit = 25, control_type, status, implementation_status, domain, control_owner_id, search, sort } = queryDto;
        const skip = (page - 1) * limit;
        const where = {};
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
            queryBuilder.andWhere('(control.title ILIKE :search OR control.description ILIKE :search OR control.control_identifier ILIKE :search)', { search: `%${search}%` });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`control.${field}`, order.toUpperCase());
        }
        else {
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
    async findOne(id) {
        const control = await this.controlRepository.findOne({
            where: { id },
            relations: ['control_owner', 'creator', 'updater'],
        });
        if (!control) {
            throw new common_1.NotFoundException(`Unified control with ID ${id} not found`);
        }
        return control;
    }
    async update(id, updateDto, userId) {
        const control = await this.findOne(id);
        const oldImplementationStatus = control.implementation_status;
        Object.assign(control, Object.assign(Object.assign({}, updateDto), { updated_by: userId }));
        const savedControl = await this.controlRepository.save(control);
        if (this.notificationService &&
            oldImplementationStatus !== savedControl.implementation_status &&
            savedControl.implementation_status === unified_control_entity_1.ImplementationStatus.IMPLEMENTED) {
            try {
                if (savedControl.control_owner_id) {
                    await this.notificationService.create({
                        userId: savedControl.control_owner_id,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.MEDIUM,
                        title: 'Control Implementation Completed',
                        message: `Control "${savedControl.title}" has been marked as implemented.`,
                        entityType: 'control',
                        entityId: savedControl.id,
                        actionUrl: `/dashboard/governance/controls/${savedControl.id}`,
                    });
                }
                if (savedControl.created_by) {
                    await this.notificationService.create({
                        userId: savedControl.created_by,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.LOW,
                        title: 'Control Implementation Completed',
                        message: `Control "${savedControl.title}" has been successfully implemented.`,
                        entityType: 'control',
                        entityId: savedControl.id,
                        actionUrl: `/dashboard/governance/controls/${savedControl.id}`,
                    });
                }
            }
            catch (error) {
                this.logger.error(`Failed to send notification on control implementation: ${error.message}`, error.stack);
            }
        }
        return savedControl;
    }
    async remove(id) {
        const control = await this.findOne(id);
        await this.controlRepository.softRemove(control);
    }
};
exports.UnifiedControlsService = UnifiedControlsService;
exports.UnifiedControlsService = UnifiedControlsService = UnifiedControlsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService])
], UnifiedControlsService);
//# sourceMappingURL=unified-controls.service.js.map