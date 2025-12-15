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
exports.CustomReportConfigDto = exports.BatchWhatIfRequestDto = exports.WhatIfScenarioResponseDto = exports.WhatIfScenarioRequestDto = exports.RiskComparisonResponseDto = exports.RiskComparisonDataDto = exports.RiskComparisonRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RiskComparisonRequestDto {
}
exports.RiskComparisonRequestDto = RiskComparisonRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of risk IDs to compare', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], RiskComparisonRequestDto.prototype, "risk_ids", void 0);
class RiskComparisonDataDto {
}
exports.RiskComparisonDataDto = RiskComparisonDataDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskComparisonDataDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskComparisonDataDto.prototype, "risk_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskComparisonDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskComparisonDataDto.prototype, "category_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskComparisonDataDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskComparisonDataDto.prototype, "owner_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "inherent_likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "inherent_impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "inherent_risk_score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskComparisonDataDto.prototype, "inherent_risk_level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "current_likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "current_impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "current_risk_score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskComparisonDataDto.prototype, "current_risk_level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "target_likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "target_impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "target_risk_score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RiskComparisonDataDto.prototype, "target_risk_level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "control_effectiveness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "linked_controls_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "linked_assets_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "active_treatments_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "kri_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Risk reduction from inherent to current (%)' }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "risk_reduction_percentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gap between current and target score' }),
    __metadata("design:type", Number)
], RiskComparisonDataDto.prototype, "gap_to_target", void 0);
class RiskComparisonResponseDto {
}
exports.RiskComparisonResponseDto = RiskComparisonResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RiskComparisonDataDto] }),
    __metadata("design:type", Array)
], RiskComparisonResponseDto.prototype, "risks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Summary statistics for the compared risks' }),
    __metadata("design:type", Object)
], RiskComparisonResponseDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Comparison matrix showing differences between risks' }),
    __metadata("design:type", Array)
], RiskComparisonResponseDto.prototype, "comparison_matrix", void 0);
class WhatIfScenarioRequestDto {
}
exports.WhatIfScenarioRequestDto = WhatIfScenarioRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Risk ID to simulate' }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], WhatIfScenarioRequestDto.prototype, "risk_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Simulated likelihood value', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], WhatIfScenarioRequestDto.prototype, "simulated_likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Simulated impact value', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], WhatIfScenarioRequestDto.prototype, "simulated_impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Simulated control effectiveness (%)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], WhatIfScenarioRequestDto.prototype, "simulated_control_effectiveness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of additional controls to simulate', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], WhatIfScenarioRequestDto.prototype, "additional_controls", void 0);
class WhatIfScenarioResponseDto {
}
exports.WhatIfScenarioResponseDto = WhatIfScenarioResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original risk data' }),
    __metadata("design:type", Object)
], WhatIfScenarioResponseDto.prototype, "original", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Simulated risk data' }),
    __metadata("design:type", Object)
], WhatIfScenarioResponseDto.prototype, "simulated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Impact analysis' }),
    __metadata("design:type", Object)
], WhatIfScenarioResponseDto.prototype, "impact_analysis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Risk level details from settings' }),
    __metadata("design:type", Object)
], WhatIfScenarioResponseDto.prototype, "risk_level_details", void 0);
class BatchWhatIfRequestDto {
}
exports.BatchWhatIfRequestDto = BatchWhatIfRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Risk ID to simulate' }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], BatchWhatIfRequestDto.prototype, "risk_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of scenarios to simulate', type: [WhatIfScenarioRequestDto] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], BatchWhatIfRequestDto.prototype, "scenarios", void 0);
class CustomReportConfigDto {
}
exports.CustomReportConfigDto = CustomReportConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report name' }),
    __metadata("design:type", String)
], CustomReportConfigDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fields to include in report', type: [String] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CustomReportConfigDto.prototype, "fields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by risk levels', type: [String], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CustomReportConfigDto.prototype, "risk_levels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by categories', type: [String], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CustomReportConfigDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by status', type: [String], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CustomReportConfigDto.prototype, "statuses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by owner IDs', type: [String], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CustomReportConfigDto.prototype, "owner_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Include only risks exceeding appetite', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CustomReportConfigDto.prototype, "exceeds_appetite_only", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sort field', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CustomReportConfigDto.prototype, "sort_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sort direction', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CustomReportConfigDto.prototype, "sort_direction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Group by field', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CustomReportConfigDto.prototype, "group_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Include summary statistics', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CustomReportConfigDto.prototype, "include_summary", void 0);
//# sourceMappingURL=risk-comparison.dto.js.map