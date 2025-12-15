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
exports.AssetAuditController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const asset_audit_service_1 = require("../services/asset-audit.service");
const asset_audit_log_response_dto_1 = require("../dto/asset-audit-log-response.dto");
const asset_audit_log_entity_1 = require("../entities/asset-audit-log.entity");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let AssetAuditController = class AssetAuditController {
    constructor(auditService) {
        this.auditService = auditService;
    }
    async getAuditTrail(type, id, query) {
        const assetType = this.validateAssetType(type);
        const result = await this.auditService.getAuditLogs(assetType, id, query);
        return {
            data: result.data.map((log) => ({
                id: log.id,
                assetType: log.assetType,
                assetId: log.assetId,
                action: log.action,
                fieldName: log.fieldName,
                oldValue: log.oldValue,
                newValue: log.newValue,
                changedBy: log.changedBy
                    ? {
                        id: log.changedBy.id,
                        email: log.changedBy.email,
                        firstName: log.changedBy.firstName,
                        lastName: log.changedBy.lastName,
                    }
                    : undefined,
                changeReason: log.changeReason,
                createdAt: log.createdAt instanceof Date
                    ? log.createdAt.toISOString()
                    : new Date(log.createdAt).toISOString(),
            })),
            total: result.total,
            page: result.page,
            limit: result.limit,
        };
    }
    validateAssetType(type) {
        const validTypes = {
            physical: asset_audit_log_entity_1.AssetType.PHYSICAL,
            information: asset_audit_log_entity_1.AssetType.INFORMATION,
            application: asset_audit_log_entity_1.AssetType.APPLICATION,
            software: asset_audit_log_entity_1.AssetType.SOFTWARE,
            supplier: asset_audit_log_entity_1.AssetType.SUPPLIER,
        };
        const assetType = validTypes[type.toLowerCase()];
        if (!assetType) {
            throw new common_1.BadRequestException(`Invalid asset type: ${type}. Valid types are: ${Object.keys(validTypes).join(', ')}`);
        }
        return assetType;
    }
};
exports.AssetAuditController = AssetAuditController;
__decorate([
    (0, common_1.Get)(':type/:id/audit'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit trail for an asset' }),
    (0, swagger_1.ApiParam)({ name: 'type', description: 'Asset type', enum: asset_audit_log_entity_1.AssetType }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Audit trail retrieved successfully',
        type: [asset_audit_log_response_dto_1.AssetAuditLogResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request parameters' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found' }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, asset_audit_log_response_dto_1.AssetAuditLogQueryDto]),
    __metadata("design:returntype", Promise)
], AssetAuditController.prototype, "getAuditTrail", null);
exports.AssetAuditController = AssetAuditController = __decorate([
    (0, swagger_1.ApiTags)('assets'),
    (0, common_1.Controller)('assets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [asset_audit_service_1.AssetAuditService])
], AssetAuditController);
//# sourceMappingURL=asset-audit.controller.js.map