import { StandardsService } from './standards.service';
import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { StandardQueryDto } from './dto/standard-query.dto';
export declare class StandardsController {
    private readonly standardsService;
    constructor(standardsService: StandardsService);
    create(createStandardDto: CreateStandardDto, req: any): Promise<import("./entities/standard.entity").Standard>;
    findAll(queryDto: StandardQueryDto): Promise<{
        data: import("./entities/standard.entity").Standard[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/standard.entity").Standard>;
    update(id: string, updateStandardDto: UpdateStandardDto, req: any): Promise<import("./entities/standard.entity").Standard>;
    remove(id: string): Promise<void>;
}
