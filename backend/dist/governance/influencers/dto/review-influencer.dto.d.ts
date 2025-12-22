export declare class ReviewInfluencerDto {
    revision_notes?: string;
    next_review_date?: string;
    review_frequency_days?: number;
    impact_assessment?: {
        affected_policies?: string[];
        affected_controls?: string[];
        business_units_impact?: string[];
        risk_level?: 'low' | 'medium' | 'high' | 'critical';
        notes?: string;
    };
}
