import { ControlTestType, ControlTestStatus, ControlTestResult } from '../entities/control-test.entity';
export declare class CreateControlTestDto {
    unified_control_id: string;
    control_asset_mapping_id?: string;
    test_type?: ControlTestType;
    test_date: string;
    status?: ControlTestStatus;
    result?: ControlTestResult;
    effectiveness_score?: number;
    test_procedure?: string;
    observations?: string;
    recommendations?: string;
    evidence_links?: Array<{
        title: string;
        url: string;
        uploaded_at: string;
    }>;
    tester_id?: string;
}
