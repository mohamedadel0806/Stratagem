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
exports.BulkOperationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const physical_asset_entity_1 = require("../entities/physical-asset.entity");
const information_asset_entity_1 = require("../entities/information-asset.entity");
const business_application_entity_1 = require("../entities/business-application.entity");
const software_asset_entity_1 = require("../entities/software-asset.entity");
const supplier_entity_1 = require("../entities/supplier.entity");
let BulkOperationsService = class BulkOperationsService {
    constructor(physicalAssetRepository, informationAssetRepository, businessApplicationRepository, softwareAssetRepository, supplierRepository) {
        this.physicalAssetRepository = physicalAssetRepository;
        this.informationAssetRepository = informationAssetRepository;
        this.businessApplicationRepository = businessApplicationRepository;
        this.softwareAssetRepository = softwareAssetRepository;
        this.supplierRepository = supplierRepository;
    }
    async bulkUpdate(assetType, dto, userId) {
        if (!dto.assetIds || dto.assetIds.length === 0) {
            throw new common_1.BadRequestException('At least one asset ID is required');
        }
        const hasUpdates = dto.ownerId !== undefined ||
            dto.criticalityLevel !== undefined ||
            dto.complianceTags !== undefined ||
            dto.businessUnit !== undefined ||
            dto.department !== undefined;
        if (!hasUpdates) {
            throw new common_1.BadRequestException('At least one field must be provided for update');
        }
        const errors = [];
        let successful = 0;
        const repository = this.getRepository(assetType);
        const assets = await repository.find({
            where: { id: (0, typeorm_2.In)(dto.assetIds) },
        });
        for (const asset of assets) {
            try {
                const updateData = {};
                if (dto.ownerId !== undefined) {
                    if (assetType === 'information') {
                        updateData.informationOwnerId = dto.ownerId;
                    }
                    else {
                        updateData.ownerId = dto.ownerId;
                    }
                }
                if (dto.criticalityLevel !== undefined) {
                    if (assetType === 'physical' || assetType === 'application' || assetType === 'supplier') {
                        updateData.criticalityLevel = dto.criticalityLevel;
                    }
                }
                if (dto.complianceTags !== undefined) {
                    if (assetType === 'physical' || assetType === 'application' || assetType === 'information') {
                        updateData.complianceRequirements = dto.complianceTags;
                    }
                }
                if (dto.businessUnit !== undefined) {
                }
                if (dto.department !== undefined) {
                    if (assetType === 'physical') {
                        updateData.department = dto.department;
                    }
                }
                if (assetType === 'physical' || assetType === 'application' || assetType === 'software') {
                    updateData.updatedBy = userId;
                }
                await repository.update(asset.id, updateData);
                successful++;
            }
            catch (error) {
                errors.push({
                    assetId: asset.id,
                    error: error.message || 'Update failed',
                });
            }
        }
        return {
            successful,
            failed: errors.length,
            errors,
        };
    }
    async bulkDelete(assetType, assetIds) {
        if (!assetIds || assetIds.length === 0) {
            throw new common_1.BadRequestException('At least one asset ID is required');
        }
        const repository = this.getRepository(assetType);
        const errors = [];
        let successful = 0;
        for (const assetId of assetIds) {
            try {
                await repository.update(assetId, { deletedAt: new Date() });
                successful++;
            }
            catch (error) {
                errors.push({
                    assetId,
                    error: error.message || 'Delete failed',
                });
            }
        }
        return {
            successful,
            failed: errors.length,
            errors,
        };
    }
    getRepository(assetType) {
        switch (assetType) {
            case 'physical':
                return this.physicalAssetRepository;
            case 'information':
                return this.informationAssetRepository;
            case 'application':
                return this.businessApplicationRepository;
            case 'software':
                return this.softwareAssetRepository;
            case 'supplier':
                return this.supplierRepository;
            default:
                throw new common_1.BadRequestException(`Invalid asset type: ${assetType}`);
        }
    }
};
exports.BulkOperationsService = BulkOperationsService;
exports.BulkOperationsService = BulkOperationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(physical_asset_entity_1.PhysicalAsset)),
    __param(1, (0, typeorm_1.InjectRepository)(information_asset_entity_1.InformationAsset)),
    __param(2, (0, typeorm_1.InjectRepository)(business_application_entity_1.BusinessApplication)),
    __param(3, (0, typeorm_1.InjectRepository)(software_asset_entity_1.SoftwareAsset)),
    __param(4, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BulkOperationsService);
//# sourceMappingURL=bulk-operations.service.js.map