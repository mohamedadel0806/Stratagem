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
exports.ComplianceValidationRule = void 0;
const typeorm_1 = require("typeorm");
const compliance_requirement_entity_1 = require("./compliance-requirement.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let ComplianceValidationRule = class ComplianceValidationRule {
};
exports.ComplianceValidationRule = ComplianceValidationRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ComplianceValidationRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => compliance_requirement_entity_1.ComplianceRequirement, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'requirement_id' }),
    __metadata("design:type", compliance_requirement_entity_1.ComplianceRequirement)
], ComplianceValidationRule.prototype, "requirement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'requirement_id' }),
    __metadata("design:type", String)
], ComplianceValidationRule.prototype, "requirementId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'asset_type' }),
    __metadata("design:type", String)
], ComplianceValidationRule.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'rule_name' }),
    __metadata("design:type", String)
], ComplianceValidationRule.prototype, "ruleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'rule_description' }),
    __metadata("design:type", String)
], ComplianceValidationRule.prototype, "ruleDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'validation_logic' }),
    __metadata("design:type", Object)
], ComplianceValidationRule.prototype, "validationLogic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ComplianceValidationRule.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], ComplianceValidationRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], ComplianceValidationRule.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], ComplianceValidationRule.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], ComplianceValidationRule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt' }),
    __metadata("design:type", Date)
], ComplianceValidationRule.prototype, "updatedAt", void 0);
exports.ComplianceValidationRule = ComplianceValidationRule = __decorate([
    (0, typeorm_1.Entity)('compliance_validation_rules'),
    (0, typeorm_1.Index)(['requirementId']),
    (0, typeorm_1.Index)(['assetType']),
    (0, typeorm_1.Index)(['isActive'])
], ComplianceValidationRule);
//# sourceMappingURL=compliance-validation-rule.entity.js.map