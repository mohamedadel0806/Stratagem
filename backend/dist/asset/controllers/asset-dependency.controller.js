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
exports.AssetDependencyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const asset_dependency_service_1 = require("../services/asset-dependency.service");
const create_asset_dependency_dto_1 = require("../dto/create-asset-dependency.dto");
const asset_dependency_response_dto_1 = require("../dto/asset-dependency-response.dto");
const asset_dependency_entity_1 = require("../entities/asset-dependency.entity");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
let AssetDependencyController = class AssetDependencyController {
    constructor(dependencyService) {
        this.dependencyService = dependencyService;
    }
    async create(type, id, createDto, user) {
        return this.dependencyService.create(type, id, createDto, user.id);
    }
    async findAll(type, id) {
        return this.dependencyService.findAll(type, id);
    }
    async findIncoming(type, id) {
        return this.dependencyService.findIncoming(type, id);
    }
    async checkDependencies(type, id) {
        return this.dependencyService.checkDependencies(type, id);
    }
    async getDependencyChain(type, id) {
        return this.dependencyService.getDependencyChain(type, id, 3, 'outgoing');
    }
    async remove(dependencyId) {
        await this.dependencyService.remove(dependencyId);
        return { message: 'Dependency removed successfully' };
    }
};
exports.AssetDependencyController = AssetDependencyController;
__decorate([
    (0, common_1.Post)(':type/:id/dependencies'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a dependency for an asset' }),
    (0, swagger_1.ApiParam)({ name: 'type', description: 'Asset type', enum: asset_dependency_entity_1.AssetType }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Dependency created successfully',
        type: asset_dependency_response_dto_1.AssetDependencyResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request or self-dependency' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Dependency already exists' }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_asset_dependency_dto_1.CreateAssetDependencyDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AssetDependencyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':type/:id/dependencies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all dependencies for an asset (outgoing)' }),
    (0, swagger_1.ApiParam)({ name: 'type', description: 'Asset type', enum: asset_dependency_entity_1.AssetType }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of dependencies',
        type: [asset_dependency_response_dto_1.AssetDependencyResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found' }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetDependencyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':type/:id/dependencies/incoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all incoming dependencies for an asset' }),
    (0, swagger_1.ApiParam)({ name: 'type', description: 'Asset type', enum: asset_dependency_entity_1.AssetType }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of incoming dependencies',
        type: [asset_dependency_response_dto_1.AssetDependencyResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found' }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetDependencyController.prototype, "findIncoming", null);
__decorate([
    (0, common_1.Get)(':type/:id/dependencies/check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if an asset has any dependencies (for deletion warnings)' }),
    (0, swagger_1.ApiParam)({ name: 'type', description: 'Asset type', enum: asset_dependency_entity_1.AssetType }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dependency check result',
    }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetDependencyController.prototype, "checkDependencies", null);
__decorate([
    (0, common_1.Get)(':type/:id/dependencies/chain'),
    (0, swagger_1.ApiOperation)({ summary: 'Get multi-level dependency chain (impact analysis)' }),
    (0, swagger_1.ApiParam)({ name: 'type', description: 'Asset type', enum: asset_dependency_entity_1.AssetType }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Multi-level dependency chain',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found' }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetDependencyController.prototype, "getDependencyChain", null);
__decorate([
    (0, common_1.Delete)('dependencies/:dependencyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a dependency' }),
    (0, swagger_1.ApiParam)({ name: 'dependencyId', description: 'Dependency ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dependency removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Dependency not found' }),
    __param(0, (0, common_1.Param)('dependencyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetDependencyController.prototype, "remove", null);
exports.AssetDependencyController = AssetDependencyController = __decorate([
    (0, swagger_1.ApiTags)('assets'),
    (0, common_1.Controller)('assets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [asset_dependency_service_1.AssetDependencyService])
], AssetDependencyController);
//# sourceMappingURL=asset-dependency.controller.js.map