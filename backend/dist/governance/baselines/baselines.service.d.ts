import { Repository } from 'typeorm';
import { SecureBaseline, BaselineRequirement } from './entities/baseline.entity';
import { CreateSecureBaselineDto } from './dto/create-baseline.dto';
import { BaselineQueryDto } from './dto/baseline-query.dto';
import { ControlObjective } from '../control-objectives/entities/control-objective.entity';
export declare class BaselinesService {
    private baselineRepository;
    private requirementRepository;
    private controlObjectiveRepository;
    private readonly logger;
    constructor(baselineRepository: Repository<SecureBaseline>, requirementRepository: Repository<BaselineRequirement>, controlObjectiveRepository: Repository<ControlObjective>);
    create(dto: CreateSecureBaselineDto, userId: string): Promise<SecureBaseline>;
    findAll(query: BaselineQueryDto): Promise<{
        data: SecureBaseline[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<SecureBaseline>;
    update(id: string, dto: Partial<CreateSecureBaselineDto>, userId: string): Promise<SecureBaseline>;
    remove(id: string): Promise<void>;
    private generateIdentifier;
}
