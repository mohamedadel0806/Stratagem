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
exports.InformationAssetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const information_asset_entity_1 = require("../entities/information-asset.entity");
const asset_audit_service_1 = require("./asset-audit.service");
const asset_audit_log_entity_1 = require("../entities/asset-audit-log.entity");
const risk_asset_link_service_1 = require("../../risk/services/risk-asset-link.service");
const risk_asset_link_entity_1 = require("../../risk/entities/risk-asset-link.entity");
let InformationAssetService = class InformationAssetService {
    constructor(assetRepository, auditService, riskAssetLinkService) {
        this.assetRepository = assetRepository;
        this.auditService = auditService;
        this.riskAssetLinkService = riskAssetLinkService;
    }
    async findAll(query) {
        const page = (query === null || query === void 0 ? void 0 : query.page) || 1;
        const limit = (query === null || query === void 0 ? void 0 : query.limit) || 20;
        const skip = (page - 1) * limit;
        const queryBuilder = this.assetRepository
            .createQueryBuilder('asset')
            .leftJoinAndSelect('asset.informationOwner', 'informationOwner')
            .leftJoinAndSelect('asset.assetCustodian', 'assetCustodian')
            .leftJoinAndSelect('asset.businessUnit', 'businessUnit')
            .where('asset.deletedAt IS NULL');
        if (query === null || query === void 0 ? void 0 : query.search) {
            queryBuilder.andWhere('(asset.name ILIKE :search OR asset.informationType ILIKE :search)', { search: `%${query.search}%` });
        }
        if (query === null || query === void 0 ? void 0 : query.dataClassification) {
            queryBuilder.andWhere('asset.classificationLevel = :classificationLevel', {
                classificationLevel: query.dataClassification,
            });
        }
        if (query === null || query === void 0 ? void 0 : query.businessUnit) {
            queryBuilder.andWhere('asset.businessUnitId = :businessUnitId', {
                businessUnitId: query.businessUnit,
            });
        }
        if (query === null || query === void 0 ? void 0 : query.ownerId) {
            queryBuilder.andWhere('asset.informationOwnerId = :informationOwnerId', { informationOwnerId: query.ownerId });
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
            relations: ['informationOwner', 'assetCustodian', 'businessUnit', 'createdByUser', 'updatedByUser'],
        });
        if (!asset) {
            throw new common_1.NotFoundException(`Information asset with ID ${id} not found`);
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
            throw new common_1.ConflictException(`Information asset with identifier ${uniqueIdentifier} already exists`);
        }
        const asset = this.assetRepository.create(Object.assign(Object.assign({}, createDto), { uniqueIdentifier, complianceRequirements: createDto.complianceRequirements || null, classificationDate: createDto.classificationDate ? new Date(createDto.classificationDate) : null, reclassificationDate: createDto.reclassificationDate ? new Date(createDto.reclassificationDate) : null, createdBy: userId, updatedBy: userId }));
        const savedAsset = await this.assetRepository.save(asset);
        const reloaded = await this.assetRepository.findOne({
            where: { id: savedAsset.id },
            relations: ['informationOwner', 'assetCustodian', 'businessUnit'],
        });
        await this.auditService.logCreate(asset_audit_log_entity_1.AssetType.INFORMATION, savedAsset.id, userId);
        return this.toResponseDto(reloaded);
    }
    async update(id, updateDto, userId) {
        const asset = await this.assetRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (!asset) {
            throw new common_1.NotFoundException(`Information asset with ID ${id} not found`);
        }
        const changes = {};
        const updateData = Object.assign(Object.assign({}, updateDto), { updatedBy: userId });
        if (updateDto.classificationDate) {
            updateData.classificationDate = new Date(updateDto.classificationDate);
        }
        if (updateDto.reclassificationDate) {
            updateData.reclassificationDate = new Date(updateDto.reclassificationDate);
        }
        Object.keys(updateData).forEach((key) => {
            if (key !== 'updatedBy' && asset[key] !== updateData[key]) {
                changes[key] = {
                    old: asset[key],
                    new: updateData[key],
                };
            }
        });
        Object.assign(asset, updateData);
        const savedAsset = await this.assetRepository.save(asset);
        const reloaded = await this.assetRepository.findOne({
            where: { id: savedAsset.id },
            relations: ['informationOwner', 'assetCustodian', 'businessUnit'],
        });
        if (Object.keys(changes).length > 0) {
            await this.auditService.logUpdate(asset_audit_log_entity_1.AssetType.INFORMATION, id, changes, userId);
        }
        return this.toResponseDto(reloaded);
    }
    async remove(id, userId) {
        const asset = await this.assetRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (!asset) {
            throw new common_1.NotFoundException(`Information asset with ID ${id} not found`);
        }
        await this.auditService.logDelete(asset_audit_log_entity_1.AssetType.INFORMATION, id, userId);
        asset.deletedAt = new Date();
        await this.assetRepository.save(asset);
    }
    async getRiskCountForAsset(assetId) {
        const links = await this.riskAssetLinkService.findByAsset(risk_asset_link_entity_1.RiskAssetType.INFORMATION, assetId);
        return links.length;
    }
    async getRiskCountsForAssets(assetIds) {
        if (assetIds.length === 0)
            return {};
        const counts = {};
        for (const assetId of assetIds) {
            const links = await this.riskAssetLinkService.findByAsset(risk_asset_link_entity_1.RiskAssetType.INFORMATION, assetId);
            counts[assetId] = links.length;
        }
        return counts;
    }
    toResponseDto(asset, riskCount) {
        return {
            id: asset.id,
            uniqueIdentifier: asset.uniqueIdentifier,
            informationType: asset.informationType,
            name: asset.name,
            description: asset.description || undefined,
            classificationLevel: asset.classificationLevel,
            classificationDate: asset.classificationDate || undefined,
            reclassificationDate: asset.reclassificationDate || undefined,
            reclassificationReminderSent: asset.reclassificationReminderSent || undefined,
            informationOwnerId: asset.informationOwnerId || undefined,
            informationOwner: asset.informationOwner
                ? {
                    id: asset.informationOwner.id,
                    email: asset.informationOwner.email,
                    firstName: asset.informationOwner.firstName || undefined,
                    lastName: asset.informationOwner.lastName || undefined,
                }
                : undefined,
            assetCustodianId: asset.assetCustodianId || undefined,
            assetCustodian: asset.assetCustodian
                ? {
                    id: asset.assetCustodian.id,
                    email: asset.assetCustodian.email,
                    firstName: asset.assetCustodian.firstName || undefined,
                    lastName: asset.assetCustodian.lastName || undefined,
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
            assetLocation: asset.assetLocation || undefined,
            storageMedium: asset.storageMedium || undefined,
            complianceRequirements: Array.isArray(asset.complianceRequirements) ? asset.complianceRequirements : undefined,
            retentionPeriod: asset.retentionPeriod || undefined,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
            deletedAt: asset.deletedAt || undefined,
            riskCount: riskCount,
        };
    }
    async generateUniqueIdentifier() {
        const prefix = 'INFO';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
};
exports.InformationAssetService = InformationAssetService;
exports.InformationAssetService = InformationAssetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(information_asset_entity_1.InformationAsset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        asset_audit_service_1.AssetAuditService,
        risk_asset_link_service_1.RiskAssetLinkService])
], InformationAssetService);
//# sourceMappingURL=information-asset.service.js.map