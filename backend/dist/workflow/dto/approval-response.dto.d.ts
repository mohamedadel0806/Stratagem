import { ApprovalStatus } from '../entities/workflow-approval.entity';
export declare class ApprovalResponseDto {
    id: string;
    workflowExecutionId: string;
    approverId: string;
    approverName: string;
    status: ApprovalStatus;
    comments?: string;
    stepOrder: number;
    respondedAt?: string;
    createdAt: string;
}
