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
exports.RemediationTracker = exports.RemediationPriority = void 0;
const typeorm_1 = require("typeorm");
const finding_entity_1 = require("./finding.entity");
const user_entity_1 = require("../../../users/entities/user.entity");
var RemediationPriority;
(function (RemediationPriority) {
    RemediationPriority["CRITICAL"] = "critical";
    RemediationPriority["HIGH"] = "high";
    RemediationPriority["MEDIUM"] = "medium";
    RemediationPriority["LOW"] = "low";
})(RemediationPriority || (exports.RemediationPriority = RemediationPriority = {}));
let RemediationTracker = class RemediationTracker {
};
exports.RemediationTracker = RemediationTracker;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RemediationTracker.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], RemediationTracker.prototype, "finding_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => finding_entity_1.Finding, { onDelete: 'CASCADE', eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'finding_id' }),
    __metadata("design:type", finding_entity_1.Finding)
], RemediationTracker.prototype, "finding", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RemediationPriority,
        default: RemediationPriority.MEDIUM,
        name: 'remediation_priority',
    }),
    __metadata("design:type", String)
], RemediationTracker.prototype, "remediation_priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: false, name: 'sla_due_date' }),
    __metadata("design:type", Date)
], RemediationTracker.prototype, "sla_due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RemediationTracker.prototype, "remediation_steps", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'assigned_to_id' }),
    __metadata("design:type", String)
], RemediationTracker.prototype, "assigned_to_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_to_id' }),
    __metadata("design:type", user_entity_1.User)
], RemediationTracker.prototype, "assigned_to", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'progress_percent' }),
    __metadata("design:type", Number)
], RemediationTracker.prototype, "progress_percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RemediationTracker.prototype, "progress_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'completion_date' }),
    __metadata("design:type", Date)
], RemediationTracker.prototype, "completion_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'sla_met' }),
    __metadata("design:type", Boolean)
], RemediationTracker.prototype, "sla_met", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'days_to_completion' }),
    __metadata("design:type", Number)
], RemediationTracker.prototype, "days_to_completion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], RemediationTracker.prototype, "completion_evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RemediationTracker.prototype, "completion_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], RemediationTracker.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], RemediationTracker.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RemediationTracker.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], RemediationTracker.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], RemediationTracker.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RemediationTracker.prototype, "updated_at", void 0);
exports.RemediationTracker = RemediationTracker = __decorate([
    (0, typeorm_1.Entity)('remediation_trackers'),
    (0, typeorm_1.Index)(['finding_id']),
    (0, typeorm_1.Index)(['remediation_priority']),
    (0, typeorm_1.Index)(['sla_due_date'], { where: "completion_date IS NULL" }),
    (0, typeorm_1.Index)(['assigned_to_id'])
], RemediationTracker);
//# sourceMappingURL=remediation-tracker.entity.js.map