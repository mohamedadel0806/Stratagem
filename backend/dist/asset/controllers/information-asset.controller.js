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
exports.InformationAssetController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const swagger_1 = require("@nestjs/swagger");
const information_asset_service_1 = require("../services/information-asset.service");
const import_service_1 = require("../services/import.service");
const create_information_asset_dto_1 = require("../dto/create-information-asset.dto");
const update_information_asset_dto_1 = require("../dto/update-information-asset.dto");
const information_asset_response_dto_1 = require("../dto/information-asset-response.dto");
const information_asset_query_dto_1 = require("../dto/information-asset-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
const risk_asset_link_service_1 = require("../../risk/services/risk-asset-link.service");
const risk_asset_link_entity_1 = require("../../risk/entities/risk-asset-link.entity");
let InformationAssetController = class InformationAssetController {
    constructor(assetService, importService, riskAssetLinkService) {
        this.assetService = assetService;
        this.importService = importService;
        this.riskAssetLinkService = riskAssetLinkService;
    }
    async create(createDto, user) {
        return this.assetService.create(createDto, user.id);
    }
    async findAll(query) {
        return this.assetService.findAll(query);
    }
    async findOne(id) {
        return this.assetService.findOne(id);
    }
    async update(id, updateDto, user) {
        return this.assetService.update(id, updateDto, user.id);
    }
    async remove(id, user) {
        await this.assetService.remove(id, user.id);
        return { message: 'Asset deleted successfully' };
    }
    async previewImport(file, body) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('File is required. Please ensure the file is uploaded with the field name "file".');
            }
            if (!file.buffer) {
                throw new common_1.BadRequestException('File buffer is required. Please ensure file is uploaded correctly.');
            }
            const fileType = body === null || body === void 0 ? void 0 : body.fileType;
            const detectedFileType = fileType || (file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls') ? 'excel' : 'csv');
            try {
                if (detectedFileType === 'excel') {
                    return await this.importService.previewExcel(file.buffer);
                }
                else {
                    return await this.importService.previewCSV(file.buffer);
                }
            }
            catch (parseError) {
                console.error('[Information Asset Import Preview] Parse error:', parseError);
                throw new common_1.BadRequestException(`Failed to parse ${detectedFileType} file: ${parseError.message || 'Unknown error'}`);
            }
        }
        catch (error) {
            console.error('[Information Asset Import Preview] Error:', error);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Import preview failed: ${error.message || 'Unknown error'}`);
        }
    }
    async importAssets(file, user, body) {
        if (!file) {
            throw new common_1.BadRequestException('File is required. Please ensure the file is uploaded with the field name "file".');
        }
        if (!file.buffer) {
            throw new common_1.BadRequestException('File buffer is required. Please ensure file is uploaded correctly.');
        }
        if (!user || !user.userId) {
            throw new common_1.BadRequestException('User authentication required');
        }
        const fileType = body === null || body === void 0 ? void 0 : body.fileType;
        const fieldMappingStr = body === null || body === void 0 ? void 0 : body.fieldMapping;
        const detectedFileType = fileType || (file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls') ? 'excel' : 'csv');
        let fieldMapping = {};
        try {
            fieldMapping = fieldMappingStr ? (typeof fieldMappingStr === 'string' ? JSON.parse(fieldMappingStr) : fieldMappingStr) : {};
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid fieldMapping JSON format');
        }
        return this.importService.importAssets(file.buffer, detectedFileType, 'information', fieldMapping, user.userId, file.originalname);
    }
    async getImportHistory() {
        return this.importService.getImportHistory('information');
    }
    async getImportLog(id) {
        return this.importService.getImportLog(id);
    }
    async getRisks(id) {
        return this.riskAssetLinkService.getRisksForAsset(risk_asset_link_entity_1.RiskAssetType.INFORMATION, id);
    }
    async getRiskScore(id) {
        return this.riskAssetLinkService.getAssetRiskScore(risk_asset_link_entity_1.RiskAssetType.INFORMATION, id);
    }
};
exports.InformationAssetController = InformationAssetController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new information asset' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Asset created successfully', type: information_asset_response_dto_1.InformationAssetResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_information_asset_dto_1.CreateInformationAssetDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], InformationAssetController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all information assets with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of information assets' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [information_asset_query_dto_1.InformationAssetQueryDto]),
    __metadata("design:returntype", Promise)
], InformationAssetController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get information asset by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset details', type: information_asset_response_dto_1.InformationAssetResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InformationAssetController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an information asset' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset updated successfully', type: information_asset_response_dto_1.InformationAssetResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_information_asset_dto_1.UpdateInformationAssetDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], InformationAssetController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an information asset (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Asset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], InformationAssetController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('import/preview'),
    (0, swagger_1.ApiOperation)({ summary: 'Preview import file (CSV/Excel)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File preview with first 10 rows' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InformationAssetController.prototype, "previewImport", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, swagger_1.ApiOperation)({ summary: 'Import information assets from CSV/Excel file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Import completed' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], InformationAssetController.prototype, "importAssets", null);
__decorate([
    (0, common_1.Get)('import/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get import history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of import logs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InformationAssetController.prototype, "getImportHistory", null);
__decorate([
    (0, common_1.Get)('import/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get import log by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Import log ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Import log details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InformationAssetController.prototype, "getImportLog", null);
__decorate([
    (0, common_1.Get)(':id/risks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all risks linked to this information asset' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Information asset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of linked risks' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InformationAssetController.prototype, "getRisks", null);
__decorate([
    (0, common_1.Get)(':id/risks/score'),
    (0, swagger_1.ApiOperation)({ summary: 'Get aggregate risk score for this information asset' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Information asset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset risk score summary' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InformationAssetController.prototype, "getRiskScore", null);
exports.InformationAssetController = InformationAssetController = __decorate([
    (0, swagger_1.ApiTags)('assets'),
    (0, common_1.Controller)('assets/information'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [information_asset_service_1.InformationAssetService,
        import_service_1.ImportService,
        risk_asset_link_service_1.RiskAssetLinkService])
], InformationAssetController);
//# sourceMappingURL=information-asset.controller.js.map