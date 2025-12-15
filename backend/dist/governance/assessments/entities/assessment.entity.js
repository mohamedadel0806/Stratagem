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
exports.Assessment = exports.AssessmentStatus = exports.AssessmentType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const assessment_result_entity_1 = require("./assessment-result.entity");
var AssessmentType;
(function (AssessmentType) {
    AssessmentType["IMPLEMENTATION"] = "implementation";
    AssessmentType["DESIGN_EFFECTIVENESS"] = "design_effectiveness";
    AssessmentType["OPERATING_EFFECTIVENESS"] = "operating_effectiveness";
    AssessmentType["COMPLIANCE"] = "compliance";
})(AssessmentType || (exports.AssessmentType = AssessmentType = {}));
var AssessmentStatus;
(function (AssessmentStatus) {
    AssessmentStatus["NOT_STARTED"] = "not_started";
    AssessmentStatus["IN_PROGRESS"] = "in_progress";
    AssessmentStatus["UNDER_REVIEW"] = "under_review";
    AssessmentStatus["COMPLETED"] = "completed";
    AssessmentStatus["CANCELLED"] = "cancelled";
})(AssessmentStatus || (exports.AssessmentStatus = AssessmentStatus = {}));
let Assessment = class Assessment {
};
exports.Assessment = Assessment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Assessment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'assessment_identifier' }),
    __metadata("design:type", String)
], Assessment.prototype, "assessment_identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Assessment.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Assessment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssessmentType,
        name: 'assessment_type',
    }),
    __metadata("design:type", String)
], Assessment.prototype, "assessment_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'scope_description' }),
    __metadata("design:type", String)
], Assessment.prototype, "scope_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'selected_control_ids' }),
    __metadata("design:type", Array)
], Assessment.prototype, "selected_control_ids", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'selected_framework_ids' }),
    __metadata("design:type", Array)
], Assessment.prototype, "selected_framework_ids", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'start_date' }),
    __metadata("design:type", Date)
], Assessment.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'end_date' }),
    __metadata("design:type", Date)
], Assessment.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssessmentStatus,
        default: AssessmentStatus.NOT_STARTED,
    }),
    __metadata("design:type", String)
], Assessment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'lead_assessor_id' }),
    __metadata("design:type", String)
], Assessment.prototype, "lead_assessor_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'lead_assessor_id' }),
    __metadata("design:type", user_entity_1.User)
], Assessment.prototype, "lead_assessor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'assessor_ids' }),
    __metadata("design:type", Array)
], Assessment.prototype, "assessor_ids", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'controls_assessed' }),
    __metadata("design:type", Number)
], Assessment.prototype, "controls_assessed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'controls_total' }),
    __metadata("design:type", Number)
], Assessment.prototype, "controls_total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'findings_critical' }),
    __metadata("design:type", Number)
], Assessment.prototype, "findings_critical", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'findings_high' }),
    __metadata("design:type", Number)
], Assessment.prototype, "findings_high", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'findings_medium' }),
    __metadata("design:type", Number)
], Assessment.prototype, "findings_medium", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'findings_low' }),
    __metadata("design:type", Number)
], Assessment.prototype, "findings_low", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'overall_score' }),
    __metadata("design:type", Number)
], Assessment.prototype, "overall_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'assessment_procedures' }),
    __metadata("design:type", String)
], Assessment.prototype, "assessment_procedures", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'report_path' }),
    __metadata("design:type", String)
], Assessment.prototype, "report_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'approved_by' }),
    __metadata("design:type", String)
], Assessment.prototype, "approved_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", user_entity_1.User)
], Assessment.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'approval_date' }),
    __metadata("design:type", Date)
], Assessment.prototype, "approval_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', array: true, nullable: true }),
    __metadata("design:type", Array)
], Assessment.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_result_entity_1.AssessmentResult, (result) => result.assessment),
    __metadata("design:type", Array)
], Assessment.prototype, "results", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], Assessment.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Assessment.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Assessment.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], Assessment.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], Assessment.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Assessment.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Assessment.prototype, "deleted_at", void 0);
exports.Assessment = Assessment = __decorate([
    (0, typeorm_1.Entity)('assessments'),
    (0, typeorm_1.Index)(['assessment_identifier']),
    (0, typeorm_1.Index)(['assessment_type']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['lead_assessor_id']),
    (0, typeorm_1.Index)(['start_date', 'end_date'])
], Assessment);
//# sourceMappingURL=assessment.entity.js.map