import { User } from '../../../users/entities/user.entity';
import { UnifiedControl } from './unified-control.entity';
import { ControlAssetMapping } from './control-asset-mapping.entity';
export declare enum ControlTestType {
    DESIGN = "design",
    OPERATING = "operating",
    TECHNICAL = "technical",
    MANAGEMENT = "management"
}
export declare enum ControlTestStatus {
    PLANNED = "planned",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum ControlTestResult {
    PASS = "pass",
    FAIL = "fail",
    INCONCLUSIVE = "inconclusive",
    NOT_APPLICABLE = "not_applicable"
}
export declare class ControlTest {
    id: string;
    unified_control_id: string;
    unified_control: UnifiedControl;
    control_asset_mapping_id: string | null;
    control_asset_mapping: ControlAssetMapping | null;
    test_type: ControlTestType;
    test_date: Date;
    status: ControlTestStatus;
    result: ControlTestResult | null;
    effectiveness_score: number | null;
    test_procedure: string;
    observations: string;
    recommendations: string;
    evidence_links: Array<{
        title: string;
        url: string;
        uploaded_at: string;
    }>;
    tester_id: string | null;
    tester: User | null;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
