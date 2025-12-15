import { AssetTypeService } from '../services/asset-type.service';
import { AssetType, AssetCategory } from '../entities/asset-type.entity';
export declare class AssetTypeController {
    private readonly assetTypeService;
    constructor(assetTypeService: AssetTypeService);
    findAll(category?: AssetCategory): Promise<AssetType[]>;
    findOne(id: string): Promise<AssetType>;
}
