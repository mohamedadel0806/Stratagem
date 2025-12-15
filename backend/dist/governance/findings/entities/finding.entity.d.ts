import { Assessment } from '../../assessments/entities/assessment.entity';
import { AssessmentResult } from '../../assessments/entities/assessment-result.entity';
import { UnifiedControl } from '../../unified-controls/entities/unified-control.entity';
import { User } from '../../../users/entities/user.entity';
export declare enum FindingSeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    INFO = "informational"
}
export declare enum FindingStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed",
    ACCEPTED = "risk_accepted",
    REJECTED = "false_positive"
}
export declare class Finding {
    id: string;
    finding_identifier: string;
    assessment_id: string;
    assessment: Assessment;
    assessment_result_id: string;
    assessment_result: AssessmentResult;
    source_type: string;
    source_name: string;
    unified_control_id: string;
    unified_control: UnifiedControl;
    asset_type: string;
    asset_id: string;
    title: string;
    description: string;
    severity: FindingSeverity;
    finding_date: Date;
    status: FindingStatus;
    remediation_owner_id: string;
    remediation_owner: User;
    remediation_plan: string;
    remediation_due_date: Date;
    remediation_completed_date: Date;
    remediation_evidence: any;
    risk_accepted_by: string;
    risk_acceptor: User;
    risk_acceptance_justification: string;
    risk_acceptance_date: Date;
    risk_acceptance_expiry: Date;
    retest_required: boolean;
    retest_date: Date;
    retest_result: string;
    tags: string[];
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
