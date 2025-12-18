import { Repository } from 'typeorm';
import { Standard } from './entities/standard.entity';
import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { StandardQueryDto } from './dto/standard-query.dto';
import { ControlObjective } from '../control-objectives/entities/control-objective.entity';
export declare class StandardsService {
    private standardRepository;
    private controlObjectiveRepository;
    private readonly logger;
    constructor(standardRepository: Repository<Standard>, controlObjectiveRepository: Repository<ControlObjective>);
    create(createStandardDto: CreateStandardDto, userId: string): Promise<Standard>;
    findAll(queryDto: StandardQueryDto): Promise<{
        data: Standard[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Standard>;
    update(id: string, updateStandardDto: UpdateStandardDto, userId: string): Promise<Standard>;
    remove(id: string): Promise<void>;
}
