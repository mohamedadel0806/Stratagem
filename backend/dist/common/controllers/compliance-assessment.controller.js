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
exports.ComplianceAssessmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const compliance_assessment_service_1 = require("../services/compliance-assessment.service");
const assessment_response_dto_1 = require("../dto/assessment-response.dto");
const assessment_request_dto_1 = require("../dto/assessment-request.dto");
const validation_rule_dto_1 = require("../dto/validation-rule.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
const asset_requirement_mapping_entity_1 = require("../entities/asset-requirement-mapping.entity");
let ComplianceAssessmentController = class ComplianceAssessmentController {
    constructor(assessmentService) {
        this.assessmentService = assessmentService;
    }
    async assessAssetRequirement(assetType, assetId, requirementId, user) {
        return this.assessmentService.assessAssetRequirement(assetType, assetId, requirementId, user.id);
    }
    async assessAsset(assetType, assetId, user) {
        return this.assessmentService.assessAsset(assetType, assetId, user.id);
    }
    async getAssetComplianceStatus(assetType, assetId) {
        return this.assessmentService.getAssetComplianceStatus(assetType, assetId);
    }
    async getComplianceGaps(assetType, assetId) {
        return this.assessmentService.getComplianceGaps(assetType, assetId);
    }
    async getAssetComplianceList(assetType, complianceStatus, businessUnit, criticality, searchQuery, page = 1, pageSize = 20) {
        try {
            return await this.assessmentService.getAssetComplianceList({
                assetType,
                complianceStatus,
                businessUnit,
                criticality,
                searchQuery,
            }, { page: Math.max(1, page), pageSize: Math.min(100, Math.max(1, pageSize)) });
        }
        catch (error) {
            console.error('Error in getAssetComplianceList controller:', error);
            throw error;
        }
    }
    async bulkAssess(dto, user) {
        return this.assessmentService.bulkAssess(dto.assetType, dto.assetIds, user.id);
    }
    async getAssessmentHistory(assetType, assetId, requirementId, limit, offset) {
        return { message: 'Assessment history endpoint - to be implemented' };
    }
    async createValidationRule(createDto, user) {
        return this.assessmentService.createValidationRule(createDto, user.id);
    }
    async findAllValidationRules(requirementId, assetType) {
        return this.assessmentService.findAllValidationRules(requirementId, assetType);
    }
    async findValidationRuleById(id) {
        return this.assessmentService.findValidationRuleById(id);
    }
    async updateValidationRule(id, updateDto) {
        return this.assessmentService.updateValidationRule(id, updateDto);
    }
    async deleteValidationRule(id) {
        await this.assessmentService.deleteValidationRule(id);
        return { message: 'Validation rule deleted successfully' };
    }
};
exports.ComplianceAssessmentController = ComplianceAssessmentController;
__decorate([
    (0, common_1.Post)('assets/:assetType/:assetId/requirements/:requirementId'),
    (0, swagger_1.ApiOperation)({ summary: 'Assess a single asset against a specific requirement' }),
    (0, swagger_1.ApiParam)({ name: 'assetType', enum: asset_requirement_mapping_entity_1.AssetTypeEnum }),
    (0, swagger_1.ApiParam)({ name: 'assetId', description: 'Asset ID' }),
    (0, swagger_1.ApiParam)({ name: 'requirementId', description: 'Requirement ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment result', type: assessment_response_dto_1.AssessmentResultDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset or requirement not found' }),
    __param(0, (0, common_1.Param)('assetType', new common_1.ParseEnumPipe(asset_requirement_mapping_entity_1.AssetTypeEnum))),
    __param(1, (0, common_1.Param)('assetId')),
    __param(2, (0, common_1.Param)('requirementId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "assessAssetRequirement", null);
__decorate([
    (0, common_1.Post)('assets/:assetType/:assetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Assess all requirements for an asset' }),
    (0, swagger_1.ApiParam)({ name: 'assetType', enum: asset_requirement_mapping_entity_1.AssetTypeEnum }),
    (0, swagger_1.ApiParam)({ name: 'assetId', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of assessment results', type: [assessment_response_dto_1.AssessmentResultDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found' }),
    __param(0, (0, common_1.Param)('assetType', new common_1.ParseEnumPipe(asset_requirement_mapping_entity_1.AssetTypeEnum))),
    __param(1, (0, common_1.Param)('assetId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "assessAsset", null);
__decorate([
    (0, common_1.Get)('assets/:assetType/:assetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get compliance status for an asset' }),
    (0, swagger_1.ApiParam)({ name: 'assetType', enum: asset_requirement_mapping_entity_1.AssetTypeEnum }),
    (0, swagger_1.ApiParam)({ name: 'assetId', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset compliance status', type: assessment_response_dto_1.AssetComplianceStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found' }),
    __param(0, (0, common_1.Param)('assetType', new common_1.ParseEnumPipe(asset_requirement_mapping_entity_1.AssetTypeEnum))),
    __param(1, (0, common_1.Param)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "getAssetComplianceStatus", null);
__decorate([
    (0, common_1.Get)('assets/:assetType/:assetId/gaps'),
    (0, swagger_1.ApiOperation)({ summary: 'Get compliance gaps for an asset' }),
    (0, swagger_1.ApiParam)({ name: 'assetType', enum: asset_requirement_mapping_entity_1.AssetTypeEnum }),
    (0, swagger_1.ApiParam)({ name: 'assetId', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of compliance gaps', type: [assessment_response_dto_1.ComplianceGapDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found' }),
    __param(0, (0, common_1.Param)('assetType', new common_1.ParseEnumPipe(asset_requirement_mapping_entity_1.AssetTypeEnum))),
    __param(1, (0, common_1.Param)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "getComplianceGaps", null);
__decorate([
    (0, common_1.Get)('assets-compliance-list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of all assets with compliance status' }),
    (0, swagger_1.ApiQuery)({ name: 'assetType', required: false, enum: asset_requirement_mapping_entity_1.AssetTypeEnum, description: 'Filter by asset type' }),
    (0, swagger_1.ApiQuery)({ name: 'complianceStatus', required: false, description: 'Filter by compliance status' }),
    (0, swagger_1.ApiQuery)({ name: 'businessUnit', required: false, description: 'Filter by business unit' }),
    (0, swagger_1.ApiQuery)({ name: 'criticality', required: false, description: 'Filter by criticality level' }),
    (0, swagger_1.ApiQuery)({ name: 'searchQuery', required: false, description: 'Search query for asset name/identifier' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size (default: 20)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of assets with compliance status', type: assessment_response_dto_1.AssetComplianceListResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)('assetType')),
    __param(1, (0, common_1.Query)('complianceStatus')),
    __param(2, (0, common_1.Query)('businessUnit')),
    __param(3, (0, common_1.Query)('criticality')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "getAssetComplianceList", null);
__decorate([
    (0, common_1.Post)('bulk-assess'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk assess multiple assets' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bulk assessment results', type: assessment_response_dto_1.BulkAssessmentResultDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assessment_request_dto_1.BulkAssessRequestDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "bulkAssess", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get assessment history' }),
    (0, swagger_1.ApiQuery)({ name: 'assetType', required: false, enum: ['physical', 'information', 'application', 'software', 'supplier'] }),
    (0, swagger_1.ApiQuery)({ name: 'assetId', required: false, description: 'Asset ID' }),
    (0, swagger_1.ApiQuery)({ name: 'requirementId', required: false, description: 'Requirement ID' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Limit results' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number, description: 'Offset results' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment history' }),
    __param(0, (0, common_1.Query)('assetType')),
    __param(1, (0, common_1.Query)('assetId')),
    __param(2, (0, common_1.Query)('requirementId')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "getAssessmentHistory", null);
__decorate([
    (0, common_1.Post)('rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new validation rule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Validation rule created', type: validation_rule_dto_1.ValidationRuleResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Requirement not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validation_rule_dto_1.CreateValidationRuleDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "createValidationRule", null);
__decorate([
    (0, common_1.Get)('rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all validation rules' }),
    (0, swagger_1.ApiQuery)({ name: 'requirementId', required: false, description: 'Filter by requirement ID' }),
    (0, swagger_1.ApiQuery)({ name: 'assetType', required: false, enum: asset_requirement_mapping_entity_1.AssetTypeEnum, description: 'Filter by asset type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of validation rules', type: [validation_rule_dto_1.ValidationRuleResponseDto] }),
    __param(0, (0, common_1.Query)('requirementId')),
    __param(1, (0, common_1.Query)('assetType', new common_1.ParseEnumPipe(asset_requirement_mapping_entity_1.AssetTypeEnum, { optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "findAllValidationRules", null);
__decorate([
    (0, common_1.Get)('rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a validation rule by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Validation rule ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation rule details', type: validation_rule_dto_1.ValidationRuleResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Validation rule not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "findValidationRuleById", null);
__decorate([
    (0, common_1.Put)('rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a validation rule' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Validation rule ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation rule updated', type: validation_rule_dto_1.ValidationRuleResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Validation rule not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, validation_rule_dto_1.UpdateValidationRuleDto]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "updateValidationRule", null);
__decorate([
    (0, common_1.Delete)('rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a validation rule' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Validation rule ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation rule deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Validation rule not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "deleteValidationRule", null);
exports.ComplianceAssessmentController = ComplianceAssessmentController = __decorate([
    (0, swagger_1.ApiTags)('compliance-assessments'),
    (0, common_1.Controller)('compliance/assessments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [compliance_assessment_service_1.ComplianceAssessmentService])
], ComplianceAssessmentController);
//# sourceMappingURL=compliance-assessment.controller.js.map