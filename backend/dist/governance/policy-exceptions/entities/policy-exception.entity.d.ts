import { User } from '../../../users/entities/user.entity';
import { BusinessUnit } from '../../../common/entities/business-unit.entity';
export declare enum ExceptionStatus {
    REQUESTED = "requested",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired",
    REVOKED = "revoked"
}
export declare enum ExceptionType {
    POLICY = "policy",
    STANDARD = "standard",
    CONTROL = "control",
    BASELINE = "baseline"
}
export declare class PolicyException {
    id: string;
    exception_identifier: string;
    exception_type: ExceptionType | null;
    entity_id: string;
    entity_type: string | null;
    requested_by: string | null;
    requester: User | null;
    requesting_business_unit_id: string | null;
    requesting_business_unit: BusinessUnit | null;
    request_date: Date;
    business_justification: string;
    compensating_controls: string | null;
    risk_assessment: string | null;
    start_date: Date | null;
    end_date: Date | null;
    auto_expire: boolean;
    status: ExceptionStatus;
    approved_by: string | null;
    approver: User | null;
    approval_date: Date | null;
    approval_conditions: string | null;
    rejection_reason: string | null;
    last_review_date: Date | null;
    next_review_date: Date | null;
    supporting_documents: Record<string, any> | null;
    created_at: Date;
    updated_by: string | null;
    updater: User | null;
    updated_at: Date;
    deleted_at: Date | null;
}
