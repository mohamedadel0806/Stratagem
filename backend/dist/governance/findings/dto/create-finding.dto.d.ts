import { FindingSeverity, FindingStatus } from '../entities/finding.entity';
export declare class CreateFindingDto {
    finding_identifier: string;
    assessment_id?: string;
    assessment_result_id?: string;
    source_type?: string;
    source_name?: string;
    unified_control_id?: string;
    asset_type?: string;
    asset_id?: string;
    title: string;
    description: string;
    severity: FindingSeverity;
    finding_date?: string;
    status?: FindingStatus;
    remediation_owner_id?: string;
    remediation_plan?: string;
    remediation_due_date?: string;
    remediation_completed_date?: string;
    remediation_evidence?: any;
    risk_accepted_by?: string;
    risk_acceptance_justification?: string;
    risk_acceptance_date?: string;
    risk_acceptance_expiry?: string;
    retest_required?: boolean;
    retest_date?: string;
    retest_result?: string;
    tags?: string[];
}
