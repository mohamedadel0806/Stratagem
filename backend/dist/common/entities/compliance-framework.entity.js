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
exports.ComplianceFramework = void 0;
const typeorm_1 = require("typeorm");
const compliance_requirement_entity_1 = require("./compliance-requirement.entity");
let ComplianceFramework = class ComplianceFramework {
};
exports.ComplianceFramework = ComplianceFramework;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'code' }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'description' }),
    __metadata("design:type", String)
], ComplianceFramework.prototype, "description", void 0);
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
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], ComplianceFramework.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt' }),
    __metadata("design:type", Date)
], ComplianceFramework.prototype, "updatedAt", void 0);
exports.ComplianceFramework = ComplianceFramework = __decorate([
    (0, typeorm_1.Entity)('compliance_frameworks')
], ComplianceFramework);
//# sourceMappingURL=compliance-framework.entity.js.map