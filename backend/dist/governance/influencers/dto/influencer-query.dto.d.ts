import { InfluencerCategory, InfluencerStatus, ApplicabilityStatus } from '../entities/influencer.entity';
export declare class InfluencerQueryDto {
    page?: number;
    limit?: number;
    category?: InfluencerCategory;
    status?: InfluencerStatus;
    applicability_status?: ApplicabilityStatus;
    search?: string;
    sort?: string;
}
