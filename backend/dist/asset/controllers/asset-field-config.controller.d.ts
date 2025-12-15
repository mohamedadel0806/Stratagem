import { AssetFieldConfigService } from '../services/asset-field-config.service';
import { CreateAssetFieldConfigDto } from '../dto/create-asset-field-config.dto';
import { UpdateAssetFieldConfigDto } from '../dto/update-asset-field-config.dto';
import { AssetFieldConfigResponseDto } from '../dto/asset-field-config-response.dto';
import { AssetTypeEnum } from '../entities/asset-field-config.entity';
import { User } from '../../users/entities/user.entity';
export declare class AssetFieldConfigController {
    private readonly fieldConfigService;
    constructor(fieldConfigService: AssetFieldConfigService);
    create(dto: CreateAssetFieldConfigDto, user: User): Promise<AssetFieldConfigResponseDto>;
    findAll(assetType?: AssetTypeEnum): Promise<AssetFieldConfigResponseDto[]>;
    getForForm(assetType: AssetTypeEnum): Promise<AssetFieldConfigResponseDto[]>;
    findOne(id: string): Promise<AssetFieldConfigResponseDto>;
    update(id: string, dto: UpdateAssetFieldConfigDto): Promise<AssetFieldConfigResponseDto>;
    delete(id: string): Promise<void>;
    validate(body: {
        assetType: AssetTypeEnum;
        fieldName: string;
        value: any;
    }): Promise<{
        valid: boolean;
        message?: string;
    }>;
    private mapToResponseDto;
}
