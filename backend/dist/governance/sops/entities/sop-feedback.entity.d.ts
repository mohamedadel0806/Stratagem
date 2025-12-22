import { User } from '../../../users/entities/user.entity';
import { SOP } from './sop.entity';
export declare enum FeedbackSentiment {
    VERY_POSITIVE = "very_positive",
    POSITIVE = "positive",
    NEUTRAL = "neutral",
    NEGATIVE = "negative",
    VERY_NEGATIVE = "very_negative"
}
export declare class SOPFeedback {
    id: string;
    sop_id: string;
    sop: SOP;
    submitted_by: string;
    submitter: User;
    sentiment: FeedbackSentiment;
    effectiveness_rating: number | null;
    clarity_rating: number | null;
    completeness_rating: number | null;
    comments: string;
    improvement_suggestions: string;
    tagged_issues: string[] | null;
    follow_up_required: boolean;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
