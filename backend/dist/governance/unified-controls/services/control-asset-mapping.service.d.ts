import { Repository } from 'typeorm';
import { ControlAssetMapping, AssetType } from '../entities/control-asset-mapping.entity';
import { UnifiedControl } from '../entities/unified-control.entity';
import { CreateControlAssetMappingDto, BulkCreateControlAssetMappingDto } from '../dto/create-control-asset-mapping.dto';
import { UpdateControlAssetMappingDto } from '../dto/update-control-asset-mapping.dto';
import { ControlAssetMappingQueryDto } from '../dto/control-asset-mapping-query.dto';
export declare class ControlAssetMappingService {
    private mappingRepository;
    private controlRepository;
    private readonly logger;
    constructor(mappingRepository: Repository<ControlAssetMapping>, controlRepository: Repository<UnifiedControl>);
    create(controlId: string, createDto: CreateControlAssetMappingDto, userId: string): Promise<ControlAssetMapping>;
    bulkCreate(controlId: string, bulkDto: BulkCreateControlAssetMappingDto, userId: string): Promise<ControlAssetMapping[]>;
    findAll(controlId: string, queryDto: ControlAssetMappingQueryDto): Promise<ControlAssetMapping[]>;
    findOne(controlId: string, mappingId: string): Promise<ControlAssetMapping>;
    update(controlId: string, mappingId: string, updateDto: UpdateControlAssetMappingDto): Promise<ControlAssetMapping>;
    remove(controlId: string, mappingId: string): Promise<void>;
    removeByAsset(controlId: string, assetType: AssetType, assetId: string): Promise<void>;
    bulkRemove(controlId: string, mappingIds: string[]): Promise<{
        deleted: number;
        notFound: string[];
    }>;
    getAssetsByControl(controlId: string): Promise<ControlAssetMapping[]>;
    getControlsByAsset(assetType: AssetType, assetId: string): Promise<ControlAssetMapping[]>;
    linkControlsToAsset(assetType: AssetType, assetId: string, controlIds: string[], implementationStatus?: string, implementationNotes?: string, userId?: string): Promise<{
        created: ControlAssetMapping[];
        alreadyLinked: string[];
    }>;
}
