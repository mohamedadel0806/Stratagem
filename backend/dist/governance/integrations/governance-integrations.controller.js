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
exports.GovernanceIntegrationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const governance_integrations_service_1 = require("./governance-integrations.service");
const create_hook_dto_1 = require("./dto/create-hook.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
const public_decorator_1 = require("../../auth/decorators/public.decorator");
let GovernanceIntegrationsController = class GovernanceIntegrationsController {
    constructor(integrationsService) {
        this.integrationsService = integrationsService;
    }
    create(dto, req) {
        return this.integrationsService.createHook(dto, req.user.id);
    }
    findAll() {
        return this.integrationsService.findAll();
    }
    getLogs(id) {
        return this.integrationsService.getLogs(id);
    }
    async handleWebhook(secret, payload, req) {
        var _a;
        const ip = req.ip || ((_a = req.connection) === null || _a === void 0 ? void 0 : _a.remoteAddress);
        return this.integrationsService.handleWebhook(secret, payload, ip);
    }
};
exports.GovernanceIntegrationsController = GovernanceIntegrationsController;
__decorate([
    (0, common_1.Post)('hooks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new integration hook' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hook_dto_1.CreateIntegrationHookDto, Object]),
    __metadata("design:returntype", void 0)
], GovernanceIntegrationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('hooks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all integration hooks' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GovernanceIntegrationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('hooks/:id/logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent delivery logs for a hook' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GovernanceIntegrationsController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Post)('webhook/:secret'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Receive external webhook payload' }),
    __param(0, (0, common_1.Param)('secret')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GovernanceIntegrationsController.prototype, "handleWebhook", null);
exports.GovernanceIntegrationsController = GovernanceIntegrationsController = __decorate([
    (0, swagger_1.ApiTags)('Governance - Integrations'),
    (0, common_1.Controller)('governance/integrations'),
    __metadata("design:paramtypes", [governance_integrations_service_1.GovernanceIntegrationsService])
], GovernanceIntegrationsController);
//# sourceMappingURL=governance-integrations.controller.js.map