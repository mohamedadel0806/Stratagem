import { Repository } from 'typeorm';
import { UnifiedControl } from './entities/unified-control.entity';
import { CreateUnifiedControlDto } from './dto/create-unified-control.dto';
import { UnifiedControlQueryDto } from './dto/unified-control-query.dto';
import { NotificationService } from '../../common/services/notification.service';
export declare class UnifiedControlsService {
    private controlRepository;
    private notificationService?;
    private readonly logger;
    constructor(controlRepository: Repository<UnifiedControl>, notificationService?: NotificationService);
    create(createDto: CreateUnifiedControlDto, userId: string): Promise<UnifiedControl>;
    findAll(queryDto: UnifiedControlQueryDto): Promise<{
        data: UnifiedControl[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<UnifiedControl>;
    update(id: string, updateDto: Partial<CreateUnifiedControlDto>, userId: string): Promise<UnifiedControl>;
    remove(id: string): Promise<void>;
}
