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
exports.CreateComplianceObligationDto = void 0;
const class_validator_1 = require("class-validator");
const compliance_obligation_entity_1 = require("../entities/compliance-obligation.entity");
class CreateComplianceObligationDto {
}
exports.CreateComplianceObligationDto = CreateComplianceObligationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplianceObligationDto.prototype, "obligation_identifier", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateComplianceObligationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplianceObligationDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplianceObligationDto.prototype, "influencer_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplianceObligationDto.prototype, "source_reference", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplianceObligationDto.prototype, "owner_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplianceObligationDto.prototype, "business_unit_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(compliance_obligation_entity_1.ObligationStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplianceObligationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(compliance_obligation_entity_1.ObligationPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplianceObligationDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplianceObligationDto.prototype, "due_date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplianceObligationDto.prototype, "evidence_summary", void 0);
//# sourceMappingURL=create-obligation.dto.js.map