import { Influencer } from './influencer.entity';
import { User } from '../../../users/entities/user.entity';
export declare enum RevisionType {
    CREATED = "created",
    UPDATED = "updated",
    STATUS_CHANGED = "status_changed",
    APPLICABILITY_CHANGED = "applicability_changed",
    REVIEWED = "reviewed",
    ARCHIVED = "archived"
}
export declare class InfluencerRevision {
    id: string;
    influencer_id: string;
    influencer: Influencer;
    revision_type: RevisionType;
    revision_notes: string;
    revision_date: Date;
    changes_summary: Record<string, {
        old: any;
        new: any;
    }>;
    impact_assessment: {
        affected_policies?: string[];
        affected_controls?: string[];
        business_units_impact?: string[];
        risk_level?: 'low' | 'medium' | 'high' | 'critical';
        notes?: string;
    };
    reviewed_by: string;
    reviewer: User;
    created_by: string;
    creator: User;
    created_at: Date;
}
