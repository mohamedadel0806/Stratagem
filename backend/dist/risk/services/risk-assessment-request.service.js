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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskAssessmentRequestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const risk_assessment_request_entity_1 = require("../entities/risk-assessment-request.entity");
const risk_entity_1 = require("../entities/risk.entity");
const risk_assessment_entity_1 = require("../entities/risk-assessment.entity");
const workflow_service_1 = require("../../workflow/services/workflow.service");
const workflow_entity_1 = require("../../workflow/entities/workflow.entity");
let RiskAssessmentRequestService = class RiskAssessmentRequestService {
    constructor(requestRepository, riskRepository, assessmentRepository, workflowService) {
        this.requestRepository = requestRepository;
        this.riskRepository = riskRepository;
        this.assessmentRepository = assessmentRepository;
        this.workflowService = workflowService;
    }
    async generateRequestIdentifier() {
        const prefix = 'REQ';
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const monthPrefix = `${prefix}-${year}${month}-`;
        const latest = await this.requestRepository
            .createQueryBuilder('request')
            .where('request.request_identifier LIKE :prefix', { prefix: `${monthPrefix}%` })
            .orderBy('request.created_at', 'DESC')
            .getOne();
        let sequence = 1;
        if (latest) {
            const match = latest.request_identifier.match(/REQ-\d{6}-(\d+)/);
            if (match) {
                sequence = parseInt(match[1], 10) + 1;
            }
        }
        return `${prefix}-${year}${month}-${String(sequence).padStart(4, '0')}`;
    }
    toResponseDto(request) {
        var _a, _b, _c, _d;
        return {
            id: request.id,
            request_identifier: request.request_identifier,
            risk_id: request.risk_id,
            risk_title: (_a = request.risk) === null || _a === void 0 ? void 0 : _a.title,
            risk_identifier: (_b = request.risk) === null || _b === void 0 ? void 0 : _b.risk_id,
            requested_by_id: request.requested_by_id,
            requested_by_name: request.requested_by
                ? `${request.requested_by.firstName || ''} ${request.requested_by.lastName || ''}`.trim() || request.requested_by.email
                : undefined,
            requested_by_email: (_c = request.requested_by) === null || _c === void 0 ? void 0 : _c.email,
            requested_for_id: request.requested_for_id,
            requested_for_name: request.requested_for
                ? `${request.requested_for.firstName || ''} ${request.requested_for.lastName || ''}`.trim() || request.requested_for.email
                : undefined,
            requested_for_email: (_d = request.requested_for) === null || _d === void 0 ? void 0 : _d.email,
            assessment_type: request.assessment_type,
            priority: request.priority,
            status: request.status,
            due_date: request.due_date,
            justification: request.justification,
            notes: request.notes,
            approval_workflow_id: request.approval_workflow_id,
            approved_by_id: request.approved_by_id,
            approved_by_name: request.approved_by
                ? `${request.approved_by.firstName || ''} ${request.approved_by.lastName || ''}`.trim() || request.approved_by.email
                : undefined,
            approved_at: request.approved_at,
            rejected_by_id: request.rejected_by_id,
            rejected_by_name: request.rejected_by
                ? `${request.rejected_by.firstName || ''} ${request.rejected_by.lastName || ''}`.trim() || request.rejected_by.email
                : undefined,
            rejected_at: request.rejected_at,
            rejection_reason: request.rejection_reason,
            completed_at: request.completed_at,
            resulting_assessment_id: request.resulting_assessment_id,
            created_at: request.created_at,
            updated_at: request.updated_at,
        };
    }
    async findAll(filters) {
        const where = {};
        if (filters === null || filters === void 0 ? void 0 : filters.riskId) {
            where.risk_id = filters.riskId;
        }
        if (filters === null || filters === void 0 ? void 0 : filters.requestedById) {
            where.requested_by_id = filters.requestedById;
        }
        if (filters === null || filters === void 0 ? void 0 : filters.requestedForId) {
            where.requested_for_id = filters.requestedForId;
        }
        if (filters === null || filters === void 0 ? void 0 : filters.status) {
            where.status = filters.status;
        }
        if (filters === null || filters === void 0 ? void 0 : filters.assessmentType) {
            where.assessment_type = filters.assessmentType;
        }
        const requests = await this.requestRepository.find({
            where,
            relations: ['risk', 'requested_by', 'requested_for', 'approved_by', 'rejected_by', 'resulting_assessment'],
            order: { created_at: 'DESC' },
        });
        return requests.map((request) => this.toResponseDto(request));
    }
    async findOne(id) {
        const request = await this.requestRepository.findOne({
            where: { id },
            relations: ['risk', 'requested_by', 'requested_for', 'approved_by', 'rejected_by', 'resulting_assessment'],
        });
        if (!request) {
            throw new common_1.NotFoundException(`Risk assessment request with ID ${id} not found`);
        }
        return this.toResponseDto(request);
    }
    async findByRiskId(riskId) {
        return this.findAll({ riskId });
    }
    async findPendingForUser(userId) {
        return this.findAll({
            requestedForId: userId,
            status: risk_assessment_request_entity_1.RequestStatus.PENDING,
        });
    }
    async create(createDto, userId, organizationId) {
        if (!userId) {
            throw new common_1.UnauthorizedException('User ID is required. Please ensure you are authenticated.');
        }
        const risk = await this.riskRepository.findOne({ where: { id: createDto.risk_id } });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk with ID ${createDto.risk_id} not found`);
        }
        const requestIdentifier = await this.generateRequestIdentifier();
        const request = this.requestRepository.create({
            request_identifier: requestIdentifier,
            risk_id: createDto.risk_id,
            requested_by_id: userId,
            requested_for_id: createDto.requested_for_id,
            assessment_type: createDto.assessment_type,
            priority: createDto.priority || 'medium',
            status: risk_assessment_request_entity_1.RequestStatus.PENDING,
            due_date: createDto.due_date ? new Date(createDto.due_date) : undefined,
            justification: createDto.justification,
            notes: createDto.notes,
        });
        const savedRequest = await this.requestRepository.save(request);
        try {
            await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.RISK, createDto.risk_id, workflow_entity_1.WorkflowTrigger.ON_CREATE, {
                request_id: savedRequest.id,
                assessment_type: createDto.assessment_type,
                priority: createDto.priority,
                entityType: 'risk_assessment_request',
            }, true);
        }
        catch (error) {
            console.error('Failed to trigger workflow for assessment request:', error);
        }
        const reloaded = await this.requestRepository.findOne({
            where: { id: savedRequest.id },
            relations: ['risk', 'requested_by', 'requested_for', 'approved_by', 'rejected_by'],
        });
        return this.toResponseDto(reloaded);
    }
    async update(id, updateDto, userId) {
        const request = await this.requestRepository.findOne({
            where: { id },
            relations: ['risk', 'requested_by', 'requested_for'],
        });
        if (!request) {
            throw new common_1.NotFoundException(`Risk assessment request with ID ${id} not found`);
        }
        if (updateDto.status) {
            this.validateStatusTransition(request.status, updateDto.status);
        }
        if (updateDto.requested_for_id !== undefined) {
            request.requested_for_id = updateDto.requested_for_id;
        }
        if (updateDto.priority !== undefined) {
            request.priority = updateDto.priority;
        }
        if (updateDto.due_date !== undefined) {
            request.due_date = updateDto.due_date ? new Date(updateDto.due_date) : null;
        }
        if (updateDto.justification !== undefined) {
            request.justification = updateDto.justification;
        }
        if (updateDto.notes !== undefined) {
            request.notes = updateDto.notes;
        }
        if (updateDto.rejection_reason !== undefined) {
            request.rejection_reason = updateDto.rejection_reason;
        }
        if (updateDto.status) {
            const oldStatus = request.status;
            request.status = updateDto.status;
            switch (updateDto.status) {
                case risk_assessment_request_entity_1.RequestStatus.APPROVED:
                    request.approved_by_id = userId;
                    request.approved_at = new Date();
                    break;
                case risk_assessment_request_entity_1.RequestStatus.REJECTED:
                    request.rejected_by_id = userId;
                    request.rejected_at = new Date();
                    if (updateDto.rejection_reason) {
                        request.rejection_reason = updateDto.rejection_reason;
                    }
                    break;
                case risk_assessment_request_entity_1.RequestStatus.COMPLETED:
                    request.completed_at = new Date();
                    break;
            }
            try {
                await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.RISK, request.risk_id, workflow_entity_1.WorkflowTrigger.ON_STATUS_CHANGE, {
                    request_id: id,
                    status: updateDto.status,
                    oldStatus,
                    entityType: 'risk_assessment_request',
                }, true);
            }
            catch (error) {
                console.error('Failed to trigger workflow for status change:', error);
            }
        }
        await this.requestRepository.save(request);
        const reloaded = await this.requestRepository.findOne({
            where: { id },
            relations: ['risk', 'requested_by', 'requested_for', 'approved_by', 'rejected_by', 'resulting_assessment'],
        });
        return this.toResponseDto(reloaded);
    }
    async approve(id, userId) {
        return this.update(id, { status: risk_assessment_request_entity_1.RequestStatus.APPROVED }, userId);
    }
    async reject(id, userId, reason) {
        return this.update(id, { status: risk_assessment_request_entity_1.RequestStatus.REJECTED, rejection_reason: reason }, userId);
    }
    async cancel(id, userId) {
        return this.update(id, { status: risk_assessment_request_entity_1.RequestStatus.CANCELLED }, userId);
    }
    async markInProgress(id, userId) {
        return this.update(id, { status: risk_assessment_request_entity_1.RequestStatus.IN_PROGRESS }, userId);
    }
    async complete(id, assessmentId, userId) {
        const request = await this.requestRepository.findOne({ where: { id } });
        if (!request) {
            throw new common_1.NotFoundException(`Risk assessment request with ID ${id} not found`);
        }
        const assessment = await this.assessmentRepository.findOne({ where: { id: assessmentId } });
        if (!assessment) {
            throw new common_1.NotFoundException(`Risk assessment with ID ${assessmentId} not found`);
        }
        if (assessment.risk_id !== request.risk_id) {
            throw new common_1.BadRequestException('Assessment risk ID does not match request risk ID');
        }
        if (assessment.assessment_type !== request.assessment_type) {
            throw new common_1.BadRequestException('Assessment type does not match request type');
        }
        request.status = risk_assessment_request_entity_1.RequestStatus.COMPLETED;
        request.completed_at = new Date();
        request.resulting_assessment_id = assessmentId;
        await this.requestRepository.save(request);
        const reloaded = await this.requestRepository.findOne({
            where: { id },
            relations: ['risk', 'requested_by', 'requested_for', 'approved_by', 'rejected_by', 'resulting_assessment'],
        });
        return this.toResponseDto(reloaded);
    }
    async remove(id) {
        const request = await this.requestRepository.findOne({ where: { id } });
        if (!request) {
            throw new common_1.NotFoundException(`Risk assessment request with ID ${id} not found`);
        }
        if (request.status !== risk_assessment_request_entity_1.RequestStatus.PENDING && request.status !== risk_assessment_request_entity_1.RequestStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot delete requests that are not pending or cancelled');
        }
        await this.requestRepository.remove(request);
    }
    validateStatusTransition(currentStatus, newStatus) {
        var _a;
        const validTransitions = {
            [risk_assessment_request_entity_1.RequestStatus.PENDING]: [
                risk_assessment_request_entity_1.RequestStatus.APPROVED,
                risk_assessment_request_entity_1.RequestStatus.REJECTED,
                risk_assessment_request_entity_1.RequestStatus.CANCELLED,
                risk_assessment_request_entity_1.RequestStatus.IN_PROGRESS,
            ],
            [risk_assessment_request_entity_1.RequestStatus.APPROVED]: [risk_assessment_request_entity_1.RequestStatus.IN_PROGRESS, risk_assessment_request_entity_1.RequestStatus.CANCELLED],
            [risk_assessment_request_entity_1.RequestStatus.REJECTED]: [risk_assessment_request_entity_1.RequestStatus.PENDING],
            [risk_assessment_request_entity_1.RequestStatus.IN_PROGRESS]: [risk_assessment_request_entity_1.RequestStatus.COMPLETED, risk_assessment_request_entity_1.RequestStatus.CANCELLED],
            [risk_assessment_request_entity_1.RequestStatus.COMPLETED]: [],
            [risk_assessment_request_entity_1.RequestStatus.CANCELLED]: [],
        };
        if (!((_a = validTransitions[currentStatus]) === null || _a === void 0 ? void 0 : _a.includes(newStatus))) {
            throw new common_1.BadRequestException(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        }
    }
};
exports.RiskAssessmentRequestService = RiskAssessmentRequestService;
exports.RiskAssessmentRequestService = RiskAssessmentRequestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(risk_assessment_request_entity_1.RiskAssessmentRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(risk_entity_1.Risk)),
    __param(2, (0, typeorm_1.InjectRepository)(risk_assessment_entity_1.RiskAssessment)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => workflow_service_1.WorkflowService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        workflow_service_1.WorkflowService])
], RiskAssessmentRequestService);
//# sourceMappingURL=risk-assessment-request.service.js.map