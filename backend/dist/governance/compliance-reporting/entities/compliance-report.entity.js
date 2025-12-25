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
exports.ComplianceReport = exports.ReportPeriod = exports.ComplianceScore = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
var ComplianceScore;
(function (ComplianceScore) {
    ComplianceScore["EXCELLENT"] = "EXCELLENT";
    ComplianceScore["GOOD"] = "GOOD";
    ComplianceScore["FAIR"] = "FAIR";
    ComplianceScore["POOR"] = "POOR";
})(ComplianceScore || (exports.ComplianceScore = ComplianceScore = {}));
var ReportPeriod;
(function (ReportPeriod) {
    ReportPeriod["WEEKLY"] = "WEEKLY";
    ReportPeriod["MONTHLY"] = "MONTHLY";
    ReportPeriod["QUARTERLY"] = "QUARTERLY";
    ReportPeriod["ANNUAL"] = "ANNUAL";
    ReportPeriod["CUSTOM"] = "CUSTOM";
})(ReportPeriod || (exports.ReportPeriod = ReportPeriod = {}));
let ComplianceReport = class ComplianceReport {
};
exports.ComplianceReport = ComplianceReport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ComplianceReport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "report_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReportPeriod, default: ReportPeriod.MONTHLY }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "report_period", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], ComplianceReport.prototype, "period_start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], ComplianceReport.prototype, "period_end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "overall_compliance_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ComplianceScore }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "overall_compliance_rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "policies_compliance_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "controls_compliance_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "assets_compliance_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "total_policies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "policies_published", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "policies_acknowledged", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "policy_acknowledgment_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "total_controls", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "controls_implemented", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "controls_partial", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "controls_not_implemented", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "average_control_effectiveness", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "total_assets", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "assets_compliant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "asset_compliance_percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "critical_gaps", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "medium_gaps", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "low_gaps", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], ComplianceReport.prototype, "gap_details", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], ComplianceReport.prototype, "department_breakdown", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], ComplianceReport.prototype, "compliance_trend", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "projected_score_next_period", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ComplianceReport.prototype, "projected_days_to_excellent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "trend_direction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "executive_summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "key_findings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "recommendations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ComplianceReport.prototype, "is_final", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ComplianceReport.prototype, "is_archived", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], ComplianceReport.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "created_by_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ComplianceReport.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ComplianceReport.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ComplianceReport.prototype, "generated_at", void 0);
exports.ComplianceReport = ComplianceReport = __decorate([
    (0, typeorm_1.Entity)('compliance_reports'),
    (0, typeorm_1.Index)('idx_compliance_reports_period_date', ['period_start_date', 'period_end_date']),
    (0, typeorm_1.Index)('idx_compliance_reports_overall_score', ['overall_compliance_score']),
    (0, typeorm_1.Index)('idx_compliance_reports_created_at', ['created_at']),
    (0, typeorm_1.Index)('idx_compliance_reports_created_by', ['created_by_id'])
], ComplianceReport);
//# sourceMappingURL=compliance-report.entity.js.map