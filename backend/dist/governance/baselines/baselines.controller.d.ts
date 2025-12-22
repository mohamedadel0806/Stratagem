import { BaselinesService } from './baselines.service';
import { CreateSecureBaselineDto } from './dto/create-baseline.dto';
import { BaselineQueryDto } from './dto/baseline-query.dto';
export declare class BaselinesController {
    private readonly baselinesService;
    constructor(baselinesService: BaselinesService);
    create(dto: CreateSecureBaselineDto, req: any): Promise<import("./entities/baseline.entity").SecureBaseline>;
    findAll(query: BaselineQueryDto): Promise<{
        data: import("./entities/baseline.entity").SecureBaseline[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/baseline.entity").SecureBaseline>;
    update(id: string, dto: Partial<CreateSecureBaselineDto>, req: any): Promise<import("./entities/baseline.entity").SecureBaseline>;
    remove(id: string): Promise<void>;
}
