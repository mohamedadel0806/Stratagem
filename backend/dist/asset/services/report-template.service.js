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
var ReportTemplateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportTemplateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_template_entity_1 = require("../entities/report-template.entity");
const report_template_version_entity_1 = require("../entities/report-template-version.entity");
const common_2 = require("@nestjs/common");
const business_application_service_1 = require("./business-application.service");
const software_asset_service_1 = require("./software-asset.service");
const information_asset_service_1 = require("./information-asset.service");
const supplier_service_1 = require("./supplier.service");
const physical_asset_service_1 = require("./physical-asset.service");
const email_distribution_list_service_1 = require("./email-distribution-list.service");
const XLSX = require('xlsx');
function getStringify() {
    try {
        const csvStringifySync = require('csv-stringify/sync');
        return csvStringifySync.stringify || csvStringifySync;
    }
    catch (error) {
        console.error('Failed to load csv-stringify/sync:', error);
        throw new Error('CSV export functionality is not available');
    }
}
let ReportTemplateService = ReportTemplateService_1 = class ReportTemplateService {
    constructor(templateRepository, versionRepository, businessApplicationService, softwareAssetService, informationAssetService, supplierService, physicalAssetService, emailDistributionListService) {
        this.templateRepository = templateRepository;
        this.versionRepository = versionRepository;
        this.businessApplicationService = businessApplicationService;
        this.softwareAssetService = softwareAssetService;
        this.informationAssetService = informationAssetService;
        this.supplierService = supplierService;
        this.physicalAssetService = physicalAssetService;
        this.emailDistributionListService = emailDistributionListService;
        this.logger = new common_1.Logger(ReportTemplateService_1.name);
    }
    async create(dto, userId) {
        const template = this.templateRepository.create(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, dto), { createdById: userId, isActive: dto.isScheduled !== false, fieldSelection: dto.fieldSelection || [], version: 1 }), (dto.isShared !== undefined && { isShared: dto.isShared })), (dto.sharedWithUserIds !== undefined && { sharedWithUserIds: dto.sharedWithUserIds })), (dto.sharedWithTeamIds !== undefined && { sharedWithTeamIds: dto.sharedWithTeamIds })), (dto.isOrganizationWide !== undefined && { isOrganizationWide: dto.isOrganizationWide })));
        if (dto.isScheduled) {
            template.nextRunAt = this.calculateNextRun(dto.scheduleFrequency, dto.scheduleTime, dto.scheduleCron);
        }
        const saved = await this.templateRepository.save(template);
        try {
            await this.saveVersion(saved, userId, 'Initial version');
        }
        catch (error) {
            this.logger.warn(`Versioning not available: ${error.message}`);
        }
        return saved;
    }
    async findAll(userId) {
        try {
            const templates = await this.templateRepository
                .createQueryBuilder('template')
                .select([
                'template.id',
                'template.name',
                'template.description',
                'template.reportType',
                'template.format',
                'template.fieldSelection',
                'template.filters',
                'template.grouping',
                'template.isScheduled',
                'template.scheduleFrequency',
                'template.scheduleCron',
                'template.scheduleTime',
                'template.distributionListId',
                'template.isActive',
                'template.isSystemTemplate',
                'template.lastRunAt',
                'template.nextRunAt',
                'template.createdById',
                'template.createdAt',
                'template.updatedAt',
            ])
                .orderBy('template.createdAt', 'DESC')
                .getMany();
            let filteredTemplates = templates;
            if (userId) {
                filteredTemplates = templates.filter(template => {
                    if (template.createdById === userId)
                        return true;
                    if (template.isSystemTemplate)
                        return true;
                    if (template.isOrganizationWide === true)
                        return true;
                    if (template.isShared === true) {
                        const sharedWithUserIds = template.sharedWithUserIds;
                        if (sharedWithUserIds && Array.isArray(sharedWithUserIds) && sharedWithUserIds.includes(userId))
                            return true;
                    }
                    return false;
                });
            }
            return filteredTemplates.map(template => (Object.assign(Object.assign({}, template), { fieldSelection: template.fieldSelection || [] })));
        }
        catch (error) {
            this.logger.error(`Error fetching report templates: ${error === null || error === void 0 ? void 0 : error.message}`, error === null || error === void 0 ? void 0 : error.stack);
            throw new common_1.BadRequestException(`Failed to fetch report templates: ${error === null || error === void 0 ? void 0 : error.message}`);
        }
    }
    async findOne(id) {
        const template = await this.templateRepository.findOne({
            where: { id },
        });
        if (!template) {
            throw new common_1.NotFoundException(`Report template with ID ${id} not found`);
        }
        return template;
    }
    async update(id, dto, userId, versionComment) {
        const template = await this.findOne(id);
        try {
            await this.saveVersion(template, userId, versionComment);
            if (template.version !== undefined) {
                template.version = (template.version || 1) + 1;
            }
        }
        catch (error) {
            this.logger.warn(`Versioning not available: ${error.message}`);
        }
        Object.assign(template, dto);
        if (dto.isScheduled !== undefined) {
            if (dto.isScheduled) {
                template.nextRunAt = this.calculateNextRun(dto.scheduleFrequency || template.scheduleFrequency, dto.scheduleTime || template.scheduleTime, dto.scheduleCron || template.scheduleCron);
            }
            else {
                template.nextRunAt = null;
            }
        }
        return this.templateRepository.save(template);
    }
    async saveVersion(template, userId, comment) {
        try {
            const version = this.versionRepository.create({
                templateId: template.id,
                versionNumber: template.version || 1,
                name: template.name,
                description: template.description,
                reportType: template.reportType,
                format: template.format,
                fieldSelection: template.fieldSelection || [],
                filters: template.filters || {},
                grouping: template.grouping || {},
                isScheduled: template.isScheduled,
                scheduleFrequency: template.scheduleFrequency,
                scheduleCron: template.scheduleCron,
                scheduleTime: template.scheduleTime,
                distributionListId: template.distributionListId,
                isActive: template.isActive,
                versionComment: comment,
                createdById: userId,
            });
            await this.versionRepository.save(version);
        }
        catch (error) {
            this.logger.error(`Failed to save template version: ${error.message}`, error.stack);
        }
    }
    async getVersionHistory(templateId) {
        const template = await this.findOne(templateId);
        const versions = await this.versionRepository.find({
            where: { templateId: template.id },
            order: { versionNumber: 'DESC' },
            relations: ['createdBy'],
        });
        return versions;
    }
    async restoreVersion(templateId, versionId, userId) {
        const template = await this.findOne(templateId);
        const version = await this.versionRepository.findOne({
            where: { id: versionId, templateId: template.id },
        });
        if (!version) {
            throw new common_1.NotFoundException(`Version ${versionId} not found for template ${templateId}`);
        }
        await this.saveVersion(template, userId, `Restored from version ${version.versionNumber}`);
        template.name = version.name;
        template.description = version.description;
        template.reportType = version.reportType;
        template.format = version.format;
        template.fieldSelection = version.fieldSelection || [];
        template.filters = version.filters || {};
        template.grouping = version.grouping || {};
        template.isScheduled = version.isScheduled;
        template.scheduleFrequency = version.scheduleFrequency;
        template.scheduleCron = version.scheduleCron;
        template.scheduleTime = version.scheduleTime;
        template.distributionListId = version.distributionListId;
        template.isActive = version.isActive;
        if (template.version !== undefined) {
            template.version = (template.version || 1) + 1;
        }
        if (template.isScheduled) {
            template.nextRunAt = this.calculateNextRun(template.scheduleFrequency, template.scheduleTime, template.scheduleCron);
        }
        return this.templateRepository.save(template);
    }
    async delete(id) {
        const template = await this.findOne(id);
        if (template.isSystemTemplate) {
            throw new common_1.BadRequestException('Cannot delete system templates. Create a copy to customize.');
        }
        await this.templateRepository.remove(template);
    }
    async previewReport(templateId) {
        try {
            const template = await this.findOne(templateId);
            this.logger.log(`Previewing report for template: ${template.name} (ID: ${templateId})`);
            let data = [];
            try {
                this.logger.log(`Fetching data for report type: ${template.reportType}`);
                switch (template.reportType) {
                    case report_template_entity_1.ReportType.ASSET_INVENTORY:
                        this.logger.log('Calling generateAssetInventoryReport...');
                        data = await this.generateAssetInventoryReport(template);
                        this.logger.log(`Asset inventory report returned ${data.length} records`);
                        break;
                    case report_template_entity_1.ReportType.COMPLIANCE_REPORT:
                        this.logger.log('Calling generateComplianceReport...');
                        data = await this.generateComplianceReport(template);
                        break;
                    case report_template_entity_1.ReportType.SECURITY_TEST_REPORT:
                        this.logger.log('Calling generateSecurityTestReport...');
                        data = await this.generateSecurityTestReport(template);
                        break;
                    case report_template_entity_1.ReportType.SOFTWARE_INVENTORY:
                        this.logger.log('Calling generateSoftwareInventoryReport...');
                        data = await this.generateSoftwareInventoryReport(template);
                        break;
                    case report_template_entity_1.ReportType.CONTRACT_EXPIRATION:
                        this.logger.log('Calling generateContractExpirationReport...');
                        data = await this.generateContractExpirationReport(template);
                        break;
                    case report_template_entity_1.ReportType.SUPPLIER_CRITICALITY:
                        this.logger.log('Calling generateSupplierCriticalityReport...');
                        data = await this.generateSupplierCriticalityReport(template);
                        break;
                    default:
                        throw new common_1.BadRequestException(`Unsupported report type: ${template.reportType}`);
                }
                this.logger.log(`Fetched ${data.length} records for preview`);
            }
            catch (dataError) {
                this.logger.error(`Error fetching data for report type ${template.reportType}: ${dataError.message}`, dataError.stack);
                throw new common_1.BadRequestException(`Failed to fetch report data: ${dataError.message}`);
            }
            if (!Array.isArray(data)) {
                this.logger.error(`Data is not an array, got: ${typeof data}`);
                throw new common_1.BadRequestException('Report data must be an array');
            }
            const getUserDisplayName = (user) => {
                if (!user)
                    return '';
                if (user.firstName && user.lastName) {
                    return `${user.firstName} ${user.lastName}`;
                }
                return user.email || '';
            };
            data = data.map(item => {
                const transformed = Object.assign({}, item);
                if (item.ownerId !== undefined) {
                    if (item.owner) {
                        transformed.ownerId = getUserDisplayName(item.owner);
                    }
                    else if (item.ownerId) {
                        transformed.ownerId = item.ownerId;
                    }
                }
                if (item.informationOwnerId !== undefined) {
                    if (item.informationOwner) {
                        transformed.informationOwnerId = getUserDisplayName(item.informationOwner);
                    }
                    else if (item.informationOwnerId) {
                        transformed.informationOwnerId = item.informationOwnerId;
                    }
                }
                if (item.assetCustodianId !== undefined) {
                    if (item.assetCustodian) {
                        transformed.assetCustodianId = getUserDisplayName(item.assetCustodian);
                    }
                    else if (item.assetCustodianId) {
                        transformed.assetCustodianId = item.assetCustodianId;
                    }
                }
                if (item.businessUnitId !== undefined) {
                    if (item.businessUnit) {
                        transformed.businessUnitId = item.businessUnit.name || '';
                    }
                    else if (item.businessUnitId) {
                        transformed.businessUnitId = item.businessUnitId;
                    }
                }
                delete transformed.owner;
                delete transformed.informationOwner;
                delete transformed.assetCustodian;
                delete transformed.businessUnit;
                return transformed;
            });
            const fieldNameMap = {
                ownerId: 'Owner',
                informationOwnerId: 'Information Owner',
                assetCustodianId: 'Asset Custodian',
                businessUnitId: 'Business Unit',
                assetTypeId: 'Asset Type',
                uniqueIdentifier: 'Unique Identifier',
                assetDescription: 'Asset Description',
                criticalityLevel: 'Criticality Level',
                physicalLocation: 'Physical Location',
                businessPurpose: 'Business Purpose',
                networkApprovalStatus: 'Network Approval Status',
                connectivityStatus: 'Connectivity Status',
                lastConnectivityCheck: 'Last Connectivity Check',
                purchaseDate: 'Purchase Date',
                warrantyExpiry: 'Warranty Expiry',
                complianceRequirements: 'Compliance Requirements',
            };
            if (template.fieldSelection && Array.isArray(template.fieldSelection) && template.fieldSelection.length > 0) {
                this.logger.log(`Applying field selection: ${template.fieldSelection.length} fields selected`);
                data = data.map((item) => {
                    const filtered = {};
                    template.fieldSelection.forEach(field => {
                        const columnName = fieldNameMap[field] || field;
                        if (field in item) {
                            filtered[columnName] = item[field];
                        }
                        else {
                            filtered[columnName] = '';
                        }
                    });
                    return filtered;
                });
            }
            else {
                this.logger.log('No field selection specified, including all fields');
                data = data.map(item => {
                    const renamed = {};
                    Object.keys(item).forEach(key => {
                        const newKey = fieldNameMap[key] || key;
                        renamed[newKey] = item[key];
                    });
                    return renamed;
                });
            }
            const MAX_PREVIEW_ROWS = 100;
            if (data.length > MAX_PREVIEW_ROWS) {
                this.logger.log(`Preview limited to first ${MAX_PREVIEW_ROWS} rows (total: ${data.length})`);
                return data.slice(0, MAX_PREVIEW_ROWS);
            }
            return data;
        }
        catch (error) {
            this.logger.error(`Error in previewReport: ${error.message}`, error.stack);
            throw error;
        }
    }
    async generateReport(templateId) {
        var _a;
        try {
            const template = await this.findOne(templateId);
            if (!template.isActive) {
                this.logger.warn(`Generating report from inactive template: ${template.name}`);
            }
            this.logger.log(`Generating report for template: ${template.name} (ID: ${templateId})`);
            this.logger.log(`Template config: type=${template.reportType}, format=${template.format || 'excel'}, fields=${((_a = template.fieldSelection) === null || _a === void 0 ? void 0 : _a.length) || 0}, filters=${JSON.stringify(template.filters || {})}`);
            this.logger.log(`Generating report for template: ${template.name} (${template.reportType}), format: ${template.format || 'excel'}`);
            let data = [];
            try {
                this.logger.log(`Fetching data for report type: ${template.reportType}`);
                switch (template.reportType) {
                    case report_template_entity_1.ReportType.ASSET_INVENTORY:
                        this.logger.log('Calling generateAssetInventoryReport...');
                        data = await this.generateAssetInventoryReport(template);
                        this.logger.log(`Asset inventory report returned ${data.length} records`);
                        if (data.length > 0) {
                            this.logger.log(`Sample record keys: ${Object.keys(data[0]).slice(0, 10).join(', ')}...`);
                        }
                        break;
                    case report_template_entity_1.ReportType.COMPLIANCE_REPORT:
                        this.logger.log('Calling generateComplianceReport...');
                        data = await this.generateComplianceReport(template);
                        break;
                    case report_template_entity_1.ReportType.SECURITY_TEST_REPORT:
                        this.logger.log('Calling generateSecurityTestReport...');
                        data = await this.generateSecurityTestReport(template);
                        break;
                    case report_template_entity_1.ReportType.SOFTWARE_INVENTORY:
                        this.logger.log('Calling generateSoftwareInventoryReport...');
                        data = await this.generateSoftwareInventoryReport(template);
                        break;
                    case report_template_entity_1.ReportType.CONTRACT_EXPIRATION:
                        this.logger.log('Calling generateContractExpirationReport...');
                        data = await this.generateContractExpirationReport(template);
                        break;
                    case report_template_entity_1.ReportType.SUPPLIER_CRITICALITY:
                        this.logger.log('Calling generateSupplierCriticalityReport...');
                        data = await this.generateSupplierCriticalityReport(template);
                        break;
                    default:
                        throw new common_1.BadRequestException(`Unsupported report type: ${template.reportType}`);
                }
                this.logger.log(`Fetched ${data.length} records for report`);
                if (data.length > 0) {
                    this.logger.log(`First record sample: ${JSON.stringify(Object.fromEntries(Object.entries(data[0]).slice(0, 5)))}`);
                }
            }
            catch (dataError) {
                this.logger.error(`Error fetching data for report type ${template.reportType}: ${dataError.message}`, dataError.stack);
                throw new common_1.BadRequestException(`Failed to fetch report data: ${dataError.message}`);
            }
            if (!Array.isArray(data)) {
                this.logger.error(`Data is not an array, got: ${typeof data}`);
                throw new common_1.BadRequestException('Report data must be an array');
            }
            const getUserDisplayName = (user) => {
                if (!user)
                    return '';
                if (user.firstName && user.lastName) {
                    return `${user.firstName} ${user.lastName}`;
                }
                return user.email || '';
            };
            data = data.map(item => {
                const transformed = Object.assign({}, item);
                if (item.ownerId !== undefined) {
                    if (item.owner) {
                        transformed.ownerId = getUserDisplayName(item.owner);
                    }
                    else if (item.ownerId) {
                        transformed.ownerId = item.ownerId;
                    }
                }
                if (item.informationOwnerId !== undefined) {
                    if (item.informationOwner) {
                        transformed.informationOwnerId = getUserDisplayName(item.informationOwner);
                    }
                    else if (item.informationOwnerId) {
                        transformed.informationOwnerId = item.informationOwnerId;
                    }
                }
                if (item.assetCustodianId !== undefined) {
                    if (item.assetCustodian) {
                        transformed.assetCustodianId = getUserDisplayName(item.assetCustodian);
                    }
                    else if (item.assetCustodianId) {
                        transformed.assetCustodianId = item.assetCustodianId;
                    }
                }
                if (item.businessUnitId !== undefined) {
                    if (item.businessUnit) {
                        transformed.businessUnitId = item.businessUnit.name || '';
                    }
                    else if (item.businessUnitId) {
                        transformed.businessUnitId = item.businessUnitId;
                    }
                }
                delete transformed.owner;
                delete transformed.informationOwner;
                delete transformed.assetCustodian;
                delete transformed.businessUnit;
                return transformed;
            });
            const fieldNameMap = {
                ownerId: 'Owner',
                informationOwnerId: 'Information Owner',
                assetCustodianId: 'Asset Custodian',
                businessUnitId: 'Business Unit',
                assetTypeId: 'Asset Type',
                uniqueIdentifier: 'Unique Identifier',
                assetDescription: 'Asset Description',
                criticalityLevel: 'Criticality Level',
                physicalLocation: 'Physical Location',
                businessPurpose: 'Business Purpose',
                networkApprovalStatus: 'Network Approval Status',
                connectivityStatus: 'Connectivity Status',
                lastConnectivityCheck: 'Last Connectivity Check',
                purchaseDate: 'Purchase Date',
                warrantyExpiry: 'Warranty Expiry',
                complianceRequirements: 'Compliance Requirements',
            };
            this.logger.log(`Before field selection: ${data.length} records`);
            if (data.length > 0) {
                const sampleKeys = Object.keys(data[0]);
                this.logger.log(`Sample record has ${sampleKeys.length} fields: ${sampleKeys.slice(0, 10).join(', ')}${sampleKeys.length > 10 ? '...' : ''}`);
            }
            if (template.fieldSelection && Array.isArray(template.fieldSelection) && template.fieldSelection.length > 0) {
                this.logger.log(`Applying field selection: ${template.fieldSelection.length} fields selected: ${template.fieldSelection.slice(0, 10).join(', ')}${template.fieldSelection.length > 10 ? '...' : ''}`);
                data = data.map((item, index) => {
                    const filtered = {};
                    template.fieldSelection.forEach(field => {
                        const columnName = fieldNameMap[field] || field;
                        if (field in item) {
                            filtered[columnName] = item[field];
                        }
                        else {
                            filtered[columnName] = '';
                        }
                    });
                    return filtered;
                });
                if (data.length > 0) {
                    this.logger.log(`After field selection: ${data.length} records, ${Object.keys(data[0]).length} columns`);
                }
            }
            else {
                this.logger.log('No field selection specified, including all fields');
                data = data.map(item => {
                    const renamed = {};
                    Object.keys(item).forEach(key => {
                        const newKey = fieldNameMap[key] || key;
                        renamed[newKey] = item[key];
                    });
                    return renamed;
                });
                if (data.length > 0) {
                    this.logger.log(`All fields included: ${data.length} records, ${Object.keys(data[0]).length} columns`);
                }
            }
            const MAX_ROWS = 100000;
            if (data.length > MAX_ROWS) {
                this.logger.warn(`Data has ${data.length} rows, limiting to ${MAX_ROWS} for Excel export`);
                data = data.slice(0, MAX_ROWS);
            }
            const format = template.format || report_template_entity_1.ReportFormat.EXCEL;
            const dateStr = new Date().toISOString().split('T')[0];
            const sanitizedName = template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            try {
                switch (format) {
                    case report_template_entity_1.ReportFormat.EXCEL:
                        return this.generateExcelFile(data, `${sanitizedName}-${dateStr}`, template);
                    case report_template_entity_1.ReportFormat.CSV:
                        return this.generateCSVFile(data, `${sanitizedName}-${dateStr}`);
                    case report_template_entity_1.ReportFormat.PDF:
                        return this.generateCSVFile(data, `${sanitizedName}-${dateStr}`, 'application/pdf');
                    default:
                        return this.generateExcelFile(data, `${sanitizedName}-${dateStr}`, template);
                }
            }
            catch (fileError) {
                this.logger.error(`Error generating file: ${fileError.message}`, fileError.stack);
                throw new common_1.BadRequestException(`Failed to generate report file: ${fileError.message}`);
            }
        }
        catch (error) {
            this.logger.error(`Error in generateReport: ${error.message}`, error.stack);
            throw error;
        }
    }
    generateExcelFile(data, baseFilename, _template) {
        try {
            if (!XLSX || !XLSX.utils) {
                this.logger.error('XLSX library is not available');
                throw new common_1.BadRequestException('Excel generation library is not available');
            }
            if (!Array.isArray(data)) {
                this.logger.error('Excel generation received non-array data');
                throw new common_1.BadRequestException('Invalid data format: expected array');
            }
            if (data.length === 0) {
                const worksheet = XLSX.utils.json_to_sheet([{ message: 'No data available' }]);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
                const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
                return {
                    buffer: Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer),
                    filename: `${baseFilename}.xlsx`,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                };
            }
            this.logger.log(`Generating Excel (simple) with ${data.length} rows`);
            const cleanedData = data.map((item) => {
                const cleaned = {};
                Object.keys(item).forEach((key) => {
                    const value = item[key];
                    if (value === null || value === undefined) {
                        cleaned[key] = '';
                        return;
                    }
                    if (value instanceof Date) {
                        cleaned[key] = isNaN(value.getTime()) ? '' : value.toISOString();
                        return;
                    }
                    if (Array.isArray(value)) {
                        cleaned[key] = value.length === 0 ? '' : value.join(', ');
                        return;
                    }
                    if (typeof value === 'object') {
                        try {
                            const jsonStr = JSON.stringify(value);
                            cleaned[key] = jsonStr.length > 32700 ? jsonStr.substring(0, 32700) + '...' : jsonStr;
                        }
                        catch (_a) {
                            cleaned[key] = String(value).substring(0, 32700);
                        }
                        return;
                    }
                    if (typeof value === 'string') {
                        cleaned[key] = value.length > 32700 ? value.substring(0, 32700) + '...' : value;
                    }
                    else if (typeof value === 'number') {
                        cleaned[key] = isNaN(value) || !isFinite(value) ? '' : value;
                    }
                    else {
                        cleaned[key] = value;
                    }
                });
                return cleaned;
            });
            const worksheet = XLSX.utils.json_to_sheet(cleanedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
            const buffer = XLSX.write(workbook, {
                type: 'buffer',
                bookType: 'xlsx',
            });
            const finalBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
            return {
                buffer: finalBuffer,
                filename: `${baseFilename}.xlsx`,
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            };
        }
        catch (error) {
            this.logger.error(`Failed to generate Excel file (simple): ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to generate Excel file: ${error.message}`);
        }
    }
    generateCSVFile(data, baseFilename, contentType) {
        try {
            if (!data || data.length === 0) {
                const emptyCsv = 'No data available\n';
                return {
                    buffer: Buffer.from(emptyCsv, 'utf-8'),
                    filename: `${baseFilename}.csv`,
                    contentType: contentType || 'text/csv; charset=utf-8',
                };
            }
            this.logger.log(`Generating CSV file with ${data.length} rows`);
            const stringify = getStringify();
            const csvContent = stringify(data, { header: true });
            const buffer = Buffer.from(csvContent, 'utf-8');
            this.logger.log(`CSV file generated successfully, size: ${buffer.length} bytes`);
            return {
                buffer,
                filename: `${baseFilename}.csv`,
                contentType: contentType || 'text/csv; charset=utf-8',
            };
        }
        catch (error) {
            this.logger.error(`Failed to generate CSV file: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to generate CSV file: ${error.message}`);
        }
    }
    async generateAssetInventoryReport(template) {
        var _a;
        try {
            this.logger.log('Fetching physical assets...');
            const result = await this.physicalAssetService.findAll({ page: 1, limit: 10000 });
            this.logger.log(`Found ${((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.length) || 0} physical assets`);
            return result.data || [];
        }
        catch (error) {
            this.logger.error(`Error in generateAssetInventoryReport: ${error.message}`, error.stack);
            throw error;
        }
    }
    async generateComplianceReport(template) {
        var _a, _b;
        try {
            this.logger.log(`Fetching compliance report with requirement: ${((_a = template.filters) === null || _a === void 0 ? void 0 : _a.complianceRequirement) || 'all'}`);
            const report = await this.informationAssetService.getComplianceReport((_b = template.filters) === null || _b === void 0 ? void 0 : _b.complianceRequirement);
            this.logger.log(`Found ${Array.isArray(report) ? report.length : 0} compliance records`);
            return Array.isArray(report) ? report : [];
        }
        catch (error) {
            this.logger.error(`Error in generateComplianceReport: ${error.message}`, error.stack);
            throw error;
        }
    }
    async generateSecurityTestReport(template) {
        const result = await this.businessApplicationService.findAll({ page: 1, limit: 10000 });
        return result.data || [];
    }
    async generateSoftwareInventoryReport(template) {
        var _a;
        const report = await this.softwareAssetService.getInventoryReport(((_a = template.grouping) === null || _a === void 0 ? void 0 : _a.groupBy) || 'none');
        const allSoftware = [];
        if (report.grouped) {
            Object.values(report.grouped).forEach((group) => {
                if (Array.isArray(group)) {
                    allSoftware.push(...group);
                }
            });
        }
        if (report.unlicensed && Array.isArray(report.unlicensed)) {
            allSoftware.push(...report.unlicensed);
        }
        return allSoftware;
    }
    async generateContractExpirationReport(template) {
        var _a;
        const days = ((_a = template.filters) === null || _a === void 0 ? void 0 : _a.days) || 90;
        const report = await this.supplierService.getExpiringContracts(days);
        return Array.isArray(report) ? report : [];
    }
    async generateSupplierCriticalityReport(template) {
        const report = await this.supplierService.getCriticalSuppliersReport();
        return Array.isArray(report) ? report : [];
    }
    async sendScheduledReport(templateId) {
        var _a;
        const template = await this.findOne(templateId);
        if (!template.isScheduled || !template.isActive) {
            return;
        }
        try {
            const { buffer, filename } = await this.generateReport(templateId);
            if (template.distributionListId) {
                const distributionList = await this.emailDistributionListService.findOne(template.distributionListId);
                const emailAddresses = [
                    ...distributionList.emailAddresses,
                    ...(((_a = distributionList.users) === null || _a === void 0 ? void 0 : _a.map(u => u.email)) || []),
                ];
                await this.emailDistributionListService.sendReportEmail(emailAddresses, template.name, buffer, template.format, filename);
            }
            template.lastRunAt = new Date();
            template.nextRunAt = this.calculateNextRun(template.scheduleFrequency, template.scheduleTime, template.scheduleCron);
            await this.templateRepository.save(template);
            this.logger.log(`Scheduled report ${template.name} sent successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to send scheduled report ${template.name}:`, error);
            throw error;
        }
    }
    calculateNextRun(frequency, time, cron) {
        if (cron) {
            return new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
        if (!frequency || !time) {
            return null;
        }
        const now = new Date();
        const [hours, minutes] = time.split(':').map(Number);
        const nextRun = new Date();
        nextRun.setHours(hours, minutes, 0, 0);
        switch (frequency) {
            case 'daily':
                if (nextRun <= now) {
                    nextRun.setDate(nextRun.getDate() + 1);
                }
                break;
            case 'weekly':
                nextRun.setDate(nextRun.getDate() + 7);
                break;
            case 'monthly':
                nextRun.setMonth(nextRun.getMonth() + 1);
                break;
            case 'quarterly':
                nextRun.setMonth(nextRun.getMonth() + 3);
                break;
            case 'yearly':
                nextRun.setFullYear(nextRun.getFullYear() + 1);
                break;
        }
        return nextRun;
    }
};
exports.ReportTemplateService = ReportTemplateService;
exports.ReportTemplateService = ReportTemplateService = ReportTemplateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_template_entity_1.ReportTemplate)),
    __param(1, (0, typeorm_1.InjectRepository)(report_template_version_entity_1.ReportTemplateVersion)),
    __param(2, (0, common_2.Inject)((0, common_2.forwardRef)(() => business_application_service_1.BusinessApplicationService))),
    __param(3, (0, common_2.Inject)((0, common_2.forwardRef)(() => software_asset_service_1.SoftwareAssetService))),
    __param(4, (0, common_2.Inject)((0, common_2.forwardRef)(() => information_asset_service_1.InformationAssetService))),
    __param(5, (0, common_2.Inject)((0, common_2.forwardRef)(() => supplier_service_1.SupplierService))),
    __param(6, (0, common_2.Inject)((0, common_2.forwardRef)(() => physical_asset_service_1.PhysicalAssetService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        business_application_service_1.BusinessApplicationService,
        software_asset_service_1.SoftwareAssetService,
        information_asset_service_1.InformationAssetService,
        supplier_service_1.SupplierService,
        physical_asset_service_1.PhysicalAssetService,
        email_distribution_list_service_1.EmailDistributionListService])
], ReportTemplateService);
//# sourceMappingURL=report-template.service.js.map