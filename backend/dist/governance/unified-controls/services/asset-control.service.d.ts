import { Repository } from 'typeorm';
import { ControlAssetMapping, AssetType } from '../entities/control-asset-mapping.entity';
import { UnifiedControl, ImplementationStatus } from '../entities/unified-control.entity';
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
interface AssetComplianceScore {
    asset_id: string;
    asset_type: AssetType;
    total_controls: number;
    implemented_controls: number;
    compliance_percentage: number;
    implementation_status_breakdown: Record<ImplementationStatus, number>;
}
interface ControlEffectiveness {
    control_id: string;
    control_identifier: string;
    total_assets: number;
    average_effectiveness: number;
    implementation_status_breakdown: Record<ImplementationStatus, number>;
}
interface AssetControlMatrixRow {
    control_id: string;
    control_identifier: string;
    control_title: string;
    [key: string]: any;
}
export declare class AssetControlService {
    private mappingRepository;
    private controlRepository;
    private readonly logger;
    constructor(mappingRepository: Repository<ControlAssetMapping>, controlRepository: Repository<UnifiedControl>);
    mapControlToAsset(controlId: string, dto: CreateMappingDto, userId: string): Promise<ControlAssetMapping>;
    mapControlToAssets(controlId: string, dto: MapControlsToAssetsDto, userId: string): Promise<ControlAssetMapping[]>;
    getAssetControls(assetId: string, assetType: AssetType, page?: number, limit?: number): Promise<{
        mappings: ControlAssetMapping[];
        total: number;
    }>;
    getControlAssets(controlId: string, page?: number, limit?: number): Promise<{
        mappings: ControlAssetMapping[];
        total: number;
    }>;
    updateMapping(controlId: string, assetId: string, dto: UpdateMappingDto): Promise<ControlAssetMapping>;
    deleteMapping(controlId: string, assetId: string): Promise<void>;
    getAssetComplianceScore(assetId: string, assetType: AssetType): Promise<AssetComplianceScore>;
    getControlEffectiveness(controlId: string): Promise<ControlEffectiveness>;
    getAssetControlMatrix(assetType?: AssetType, domain?: string, status?: ImplementationStatus): Promise<AssetControlMatrixRow[]>;
    getMatrixStatistics(): Promise<{
        total_mappings: number;
        by_implementation_status: Record<ImplementationStatus, number>;
        by_asset_type: Record<AssetType, number>;
        average_effectiveness: number;
        unmapped_controls_count: number;
        unmapped_assets_count: number;
    }>;
    bulkUpdateStatus(dto: BulkUpdateStatusDto, userId: string): Promise<{
        updated: number;
    }>;
    getUnmappedControls(page?: number, limit?: number): Promise<{
        controls: UnifiedControl[];
        total: number;
    }>;
    getComprehensiveStatistics(): Promise<{
        total_controls: number;
        total_mappings: number;
        average_compliance_score: number;
        average_effectiveness_score: number;
        implementation_distribution: Record<ImplementationStatus, number>;
    }>;
    getComplianceByAssetType(): Promise<Array<{
        asset_type: AssetType;
        total_mappings: number;
        implemented: number;
        compliance_percentage: number;
    }>>;
}
export {};
