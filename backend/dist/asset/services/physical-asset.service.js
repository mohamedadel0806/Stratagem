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
exports.PhysicalAssetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const physical_asset_entity_1 = require("../entities/physical-asset.entity");
const asset_audit_service_1 = require("./asset-audit.service");
const asset_audit_log_entity_1 = require("../entities/asset-audit-log.entity");
const asset_dependency_entity_1 = require("../entities/asset-dependency.entity");
const risk_asset_link_service_1 = require("../../risk/services/risk-asset-link.service");
const risk_asset_link_entity_1 = require("../../risk/entities/risk-asset-link.entity");
let PhysicalAssetService = class PhysicalAssetService {
    constructor(assetRepository, dependencyRepository, auditService, riskAssetLinkService) {
        this.assetRepository = assetRepository;
        this.dependencyRepository = dependencyRepository;
        this.auditService = auditService;
        this.riskAssetLinkService = riskAssetLinkService;
    }
    async findAll(query) {
        const page = (query === null || query === void 0 ? void 0 : query.page) || 1;
        const limit = (query === null || query === void 0 ? void 0 : query.limit) || 20;
        const skip = (page - 1) * limit;
        const queryBuilder = this.assetRepository
            .createQueryBuilder('asset')
            .leftJoinAndSelect('asset.owner', 'owner')
            .leftJoinAndSelect('asset.assetType', 'assetType')
            .leftJoinAndSelect('asset.businessUnit', 'businessUnit')
            .where('asset.deletedAt IS NULL');
        if (query === null || query === void 0 ? void 0 : query.search) {
            queryBuilder.andWhere('(asset.assetDescription ILIKE :search OR asset.uniqueIdentifier ILIKE :search OR asset.serialNumber ILIKE :search)', { search: `%${query.search}%` });
        }
        if (query === null || query === void 0 ? void 0 : query.assetType) {
            queryBuilder.andWhere('asset.assetTypeId = :assetTypeId', { assetTypeId: query.assetType });
        }
        if (query === null || query === void 0 ? void 0 : query.criticalityLevel) {
            queryBuilder.andWhere('asset.criticalityLevel = :criticalityLevel', {
                criticalityLevel: query.criticalityLevel,
            });
        }
        if (query === null || query === void 0 ? void 0 : query.connectivityStatus) {
            queryBuilder.andWhere('asset.connectivityStatus = :connectivityStatus', {
                connectivityStatus: query.connectivityStatus,
            });
        }
        if (query === null || query === void 0 ? void 0 : query.businessUnit) {
            queryBuilder.andWhere('asset.businessUnitId = :businessUnitId', { businessUnitId: query.businessUnit });
        }
        if (query === null || query === void 0 ? void 0 : query.ownerId) {
            queryBuilder.andWhere('asset.ownerId = :ownerId', { ownerId: query.ownerId });
        }
        if ((query === null || query === void 0 ? void 0 : query.hasDependencies) !== undefined) {
            const subQuery = this.dependencyRepository
                .createQueryBuilder('dep')
                .select('1')
                .where('(dep.sourceAssetType = :assetType AND dep.sourceAssetId = asset.id) OR (dep.targetAssetType = :assetType AND dep.targetAssetId = asset.id)')
                .setParameter('assetType', asset_dependency_entity_1.AssetType.PHYSICAL)
                .limit(1);
            if (query.hasDependencies) {
                queryBuilder.andWhere(`EXISTS (${subQuery.getQuery()})`);
            }
            else {
                queryBuilder.andWhere(`NOT EXISTS (${subQuery.getQuery()})`);
            }
        }
        const total = await queryBuilder.getCount();
        const assets = await queryBuilder
            .orderBy('asset.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getMany();
        const assetIds = assets.map(a => a.id);
        const riskCounts = await this.getRiskCountsForAssets(assetIds);
        return {
            data: assets.map((asset) => this.toResponseDto(asset, riskCounts[asset.id])),
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const asset = await this.assetRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['owner', 'assetType', 'businessUnit', 'createdByUser', 'updatedByUser'],
        });
        if (!asset) {
            throw new common_1.NotFoundException(`Physical asset with ID ${id} not found`);
        }
        const riskCount = await this.getRiskCountForAsset(id);
        return this.toResponseDto(asset, riskCount);
    }
    async create(createDto, userId) {
        let uniqueIdentifier = createDto.uniqueIdentifier;
        if (!uniqueIdentifier) {
            uniqueIdentifier = await this.generateUniqueIdentifier();
        }
        const existing = await this.assetRepository.findOne({
            where: { uniqueIdentifier, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (existing) {
            throw new common_1.ConflictException(`Asset with identifier ${uniqueIdentifier} already exists`);
        }
        const assetData = Object.assign(Object.assign({}, createDto), { uniqueIdentifier, ipAddresses: createDto.ipAddresses || null, macAddresses: createDto.macAddresses || null, installedSoftware: createDto.installedSoftware || null, activePortsServices: createDto.activePortsServices || null, complianceRequirements: createDto.complianceRequirements || null, securityTestResults: createDto.securityTestResults || null, purchaseDate: createDto.purchaseDate ? new Date(createDto.purchaseDate) : null, warrantyExpiry: createDto.warrantyExpiry ? new Date(createDto.warrantyExpiry) : null, lastConnectivityCheck: createDto.lastConnectivityCheck ? new Date(createDto.lastConnectivityCheck) : null, createdBy: userId });
        const asset = this.assetRepository.create(assetData);
        const saved = await this.assetRepository.save(asset);
        const savedEntity = Array.isArray(saved) ? saved[0] : saved;
        const reloaded = await this.assetRepository.findOne({
            where: { id: savedEntity.id },
            relations: ['owner', 'assetType', 'businessUnit'],
        });
        await this.auditService.logCreate(asset_audit_log_entity_1.AssetType.PHYSICAL, savedEntity.id, userId);
        return this.toResponseDto(reloaded);
    }
    async update(id, updateDto, userId) {
        const asset = await this.assetRepository.findOne({ where: { id, deletedAt: (0, typeorm_2.IsNull)() } });
        if (!asset) {
            throw new common_1.NotFoundException(`Physical asset with ID ${id} not found`);
        }
        if (updateDto.uniqueIdentifier && updateDto.uniqueIdentifier !== asset.uniqueIdentifier) {
            const existing = await this.assetRepository.findOne({
                where: { uniqueIdentifier: updateDto.uniqueIdentifier, deletedAt: (0, typeorm_2.IsNull)() },
            });
            if (existing) {
                throw new common_1.ConflictException(`Asset with identifier ${updateDto.uniqueIdentifier} already exists`);
            }
        }
        const updateData = Object.assign(Object.assign({}, updateDto), { updatedBy: userId });
        if (updateDto.purchaseDate) {
            updateData.purchaseDate = new Date(updateDto.purchaseDate);
        }
        if (updateDto.warrantyExpiry) {
            updateData.warrantyExpiry = new Date(updateDto.warrantyExpiry);
        }
        if (updateDto.lastConnectivityCheck) {
            updateData.lastConnectivityCheck = new Date(updateDto.lastConnectivityCheck);
        }
        const changes = {};
        Object.keys(updateData).forEach((key) => {
            if (key !== 'updatedBy' && asset[key] !== updateData[key]) {
                changes[key] = {
                    old: asset[key],
                    new: updateData[key],
                };
            }
        });
        Object.assign(asset, updateData);
        const updated = await this.assetRepository.save(asset);
        if (Object.keys(changes).length > 0) {
            await this.auditService.logUpdate(asset_audit_log_entity_1.AssetType.PHYSICAL, id, changes, userId);
        }
        const reloaded = await this.assetRepository.findOne({
            where: { id: updated.id },
            relations: ['owner', 'assetType', 'businessUnit'],
        });
        return this.toResponseDto(reloaded);
    }
    async remove(id, userId) {
        const asset = await this.assetRepository.findOne({ where: { id, deletedAt: (0, typeorm_2.IsNull)() } });
        if (!asset) {
            throw new common_1.NotFoundException(`Physical asset with ID ${id} not found`);
        }
        await this.auditService.logDelete(asset_audit_log_entity_1.AssetType.PHYSICAL, id, userId);
        asset.deletedAt = new Date();
        await this.assetRepository.save(asset);
    }
    async generateUniqueIdentifier() {
        const prefix = 'PA';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
    async getRiskCountForAsset(assetId) {
        const links = await this.riskAssetLinkService.findByAsset(risk_asset_link_entity_1.RiskAssetType.PHYSICAL, assetId);
        return links.length;
    }
    async getRiskCountsForAssets(assetIds) {
        if (assetIds.length === 0)
            return {};
        const counts = {};
        for (const assetId of assetIds) {
            const links = await this.riskAssetLinkService.findByAsset(risk_asset_link_entity_1.RiskAssetType.PHYSICAL, assetId);
            counts[assetId] = links.length;
        }
        return counts;
    }
    toResponseDto(asset, riskCount) {
        return {
            id: asset.id,
            assetTypeId: asset.assetTypeId || undefined,
            assetType: asset.assetType
                ? {
                    id: asset.assetType.id,
                    name: asset.assetType.name,
                    category: asset.assetType.category,
                }
                : undefined,
            assetDescription: asset.assetDescription,
            manufacturer: asset.manufacturer || undefined,
            model: asset.model || undefined,
            businessPurpose: asset.businessPurpose || undefined,
            ownerId: asset.ownerId || undefined,
            owner: asset.owner
                ? {
                    id: asset.owner.id,
                    email: asset.owner.email,
                    firstName: asset.owner.firstName || undefined,
                    lastName: asset.owner.lastName || undefined,
                }
                : undefined,
            businessUnitId: asset.businessUnitId || undefined,
            businessUnit: asset.businessUnit
                ? {
                    id: asset.businessUnit.id,
                    name: asset.businessUnit.name,
                    code: asset.businessUnit.code || undefined,
                }
                : undefined,
            uniqueIdentifier: asset.uniqueIdentifier,
            physicalLocation: asset.physicalLocation || undefined,
            criticalityLevel: asset.criticalityLevel || undefined,
            macAddresses: Array.isArray(asset.macAddresses) ? asset.macAddresses : undefined,
            ipAddresses: Array.isArray(asset.ipAddresses) ? asset.ipAddresses : undefined,
            installedSoftware: Array.isArray(asset.installedSoftware) ? asset.installedSoftware : undefined,
            activePortsServices: Array.isArray(asset.activePortsServices) ? asset.activePortsServices : undefined,
            networkApprovalStatus: asset.networkApprovalStatus || undefined,
            connectivityStatus: asset.connectivityStatus || undefined,
            lastConnectivityCheck: asset.lastConnectivityCheck || undefined,
            serialNumber: asset.serialNumber || undefined,
            assetTag: asset.assetTag || undefined,
            purchaseDate: asset.purchaseDate || undefined,
            warrantyExpiry: asset.warrantyExpiry || undefined,
            complianceRequirements: Array.isArray(asset.complianceRequirements) ? asset.complianceRequirements : undefined,
            securityTestResults: asset.securityTestResults || undefined,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
            deletedAt: asset.deletedAt || undefined,
            riskCount: riskCount,
        };
    }
};
exports.PhysicalAssetService = PhysicalAssetService;
exports.PhysicalAssetService = PhysicalAssetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(physical_asset_entity_1.PhysicalAsset)),
    __param(1, (0, typeorm_1.InjectRepository)(asset_dependency_entity_1.AssetDependency)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        asset_audit_service_1.AssetAuditService,
        risk_asset_link_service_1.RiskAssetLinkService])
], PhysicalAssetService);
//# sourceMappingURL=physical-asset.service.js.map