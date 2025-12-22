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
exports.SOPStep = exports.StepStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const sop_entity_1 = require("./sop.entity");
var StepStatus;
(function (StepStatus) {
    StepStatus["PENDING"] = "pending";
    StepStatus["IN_PROGRESS"] = "in_progress";
    StepStatus["COMPLETED"] = "completed";
    StepStatus["SKIPPED"] = "skipped";
    StepStatus["FAILED"] = "failed";
})(StepStatus || (exports.StepStatus = StepStatus = {}));
let SOPStep = class SOPStep {
};
exports.SOPStep = SOPStep;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SOPStep.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'sop_id' }),
    __metadata("design:type", String)
], SOPStep.prototype, "sop_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sop_entity_1.SOP, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sop_id' }),
    __metadata("design:type", sop_entity_1.SOP)
], SOPStep.prototype, "sop", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', name: 'step_number' }),
    __metadata("design:type", Number)
], SOPStep.prototype, "step_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SOPStep.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SOPStep.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SOPStep.prototype, "expected_outcome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SOPStep.prototype, "responsible_role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'estimated_duration_minutes' }),
    __metadata("design:type", Number)
], SOPStep.prototype, "estimated_duration_minutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SOPStep.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', array: true, nullable: true }),
    __metadata("design:type", Array)
], SOPStep.prototype, "required_evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_critical' }),
    __metadata("design:type", Boolean)
], SOPStep.prototype, "is_critical", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], SOPStep.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPStep.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SOPStep.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], SOPStep.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], SOPStep.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SOPStep.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], SOPStep.prototype, "deleted_at", void 0);
exports.SOPStep = SOPStep = __decorate([
    (0, typeorm_1.Entity)('sop_steps'),
    (0, typeorm_1.Index)(['sop_id']),
    (0, typeorm_1.Index)(['step_number'])
], SOPStep);
//# sourceMappingURL=sop-step.entity.js.map