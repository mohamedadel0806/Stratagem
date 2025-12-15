import { Risk } from './risk.entity';
import { RiskAssessment } from './risk-assessment.entity';
import { User } from '../../users/entities/user.entity';
import { AssessmentType } from './risk-assessment.entity';
export declare enum RequestPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare enum RequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class RiskAssessmentRequest {
    id: string;
    request_identifier: string;
    risk_id: string;
    risk: Risk;
    requested_by_id: string;
    requested_by: User;
    requested_for_id: string;
    requested_for: User;
    assessment_type: AssessmentType;
    priority: RequestPriority;
    status: RequestStatus;
    due_date: Date;
    justification: string;
    notes: string;
    approval_workflow_id: string;
    approved_by_id: string;
    approved_by: User;
    approved_at: Date;
    rejected_by_id: string;
    rejected_by: User;
    rejected_at: Date;
    rejection_reason: string;
    completed_at: Date;
    resulting_assessment_id: string;
    resulting_assessment: RiskAssessment;
    created_at: Date;
    updated_at: Date;
}
