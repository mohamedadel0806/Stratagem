import { Repository } from 'typeorm';
import { Influencer } from './entities/influencer.entity';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';
import { InfluencerQueryDto } from './dto/influencer-query.dto';
import { NotificationService } from '../../common/services/notification.service';
export declare class InfluencersService {
    private influencerRepository;
    private notificationService?;
    private readonly logger;
    constructor(influencerRepository: Repository<Influencer>, notificationService?: NotificationService);
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
}
