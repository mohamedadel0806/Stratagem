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
exports.AssetControlController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const asset_control_service_1 = require("./services/asset-control.service");
const control_asset_mapping_entity_1 = require("./entities/control-asset-mapping.entity");
const unified_control_entity_1 = require("./entities/unified-control.entity");
let AssetControlController = class AssetControlController {
    constructor(assetControlService) {
        this.assetControlService = assetControlService;
    }
    async mapControlToAsset(controlId, dto, req) {
        return this.assetControlService.mapControlToAsset(controlId, dto, req.user.id);
    }
    async mapControlToAssets(controlId, dto, req) {
        return this.assetControlService.mapControlToAssets(controlId, dto, req.user.id);
    }
    async getAssetControls(assetId, assetType, page, limit) {
        return this.assetControlService.getAssetControls(assetId, assetType, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 25);
    }
    async getControlAssets(controlId, page, limit) {
        return this.assetControlService.getControlAssets(controlId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 25);
    }
    async updateMapping(controlId, assetId, dto) {
        return this.assetControlService.updateMapping(controlId, assetId, dto);
    }
    async deleteMapping(controlId, assetId) {
        return this.assetControlService.deleteMapping(controlId, assetId);
    }
    async getAssetComplianceScore(assetId, assetType) {
        return this.assetControlService.getAssetComplianceScore(assetId, assetType);
    }
    async getControlEffectiveness(controlId) {
        return this.assetControlService.getControlEffectiveness(controlId);
    }
    async getAssetControlMatrix(assetType, domain, status) {
        return this.assetControlService.getAssetControlMatrix(assetType, domain, status);
    }
    async getMatrixStatistics() {
        return this.assetControlService.getMatrixStatistics();
    }
    async bulkUpdateStatus(dto, req) {
        return this.assetControlService.bulkUpdateStatus(dto, req.user.id);
    }
    async getUnmappedControls(page, limit) {
        return this.assetControlService.getUnmappedControls(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 25);
    }
    async getComprehensiveStatistics() {
        return this.assetControlService.getComprehensiveStatistics();
    }
    async getComplianceByAssetType() {
        return this.assetControlService.getComplianceByAssetType();
    }
};
exports.AssetControlController = AssetControlController;
__decorate([
    (0, common_1.Post)('controls/:controlId/map-asset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Map a control to a single asset' }),
    (0, swagger_1.ApiParam)({ name: 'controlId', description: 'Unified Control ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Control mapped to asset successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Control not found' }),
    __param(0, (0, common_1.Param)('controlId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "mapControlToAsset", null);
__decorate([
    (0, common_1.Post)('controls/:controlId/map-assets'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Map a control to multiple assets (bulk)' }),
    (0, swagger_1.ApiParam)({ name: 'controlId', description: 'Unified Control ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Control mapped to assets successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error or conflict' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Control not found' }),
    __param(0, (0, common_1.Param)('controlId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "mapControlToAssets", null);
__decorate([
    (0, common_1.Get)('assets/:assetId/controls'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all controls for an asset' }),
    (0, swagger_1.ApiParam)({ name: 'assetId', description: 'Asset ID' }),
    (0, swagger_1.ApiQuery)({ name: 'assetType', enum: control_asset_mapping_entity_1.AssetType, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false, description: 'Default: 1' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false, description: 'Default: 25' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset controls retrieved successfully' }),
    __param(0, (0, common_1.Param)('assetId')),
    __param(1, (0, common_1.Query)('assetType')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "getAssetControls", null);
__decorate([
    (0, common_1.Get)('controls/:controlId/assets'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all assets for a control' }),
    (0, swagger_1.ApiParam)({ name: 'controlId', description: 'Unified Control ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false, description: 'Default: 1' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false, description: 'Default: 25' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Control assets retrieved successfully' }),
    __param(0, (0, common_1.Param)('controlId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "getControlAssets", null);
__decorate([
    (0, common_1.Put)('controls/:controlId/assets/:assetId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update a control-asset mapping' }),
    (0, swagger_1.ApiParam)({ name: 'controlId', description: 'Unified Control ID' }),
    (0, swagger_1.ApiParam)({ name: 'assetId', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mapping updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mapping not found' }),
    __param(0, (0, common_1.Param)('controlId')),
    __param(1, (0, common_1.Param)('assetId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "updateMapping", null);
__decorate([
    (0, common_1.Delete)('controls/:controlId/assets/:assetId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a control-asset mapping' }),
    (0, swagger_1.ApiParam)({ name: 'controlId', description: 'Unified Control ID' }),
    (0, swagger_1.ApiParam)({ name: 'assetId', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Mapping deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mapping not found' }),
    __param(0, (0, common_1.Param)('controlId')),
    __param(1, (0, common_1.Param)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "deleteMapping", null);
__decorate([
    (0, common_1.Get)('assets/:assetId/compliance-score'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate compliance score for an asset' }),
    (0, swagger_1.ApiParam)({ name: 'assetId', description: 'Asset ID' }),
    (0, swagger_1.ApiQuery)({ name: 'assetType', enum: control_asset_mapping_entity_1.AssetType, required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Compliance score calculated successfully' }),
    __param(0, (0, common_1.Param)('assetId')),
    __param(1, (0, common_1.Query)('assetType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "getAssetComplianceScore", null);
__decorate([
    (0, common_1.Get)('controls/:controlId/effectiveness'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate effectiveness score for a control' }),
    (0, swagger_1.ApiParam)({ name: 'controlId', description: 'Unified Control ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Effectiveness score calculated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Control not found' }),
    __param(0, (0, common_1.Param)('controlId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "getControlEffectiveness", null);
__decorate([
    (0, common_1.Get)('matrix'),
    (0, swagger_1.ApiOperation)({ summary: 'Get asset-control matrix for visualization' }),
    (0, swagger_1.ApiQuery)({
        name: 'assetType',
        enum: control_asset_mapping_entity_1.AssetType,
        required: false,
        description: 'Filter by asset type',
    }),
    (0, swagger_1.ApiQuery)({ name: 'domain', type: String, required: false, description: 'Filter by domain' }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        enum: unified_control_entity_1.ImplementationStatus,
        required: false,
        description: 'Filter by implementation status',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Matrix retrieved successfully' }),
    __param(0, (0, common_1.Query)('assetType')),
    __param(1, (0, common_1.Query)('domain')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "getAssetControlMatrix", null);
__decorate([
    (0, common_1.Get)('matrix/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get matrix statistics and metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "getMatrixStatistics", null);
__decorate([
    (0, common_1.Post)('mappings/bulk-update-status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update implementation status for multiple mappings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mappings updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "bulkUpdateStatus", null);
__decorate([
    (0, common_1.Get)('controls/unmapped'),
    (0, swagger_1.ApiOperation)({ summary: 'Get controls without any asset mappings' }),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false, description: 'Default: 1' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false, description: 'Default: 25' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unmapped controls retrieved successfully' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "getUnmappedControls", null);
__decorate([
    (0, common_1.Get)('statistics/comprehensive'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive asset-control statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comprehensive statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "getComprehensiveStatistics", null);
__decorate([
    (0, common_1.Get)('statistics/by-asset-type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get compliance statistics broken down by asset type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset type statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetControlController.prototype, "getComplianceByAssetType", null);
exports.AssetControlController = AssetControlController = __decorate([
    (0, swagger_1.ApiTags)('Asset-Control Integration'),
    (0, common_1.Controller)('governance/asset-control'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [asset_control_service_1.AssetControlService])
], AssetControlController);
//# sourceMappingURL=asset-control.controller.js.map