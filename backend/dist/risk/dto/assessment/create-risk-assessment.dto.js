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
exports.CreateRiskAssessmentDto = void 0;
const class_validator_1 = require("class-validator");
const risk_assessment_entity_1 = require("../../entities/risk-assessment.entity");
class CreateRiskAssessmentDto {
}
exports.CreateRiskAssessmentDto = CreateRiskAssessmentDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "risk_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(risk_assessment_entity_1.AssessmentType),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "assessment_type", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateRiskAssessmentDto.prototype, "likelihood", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateRiskAssessmentDto.prototype, "impact", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(risk_assessment_entity_1.ImpactLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "financial_impact", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRiskAssessmentDto.prototype, "financial_impact_amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(risk_assessment_entity_1.ImpactLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "operational_impact", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(risk_assessment_entity_1.ImpactLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "reputational_impact", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(risk_assessment_entity_1.ImpactLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "compliance_impact", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(risk_assessment_entity_1.ImpactLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "safety_impact", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "assessment_date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "assessment_method", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "assessment_notes", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "assumptions", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(risk_assessment_entity_1.ConfidenceLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskAssessmentDto.prototype, "confidence_level", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateRiskAssessmentDto.prototype, "evidence_attachments", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRiskAssessmentDto.prototype, "is_latest", void 0);
//# sourceMappingURL=create-risk-assessment.dto.js.map