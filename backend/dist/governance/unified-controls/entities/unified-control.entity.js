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
exports.UnifiedControl = exports.ImplementationStatus = exports.ControlStatus = exports.ControlCostImpact = exports.ControlComplexity = exports.ControlType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const control_objective_entity_1 = require("../../control-objectives/entities/control-objective.entity");
var ControlType;
(function (ControlType) {
    ControlType["PREVENTIVE"] = "preventive";
    ControlType["DETECTIVE"] = "detective";
    ControlType["CORRECTIVE"] = "corrective";
    ControlType["COMPENSATING"] = "compensating";
    ControlType["ADMINISTRATIVE"] = "administrative";
    ControlType["TECHNICAL"] = "technical";
    ControlType["PHYSICAL"] = "physical";
})(ControlType || (exports.ControlType = ControlType = {}));
var ControlComplexity;
(function (ControlComplexity) {
    ControlComplexity["HIGH"] = "high";
    ControlComplexity["MEDIUM"] = "medium";
    ControlComplexity["LOW"] = "low";
})(ControlComplexity || (exports.ControlComplexity = ControlComplexity = {}));
var ControlCostImpact;
(function (ControlCostImpact) {
    ControlCostImpact["HIGH"] = "high";
    ControlCostImpact["MEDIUM"] = "medium";
    ControlCostImpact["LOW"] = "low";
})(ControlCostImpact || (exports.ControlCostImpact = ControlCostImpact = {}));
var ControlStatus;
(function (ControlStatus) {
    ControlStatus["DRAFT"] = "draft";
    ControlStatus["ACTIVE"] = "active";
    ControlStatus["DEPRECATED"] = "deprecated";
})(ControlStatus || (exports.ControlStatus = ControlStatus = {}));
var ImplementationStatus;
(function (ImplementationStatus) {
    ImplementationStatus["NOT_IMPLEMENTED"] = "not_implemented";
    ImplementationStatus["PLANNED"] = "planned";
    ImplementationStatus["IN_PROGRESS"] = "in_progress";
    ImplementationStatus["IMPLEMENTED"] = "implemented";
    ImplementationStatus["NOT_APPLICABLE"] = "not_applicable";
})(ImplementationStatus || (exports.ImplementationStatus = ImplementationStatus = {}));
let UnifiedControl = class UnifiedControl {
};
exports.UnifiedControl = UnifiedControl;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UnifiedControl.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'control_identifier' }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "control_identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ControlType,
        nullable: true,
        name: 'control_type',
    }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "control_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true, name: 'control_category' }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "control_category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "domain", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ControlComplexity,
        nullable: true,
    }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "complexity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ControlCostImpact,
        nullable: true,
        name: 'cost_impact',
    }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "cost_impact", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ControlStatus,
        default: ControlStatus.DRAFT,
    }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ImplementationStatus,
        default: ImplementationStatus.NOT_IMPLEMENTED,
        name: 'implementation_status',
    }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "implementation_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'control_owner_id' }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "control_owner_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'control_owner_id' }),
    __metadata("design:type", user_entity_1.User)
], UnifiedControl.prototype, "control_owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'control_procedures' }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "control_procedures", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'testing_procedures' }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "testing_procedures", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', array: true, nullable: true }),
    __metadata("design:type", Array)
], UnifiedControl.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'custom_fields' }),
    __metadata("design:type", Object)
], UnifiedControl.prototype, "custom_fields", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], UnifiedControl.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UnifiedControl.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], UnifiedControl.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], UnifiedControl.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], UnifiedControl.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], UnifiedControl.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => control_objective_entity_1.ControlObjective, (objective) => objective.unified_controls),
    __metadata("design:type", Array)
], UnifiedControl.prototype, "control_objectives", void 0);
exports.UnifiedControl = UnifiedControl = __decorate([
    (0, typeorm_1.Entity)('unified_controls'),
    (0, typeorm_1.Index)(['control_identifier']),
    (0, typeorm_1.Index)(['control_type']),
    (0, typeorm_1.Index)(['domain']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['implementation_status']),
    (0, typeorm_1.Index)(['control_owner_id'])
], UnifiedControl);
//# sourceMappingURL=unified-control.entity.js.map