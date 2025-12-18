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
var PolicyExceptionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyExceptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const policy_exception_entity_1 = require("./entities/policy-exception.entity");
const workflow_service_1 = require("../../workflow/services/workflow.service");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
const workflow_entity_1 = require("../../workflow/entities/workflow.entity");
let PolicyExceptionsService = PolicyExceptionsService_1 = class PolicyExceptionsService {
    constructor(exceptionRepository, workflowService, notificationService) {
        this.exceptionRepository = exceptionRepository;
        this.workflowService = workflowService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(PolicyExceptionsService_1.name);
    }
    async create(dto, userId) {
        let identifier = dto.exception_identifier;
        if (!identifier) {
            identifier = await this.generateExceptionIdentifier();
        }
        const existing = await this.exceptionRepository.findOne({
            where: { exception_identifier: identifier, deleted_at: (0, typeorm_2.IsNull)() },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Exception with identifier ${identifier} already exists`);
        }
        const exception = this.exceptionRepository.create(Object.assign(Object.assign({}, dto), { exception_identifier: identifier, requested_by: userId, request_date: new Date(), status: policy_exception_entity_1.ExceptionStatus.REQUESTED, start_date: dto.start_date ? new Date(dto.start_date) : null, end_date: dto.end_date ? new Date(dto.end_date) : null, next_review_date: dto.next_review_date ? new Date(dto.next_review_date) : null }));
        const saved = await this.exceptionRepository.save(exception);
        try {
            await this.workflowService.checkAndTriggerWorkflows('POLICY_EXCEPTION', saved.id, 'ON_CREATE', {
                exception_id: saved.id,
                entity_id: dto.entity_id,
                entity_type: dto.entity_type || 'policy',
            }, true);
        }
        catch (error) {
            this.logger.warn(`Failed to trigger workflow for exception ${saved.id}: ${error.message}`);
        }
        await this.notificationService.create({
            userId,
            type: notification_entity_1.NotificationType.GENERAL,
            priority: notification_entity_1.NotificationPriority.MEDIUM,
            title: 'Policy Exception Requested',
            message: `Policy exception ${identifier} has been requested and is pending approval.`,
            entityType: 'policy_exception',
            entityId: saved.id,
            actionUrl: `/dashboard/governance/exceptions/${saved.id}`,
        });
        return saved;
    }
    async findAll(query) {
        const { page = 1, limit = 20, status, exception_type, entity_id, entity_type, requested_by, requesting_business_unit_id, search } = query;
        const queryBuilder = this.exceptionRepository
            .createQueryBuilder('exception')
            .leftJoinAndSelect('exception.requester', 'requester')
            .leftJoinAndSelect('exception.approver', 'approver')
            .leftJoinAndSelect('exception.requesting_business_unit', 'business_unit')
            .where('exception.deleted_at IS NULL');
        if (status) {
            queryBuilder.andWhere('exception.status = :status', { status });
        }
        if (exception_type) {
            queryBuilder.andWhere('exception.exception_type = :exception_type', { exception_type });
        }
        if (entity_id) {
            queryBuilder.andWhere('exception.entity_id = :entity_id', { entity_id });
        }
        if (entity_type) {
            queryBuilder.andWhere('exception.entity_type = :entity_type', { entity_type });
        }
        if (requested_by) {
            queryBuilder.andWhere('exception.requested_by = :requested_by', { requested_by });
        }
        if (requesting_business_unit_id) {
            queryBuilder.andWhere('exception.requesting_business_unit_id = :requesting_business_unit_id', {
                requesting_business_unit_id,
            });
        }
        if (search) {
            queryBuilder.andWhere('(exception.exception_identifier ILIKE :search OR exception.business_justification ILIKE :search)', { search: `%${search}%` });
        }
        const total = await queryBuilder.getCount();
        const exceptions = await queryBuilder
            .orderBy('exception.request_date', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return {
            data: exceptions,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const exception = await this.exceptionRepository.findOne({
            where: { id, deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['requester', 'approver', 'requesting_business_unit', 'updater'],
        });
        if (!exception) {
            throw new common_1.NotFoundException(`Policy exception with ID ${id} not found`);
        }
        return exception;
    }
    async update(id, dto, userId) {
        const exception = await this.findOne(id);
        if (dto.status === policy_exception_entity_1.ExceptionStatus.APPROVED && exception.status !== policy_exception_entity_1.ExceptionStatus.APPROVED) {
            exception.approval_date = new Date();
            exception.approved_by = userId;
        }
        if (dto.status === policy_exception_entity_1.ExceptionStatus.REJECTED && !dto.rejection_reason) {
            throw new common_1.BadRequestException('Rejection reason is required when rejecting an exception');
        }
        Object.assign(exception, Object.assign(Object.assign({}, dto), { updated_by: userId, start_date: dto.start_date ? new Date(dto.start_date) : exception.start_date, end_date: dto.end_date ? new Date(dto.end_date) : exception.end_date, next_review_date: dto.next_review_date ? new Date(dto.next_review_date) : exception.next_review_date }));
        const updated = await this.exceptionRepository.save(exception);
        if (dto.status && dto.status !== exception.status) {
            try {
                await this.workflowService.checkAndTriggerWorkflows('POLICY_EXCEPTION', id, workflow_entity_1.WorkflowTrigger.ON_STATUS_CHANGE, {
                    exception_id: id,
                    old_status: exception.status,
                    new_status: dto.status,
                }, true);
            }
            catch (error) {
                this.logger.warn(`Failed to trigger workflow for exception ${id}: ${error.message}`);
            }
        }
        return updated;
    }
    async delete(id) {
        const exception = await this.findOne(id);
        await this.exceptionRepository.softDelete(id);
    }
    async approve(id, userId, conditions) {
        const exception = await this.findOne(id);
        if (exception.status !== policy_exception_entity_1.ExceptionStatus.REQUESTED && exception.status !== policy_exception_entity_1.ExceptionStatus.UNDER_REVIEW) {
            throw new common_1.BadRequestException('Only requested or under review exceptions can be approved');
        }
        return this.update(id, {
            status: policy_exception_entity_1.ExceptionStatus.APPROVED,
            approval_conditions: conditions,
        }, userId);
    }
    async reject(id, userId, reason) {
        const exception = await this.findOne(id);
        if (exception.status !== policy_exception_entity_1.ExceptionStatus.REQUESTED && exception.status !== policy_exception_entity_1.ExceptionStatus.UNDER_REVIEW) {
            throw new common_1.BadRequestException('Only requested or under review exceptions can be rejected');
        }
        return this.update(id, {
            status: policy_exception_entity_1.ExceptionStatus.REJECTED,
            rejection_reason: reason,
        }, userId);
    }
    async generateExceptionIdentifier() {
        const prefix = 'EXC';
        const year = new Date().getFullYear();
        const count = await this.exceptionRepository.count({
            where: {
                exception_identifier: (0, typeorm_2.Like)(`${prefix}-${year}-%`),
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        return `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`;
    }
};
exports.PolicyExceptionsService = PolicyExceptionsService;
exports.PolicyExceptionsService = PolicyExceptionsService = PolicyExceptionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(policy_exception_entity_1.PolicyException)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        workflow_service_1.WorkflowService,
        notification_service_1.NotificationService])
], PolicyExceptionsService);
//# sourceMappingURL=policy-exceptions.service.js.map