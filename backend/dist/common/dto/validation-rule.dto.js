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
exports.ValidationRuleResponseDto = exports.UpdateValidationRuleDto = exports.CreateValidationRuleDto = exports.ConditionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ConditionDto {
}
exports.ConditionDto = ConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConditionDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'in', 'not_in', 'exists', 'not_exists'] }),
    (0, class_validator_1.IsEnum)(['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'in', 'not_in', 'exists', 'not_exists']),
    __metadata("design:type", String)
], ConditionDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ConditionDto.prototype, "value", void 0);
class CreateValidationRuleDto {
}
exports.CreateValidationRuleDto = CreateValidationRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "requirementId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['physical', 'information', 'application', 'software', 'supplier'] }),
    (0, class_validator_1.IsEnum)(['physical', 'information', 'application', 'software', 'supplier']),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "ruleName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "ruleDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateValidationRuleDto.prototype, "validationLogic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateValidationRuleDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateValidationRuleDto.prototype, "isActive", void 0);
class UpdateValidationRuleDto {
}
exports.UpdateValidationRuleDto = UpdateValidationRuleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateValidationRuleDto.prototype, "ruleName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateValidationRuleDto.prototype, "ruleDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateValidationRuleDto.prototype, "validationLogic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateValidationRuleDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateValidationRuleDto.prototype, "isActive", void 0);
class ValidationRuleResponseDto {
}
exports.ValidationRuleResponseDto = ValidationRuleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ValidationRuleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ValidationRuleResponseDto.prototype, "requirementId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ValidationRuleResponseDto.prototype, "requirementTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ValidationRuleResponseDto.prototype, "requirementCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ValidationRuleResponseDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ValidationRuleResponseDto.prototype, "ruleName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ValidationRuleResponseDto.prototype, "ruleDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    __metadata("design:type", Object)
], ValidationRuleResponseDto.prototype, "validationLogic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ValidationRuleResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ValidationRuleResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ValidationRuleResponseDto.prototype, "createdById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ValidationRuleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ValidationRuleResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=validation-rule.dto.js.map