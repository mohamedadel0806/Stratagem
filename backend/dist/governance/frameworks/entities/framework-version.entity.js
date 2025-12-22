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
exports.FrameworkVersion = void 0;
const typeorm_1 = require("typeorm");
const compliance_framework_entity_1 = require("../../../common/entities/compliance-framework.entity");
const user_entity_1 = require("../../../users/entities/user.entity");
let FrameworkVersion = class FrameworkVersion {
};
exports.FrameworkVersion = FrameworkVersion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FrameworkVersion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'framework_id' }),
    __metadata("design:type", String)
], FrameworkVersion.prototype, "framework_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => compliance_framework_entity_1.ComplianceFramework, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'framework_id' }),
    __metadata("design:type", compliance_framework_entity_1.ComplianceFramework)
], FrameworkVersion.prototype, "framework", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], FrameworkVersion.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'version_notes' }),
    __metadata("design:type", String)
], FrameworkVersion.prototype, "version_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], FrameworkVersion.prototype, "structure", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'effective_date' }),
    __metadata("design:type", Date)
], FrameworkVersion.prototype, "effective_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_current' }),
    __metadata("design:type", Boolean)
], FrameworkVersion.prototype, "is_current", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], FrameworkVersion.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], FrameworkVersion.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FrameworkVersion.prototype, "created_at", void 0);
exports.FrameworkVersion = FrameworkVersion = __decorate([
    (0, typeorm_1.Entity)('framework_versions'),
    (0, typeorm_1.Index)(['framework_id']),
    (0, typeorm_1.Index)(['version'])
], FrameworkVersion);
//# sourceMappingURL=framework-version.entity.js.map