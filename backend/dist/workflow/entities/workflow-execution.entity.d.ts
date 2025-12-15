import { Workflow } from './workflow.entity';
import { User } from '../../users/entities/user.entity';
export declare enum WorkflowExecutionStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare class WorkflowExecution {
    id: string;
    workflowId: string;
    workflow: Workflow;
    entityType: string;
    entityId: string;
    status: WorkflowExecutionStatus;
    inputData: Record<string, any>;
    outputData: Record<string, any>;
    errorMessage: string;
    assignedToId: string;
    assignedTo: User;
    startedAt: Date;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
