import { Repository } from 'typeorm';
import { Influencer } from './entities/influencer.entity';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';
import { InfluencerQueryDto } from './dto/influencer-query.dto';
import { NotificationService } from '../../common/services/notification.service';
import { InfluencerRevisionService } from './services/influencer-revision.service';
export declare class InfluencersService {
    private influencerRepository;
    private notificationService?;
    private revisionService?;
    private readonly logger;
    constructor(influencerRepository: Repository<Influencer>, notificationService?: NotificationService, revisionService?: InfluencerRevisionService);
    create(createInfluencerDto: CreateInfluencerDto, userId: string): Promise<Influencer>;
    findAll(queryDto: InfluencerQueryDto): Promise<{
        data: Influencer[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Influencer>;
    update(id: string, updateInfluencerDto: UpdateInfluencerDto, userId: string): Promise<Influencer>;
    remove(id: string): Promise<void>;
    getAllTags(): Promise<string[]>;
    getTagStatistics(): Promise<Array<{
        tag: string;
        count: number;
    }>>;
    reviewInfluencer(id: string, reviewData: {
        revision_notes?: string;
        next_review_date?: Date;
        review_frequency_days?: number;
        impact_assessment?: {
            affected_policies?: string[];
            affected_controls?: string[];
            business_units_impact?: string[];
            risk_level?: 'low' | 'medium' | 'high' | 'critical';
            notes?: string;
        };
    }, userId: string): Promise<Influencer>;
    getRevisionHistory(influencerId: string): Promise<import("./entities/influencer-revision.entity").InfluencerRevision[]>;
    bulkImport(data: Partial<Influencer>[], userId: string): Promise<{
        created: number;
        skipped: number;
        errors: string[];
    }>;
}
