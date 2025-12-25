import { AssetControlService } from './services/asset-control.service';
import { ControlAssetMapping, AssetType } from './entities/control-asset-mapping.entity';
import { ImplementationStatus } from './entities/unified-control.entity';
interface CreateMappingDto {
    asset_id: string;
    asset_type: AssetType;
    implementation_status?: ImplementationStatus;
    implementation_notes?: string;
    is_automated?: boolean;
}
interface UpdateMappingDto {
    implementation_status?: ImplementationStatus;
    implementation_notes?: string;
    last_test_date?: Date;
    last_test_result?: string;
    effectiveness_score?: number;
}
interface MapControlsToAssetsDto {
    asset_ids: string[];
    asset_type: AssetType;
}
interface BulkUpdateStatusDto {
    mapping_ids: string[];
    implementation_status: ImplementationStatus;
}
export declare class AssetControlController {
    private readonly assetControlService;
    constructor(assetControlService: AssetControlService);
    mapControlToAsset(controlId: string, dto: CreateMappingDto, req: any): Promise<ControlAssetMapping>;
    mapControlToAssets(controlId: string, dto: MapControlsToAssetsDto, req: any): Promise<ControlAssetMapping[]>;
    getAssetControls(assetId: string, assetType: AssetType, page?: string, limit?: string): Promise<{
        mappings: ControlAssetMapping[];
        total: number;
    }>;
    getControlAssets(controlId: string, page?: string, limit?: string): Promise<{
        mappings: ControlAssetMapping[];
        total: number;
    }>;
    updateMapping(controlId: string, assetId: string, dto: UpdateMappingDto): Promise<ControlAssetMapping>;
    deleteMapping(controlId: string, assetId: string): Promise<void>;
    getAssetComplianceScore(assetId: string, assetType: AssetType): Promise<any>;
    getControlEffectiveness(controlId: string): Promise<any>;
    getAssetControlMatrix(assetType?: AssetType, domain?: string, status?: ImplementationStatus): Promise<any[]>;
    getMatrixStatistics(): Promise<any>;
    bulkUpdateStatus(dto: BulkUpdateStatusDto, req: any): Promise<{
        updated: number;
    }>;
    getUnmappedControls(page?: string, limit?: string): Promise<any>;
    getComprehensiveStatistics(): Promise<any>;
    getComplianceByAssetType(): Promise<any>;
}
export {};
