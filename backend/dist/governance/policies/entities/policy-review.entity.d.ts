import { Policy } from './policy.entity';
import { User } from '../../../users/entities/user.entity';
export declare enum ReviewStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    DEFERRED = "deferred",
    CANCELLED = "cancelled"
}
export declare enum ReviewOutcome {
    APPROVED = "approved",
    REQUIRES_CHANGES = "requires_changes",
    SUPERSEDED = "superseded",
    ARCHIVED = "archived",
    NO_CHANGES = "no_changes"
}
export declare class PolicyReview {
    id: string;
    policy_id: string;
    policy: Policy;
    review_date: Date;
    status: ReviewStatus;
    outcome: ReviewOutcome | null;
    reviewer_id: string | null;
    reviewer: User | null;
    notes: string | null;
    review_summary: string | null;
    recommended_changes: string | null;
    next_review_date: Date | null;
    completed_at: Date | null;
    initiated_by: string | null;
    initiator: User | null;
    created_at: Date;
    updated_at: Date;
}
