import { Repository } from 'typeorm';
import { AssetFieldConfig, AssetTypeEnum } from '../entities/asset-field-config.entity';
import { CreateAssetFieldConfigDto } from '../dto/create-asset-field-config.dto';
import { UpdateAssetFieldConfigDto } from '../dto/update-asset-field-config.dto';
export declare class AssetFieldConfigService {
    private fieldConfigRepository;
    constructor(fieldConfigRepository: Repository<AssetFieldConfig>);
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
}
