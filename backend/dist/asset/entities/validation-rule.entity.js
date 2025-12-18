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
exports.ValidationRule = exports.ValidationSeverity = exports.ValidationType = exports.AssetType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var AssetType;
(function (AssetType) {
    AssetType["PHYSICAL"] = "physical";
    AssetType["INFORMATION"] = "information";
    AssetType["APPLICATION"] = "application";
    AssetType["SOFTWARE"] = "software";
    AssetType["SUPPLIER"] = "supplier";
    AssetType["ALL"] = "all";
})(AssetType || (exports.AssetType = AssetType = {}));
var ValidationType;
(function (ValidationType) {
    ValidationType["REQUIRED"] = "required";
    ValidationType["REGEX"] = "regex";
    ValidationType["MIN_LENGTH"] = "min_length";
    ValidationType["MAX_LENGTH"] = "max_length";
    ValidationType["MIN_VALUE"] = "min_value";
    ValidationType["MAX_VALUE"] = "max_value";
    ValidationType["EMAIL"] = "email";
    ValidationType["URL"] = "url";
    ValidationType["DATE"] = "date";
    ValidationType["CUSTOM"] = "custom";
})(ValidationType || (exports.ValidationType = ValidationType = {}));
var ValidationSeverity;
(function (ValidationSeverity) {
    ValidationSeverity["ERROR"] = "error";
    ValidationSeverity["WARNING"] = "warning";
})(ValidationSeverity || (exports.ValidationSeverity = ValidationSeverity = {}));
let ValidationRule = class ValidationRule {
};
exports.ValidationRule = ValidationRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ValidationRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ValidationRule.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ValidationRule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetType,
    }),
    __metadata("design:type", String)
], ValidationRule.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ValidationRule.prototype, "fieldName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ValidationType,
    }),
    __metadata("design:type", String)
], ValidationRule.prototype, "validationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ValidationRule.prototype, "regexPattern", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], ValidationRule.prototype, "minLength", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], ValidationRule.prototype, "maxLength", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], ValidationRule.prototype, "minValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], ValidationRule.prototype, "maxValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ValidationRule.prototype, "customValidationScript", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ValidationRule.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ValidationSeverity,
        default: ValidationSeverity.ERROR,
    }),
    __metadata("design:type", String)
], ValidationRule.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], ValidationRule.prototype, "dependencies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ValidationRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ValidationRule.prototype, "applyToImport", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ValidationRule.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], ValidationRule.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ValidationRule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ValidationRule.prototype, "updatedAt", void 0);
exports.ValidationRule = ValidationRule = __decorate([
    (0, typeorm_1.Entity)('validation_rules')
], ValidationRule);
//# sourceMappingURL=validation-rule.entity.js.map