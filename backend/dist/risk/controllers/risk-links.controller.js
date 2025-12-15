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
exports.RiskLinksController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const risk_asset_link_service_1 = require("../services/risk-asset-link.service");
const risk_control_link_service_1 = require("../services/risk-control-link.service");
const risk_finding_link_service_1 = require("../services/risk-finding-link.service");
const create_risk_asset_link_dto_1 = require("../dto/links/create-risk-asset-link.dto");
const create_risk_control_link_dto_1 = require("../dto/links/create-risk-control-link.dto");
const create_risk_finding_link_dto_1 = require("../dto/links/create-risk-finding-link.dto");
const risk_asset_link_entity_1 = require("../entities/risk-asset-link.entity");
const swagger_1 = require("@nestjs/swagger");
let RiskLinksController = class RiskLinksController {
    constructor(assetLinkService, controlLinkService, findingLinkService) {
        this.assetLinkService = assetLinkService;
        this.controlLinkService = controlLinkService;
        this.findingLinkService = findingLinkService;
    }
    async getAssetsByRisk(riskId) {
        return this.assetLinkService.findByRiskId(riskId);
    }
    async getRisksByAsset(assetType, assetId) {
        return this.assetLinkService.getRisksForAsset(assetType, assetId);
    }
    async getAssetRiskScore(assetType, assetId) {
        return this.assetLinkService.getAssetRiskScore(assetType, assetId);
    }
    async countAssetsByRisk(riskId) {
        return this.assetLinkService.countByRisk(riskId);
    }
    async createAssetLink(createDto, req) {
        var _a;
        return this.assetLinkService.create(createDto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async bulkCreateAssetLinks(body, req) {
        var _a;
        return this.assetLinkService.bulkCreate(body.risk_id, body.assets, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async updateAssetLinkDescription(linkId, impactDescription) {
        return this.assetLinkService.updateImpactDescription(linkId, impactDescription);
    }
    async removeAssetLink(linkId) {
        await this.assetLinkService.remove(linkId);
        return { message: 'Asset link removed successfully' };
    }
    async getControlsByRisk(riskId) {
        return this.controlLinkService.findByRiskId(riskId);
    }
    async getRisksByControl(controlId) {
        return this.controlLinkService.getRisksForControl(controlId);
    }
    async getControlEffectiveness(riskId) {
        return this.controlLinkService.getControlEffectiveness(riskId);
    }
    async getRisksWithoutControls() {
        return this.controlLinkService.findRisksWithoutControls();
    }
    async createControlLink(createDto, req) {
        var _a;
        return this.controlLinkService.create(createDto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async updateControlLink(linkId, updateDto, req) {
        var _a;
        return this.controlLinkService.update(linkId, updateDto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async removeControlLink(linkId) {
        await this.controlLinkService.remove(linkId);
        return { message: 'Control link removed successfully' };
    }
    async getFindingsByRisk(riskId) {
        return this.findingLinkService.getFindingsForRisk(riskId);
    }
    async getRisksByFinding(findingId) {
        return this.findingLinkService.getRisksForFinding(findingId);
    }
    async createFindingLink(createDto, req) {
        var _a;
        return this.findingLinkService.create(createDto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async updateFindingLink(linkId, updateDto, req) {
        var _a;
        return this.findingLinkService.update(linkId, updateDto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async removeFindingLink(linkId) {
        await this.findingLinkService.remove(linkId);
        return { message: 'Finding link removed successfully' };
    }
};
exports.RiskLinksController = RiskLinksController;
__decorate([
    (0, common_1.Get)('assets/risk/:riskId'),
    __param(0, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "getAssetsByRisk", null);
__decorate([
    (0, common_1.Get)('assets/asset/:assetType/:assetId'),
    __param(0, (0, common_1.Param)('assetType')),
    __param(1, (0, common_1.Param)('assetId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "getRisksByAsset", null);
__decorate([
    (0, common_1.Get)('assets/asset/:assetType/:assetId/score'),
    __param(0, (0, common_1.Param)('assetType')),
    __param(1, (0, common_1.Param)('assetId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "getAssetRiskScore", null);
__decorate([
    (0, common_1.Get)('assets/risk/:riskId/count'),
    __param(0, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "countAssetsByRisk", null);
__decorate([
    (0, common_1.Post)('assets'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_risk_asset_link_dto_1.CreateRiskAssetLinkDto, Object]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "createAssetLink", null);
__decorate([
    (0, common_1.Post)('assets/bulk'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "bulkCreateAssetLinks", null);
__decorate([
    (0, common_1.Put)('assets/:linkId'),
    __param(0, (0, common_1.Param)('linkId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('impact_description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "updateAssetLinkDescription", null);
__decorate([
    (0, common_1.Delete)('assets/:linkId'),
    __param(0, (0, common_1.Param)('linkId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "removeAssetLink", null);
__decorate([
    (0, common_1.Get)('controls/risk/:riskId'),
    __param(0, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "getControlsByRisk", null);
__decorate([
    (0, common_1.Get)('controls/control/:controlId'),
    __param(0, (0, common_1.Param)('controlId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "getRisksByControl", null);
__decorate([
    (0, common_1.Get)('controls/risk/:riskId/effectiveness'),
    __param(0, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "getControlEffectiveness", null);
__decorate([
    (0, common_1.Get)('controls/without-controls'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "getRisksWithoutControls", null);
__decorate([
    (0, common_1.Post)('controls'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_risk_control_link_dto_1.CreateRiskControlLinkDto, Object]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "createControlLink", null);
__decorate([
    (0, common_1.Put)('controls/:linkId'),
    __param(0, (0, common_1.Param)('linkId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_risk_control_link_dto_1.UpdateRiskControlLinkDto, Object]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "updateControlLink", null);
__decorate([
    (0, common_1.Delete)('controls/:linkId'),
    __param(0, (0, common_1.Param)('linkId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "removeControlLink", null);
__decorate([
    (0, common_1.Get)('findings/risk/:riskId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all findings linked to a risk' }),
    (0, swagger_1.ApiParam)({ name: 'riskId', description: 'Risk ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of linked findings' }),
    __param(0, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "getFindingsByRisk", null);
__decorate([
    (0, common_1.Get)('findings/finding/:findingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all risks linked to a finding' }),
    (0, swagger_1.ApiParam)({ name: 'findingId', description: 'Finding ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of linked risks' }),
    __param(0, (0, common_1.Param)('findingId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "getRisksByFinding", null);
__decorate([
    (0, common_1.Post)('findings'),
    (0, swagger_1.ApiOperation)({ summary: 'Link a risk to a finding' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Risk-finding link created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Risk or finding not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Link already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_risk_finding_link_dto_1.CreateRiskFindingLinkDto, Object]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "createFindingLink", null);
__decorate([
    (0, common_1.Put)('findings/:linkId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a risk-finding link' }),
    (0, swagger_1.ApiParam)({ name: 'linkId', description: 'Link ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Link updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Link not found' }),
    __param(0, (0, common_1.Param)('linkId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_risk_finding_link_dto_1.UpdateRiskFindingLinkDto, Object]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "updateFindingLink", null);
__decorate([
    (0, common_1.Delete)('findings/:linkId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a risk-finding link' }),
    (0, swagger_1.ApiParam)({ name: 'linkId', description: 'Link ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Link removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Link not found' }),
    __param(0, (0, common_1.Param)('linkId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskLinksController.prototype, "removeFindingLink", null);
exports.RiskLinksController = RiskLinksController = __decorate([
    (0, swagger_1.ApiTags)('risks'),
    (0, common_1.Controller)('risk-links'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [risk_asset_link_service_1.RiskAssetLinkService,
        risk_control_link_service_1.RiskControlLinkService,
        risk_finding_link_service_1.RiskFindingLinkService])
], RiskLinksController);
//# sourceMappingURL=risk-links.controller.js.map