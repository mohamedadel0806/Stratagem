import { AssetType } from '../entities/control-asset-mapping.entity';
import { ImplementationStatus } from '../entities/unified-control.entity';
export declare class ControlAssetMappingQueryDto {
    asset_type?: AssetType;
    asset_id?: string;
    implementation_status?: ImplementationStatus;
}
