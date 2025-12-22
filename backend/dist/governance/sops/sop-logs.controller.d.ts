import { SOPLogsService } from './sop-logs.service';
import { CreateSOPLogDto } from './dto/create-sop-log.dto';
import { SOPLogQueryDto } from './dto/sop-log-query.dto';
export declare class SOPLogsController {
    private readonly logsService;
    constructor(logsService: SOPLogsService);
    create(dto: CreateSOPLogDto, req: any): Promise<import("./entities/sop-log.entity").SOPLog>;
    findAll(query: SOPLogQueryDto): Promise<{
        data: import("./entities/sop-log.entity").SOPLog[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getStatistics(): Promise<{
        byOutcome: any[];
    }>;
    findOne(id: string): Promise<import("./entities/sop-log.entity").SOPLog>;
    update(id: string, dto: Partial<CreateSOPLogDto>, req: any): Promise<import("./entities/sop-log.entity").SOPLog>;
    remove(id: string): Promise<void>;
}
