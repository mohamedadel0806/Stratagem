import { Repository } from 'typeorm';
import { AssetType, AssetCategory } from '../entities/asset-type.entity';
export declare class AssetTypeService {
    private assetTypeRepository;
    constructor(assetTypeRepository: Repository<AssetType>);
    findAll(category?: AssetCategory): Promise<AssetType[]>;
    findOne(id: string): Promise<AssetType>;
}
