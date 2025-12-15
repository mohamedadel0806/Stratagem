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
exports.Finding = exports.FindingStatus = exports.FindingSeverity = void 0;
const typeorm_1 = require("typeorm");
const assessment_entity_1 = require("../../assessments/entities/assessment.entity");
const assessment_result_entity_1 = require("../../assessments/entities/assessment-result.entity");
const unified_control_entity_1 = require("../../unified-controls/entities/unified-control.entity");
const user_entity_1 = require("../../../users/entities/user.entity");
var FindingSeverity;
(function (FindingSeverity) {
    FindingSeverity["CRITICAL"] = "critical";
    FindingSeverity["HIGH"] = "high";
    FindingSeverity["MEDIUM"] = "medium";
    FindingSeverity["LOW"] = "low";
    FindingSeverity["INFO"] = "informational";
})(FindingSeverity || (exports.FindingSeverity = FindingSeverity = {}));
var FindingStatus;
(function (FindingStatus) {
    FindingStatus["OPEN"] = "open";
    FindingStatus["IN_PROGRESS"] = "in_progress";
    FindingStatus["RESOLVED"] = "resolved";
    FindingStatus["CLOSED"] = "closed";
    FindingStatus["ACCEPTED"] = "risk_accepted";
    FindingStatus["REJECTED"] = "false_positive";
})(FindingStatus || (exports.FindingStatus = FindingStatus = {}));
let Finding = class Finding {
};
exports.Finding = Finding;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Finding.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], Finding.prototype, "finding_identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "assessment_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_entity_1.Assessment, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assessment_id' }),
    __metadata("design:type", assessment_entity_1.Assessment)
], Finding.prototype, "assessment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "assessment_result_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_result_entity_1.AssessmentResult, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assessment_result_id' }),
    __metadata("design:type", assessment_result_entity_1.AssessmentResult)
], Finding.prototype, "assessment_result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "source_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "source_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "unified_control_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unified_control_entity_1.UnifiedControl, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'unified_control_id' }),
    __metadata("design:type", unified_control_entity_1.UnifiedControl)
], Finding.prototype, "unified_control", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "asset_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Finding.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Finding.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FindingSeverity,
        name: 'severity',
    }),
    __metadata("design:type", String)
], Finding.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: () => 'CURRENT_DATE' }),
    __metadata("design:type", Date)
], Finding.prototype, "finding_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FindingStatus,
        default: FindingStatus.OPEN,
        name: 'status',
    }),
    __metadata("design:type", String)
], Finding.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "remediation_owner_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'remediation_owner_id' }),
    __metadata("design:type", user_entity_1.User)
], Finding.prototype, "remediation_owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "remediation_plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Finding.prototype, "remediation_due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Finding.prototype, "remediation_completed_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Finding.prototype, "remediation_evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "risk_accepted_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'risk_accepted_by' }),
    __metadata("design:type", user_entity_1.User)
], Finding.prototype, "risk_acceptor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "risk_acceptance_justification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Finding.prototype, "risk_acceptance_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Finding.prototype, "risk_acceptance_expiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Finding.prototype, "retest_required", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Finding.prototype, "retest_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "retest_result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', array: true, nullable: true }),
    __metadata("design:type", Array)
], Finding.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Finding.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Finding.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], Finding.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Finding.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Finding.prototype, "deleted_at", void 0);
exports.Finding = Finding = __decorate([
    (0, typeorm_1.Entity)('findings'),
    (0, typeorm_1.Index)(['finding_identifier']),
    (0, typeorm_1.Index)(['assessment_id']),
    (0, typeorm_1.Index)(['unified_control_id']),
    (0, typeorm_1.Index)(['asset_type', 'asset_id']),
    (0, typeorm_1.Index)(['severity']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['remediation_owner_id']),
    (0, typeorm_1.Index)(['remediation_due_date'], { where: "status IN ('open', 'in_progress')" })
], Finding);
//# sourceMappingURL=finding.entity.js.map