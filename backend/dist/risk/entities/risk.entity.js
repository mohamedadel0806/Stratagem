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
exports.Risk = exports.RiskLevel = exports.RiskVelocity = exports.ThreatSource = exports.RiskImpact = exports.RiskLikelihood = exports.RiskCategory_OLD = exports.RiskStatusNew = exports.RiskStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const risk_category_entity_1 = require("./risk-category.entity");
const risk_assessment_entity_1 = require("./risk-assessment.entity");
const risk_asset_link_entity_1 = require("./risk-asset-link.entity");
const risk_control_link_entity_1 = require("./risk-control-link.entity");
const risk_treatment_entity_1 = require("./risk-treatment.entity");
const kri_risk_link_entity_1 = require("./kri-risk-link.entity");
var RiskStatus;
(function (RiskStatus) {
    RiskStatus["IDENTIFIED"] = "identified";
    RiskStatus["ASSESSED"] = "assessed";
    RiskStatus["MITIGATED"] = "mitigated";
    RiskStatus["ACCEPTED"] = "accepted";
    RiskStatus["CLOSED"] = "closed";
})(RiskStatus || (exports.RiskStatus = RiskStatus = {}));
var RiskStatusNew;
(function (RiskStatusNew) {
    RiskStatusNew["ACTIVE"] = "active";
    RiskStatusNew["MONITORING"] = "monitoring";
    RiskStatusNew["CLOSED"] = "closed";
    RiskStatusNew["ACCEPTED"] = "accepted";
})(RiskStatusNew || (exports.RiskStatusNew = RiskStatusNew = {}));
var RiskCategory_OLD;
(function (RiskCategory_OLD) {
    RiskCategory_OLD["CYBERSECURITY"] = "cybersecurity";
    RiskCategory_OLD["DATA_PRIVACY"] = "data_privacy";
    RiskCategory_OLD["COMPLIANCE"] = "compliance";
    RiskCategory_OLD["OPERATIONAL"] = "operational";
    RiskCategory_OLD["FINANCIAL"] = "financial";
    RiskCategory_OLD["STRATEGIC"] = "strategic";
    RiskCategory_OLD["REPUTATIONAL"] = "reputational";
})(RiskCategory_OLD || (exports.RiskCategory_OLD = RiskCategory_OLD = {}));
var RiskLikelihood;
(function (RiskLikelihood) {
    RiskLikelihood[RiskLikelihood["VERY_LOW"] = 1] = "VERY_LOW";
    RiskLikelihood[RiskLikelihood["LOW"] = 2] = "LOW";
    RiskLikelihood[RiskLikelihood["MEDIUM"] = 3] = "MEDIUM";
    RiskLikelihood[RiskLikelihood["HIGH"] = 4] = "HIGH";
    RiskLikelihood[RiskLikelihood["VERY_HIGH"] = 5] = "VERY_HIGH";
})(RiskLikelihood || (exports.RiskLikelihood = RiskLikelihood = {}));
var RiskImpact;
(function (RiskImpact) {
    RiskImpact[RiskImpact["VERY_LOW"] = 1] = "VERY_LOW";
    RiskImpact[RiskImpact["LOW"] = 2] = "LOW";
    RiskImpact[RiskImpact["MEDIUM"] = 3] = "MEDIUM";
    RiskImpact[RiskImpact["HIGH"] = 4] = "HIGH";
    RiskImpact[RiskImpact["VERY_HIGH"] = 5] = "VERY_HIGH";
})(RiskImpact || (exports.RiskImpact = RiskImpact = {}));
var ThreatSource;
(function (ThreatSource) {
    ThreatSource["INTERNAL"] = "internal";
    ThreatSource["EXTERNAL"] = "external";
    ThreatSource["NATURAL"] = "natural";
})(ThreatSource || (exports.ThreatSource = ThreatSource = {}));
var RiskVelocity;
(function (RiskVelocity) {
    RiskVelocity["SLOW"] = "slow";
    RiskVelocity["MEDIUM"] = "medium";
    RiskVelocity["FAST"] = "fast";
    RiskVelocity["IMMEDIATE"] = "immediate";
})(RiskVelocity || (exports.RiskVelocity = RiskVelocity = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "low";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["HIGH"] = "high";
    RiskLevel["CRITICAL"] = "critical";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
let Risk = class Risk {
};
exports.Risk = Risk;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Risk.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true, nullable: true, name: 'risk_id' }),
    __metadata("design:type", String)
], Risk.prototype, "risk_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Risk.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Risk.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'risk_statement' }),
    __metadata("design:type", String)
], Risk.prototype, "risk_statement", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RiskCategory_OLD,
        default: RiskCategory_OLD.COMPLIANCE,
        name: 'category',
    }),
    __metadata("design:type", String)
], Risk.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'category_id' }),
    __metadata("design:type", String)
], Risk.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => risk_category_entity_1.RiskCategory, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", risk_category_entity_1.RiskCategory)
], Risk.prototype, "risk_category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'sub_category_id' }),
    __metadata("design:type", String)
], Risk.prototype, "sub_category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => risk_category_entity_1.RiskCategory, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sub_category_id' }),
    __metadata("design:type", risk_category_entity_1.RiskCategory)
], Risk.prototype, "risk_sub_category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RiskStatus,
        default: RiskStatus.IDENTIFIED,
    }),
    __metadata("design:type", String)
], Risk.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RiskLikelihood,
        default: RiskLikelihood.MEDIUM,
    }),
    __metadata("design:type", Number)
], Risk.prototype, "likelihood", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RiskImpact,
        default: RiskImpact.MEDIUM,
    }),
    __metadata("design:type", Number)
], Risk.prototype, "impact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'organizationId' }),
    __metadata("design:type", String)
], Risk.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'ownerId' }),
    __metadata("design:type", String)
], Risk.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ownerId' }),
    __metadata("design:type", user_entity_1.User)
], Risk.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'risk_analyst_id' }),
    __metadata("design:type", String)
], Risk.prototype, "risk_analyst_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'risk_analyst_id' }),
    __metadata("design:type", user_entity_1.User)
], Risk.prototype, "risk_analyst", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'date_identified' }),
    __metadata("design:type", Date)
], Risk.prototype, "date_identified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'next_review_date' }),
    __metadata("design:type", Date)
], Risk.prototype, "next_review_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'last_review_date' }),
    __metadata("design:type", Date)
], Risk.prototype, "last_review_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ThreatSource,
        nullable: true,
        name: 'threat_source',
    }),
    __metadata("design:type", String)
], Risk.prototype, "threat_source", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RiskVelocity,
        nullable: true,
        name: 'risk_velocity',
    }),
    __metadata("design:type", String)
], Risk.prototype, "risk_velocity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'early_warning_signs' }),
    __metadata("design:type", String)
], Risk.prototype, "early_warning_signs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'status_notes' }),
    __metadata("design:type", String)
], Risk.prototype, "status_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'business_process' }),
    __metadata("design:type", String)
], Risk.prototype, "business_process", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', array: true, nullable: true }),
    __metadata("design:type", Array)
], Risk.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true, name: 'business_unit_ids' }),
    __metadata("design:type", Array)
], Risk.prototype, "business_unit_ids", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1, name: 'version_number' }),
    __metadata("design:type", Number)
], Risk.prototype, "version_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'inherent_likelihood' }),
    __metadata("design:type", Number)
], Risk.prototype, "inherent_likelihood", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'inherent_impact' }),
    __metadata("design:type", Number)
], Risk.prototype, "inherent_impact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'inherent_risk_score' }),
    __metadata("design:type", Number)
], Risk.prototype, "inherent_risk_score", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RiskLevel,
        nullable: true,
        name: 'inherent_risk_level',
    }),
    __metadata("design:type", String)
], Risk.prototype, "inherent_risk_level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'current_likelihood' }),
    __metadata("design:type", Number)
], Risk.prototype, "current_likelihood", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'current_impact' }),
    __metadata("design:type", Number)
], Risk.prototype, "current_impact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'current_risk_score' }),
    __metadata("design:type", Number)
], Risk.prototype, "current_risk_score", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RiskLevel,
        nullable: true,
        name: 'current_risk_level',
    }),
    __metadata("design:type", String)
], Risk.prototype, "current_risk_level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'target_likelihood' }),
    __metadata("design:type", Number)
], Risk.prototype, "target_likelihood", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'target_impact' }),
    __metadata("design:type", Number)
], Risk.prototype, "target_impact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'target_risk_score' }),
    __metadata("design:type", Number)
], Risk.prototype, "target_risk_score", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RiskLevel,
        nullable: true,
        name: 'target_risk_level',
    }),
    __metadata("design:type", String)
], Risk.prototype, "target_risk_level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true, name: 'control_effectiveness' }),
    __metadata("design:type", Number)
], Risk.prototype, "control_effectiveness", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => risk_assessment_entity_1.RiskAssessment, (assessment) => assessment.risk),
    __metadata("design:type", Array)
], Risk.prototype, "assessments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => risk_asset_link_entity_1.RiskAssetLink, (link) => link.risk),
    __metadata("design:type", Array)
], Risk.prototype, "asset_links", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => risk_control_link_entity_1.RiskControlLink, (link) => link.risk),
    __metadata("design:type", Array)
], Risk.prototype, "control_links", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => risk_treatment_entity_1.RiskTreatment, (treatment) => treatment.risk),
    __metadata("design:type", Array)
], Risk.prototype, "treatments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kri_risk_link_entity_1.KRIRiskLink, (link) => link.risk),
    __metadata("design:type", Array)
], Risk.prototype, "kri_links", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], Risk.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Risk.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], Risk.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], Risk.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], Risk.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt' }),
    __metadata("design:type", Date)
], Risk.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Risk.prototype, "deleted_at", void 0);
exports.Risk = Risk = __decorate([
    (0, typeorm_1.Entity)('risks'),
    (0, typeorm_1.Index)(['risk_id']),
    (0, typeorm_1.Index)(['category_id']),
    (0, typeorm_1.Index)(['current_risk_level']),
    (0, typeorm_1.Index)(['next_review_date'])
], Risk);
//# sourceMappingURL=risk.entity.js.map