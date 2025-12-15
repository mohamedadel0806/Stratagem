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
exports.ImportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const import_log_entity_1 = require("../entities/import-log.entity");
const physical_asset_entity_1 = require("../entities/physical-asset.entity");
const physical_asset_service_1 = require("./physical-asset.service");
const physical_asset_import_handler_1 = require("./import-handlers/physical-asset-import-handler");
const information_asset_import_handler_1 = require("./import-handlers/information-asset-import-handler");
const software_asset_import_handler_1 = require("./import-handlers/software-asset-import-handler");
const business_application_import_handler_1 = require("./import-handlers/business-application-import-handler");
const supplier_import_handler_1 = require("./import-handlers/supplier-import-handler");
const { parse } = require('csv-parse/sync');
const XLSX = require('xlsx');
let ImportService = class ImportService {
    constructor(importLogRepository, assetRepository, physicalAssetService, physicalAssetImportHandler, informationAssetImportHandler, softwareAssetImportHandler, businessApplicationImportHandler, supplierImportHandler) {
        this.importLogRepository = importLogRepository;
        this.assetRepository = assetRepository;
        this.physicalAssetService = physicalAssetService;
        this.physicalAssetImportHandler = physicalAssetImportHandler;
        this.informationAssetImportHandler = informationAssetImportHandler;
        this.softwareAssetImportHandler = softwareAssetImportHandler;
        this.businessApplicationImportHandler = businessApplicationImportHandler;
        this.supplierImportHandler = supplierImportHandler;
        this.handlers = new Map();
        this.handlers.set('physical', this.physicalAssetImportHandler);
        this.handlers.set('information', this.informationAssetImportHandler);
        this.handlers.set('software', this.softwareAssetImportHandler);
        this.handlers.set('application', this.businessApplicationImportHandler);
        this.handlers.set('supplier', this.supplierImportHandler);
    }
    getHandler(assetType) {
        const handler = this.handlers.get(assetType);
        if (!handler) {
            throw new common_1.BadRequestException(`Unsupported asset type: ${assetType}`);
        }
        return handler;
    }
    async previewCSV(fileBuffer, limit = 10) {
        try {
            if (!fileBuffer) {
                throw new common_1.BadRequestException('File buffer is required');
            }
            if (!Buffer.isBuffer(fileBuffer)) {
                throw new common_1.BadRequestException('Invalid file buffer type');
            }
            const content = fileBuffer.toString('utf-8');
            if (!content || content.trim().length === 0) {
                throw new common_1.BadRequestException('CSV file is empty');
            }
            let records;
            try {
                records = parse(content, {
                    columns: true,
                    skip_empty_lines: true,
                    trim: true,
                    relax_column_count: true,
                });
            }
            catch (parseError) {
                throw new common_1.BadRequestException(`CSV parsing failed: ${parseError.message || 'Invalid CSV format'}`);
            }
            if (!records || records.length === 0) {
                throw new common_1.BadRequestException('No data rows found in CSV file');
            }
            const headers = records.length > 0 ? Object.keys(records[0]) : [];
            const previewRows = records.slice(0, limit).map((record, index) => ({
                rowNumber: index + 2,
                data: record,
            }));
            return {
                headers,
                rows: previewRows,
                totalRows: records.length,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error occurred';
            throw new common_1.BadRequestException(`Failed to parse CSV: ${errorMessage}`);
        }
    }
    async previewExcel(fileBuffer, limit = 10) {
        try {
            if (!fileBuffer) {
                throw new common_1.BadRequestException('File buffer is required');
            }
            if (!Buffer.isBuffer(fileBuffer)) {
                throw new common_1.BadRequestException('Invalid file buffer type');
            }
            let workbook;
            try {
                workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            }
            catch (readError) {
                throw new common_1.BadRequestException(`Failed to read Excel file: ${readError.message || 'Invalid Excel format'}`);
            }
            if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
                throw new common_1.BadRequestException('Excel file has no sheets');
            }
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            if (!worksheet) {
                throw new common_1.BadRequestException(`Sheet "${firstSheetName}" not found in Excel file`);
            }
            let data;
            try {
                data = XLSX.utils.sheet_to_json(worksheet, { defval: null });
            }
            catch (jsonError) {
                throw new common_1.BadRequestException(`Failed to parse Excel sheet: ${jsonError.message || 'Invalid sheet data'}`);
            }
            if (data.length === 0) {
                return {
                    headers: [],
                    rows: [],
                    totalRows: 0,
                };
            }
            const headers = Object.keys(data[0]);
            const previewRows = data.slice(0, limit).map((record, index) => ({
                rowNumber: index + 2,
                data: record,
            }));
            return {
                headers,
                rows: previewRows,
                totalRows: data.length,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to parse Excel: ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}`);
        }
    }
    async importAssets(fileBuffer, fileType, assetType, fieldMapping, userId, fileName) {
        const handler = this.getHandler(assetType);
        const fieldMappingJson = JSON.stringify(fieldMapping);
        const result = await this.importLogRepository.query(`INSERT INTO import_logs ("fileName", "fileType", "assetType", "status", "fieldMapping", "importedById", "createdAt")
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, NOW())
       RETURNING id, status, "totalRecords", "successfulImports", "failedImports", "createdAt"`, [fileName, fileType, assetType, import_log_entity_1.ImportStatus.PROCESSING, fieldMappingJson, userId]);
        const savedLog = await this.importLogRepository.findOne({
            where: { id: result[0].id },
        });
        if (!savedLog) {
            throw new common_1.BadRequestException('Failed to create import log');
        }
        try {
            let records;
            if (fileType === import_log_entity_1.ImportFileType.CSV) {
                const content = fileBuffer.toString('utf-8');
                records = parse(content, {
                    columns: true,
                    skip_empty_lines: true,
                    trim: true,
                    relax_column_count: true,
                });
            }
            else {
                const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                records = XLSX.utils.sheet_to_json(worksheet, { defval: null });
            }
            const errors = [];
            let successfulImports = 0;
            let failedImports = 0;
            for (let i = 0; i < records.length; i++) {
                const row = records[i];
                const rowNumber = i + 2;
                try {
                    const assetData = handler.mapFields(row, fieldMapping);
                    const validationErrors = handler.validate(assetData);
                    if (validationErrors.length > 0) {
                        errors.push({ row: rowNumber, errors: validationErrors });
                        failedImports++;
                        continue;
                    }
                    await handler.createAsset(assetData, userId);
                    successfulImports++;
                }
                catch (error) {
                    errors.push({
                        row: rowNumber,
                        errors: [error.message || 'Unknown error'],
                    });
                    failedImports++;
                }
            }
            savedLog.status =
                failedImports === 0
                    ? import_log_entity_1.ImportStatus.COMPLETED
                    : successfulImports > 0
                        ? import_log_entity_1.ImportStatus.PARTIAL
                        : import_log_entity_1.ImportStatus.FAILED;
            savedLog.totalRecords = records.length;
            savedLog.successfulImports = successfulImports;
            savedLog.failedImports = failedImports;
            savedLog.errorReport = JSON.stringify(errors);
            savedLog.completedAt = new Date();
            await this.importLogRepository.save(savedLog);
            return {
                importLogId: savedLog.id,
                totalRecords: records.length,
                successfulImports,
                failedImports,
                errors,
            };
        }
        catch (error) {
            savedLog.status = import_log_entity_1.ImportStatus.FAILED;
            savedLog.errorReport = JSON.stringify([{ message: error.message }]);
            savedLog.completedAt = new Date();
            await this.importLogRepository.save(savedLog);
            throw error;
        }
    }
    async importPhysicalAssets(fileBuffer, fileType, fieldMapping, userId, fileName) {
        return this.importAssets(fileBuffer, fileType, 'physical', fieldMapping, userId, fileName);
    }
    async getImportHistory(assetType, limit = 20) {
        const query = this.importLogRepository
            .createQueryBuilder('log')
            .leftJoinAndSelect('log.importedBy', 'user')
            .orderBy('log.createdAt', 'DESC')
            .take(limit);
        if (assetType) {
            query.where('log.assetType = :assetType', { assetType });
        }
        return query.getMany();
    }
    async getImportLog(id) {
        const log = await this.importLogRepository.findOne({
            where: { id },
            relations: ['importedBy'],
        });
        if (!log) {
            throw new common_1.BadRequestException(`Import log with ID ${id} not found`);
        }
        return log;
    }
};
exports.ImportService = ImportService;
exports.ImportService = ImportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(import_log_entity_1.ImportLog)),
    __param(1, (0, typeorm_1.InjectRepository)(physical_asset_entity_1.PhysicalAsset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        physical_asset_service_1.PhysicalAssetService,
        physical_asset_import_handler_1.PhysicalAssetImportHandler,
        information_asset_import_handler_1.InformationAssetImportHandler,
        software_asset_import_handler_1.SoftwareAssetImportHandler,
        business_application_import_handler_1.BusinessApplicationImportHandler,
        supplier_import_handler_1.SupplierImportHandler])
], ImportService);
//# sourceMappingURL=import.service.js.map