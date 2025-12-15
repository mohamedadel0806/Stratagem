import { User } from '../../../users/entities/user.entity';
import { EvidenceLinkage } from './evidence-linkage.entity';
export declare enum EvidenceType {
    POLICY_DOCUMENT = "policy_document",
    CONFIGURATION_SCREENSHOT = "configuration_screenshot",
    SYSTEM_LOG = "system_log",
    SCAN_REPORT = "scan_report",
    TEST_RESULT = "test_result",
    CERTIFICATION = "certification",
    TRAINING_RECORD = "training_record",
    MEETING_MINUTES = "meeting_minutes",
    EMAIL_CORRESPONDENCE = "email_correspondence",
    CONTRACT = "contract",
    OTHER = "other"
}
export declare enum EvidenceStatus {
    DRAFT = "draft",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    EXPIRED = "expired",
    REJECTED = "rejected"
}
export declare class Evidence {
    id: string;
    evidence_identifier: string;
    title: string;
    description: string;
    evidence_type: EvidenceType;
    filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    file_hash: string;
    collection_date: Date;
    valid_from_date: Date;
    valid_until_date: Date;
    collector_id: string;
    collector: User;
    status: EvidenceStatus;
    approved_by: string;
    approver: User;
    approval_date: Date;
    rejection_reason: string;
    tags: string[];
    custom_metadata: Record<string, any>;
    confidential: boolean;
    restricted_to_roles: string[];
    linkages: EvidenceLinkage[];
    created_by: string;
    creator: User;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
