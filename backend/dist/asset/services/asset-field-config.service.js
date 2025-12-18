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
exports.AssetFieldConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_field_config_entity_1 = require("../entities/asset-field-config.entity");
const physical_asset_entity_1 = require("../entities/physical-asset.entity");
const information_asset_entity_1 = require("../entities/information-asset.entity");
const business_application_entity_1 = require("../entities/business-application.entity");
const software_asset_entity_1 = require("../entities/software-asset.entity");
const supplier_entity_1 = require("../entities/supplier.entity");
let AssetFieldConfigService = class AssetFieldConfigService {
    constructor(fieldConfigRepository, physicalAssetRepository, informationAssetRepository, businessApplicationRepository, softwareAssetRepository, supplierRepository) {
        this.fieldConfigRepository = fieldConfigRepository;
        this.physicalAssetRepository = physicalAssetRepository;
        this.informationAssetRepository = informationAssetRepository;
        this.businessApplicationRepository = businessApplicationRepository;
        this.softwareAssetRepository = softwareAssetRepository;
        this.supplierRepository = supplierRepository;
    }
    async create(dto, userId) {
        const existing = await this.fieldConfigRepository.findOne({
            where: {
                assetType: dto.assetType,
                fieldName: dto.fieldName,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Field ${dto.fieldName} already exists for asset type ${dto.assetType}`);
        }
        const config = this.fieldConfigRepository.create(Object.assign(Object.assign({}, dto), { createdById: userId, isEnabled: dto.isEnabled !== undefined ? dto.isEnabled : true, isRequired: dto.isRequired !== undefined ? dto.isRequired : false }));
        return this.fieldConfigRepository.save(config);
    }
    async findAll(assetType) {
        const where = assetType ? { assetType } : {};
        return this.fieldConfigRepository.find({
            where,
            relations: ['createdBy'],
            order: { displayOrder: 'ASC', createdAt: 'ASC' },
        });
    }
    async findOne(id) {
        const config = await this.fieldConfigRepository.findOne({
            where: { id },
            relations: ['createdBy'],
        });
        if (!config) {
            throw new common_1.NotFoundException(`Field config with ID ${id} not found`);
        }
        return config;
    }
    async findByAssetType(assetType) {
        return this.fieldConfigRepository.find({
            where: { assetType, isEnabled: true },
            order: { displayOrder: 'ASC', createdAt: 'ASC' },
        });
    }
    async update(id, dto) {
        const config = await this.findOne(id);
        if (dto.isEnabled === false && config.isEnabled) {
        }
        Object.assign(config, dto);
        return this.fieldConfigRepository.save(config);
    }
    async delete(id) {
        const config = await this.findOne(id);
        const hasData = await this.fieldHasData(config);
        if (hasData) {
            config.isEnabled = false;
            await this.fieldConfigRepository.save(config);
        }
        else {
            await this.fieldConfigRepository.remove(config);
        }
    }
    async validateFieldValue(assetType, fieldName, value) {
        const config = await this.fieldConfigRepository.findOne({
            where: { assetType, fieldName, isEnabled: true },
        });
        if (!config) {
            return { valid: true };
        }
        if (config.isRequired && (value === null || value === undefined || value === '')) {
            return {
                valid: false,
                message: config.validationMessage || `${config.displayName} is required`,
            };
        }
        if (config.validationRule && value) {
            const regex = new RegExp(config.validationRule);
            if (!regex.test(String(value))) {
                return {
                    valid: false,
                    message: config.validationMessage || `${config.displayName} format is invalid`,
                };
            }
        }
        if (config.fieldType === 'select' && config.selectOptions && value) {
            if (!config.selectOptions.includes(String(value))) {
                return {
                    valid: false,
                    message: `${config.displayName} must be one of: ${config.selectOptions.join(', ')}`,
                };
            }
        }
        return { valid: true };
    }
    async getFieldConfigForForm(assetType) {
        return this.fieldConfigRepository.find({
            where: { assetType, isEnabled: true },
            order: { displayOrder: 'ASC', createdAt: 'ASC' },
        });
    }
    async fieldHasData(config) {
        const fieldName = config.fieldName;
        try {
            switch (config.assetType) {
                case asset_field_config_entity_1.AssetTypeEnum.PHYSICAL: {
                    const count = await this.physicalAssetRepository
                        .createQueryBuilder('asset')
                        .where(`asset.${fieldName} IS NOT NULL`)
                        .getCount();
                    return count > 0;
                }
                case asset_field_config_entity_1.AssetTypeEnum.INFORMATION: {
                    const count = await this.informationAssetRepository
                        .createQueryBuilder('asset')
                        .where(`asset.${fieldName} IS NOT NULL`)
                        .getCount();
                    return count > 0;
                }
                case asset_field_config_entity_1.AssetTypeEnum.APPLICATION: {
                    const count = await this.businessApplicationRepository
                        .createQueryBuilder('asset')
                        .where(`asset.${fieldName} IS NOT NULL`)
                        .getCount();
                    return count > 0;
                }
                case asset_field_config_entity_1.AssetTypeEnum.SOFTWARE: {
                    const count = await this.softwareAssetRepository
                        .createQueryBuilder('asset')
                        .where(`asset.${fieldName} IS NOT NULL`)
                        .getCount();
                    return count > 0;
                }
                case asset_field_config_entity_1.AssetTypeEnum.SUPPLIER: {
                    const count = await this.supplierRepository
                        .createQueryBuilder('asset')
                        .where(`asset.${fieldName} IS NOT NULL`)
                        .getCount();
                    return count > 0;
                }
                default:
                    return false;
            }
        }
        catch (_a) {
            return false;
        }
    }
};
exports.AssetFieldConfigService = AssetFieldConfigService;
exports.AssetFieldConfigService = AssetFieldConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_field_config_entity_1.AssetFieldConfig)),
    __param(1, (0, typeorm_1.InjectRepository)(physical_asset_entity_1.PhysicalAsset)),
    __param(2, (0, typeorm_1.InjectRepository)(information_asset_entity_1.InformationAsset)),
    __param(3, (0, typeorm_1.InjectRepository)(business_application_entity_1.BusinessApplication)),
    __param(4, (0, typeorm_1.InjectRepository)(software_asset_entity_1.SoftwareAsset)),
    __param(5, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssetFieldConfigService);
//# sourceMappingURL=asset-field-config.service.js.map