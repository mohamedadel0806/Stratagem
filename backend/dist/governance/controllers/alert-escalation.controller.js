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
exports.AlertEscalationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const alert_escalation_service_1 = require("../services/alert-escalation.service");
const alert_escalation_dto_1 = require("../dto/alert-escalation.dto");
const alert_entity_1 = require("../entities/alert.entity");
let AlertEscalationController = class AlertEscalationController {
    constructor(escalationService) {
        this.escalationService = escalationService;
    }
    async createEscalationChain(dto, req) {
        return this.escalationService.createEscalationChain(dto, req.user.id);
    }
    async getEscalationChain(id) {
        return this.escalationService.getEscalationChain(id);
    }
    async getAlertEscalationChains(alertId) {
        return this.escalationService.getAlertEscalationChains(alertId);
    }
    async getActiveEscalationChains() {
        return this.escalationService.getActiveEscalationChains();
    }
    async getEscalationChainsBySeverity(severity) {
        if (!Object.values(alert_entity_1.AlertSeverity).includes(severity)) {
            throw new common_1.BadRequestException(`Invalid severity: ${severity}`);
        }
        return this.escalationService.getEscalationChainsBySeverity(severity);
    }
    async escalateAlert(id, dto, req) {
        return this.escalationService.escalateAlert(id, req.user.id);
    }
    async resolveEscalationChain(id, dto, req) {
        return this.escalationService.resolveEscalationChain(id, dto.resolutionNotes, req.user.id);
    }
    async cancelEscalationChain(id, req) {
        return this.escalationService.cancelEscalationChain(id, req.user.id);
    }
    async getEscalationStatistics() {
        return this.escalationService.getEscalationStatistics();
    }
};
exports.AlertEscalationController = AlertEscalationController;
__decorate([
    (0, common_1.Post)('chains'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create an escalation chain for an alert' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Escalation chain created successfully',
        type: alert_escalation_dto_1.EscalationChainDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alert_escalation_dto_1.CreateEscalationChainDto, Object]),
    __metadata("design:returntype", Promise)
], AlertEscalationController.prototype, "createEscalationChain", null);
__decorate([
    (0, common_1.Get)('chains/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an escalation chain by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Escalation chain ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Escalation chain retrieved successfully',
        type: alert_escalation_dto_1.EscalationChainDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Escalation chain not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertEscalationController.prototype, "getEscalationChain", null);
__decorate([
    (0, common_1.Get)('alerts/:alertId/chains'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all escalation chains for an alert' }),
    (0, swagger_1.ApiParam)({ name: 'alertId', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Escalation chains retrieved successfully',
        type: [alert_escalation_dto_1.EscalationChainDto],
    }),
    __param(0, (0, common_1.Param)('alertId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertEscalationController.prototype, "getAlertEscalationChains", null);
__decorate([
    (0, common_1.Get)('chains/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active escalation chains' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active escalation chains retrieved successfully',
        type: [alert_escalation_dto_1.EscalationChainDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertEscalationController.prototype, "getActiveEscalationChains", null);
__decorate([
    (0, common_1.Get)('severity/:severity'),
    (0, swagger_1.ApiOperation)({ summary: 'Get escalation chains by alert severity' }),
    (0, swagger_1.ApiParam)({ name: 'severity', enum: alert_entity_1.AlertSeverity, description: 'Alert severity level' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Escalation chains retrieved successfully',
        type: [alert_escalation_dto_1.EscalationChainDto],
    }),
    __param(0, (0, common_1.Param)('severity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertEscalationController.prototype, "getEscalationChainsBySeverity", null);
__decorate([
    (0, common_1.Put)('chains/:id/escalate'),
    (0, swagger_1.ApiOperation)({ summary: 'Escalate an alert to the next level' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Escalation chain ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alert escalated successfully',
        type: alert_escalation_dto_1.EscalationChainDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Escalation chain not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, alert_escalation_dto_1.EscalateAlertDto, Object]),
    __metadata("design:returntype", Promise)
], AlertEscalationController.prototype, "escalateAlert", null);
__decorate([
    (0, common_1.Put)('chains/:id/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve an escalation chain' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Escalation chain ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Escalation chain resolved successfully',
        type: alert_escalation_dto_1.EscalationChainDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Escalation chain not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, alert_escalation_dto_1.ResolveEscalationChainDto, Object]),
    __metadata("design:returntype", Promise)
], AlertEscalationController.prototype, "resolveEscalationChain", null);
__decorate([
    (0, common_1.Put)('chains/:id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an escalation chain' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Escalation chain ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Escalation chain cancelled successfully',
        type: alert_escalation_dto_1.EscalationChainDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Escalation chain not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlertEscalationController.prototype, "cancelEscalationChain", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get escalation statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Escalation statistics retrieved successfully',
        type: alert_escalation_dto_1.EscalationStatisticsDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertEscalationController.prototype, "getEscalationStatistics", null);
exports.AlertEscalationController = AlertEscalationController = __decorate([
    (0, swagger_1.ApiTags)('Alert Escalation'),
    (0, common_1.Controller)('governance/alert-escalation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [alert_escalation_service_1.AlertEscalationService])
], AlertEscalationController);
//# sourceMappingURL=alert-escalation.controller.js.map