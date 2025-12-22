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
exports.BaselineRequirement = exports.SecureBaseline = exports.BaselineStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const control_objective_entity_1 = require("../../control-objectives/entities/control-objective.entity");
var BaselineStatus;
(function (BaselineStatus) {
    BaselineStatus["DRAFT"] = "draft";
    BaselineStatus["ACTIVE"] = "active";
    BaselineStatus["DEPRECATED"] = "deprecated";
    BaselineStatus["ARCHIVED"] = "archived";
})(BaselineStatus || (exports.BaselineStatus = BaselineStatus = {}));
let SecureBaseline = class SecureBaseline {
};
exports.SecureBaseline = SecureBaseline;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SecureBaseline.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'baseline_identifier' }),
    __metadata("design:type", String)
], SecureBaseline.prototype, "baseline_identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], SecureBaseline.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SecureBaseline.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], SecureBaseline.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], SecureBaseline.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BaselineStatus,
        default: BaselineStatus.DRAFT,
    }),
    __metadata("design:type", String)
], SecureBaseline.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'owner_id' }),
    __metadata("design:type", String)
], SecureBaseline.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], SecureBaseline.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => BaselineRequirement, (requirement) => requirement.baseline, { cascade: true }),
    __metadata("design:type", Array)
], SecureBaseline.prototype, "requirements", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => control_objective_entity_1.ControlObjective),
    (0, typeorm_1.JoinTable)({
        name: 'baseline_control_objective_mappings',
        joinColumn: { name: 'baseline_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'control_objective_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], SecureBaseline.prototype, "control_objectives", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], SecureBaseline.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], SecureBaseline.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SecureBaseline.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], SecureBaseline.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], SecureBaseline.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SecureBaseline.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], SecureBaseline.prototype, "deleted_at", void 0);
exports.SecureBaseline = SecureBaseline = __decorate([
    (0, typeorm_1.Entity)('secure_baselines'),
    (0, typeorm_1.Index)(['baseline_identifier']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['category'])
], SecureBaseline);
let BaselineRequirement = class BaselineRequirement {
};
exports.BaselineRequirement = BaselineRequirement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BaselineRequirement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'baseline_id' }),
    __metadata("design:type", String)
], BaselineRequirement.prototype, "baseline_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SecureBaseline, (baseline) => baseline.requirements, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'baseline_id' }),
    __metadata("design:type", SecureBaseline)
], BaselineRequirement.prototype, "baseline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'requirement_identifier' }),
    __metadata("design:type", String)
], BaselineRequirement.prototype, "requirement_identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], BaselineRequirement.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BaselineRequirement.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'configuration_value' }),
    __metadata("design:type", String)
], BaselineRequirement.prototype, "configuration_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'validation_method' }),
    __metadata("design:type", String)
], BaselineRequirement.prototype, "validation_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'display_order' }),
    __metadata("design:type", Number)
], BaselineRequirement.prototype, "display_order", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BaselineRequirement.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BaselineRequirement.prototype, "updated_at", void 0);
exports.BaselineRequirement = BaselineRequirement = __decorate([
    (0, typeorm_1.Entity)('baseline_requirements'),
    (0, typeorm_1.Index)(['baseline_id']),
    (0, typeorm_1.Index)(['requirement_identifier'])
], BaselineRequirement);
//# sourceMappingURL=baseline.entity.js.map