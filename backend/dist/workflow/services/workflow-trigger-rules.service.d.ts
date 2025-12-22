import { Repository } from 'typeorm';
import { WorkflowTriggerRule } from '../entities/workflow-trigger-rule.entity';
import { CreateWorkflowTriggerRuleDto } from '../dto/create-trigger-rule.dto';
import { EntityType, WorkflowTrigger } from '../entities/workflow.entity';
export declare class WorkflowTriggerRulesService {
    private ruleRepository;
    private readonly logger;
    constructor(ruleRepository: Repository<WorkflowTriggerRule>);
    create(dto: CreateWorkflowTriggerRuleDto, userId: string): Promise<WorkflowTriggerRule>;
    findAll(): Promise<WorkflowTriggerRule[]>;
    findOne(id: string): Promise<WorkflowTriggerRule>;
    update(id: string, dto: Partial<CreateWorkflowTriggerRuleDto>, userId: string): Promise<WorkflowTriggerRule>;
    remove(id: string): Promise<void>;
    getMatchingWorkflows(entityType: EntityType, trigger: WorkflowTrigger, entityData: Record<string, any>): Promise<string[]>;
    private evaluateRule;
}
