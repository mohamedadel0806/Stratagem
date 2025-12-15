import { User } from '../../../users/entities/user.entity';
import { AssessmentResult } from './assessment-result.entity';
export declare enum AssessmentType {
    IMPLEMENTATION = "implementation",
    DESIGN_EFFECTIVENESS = "design_effectiveness",
    OPERATING_EFFECTIVENESS = "operating_effectiveness",
    COMPLIANCE = "compliance"
}
export declare enum AssessmentStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    UNDER_REVIEW = "under_review",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Assessment {
    id: string;
    assessment_identifier: string;
    name: string;
    description: string;
    assessment_type: AssessmentType;
    scope_description: string;
    selected_control_ids: string[];
    selected_framework_ids: string[];
    start_date: Date;
    end_date: Date;
    status: AssessmentStatus;
    lead_assessor_id: string;
    lead_assessor: User;
    assessor_ids: string[];
    controls_assessed: number;
    controls_total: number;
    findings_critical: number;
    findings_high: number;
    findings_medium: number;
    findings_low: number;
    overall_score: number;
    assessment_procedures: string;
    report_path: string;
    approved_by: string;
    approver: User;
    approval_date: Date;
    tags: string[];
    results: AssessmentResult[];
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
