import { ControlObjectivesService } from './control-objectives.service';
import { CreateControlObjectiveDto } from './dto/create-control-objective.dto';
export declare class ControlObjectivesController {
    private readonly controlObjectivesService;
    constructor(controlObjectivesService: ControlObjectivesService);
    create(createDto: CreateControlObjectiveDto, req: any): Promise<import("./entities/control-objective.entity").ControlObjective>;
    findAll(policyId?: string): Promise<import("./entities/control-objective.entity").ControlObjective[]>;
    findOne(id: string): Promise<import("./entities/control-objective.entity").ControlObjective>;
    update(id: string, updateDto: Partial<CreateControlObjectiveDto>, req: any): Promise<import("./entities/control-objective.entity").ControlObjective>;
    remove(id: string): Promise<void>;
    linkUnifiedControls(id: string, controlIds: string[]): Promise<import("./entities/control-objective.entity").ControlObjective>;
    unlinkUnifiedControls(id: string, controlIds: string[]): Promise<import("./entities/control-objective.entity").ControlObjective>;
    getUnifiedControls(id: string): Promise<import("../unified-controls/entities/unified-control.entity").UnifiedControl[]>;
}
