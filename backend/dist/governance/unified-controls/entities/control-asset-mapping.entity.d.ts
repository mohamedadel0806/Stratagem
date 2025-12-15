import { UnifiedControl, ImplementationStatus } from './unified-control.entity';
import { User } from '../../../users/entities/user.entity';
export declare enum AssetType {
    PHYSICAL = "physical",
    INFORMATION = "information",
    APPLICATION = "application",
    SOFTWARE = "software",
    SUPPLIER = "supplier"
}
export declare class ControlAssetMapping {
    id: string;
    unified_control_id: string;
    unified_control: UnifiedControl;
    asset_type: AssetType;
    asset_id: string;
    implementation_date: Date;
    implementation_status: ImplementationStatus;
    implementation_notes: string;
    last_test_date: Date;
    last_test_result: string;
    effectiveness_score: number;
    is_automated: boolean;
    mapped_by: string;
    mapper: User;
    mapped_at: Date;
    updated_at: Date;
}
