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
}
