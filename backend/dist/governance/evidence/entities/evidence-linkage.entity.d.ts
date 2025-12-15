import { User } from '../../../users/entities/user.entity';
import { Evidence } from './evidence.entity';
export declare enum EvidenceLinkType {
    CONTROL = "control",
    ASSESSMENT = "assessment",
    FINDING = "finding",
    ASSET = "asset",
    POLICY = "policy",
    STANDARD = "standard"
}
export declare class EvidenceLinkage {
    id: string;
    evidence_id: string;
    evidence: Evidence;
    link_type: EvidenceLinkType;
    linked_entity_id: string;
    link_description: string;
    created_by: string;
    creator: User;
    created_at: Date;
}
