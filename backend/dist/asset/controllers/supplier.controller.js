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
exports.SupplierController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const swagger_1 = require("@nestjs/swagger");
const supplier_service_1 = require("../services/supplier.service");
const import_service_1 = require("../services/import.service");
const create_supplier_dto_1 = require("../dto/create-supplier.dto");
const update_supplier_dto_1 = require("../dto/update-supplier.dto");
const supplier_response_dto_1 = require("../dto/supplier-response.dto");
const supplier_query_dto_1 = require("../dto/supplier-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
const risk_asset_link_service_1 = require("../../risk/services/risk-asset-link.service");
const risk_asset_link_entity_1 = require("../../risk/entities/risk-asset-link.entity");
let SupplierController = class SupplierController {
    constructor(supplierService, importService, riskAssetLinkService) {
        this.supplierService = supplierService;
        this.importService = importService;
        this.riskAssetLinkService = riskAssetLinkService;
    }
    async create(createDto, user) {
        return this.supplierService.create(createDto, user.id);
    }
    async findAll(query) {
        return this.supplierService.findAll(query);
    }
    async findOne(id) {
        return this.supplierService.findOne(id);
    }
    async update(id, updateDto, user) {
        return this.supplierService.update(id, updateDto, user.id);
    }
    async remove(id, user) {
        await this.supplierService.remove(id, user.id);
        return { message: 'Supplier deleted successfully' };
    }
    async previewImport(file, body) {
        if (!file) {
            throw new common_1.BadRequestException('File is required. Please ensure the file is uploaded with the field name "file".');
        }
        if (!file.buffer) {
            throw new common_1.BadRequestException('File buffer is required. Please ensure file is uploaded correctly.');
        }
        const fileType = body === null || body === void 0 ? void 0 : body.fileType;
        const sheetName = body === null || body === void 0 ? void 0 : body.sheetName;
        const detectedFileType = fileType || (file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls') ? 'excel' : 'csv');
        try {
            if (detectedFileType === 'excel') {
                return this.importService.previewExcel(file.buffer, 10, sheetName);
            }
            else {
                return this.importService.previewCSV(file.buffer);
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to parse file: ${error.message}`);
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
        return this.importService.importAssets(file.buffer, detectedFileType, 'supplier', fieldMapping, user.userId, file.originalname);
    }
    async getImportHistory() {
        return this.importService.getImportHistory('supplier');
    }
    async getImportLog(id) {
        return this.importService.getImportLog(id);
    }
    async getRisks(id) {
        return this.riskAssetLinkService.getRisksForAsset(risk_asset_link_entity_1.RiskAssetType.SUPPLIER, id);
    }
    async getRiskScore(id) {
        return this.riskAssetLinkService.getAssetRiskScore(risk_asset_link_entity_1.RiskAssetType.SUPPLIER, id);
    }
    async getExpiringContracts(days) {
        const daysNumber = days ? parseInt(days, 10) || 90 : 90;
        const suppliers = await this.supplierService.getExpiringContracts(daysNumber);
        return {
            data: suppliers,
            total: suppliers.length,
            days: daysNumber,
        };
    }
    async getCriticalSuppliersReport() {
        const suppliers = await this.supplierService.getCriticalSuppliersReport();
        return {
            data: suppliers,
            total: suppliers.length,
        };
    }
};
exports.SupplierController = SupplierController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new supplier' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Supplier created successfully', type: supplier_response_dto_1.SupplierResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_supplier_dto_1.CreateSupplierDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all suppliers with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of suppliers' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supplier_query_dto_1.SupplierQueryDto]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get supplier by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Supplier details', type: supplier_response_dto_1.SupplierResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a supplier' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Supplier updated successfully', type: supplier_response_dto_1.SupplierResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_supplier_dto_1.UpdateSupplierDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a supplier (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Supplier deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "remove", null);
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
], SupplierController.prototype, "previewImport", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, swagger_1.ApiOperation)({ summary: 'Import suppliers from CSV/Excel file' }),
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
], SupplierController.prototype, "importAssets", null);
__decorate([
    (0, common_1.Get)('import/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get import history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of import logs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "getImportHistory", null);
__decorate([
    (0, common_1.Get)('import/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get import log by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Import log ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Import log details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "getImportLog", null);
__decorate([
    (0, common_1.Get)(':id/risks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all risks linked to this supplier' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of linked risks' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "getRisks", null);
__decorate([
    (0, common_1.Get)(':id/risks/score'),
    (0, swagger_1.ApiOperation)({ summary: 'Get aggregate risk score for this supplier' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset risk score summary' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "getRiskScore", null);
__decorate([
    (0, common_1.Get)('contracts/expiring'),
    (0, swagger_1.ApiOperation)({ summary: 'Get suppliers with contracts expiring within specified days' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of suppliers with expiring contracts' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "getExpiringContracts", null);
__decorate([
    (0, common_1.Get)('critical/report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get report of critical suppliers for executive review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of critical and high criticality suppliers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "getCriticalSuppliersReport", null);
exports.SupplierController = SupplierController = __decorate([
    (0, swagger_1.ApiTags)('assets'),
    (0, common_1.Controller)('assets/suppliers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [supplier_service_1.SupplierService,
        import_service_1.ImportService,
        risk_asset_link_service_1.RiskAssetLinkService])
], SupplierController);
//# sourceMappingURL=supplier.controller.js.map