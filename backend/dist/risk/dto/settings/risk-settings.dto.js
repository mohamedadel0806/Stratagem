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
exports.RiskSettingsResponseDto = exports.UpdateRiskSettingsDto = exports.ScaleDescriptionDto = exports.AssessmentMethodConfigDto = exports.RiskLevelConfigDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class RiskLevelConfigDto {
}
exports.RiskLevelConfigDto = RiskLevelConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RiskLevelConfigDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(25),
    __metadata("design:type", Number)
], RiskLevelConfigDto.prototype, "minScore", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(25),
    __metadata("design:type", Number)
], RiskLevelConfigDto.prototype, "maxScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RiskLevelConfigDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RiskLevelConfigDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RiskLevelConfigDto.prototype, "responseTime", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RiskLevelConfigDto.prototype, "escalation", void 0);
class AssessmentMethodConfigDto {
}
exports.AssessmentMethodConfigDto = AssessmentMethodConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssessmentMethodConfigDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssessmentMethodConfigDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssessmentMethodConfigDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(3),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], AssessmentMethodConfigDto.prototype, "likelihoodScale", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(3),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], AssessmentMethodConfigDto.prototype, "impactScale", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AssessmentMethodConfigDto.prototype, "isDefault", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AssessmentMethodConfigDto.prototype, "isActive", void 0);
class ScaleDescriptionDto {
}
exports.ScaleDescriptionDto = ScaleDescriptionDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], ScaleDescriptionDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScaleDescriptionDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScaleDescriptionDto.prototype, "description", void 0);
class UpdateRiskSettingsDto {
}
exports.UpdateRiskSettingsDto = UpdateRiskSettingsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RiskLevelConfigDto),
    __metadata("design:type", Array)
], UpdateRiskSettingsDto.prototype, "risk_levels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AssessmentMethodConfigDto),
    __metadata("design:type", Array)
], UpdateRiskSettingsDto.prototype, "assessment_methods", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ScaleDescriptionDto),
    __metadata("design:type", Array)
], UpdateRiskSettingsDto.prototype, "likelihood_scale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ScaleDescriptionDto),
    __metadata("design:type", Array)
], UpdateRiskSettingsDto.prototype, "impact_scale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(25),
    __metadata("design:type", Number)
], UpdateRiskSettingsDto.prototype, "max_acceptable_risk_score", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiskSettingsDto.prototype, "risk_acceptance_authority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    __metadata("design:type", Number)
], UpdateRiskSettingsDto.prototype, "default_review_period_days", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRiskSettingsDto.prototype, "auto_calculate_risk_score", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRiskSettingsDto.prototype, "require_assessment_evidence", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRiskSettingsDto.prototype, "enable_risk_appetite", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiskSettingsDto.prototype, "default_assessment_method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRiskSettingsDto.prototype, "notify_on_high_risk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRiskSettingsDto.prototype, "notify_on_critical_risk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRiskSettingsDto.prototype, "notify_on_review_due", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(30),
    __metadata("design:type", Number)
], UpdateRiskSettingsDto.prototype, "review_reminder_days", void 0);
class RiskSettingsResponseDto {
}
exports.RiskSettingsResponseDto = RiskSettingsResponseDto;
//# sourceMappingURL=risk-settings.dto.js.map