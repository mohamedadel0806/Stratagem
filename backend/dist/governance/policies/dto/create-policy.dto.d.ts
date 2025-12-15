import { PolicyStatus, ReviewFrequency } from '../entities/policy.entity';
export declare class CreatePolicyDto {
    policy_type: string;
    title: string;
    content?: string;
    purpose?: string;
    scope?: string;
    owner_id?: string;
    business_units?: string[];
    status?: PolicyStatus;
    approval_date?: string;
    effective_date?: string;
    review_frequency?: ReviewFrequency;
    next_review_date?: string;
    linked_influencers?: string[];
    supersedes_policy_id?: string;
    attachments?: Array<{
        filename: string;
        path: string;
        upload_date: string;
        uploaded_by: string;
    }>;
    tags?: string[];
    custom_fields?: Record<string, any>;
    requires_acknowledgment?: boolean;
    acknowledgment_due_days?: number;
}
