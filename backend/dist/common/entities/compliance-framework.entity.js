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
exports.ComplianceFramework = exports.FrameworkStatus = void 0;
const typeorm_1 = require("typeorm");
const compliance_requirement_entity_1 = require("./compliance-requirement.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var FrameworkStatus;
(function (FrameworkStatus) {
    FrameworkStatus["ACTIVE"] = "active";
    FrameworkStatus["DRAFT"] = "draft";
    FrameworkStatus["DEPRECATED"] = "deprecated";
})(FrameworkStatus || (exports.FrameworkStatus = FrameworkStatus = {}));
let ComplianceFramework = class ComplianceFramework {
};
exports.ComplianceFramework = ComplianceFramework;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'framework_code' }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "framework_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300 }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: true, name: 'issuing_authority' }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "issuing_authority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'effective_date' }),
    __metadata("design:type", Date)
], ComplianceFramework.prototype, "effective_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FrameworkStatus,
        default: FrameworkStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ComplianceFramework.prototype, "structure", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', array: true, nullable: true }),
    __metadata("design:type", Array)
], ComplianceFramework.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], ComplianceFramework.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ComplianceFramework.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], ComplianceFramework.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ComplianceFramework.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'deleted_at' }),
    __metadata("design:type", Date)
], ComplianceFramework.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'code' }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'region' }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'organizationId' }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => compliance_requirement_entity_1.ComplianceRequirement, (requirement) => requirement.framework),
    __metadata("design:type", Array)
], ComplianceFramework.prototype, "requirements", void 0);
exports.ComplianceFramework = ComplianceFramework = __decorate([
    (0, typeorm_1.Entity)('compliance_frameworks'),
    (0, typeorm_1.Index)(['framework_code']),
    (0, typeorm_1.Index)(['status'])
], ComplianceFramework);
//# sourceMappingURL=compliance-framework.entity.js.map