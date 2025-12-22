import { Repository } from 'typeorm';
import { InfluencerRevision, RevisionType } from '../entities/influencer-revision.entity';
import { Influencer } from '../entities/influencer.entity';
export declare class InfluencerRevisionService {
    private revisionRepository;
    constructor(revisionRepository: Repository<InfluencerRevision>);
    createRevision(influencer: Influencer, revisionType: RevisionType, userId: string, revisionNotes?: string, changesSummary?: Record<string, {
        old: any;
        new: any;
    }>, impactAssessment?: {
        affected_policies?: string[];
        affected_controls?: string[];
        business_units_impact?: string[];
        risk_level?: 'low' | 'medium' | 'high' | 'critical';
        notes?: string;
    }): Promise<InfluencerRevision>;
    getRevisionHistory(influencerId: string): Promise<InfluencerRevision[]>;
    getRevision(id: string): Promise<InfluencerRevision>;
    getLatestRevision(influencerId: string): Promise<InfluencerRevision | null>;
}
