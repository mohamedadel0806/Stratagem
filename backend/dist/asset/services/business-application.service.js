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
exports.BusinessApplicationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const business_application_entity_1 = require("../entities/business-application.entity");
const asset_audit_service_1 = require("./asset-audit.service");
const asset_audit_log_entity_1 = require("../entities/asset-audit-log.entity");
const risk_asset_link_service_1 = require("../../risk/services/risk-asset-link.service");
const risk_asset_link_entity_1 = require("../../risk/entities/risk-asset-link.entity");
let BusinessApplicationService = class BusinessApplicationService {
    constructor(applicationRepository, auditService, riskAssetLinkService) {
        this.applicationRepository = applicationRepository;
        this.auditService = auditService;
        this.riskAssetLinkService = riskAssetLinkService;
    }
    async findAll(query) {
        const page = (query === null || query === void 0 ? void 0 : query.page) || 1;
        const limit = (query === null || query === void 0 ? void 0 : query.limit) || 20;
        const skip = (page - 1) * limit;
        const queryBuilder = this.applicationRepository
            .createQueryBuilder('app')
            .leftJoinAndSelect('app.owner', 'owner')
            .leftJoinAndSelect('app.businessUnit', 'businessUnit')
            .where('app.deletedAt IS NULL');
        if (query === null || query === void 0 ? void 0 : query.search) {
            queryBuilder.andWhere('(app.applicationName ILIKE :search OR app.applicationType ILIKE :search)', { search: `%${query.search}%` });
        }
        if (query === null || query === void 0 ? void 0 : query.applicationType) {
            queryBuilder.andWhere('app.applicationType = :applicationType', {
                applicationType: query.applicationType,
            });
        }
        if (query === null || query === void 0 ? void 0 : query.criticalityLevel) {
            queryBuilder.andWhere('app.criticalityLevel = :criticalityLevel', {
                criticalityLevel: query.criticalityLevel,
            });
        }
        if (query === null || query === void 0 ? void 0 : query.businessUnit) {
            queryBuilder.andWhere('app.businessUnitId = :businessUnitId', {
                businessUnitId: query.businessUnit,
            });
        }
        if (query === null || query === void 0 ? void 0 : query.ownerId) {
            queryBuilder.andWhere('app.ownerId = :ownerId', { ownerId: query.ownerId });
        }
        if ((query === null || query === void 0 ? void 0 : query.missingVersion) === true) {
            queryBuilder.andWhere('(app.versionNumber IS NULL OR app.versionNumber = \'\')');
        }
        if ((query === null || query === void 0 ? void 0 : query.missingPatch) === true) {
            queryBuilder.andWhere('(app.patchLevel IS NULL OR app.patchLevel = \'\')');
        }
        if (query === null || query === void 0 ? void 0 : query.securityTestStatus) {
            const now = new Date();
            const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            switch (query.securityTestStatus) {
                case 'no-test':
                    queryBuilder.andWhere('app.lastSecurityTestDate IS NULL');
                    break;
                case 'overdue':
                    queryBuilder.andWhere('app.lastSecurityTestDate IS NOT NULL');
                    queryBuilder.andWhere('app.lastSecurityTestDate < :oneYearAgo', { oneYearAgo });
                    break;
                case 'failed':
                    queryBuilder.andWhere('app.lastSecurityTestDate IS NOT NULL');
                    queryBuilder.andWhere("(app.securityTestResults->>'severity' IN ('critical', 'high', 'failed') OR app.securityTestResults->>'severity' ILIKE '%failed%')");
                    break;
                case 'passed':
                    queryBuilder.andWhere('app.lastSecurityTestDate IS NOT NULL');
                    queryBuilder.andWhere('app.lastSecurityTestDate >= :oneYearAgo', { oneYearAgo });
                    queryBuilder.andWhere("(app.securityTestResults->>'severity' NOT IN ('critical', 'high', 'failed') AND app.securityTestResults->>'severity' NOT ILIKE '%failed%')");
                    break;
            }
        }
        const total = await queryBuilder.getCount();
        const applications = await queryBuilder
            .orderBy('app.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getMany();
        const assetIds = applications.map(a => a.id);
        const riskCounts = await this.getRiskCountsForAssets(assetIds);
        return {
            data: applications.map((app) => this.toResponseDto(app, riskCounts[app.id])),
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const application = await this.applicationRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['owner', 'businessUnit', 'createdByUser', 'updatedByUser'],
        });
        if (!application) {
            throw new common_1.NotFoundException(`Business application with ID ${id} not found`);
        }
        const riskCount = await this.getRiskCountForAsset(id);
        return this.toResponseDto(application, riskCount);
    }
    async create(createDto, userId) {
        let uniqueIdentifier = createDto.uniqueIdentifier;
        if (!uniqueIdentifier) {
            uniqueIdentifier = await this.generateUniqueIdentifier();
        }
        const existing = await this.applicationRepository.findOne({
            where: { uniqueIdentifier, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (existing) {
            throw new common_1.ConflictException(`Business application with identifier ${uniqueIdentifier} already exists`);
        }
        const application = this.applicationRepository.create(Object.assign(Object.assign({}, createDto), { uniqueIdentifier, dataProcessed: createDto.dataProcessed || null, complianceRequirements: createDto.complianceRequirements || null, licenseExpiry: createDto.licenseExpiry ? new Date(createDto.licenseExpiry) : null, lastSecurityTestDate: createDto.lastSecurityTestDate ? new Date(createDto.lastSecurityTestDate) : null, createdBy: userId, updatedBy: userId }));
        const savedApplication = await this.applicationRepository.save(application);
        const reloaded = await this.applicationRepository.findOne({
            where: { id: savedApplication.id },
            relations: ['owner', 'businessUnit'],
        });
        await this.auditService.logCreate(asset_audit_log_entity_1.AssetType.APPLICATION, savedApplication.id, userId);
        return this.toResponseDto(reloaded);
    }
    async update(id, updateDto, userId) {
        const application = await this.applicationRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (!application) {
            throw new common_1.NotFoundException(`Business application with ID ${id} not found`);
        }
        const changes = {};
        const updateData = Object.assign(Object.assign({}, updateDto), { updatedBy: userId });
        if (updateDto.licenseExpiry) {
            updateData.licenseExpiry = new Date(updateDto.licenseExpiry);
        }
        if (updateDto.lastSecurityTestDate) {
            updateData.lastSecurityTestDate = new Date(updateDto.lastSecurityTestDate);
        }
        Object.keys(updateData).forEach((key) => {
            if (key !== 'updatedBy' && application[key] !== updateData[key]) {
                changes[key] = {
                    old: application[key],
                    new: updateData[key],
                };
            }
        });
        Object.assign(application, updateData);
        const savedApplication = await this.applicationRepository.save(application);
        const reloaded = await this.applicationRepository.findOne({
            where: { id: savedApplication.id },
            relations: ['owner', 'businessUnit'],
        });
        if (Object.keys(changes).length > 0) {
            await this.auditService.logUpdate(asset_audit_log_entity_1.AssetType.APPLICATION, id, changes, userId);
        }
        return this.toResponseDto(reloaded);
    }
    async remove(id, userId) {
        const application = await this.applicationRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (!application) {
            throw new common_1.NotFoundException(`Business application with ID ${id} not found`);
        }
        await this.auditService.logDelete(asset_audit_log_entity_1.AssetType.APPLICATION, id, userId);
        application.deletedAt = new Date();
        await this.applicationRepository.save(application);
    }
    async getRiskCountForAsset(assetId) {
        const links = await this.riskAssetLinkService.findByAsset(risk_asset_link_entity_1.RiskAssetType.APPLICATION, assetId);
        return links.length;
    }
    async getRiskCountsForAssets(assetIds) {
        if (assetIds.length === 0)
            return {};
        const counts = {};
        for (const assetId of assetIds) {
            const links = await this.riskAssetLinkService.findByAsset(risk_asset_link_entity_1.RiskAssetType.APPLICATION, assetId);
            counts[assetId] = links.length;
        }
        return counts;
    }
    toResponseDto(application, riskCount) {
        return {
            id: application.id,
            uniqueIdentifier: application.uniqueIdentifier,
            applicationName: application.applicationName,
            applicationType: application.applicationType || undefined,
            versionNumber: application.versionNumber || undefined,
            patchLevel: application.patchLevel || undefined,
            businessPurpose: application.businessPurpose || undefined,
            ownerId: application.ownerId || undefined,
            owner: application.owner
                ? {
                    id: application.owner.id,
                    email: application.owner.email,
                    firstName: application.owner.firstName || undefined,
                    lastName: application.owner.lastName || undefined,
                }
                : undefined,
            businessUnitId: application.businessUnitId || undefined,
            businessUnit: application.businessUnit
                ? {
                    id: application.businessUnit.id,
                    name: application.businessUnit.name,
                    code: application.businessUnit.code || undefined,
                }
                : undefined,
            dataProcessed: Array.isArray(application.dataProcessed) ? application.dataProcessed : undefined,
            dataClassification: application.dataClassification || undefined,
            vendorName: application.vendorName || undefined,
            vendorContact: application.vendorContact || undefined,
            licenseType: application.licenseType || undefined,
            licenseCount: application.licenseCount || undefined,
            licenseExpiry: application.licenseExpiry || undefined,
            hostingType: application.hostingType || undefined,
            hostingLocation: application.hostingLocation || undefined,
            accessUrl: application.accessUrl || undefined,
            securityTestResults: application.securityTestResults || undefined,
            lastSecurityTestDate: application.lastSecurityTestDate || undefined,
            authenticationMethod: application.authenticationMethod || undefined,
            complianceRequirements: Array.isArray(application.complianceRequirements) ? application.complianceRequirements : undefined,
            criticalityLevel: application.criticalityLevel || undefined,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
            deletedAt: application.deletedAt || undefined,
            riskCount: riskCount,
        };
    }
    async generateUniqueIdentifier() {
        const prefix = 'APP';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
};
exports.BusinessApplicationService = BusinessApplicationService;
exports.BusinessApplicationService = BusinessApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(business_application_entity_1.BusinessApplication)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        asset_audit_service_1.AssetAuditService,
        risk_asset_link_service_1.RiskAssetLinkService])
], BusinessApplicationService);
//# sourceMappingURL=business-application.service.js.map