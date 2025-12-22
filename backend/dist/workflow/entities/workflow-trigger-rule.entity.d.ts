import { User } from '../../users/entities/user.entity';
import { Workflow } from './workflow.entity';
import { EntityType, WorkflowTrigger } from './workflow.entity';
export declare enum RuleOperator {
    EQUALS = "eq",
    NOT_EQUALS = "neq",
    GREATER_THAN = "gt",
    LESS_THAN = "lt",
    CONTAINS = "contains",
    IN = "in"
}
export declare class WorkflowTriggerRule {
    id: string;
    name: string;
    description: string;
    entityType: EntityType;
    trigger: WorkflowTrigger;
    conditions: Array<{
        field: string;
        operator: RuleOperator;
        value: any;
    }>;
    workflowId: string;
    workflow: Workflow;
    priority: number;
    isActive: boolean;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
