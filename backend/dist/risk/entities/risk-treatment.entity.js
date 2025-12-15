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
exports.RiskTreatment = exports.TreatmentPriority = exports.TreatmentStatus = exports.TreatmentStrategy = void 0;
const typeorm_1 = require("typeorm");
const risk_entity_1 = require("./risk.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const treatment_task_entity_1 = require("./treatment-task.entity");
var TreatmentStrategy;
(function (TreatmentStrategy) {
    TreatmentStrategy["MITIGATE"] = "mitigate";
    TreatmentStrategy["TRANSFER"] = "transfer";
    TreatmentStrategy["AVOID"] = "avoid";
    TreatmentStrategy["ACCEPT"] = "accept";
})(TreatmentStrategy || (exports.TreatmentStrategy = TreatmentStrategy = {}));
var TreatmentStatus;
(function (TreatmentStatus) {
    TreatmentStatus["PLANNED"] = "planned";
    TreatmentStatus["IN_PROGRESS"] = "in_progress";
    TreatmentStatus["COMPLETED"] = "completed";
    TreatmentStatus["DEFERRED"] = "deferred";
    TreatmentStatus["CANCELLED"] = "cancelled";
})(TreatmentStatus || (exports.TreatmentStatus = TreatmentStatus = {}));
var TreatmentPriority;
(function (TreatmentPriority) {
    TreatmentPriority["CRITICAL"] = "critical";
    TreatmentPriority["HIGH"] = "high";
    TreatmentPriority["MEDIUM"] = "medium";
    TreatmentPriority["LOW"] = "low";
})(TreatmentPriority || (exports.TreatmentPriority = TreatmentPriority = {}));
let RiskTreatment = class RiskTreatment {
};
exports.RiskTreatment = RiskTreatment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RiskTreatment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true, nullable: true, name: 'treatment_id' }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "treatment_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'risk_id' }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "risk_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => risk_entity_1.Risk, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'risk_id' }),
    __metadata("design:type", risk_entity_1.Risk)
], RiskTreatment.prototype, "risk", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TreatmentStrategy,
    }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "strategy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300 }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'treatment_owner_id' }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "treatment_owner_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'treatment_owner_id' }),
    __metadata("design:type", user_entity_1.User)
], RiskTreatment.prototype, "treatment_owner", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TreatmentStatus,
        default: TreatmentStatus.PLANNED,
    }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TreatmentPriority,
        default: TreatmentPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'start_date' }),
    __metadata("design:type", Date)
], RiskTreatment.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'target_completion_date' }),
    __metadata("design:type", Date)
], RiskTreatment.prototype, "target_completion_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'actual_completion_date' }),
    __metadata("design:type", Date)
], RiskTreatment.prototype, "actual_completion_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'estimated_cost' }),
    __metadata("design:type", Number)
], RiskTreatment.prototype, "estimated_cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'actual_cost' }),
    __metadata("design:type", Number)
], RiskTreatment.prototype, "actual_cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'expected_risk_reduction' }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "expected_risk_reduction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'residual_likelihood' }),
    __metadata("design:type", Number)
], RiskTreatment.prototype, "residual_likelihood", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'residual_impact' }),
    __metadata("design:type", Number)
], RiskTreatment.prototype, "residual_impact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'residual_risk_score' }),
    __metadata("design:type", Number)
], RiskTreatment.prototype, "residual_risk_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'progress_percentage' }),
    __metadata("design:type", Number)
], RiskTreatment.prototype, "progress_percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'progress_notes' }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "progress_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'implementation_notes' }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "implementation_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'linked_control_ids' }),
    __metadata("design:type", Array)
], RiskTreatment.prototype, "linked_control_ids", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], RiskTreatment.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => treatment_task_entity_1.TreatmentTask, (task) => task.treatment),
    __metadata("design:type", Array)
], RiskTreatment.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], RiskTreatment.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RiskTreatment.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], RiskTreatment.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], RiskTreatment.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RiskTreatment.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], RiskTreatment.prototype, "deleted_at", void 0);
exports.RiskTreatment = RiskTreatment = __decorate([
    (0, typeorm_1.Entity)('risk_treatments'),
    (0, typeorm_1.Index)(['risk_id']),
    (0, typeorm_1.Index)(['treatment_id']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['treatment_owner_id']),
    (0, typeorm_1.Index)(['target_completion_date']),
    (0, typeorm_1.Index)(['priority'])
], RiskTreatment);
//# sourceMappingURL=risk-treatment.entity.js.map