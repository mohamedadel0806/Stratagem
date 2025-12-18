import { Repository } from 'typeorm';
import { AssetFieldConfig, AssetTypeEnum } from '../entities/asset-field-config.entity';
import { CreateAssetFieldConfigDto } from '../dto/create-asset-field-config.dto';
import { UpdateAssetFieldConfigDto } from '../dto/update-asset-field-config.dto';
import { PhysicalAsset } from '../entities/physical-asset.entity';
import { InformationAsset } from '../entities/information-asset.entity';
import { BusinessApplication } from '../entities/business-application.entity';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { Supplier } from '../entities/supplier.entity';
export declare class AssetFieldConfigService {
    private fieldConfigRepository;
    private physicalAssetRepository;
    private informationAssetRepository;
    private businessApplicationRepository;
    private softwareAssetRepository;
    private supplierRepository;
    constructor(fieldConfigRepository: Repository<AssetFieldConfig>, physicalAssetRepository: Repository<PhysicalAsset>, informationAssetRepository: Repository<InformationAsset>, businessApplicationRepository: Repository<BusinessApplication>, softwareAssetRepository: Repository<SoftwareAsset>, supplierRepository: Repository<Supplier>);
    create(dto: CreateAssetFieldConfigDto, userId: string): Promise<AssetFieldConfig>;
    findAll(assetType?: AssetTypeEnum): Promise<AssetFieldConfig[]>;
    findOne(id: string): Promise<AssetFieldConfig>;
    findByAssetType(assetType: AssetTypeEnum): Promise<AssetFieldConfig[]>;
    update(id: string, dto: UpdateAssetFieldConfigDto): Promise<AssetFieldConfig>;
    delete(id: string): Promise<void>;
    validateFieldValue(assetType: AssetTypeEnum, fieldName: string, value: any): Promise<{
        valid: boolean;
        message?: string;
    }>;
    getFieldConfigForForm(assetType: AssetTypeEnum): Promise<AssetFieldConfig[]>;
    private fieldHasData;
}
