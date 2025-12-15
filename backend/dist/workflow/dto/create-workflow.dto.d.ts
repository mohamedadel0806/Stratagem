import { WorkflowType, WorkflowTrigger, EntityType } from '../entities/workflow.entity';
export declare class CreateWorkflowDto {
    name: string;
    description?: string;
    type: WorkflowType;
    trigger: WorkflowTrigger;
    entityType: EntityType;
    conditions?: Record<string, any>;
    actions: Record<string, any>;
    daysBeforeDeadline?: number;
}
