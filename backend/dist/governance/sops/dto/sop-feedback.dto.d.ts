import { FeedbackSentiment } from '../entities/sop-feedback.entity';
export declare class CreateSOPFeedbackDto {
    sop_id: string;
    sentiment?: FeedbackSentiment;
    effectiveness_rating?: number;
    clarity_rating?: number;
    completeness_rating?: number;
    comments?: string;
    improvement_suggestions?: string;
    tagged_issues?: string[];
    follow_up_required?: boolean;
}
export declare class UpdateSOPFeedbackDto {
    sentiment?: FeedbackSentiment;
    effectiveness_rating?: number;
    clarity_rating?: number;
    completeness_rating?: number;
    comments?: string;
    improvement_suggestions?: string;
    tagged_issues?: string[];
    follow_up_required?: boolean;
}
export declare class SOPFeedbackQueryDto {
    sop_id?: string;
    sentiment?: FeedbackSentiment;
    follow_up_required?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
}
