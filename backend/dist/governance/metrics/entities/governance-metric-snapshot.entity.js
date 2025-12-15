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
exports.GovernanceMetricSnapshot = void 0;
const typeorm_1 = require("typeorm");
let GovernanceMetricSnapshot = class GovernanceMetricSnapshot {
};
exports.GovernanceMetricSnapshot = GovernanceMetricSnapshot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GovernanceMetricSnapshot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', unique: true, name: 'snapshot_date' }),
    __metadata("design:type", String)
], GovernanceMetricSnapshot.prototype, "snapshot_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0, name: 'compliance_rate' }),
    __metadata("design:type", Number)
], GovernanceMetricSnapshot.prototype, "compliance_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'implemented_controls' }),
    __metadata("design:type", Number)
], GovernanceMetricSnapshot.prototype, "implemented_controls", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'total_controls' }),
    __metadata("design:type", Number)
], GovernanceMetricSnapshot.prototype, "total_controls", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'open_findings' }),
    __metadata("design:type", Number)
], GovernanceMetricSnapshot.prototype, "open_findings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'critical_findings' }),
    __metadata("design:type", Number)
], GovernanceMetricSnapshot.prototype, "critical_findings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0, name: 'assessment_completion_rate' }),
    __metadata("design:type", Number)
], GovernanceMetricSnapshot.prototype, "assessment_completion_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0, name: 'risk_closure_rate' }),
    __metadata("design:type", Number)
], GovernanceMetricSnapshot.prototype, "risk_closure_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'completed_assessments' }),
    __metadata("design:type", Number)
], GovernanceMetricSnapshot.prototype, "completed_assessments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'total_assessments' }),
    __metadata("design:type", Number)
], GovernanceMetricSnapshot.prototype, "total_assessments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0, name: 'approved_evidence' }),
    __metadata("design:type", Number)
], GovernanceMetricSnapshot.prototype, "approved_evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], GovernanceMetricSnapshot.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GovernanceMetricSnapshot.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], GovernanceMetricSnapshot.prototype, "updated_at", void 0);
exports.GovernanceMetricSnapshot = GovernanceMetricSnapshot = __decorate([
    (0, typeorm_1.Entity)('governance_metric_snapshots'),
    (0, typeorm_1.Index)(['snapshot_date'], { unique: true })
], GovernanceMetricSnapshot);
//# sourceMappingURL=governance-metric-snapshot.entity.js.map