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
exports.CreateRiskTreatmentDto = void 0;
const class_validator_1 = require("class-validator");
const risk_treatment_entity_1 = require("../../entities/risk-treatment.entity");
class CreateRiskTreatmentDto {
}
exports.CreateRiskTreatmentDto = CreateRiskTreatmentDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRiskTreatmentDto.prototype, "risk_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(risk_treatment_entity_1.TreatmentStrategy),
    __metadata("design:type", String)
], CreateRiskTreatmentDto.prototype, "strategy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateRiskTreatmentDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskTreatmentDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskTreatmentDto.prototype, "treatment_owner_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(risk_treatment_entity_1.TreatmentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskTreatmentDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(risk_treatment_entity_1.TreatmentPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskTreatmentDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskTreatmentDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskTreatmentDto.prototype, "target_completion_date", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRiskTreatmentDto.prototype, "estimated_cost", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskTreatmentDto.prototype, "expected_risk_reduction", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRiskTreatmentDto.prototype, "residual_likelihood", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRiskTreatmentDto.prototype, "residual_impact", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRiskTreatmentDto.prototype, "implementation_notes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateRiskTreatmentDto.prototype, "linked_control_ids", void 0);
//# sourceMappingURL=create-risk-treatment.dto.js.map