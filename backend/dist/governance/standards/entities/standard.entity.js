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
exports.Standard = exports.StandardStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const policy_entity_1 = require("../../policies/entities/policy.entity");
const control_objective_entity_1 = require("../../control-objectives/entities/control-objective.entity");
var StandardStatus;
(function (StandardStatus) {
    StandardStatus["DRAFT"] = "draft";
    StandardStatus["IN_REVIEW"] = "in_review";
    StandardStatus["APPROVED"] = "approved";
    StandardStatus["PUBLISHED"] = "published";
    StandardStatus["ARCHIVED"] = "archived";
})(StandardStatus || (exports.StandardStatus = StandardStatus = {}));
let Standard = class Standard {
};
exports.Standard = Standard;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Standard.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'standard_identifier' }),
    __metadata("design:type", String)
], Standard.prototype, "standard_identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Standard.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'policy_id' }),
    __metadata("design:type", String)
], Standard.prototype, "policy_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => policy_entity_1.Policy, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'policy_id' }),
    __metadata("design:type", policy_entity_1.Policy)
], Standard.prototype, "policy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'control_objective_id' }),
    __metadata("design:type", String)
], Standard.prototype, "control_objective_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => control_objective_entity_1.ControlObjective, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'control_objective_id' }),
    __metadata("design:type", control_objective_entity_1.ControlObjective)
], Standard.prototype, "control_objective", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Standard.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Standard.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Standard.prototype, "scope", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Standard.prototype, "applicability", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'compliance_measurement_criteria' }),
    __metadata("design:type", String)
], Standard.prototype, "compliance_measurement_criteria", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Standard.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: StandardStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Standard.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'owner_id' }),
    __metadata("design:type", String)
], Standard.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], Standard.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], Standard.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Standard.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Standard.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], Standard.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], Standard.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Standard.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Standard.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => control_objective_entity_1.ControlObjective),
    (0, typeorm_1.JoinTable)({
        name: 'standard_control_objective_mappings',
        joinColumn: { name: 'standard_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'control_objective_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Standard.prototype, "control_objectives", void 0);
exports.Standard = Standard = __decorate([
    (0, typeorm_1.Entity)('standards'),
    (0, typeorm_1.Index)(['standard_identifier']),
    (0, typeorm_1.Index)(['policy_id']),
    (0, typeorm_1.Index)(['control_objective_id']),
    (0, typeorm_1.Index)(['owner_id']),
    (0, typeorm_1.Index)(['status'])
], Standard);
//# sourceMappingURL=standard.entity.js.map