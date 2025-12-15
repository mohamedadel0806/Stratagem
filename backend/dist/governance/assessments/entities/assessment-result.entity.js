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
exports.AssessmentResult = exports.AssessmentResultEnum = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
const assessment_entity_1 = require("./assessment.entity");
const unified_control_entity_1 = require("../../unified-controls/entities/unified-control.entity");
var AssessmentResultEnum;
(function (AssessmentResultEnum) {
    AssessmentResultEnum["COMPLIANT"] = "compliant";
    AssessmentResultEnum["NON_COMPLIANT"] = "non_compliant";
    AssessmentResultEnum["PARTIALLY_COMPLIANT"] = "partially_compliant";
    AssessmentResultEnum["NOT_APPLICABLE"] = "not_applicable";
    AssessmentResultEnum["NOT_TESTED"] = "not_tested";
})(AssessmentResultEnum || (exports.AssessmentResultEnum = AssessmentResultEnum = {}));
let AssessmentResult = class AssessmentResult {
};
exports.AssessmentResult = AssessmentResult;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssessmentResult.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'assessment_id' }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "assessment_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_entity_1.Assessment, (assessment) => assessment.results, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'assessment_id' }),
    __metadata("design:type", assessment_entity_1.Assessment)
], AssessmentResult.prototype, "assessment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'unified_control_id' }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "unified_control_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unified_control_entity_1.UnifiedControl, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'unified_control_id' }),
    __metadata("design:type", unified_control_entity_1.UnifiedControl)
], AssessmentResult.prototype, "unified_control", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'assessor_id' }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "assessor_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assessor_id' }),
    __metadata("design:type", user_entity_1.User)
], AssessmentResult.prototype, "assessor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'assessment_date' }),
    __metadata("design:type", Date)
], AssessmentResult.prototype, "assessment_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'assessment_procedure_followed' }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "assessment_procedure_followed", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssessmentResultEnum,
    }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'effectiveness_rating' }),
    __metadata("design:type", Number)
], AssessmentResult.prototype, "effectiveness_rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "findings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "observations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "recommendations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'evidence_collected' }),
    __metadata("design:type", Array)
], AssessmentResult.prototype, "evidence_collected", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'requires_remediation' }),
    __metadata("design:type", Boolean)
], AssessmentResult.prototype, "requires_remediation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'remediation_due_date' }),
    __metadata("design:type", Date)
], AssessmentResult.prototype, "remediation_due_date", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AssessmentResult.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], AssessmentResult.prototype, "updated_at", void 0);
exports.AssessmentResult = AssessmentResult = __decorate([
    (0, typeorm_1.Entity)('assessment_results'),
    (0, typeorm_1.Index)(['assessment_id']),
    (0, typeorm_1.Index)(['unified_control_id']),
    (0, typeorm_1.Index)(['result']),
    (0, typeorm_1.Index)(['assessor_id'])
], AssessmentResult);
//# sourceMappingURL=assessment-result.entity.js.map