import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import {
  PolicyApproval,
  ApprovalStatus,
} from '../entities/policy-approval.entity';
import { Policy, PolicyStatus } from '../entities/policy.entity';
import { User } from '../../../users/entities/user.entity';

@Injectable()
export class PolicyApprovalService {
  private readonly logger = new Logger(PolicyApprovalService.name);

  constructor(
    @InjectRepository(PolicyApproval)
    private approvalRepository: Repository<PolicyApproval>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createApproval(
    policyId: string,
    approverId: string,
    sequenceOrder: number,
  ): Promise<PolicyApproval> {
    // Validate policy exists
    const policy = await this.policyRepository.findOne({
      where: { id: policyId, deleted_at: null },
    });
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${policyId} not found`);
    }

    // Validate approver exists
    const approver = await this.userRepository.findOne({
      where: { id: approverId },
    });
    if (!approver) {
      throw new NotFoundException(`User with ID ${approverId} not found`);
    }

    // Check if approval already exists for this approver
    const existingApproval = await this.approvalRepository.findOne({
      where: { policy_id: policyId, approver_id: approverId },
    });
    if (existingApproval) {
      throw new BadRequestException(
        `An approval request already exists for this policy and approver`,
      );
    }

    const approval = this.approvalRepository.create({
      policy_id: policyId,
      approver_id: approverId,
      sequence_order: sequenceOrder,
      approval_status: ApprovalStatus.PENDING,
    });

    const savedApproval = await this.approvalRepository.save(approval);

    this.logger.log(
      `Created policy approval: ${savedApproval.id} for policy ${policyId}`,
    );

    return savedApproval;
  }

  async findApprovalsByPolicy(policyId: string): Promise<PolicyApproval[]> {
    return this.approvalRepository.find({
      where: { policy_id: policyId },
      relations: ['approver'],
      order: { sequence_order: 'ASC', created_at: 'ASC' },
    });
  }

  async findApprovalsByApprover(approverId: string): Promise<PolicyApproval[]> {
    return this.approvalRepository.find({
      where: { approver_id: approverId },
      relations: ['policy'],
      order: { created_at: 'DESC' },
    });
  }

  async findPendingApprovals(): Promise<PolicyApproval[]> {
    return this.approvalRepository.find({
      where: { approval_status: ApprovalStatus.PENDING },
      relations: ['policy', 'approver'],
      order: { created_at: 'ASC' },
    });
  }

  async approvePolicy(
    approvalId: string,
    comments?: string,
  ): Promise<PolicyApproval> {
    const approval = await this.approvalRepository.findOne({
      where: { id: approvalId },
      relations: ['policy'],
    });

    if (!approval) {
      throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    }

    if (approval.approval_status !== ApprovalStatus.PENDING) {
      throw new BadRequestException(
        `Cannot approve an approval that is already ${approval.approval_status}`,
      );
    }

    approval.approval_status = ApprovalStatus.APPROVED;
    approval.approved_at = new Date();
    if (comments) {
      approval.comments = comments;
    }

    const savedApproval = await this.approvalRepository.save(approval);

    this.logger.log(`Approved policy: ${approval.policy_id}`);

    return savedApproval;
  }

  async rejectPolicy(
    approvalId: string,
    comments?: string,
  ): Promise<PolicyApproval> {
    const approval = await this.approvalRepository.findOne({
      where: { id: approvalId },
      relations: ['policy'],
    });

    if (!approval) {
      throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    }

    if (approval.approval_status !== ApprovalStatus.PENDING) {
      throw new BadRequestException(
        `Cannot reject an approval that is already ${approval.approval_status}`,
      );
    }

    approval.approval_status = ApprovalStatus.REJECTED;
    if (comments) {
      approval.comments = comments;
    }

    const savedApproval = await this.approvalRepository.save(approval);

    // Update policy status to IN_REVIEW
    await this.policyRepository.update(approval.policy_id, {
      status: PolicyStatus.IN_REVIEW,
    });

    this.logger.log(`Rejected policy: ${approval.policy_id}`);

    return savedApproval;
  }

  async revokeApproval(approvalId: string): Promise<PolicyApproval> {
    const approval = await this.approvalRepository.findOne({
      where: { id: approvalId },
    });

    if (!approval) {
      throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    }

    if (approval.approval_status === ApprovalStatus.REVOKED) {
      throw new BadRequestException(
        'This approval has already been revoked',
      );
    }

    approval.approval_status = ApprovalStatus.REVOKED;
    const savedApproval = await this.approvalRepository.save(approval);

    this.logger.log(`Revoked approval: ${approvalId} for policy: ${approval.policy_id}`);

    return savedApproval;
  }

  async deleteApproval(approvalId: string): Promise<void> {
    const approval = await this.approvalRepository.findOne({
      where: { id: approvalId },
    });

    if (!approval) {
      throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    }

    await this.approvalRepository.remove(approval);

    this.logger.log(`Deleted approval: ${approvalId}`);
  }

  async checkAllApprovalsCompleted(policyId: string): Promise<boolean> {
    const approvals = await this.approvalRepository.find({
      where: { policy_id: policyId },
    });

    if (approvals.length === 0) {
      return true; // No approvals required
    }

    return approvals.every(
      (approval) =>
        approval.approval_status === ApprovalStatus.APPROVED ||
        approval.approval_status === ApprovalStatus.REVOKED,
    );
  }

  async hasAnyRejection(policyId: string): Promise<boolean> {
    const rejection = await this.approvalRepository.findOne({
      where: {
        policy_id: policyId,
        approval_status: ApprovalStatus.REJECTED,
      },
    });

    return !!rejection;
  }

  async getApprovalProgress(
    policyId: string,
  ): Promise<{
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  }> {
    const approvals = await this.approvalRepository.find({
      where: { policy_id: policyId },
    });

    const approved = approvals.filter(
      (a) => a.approval_status === ApprovalStatus.APPROVED,
    ).length;
    const rejected = approvals.filter(
      (a) => a.approval_status === ApprovalStatus.REJECTED,
    ).length;
    const pending = approvals.filter(
      (a) => a.approval_status === ApprovalStatus.PENDING,
    ).length;

    return {
      total: approvals.length,
      approved,
      rejected,
      pending,
    };
  }
}
