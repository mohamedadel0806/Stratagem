import { WorkflowTriggerRulesService } from '../services/workflow-trigger-rules.service';
import { CreateWorkflowTriggerRuleDto } from '../dto/create-trigger-rule.dto';
export declare class WorkflowTriggerRulesController {
    private readonly rulesService;
    constructor(rulesService: WorkflowTriggerRulesService);
    create(dto: CreateWorkflowTriggerRuleDto, req: any): Promise<import("../entities/workflow-trigger-rule.entity").WorkflowTriggerRule>;
    findAll(): Promise<import("../entities/workflow-trigger-rule.entity").WorkflowTriggerRule[]>;
    findOne(id: string): Promise<import("../entities/workflow-trigger-rule.entity").WorkflowTriggerRule>;
    update(id: string, dto: Partial<CreateWorkflowTriggerRuleDto>, req: any): Promise<import("../entities/workflow-trigger-rule.entity").WorkflowTriggerRule>;
    remove(id: string): Promise<void>;
}
