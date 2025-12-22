import { ControlTestsService } from './services/control-tests.service';
import { CreateControlTestDto } from './dto/create-control-test.dto';
import { ControlTestQueryDto } from './dto/control-test-query.dto';
export declare class ControlTestsController {
    private readonly testsService;
    constructor(testsService: ControlTestsService);
    create(dto: CreateControlTestDto, req: any): Promise<import("./entities/control-test.entity").ControlTest>;
    findAll(query: ControlTestQueryDto): Promise<{
        data: import("./entities/control-test.entity").ControlTest[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/control-test.entity").ControlTest>;
    update(id: string, dto: Partial<CreateControlTestDto>, req: any): Promise<import("./entities/control-test.entity").ControlTest>;
    remove(id: string): Promise<void>;
}
