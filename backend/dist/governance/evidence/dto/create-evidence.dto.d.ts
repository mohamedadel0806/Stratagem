import { EvidenceType, EvidenceStatus } from '../entities/evidence.entity';
export declare class CreateEvidenceDto {
    evidence_identifier: string;
    title: string;
    description?: string;
    evidence_type: EvidenceType;
    filename?: string;
    file_path: string;
    file_size?: number;
    mime_type?: string;
    file_hash?: string;
    collection_date?: string;
    valid_from_date?: string;
    valid_until_date?: string;
    collector_id?: string;
    status?: EvidenceStatus;
    approval_date?: string;
    rejection_reason?: string;
    tags?: string[];
    custom_metadata?: Record<string, any>;
    confidential?: boolean;
    restricted_to_roles?: string[];
}
