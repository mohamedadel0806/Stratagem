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
exports.RiskAssessmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const risk_assessment_service_1 = require("../services/risk-assessment.service");
const create_risk_assessment_dto_1 = require("../dto/assessment/create-risk-assessment.dto");
const risk_assessment_entity_1 = require("../entities/risk-assessment.entity");
let RiskAssessmentController = class RiskAssessmentController {
    constructor(assessmentService) {
        this.assessmentService = assessmentService;
    }
    async getLikelihoodScale(req) {
        var _a;
        return this.assessmentService.getLikelihoodScaleDescriptions((_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
    }
    async getImpactScale(req) {
        var _a;
        return this.assessmentService.getImpactScaleDescriptions((_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
    }
    async findByRiskId(riskId, assessmentType) {
        return this.assessmentService.findByRiskId(riskId, assessmentType);
    }
    async findLatestByRiskId(riskId) {
        return this.assessmentService.findLatestByRiskId(riskId);
    }
    async compareAssessments(riskId) {
        return this.assessmentService.compareAssessments(riskId);
    }
    async getHistory(riskId, limit) {
        return this.assessmentService.getAssessmentHistory(riskId, limit || 10);
    }
    async findOne(id) {
        return this.assessmentService.findOne(id);
    }
    async create(createDto, req) {
        var _a, _b;
        return this.assessmentService.create(createDto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.organizationId);
    }
};
exports.RiskAssessmentController = RiskAssessmentController;
__decorate([
    (0, common_1.Get)('scales/likelihood'),
    (0, swagger_1.ApiOperation)({ summary: 'Get likelihood scale descriptions from settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Likelihood scale with labels and descriptions' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RiskAssessmentController.prototype, "getLikelihoodScale", null);
__decorate([
    (0, common_1.Get)('scales/impact'),
    (0, swagger_1.ApiOperation)({ summary: 'Get impact scale descriptions from settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Impact scale with labels and descriptions' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RiskAssessmentController.prototype, "getImpactScale", null);
__decorate([
    (0, common_1.Get)('risk/:riskId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all assessments for a risk' }),
    __param(0, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RiskAssessmentController.prototype, "findByRiskId", null);
__decorate([
    (0, common_1.Get)('risk/:riskId/latest'),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest assessments by type for a risk' }),
    __param(0, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskAssessmentController.prototype, "findLatestByRiskId", null);
__decorate([
    (0, common_1.Get)('risk/:riskId/compare'),
    (0, swagger_1.ApiOperation)({ summary: 'Compare inherent, current, and target assessments' }),
    __param(0, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskAssessmentController.prototype, "compareAssessments", null);
__decorate([
    (0, common_1.Get)('risk/:riskId/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get assessment history for a risk' }),
    __param(0, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], RiskAssessmentController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single assessment by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskAssessmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new risk assessment with settings validation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Assessment created with appetite warnings if applicable' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_risk_assessment_dto_1.CreateRiskAssessmentDto, Object]),
    __metadata("design:returntype", Promise)
], RiskAssessmentController.prototype, "create", null);
exports.RiskAssessmentController = RiskAssessmentController = __decorate([
    (0, swagger_1.ApiTags)('Risk Assessments'),
    (0, common_1.Controller)('risk-assessments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [risk_assessment_service_1.RiskAssessmentService])
], RiskAssessmentController);
//# sourceMappingURL=risk-assessment.controller.js.map