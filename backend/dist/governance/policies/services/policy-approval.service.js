"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PolicyApprovalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyApprovalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const policy_approval_entity_1 = require("../entities/policy-approval.entity");
const policy_entity_1 = require("../entities/policy.entity");
const user_entity_1 = require("../../../users/entities/user.entity");
let PolicyApprovalService = PolicyApprovalService_1 = class PolicyApprovalService {
    constructor(approvalRepository, policyRepository, userRepository) {
        this.approvalRepository = approvalRepository;
        this.policyRepository = policyRepository;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(PolicyApprovalService_1.name);
    }
    async createApproval(policyId, approverId, sequenceOrder) {
        const policy = await this.policyRepository.findOne({
            where: { id: policyId, deleted_at: null },
        });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${policyId} not found`);
        }
        const approver = await this.userRepository.findOne({
            where: { id: approverId },
        });
        if (!approver) {
            throw new common_1.NotFoundException(`User with ID ${approverId} not found`);
        }
        const existingApproval = await this.approvalRepository.findOne({
            where: { policy_id: policyId, approver_id: approverId },
        });
        if (existingApproval) {
            throw new common_1.BadRequestException(`An approval request already exists for this policy and approver`);
        }
        const approval = this.approvalRepository.create({
            policy_id: policyId,
            approver_id: approverId,
            sequence_order: sequenceOrder,
            approval_status: policy_approval_entity_1.ApprovalStatus.PENDING,
        });
        const savedApproval = await this.approvalRepository.save(approval);
        this.logger.log(`Created policy approval: ${savedApproval.id} for policy ${policyId}`);
        return savedApproval;
    }
    async findApprovalsByPolicy(policyId) {
        return this.approvalRepository.find({
            where: { policy_id: policyId },
            relations: ['approver'],
            order: { sequence_order: 'ASC', created_at: 'ASC' },
        });
    }
    async findApprovalsByApprover(approverId) {
        return this.approvalRepository.find({
            where: { approver_id: approverId },
            relations: ['policy'],
            order: { created_at: 'DESC' },
        });
    }
    async findPendingApprovals() {
        return this.approvalRepository.find({
            where: { approval_status: policy_approval_entity_1.ApprovalStatus.PENDING },
            relations: ['policy', 'approver'],
            order: { created_at: 'ASC' },
        });
    }
    async approvePolicy(approvalId, comments) {
        const approval = await this.approvalRepository.findOne({
            where: { id: approvalId },
            relations: ['policy'],
        });
        if (!approval) {
            throw new common_1.NotFoundException(`Approval with ID ${approvalId} not found`);
        }
        if (approval.approval_status !== policy_approval_entity_1.ApprovalStatus.PENDING) {
            throw new common_1.BadRequestException(`Cannot approve an approval that is already ${approval.approval_status}`);
        }
        approval.approval_status = policy_approval_entity_1.ApprovalStatus.APPROVED;
        approval.approved_at = new Date();
        if (comments) {
            approval.comments = comments;
        }
        const savedApproval = await this.approvalRepository.save(approval);
        this.logger.log(`Approved policy: ${approval.policy_id}`);
        return savedApproval;
    }
    async rejectPolicy(approvalId, comments) {
        const approval = await this.approvalRepository.findOne({
            where: { id: approvalId },
            relations: ['policy'],
        });
        if (!approval) {
            throw new common_1.NotFoundException(`Approval with ID ${approvalId} not found`);
        }
        if (approval.approval_status !== policy_approval_entity_1.ApprovalStatus.PENDING) {
            throw new common_1.BadRequestException(`Cannot reject an approval that is already ${approval.approval_status}`);
        }
        approval.approval_status = policy_approval_entity_1.ApprovalStatus.REJECTED;
        if (comments) {
            approval.comments = comments;
        }
        const savedApproval = await this.approvalRepository.save(approval);
        await this.policyRepository.update(approval.policy_id, {
            status: policy_entity_1.PolicyStatus.IN_REVIEW,
        });
        this.logger.log(`Rejected policy: ${approval.policy_id}`);
        return savedApproval;
    }
    async revokeApproval(approvalId) {
        const approval = await this.approvalRepository.findOne({
            where: { id: approvalId },
        });
        if (!approval) {
            throw new common_1.NotFoundException(`Approval with ID ${approvalId} not found`);
        }
        if (approval.approval_status === policy_approval_entity_1.ApprovalStatus.REVOKED) {
            throw new common_1.BadRequestException('This approval has already been revoked');
        }
        approval.approval_status = policy_approval_entity_1.ApprovalStatus.REVOKED;
        const savedApproval = await this.approvalRepository.save(approval);
        this.logger.log(`Revoked approval: ${approvalId} for policy: ${approval.policy_id}`);
        return savedApproval;
    }
    async deleteApproval(approvalId) {
        const approval = await this.approvalRepository.findOne({
            where: { id: approvalId },
        });
        if (!approval) {
            throw new common_1.NotFoundException(`Approval with ID ${approvalId} not found`);
        }
        await this.approvalRepository.remove(approval);
        this.logger.log(`Deleted approval: ${approvalId}`);
    }
    async checkAllApprovalsCompleted(policyId) {
        const approvals = await this.approvalRepository.find({
            where: { policy_id: policyId },
        });
        if (approvals.length === 0) {
            return true;
        }
        return approvals.every((approval) => approval.approval_status === policy_approval_entity_1.ApprovalStatus.APPROVED ||
            approval.approval_status === policy_approval_entity_1.ApprovalStatus.REVOKED);
    }
    async hasAnyRejection(policyId) {
        const rejection = await this.approvalRepository.findOne({
            where: {
                policy_id: policyId,
                approval_status: policy_approval_entity_1.ApprovalStatus.REJECTED,
            },
        });
        return !!rejection;
    }
    async getApprovalProgress(policyId) {
        const approvals = await this.approvalRepository.find({
            where: { policy_id: policyId },
        });
        const approved = approvals.filter((a) => a.approval_status === policy_approval_entity_1.ApprovalStatus.APPROVED).length;
        const rejected = approvals.filter((a) => a.approval_status === policy_approval_entity_1.ApprovalStatus.REJECTED).length;
        const pending = approvals.filter((a) => a.approval_status === policy_approval_entity_1.ApprovalStatus.PENDING).length;
        return {
            total: approvals.length,
            approved,
            rejected,
            pending,
        };
    }
};
exports.PolicyApprovalService = PolicyApprovalService;
exports.PolicyApprovalService = PolicyApprovalService = PolicyApprovalService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(policy_approval_entity_1.PolicyApproval)),
    __param(1, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PolicyApprovalService);
//# sourceMappingURL=policy-approval.service.js.map