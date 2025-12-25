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
exports.GovernanceFrameworkConfigController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const governance_framework_config_service_1 = require("./governance-framework-config.service");
const create_governance_framework_config_dto_1 = require("./dto/create-governance-framework-config.dto");
const update_governance_framework_config_dto_1 = require("./dto/update-governance-framework-config.dto");
const governance_framework_config_query_dto_1 = require("./dto/governance-framework-config-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const audit_decorator_1 = require("../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../common/entities/audit-log.entity");
let GovernanceFrameworkConfigController = class GovernanceFrameworkConfigController {
    constructor(frameworkConfigService) {
        this.frameworkConfigService = frameworkConfigService;
    }
    create(createFrameworkConfigDto, req) {
        return this.frameworkConfigService.create(createFrameworkConfigDto, req.user.id);
    }
    findAll(queryDto) {
        return this.frameworkConfigService.findAll(queryDto);
    }
    findByFrameworkType(frameworkType) {
        return this.frameworkConfigService.findByFrameworkType(frameworkType);
    }
    findActiveConfigs() {
        return this.frameworkConfigService.findActiveConfigs();
    }
    findOne(id) {
        return this.frameworkConfigService.findOne(id);
    }
    update(id, updateFrameworkConfigDto, req) {
        return this.frameworkConfigService.update(id, updateFrameworkConfigDto, req.user.id);
    }
    activate(id, req) {
        return this.frameworkConfigService.activate(id, req.user.id);
    }
    deactivate(id, req) {
        return this.frameworkConfigService.deactivate(id, req.user.id);
    }
    remove(id) {
        return this.frameworkConfigService.remove(id);
    }
    hardDelete(id) {
        return this.frameworkConfigService.hardDelete(id);
    }
};
exports.GovernanceFrameworkConfigController = GovernanceFrameworkConfigController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'GovernanceFrameworkConfig'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new governance framework configuration' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Framework configuration created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_governance_framework_config_dto_1.CreateGovernanceFrameworkConfigDto, Object]),
    __metadata("design:returntype", void 0)
], GovernanceFrameworkConfigController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all governance framework configurations with filtering',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of framework configurations' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [governance_framework_config_query_dto_1.GovernanceFrameworkConfigQueryDto]),
    __metadata("design:returntype", void 0)
], GovernanceFrameworkConfigController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-type/:framework_type'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all framework configurations by framework type',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of framework configurations by type',
    }),
    __param(0, (0, common_1.Param)('framework_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GovernanceFrameworkConfigController.prototype, "findByFrameworkType", null);
__decorate([
    (0, common_1.Get)('active/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active framework configurations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of active framework configurations',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GovernanceFrameworkConfigController.prototype, "findActiveConfigs", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a framework configuration by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Framework configuration details',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GovernanceFrameworkConfigController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'GovernanceFrameworkConfig'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a framework configuration' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Framework configuration updated successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_governance_framework_config_dto_1.UpdateGovernanceFrameworkConfigDto, Object]),
    __metadata("design:returntype", void 0)
], GovernanceFrameworkConfigController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'GovernanceFrameworkConfig'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a framework configuration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Configuration activated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GovernanceFrameworkConfigController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/deactivate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'GovernanceFrameworkConfig'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a framework configuration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Configuration deactivated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GovernanceFrameworkConfigController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'GovernanceFrameworkConfig'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a framework configuration' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Configuration deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GovernanceFrameworkConfigController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(':id/hard'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'GovernanceFrameworkConfig'),
    (0, swagger_1.ApiOperation)({ summary: 'Hard delete a framework configuration' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Configuration hard deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GovernanceFrameworkConfigController.prototype, "hardDelete", null);
exports.GovernanceFrameworkConfigController = GovernanceFrameworkConfigController = __decorate([
    (0, swagger_1.ApiTags)('governance'),
    (0, common_1.Controller)('governance/framework-configs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [governance_framework_config_service_1.GovernanceFrameworkConfigService])
], GovernanceFrameworkConfigController);
//# sourceMappingURL=governance-framework-config.controller.js.map