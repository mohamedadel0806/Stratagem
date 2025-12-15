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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetComplianceListResponseDto = exports.AssetComplianceSummaryDto = exports.LinkedControlDto = exports.BulkAssessmentResultDto = exports.ComplianceGapDto = exports.AssetComplianceStatusDto = exports.AssessmentResultDto = exports.RuleEvaluationResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const asset_requirement_mapping_entity_1 = require("../entities/asset-requirement-mapping.entity");
const compliance_assessment_entity_1 = require("../entities/compliance-assessment.entity");
class RuleEvaluationResultDto {
}
exports.RuleEvaluationResultDto = RuleEvaluationResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RuleEvaluationResultDto.prototype, "ruleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RuleEvaluationResultDto.prototype, "ruleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], RuleEvaluationResultDto.prototype, "applicable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: asset_requirement_mapping_entity_1.ComplianceStatus }),
    __metadata("design:type", String)
], RuleEvaluationResultDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RuleEvaluationResultDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], RuleEvaluationResultDto.prototype, "details", void 0);
class AssessmentResultDto {
}
exports.AssessmentResultDto = AssessmentResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssessmentResultDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssessmentResultDto.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssessmentResultDto.prototype, "requirementId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssessmentResultDto.prototype, "requirementTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: asset_requirement_mapping_entity_1.ComplianceStatus }),
    __metadata("design:type", String)
], AssessmentResultDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RuleEvaluationResultDto] }),
    __metadata("design:type", Array)
], AssessmentResultDto.prototype, "ruleResults", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], AssessmentResultDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssessmentResultDto.prototype, "assessedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: compliance_assessment_entity_1.AssessmentType }),
    __metadata("design:type", String)
], AssessmentResultDto.prototype, "assessmentType", void 0);
class AssetComplianceStatusDto {
}
exports.AssetComplianceStatusDto = AssetComplianceStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetComplianceStatusDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetComplianceStatusDto.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatusDto.prototype, "totalRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatusDto.prototype, "compliantCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatusDto.prototype, "nonCompliantCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatusDto.prototype, "partiallyCompliantCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatusDto.prototype, "notAssessedCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatusDto.prototype, "requiresReviewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatusDto.prototype, "notApplicableCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatusDto.prototype, "overallCompliancePercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AssessmentResultDto] }),
    __metadata("design:type", Array)
], AssetComplianceStatusDto.prototype, "requirements", void 0);
class ComplianceGapDto {
}
exports.ComplianceGapDto = ComplianceGapDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ComplianceGapDto.prototype, "requirementId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ComplianceGapDto.prototype, "requirementTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ComplianceGapDto.prototype, "requirementCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: asset_requirement_mapping_entity_1.ComplianceStatus }),
    __metadata("design:type", String)
], ComplianceGapDto.prototype, "currentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ComplianceGapDto.prototype, "gapDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], ComplianceGapDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], ComplianceGapDto.prototype, "missingFields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RuleEvaluationResultDto] }),
    __metadata("design:type", Array)
], ComplianceGapDto.prototype, "failedRules", void 0);
class BulkAssessmentResultDto {
}
exports.BulkAssessmentResultDto = BulkAssessmentResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BulkAssessmentResultDto.prototype, "totalAssessed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BulkAssessmentResultDto.prototype, "successful", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BulkAssessmentResultDto.prototype, "failed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], BulkAssessmentResultDto.prototype, "errors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AssessmentResultDto] }),
    __metadata("design:type", Array)
], BulkAssessmentResultDto.prototype, "results", void 0);
class LinkedControlDto {
}
exports.LinkedControlDto = LinkedControlDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LinkedControlDto.prototype, "controlId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LinkedControlDto.prototype, "controlName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LinkedControlDto.prototype, "controlDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['not_implemented', 'planned', 'in_progress', 'implemented', 'not_applicable'] }),
    __metadata("design:type", String)
], LinkedControlDto.prototype, "implementationStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LinkedControlDto.prototype, "implementationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LinkedControlDto.prototype, "lastTestDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LinkedControlDto.prototype, "lastTestResult", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], LinkedControlDto.prototype, "effectivenessScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], LinkedControlDto.prototype, "isAutomated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LinkedControlDto.prototype, "implementationNotes", void 0);
class AssetComplianceSummaryDto {
}
exports.AssetComplianceSummaryDto = AssetComplianceSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetComplianceSummaryDto.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetComplianceSummaryDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetComplianceSummaryDto.prototype, "assetName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetComplianceSummaryDto.prototype, "assetIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AssetComplianceSummaryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AssetComplianceSummaryDto.prototype, "criticality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AssetComplianceSummaryDto.prototype, "businessUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceSummaryDto.prototype, "totalRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceSummaryDto.prototype, "compliantCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceSummaryDto.prototype, "nonCompliantCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceSummaryDto.prototype, "partiallyCompliantCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceSummaryDto.prototype, "notAssessedCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceSummaryDto.prototype, "overallCompliancePercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceSummaryDto.prototype, "controlsLinkedCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [LinkedControlDto] }),
    __metadata("design:type", Array)
], AssetComplianceSummaryDto.prototype, "linkedControls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetComplianceSummaryDto.prototype, "lastAssessmentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: asset_requirement_mapping_entity_1.ComplianceStatus }),
    __metadata("design:type", String)
], AssetComplianceSummaryDto.prototype, "overallComplianceStatus", void 0);
class AssetComplianceListResponseDto {
}
exports.AssetComplianceListResponseDto = AssetComplianceListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceListResponseDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceListResponseDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AssetComplianceSummaryDto] }),
    __metadata("design:type", Array)
], AssetComplianceListResponseDto.prototype, "assets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssetComplianceListResponseDto.prototype, "complianceSummary", void 0);
//# sourceMappingURL=assessment-response.dto.js.map