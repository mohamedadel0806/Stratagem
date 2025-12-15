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
var FindingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const finding_entity_1 = require("./entities/finding.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let FindingsService = FindingsService_1 = class FindingsService {
    constructor(findingRepository, notificationService) {
        this.findingRepository = findingRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(FindingsService_1.name);
    }
    async create(createDto, userId) {
        const finding = this.findingRepository.create(Object.assign(Object.assign({}, createDto), { created_by: userId, status: createDto.status || finding_entity_1.FindingStatus.OPEN }));
        const savedFinding = await this.findingRepository.save(finding);
        if (this.notificationService) {
            try {
                const priorityMap = {
                    [finding_entity_1.FindingSeverity.CRITICAL]: notification_entity_1.NotificationPriority.URGENT,
                    [finding_entity_1.FindingSeverity.HIGH]: notification_entity_1.NotificationPriority.HIGH,
                    [finding_entity_1.FindingSeverity.MEDIUM]: notification_entity_1.NotificationPriority.MEDIUM,
                    [finding_entity_1.FindingSeverity.LOW]: notification_entity_1.NotificationPriority.LOW,
                    [finding_entity_1.FindingSeverity.INFO]: notification_entity_1.NotificationPriority.LOW,
                };
                const priority = priorityMap[savedFinding.severity] || notification_entity_1.NotificationPriority.MEDIUM;
                if (savedFinding.remediation_owner_id) {
                    await this.notificationService.create({
                        userId: savedFinding.remediation_owner_id,
                        type: notification_entity_1.NotificationType.TASK_ASSIGNED,
                        priority,
                        title: 'New Finding Assigned',
                        message: `A ${savedFinding.severity} severity finding "${savedFinding.title}" has been assigned to you for remediation.`,
                        entityType: 'finding',
                        entityId: savedFinding.id,
                        actionUrl: `/dashboard/governance/findings/${savedFinding.id}`,
                    });
                }
                if ((savedFinding.severity === finding_entity_1.FindingSeverity.CRITICAL || savedFinding.severity === finding_entity_1.FindingSeverity.HIGH) &&
                    savedFinding.risk_accepted_by) {
                    await this.notificationService.create({
                        userId: savedFinding.risk_accepted_by,
                        type: notification_entity_1.NotificationType.RISK_ESCALATED,
                        priority: notification_entity_1.NotificationPriority.HIGH,
                        title: 'High Severity Finding Requires Attention',
                        message: `A ${savedFinding.severity} severity finding "${savedFinding.title}" requires your review and acceptance.`,
                        entityType: 'finding',
                        entityId: savedFinding.id,
                        actionUrl: `/dashboard/governance/findings/${savedFinding.id}`,
                    });
                }
            }
            catch (error) {
                this.logger.error(`Failed to send notification on finding creation: ${error.message}`, error.stack);
            }
        }
        return savedFinding;
    }
    async findAll(queryDto) {
        const { page = 1, limit = 25, severity, status, assessment_id, unified_control_id, remediation_owner_id, search, sort, } = queryDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (severity) {
            where.severity = severity;
        }
        if (status) {
            where.status = status;
        }
        if (assessment_id) {
            where.assessment_id = assessment_id;
        }
        if (unified_control_id) {
            where.unified_control_id = unified_control_id;
        }
        if (remediation_owner_id) {
            where.remediation_owner_id = remediation_owner_id;
        }
        const queryBuilder = this.findingRepository
            .createQueryBuilder('finding')
            .leftJoinAndSelect('finding.assessment', 'assessment')
            .leftJoinAndSelect('finding.unified_control', 'unified_control')
            .leftJoinAndSelect('finding.remediation_owner', 'remediation_owner')
            .leftJoinAndSelect('finding.creator', 'creator')
            .leftJoinAndSelect('finding.updater', 'updater');
        if (Object.keys(where).length > 0) {
            queryBuilder.where(where);
        }
        if (search) {
            queryBuilder.andWhere('(finding.title ILIKE :search OR finding.description ILIKE :search OR finding.finding_identifier ILIKE :search)', { search: `%${search}%` });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`finding.${field}`, order.toUpperCase());
        }
        else {
            queryBuilder.orderBy('finding.finding_date', 'DESC');
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
        const finding = await this.findingRepository.findOne({
            where: { id },
            relations: [
                'assessment',
                'assessment_result',
                'unified_control',
                'remediation_owner',
                'risk_acceptor',
                'creator',
                'updater',
            ],
        });
        if (!finding) {
            throw new common_1.NotFoundException(`Finding with ID ${id} not found`);
        }
        return finding;
    }
    async update(id, updateDto, userId) {
        const finding = await this.findOne(id);
        const oldStatus = finding.status;
        Object.assign(finding, Object.assign(Object.assign({}, updateDto), { updated_by: userId }));
        const savedFinding = await this.findingRepository.save(finding);
        if (this.notificationService && oldStatus !== savedFinding.status) {
            try {
                if (savedFinding.status === finding_entity_1.FindingStatus.CLOSED) {
                    if (savedFinding.created_by) {
                        await this.notificationService.create({
                            userId: savedFinding.created_by,
                            type: notification_entity_1.NotificationType.GENERAL,
                            priority: notification_entity_1.NotificationPriority.MEDIUM,
                            title: 'Finding Closed',
                            message: `Finding "${savedFinding.title}" has been closed.`,
                            entityType: 'finding',
                            entityId: savedFinding.id,
                            actionUrl: `/dashboard/governance/findings/${savedFinding.id}`,
                        });
                    }
                    if (savedFinding.remediation_owner_id) {
                        await this.notificationService.create({
                            userId: savedFinding.remediation_owner_id,
                            type: notification_entity_1.NotificationType.GENERAL,
                            priority: notification_entity_1.NotificationPriority.MEDIUM,
                            title: 'Finding Remediated',
                            message: `Finding "${savedFinding.title}" has been successfully remediated and closed.`,
                            entityType: 'finding',
                            entityId: savedFinding.id,
                            actionUrl: `/dashboard/governance/findings/${savedFinding.id}`,
                        });
                    }
                }
            }
            catch (error) {
                this.logger.error(`Failed to send notification on finding status change: ${error.message}`, error.stack);
            }
        }
        return savedFinding;
    }
    async remove(id) {
        const finding = await this.findOne(id);
        await this.findingRepository.softRemove(finding);
    }
};
exports.FindingsService = FindingsService;
exports.FindingsService = FindingsService = FindingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(finding_entity_1.Finding)),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService])
], FindingsService);
//# sourceMappingURL=findings.service.js.map