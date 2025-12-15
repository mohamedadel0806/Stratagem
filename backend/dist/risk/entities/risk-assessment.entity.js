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
exports.RiskAssessment = exports.ConfidenceLevel = exports.ImpactLevel = exports.AssessmentType = void 0;
const typeorm_1 = require("typeorm");
const risk_entity_1 = require("./risk.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var AssessmentType;
(function (AssessmentType) {
    AssessmentType["INHERENT"] = "inherent";
    AssessmentType["CURRENT"] = "current";
    AssessmentType["TARGET"] = "target";
})(AssessmentType || (exports.AssessmentType = AssessmentType = {}));
var ImpactLevel;
(function (ImpactLevel) {
    ImpactLevel["NEGLIGIBLE"] = "negligible";
    ImpactLevel["MINOR"] = "minor";
    ImpactLevel["MODERATE"] = "moderate";
    ImpactLevel["MAJOR"] = "major";
    ImpactLevel["CATASTROPHIC"] = "catastrophic";
})(ImpactLevel || (exports.ImpactLevel = ImpactLevel = {}));
var ConfidenceLevel;
(function (ConfidenceLevel) {
    ConfidenceLevel["HIGH"] = "high";
    ConfidenceLevel["MEDIUM"] = "medium";
    ConfidenceLevel["LOW"] = "low";
})(ConfidenceLevel || (exports.ConfidenceLevel = ConfidenceLevel = {}));
let RiskAssessment = class RiskAssessment {
};
exports.RiskAssessment = RiskAssessment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RiskAssessment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'risk_id' }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "risk_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => risk_entity_1.Risk, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'risk_id' }),
    __metadata("design:type", risk_entity_1.Risk)
], RiskAssessment.prototype, "risk", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssessmentType,
        enumName: 'assessment_type_enum',
        name: 'assessment_type',
    }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "assessment_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', comment: '1-5 scale' }),
    __metadata("design:type", Number)
], RiskAssessment.prototype, "likelihood", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', comment: '1-5 scale' }),
    __metadata("design:type", Number)
], RiskAssessment.prototype, "impact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'risk_score' }),
    __metadata("design:type", Number)
], RiskAssessment.prototype, "risk_score", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: risk_entity_1.RiskLevel,
        enumName: 'risk_level_enum',
        nullable: true,
        name: 'risk_level',
    }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "risk_level", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ImpactLevel,
        enumName: 'impact_level_enum',
        nullable: true,
        name: 'financial_impact',
    }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "financial_impact", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
        name: 'financial_impact_amount',
    }),
    __metadata("design:type", Number)
], RiskAssessment.prototype, "financial_impact_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ImpactLevel,
        enumName: 'impact_level_enum',
        nullable: true,
        name: 'operational_impact',
    }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "operational_impact", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ImpactLevel,
        enumName: 'impact_level_enum',
        nullable: true,
        name: 'reputational_impact',
    }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "reputational_impact", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ImpactLevel,
        enumName: 'impact_level_enum',
        nullable: true,
        name: 'compliance_impact',
    }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "compliance_impact", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ImpactLevel,
        enumName: 'impact_level_enum',
        nullable: true,
        name: 'safety_impact',
    }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "safety_impact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: () => 'CURRENT_DATE', name: 'assessment_date' }),
    __metadata("design:type", Date)
], RiskAssessment.prototype, "assessment_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'assessor_id' }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "assessor_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assessor_id' }),
    __metadata("design:type", user_entity_1.User)
], RiskAssessment.prototype, "assessor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        default: 'qualitative_5x5',
        name: 'assessment_method',
    }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "assessment_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'assessment_notes' }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "assessment_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "assumptions", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ConfidenceLevel,
        enumName: 'confidence_level_enum',
        default: ConfidenceLevel.MEDIUM,
        name: 'confidence_level',
    }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "confidence_level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'evidence_attachments' }),
    __metadata("design:type", Array)
], RiskAssessment.prototype, "evidence_attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'is_latest' }),
    __metadata("design:type", Boolean)
], RiskAssessment.prototype, "is_latest", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], RiskAssessment.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RiskAssessment.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RiskAssessment.prototype, "updated_at", void 0);
exports.RiskAssessment = RiskAssessment = __decorate([
    (0, typeorm_1.Entity)('risk_assessments'),
    (0, typeorm_1.Index)(['risk_id']),
    (0, typeorm_1.Index)(['assessment_type']),
    (0, typeorm_1.Index)(['assessment_date']),
    (0, typeorm_1.Index)(['risk_level'])
], RiskAssessment);
//# sourceMappingURL=risk-assessment.entity.js.map