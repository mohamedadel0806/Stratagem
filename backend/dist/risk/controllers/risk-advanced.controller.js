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
exports.RiskAdvancedController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const risk_advanced_service_1 = require("../services/risk-advanced.service");
const risk_comparison_dto_1 = require("../dto/advanced/risk-comparison.dto");
let RiskAdvancedController = class RiskAdvancedController {
    constructor(advancedService) {
        this.advancedService = advancedService;
    }
    async compareRisks(request, req) {
        var _a;
        return this.advancedService.compareRisks(request, (_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
    }
    async simulateWhatIf(request, req) {
        var _a;
        return this.advancedService.simulateWhatIf(request, (_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
    }
    async batchWhatIf(request, req) {
        var _a;
        return this.advancedService.batchWhatIf(request, (_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
    }
    async generateReport(config, req) {
        var _a;
        return this.advancedService.generateCustomReport(config, (_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
    }
    getAvailableFields() {
        return this.advancedService.getAvailableReportFields();
    }
    async quickCompare(ids, req) {
        var _a;
        const riskIds = ids.split(',').filter(id => id.trim());
        return this.advancedService.compareRisks({ risk_ids: riskIds }, (_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
    }
    async quickWhatIf(riskId, likelihood, impact, controlEffectiveness, additionalControls, req) {
        var _a;
        return this.advancedService.simulateWhatIf({
            risk_id: riskId,
            simulated_likelihood: likelihood ? parseInt(likelihood) : undefined,
            simulated_impact: impact ? parseInt(impact) : undefined,
            simulated_control_effectiveness: controlEffectiveness ? parseInt(controlEffectiveness) : undefined,
            additional_controls: additionalControls ? parseInt(additionalControls) : undefined,
        }, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
    }
};
exports.RiskAdvancedController = RiskAdvancedController;
__decorate([
    (0, common_1.Post)('compare'),
    (0, swagger_1.ApiOperation)({
        summary: 'Compare multiple risks side-by-side',
        description: 'Provides detailed comparison of selected risks including scores, levels, controls, and calculated metrics like risk reduction percentage',
    }),
    (0, swagger_1.ApiBody)({ type: risk_comparison_dto_1.RiskComparisonRequestDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Risk comparison data', type: risk_comparison_dto_1.RiskComparisonResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_comparison_dto_1.RiskComparisonRequestDto, Object]),
    __metadata("design:returntype", Promise)
], RiskAdvancedController.prototype, "compareRisks", null);
__decorate([
    (0, common_1.Post)('what-if'),
    (0, swagger_1.ApiOperation)({
        summary: 'Simulate what-if scenario for a risk',
        description: 'Analyze how changing likelihood, impact, or control effectiveness would affect the risk score and level',
    }),
    (0, swagger_1.ApiBody)({ type: risk_comparison_dto_1.WhatIfScenarioRequestDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'What-if analysis result', type: risk_comparison_dto_1.WhatIfScenarioResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_comparison_dto_1.WhatIfScenarioRequestDto, Object]),
    __metadata("design:returntype", Promise)
], RiskAdvancedController.prototype, "simulateWhatIf", null);
__decorate([
    (0, common_1.Post)('what-if/batch'),
    (0, swagger_1.ApiOperation)({
        summary: 'Compare multiple what-if scenarios',
        description: 'Run multiple scenarios for a single risk to compare different mitigation strategies',
    }),
    (0, swagger_1.ApiBody)({ type: risk_comparison_dto_1.BatchWhatIfRequestDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Array of what-if results', type: [risk_comparison_dto_1.WhatIfScenarioResponseDto] }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_comparison_dto_1.BatchWhatIfRequestDto, Object]),
    __metadata("design:returntype", Promise)
], RiskAdvancedController.prototype, "batchWhatIf", null);
__decorate([
    (0, common_1.Post)('reports/generate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate custom risk report',
        description: 'Create a customized report with selected fields, filters, sorting, and grouping options',
    }),
    (0, swagger_1.ApiBody)({ type: risk_comparison_dto_1.CustomReportConfigDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Generated report data' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_comparison_dto_1.CustomReportConfigDto, Object]),
    __metadata("design:returntype", Promise)
], RiskAdvancedController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)('reports/fields'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get available report fields',
        description: 'Returns all available fields that can be included in custom reports, organized by category',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of available report fields' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RiskAdvancedController.prototype, "getAvailableFields", null);
__decorate([
    (0, common_1.Get)('quick-compare'),
    (0, swagger_1.ApiOperation)({
        summary: 'Quick compare risks by IDs (GET)',
        description: 'Compare risks using query parameters (convenience endpoint)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Risk comparison data' }),
    __param(0, (0, common_1.Query)('ids')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RiskAdvancedController.prototype, "quickCompare", null);
__decorate([
    (0, common_1.Get)('quick-whatif'),
    (0, swagger_1.ApiOperation)({
        summary: 'Quick what-if analysis (GET)',
        description: 'Run a what-if scenario using query parameters',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'What-if analysis result' }),
    __param(0, (0, common_1.Query)('risk_id')),
    __param(1, (0, common_1.Query)('likelihood')),
    __param(2, (0, common_1.Query)('impact')),
    __param(3, (0, common_1.Query)('control_effectiveness')),
    __param(4, (0, common_1.Query)('additional_controls')),
    __param(5, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RiskAdvancedController.prototype, "quickWhatIf", null);
exports.RiskAdvancedController = RiskAdvancedController = __decorate([
    (0, swagger_1.ApiTags)('Risk Advanced Features'),
    (0, common_1.Controller)('risks/advanced'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [risk_advanced_service_1.RiskAdvancedService])
], RiskAdvancedController);
//# sourceMappingURL=risk-advanced.controller.js.map