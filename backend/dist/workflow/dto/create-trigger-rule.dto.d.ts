import { EntityType, WorkflowTrigger } from '../entities/workflow.entity';
import { RuleOperator } from '../entities/workflow-trigger-rule.entity';
export declare class TriggerConditionDto {
    field: string;
    operator: RuleOperator;
    value: any;
}
export declare class CreateWorkflowTriggerRuleDto {
    name: string;
    description?: string;
    entityType: EntityType;
    trigger: WorkflowTrigger;
    conditions: TriggerConditionDto[];
    workflowId: string;
    priority?: number;
    isActive?: boolean;
}
