import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PolicyApprovalService } from '../../src/governance/policies/services/policy-approval.service';
import {
  PolicyApproval,
  ApprovalStatus,
} from '../../src/governance/policies/entities/policy-approval.entity';
import { Policy, PolicyStatus } from '../../src/governance/policies/entities/policy.entity';
import { User } from '../../src/users/entities/user.entity';

describe('PolicyApprovalService', () => {
  let service: PolicyApprovalService;
  let approvalRepository: Repository<PolicyApproval>;
  let policyRepository: Repository<Policy>;
  let userRepository: Repository<User>;

  const mockApprovalRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPolicyRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const policyId = 'policy-123';
  const approverId = 'approver-123';
  const approvalId = 'approval-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyApprovalService,
        {
          provide: getRepositoryToken(PolicyApproval),
          useValue: mockApprovalRepository,
        },
        {
          provide: getRepositoryToken(Policy),
          useValue: mockPolicyRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<PolicyApprovalService>(PolicyApprovalService);
    approvalRepository = module.get<Repository<PolicyApproval>>(
      getRepositoryToken(PolicyApproval),
    );
    policyRepository = module.get<Repository<Policy>>(
      getRepositoryToken(Policy),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createApproval', () => {
    it('should create an approval successfully', async () => {
      const mockPolicy = { id: policyId } as unknown as Policy;
      const mockUser = { id: approverId } as unknown as User;
      const mockApproval = {
        id: approvalId,
        policy_id: policyId,
        approver_id: approverId,
        approval_status: ApprovalStatus.PENDING,
        sequence_order: 1,
        created_at: new Date(),
      } as unknown as PolicyApproval;

      mockPolicyRepository.findOne.mockResolvedValue(mockPolicy);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockApprovalRepository.create.mockReturnValue(mockApproval);
      mockApprovalRepository.save.mockResolvedValue(mockApproval);
      mockApprovalRepository.findOne.mockResolvedValueOnce(null); // For duplicate check

      const result = await service.createApproval(policyId, approverId, 1);

      expect(mockPolicyRepository.findOne).toHaveBeenCalledWith({
        where: { id: policyId, deleted_at: null },
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: approverId },
      });
      expect(mockApprovalRepository.create).toHaveBeenCalled();
      expect(mockApprovalRepository.save).toHaveBeenCalledWith(mockApproval);
      expect(result).toEqual(mockApproval);
    });

    it('should throw NotFoundException if policy not found', async () => {
      mockPolicyRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createApproval(policyId, approverId, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if approver not found', async () => {
      const mockPolicy = { id: policyId } as unknown as Policy;
      mockPolicyRepository.findOne.mockResolvedValue(mockPolicy);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createApproval(policyId, approverId, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if approval already exists', async () => {
      const mockPolicy = { id: policyId } as unknown as Policy;
      const mockUser = { id: approverId } as unknown as User;
      const existingApproval = {
        id: approvalId,
      } as unknown as PolicyApproval;

      mockPolicyRepository.findOne.mockResolvedValue(mockPolicy);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockApprovalRepository.findOne.mockResolvedValue(existingApproval);

      await expect(
        service.createApproval(policyId, approverId, 1),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findApprovalsByPolicy', () => {
    it('should find all approvals for a policy', async () => {
      const mockApprovals = [
        {
          id: 'approval-1',
          policy_id: policyId,
          approval_status: ApprovalStatus.PENDING,
        },
        {
          id: 'approval-2',
          policy_id: policyId,
          approval_status: ApprovalStatus.APPROVED,
        },
      ] as unknown as PolicyApproval[];

      mockApprovalRepository.find.mockResolvedValue(mockApprovals);

      const result = await service.findApprovalsByPolicy(policyId);

      expect(mockApprovalRepository.find).toHaveBeenCalledWith({
        where: { policy_id: policyId },
        relations: ['approver'],
        order: { sequence_order: 'ASC', created_at: 'ASC' },
      });
      expect(result).toEqual(mockApprovals);
    });
  });

  describe('approvePolicy', () => {
    it('should approve a policy successfully', async () => {
      const mockPolicy = { id: policyId } as unknown as Policy;
      const mockApproval = {
        id: approvalId,
        policy_id: policyId,
        approval_status: ApprovalStatus.PENDING,
        approver_id: approverId,
        policy: mockPolicy,
      } as unknown as PolicyApproval;

      const approvedApproval = {
        ...mockApproval,
        approval_status: ApprovalStatus.APPROVED,
        approved_at: new Date(),
        comments: 'Looks good',
      } as unknown as PolicyApproval;

      mockApprovalRepository.findOne.mockResolvedValue(mockApproval);
      mockApprovalRepository.save.mockResolvedValue(approvedApproval);

      const result = await service.approvePolicy(approvalId, 'Looks good');

      expect(result.approval_status).toBe(ApprovalStatus.APPROVED);
      expect(result.approved_at).toBeDefined();
      expect(result.comments).toBe('Looks good');
    });

    it('should throw NotFoundException if approval not found', async () => {
      mockApprovalRepository.findOne.mockResolvedValue(null);

      await expect(service.approvePolicy(approvalId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if not pending', async () => {
      const mockApproval = {
        id: approvalId,
        approval_status: ApprovalStatus.APPROVED,
      } as unknown as PolicyApproval;

      mockApprovalRepository.findOne.mockResolvedValue(mockApproval);

      await expect(service.approvePolicy(approvalId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('rejectPolicy', () => {
    it('should reject a policy successfully', async () => {
      const mockApproval = {
        id: approvalId,
        policy_id: policyId,
        approval_status: ApprovalStatus.PENDING,
      } as unknown as PolicyApproval;

      const rejectedApproval = {
        ...mockApproval,
        approval_status: ApprovalStatus.REJECTED,
        comments: 'Needs revision',
      } as unknown as PolicyApproval;

      mockApprovalRepository.findOne.mockResolvedValue(mockApproval);
      mockApprovalRepository.save.mockResolvedValue(rejectedApproval);
      mockPolicyRepository.update.mockResolvedValue({});

      const result = await service.rejectPolicy(approvalId, 'Needs revision');

      expect(result.approval_status).toBe(ApprovalStatus.REJECTED);
      expect(mockPolicyRepository.update).toHaveBeenCalledWith(policyId, {
        status: PolicyStatus.IN_REVIEW,
      });
    });
  });

  describe('checkAllApprovalsCompleted', () => {
    it('should return true if all approvals are completed', async () => {
      const mockApprovals = [
        { approval_status: ApprovalStatus.APPROVED } as unknown as PolicyApproval,
        { approval_status: ApprovalStatus.REVOKED } as unknown as PolicyApproval,
      ];

      mockApprovalRepository.find.mockResolvedValue(mockApprovals);

      const result = await service.checkAllApprovalsCompleted(policyId);

      expect(result).toBe(true);
    });

    it('should return false if there are pending approvals', async () => {
      const mockApprovals = [
        { approval_status: ApprovalStatus.APPROVED } as unknown as PolicyApproval,
        { approval_status: ApprovalStatus.PENDING } as unknown as PolicyApproval,
      ];

      mockApprovalRepository.find.mockResolvedValue(mockApprovals);

      const result = await service.checkAllApprovalsCompleted(policyId);

      expect(result).toBe(false);
    });

    it('should return true if no approvals exist', async () => {
      mockApprovalRepository.find.mockResolvedValue([]);

      const result = await service.checkAllApprovalsCompleted(policyId);

      expect(result).toBe(true);
    });
  });

  describe('hasAnyRejection', () => {
    it('should return true if there is a rejection', async () => {
      const mockRejection = {
        id: approvalId,
        approval_status: ApprovalStatus.REJECTED,
      } as unknown as PolicyApproval;

      mockApprovalRepository.findOne.mockResolvedValue(mockRejection);

      const result = await service.hasAnyRejection(policyId);

      expect(result).toBe(true);
    });

    it('should return false if there is no rejection', async () => {
      mockApprovalRepository.findOne.mockResolvedValue(null);

      const result = await service.hasAnyRejection(policyId);

      expect(result).toBe(false);
    });
  });

  describe('getApprovalProgress', () => {
    it('should return approval progress correctly', async () => {
      const mockApprovals = [
        { approval_status: ApprovalStatus.APPROVED } as unknown as PolicyApproval,
        { approval_status: ApprovalStatus.APPROVED } as unknown as PolicyApproval,
        { approval_status: ApprovalStatus.PENDING } as unknown as PolicyApproval,
        { approval_status: ApprovalStatus.REJECTED } as unknown as PolicyApproval,
      ];

      mockApprovalRepository.find.mockResolvedValue(mockApprovals);

      const result = await service.getApprovalProgress(policyId);

      expect(result).toEqual({
        total: 4,
        approved: 2,
        rejected: 1,
        pending: 1,
      });
    });
  });
});
