import { ImplementationStatus } from '../entities/unified-control.entity';
export declare class UpdateControlAssetMappingDto {
    implementation_date?: string;
    implementation_status?: ImplementationStatus;
    implementation_notes?: string;
    last_test_date?: string;
    last_test_result?: string;
    effectiveness_score?: number;
    is_automated?: boolean;
}
