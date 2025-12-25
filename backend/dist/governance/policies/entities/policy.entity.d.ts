import { User } from '../../../users/entities/user.entity';
import { ControlObjective } from '../../control-objectives/entities/control-objective.entity';
import { PolicyApproval } from './policy-approval.entity';
import { PolicyVersion } from './policy-version.entity';
export declare enum PolicyStatus {
    DRAFT = "draft",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare enum ReviewFrequency {
    ANNUAL = "annual",
    BIENNIAL = "biennial",
    TRIENNIAL = "triennial",
    QUARTERLY = "quarterly",
    MONTHLY = "monthly",
    AS_NEEDED = "as_needed"
}
export declare class Policy {
    id: string;
    policy_type: string;
    title: string;
    version: string;
    version_number: number;
    content: string;
    purpose: string;
    scope: string;
    owner_id: string;
    owner: User;
    business_units: string[];
    status: PolicyStatus;
    approval_date: Date;
    effective_date: Date;
    review_frequency: ReviewFrequency;
    next_review_date: Date;
    published_date: Date;
    linked_influencers: string[];
    supersedes_policy_id: string;
    supersedes_policy: Policy;
    parent_policy_id: string;
    parent_policy: Policy;
    child_policies: Policy[];
    attachments: Array<{
        filename: string;
        path: string;
        upload_date: string;
        uploaded_by: string;
    }>;
    tags: string[];
    custom_fields: Record<string, any>;
    requires_acknowledgment: boolean;
    acknowledgment_due_days: number;
    control_objectives: ControlObjective[];
    approvals: PolicyApproval[];
    versions: PolicyVersion[];
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
