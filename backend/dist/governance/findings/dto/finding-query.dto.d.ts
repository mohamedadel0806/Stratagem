import { FindingSeverity, FindingStatus } from '../entities/finding.entity';
export declare class FindingQueryDto {
    page?: number;
    limit?: number;
    severity?: FindingSeverity;
    status?: FindingStatus;
    assessment_id?: string;
    unified_control_id?: string;
    remediation_owner_id?: string;
    search?: string;
    sort?: string;
}
