import { Policy } from './policy.entity';
import { User } from '../../../users/entities/user.entity';
export declare enum ApprovalStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    REVOKED = "revoked"
}
export declare class PolicyApproval {
    id: string;
    policy_id: string;
    policy: Policy;
    approver_id: string;
    approver: User;
    approval_status: ApprovalStatus;
    sequence_order: number;
    comments: string;
    created_at: Date;
    approved_at: Date;
}
