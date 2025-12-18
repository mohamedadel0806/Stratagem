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
exports.IntegrationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const integration_service_1 = require("../services/integration.service");
const create_integration_config_dto_1 = require("../dto/create-integration-config.dto");
const update_integration_config_dto_1 = require("../dto/update-integration-config.dto");
const integration_config_response_dto_1 = require("../dto/integration-config-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
let IntegrationController = class IntegrationController {
    constructor(integrationService) {
        this.integrationService = integrationService;
    }
    async create(dto, user) {
        const config = await this.integrationService.createConfig(dto, user.id);
        return this.mapToResponseDto(config);
    }
    async findAll() {
        const configs = await this.integrationService.findAll();
        return configs.map((config) => this.mapToResponseDto(config));
    }
    async findOne(id) {
        const config = await this.integrationService.findOne(id);
        return this.mapToResponseDto(config);
    }
    async update(id, dto) {
        const config = await this.integrationService.update(id, dto);
        return this.mapToResponseDto(config);
    }
    async delete(id) {
        await this.integrationService.delete(id);
    }
    async testConnection(id) {
        return this.integrationService.testConnection(id);
    }
    async sync(id) {
        return this.integrationService.sync(id);
    }
    async handleWebhook(id, payload) {
        return this.integrationService.handleWebhookPayload(id, payload);
    }
    async getSyncHistory(id, limit) {
        return this.integrationService.getSyncHistory(id, limit || 20);
    }
    mapToResponseDto(config) {
        return {
            id: config.id,
            name: config.name,
            integrationType: config.integrationType,
            endpointUrl: config.endpointUrl,
            authenticationType: config.authenticationType,
            fieldMapping: config.fieldMapping,
            syncInterval: config.syncInterval,
            status: config.status,
            lastSyncError: config.lastSyncError,
            lastSyncAt: config.lastSyncAt,
            nextSyncAt: config.nextSyncAt,
            createdById: config.createdById,
            createdByName: config.createdBy
                ? `${config.createdBy.firstName} ${config.createdBy.lastName}`
                : undefined,
            notes: config.notes,
            createdAt: config.createdAt,
            updatedAt: config.updatedAt,
        };
    }
};
exports.IntegrationController = IntegrationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create integration configuration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Integration config created', type: integration_config_response_dto_1.IntegrationConfigResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_integration_config_dto_1.CreateIntegrationConfigDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all integration configurations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of integration configs', type: [integration_config_response_dto_1.IntegrationConfigResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get integration configuration by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Integration config ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integration config', type: integration_config_response_dto_1.IntegrationConfigResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update integration configuration' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Integration config ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integration config updated', type: integration_config_response_dto_1.IntegrationConfigResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_integration_config_dto_1.UpdateIntegrationConfigDto]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete integration configuration' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Integration config ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integration config deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test integration connection' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Integration config ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection test result' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Post)(':id/sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger manual synchronization' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Integration config ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Synchronization started' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "sync", null);
__decorate([
    (0, common_1.Post)(':id/webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Receive webhook payload for integration (asset management system push)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Integration config ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook payload processed' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Get)(':id/sync-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get synchronization history' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Integration config ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of sync logs' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getSyncHistory", null);
exports.IntegrationController = IntegrationController = __decorate([
    (0, swagger_1.ApiTags)('Integrations'),
    (0, common_1.Controller)('assets/integrations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [integration_service_1.IntegrationService])
], IntegrationController);
//# sourceMappingURL=integration.controller.js.map