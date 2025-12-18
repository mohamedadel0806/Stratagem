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
exports.SupplierService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const supplier_entity_1 = require("../entities/supplier.entity");
const physical_asset_entity_1 = require("../entities/physical-asset.entity");
const asset_audit_service_1 = require("./asset-audit.service");
const asset_audit_log_entity_1 = require("../entities/asset-audit-log.entity");
const risk_asset_link_service_1 = require("../../risk/services/risk-asset-link.service");
const risk_asset_link_entity_1 = require("../../risk/entities/risk-asset-link.entity");
let SupplierService = class SupplierService {
    constructor(supplierRepository, auditService, riskAssetLinkService) {
        this.supplierRepository = supplierRepository;
        this.auditService = auditService;
        this.riskAssetLinkService = riskAssetLinkService;
    }
    async findAll(query) {
        const page = (query === null || query === void 0 ? void 0 : query.page) || 1;
        const limit = (query === null || query === void 0 ? void 0 : query.limit) || 20;
        const skip = (page - 1) * limit;
        const queryBuilder = this.supplierRepository
            .createQueryBuilder('supplier')
            .leftJoinAndSelect('supplier.owner', 'owner')
            .leftJoinAndSelect('supplier.businessUnit', 'businessUnit')
            .where('supplier.deletedAt IS NULL');
        if (query === null || query === void 0 ? void 0 : query.search) {
            queryBuilder.andWhere('(supplier.supplierName ILIKE :search OR supplier.uniqueIdentifier ILIKE :search)', { search: `%${query.search}%` });
        }
        if (query === null || query === void 0 ? void 0 : query.supplierType) {
            queryBuilder.andWhere('supplier.supplierType = :supplierType', {
                supplierType: query.supplierType,
            });
        }
        if (query === null || query === void 0 ? void 0 : query.criticalityLevel) {
            queryBuilder.andWhere('supplier.criticalityLevel = :criticalityLevel', {
                criticalityLevel: query.criticalityLevel,
            });
        }
        if (query === null || query === void 0 ? void 0 : query.businessUnit) {
            queryBuilder.andWhere('supplier.businessUnitId = :businessUnitId', {
                businessUnitId: query.businessUnit,
            });
        }
        const total = await queryBuilder.getCount();
        const suppliers = await queryBuilder
            .orderBy('supplier.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getMany();
        const assetIds = suppliers.map(a => a.id);
        const riskCounts = await this.getRiskCountsForAssets(assetIds);
        return {
            data: suppliers.map((supplier) => this.toResponseDto(supplier, riskCounts[supplier.id])),
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const supplier = await this.supplierRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['owner', 'businessUnit', 'createdByUser', 'updatedByUser'],
        });
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with ID ${id} not found`);
        }
        const riskCount = await this.getRiskCountForAsset(id);
        return this.toResponseDto(supplier, riskCount);
    }
    async create(createDto, userId) {
        let uniqueIdentifier = createDto.uniqueIdentifier;
        if (!uniqueIdentifier) {
            uniqueIdentifier = await this.generateUniqueIdentifier();
        }
        const existing = await this.supplierRepository.findOne({
            where: { uniqueIdentifier, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (existing) {
            throw new common_1.ConflictException(`Supplier with identifier ${uniqueIdentifier} already exists`);
        }
        const supplier = this.supplierRepository.create(Object.assign(Object.assign({}, createDto), { uniqueIdentifier, goodsServicesType: createDto.goodsServicesType || null, complianceCertifications: createDto.complianceCertifications || null, contractStartDate: createDto.contractStartDate ? new Date(createDto.contractStartDate) : null, contractEndDate: createDto.contractEndDate ? new Date(createDto.contractEndDate) : null, riskAssessmentDate: createDto.riskAssessmentDate ? new Date(createDto.riskAssessmentDate) : null, backgroundCheckDate: createDto.backgroundCheckDate ? new Date(createDto.backgroundCheckDate) : null, lastReviewDate: createDto.lastReviewDate ? new Date(createDto.lastReviewDate) : null, createdBy: userId, updatedBy: userId }));
        const savedSupplier = await this.supplierRepository.save(supplier);
        const reloaded = await this.supplierRepository.findOne({
            where: { id: savedSupplier.id },
            relations: ['owner', 'businessUnit'],
        });
        await this.auditService.logCreate(asset_audit_log_entity_1.AssetType.SUPPLIER, savedSupplier.id, userId);
        return this.toResponseDto(reloaded);
    }
    async update(id, updateDto, userId) {
        const supplier = await this.supplierRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with ID ${id} not found`);
        }
        if (updateDto.uniqueIdentifier && updateDto.uniqueIdentifier !== supplier.uniqueIdentifier) {
            const existing = await this.supplierRepository.findOne({
                where: { uniqueIdentifier: updateDto.uniqueIdentifier, deletedAt: (0, typeorm_2.IsNull)() },
            });
            if (existing) {
                throw new common_1.ConflictException(`Supplier with identifier ${updateDto.uniqueIdentifier} already exists`);
            }
        }
        const changes = {};
        const updateData = Object.assign(Object.assign({}, updateDto), { updatedBy: userId });
        if (updateDto.contractStartDate) {
            updateData.contractStartDate = new Date(updateDto.contractStartDate);
        }
        if (updateDto.contractEndDate) {
            updateData.contractEndDate = new Date(updateDto.contractEndDate);
        }
        if (updateDto.riskAssessmentDate) {
            updateData.riskAssessmentDate = new Date(updateDto.riskAssessmentDate);
        }
        if (updateDto.backgroundCheckDate) {
            updateData.backgroundCheckDate = new Date(updateDto.backgroundCheckDate);
        }
        if (updateDto.lastReviewDate) {
            updateData.lastReviewDate = new Date(updateDto.lastReviewDate);
        }
        Object.keys(updateData).forEach((key) => {
            if (key !== 'updatedBy' && supplier[key] !== updateData[key]) {
                changes[key] = {
                    old: supplier[key],
                    new: updateData[key],
                };
            }
        });
        Object.assign(supplier, updateData);
        const savedSupplier = await this.supplierRepository.save(supplier);
        const reloaded = await this.supplierRepository.findOne({
            where: { id: savedSupplier.id },
            relations: ['owner', 'businessUnit'],
        });
        if (Object.keys(changes).length > 0) {
            await this.auditService.logUpdate(asset_audit_log_entity_1.AssetType.SUPPLIER, id, changes, userId);
        }
        return this.toResponseDto(reloaded);
    }
    async remove(id, userId) {
        const supplier = await this.supplierRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with ID ${id} not found`);
        }
        await this.auditService.logDelete(asset_audit_log_entity_1.AssetType.SUPPLIER, id, userId);
        supplier.deletedAt = new Date();
        await this.supplierRepository.save(supplier);
    }
    async getRiskCountForAsset(assetId) {
        const links = await this.riskAssetLinkService.findByAsset(risk_asset_link_entity_1.RiskAssetType.SUPPLIER, assetId);
        return links.length;
    }
    async getRiskCountsForAssets(assetIds) {
        if (assetIds.length === 0)
            return {};
        const counts = {};
        for (const assetId of assetIds) {
            const links = await this.riskAssetLinkService.findByAsset(risk_asset_link_entity_1.RiskAssetType.SUPPLIER, assetId);
            counts[assetId] = links.length;
        }
        return counts;
    }
    getContractStatus(contractEndDate, autoRenewal) {
        if (!contractEndDate) {
            return 'no_contract';
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(contractEndDate);
        endDate.setHours(0, 0, 0, 0);
        if (endDate < today) {
            return 'expired';
        }
        const daysUntilExpiration = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiration <= 90 && !autoRenewal) {
            return 'pending_renewal';
        }
        return 'active';
    }
    async getCriticalSuppliersReport() {
        const suppliers = await this.supplierRepository
            .createQueryBuilder('supplier')
            .leftJoin('supplier.owner', 'owner')
            .leftJoin('supplier.businessUnit', 'businessUnit')
            .select([
            'supplier.id',
            'supplier.supplierName',
            'supplier.uniqueIdentifier',
            'supplier.criticalityLevel',
            'supplier.riskAssessmentDate',
            'supplier.lastReviewDate',
            'supplier.riskLevel',
            'supplier.ownerId',
            'supplier.businessUnitId',
            'supplier.createdAt',
            'supplier.updatedAt',
            'owner.id',
            'owner.email',
            'owner.firstName',
            'owner.lastName',
            'businessUnit.id',
            'businessUnit.name',
        ])
            .where('supplier.deletedAt IS NULL')
            .andWhere('supplier.criticalityLevel IN (:...levels)', {
            levels: [physical_asset_entity_1.CriticalityLevel.CRITICAL, physical_asset_entity_1.CriticalityLevel.HIGH],
        })
            .orderBy('supplier.criticalityLevel', 'DESC')
            .addOrderBy('supplier.riskAssessmentDate', 'ASC', 'NULLS FIRST')
            .getMany();
        const assetIds = suppliers.map(a => a.id);
        const riskCounts = await this.getRiskCountsForAssets(assetIds);
        return suppliers.map((supplier) => this.toResponseDto(supplier, riskCounts[supplier.id]));
    }
    async getExpiringContracts(days = 90) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + days);
        const suppliers = await this.supplierRepository
            .createQueryBuilder('supplier')
            .leftJoin('supplier.owner', 'owner')
            .leftJoin('supplier.businessUnit', 'businessUnit')
            .select([
            'supplier.id',
            'supplier.supplierName',
            'supplier.uniqueIdentifier',
            'supplier.contractReference',
            'supplier.contractStartDate',
            'supplier.contractEndDate',
            'supplier.autoRenewal',
            'supplier.ownerId',
            'supplier.businessUnitId',
            'supplier.createdAt',
            'supplier.updatedAt',
            'owner.id',
            'owner.email',
            'owner.firstName',
            'owner.lastName',
            'businessUnit.id',
            'businessUnit.name',
        ])
            .where('supplier.deletedAt IS NULL')
            .andWhere('supplier.contractEndDate IS NOT NULL')
            .andWhere('supplier.contractEndDate >= :today', { today })
            .andWhere('supplier.contractEndDate <= :futureDate', { futureDate })
            .orderBy('supplier.contractEndDate', 'ASC')
            .getMany();
        const assetIds = suppliers.map(a => a.id);
        const riskCounts = await this.getRiskCountsForAssets(assetIds);
        return suppliers.map((supplier) => this.toResponseDto(supplier, riskCounts[supplier.id]));
    }
    toResponseDto(supplier, riskCount) {
        const contractStatus = this.getContractStatus(supplier.contractEndDate, supplier.autoRenewal);
        return {
            id: supplier.id,
            uniqueIdentifier: supplier.uniqueIdentifier,
            supplierName: supplier.supplierName,
            supplierType: supplier.supplierType || undefined,
            businessPurpose: supplier.businessPurpose || undefined,
            ownerId: supplier.ownerId || undefined,
            owner: supplier.owner
                ? {
                    id: supplier.owner.id,
                    email: supplier.owner.email,
                    firstName: supplier.owner.firstName || undefined,
                    lastName: supplier.owner.lastName || undefined,
                }
                : undefined,
            businessUnitId: supplier.businessUnitId || undefined,
            businessUnit: supplier.businessUnit
                ? {
                    id: supplier.businessUnit.id,
                    name: supplier.businessUnit.name,
                    code: supplier.businessUnit.code || undefined,
                }
                : undefined,
            goodsServicesType: Array.isArray(supplier.goodsServicesType) ? supplier.goodsServicesType : undefined,
            criticalityLevel: supplier.criticalityLevel || undefined,
            contractReference: supplier.contractReference || undefined,
            contractStartDate: supplier.contractStartDate || undefined,
            contractEndDate: supplier.contractEndDate || undefined,
            contractValue: supplier.contractValue || undefined,
            currency: supplier.currency || undefined,
            autoRenewal: supplier.autoRenewal || undefined,
            primaryContact: supplier.primaryContact || undefined,
            secondaryContact: supplier.secondaryContact || undefined,
            taxId: supplier.taxId || undefined,
            registrationNumber: supplier.registrationNumber || undefined,
            address: supplier.address || undefined,
            country: supplier.country || undefined,
            website: supplier.website || undefined,
            riskAssessmentDate: supplier.riskAssessmentDate || undefined,
            riskLevel: supplier.riskLevel || undefined,
            complianceCertifications: Array.isArray(supplier.complianceCertifications) ? supplier.complianceCertifications : undefined,
            insuranceVerified: supplier.insuranceVerified || undefined,
            backgroundCheckDate: supplier.backgroundCheckDate || undefined,
            performanceRating: supplier.performanceRating || undefined,
            lastReviewDate: supplier.lastReviewDate || undefined,
            createdAt: supplier.createdAt,
            updatedAt: supplier.updatedAt,
            deletedAt: supplier.deletedAt || undefined,
            riskCount: riskCount,
            contractStatus: contractStatus,
        };
    }
    async generateUniqueIdentifier() {
        const prefix = 'SUP';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
};
exports.SupplierService = SupplierService;
exports.SupplierService = SupplierService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        asset_audit_service_1.AssetAuditService,
        risk_asset_link_service_1.RiskAssetLinkService])
], SupplierService);
//# sourceMappingURL=supplier.service.js.map