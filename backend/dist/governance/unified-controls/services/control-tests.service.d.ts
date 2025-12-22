import { Repository } from 'typeorm';
import { ControlTest } from '../entities/control-test.entity';
import { CreateControlTestDto } from '../dto/create-control-test.dto';
import { ControlTestQueryDto } from '../dto/control-test-query.dto';
import { ControlAssetMapping } from '../entities/control-asset-mapping.entity';
export declare class ControlTestsService {
    private testRepository;
    private mappingRepository;
    private readonly logger;
    constructor(testRepository: Repository<ControlTest>, mappingRepository: Repository<ControlAssetMapping>);
    create(dto: CreateControlTestDto, userId: string): Promise<ControlTest>;
    findAll(query: ControlTestQueryDto): Promise<{
        data: ControlTest[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<ControlTest>;
    update(id: string, dto: Partial<CreateControlTestDto>, userId: string): Promise<ControlTest>;
    remove(id: string): Promise<void>;
    private updateMappingTestInfo;
}
