import { AssetType } from '../entities/control-asset-mapping.entity';
import { ImplementationStatus } from '../entities/unified-control.entity';
export declare class CreateControlAssetMappingDto {
    asset_type: AssetType;
    asset_id: string;
    implementation_date?: string;
    implementation_status?: ImplementationStatus;
    implementation_notes?: string;
    last_test_date?: string;
    last_test_result?: string;
    effectiveness_score?: number;
    is_automated?: boolean;
}
export declare class BulkCreateControlAssetMappingDto {
    asset_type: AssetType;
    asset_ids: string[];
    implementation_date?: string;
    implementation_status?: ImplementationStatus;
    implementation_notes?: string;
}
