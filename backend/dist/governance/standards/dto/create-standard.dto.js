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
exports.CreateStandardDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const standard_entity_1 = require("../entities/standard.entity");
class CreateStandardDto {
}
exports.CreateStandardDto = CreateStandardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the standard', example: 'STD-INFOSEC-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateStandardDto.prototype, "standard_identifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the standard', example: 'Information Security Standard' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateStandardDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID of the parent policy' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStandardDto.prototype, "policy_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID of the primary control objective' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStandardDto.prototype, "control_objective_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description of the standard' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStandardDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Full content of the standard document' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStandardDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scope of the standard' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStandardDto.prototype, "scope", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Applicability statement' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStandardDto.prototype, "applicability", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Compliance measurement criteria' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStandardDto.prototype, "compliance_measurement_criteria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Version of the standard', example: '1.0' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStandardDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: standard_entity_1.StandardStatus, default: standard_entity_1.StandardStatus.DRAFT }),
    (0, class_validator_1.IsEnum)(standard_entity_1.StandardStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStandardDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID of the standard owner' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStandardDto.prototype, "owner_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of control objective IDs to link', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStandardDto.prototype, "control_objective_ids", void 0);
//# sourceMappingURL=create-standard.dto.js.map