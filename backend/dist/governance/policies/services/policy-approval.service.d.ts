import { Repository } from 'typeorm';
import { PolicyApproval } from '../entities/policy-approval.entity';
import { Policy } from '../entities/policy.entity';
import { User } from '../../../users/entities/user.entity';
export declare class PolicyApprovalService {
    private approvalRepository;
    private policyRepository;
    private userRepository;
    private readonly logger;
    constructor(approvalRepository: Repository<PolicyApproval>, policyRepository: Repository<Policy>, userRepository: Repository<User>);
    createApproval(policyId: string, approverId: string, sequenceOrder: number): Promise<PolicyApproval>;
    findApprovalsByPolicy(policyId: string): Promise<PolicyApproval[]>;
    findApprovalsByApprover(approverId: string): Promise<PolicyApproval[]>;
    findPendingApprovals(): Promise<PolicyApproval[]>;
    approvePolicy(approvalId: string, comments?: string): Promise<PolicyApproval>;
    rejectPolicy(approvalId: string, comments?: string): Promise<PolicyApproval>;
    revokeApproval(approvalId: string): Promise<PolicyApproval>;
    deleteApproval(approvalId: string): Promise<void>;
    checkAllApprovalsCompleted(policyId: string): Promise<boolean>;
    hasAnyRejection(policyId: string): Promise<boolean>;
    getApprovalProgress(policyId: string): Promise<{
        total: number;
        approved: number;
        rejected: number;
        pending: number;
    }>;
}
