import { WorkflowType, WorkflowStatus, WorkflowTrigger, EntityType } from '../entities/workflow.entity';
export declare class WorkflowResponseDto {
    id: string;
    name: string;
    description?: string;
    type: WorkflowType;
    status: WorkflowStatus;
    trigger: WorkflowTrigger;
    entityType: EntityType;
    conditions?: Record<string, any>;
    actions: Record<string, any>;
    daysBeforeDeadline?: number;
    createdAt: string;
    updatedAt: string;
}
