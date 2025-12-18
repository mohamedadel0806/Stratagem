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
exports.SoftwareAssetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const software_asset_entity_1 = require("../entities/software-asset.entity");
const asset_audit_service_1 = require("./asset-audit.service");
const asset_audit_log_entity_1 = require("../entities/asset-audit-log.entity");
const risk_asset_link_service_1 = require("../../risk/services/risk-asset-link.service");
const risk_asset_link_entity_1 = require("../../risk/entities/risk-asset-link.entity");
let SoftwareAssetService = class SoftwareAssetService {
    constructor(softwareRepository, auditService, riskAssetLinkService) {
        this.softwareRepository = softwareRepository;
        this.auditService = auditService;
        this.riskAssetLinkService = riskAssetLinkService;
    }
    async findAll(query) {
        const page = (query === null || query === void 0 ? void 0 : query.page) || 1;
        const limit = (query === null || query === void 0 ? void 0 : query.limit) || 20;
        const skip = (page - 1) * limit;
        const queryBuilder = this.softwareRepository
            .createQueryBuilder('software')
            .leftJoinAndSelect('software.owner', 'owner')
            .leftJoinAndSelect('software.businessUnit', 'businessUnit')
            .where('software.deletedAt IS NULL');
        if (query === null || query === void 0 ? void 0 : query.search) {
            queryBuilder.andWhere('(software.softwareName ILIKE :search OR software.softwareType ILIKE :search)', { search: `%${query.search}%` });
        }
        if (query === null || query === void 0 ? void 0 : query.softwareType) {
            queryBuilder.andWhere('software.softwareType = :softwareType', {
                softwareType: query.softwareType,
            });
        }
        if (query === null || query === void 0 ? void 0 : query.vendor) {
            queryBuilder.andWhere('software.vendorName = :vendorName', { vendorName: query.vendor });
        }
        if (query === null || query === void 0 ? void 0 : query.businessUnit) {
            queryBuilder.andWhere('software.businessUnitId = :businessUnitId', {
                businessUnitId: query.businessUnit,
            });
        }
        if (query === null || query === void 0 ? void 0 : query.ownerId) {
            queryBuilder.andWhere('software.ownerId = :ownerId', { ownerId: query.ownerId });
        }
        const total = await queryBuilder.getCount();
        const softwareAssets = await queryBuilder
            .orderBy('software.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getMany();
        const assetIds = softwareAssets.map(a => a.id);
        const riskCounts = await this.getRiskCountsForAssets(assetIds);
        return {
            data: softwareAssets.map((software) => this.toResponseDto(software, riskCounts[software.id])),
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const software = await this.softwareRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['owner', 'businessUnit', 'createdByUser', 'updatedByUser'],
        });
        if (!software) {
            throw new common_1.NotFoundException(`Software asset with ID ${id} not found`);
        }
        const riskCount = await this.getRiskCountForAsset(id);
        return this.toResponseDto(software, riskCount);
    }
    async create(createDto, userId) {
        let uniqueIdentifier = createDto.uniqueIdentifier;
        if (!uniqueIdentifier) {
            uniqueIdentifier = await this.generateUniqueIdentifier();
        }
        const existing = await this.softwareRepository.findOne({
            where: { uniqueIdentifier, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (existing) {
            throw new common_1.ConflictException(`Software asset with identifier ${uniqueIdentifier} already exists`);
        }
        const software = this.softwareRepository.create(Object.assign(Object.assign({}, createDto), { uniqueIdentifier, securityTestResults: createDto.securityTestResults || null, knownVulnerabilities: createDto.knownVulnerabilities || null, licenseExpiry: createDto.licenseExpiry ? new Date(createDto.licenseExpiry) : null, lastSecurityTestDate: createDto.lastSecurityTestDate ? new Date(createDto.lastSecurityTestDate) : null, supportEndDate: createDto.supportEndDate ? new Date(createDto.supportEndDate) : null, createdBy: userId, updatedBy: userId }));
        const savedSoftware = await this.softwareRepository.save(software);
        const reloaded = await this.softwareRepository.findOne({
            where: { id: savedSoftware.id },
            relations: ['owner', 'businessUnit'],
        });
        await this.auditService.logCreate(asset_audit_log_entity_1.AssetType.SOFTWARE, savedSoftware.id, userId);
        return this.toResponseDto(reloaded);
    }
    async update(id, updateDto, userId) {
        const software = await this.softwareRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (!software) {
            throw new common_1.NotFoundException(`Software asset with ID ${id} not found`);
        }
        const changes = {};
        const updateData = Object.assign(Object.assign({}, updateDto), { updatedBy: userId });
        if (updateDto.licenseExpiry) {
            updateData.licenseExpiry = new Date(updateDto.licenseExpiry);
        }
        if (updateDto.lastSecurityTestDate) {
            updateData.lastSecurityTestDate = new Date(updateDto.lastSecurityTestDate);
        }
        if (updateDto.supportEndDate) {
            updateData.supportEndDate = new Date(updateDto.supportEndDate);
        }
        Object.keys(updateData).forEach((key) => {
            if (key !== 'updatedBy' && software[key] !== updateData[key]) {
                changes[key] = {
                    old: software[key],
                    new: updateData[key],
                };
            }
        });
        Object.assign(software, updateData);
        const savedSoftware = await this.softwareRepository.save(software);
        const reloaded = await this.softwareRepository.findOne({
            where: { id: savedSoftware.id },
            relations: ['owner', 'businessUnit'],
        });
        if (Object.keys(changes).length > 0) {
            await this.auditService.logUpdate(asset_audit_log_entity_1.AssetType.SOFTWARE, id, changes, userId);
        }
        return this.toResponseDto(reloaded);
    }
    async remove(id, userId) {
        const software = await this.softwareRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (!software) {
            throw new common_1.NotFoundException(`Software asset with ID ${id} not found`);
        }
        await this.auditService.logDelete(asset_audit_log_entity_1.AssetType.SOFTWARE, id, userId);
        software.deletedAt = new Date();
        await this.softwareRepository.save(software);
    }
    async getRiskCountForAsset(assetId) {
        const links = await this.riskAssetLinkService.findByAsset(risk_asset_link_entity_1.RiskAssetType.SOFTWARE, assetId);
        return links.length;
    }
    async getRiskCountsForAssets(assetIds) {
        if (assetIds.length === 0)
            return {};
        const counts = {};
        for (const assetId of assetIds) {
            const links = await this.riskAssetLinkService.findByAsset(risk_asset_link_entity_1.RiskAssetType.SOFTWARE, assetId);
            counts[assetId] = links.length;
        }
        return counts;
    }
    toResponseDto(software, riskCount) {
        return {
            id: software.id,
            uniqueIdentifier: software.uniqueIdentifier,
            softwareName: software.softwareName,
            softwareType: software.softwareType || undefined,
            versionNumber: software.versionNumber || undefined,
            patchLevel: software.patchLevel || undefined,
            businessPurpose: software.businessPurpose || undefined,
            ownerId: software.ownerId || undefined,
            owner: software.owner
                ? {
                    id: software.owner.id,
                    email: software.owner.email,
                    firstName: software.owner.firstName || undefined,
                    lastName: software.owner.lastName || undefined,
                }
                : undefined,
            businessUnitId: software.businessUnitId || undefined,
            businessUnit: software.businessUnit
                ? {
                    id: software.businessUnit.id,
                    name: software.businessUnit.name,
                    code: software.businessUnit.code || undefined,
                }
                : undefined,
            vendorName: software.vendorName || undefined,
            vendorContact: software.vendorContact || undefined,
            licenseType: software.licenseType || undefined,
            licenseCount: software.licenseCount || undefined,
            licenseKey: software.licenseKey || undefined,
            licenseExpiry: software.licenseExpiry || undefined,
            installationCount: software.installationCount || undefined,
            securityTestResults: software.securityTestResults || undefined,
            lastSecurityTestDate: software.lastSecurityTestDate || undefined,
            knownVulnerabilities: Array.isArray(software.knownVulnerabilities) ? software.knownVulnerabilities : undefined,
            supportEndDate: software.supportEndDate || undefined,
            createdAt: software.createdAt,
            updatedAt: software.updatedAt,
            deletedAt: software.deletedAt || undefined,
            riskCount: riskCount,
        };
    }
    async getInventoryReport(groupBy) {
        const allSoftware = await this.softwareRepository
            .createQueryBuilder('software')
            .leftJoin('software.businessUnit', 'businessUnit')
            .select([
            'software.id',
            'software.softwareName',
            'software.versionNumber',
            'software.patchLevel',
            'software.vendorName',
            'software.softwareType',
            'software.installationCount',
            'software.licenseCount',
            'software.licenseType',
            'software.licenseExpiry',
            'software.businessUnitId',
            'businessUnit.id',
            'businessUnit.name',
        ])
            .where('software.deletedAt IS NULL')
            .getMany();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const summary = {
            totalSoftware: allSoftware.length,
            totalInstallations: allSoftware.reduce((sum, s) => sum + (s.installationCount || 0), 0),
            unlicensedCount: 0,
            expiredLicenseCount: 0,
        };
        const unlicensed = [];
        const grouped = {};
        for (const software of allSoftware) {
            const licenseStatus = this.getLicenseStatus(software.licenseExpiry, software.licenseCount, software.installationCount);
            if (licenseStatus === 'expired') {
                summary.expiredLicenseCount++;
                summary.unlicensedCount++;
            }
            if (licenseStatus === 'unlicensed' || licenseStatus === 'expired' || licenseStatus === 'installation_exceeds_license') {
                if (licenseStatus !== 'expired') {
                    summary.unlicensedCount++;
                }
                unlicensed.push({
                    softwareName: software.softwareName,
                    version: software.versionNumber || 'N/A',
                    patchLevel: software.patchLevel || 'N/A',
                    vendor: software.vendorName || 'Unknown',
                    softwareType: software.softwareType || 'Unknown',
                    installationCount: software.installationCount || 0,
                    businessUnits: software.businessUnit ? [software.businessUnit.name] : ['N/A'],
                    reason: licenseStatus === 'expired' ? 'expired_license' : licenseStatus === 'installation_exceeds_license' ? 'installation_exceeds_license' : 'no_license',
                });
            }
            const item = {
                softwareName: software.softwareName,
                version: software.versionNumber || 'N/A',
                patchLevel: software.patchLevel || 'N/A',
                vendor: software.vendorName || 'Unknown',
                softwareType: software.softwareType || 'Unknown',
                installationCount: software.installationCount || 0,
                licenseCount: software.licenseCount,
                licenseType: software.licenseType || null,
                licenseExpiry: software.licenseExpiry || null,
                licenseStatus,
                businessUnits: software.businessUnit ? [software.businessUnit.name] : ['N/A'],
                locations: software.businessUnit ? [software.businessUnit.name] : ['N/A'],
            };
            let groupKey = 'All Software';
            if (groupBy === 'type' && software.softwareType) {
                groupKey = software.softwareType;
            }
            else if (groupBy === 'vendor' && software.vendorName) {
                groupKey = software.vendorName;
            }
            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }
            grouped[groupKey].push(item);
        }
        return { summary, grouped, unlicensed };
    }
    getLicenseStatus(licenseExpiry, licenseCount, installationCount) {
        if (licenseExpiry) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiry = new Date(licenseExpiry);
            expiry.setHours(0, 0, 0, 0);
            if (expiry < today) {
                return 'expired';
            }
        }
        if (!licenseExpiry && licenseCount === null) {
            return 'unlicensed';
        }
        if (licenseCount !== null && installationCount > licenseCount) {
            return 'installation_exceeds_license';
        }
        if (licenseExpiry || (licenseCount !== null && licenseCount > 0)) {
            return 'licensed';
        }
        return 'unknown';
    }
    async generateUniqueIdentifier() {
        const prefix = 'SW';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
};
exports.SoftwareAssetService = SoftwareAssetService;
exports.SoftwareAssetService = SoftwareAssetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(software_asset_entity_1.SoftwareAsset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        asset_audit_service_1.AssetAuditService,
        risk_asset_link_service_1.RiskAssetLinkService])
], SoftwareAssetService);
//# sourceMappingURL=software-asset.service.js.map