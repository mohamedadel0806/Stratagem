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
exports.UnifiedControlsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const unified_controls_service_1 = require("./unified-controls.service");
const control_asset_mapping_service_1 = require("./services/control-asset-mapping.service");
const framework_control_mapping_service_1 = require("./services/framework-control-mapping.service");
const create_unified_control_dto_1 = require("./dto/create-unified-control.dto");
const unified_control_query_dto_1 = require("./dto/unified-control-query.dto");
const create_control_asset_mapping_dto_1 = require("./dto/create-control-asset-mapping.dto");
const bulk_delete_control_asset_mapping_dto_1 = require("./dto/bulk-delete-control-asset-mapping.dto");
const update_control_asset_mapping_dto_1 = require("./dto/update-control-asset-mapping.dto");
const control_asset_mapping_query_dto_1 = require("./dto/control-asset-mapping-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const risk_control_link_service_1 = require("../../risk/services/risk-control-link.service");
let UnifiedControlsController = class UnifiedControlsController {
    constructor(unifiedControlsService, controlAssetMappingService, frameworkControlMappingService, riskControlLinkService) {
        this.unifiedControlsService = unifiedControlsService;
        this.controlAssetMappingService = controlAssetMappingService;
        this.frameworkControlMappingService = frameworkControlMappingService;
        this.riskControlLinkService = riskControlLinkService;
    }
    create(createDto, req) {
        return this.unifiedControlsService.create(createDto, req.user.id);
    }
    findAll(queryDto) {
        return this.unifiedControlsService.findAll(queryDto);
    }
    findOne(id) {
        return this.unifiedControlsService.findOne(id);
    }
    update(id, updateDto, req) {
        return this.unifiedControlsService.update(id, updateDto, req.user.id);
    }
    remove(id) {
        return this.unifiedControlsService.remove(id);
    }
    linkAsset(controlId, createDto, req) {
        return this.controlAssetMappingService.create(controlId, createDto, req.user.id);
    }
    bulkLinkAssets(controlId, bulkDto, req) {
        return this.controlAssetMappingService.bulkCreate(controlId, bulkDto, req.user.id);
    }
    getLinkedAssets(controlId, queryDto) {
        return this.controlAssetMappingService.findAll(controlId, queryDto);
    }
    getMapping(controlId, mappingId) {
        return this.controlAssetMappingService.findOne(controlId, mappingId);
    }
    updateMapping(controlId, mappingId, updateDto) {
        return this.controlAssetMappingService.update(controlId, mappingId, updateDto);
    }
    unlinkAsset(controlId, mappingId) {
        return this.controlAssetMappingService.remove(controlId, mappingId);
    }
    bulkUnlinkAssets(controlId, bulkDto) {
        return this.controlAssetMappingService.bulkRemove(controlId, bulkDto.mapping_ids);
    }
    getControlsForAsset(assetType, assetId, queryDto) {
        return this.controlAssetMappingService.getControlsByAsset(assetType, assetId);
    }
    linkControlsToAsset(assetType, assetId, body, req) {
        return this.controlAssetMappingService.linkControlsToAsset(assetType, assetId, body.control_ids, body.implementation_status, body.implementation_notes, req.user.id);
    }
    unlinkControlFromAsset(assetType, assetId, controlId) {
        return this.controlAssetMappingService.removeByAsset(controlId, assetType, assetId);
    }
    getRisks(controlId) {
        return this.riskControlLinkService.getRisksForControl(controlId);
    }
    getRiskEffectiveness(controlId) {
        return this.riskControlLinkService.getControlEffectivenessForControl(controlId);
    }
    getFrameworkMappings(id) {
        return this.frameworkControlMappingService.getMappingsForControl(id);
    }
    createFrameworkMapping(controlId, body, req) {
        return this.frameworkControlMappingService.createMapping(controlId, body.requirement_id, body.coverage_level, body.mapping_notes, req.user.id);
    }
    bulkCreateFrameworkMappings(controlId, body, req) {
        return this.frameworkControlMappingService.bulkCreateMappings(controlId, body.requirement_ids, body.coverage_level, body.mapping_notes, req.user.id);
    }
    updateFrameworkMapping(mappingId, body) {
        return this.frameworkControlMappingService.updateMapping(mappingId, body.coverage_level, body.mapping_notes);
    }
    deleteFrameworkMapping(mappingId) {
        return this.frameworkControlMappingService.deleteMapping(mappingId);
    }
};
exports.UnifiedControlsController = UnifiedControlsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_unified_control_dto_1.CreateUnifiedControlDto, Object]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [unified_control_query_dto_1.UnifiedControlQueryDto]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/assets'),
    (0, swagger_1.ApiOperation)({ summary: 'Link an asset to a control' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Asset linked to control successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Control not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Asset already linked to control' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_control_asset_mapping_dto_1.CreateControlAssetMappingDto, Object]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "linkAsset", null);
__decorate([
    (0, common_1.Post)(':id/assets/bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk link assets to a control' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Assets linked to control successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_control_asset_mapping_dto_1.BulkCreateControlAssetMappingDto, Object]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "bulkLinkAssets", null);
__decorate([
    (0, common_1.Get)(':id/assets'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all assets linked to a control' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of linked assets' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, control_asset_mapping_query_dto_1.ControlAssetMappingQueryDto]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "getLinkedAssets", null);
__decorate([
    (0, common_1.Get)(':id/assets/:mappingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific control-asset mapping' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Control-asset mapping details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mapping not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('mappingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "getMapping", null);
__decorate([
    (0, common_1.Patch)(':id/assets/:mappingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a control-asset mapping' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mapping updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mapping not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('mappingId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_control_asset_mapping_dto_1.UpdateControlAssetMappingDto]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "updateMapping", null);
__decorate([
    (0, common_1.Delete)(':id/assets/:mappingId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Unlink an asset from a control' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Asset unlinked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mapping not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('mappingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "unlinkAsset", null);
__decorate([
    (0, common_1.Delete)(':id/assets/bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk unlink assets from a control' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assets unlinked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Control not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bulk_delete_control_asset_mapping_dto_1.BulkDeleteControlAssetMappingDto]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "bulkUnlinkAssets", null);
__decorate([
    (0, common_1.Get)('assets/:assetType/:assetId/controls'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all controls linked to an asset' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of linked controls' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No controls found for asset' }),
    __param(0, (0, common_1.Param)('assetType')),
    __param(1, (0, common_1.Param)('assetId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, control_asset_mapping_query_dto_1.ControlAssetMappingQueryDto]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "getControlsForAsset", null);
__decorate([
    (0, common_1.Post)('assets/:assetType/:assetId/controls'),
    (0, swagger_1.ApiOperation)({ summary: 'Link controls to an asset (from asset side)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Controls linked to asset successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Some controls already linked' }),
    __param(0, (0, common_1.Param)('assetType')),
    __param(1, (0, common_1.Param)('assetId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "linkControlsToAsset", null);
__decorate([
    (0, common_1.Delete)('assets/:assetType/:assetId/controls/:controlId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Unlink a control from an asset (from asset side)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Control unlinked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mapping not found' }),
    __param(0, (0, common_1.Param)('assetType')),
    __param(1, (0, common_1.Param)('assetId')),
    __param(2, (0, common_1.Param)('controlId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "unlinkControlFromAsset", null);
__decorate([
    (0, common_1.Get)(':id/risks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all risks linked to this control' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of linked risks' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "getRisks", null);
__decorate([
    (0, common_1.Get)(':id/risks/effectiveness'),
    (0, swagger_1.ApiOperation)({ summary: 'Get control effectiveness summary for linked risks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Control effectiveness data' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "getRiskEffectiveness", null);
__decorate([
    (0, common_1.Get)(':id/framework-mappings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get framework mappings for a control' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Framework mappings retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "getFrameworkMappings", null);
__decorate([
    (0, common_1.Post)(':id/framework-mappings'),
    (0, swagger_1.ApiOperation)({ summary: 'Map a control to a framework requirement' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mapping created successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "createFrameworkMapping", null);
__decorate([
    (0, common_1.Post)(':id/framework-mappings/bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk map a control to multiple framework requirements' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mappings created successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "bulkCreateFrameworkMappings", null);
__decorate([
    (0, common_1.Patch)('framework-mappings/:mappingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a framework-control mapping' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mapping updated successfully' }),
    __param(0, (0, common_1.Param)('mappingId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "updateFrameworkMapping", null);
__decorate([
    (0, common_1.Delete)('framework-mappings/:mappingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a framework-control mapping' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mapping deleted successfully' }),
    __param(0, (0, common_1.Param)('mappingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UnifiedControlsController.prototype, "deleteFrameworkMapping", null);
exports.UnifiedControlsController = UnifiedControlsController = __decorate([
    (0, swagger_1.ApiTags)('governance'),
    (0, common_1.Controller)('governance/unified-controls'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [unified_controls_service_1.UnifiedControlsService,
        control_asset_mapping_service_1.ControlAssetMappingService,
        framework_control_mapping_service_1.FrameworkControlMappingService,
        risk_control_link_service_1.RiskControlLinkService])
], UnifiedControlsController);
//# sourceMappingURL=unified-controls.controller.js.map