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
exports.ControlObjective = exports.ImplementationStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const policy_entity_1 = require("../../policies/entities/policy.entity");
const unified_control_entity_1 = require("../../unified-controls/entities/unified-control.entity");
var ImplementationStatus;
(function (ImplementationStatus) {
    ImplementationStatus["NOT_IMPLEMENTED"] = "not_implemented";
    ImplementationStatus["PLANNED"] = "planned";
    ImplementationStatus["IN_PROGRESS"] = "in_progress";
    ImplementationStatus["IMPLEMENTED"] = "implemented";
    ImplementationStatus["NOT_APPLICABLE"] = "not_applicable";
})(ImplementationStatus || (exports.ImplementationStatus = ImplementationStatus = {}));
let ControlObjective = class ControlObjective {
};
exports.ControlObjective = ControlObjective;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ControlObjective.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'objective_identifier' }),
    __metadata("design:type", String)
], ControlObjective.prototype, "objective_identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'policy_id' }),
    __metadata("design:type", String)
], ControlObjective.prototype, "policy_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => policy_entity_1.Policy, (policy) => policy.control_objectives, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'policy_id' }),
    __metadata("design:type", policy_entity_1.Policy)
], ControlObjective.prototype, "policy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ControlObjective.prototype, "statement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ControlObjective.prototype, "rationale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], ControlObjective.prototype, "domain", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ControlObjective.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ControlObjective.prototype, "mandatory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'responsible_party_id' }),
    __metadata("design:type", String)
], ControlObjective.prototype, "responsible_party_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'responsible_party_id' }),
    __metadata("design:type", user_entity_1.User)
], ControlObjective.prototype, "responsible_party", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ImplementationStatus,
        default: ImplementationStatus.NOT_IMPLEMENTED,
        name: 'implementation_status',
    }),
    __metadata("design:type", String)
], ControlObjective.prototype, "implementation_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'target_implementation_date' }),
    __metadata("design:type", Date)
], ControlObjective.prototype, "target_implementation_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'actual_implementation_date' }),
    __metadata("design:type", Date)
], ControlObjective.prototype, "actual_implementation_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'linked_influencers' }),
    __metadata("design:type", Array)
], ControlObjective.prototype, "linked_influencers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'display_order' }),
    __metadata("design:type", Number)
], ControlObjective.prototype, "display_order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], ControlObjective.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], ControlObjective.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ControlObjective.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], ControlObjective.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], ControlObjective.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ControlObjective.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], ControlObjective.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => unified_control_entity_1.UnifiedControl),
    (0, typeorm_1.JoinTable)({
        name: 'control_objective_unified_controls',
        joinColumn: { name: 'control_objective_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'unified_control_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], ControlObjective.prototype, "unified_controls", void 0);
exports.ControlObjective = ControlObjective = __decorate([
    (0, typeorm_1.Entity)('control_objectives'),
    (0, typeorm_1.Index)(['policy_id']),
    (0, typeorm_1.Index)(['objective_identifier']),
    (0, typeorm_1.Index)(['domain']),
    (0, typeorm_1.Index)(['responsible_party_id']),
    (0, typeorm_1.Index)(['implementation_status'])
], ControlObjective);
//# sourceMappingURL=control-objective.entity.js.map