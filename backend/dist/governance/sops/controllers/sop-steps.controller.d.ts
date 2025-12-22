import { SOPStepsService } from '../services/sop-steps.service';
import { CreateSOPStepDto, UpdateSOPStepDto, SOPStepQueryDto } from '../dto/sop-step.dto';
export declare class SOPStepsController {
    private readonly stepsService;
    constructor(stepsService: SOPStepsService);
    create(createDto: CreateSOPStepDto, req: any): Promise<import("../entities/sop-step.entity").SOPStep>;
    findAll(queryDto: SOPStepQueryDto): Promise<{
        data: import("../entities/sop-step.entity").SOPStep[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getStepsForSOP(sopId: string): Promise<import("../entities/sop-step.entity").SOPStep[]>;
    getCritical(sopId: string): Promise<import("../entities/sop-step.entity").SOPStep[]>;
    getTotalDuration(sopId: string): Promise<number>;
    findOne(id: string): Promise<import("../entities/sop-step.entity").SOPStep>;
    update(id: string, updateDto: UpdateSOPStepDto, req: any): Promise<import("../entities/sop-step.entity").SOPStep>;
    reorder(sopId: string, body: {
        step_ids: string[];
    }, req: any): Promise<import("../entities/sop-step.entity").SOPStep[]>;
    remove(id: string): Promise<void>;
}
