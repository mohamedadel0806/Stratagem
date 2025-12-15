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
exports.RiskDashboardSummaryDto = exports.RiskHeatmapResponseDto = exports.RiskHeatmapCellDto = exports.RiskListResponseDto = exports.RiskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const risk_entity_1 = require("../entities/risk.entity");
class RiskResponseDto {
}
exports.RiskResponseDto = RiskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Auto-generated risk identifier (RISK-XXXX)' }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "risk_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Risk statement in If/Then/Resulting format' }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "risk_statement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskCategory_OLD }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "category_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "sub_category_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskStatus }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskLikelihood }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskImpact }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "owner_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "risk_analyst_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "risk_analyst_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "date_identified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "next_review_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "last_review_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.ThreatSource, required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "threat_source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskVelocity, required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "risk_velocity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "early_warning_signs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "status_notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "business_process", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [String] }),
    __metadata("design:type", Array)
], RiskResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [String] }),
    __metadata("design:type", Array)
], RiskResponseDto.prototype, "business_unit_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "version_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "inherent_likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "inherent_impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "inherent_risk_score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskLevel, required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "inherent_risk_level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "current_likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "current_impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "current_risk_score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskLevel, required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "current_risk_level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "target_likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "target_impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "target_risk_score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskLevel, required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "target_risk_level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Overall control effectiveness percentage (0-100)' }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "control_effectiveness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "linked_assets_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "linked_controls_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "active_treatments_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskResponseDto.prototype, "kri_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Whether this risk exceeds the organization risk appetite' }),
    __metadata("design:type", Boolean)
], RiskResponseDto.prototype, "exceeds_risk_appetite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Whether this risk requires escalation based on risk level settings' }),
    __metadata("design:type", Boolean)
], RiskResponseDto.prototype, "requires_escalation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Recommended response time from settings' }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "recommended_response_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Risk level color from settings' }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "risk_level_color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskResponseDto.prototype, "updatedAt", void 0);
class RiskListResponseDto {
}
exports.RiskListResponseDto = RiskListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RiskResponseDto] }),
    __metadata("design:type", Array)
], RiskListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskListResponseDto.prototype, "limit", void 0);
class RiskHeatmapCellDto {
}
exports.RiskHeatmapCellDto = RiskHeatmapCellDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskHeatmapCellDto.prototype, "likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskHeatmapCellDto.prototype, "impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskHeatmapCellDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskHeatmapCellDto.prototype, "riskScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], RiskHeatmapCellDto.prototype, "riskIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskLevel }),
    __metadata("design:type", String)
], RiskHeatmapCellDto.prototype, "riskLevel", void 0);
class RiskHeatmapResponseDto {
}
exports.RiskHeatmapResponseDto = RiskHeatmapResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RiskHeatmapCellDto] }),
    __metadata("design:type", Array)
], RiskHeatmapResponseDto.prototype, "cells", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskHeatmapResponseDto.prototype, "totalRisks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskHeatmapResponseDto.prototype, "maxRiskScore", void 0);
class RiskDashboardSummaryDto {
}
exports.RiskDashboardSummaryDto = RiskDashboardSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskDashboardSummaryDto.prototype, "total_risks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskDashboardSummaryDto.prototype, "critical_risks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskDashboardSummaryDto.prototype, "high_risks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskDashboardSummaryDto.prototype, "medium_risks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskDashboardSummaryDto.prototype, "low_risks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of risks exceeding organization risk appetite threshold' }),
    __metadata("design:type", Number)
], RiskDashboardSummaryDto.prototype, "risks_exceeding_appetite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum acceptable risk score from settings', required: false }),
    __metadata("design:type", Number)
], RiskDashboardSummaryDto.prototype, "max_acceptable_score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether risk appetite checking is enabled', required: false }),
    __metadata("design:type", Boolean)
], RiskDashboardSummaryDto.prototype, "risk_appetite_enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskDashboardSummaryDto.prototype, "overdue_reviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskDashboardSummaryDto.prototype, "active_treatments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskDashboardSummaryDto.prototype, "kri_red_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskDashboardSummaryDto.prototype, "kri_amber_count", void 0);
//# sourceMappingURL=risk-response.dto.js.map