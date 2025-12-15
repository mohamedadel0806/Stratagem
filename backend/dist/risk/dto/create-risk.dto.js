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
exports.CreateRiskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const risk_entity_1 = require("../entities/risk.entity");
class CreateRiskDto {
}
exports.CreateRiskDto = CreateRiskDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Risk statement in If/Then/Resulting format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "risk_statement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskCategory_OLD }),
    (0, class_validator_1.IsEnum)(risk_entity_1.RiskCategory_OLD),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Reference to risk_categories table' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Reference to sub-category in risk_categories table' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskStatus, required: false, default: risk_entity_1.RiskStatus.IDENTIFIED }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(risk_entity_1.RiskStatus),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskLikelihood, required: false, default: risk_entity_1.RiskLikelihood.MEDIUM }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(risk_entity_1.RiskLikelihood),
    __metadata("design:type", Number)
], CreateRiskDto.prototype, "likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskImpact, required: false, default: risk_entity_1.RiskImpact.MEDIUM }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(risk_entity_1.RiskImpact),
    __metadata("design:type", Number)
], CreateRiskDto.prototype, "impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "risk_analyst_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "date_identified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.ThreatSource, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(risk_entity_1.ThreatSource),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "threat_source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: risk_entity_1.RiskVelocity, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(risk_entity_1.RiskVelocity),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "risk_velocity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "early_warning_signs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "status_notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "business_process", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateRiskDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateRiskDto.prototype, "business_unit_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "next_review_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateRiskDto.prototype, "inherent_likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateRiskDto.prototype, "inherent_impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateRiskDto.prototype, "current_likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateRiskDto.prototype, "current_impact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateRiskDto.prototype, "target_likelihood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateRiskDto.prototype, "target_impact", void 0);
//# sourceMappingURL=create-risk.dto.js.map