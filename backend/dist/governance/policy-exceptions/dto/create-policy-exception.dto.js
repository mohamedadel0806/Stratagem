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
exports.CreatePolicyExceptionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const policy_exception_entity_1 = require("../entities/policy-exception.entity");
class CreatePolicyExceptionDto {
}
exports.CreatePolicyExceptionDto = CreatePolicyExceptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Exception identifier (auto-generated if not provided)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePolicyExceptionDto.prototype, "exception_identifier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: Object.values(policy_exception_entity_1.ExceptionType), description: 'Type of exception' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(policy_exception_entity_1.ExceptionType),
    __metadata("design:type", String)
], CreatePolicyExceptionDto.prototype, "exception_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the entity (policy, standard, control, baseline)' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePolicyExceptionDto.prototype, "entity_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Type of entity (policy, standard, control, baseline)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyExceptionDto.prototype, "entity_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Requesting business unit ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePolicyExceptionDto.prototype, "requesting_business_unit_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business justification for the exception' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyExceptionDto.prototype, "business_justification", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Compensating controls in place' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyExceptionDto.prototype, "compensating_controls", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Risk assessment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyExceptionDto.prototype, "risk_assessment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Exception start date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePolicyExceptionDto.prototype, "start_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Exception end date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePolicyExceptionDto.prototype, "end_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Auto-expire when end date is reached', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePolicyExceptionDto.prototype, "auto_expire", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Next review date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePolicyExceptionDto.prototype, "next_review_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Supporting documents' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePolicyExceptionDto.prototype, "supporting_documents", void 0);
//# sourceMappingURL=create-policy-exception.dto.js.map