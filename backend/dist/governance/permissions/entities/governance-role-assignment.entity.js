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
exports.GovernanceRoleAssignment = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const business_unit_entity_1 = require("../../../common/entities/business-unit.entity");
let GovernanceRoleAssignment = class GovernanceRoleAssignment {
};
exports.GovernanceRoleAssignment = GovernanceRoleAssignment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GovernanceRoleAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], GovernanceRoleAssignment.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], GovernanceRoleAssignment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], GovernanceRoleAssignment.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'business_unit_id' }),
    __metadata("design:type", String)
], GovernanceRoleAssignment.prototype, "business_unit_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_unit_entity_1.BusinessUnit, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'business_unit_id' }),
    __metadata("design:type", business_unit_entity_1.BusinessUnit)
], GovernanceRoleAssignment.prototype, "business_unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'assigned_by' }),
    __metadata("design:type", String)
], GovernanceRoleAssignment.prototype, "assigned_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_by' }),
    __metadata("design:type", user_entity_1.User)
], GovernanceRoleAssignment.prototype, "assigner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'assigned_at' }),
    __metadata("design:type", Date)
], GovernanceRoleAssignment.prototype, "assigned_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'expires_at' }),
    __metadata("design:type", Date)
], GovernanceRoleAssignment.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GovernanceRoleAssignment.prototype, "created_at", void 0);
exports.GovernanceRoleAssignment = GovernanceRoleAssignment = __decorate([
    (0, typeorm_1.Entity)('governance_role_assignments'),
    (0, typeorm_1.Index)(['user_id']),
    (0, typeorm_1.Index)(['role']),
    (0, typeorm_1.Index)(['business_unit_id']),
    (0, typeorm_1.Index)(['user_id', 'role'])
], GovernanceRoleAssignment);
//# sourceMappingURL=governance-role-assignment.entity.js.map