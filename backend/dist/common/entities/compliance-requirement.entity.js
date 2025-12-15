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
exports.ComplianceRequirement = exports.RequirementStatus = void 0;
const typeorm_1 = require("typeorm");
const compliance_framework_entity_1 = require("./compliance-framework.entity");
var RequirementStatus;
(function (RequirementStatus) {
    RequirementStatus["NOT_STARTED"] = "not_started";
    RequirementStatus["IN_PROGRESS"] = "in_progress";
    RequirementStatus["COMPLIANT"] = "compliant";
    RequirementStatus["NON_COMPLIANT"] = "non_compliant";
    RequirementStatus["PARTIALLY_COMPLIANT"] = "partially_compliant";
})(RequirementStatus || (exports.RequirementStatus = RequirementStatus = {}));
let ComplianceRequirement = class ComplianceRequirement {
};
exports.ComplianceRequirement = ComplianceRequirement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ComplianceRequirement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ComplianceRequirement.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ComplianceRequirement.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'requirementCode' }),
    __metadata("design:type", String)
], ComplianceRequirement.prototype, "requirementCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, name: 'category' }),
    __metadata("design:type", String)
], ComplianceRequirement.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, name: 'complianceDeadline' }),
    __metadata("design:type", String)
], ComplianceRequirement.prototype, "complianceDeadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, name: 'applicability' }),
    __metadata("design:type", String)
], ComplianceRequirement.prototype, "applicability", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => compliance_framework_entity_1.ComplianceFramework, (framework) => framework.requirements),
    (0, typeorm_1.JoinColumn)({ name: 'framework_id' }),
    __metadata("design:type", compliance_framework_entity_1.ComplianceFramework)
], ComplianceRequirement.prototype, "framework", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'framework_id' }),
    __metadata("design:type", String)
], ComplianceRequirement.prototype, "frameworkId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RequirementStatus,
        default: RequirementStatus.NOT_STARTED,
    }),
    __metadata("design:type", String)
], ComplianceRequirement.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'organizationId' }),
    __metadata("design:type", String)
], ComplianceRequirement.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], ComplianceRequirement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt' }),
    __metadata("design:type", Date)
], ComplianceRequirement.prototype, "updatedAt", void 0);
exports.ComplianceRequirement = ComplianceRequirement = __decorate([
    (0, typeorm_1.Entity)('compliance_requirements')
], ComplianceRequirement);
//# sourceMappingURL=compliance-requirement.entity.js.map