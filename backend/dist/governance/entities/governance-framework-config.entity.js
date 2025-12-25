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
exports.GovernanceFrameworkConfig = exports.FrameworkType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const compliance_framework_entity_1 = require("../../common/entities/compliance-framework.entity");
var FrameworkType;
(function (FrameworkType) {
    FrameworkType["ISO27001"] = "iso27001";
    FrameworkType["NIST_CYBERSECURITY"] = "nist_cybersecurity";
    FrameworkType["NIST_PRIVACY"] = "nist_privacy";
    FrameworkType["PCI_DSS"] = "pci_dss";
    FrameworkType["GDPR"] = "gdpr";
    FrameworkType["NCA_ECC"] = "nca_ecc";
    FrameworkType["SOC2"] = "soc2";
    FrameworkType["HIPAA"] = "hipaa";
    FrameworkType["CUSTOM"] = "custom";
})(FrameworkType || (exports.FrameworkType = FrameworkType = {}));
let GovernanceFrameworkConfig = class GovernanceFrameworkConfig {
};
exports.GovernanceFrameworkConfig = GovernanceFrameworkConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GovernanceFrameworkConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], GovernanceFrameworkConfig.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GovernanceFrameworkConfig.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FrameworkType,
        default: FrameworkType.CUSTOM,
    }),
    __metadata("design:type", String)
], GovernanceFrameworkConfig.prototype, "framework_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GovernanceFrameworkConfig.prototype, "scope", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], GovernanceFrameworkConfig.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'linked_framework_id' }),
    __metadata("design:type", String)
], GovernanceFrameworkConfig.prototype, "linked_framework_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => compliance_framework_entity_1.ComplianceFramework, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'linked_framework_id' }),
    __metadata("design:type", compliance_framework_entity_1.ComplianceFramework)
], GovernanceFrameworkConfig.prototype, "linked_framework", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], GovernanceFrameworkConfig.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], GovernanceFrameworkConfig.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], GovernanceFrameworkConfig.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GovernanceFrameworkConfig.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], GovernanceFrameworkConfig.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], GovernanceFrameworkConfig.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], GovernanceFrameworkConfig.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], GovernanceFrameworkConfig.prototype, "deleted_at", void 0);
exports.GovernanceFrameworkConfig = GovernanceFrameworkConfig = __decorate([
    (0, typeorm_1.Entity)('governance_framework_configs'),
    (0, typeorm_1.Index)(['framework_type']),
    (0, typeorm_1.Index)(['is_active']),
    (0, typeorm_1.Index)(['created_by']),
    (0, typeorm_1.Index)(['linked_framework_id'])
], GovernanceFrameworkConfig);
//# sourceMappingURL=governance-framework-config.entity.js.map