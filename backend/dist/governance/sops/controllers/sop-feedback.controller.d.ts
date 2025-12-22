import { SOPFeedbackService } from '../services/sop-feedback.service';
import { CreateSOPFeedbackDto, UpdateSOPFeedbackDto, SOPFeedbackQueryDto } from '../dto/sop-feedback.dto';
export declare class SOPFeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: SOPFeedbackService);
    create(createDto: CreateSOPFeedbackDto, req: any): Promise<import("../entities/sop-feedback.entity").SOPFeedback>;
    findAll(queryDto: SOPFeedbackQueryDto): Promise<{
        data: import("../entities/sop-feedback.entity").SOPFeedback[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getFeedbackForSOP(sopId: string): Promise<import("../entities/sop-feedback.entity").SOPFeedback[]>;
    getMetrics(sopId: string): Promise<{
        totalFeedback: number;
        averageEffectiveness: number;
        averageClarity: number;
        averageCompleteness: number;
        sentimentDistribution: Record<import("../entities/sop-feedback.entity").FeedbackSentiment, number>;
        issuesCount: number;
        followUpRequired: number;
    }>;
    getNegative(): Promise<import("../entities/sop-feedback.entity").SOPFeedback[]>;
    getFollowUp(): Promise<import("../entities/sop-feedback.entity").SOPFeedback[]>;
    findOne(id: string): Promise<import("../entities/sop-feedback.entity").SOPFeedback>;
    update(id: string, updateDto: UpdateSOPFeedbackDto, req: any): Promise<import("../entities/sop-feedback.entity").SOPFeedback>;
    remove(id: string): Promise<void>;
}
