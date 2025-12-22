import { Repository } from 'typeorm';
import { SOPLog } from './entities/sop-log.entity';
import { CreateSOPLogDto } from './dto/create-sop-log.dto';
import { SOPLogQueryDto } from './dto/sop-log-query.dto';
export declare class SOPLogsService {
    private logRepository;
    private readonly logger;
    constructor(logRepository: Repository<SOPLog>);
    create(dto: CreateSOPLogDto, userId: string): Promise<SOPLog>;
    findAll(query: SOPLogQueryDto): Promise<{
        data: SOPLog[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<SOPLog>;
    update(id: string, dto: Partial<CreateSOPLogDto>, userId: string): Promise<SOPLog>;
    remove(id: string): Promise<void>;
    getStatistics(): Promise<{
        byOutcome: any[];
    }>;
}
