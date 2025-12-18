import { User } from '../../../users/entities/user.entity';
import { UnifiedControl } from '../../unified-controls/entities/unified-control.entity';
export declare enum SOPStatus {
    DRAFT = "draft",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare enum SOPCategory {
    OPERATIONAL = "operational",
    SECURITY = "security",
    COMPLIANCE = "compliance",
    THIRD_PARTY = "third_party"
}
export declare enum ExecutionOutcome {
    SUCCESSFUL = "successful",
    FAILED = "failed",
    PARTIALLY_COMPLETED = "partially_completed"
}
export declare class SOP {
    id: string;
    sop_identifier: string;
    title: string;
    category: SOPCategory;
    subcategory: string;
    purpose: string;
    scope: string;
    content: string;
    version: string;
    version_number: number;
    status: SOPStatus;
    owner_id: string;
    owner: User;
    review_frequency: string;
    next_review_date: Date;
    approval_date: Date;
    published_date: Date;
    linked_policies: string[];
    linked_standards: string[];
    tags: string[];
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
    controls: UnifiedControl[];
}
