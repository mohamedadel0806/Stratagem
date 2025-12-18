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
exports.CreateValidationRuleDto = void 0;
const class_validator_1 = require("class-validator");
const validation_rule_entity_1 = require("../entities/validation-rule.entity");
class CreateValidationRuleDto {
}
exports.CreateValidationRuleDto = CreateValidationRuleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(validation_rule_entity_1.AssetType),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "assetType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "fieldName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(validation_rule_entity_1.ValidationType),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "validationType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "regexPattern", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateValidationRuleDto.prototype, "minLength", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateValidationRuleDto.prototype, "maxLength", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateValidationRuleDto.prototype, "minValue", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateValidationRuleDto.prototype, "maxValue", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "customValidationScript", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "errorMessage", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(validation_rule_entity_1.ValidationSeverity),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateValidationRuleDto.prototype, "severity", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateValidationRuleDto.prototype, "dependencies", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateValidationRuleDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateValidationRuleDto.prototype, "applyToImport", void 0);
//# sourceMappingURL=create-validation-rule.dto.js.map