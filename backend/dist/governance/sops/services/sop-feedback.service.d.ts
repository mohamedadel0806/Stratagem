import { Repository } from 'typeorm';
import { SOPFeedback, FeedbackSentiment } from '../entities/sop-feedback.entity';
import { CreateSOPFeedbackDto, UpdateSOPFeedbackDto, SOPFeedbackQueryDto } from '../dto/sop-feedback.dto';
import { SOP } from '../entities/sop.entity';
export declare class SOPFeedbackService {
    private feedbackRepository;
    private sopRepository;
    private readonly logger;
    constructor(feedbackRepository: Repository<SOPFeedback>, sopRepository: Repository<SOP>);
    create(createDto: CreateSOPFeedbackDto, userId: string): Promise<SOPFeedback>;
    findAll(queryDto: SOPFeedbackQueryDto): Promise<{
        data: SOPFeedback[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<SOPFeedback>;
    update(id: string, updateDto: UpdateSOPFeedbackDto, userId: string): Promise<SOPFeedback>;
    remove(id: string): Promise<void>;
    getFeedbackForSOP(sopId: string): Promise<SOPFeedback[]>;
    getSOPFeedbackMetrics(sopId: string): Promise<{
        totalFeedback: number;
        averageEffectiveness: number;
        averageClarity: number;
        averageCompleteness: number;
        sentimentDistribution: Record<FeedbackSentiment, number>;
        issuesCount: number;
        followUpRequired: number;
    }>;
    getNegativeFeedback(): Promise<SOPFeedback[]>;
    getFeedbackNeedingFollowUp(): Promise<SOPFeedback[]>;
}
