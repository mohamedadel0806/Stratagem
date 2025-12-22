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
const alert_entity_1 = require("../entities/alert.entity");
const alert_rule_entity_1 = require("../entities/alert-rule.entity");
const alert_subscription_entity_1 = require("../entities/alert-subscription.entity");
const alert_log_entity_1 = require("../entities/alert-log.entity");
let AlertingController = class AlertingController {
    constructor(alertingService) {
        this.alertingService = alertingService;
    }
    async createAlert(dto, req) {
        return this.alertingService.createAlert(dto, req.user.id);
    }
    async getAlerts(status, severity, limit, offset) {
        const limitNum = limit ? parseInt(limit, 10) : 50;
        const offsetNum = offset ? parseInt(offset, 10) : 0;
        const [alerts, total] = await this.alertingService.getAlerts(status, severity, limitNum, offsetNum);
        return { alerts, total };
    }
    async getAlertById(id) {
        return this.alertingService.getAlertById(id);
    }
    async acknowledgeAlert(id, req) {
        return this.alertingService.acknowledgeAlert(id, req.user.id);
    }
    async resolveAlert(id, body, req) {
        return this.alertingService.resolveAlert(id, req.user.id, body.resolution);
    }
    async createAlertRule(dto) {
        return this.alertingService.createAlertRule(dto);
    }
    async getAlertRules(isActive) {
        return this.alertingService.getAlertRules(isActive);
    }
    async updateAlertRule(id, dto) {
        return this.alertingService.updateAlertRule(id, dto);
    }
    async deleteAlertRule(id) {
        return this.alertingService.deleteAlertRule(id);
    }
    async createAlertSubscription(dto) {
        return this.alertingService.createAlertSubscription(dto);
    }
    async getUserSubscriptions(userId) {
        return this.alertingService.getUserSubscriptions(userId);
    }
    async updateAlertSubscription(id, dto) {
        return this.alertingService.updateAlertSubscription(id, dto);
    }
    async deleteAlertSubscription(id) {
        return this.alertingService.deleteAlertSubscription(id);
    }
    async getAlertLogs(alertId) {
        return [];
    }
    async evaluateAlertRules() {
        await this.alertingService.evaluateAlertRules();
        return { message: 'Alert rule evaluation completed' };
    }
};
exports.AlertingController = AlertingController;
__decorate([
    (0, common_1.Post)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new alert' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Alert created successfully', type: alert_entity_1.Alert }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "createAlert", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alerts with optional filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: alert_entity_1.AlertStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'severity', enum: alert_entity_1.AlertSeverity, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false, description: 'Default: 50' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', type: Number, required: false, description: 'Default: 0' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alerts retrieved successfully' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('severity')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Get)('alerts/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert retrieved successfully', type: alert_entity_1.Alert }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "getAlertById", null);
__decorate([
    (0, common_1.Put)('alerts/:id/acknowledge'),
    (0, swagger_1.ApiOperation)({ summary: 'Acknowledge an alert' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert acknowledged successfully', type: alert_entity_1.Alert }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert not found' }),
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
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert resolved successfully', type: alert_entity_1.Alert }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "resolveAlert", null);
__decorate([
    (0, common_1.Post)('rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new alert rule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Alert rule created successfully', type: alert_rule_entity_1.AlertRule }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "createAlertRule", null);
__decorate([
    (0, common_1.Get)('rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert rules' }),
    (0, swagger_1.ApiQuery)({ name: 'enabled', type: Boolean, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rules retrieved successfully', type: [alert_rule_entity_1.AlertRule] }),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "getAlertRules", null);
__decorate([
    (0, common_1.Put)('rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an alert rule' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert rule ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule updated successfully', type: alert_rule_entity_1.AlertRule }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert rule not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "updateAlertRule", null);
__decorate([
    (0, common_1.Delete)('rules/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an alert rule' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert rule ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Alert rule deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert rule not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "deleteAlertRule", null);
__decorate([
    (0, common_1.Post)('subscriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new alert subscription' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Alert subscription created successfully', type: alert_subscription_entity_1.AlertSubscription }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "createAlertSubscription", null);
__decorate([
    (0, common_1.Get)('subscriptions/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user alert subscriptions' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User subscriptions retrieved successfully', type: [alert_subscription_entity_1.AlertSubscription] }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "getUserSubscriptions", null);
__decorate([
    (0, common_1.Put)('subscriptions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an alert subscription' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert subscription ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert subscription updated successfully', type: alert_subscription_entity_1.AlertSubscription }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert subscription not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "updateAlertSubscription", null);
__decorate([
    (0, common_1.Delete)('subscriptions/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an alert subscription' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Alert subscription ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Alert subscription deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert subscription not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "deleteAlertSubscription", null);
__decorate([
    (0, common_1.Get)('logs/alert/:alertId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert logs for a specific alert' }),
    (0, swagger_1.ApiParam)({ name: 'alertId', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert logs retrieved successfully', type: [alert_log_entity_1.AlertLog] }),
    __param(0, (0, common_1.Param)('alertId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "getAlertLogs", null);
__decorate([
    (0, common_1.Post)('rules/evaluate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Manually trigger alert rule evaluation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule evaluation completed' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertingController.prototype, "evaluateAlertRules", null);
exports.AlertingController = AlertingController = __decorate([
    (0, swagger_1.ApiTags)('Alerting'),
    (0, common_1.Controller)('governance/alerting'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [alerting_service_1.AlertingService])
], AlertingController);
//# sourceMappingURL=alerting.controller.js.map