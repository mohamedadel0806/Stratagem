import { Repository } from 'typeorm';
import { SOPStep } from '../entities/sop-step.entity';
import { CreateSOPStepDto, UpdateSOPStepDto, SOPStepQueryDto } from '../dto/sop-step.dto';
import { SOP } from '../entities/sop.entity';
export declare class SOPStepsService {
    private stepRepository;
    private sopRepository;
    private readonly logger;
    constructor(stepRepository: Repository<SOPStep>, sopRepository: Repository<SOP>);
    create(createDto: CreateSOPStepDto, userId: string): Promise<SOPStep>;
    findAll(queryDto: SOPStepQueryDto): Promise<{
        data: SOPStep[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<SOPStep>;
    update(id: string, updateDto: UpdateSOPStepDto, userId: string): Promise<SOPStep>;
    remove(id: string): Promise<void>;
    getStepsForSOP(sopId: string): Promise<SOPStep[]>;
    getCriticalSteps(sopId: string): Promise<SOPStep[]>;
    reorderSteps(sopId: string, stepIds: string[], userId: string): Promise<SOPStep[]>;
    getTotalEstimatedDuration(sopId: string): Promise<number>;
}
