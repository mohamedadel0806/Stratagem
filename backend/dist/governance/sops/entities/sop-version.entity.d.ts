import { User } from '../../../users/entities/user.entity';
import { SOP } from './sop.entity';
export declare enum VersionChangeType {
    MAJOR = "major",
    MINOR = "minor",
    PATCH = "patch"
}
export declare enum VersionStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    PUBLISHED = "published",
    SUPERSEDED = "superseded"
}
export declare class SOPVersion {
    id: string;
    sop_id: string;
    sop: SOP;
    version_number: string;
    change_type: VersionChangeType;
    status: VersionStatus;
    change_summary: string;
    change_details: string;
    content_snapshot: Record<string, any>;
    metadata_snapshot: Record<string, any>;
    previous_version_id: string;
    approved_by: string;
    approver: User;
    approved_at: Date;
    approval_comments: string;
    published_by: string;
    publisher: User;
    published_at: Date;
    requires_retraining: boolean;
    is_backward_compatible: boolean;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
