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
exports.RiskController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const risk_service_1 = require("../services/risk.service");
const create_risk_dto_1 = require("../dto/create-risk.dto");
const update_risk_dto_1 = require("../dto/update-risk.dto");
const risk_query_dto_1 = require("../dto/risk-query.dto");
const bulk_update_risk_dto_1 = require("../dto/bulk-update-risk.dto");
let RiskController = class RiskController {
    constructor(riskService) {
        this.riskService = riskService;
    }
    async findAll(query) {
        return this.riskService.findAll(query);
    }
    async getHeatmap() {
        return this.riskService.getHeatmapData();
    }
    async getDashboardSummary(req) {
        var _a;
        return this.riskService.getDashboardSummary((_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
    }
    async getTopRisks(limit) {
        return this.riskService.getTopRisks(limit || 10);
    }
    async getRisksNeedingReview(days) {
        return this.riskService.getRisksNeedingReview(days || 7);
    }
    async getRisksExceedingAppetite(req) {
        var _a;
        return this.riskService.getRisksExceedingAppetite((_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
    }
    async checkRiskAppetite(score, req) {
        var _a;
        return this.riskService.checkRiskAppetite(Number(score), (_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
    }
    async findOne(id, req) {
        var _a;
        return this.riskService.findOne(id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId);
    }
    async create(createRiskDto, req) {
        var _a, _b, _c;
        return this.riskService.create(createRiskDto, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id), (_c = req.user) === null || _c === void 0 ? void 0 : _c.organizationId);
    }
    async update(id, updateRiskDto, req) {
        var _a;
        return this.riskService.update(id, updateRiskDto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async bulkUpdateStatus(bulkUpdateDto) {
        return this.riskService.bulkUpdateStatus(bulkUpdateDto.ids, bulkUpdateDto.status);
    }
    async remove(id) {
        await this.riskService.remove(id);
        return { message: 'Risk deleted successfully' };
    }
};
exports.RiskController = RiskController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all risks with filtering and pagination' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_query_dto_1.RiskQueryDto]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('heatmap'),
    (0, swagger_1.ApiOperation)({ summary: 'Get risk heatmap data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "getHeatmap", null);
__decorate([
    (0, common_1.Get)('dashboard/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get risk dashboard summary including appetite analysis' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "getDashboardSummary", null);
__decorate([
    (0, common_1.Get)('dashboard/top'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top risks by score' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "getTopRisks", null);
__decorate([
    (0, common_1.Get)('dashboard/review-due'),
    (0, swagger_1.ApiOperation)({ summary: 'Get risks due for review' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "getRisksNeedingReview", null);
__decorate([
    (0, common_1.Get)('exceeding-appetite'),
    (0, swagger_1.ApiOperation)({ summary: 'Get risks exceeding the organization risk appetite threshold' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of risks exceeding risk appetite' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "getRisksExceedingAppetite", null);
__decorate([
    (0, common_1.Get)('check-appetite/:score'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if a risk score exceeds the organization risk appetite' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Risk appetite check result' }),
    __param(0, (0, common_1.Param)('score')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "checkRiskAppetite", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single risk by ID with appetite warnings' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_risk_dto_1.CreateRiskDto, Object]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_risk_dto_1.UpdateRiskDto, Object]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('bulk-update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_update_risk_dto_1.BulkUpdateRiskDto]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "bulkUpdateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "remove", null);
exports.RiskController = RiskController = __decorate([
    (0, swagger_1.ApiTags)('Risks'),
    (0, common_1.Controller)('risks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [risk_service_1.RiskService])
], RiskController);
//# sourceMappingURL=risk.controller.js.map