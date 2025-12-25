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
exports.AlertingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const alerting_service_1 = require("../services/alerting.service");
const alert_rule_service_1 = require("../services/alert-rule.service");
const alert_dto_1 = require("../dto/alert.dto");
const alert_entity_1 = require("../entities/alert.entity");
let AlertingController = class AlertingController {
    constructor(alertingService, alertRuleService) {
        this.alertingService = alertingService;
        this.alertRuleService = alertRuleService;
    }
    async createAlert(dto, req) {
        return this.alertingService.createAlert(dto, req.user.id);
    }
    async getAlerts(status, severity, type, search, page, limit) {
        return this.alertingService.getAlerts({
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 10,
            status,
            severity,
            type,
            search,
        });
    }
    async getAlert(id) {
        return this.alertingService.getAlert(id);
    }
    async getRecentCriticalAlerts(limit) {
        const limitNum = limit ? parseInt(limit, 10) : 5;
        return this.alertingService.getRecentCriticalAlerts(limitNum);
    }
    async acknowledgeAlert(id, req) {
        return this.alertingService.acknowledgeAlert(id, req.user.id);
    }
    async resolveAlert(id, body, req) {
        return this.alertingService.resolveAlert(id, req.user.id, body.resolutionNotes);
    }
    async dismissAlert(id) {
        return this.alertingService.dismissAlert(id);
    }
    async markAllAlertsAsAcknowledged(req) {
        return this.alertingService.markAllAlertsAsAcknowledged(req.user.id);
    }
    async deleteAlert(id) {
        return this.alertingService.deleteAlert(id);
    }
    async getAlertStatistics() {
        return this.alertingService.getAlertStatistics();
    }
    async createAlertRule(dto, req) {
        return this.alertingService.createAlertRule(dto, req.user.id);
    }
    async getAlertRules(search, page, limit) {
        return this.alertingService.getAlertRules({
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 10,
            search,
        });
    }
    async getAlertRule(id) {
        return this.alertingService.getAlertRule(id);
    }
    async updateAlertRule(id, dto) {
        return this.alertingService.updateAlertRule(id, dto);
    }
    async toggleAlertRule(id, body) {
        return this.alertingService.toggleAlertRule(id, body.isActive);
    }
    async deleteAlertRule(id) {
        return this.alertingService.deleteAlertRule(id);
    }
    async testAlertRule(id) {
        return this.alertingService.testAlertRule(id);
    }
    async getAlertRuleStatistics() {
        return this.alertingService.getAlertRuleStatistics();
    }
};
exports.AlertingController = AlertingController;
__decorate([
    (0, common_1.Post)('alerts'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new alert' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Alert created successfully', type: alert_dto_1.AlertDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alert_dto_1.CreateAlertDto, Object]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "createAlert", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all alerts with pagination and filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: alert_entity_1.AlertStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'severity', enum: alert_entity_1.AlertSeverity, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: alert_entity_1.AlertType, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false, description: 'Default: 1' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false, description: 'Default: 10' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alerts retrieved successfully' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('severity')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Get)('alerts/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert retrieved successfully', type: alert_dto_1.AlertDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "getAlert", null);
__decorate([
    (0, common_1.Get)('alerts/recent/critical'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent critical alerts for widget' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false, description: 'Default: 5' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recent critical alerts retrieved' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "getRecentCriticalAlerts", null);
__decorate([
    (0, common_1.Put)('alerts/:id/acknowledge'),
    (0, swagger_1.ApiOperation)({ summary: 'Acknowledge an alert' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert acknowledged successfully', type: alert_dto_1.AlertDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot acknowledge alert in this state' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "acknowledgeAlert", null);
__decorate([
    (0, common_1.Put)('alerts/:id/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve an alert' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert resolved successfully', type: alert_dto_1.AlertDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot resolve alert in this state' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "resolveAlert", null);
__decorate([
    (0, common_1.Put)('alerts/:id/dismiss'),
    (0, swagger_1.ApiOperation)({ summary: 'Dismiss an alert' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert dismissed successfully', type: alert_dto_1.AlertDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "dismissAlert", null);
__decorate([
    (0, common_1.Put)('alerts/acknowledge/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all active alerts as acknowledged' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All alerts acknowledged' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "markAllAlertsAsAcknowledged", null);
__decorate([
    (0, common_1.Delete)('alerts/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an alert permanently' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "deleteAlert", null);
__decorate([
    (0, common_1.Get)('alerts/statistics/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "getAlertStatistics", null);
__decorate([
    (0, common_1.Post)('rules'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new alert rule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Alert rule created successfully', type: alert_dto_1.AlertRuleDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alert_dto_1.CreateAlertRuleDto, Object]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "createAlertRule", null);
__decorate([
    (0, common_1.Get)('rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert rules with filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'search', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false, description: 'Default: 1' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false, description: 'Default: 10' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rules retrieved successfully' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "getAlertRules", null);
__decorate([
    (0, common_1.Get)('rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert rule by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert rule ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule retrieved successfully', type: alert_dto_1.AlertRuleDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert rule not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "getAlertRule", null);
__decorate([
    (0, common_1.Put)('rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an alert rule' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert rule ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule updated successfully', type: alert_dto_1.AlertRuleDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert rule not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, alert_dto_1.UpdateAlertRuleDto]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "updateAlertRule", null);
__decorate([
    (0, common_1.Put)('rules/:id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle alert rule active status' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert rule ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule toggled successfully', type: alert_dto_1.AlertRuleDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert rule not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "toggleAlertRule", null);
__decorate([
    (0, common_1.Delete)('rules/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an alert rule' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert rule ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert rule not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "deleteAlertRule", null);
__decorate([
    (0, common_1.Post)('rules/:id/test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test alert rule matching logic' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert rule ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test results retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert rule not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "testAlertRule", null);
__decorate([
    (0, common_1.Get)('rules/statistics/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert rule statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "getAlertRuleStatistics", null);
exports.AlertingController = AlertingController = __decorate([
    (0, swagger_1.ApiTags)('Alerting'),
    (0, common_1.Controller)('governance/alerting'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [alerting_service_1.AlertingService,
        alert_rule_service_1.AlertRuleService])
], AlertingController);
//# sourceMappingURL=alerting.controller.js.map