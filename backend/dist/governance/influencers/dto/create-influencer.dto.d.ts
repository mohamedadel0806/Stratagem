import { InfluencerCategory, InfluencerStatus, ApplicabilityStatus } from '../entities/influencer.entity';
export declare class CreateInfluencerDto {
    name: string;
    category: InfluencerCategory;
    sub_category?: string;
    issuing_authority?: string;
    jurisdiction?: string;
    reference_number?: string;
    description?: string;
    publication_date?: string;
    effective_date?: string;
    last_revision_date?: string;
    next_review_date?: string;
    status?: InfluencerStatus;
    applicability_status?: ApplicabilityStatus;
    applicability_justification?: string;
    applicability_assessment_date?: string;
    applicability_criteria?: Record<string, any>;
    source_url?: string;
    owner_id?: string;
    business_units_affected?: string[];
    tags?: string[];
    custom_fields?: Record<string, any>;
}
