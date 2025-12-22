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
exports.GovernanceDashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const governance_dashboard_service_1 = require("../services/governance-dashboard.service");
const governance_dashboard_dto_1 = require("../dto/governance-dashboard.dto");
const governance_trend_service_1 = require("../services/governance-trend.service");
const governance_trend_dto_1 = require("../dto/governance-trend.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let GovernanceDashboardController = class GovernanceDashboardController {
    constructor(dashboardService, trendService) {
        this.dashboardService = dashboardService;
        this.trendService = trendService;
    }
    async getDashboard(startDate, endDate) {
        return this.dashboardService.getDashboard(startDate, endDate);
    }
    async getDashboardTrends() {
        return this.trendService.getTrend();
    }
    async getEffectivenessTrends(controlId, rangeDays) {
        return this.trendService.getControlEffectivenessTrend(controlId, rangeDays);
    }
    async exportDashboard(startDate, endDate) {
        const dashboard = await this.dashboardService.getDashboard(startDate, endDate);
        return {
            message: 'PDF export functionality will be implemented with a PDF generation library',
            data: dashboard,
        };
    }
};
exports.GovernanceDashboardController = GovernanceDashboardController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get Governance dashboard overview' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Start date for filtering (ISO 8601)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'End date for filtering (ISO 8601)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Governance dashboard data',
        type: governance_dashboard_dto_1.GovernanceDashboardDto,
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GovernanceDashboardController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get historical metrics and compliance forecast' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historical metrics with projections', type: governance_trend_dto_1.GovernanceTrendResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceDashboardController.prototype, "getDashboardTrends", null);
__decorate([
    (0, common_1.Get)('effectiveness/trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get historical control effectiveness trends' }),
    __param(0, (0, common_1.Query)('controlId')),
    __param(1, (0, common_1.Query)('rangeDays')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], GovernanceDashboardController.prototype, "getEffectivenessTrends", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export dashboard to PDF' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'PDF file', content: { 'application/pdf': {} } }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GovernanceDashboardController.prototype, "exportDashboard", null);
exports.GovernanceDashboardController = GovernanceDashboardController = __decorate([
    (0, swagger_1.ApiTags)('governance'),
    (0, common_1.Controller)('governance/dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [governance_dashboard_service_1.GovernanceDashboardService,
        governance_trend_service_1.GovernanceTrendService])
], GovernanceDashboardController);
//# sourceMappingURL=governance-dashboard.controller.js.map