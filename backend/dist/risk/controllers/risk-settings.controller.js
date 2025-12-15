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
exports.RiskSettingsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const risk_settings_service_1 = require("../services/risk-settings.service");
const risk_settings_dto_1 = require("../dto/settings/risk-settings.dto");
let RiskSettingsController = class RiskSettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getSettings(req, organizationId) {
        var _a;
        const orgId = organizationId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
        return this.settingsService.getSettings(orgId);
    }
    async updateSettings(updateDto, req, organizationId) {
        var _a, _b;
        const orgId = organizationId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
        return this.settingsService.updateSettings(updateDto, userId, orgId);
    }
    async resetToDefaults(req, organizationId) {
        var _a, _b;
        const orgId = organizationId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
        return this.settingsService.resetToDefaults(userId, orgId);
    }
    async getRiskLevel(score, req, organizationId) {
        var _a;
        const orgId = organizationId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
        const result = await this.settingsService.getRiskLevelForScore(Number(score), orgId);
        if (!result) {
            return { message: 'No risk level found for the given score' };
        }
        return result;
    }
    async checkRiskAppetite(score, req, organizationId) {
        var _a;
        const orgId = organizationId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
        const settings = await this.settingsService.getSettings(orgId);
        const exceedsAppetite = await this.settingsService.exceedsRiskAppetite(Number(score), orgId);
        return {
            score: Number(score),
            exceedsAppetite,
            maxAcceptable: settings.max_acceptable_risk_score,
        };
    }
    async getAssessmentMethods(req, organizationId) {
        var _a;
        const orgId = organizationId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
        return this.settingsService.getActiveAssessmentMethods(orgId);
    }
    async getLikelihoodScale(req, organizationId) {
        var _a;
        const orgId = organizationId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
        return this.settingsService.getLikelihoodScale(orgId);
    }
    async getImpactScale(req, organizationId) {
        var _a;
        const orgId = organizationId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
        return this.settingsService.getImpactScale(orgId);
    }
};
exports.RiskSettingsController = RiskSettingsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('organization_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RiskSettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('organization_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_settings_dto_1.UpdateRiskSettingsDto, Object, String]),
    __metadata("design:returntype", Promise)
], RiskSettingsController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Post)('reset'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('organization_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RiskSettingsController.prototype, "resetToDefaults", null);
__decorate([
    (0, common_1.Get)('risk-level'),
    __param(0, (0, common_1.Query)('score')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('organization_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], RiskSettingsController.prototype, "getRiskLevel", null);
__decorate([
    (0, common_1.Get)('check-appetite'),
    __param(0, (0, common_1.Query)('score')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('organization_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], RiskSettingsController.prototype, "checkRiskAppetite", null);
__decorate([
    (0, common_1.Get)('assessment-methods'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('organization_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RiskSettingsController.prototype, "getAssessmentMethods", null);
__decorate([
    (0, common_1.Get)('likelihood-scale'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('organization_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RiskSettingsController.prototype, "getLikelihoodScale", null);
__decorate([
    (0, common_1.Get)('impact-scale'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('organization_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RiskSettingsController.prototype, "getImpactScale", null);
exports.RiskSettingsController = RiskSettingsController = __decorate([
    (0, common_1.Controller)('risk-settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [risk_settings_service_1.RiskSettingsService])
], RiskSettingsController);
//# sourceMappingURL=risk-settings.controller.js.map