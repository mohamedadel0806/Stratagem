import { User } from '../../../users/entities/user.entity';
export declare enum InfluencerCategory {
    INTERNAL = "internal",
    CONTRACTUAL = "contractual",
    STATUTORY = "statutory",
    REGULATORY = "regulatory",
    INDUSTRY_STANDARD = "industry_standard"
}
export declare enum InfluencerStatus {
    ACTIVE = "active",
    PENDING = "pending",
    SUPERSEDED = "superseded",
    RETIRED = "retired"
}
export declare enum ApplicabilityStatus {
    APPLICABLE = "applicable",
    NOT_APPLICABLE = "not_applicable",
    UNDER_REVIEW = "under_review"
}
export declare class Influencer {
    id: string;
    name: string;
    category: InfluencerCategory;
    sub_category: string;
    issuing_authority: string;
    jurisdiction: string;
    reference_number: string;
    description: string;
    publication_date: Date;
    effective_date: Date;
    last_revision_date: Date;
    revision_notes: string;
    next_review_date: Date;
    review_frequency_days: number;
    status: InfluencerStatus;
    applicability_status: ApplicabilityStatus;
    applicability_justification: string;
    applicability_assessment_date: Date;
    applicability_criteria: Record<string, any>;
    source_url: string;
    source_document_path: string;
    owner_id: string;
    owner: User;
    business_units_affected: string[];
    tags: string[];
    custom_fields: Record<string, any>;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
