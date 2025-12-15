import { Repository } from 'typeorm';
import { Finding } from './entities/finding.entity';
import { CreateFindingDto } from './dto/create-finding.dto';
import { FindingQueryDto } from './dto/finding-query.dto';
import { NotificationService } from '../../common/services/notification.service';
export declare class FindingsService {
    private readonly findingRepository;
    private notificationService?;
    private readonly logger;
    constructor(findingRepository: Repository<Finding>, notificationService?: NotificationService);
    create(createDto: CreateFindingDto, userId: string): Promise<Finding>;
    findAll(queryDto: FindingQueryDto): Promise<{
        data: Finding[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Finding>;
    update(id: string, updateDto: Partial<CreateFindingDto>, userId: string): Promise<Finding>;
    remove(id: string): Promise<void>;
}
