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
exports.RiskSettings = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let RiskSettings = class RiskSettings {
};
exports.RiskSettings = RiskSettings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RiskSettings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'organization_id' }),
    __metadata("design:type", String)
], RiskSettings.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'risk_levels', default: () => `'${JSON.stringify([
            { level: 'low', minScore: 1, maxScore: 5, color: '#22c55e', description: 'Acceptable risk - monitor periodically', responseTime: '90 days', escalation: false },
            { level: 'medium', minScore: 6, maxScore: 11, color: '#eab308', description: 'Moderate risk - implement controls', responseTime: '30 days', escalation: false },
            { level: 'high', minScore: 12, maxScore: 19, color: '#f97316', description: 'Significant risk - prioritize treatment', responseTime: '7 days', escalation: true },
            { level: 'critical', minScore: 20, maxScore: 25, color: '#dc2626', description: 'Unacceptable risk - immediate action required', responseTime: '24 hours', escalation: true },
        ])}'` }),
    __metadata("design:type", Array)
], RiskSettings.prototype, "risk_levels", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'assessment_methods', default: () => `'${JSON.stringify([
            { id: 'qualitative_5x5', name: 'Qualitative 5x5 Matrix', description: 'Standard 5-point scales for likelihood and impact', likelihoodScale: 5, impactScale: 5, isDefault: true, isActive: true },
            { id: 'qualitative_3x3', name: 'Simplified 3x3 Matrix', description: 'Basic 3-point scales for quick assessments', likelihoodScale: 3, impactScale: 3, isDefault: false, isActive: true },
            { id: 'bowtie', name: 'Bowtie Analysis', description: 'Cause-consequence analysis with barriers', likelihoodScale: 5, impactScale: 5, isDefault: false, isActive: false },
        ])}'` }),
    __metadata("design:type", Array)
], RiskSettings.prototype, "assessment_methods", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'likelihood_scale', default: () => `'${JSON.stringify([
            { value: 1, label: 'Rare', description: 'Highly unlikely to occur (< 5% chance)' },
            { value: 2, label: 'Unlikely', description: 'Not expected but possible (5-20% chance)' },
            { value: 3, label: 'Possible', description: 'Could occur at some point (20-50% chance)' },
            { value: 4, label: 'Likely', description: 'More likely than not (50-80% chance)' },
            { value: 5, label: 'Almost Certain', description: 'Expected to occur (> 80% chance)' },
        ])}'` }),
    __metadata("design:type", Array)
], RiskSettings.prototype, "likelihood_scale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'impact_scale', default: () => `'${JSON.stringify([
            { value: 1, label: 'Negligible', description: 'Minimal impact on operations or objectives' },
            { value: 2, label: 'Minor', description: 'Limited impact, easily recoverable' },
            { value: 3, label: 'Moderate', description: 'Noticeable impact requiring management attention' },
            { value: 4, label: 'Major', description: 'Significant impact on key objectives' },
            { value: 5, label: 'Catastrophic', description: 'Severe impact threatening organizational survival' },
        ])}'` }),
    __metadata("design:type", Array)
], RiskSettings.prototype, "impact_scale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', name: 'max_acceptable_risk_score', default: 11 }),
    __metadata("design:type", Number)
], RiskSettings.prototype, "max_acceptable_risk_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'risk_acceptance_authority', default: 'executive' }),
    __metadata("design:type", String)
], RiskSettings.prototype, "risk_acceptance_authority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', name: 'default_review_period_days', default: 90 }),
    __metadata("design:type", Number)
], RiskSettings.prototype, "default_review_period_days", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'auto_calculate_risk_score', default: true }),
    __metadata("design:type", Boolean)
], RiskSettings.prototype, "auto_calculate_risk_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'require_assessment_evidence', default: false }),
    __metadata("design:type", Boolean)
], RiskSettings.prototype, "require_assessment_evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'enable_risk_appetite', default: true }),
    __metadata("design:type", Boolean)
], RiskSettings.prototype, "enable_risk_appetite", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'default_assessment_method', default: 'qualitative_5x5' }),
    __metadata("design:type", String)
], RiskSettings.prototype, "default_assessment_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'notify_on_high_risk', default: true }),
    __metadata("design:type", Boolean)
], RiskSettings.prototype, "notify_on_high_risk", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'notify_on_critical_risk', default: true }),
    __metadata("design:type", Boolean)
], RiskSettings.prototype, "notify_on_critical_risk", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'notify_on_review_due', default: true }),
    __metadata("design:type", Boolean)
], RiskSettings.prototype, "notify_on_review_due", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', name: 'review_reminder_days', default: 7 }),
    __metadata("design:type", Number)
], RiskSettings.prototype, "review_reminder_days", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1, name: 'version' }),
    __metadata("design:type", Number)
], RiskSettings.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], RiskSettings.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], RiskSettings.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RiskSettings.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], RiskSettings.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], RiskSettings.prototype, "updater", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RiskSettings.prototype, "updated_at", void 0);
exports.RiskSettings = RiskSettings = __decorate([
    (0, typeorm_1.Entity)('risk_settings'),
    (0, typeorm_1.Index)(['organization_id'], { unique: true })
], RiskSettings);
//# sourceMappingURL=risk-settings.entity.js.map