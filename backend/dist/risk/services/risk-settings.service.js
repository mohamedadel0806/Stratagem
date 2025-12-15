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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskSettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const risk_settings_entity_1 = require("../entities/risk-settings.entity");
let RiskSettingsService = class RiskSettingsService {
    constructor(settingsRepository) {
        this.settingsRepository = settingsRepository;
    }
    async getSettings(organizationId) {
        let settings = await this.settingsRepository.findOne({
            where: organizationId ? { organization_id: organizationId } : {},
            relations: ['updater'],
        });
        if (!settings) {
            settings = await this.createDefaultSettings(organizationId);
        }
        return this.toResponseDto(settings);
    }
    async updateSettings(updateDto, userId, organizationId) {
        let settings = await this.settingsRepository.findOne({
            where: organizationId ? { organization_id: organizationId } : {},
        });
        if (!settings) {
            settings = await this.createDefaultSettings(organizationId);
        }
        Object.assign(settings, Object.assign(Object.assign({}, updateDto), { updated_by: userId, version: settings.version + 1 }));
        const savedSettings = await this.settingsRepository.save(settings);
        return this.toResponseDto(savedSettings);
    }
    async resetToDefaults(userId, organizationId) {
        let settings = await this.settingsRepository.findOne({
            where: organizationId ? { organization_id: organizationId } : {},
        });
        if (settings) {
            await this.settingsRepository.remove(settings);
        }
        const newSettings = await this.createDefaultSettings(organizationId, userId);
        return this.toResponseDto(newSettings);
    }
    async getRiskLevelForScore(score, organizationId) {
        const settings = await this.getSettings(organizationId);
        const riskLevel = settings.risk_levels.find(level => score >= level.minScore && score <= level.maxScore);
        return riskLevel || null;
    }
    async exceedsRiskAppetite(score, organizationId) {
        const settings = await this.getSettings(organizationId);
        if (!settings.enable_risk_appetite) {
            return false;
        }
        return score > settings.max_acceptable_risk_score;
    }
    async getActiveAssessmentMethods(organizationId) {
        const settings = await this.getSettings(organizationId);
        return settings.assessment_methods.filter(method => method.isActive);
    }
    async getDefaultAssessmentMethod(organizationId) {
        const settings = await this.getSettings(organizationId);
        return settings.default_assessment_method;
    }
    async getLikelihoodScale(organizationId) {
        const settings = await this.getSettings(organizationId);
        return settings.likelihood_scale;
    }
    async getImpactScale(organizationId) {
        const settings = await this.getSettings(organizationId);
        return settings.impact_scale;
    }
    async createDefaultSettings(organizationId, userId) {
        const defaultSettings = this.settingsRepository.create({
            organization_id: organizationId,
            created_by: userId,
        });
        return await this.settingsRepository.save(defaultSettings);
    }
    toResponseDto(settings) {
        var _a, _b;
        return {
            id: settings.id,
            organization_id: settings.organization_id,
            risk_levels: settings.risk_levels,
            assessment_methods: settings.assessment_methods,
            likelihood_scale: settings.likelihood_scale,
            impact_scale: settings.impact_scale,
            max_acceptable_risk_score: settings.max_acceptable_risk_score,
            risk_acceptance_authority: settings.risk_acceptance_authority,
            default_review_period_days: settings.default_review_period_days,
            auto_calculate_risk_score: settings.auto_calculate_risk_score,
            require_assessment_evidence: settings.require_assessment_evidence,
            enable_risk_appetite: settings.enable_risk_appetite,
            default_assessment_method: settings.default_assessment_method,
            notify_on_high_risk: settings.notify_on_high_risk,
            notify_on_critical_risk: settings.notify_on_critical_risk,
            notify_on_review_due: settings.notify_on_review_due,
            review_reminder_days: settings.review_reminder_days,
            version: settings.version,
            created_at: (_a = settings.created_at) === null || _a === void 0 ? void 0 : _a.toISOString(),
            updated_at: (_b = settings.updated_at) === null || _b === void 0 ? void 0 : _b.toISOString(),
            updated_by_name: settings.updater
                ? `${settings.updater.firstName || ''} ${settings.updater.lastName || ''}`.trim()
                : undefined,
        };
    }
};
exports.RiskSettingsService = RiskSettingsService;
exports.RiskSettingsService = RiskSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(risk_settings_entity_1.RiskSettings)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RiskSettingsService);
//# sourceMappingURL=risk-settings.service.js.map