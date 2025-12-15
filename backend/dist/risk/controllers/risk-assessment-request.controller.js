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
exports.RiskAssessmentRequestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const risk_assessment_request_service_1 = require("../services/risk-assessment-request.service");
const create_risk_assessment_request_dto_1 = require("../dto/request/create-risk-assessment-request.dto");
const update_risk_assessment_request_dto_1 = require("../dto/request/update-risk-assessment-request.dto");
const risk_assessment_request_entity_1 = require("../entities/risk-assessment-request.entity");
let RiskAssessmentRequestController = class RiskAssessmentRequestController {
    constructor(requestService) {
        this.requestService = requestService;
    }
    async findAll(riskId, requestedById, requestedForId, status, assessmentType) {
        return this.requestService.findAll({
            riskId,
            requestedById,
            requestedForId,
            status,
            assessmentType,
        });
    }
    async findPending(req) {
        var _a;
        return this.requestService.findPendingForUser((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async findByRiskId(riskId) {
        return this.requestService.findByRiskId(riskId);
    }
    async findOne(id) {
        return this.requestService.findOne(id);
    }
    async create(createDto, req) {
        var _a, _b, _c;
        return this.requestService.create(createDto, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id), (_c = req.user) === null || _c === void 0 ? void 0 : _c.organizationId);
    }
    async update(id, updateDto, req) {
        var _a;
        return this.requestService.update(id, updateDto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async approve(id, req) {
        var _a;
        return this.requestService.approve(id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async reject(id, reason, req) {
        var _a;
        return this.requestService.reject(id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, reason);
    }
    async cancel(id, req) {
        var _a;
        return this.requestService.cancel(id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async markInProgress(id, req) {
        var _a;
        return this.requestService.markInProgress(id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async complete(id, assessmentId, req) {
        var _a;
        return this.requestService.complete(id, assessmentId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async remove(id) {
        await this.requestService.remove(id);
        return { message: 'Assessment request deleted successfully' };
    }
};
exports.RiskAssessmentRequestController = RiskAssessmentRequestController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all assessment requests with optional filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of assessment requests' }),
    __param(0, (0, common_1.Query)('riskId')),
    __param(1, (0, common_1.Query)('requestedById')),
    __param(2, (0, common_1.Query)('requestedForId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('assessmentType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], RiskAssessmentRequestController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending requests for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of pending requests assigned to user' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RiskAssessmentRequestController.prototype, "findPending", null);
__decorate([
    (0, common_1.Get)('risk/:riskId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all requests for a specific risk' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of assessment requests for the risk' }),
    __param(0, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskAssessmentRequestController.prototype, "findByRiskId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single assessment request by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment request details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskAssessmentRequestController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new assessment request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Assessment request created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Risk not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_risk_assessment_request_dto_1.CreateRiskAssessmentRequestDto, Object]),
    __metadata("design:returntype", Promise)
], RiskAssessmentRequestController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an assessment request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment request updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_risk_assessment_request_dto_1.UpdateRiskAssessmentRequestDto, Object]),
    __metadata("design:returntype", Promise)
], RiskAssessmentRequestController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve an assessment request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request approved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RiskAssessmentRequestController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject an assessment request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request rejected successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RiskAssessmentRequestController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an assessment request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request cancelled successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RiskAssessmentRequestController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/in-progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark request as in progress' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request marked as in progress' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RiskAssessmentRequestController.prototype, "markInProgress", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete a request and link to assessment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request completed and linked to assessment' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('assessmentId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RiskAssessmentRequestController.prototype, "complete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an assessment request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete request in current status' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskAssessmentRequestController.prototype, "remove", null);
exports.RiskAssessmentRequestController = RiskAssessmentRequestController = __decorate([
    (0, swagger_1.ApiTags)('Risk Assessment Requests'),
    (0, common_1.Controller)('risk-assessment-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [risk_assessment_request_service_1.RiskAssessmentRequestService])
], RiskAssessmentRequestController);
//# sourceMappingURL=risk-assessment-request.controller.js.map