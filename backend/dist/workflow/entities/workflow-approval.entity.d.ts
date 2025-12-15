import { WorkflowExecution } from './workflow-execution.entity';
import { User } from '../../users/entities/user.entity';
export declare enum ApprovalStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    CANCELLED = "cancelled"
}
export declare class WorkflowApproval {
    id: string;
    workflowExecutionId: string;
    workflowExecution: WorkflowExecution;
    approverId: string;
    approver: User;
    status: ApprovalStatus;
    comments: string;
    signatureData: string;
    signatureTimestamp: Date;
    signatureMethod: string;
    signatureMetadata: Record<string, any>;
    stepOrder: number;
    respondedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
