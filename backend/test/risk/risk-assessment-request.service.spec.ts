/**
 * Risk Assessment Request Service Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { RiskAssessmentRequestService } from '../../src/risk/services/risk-assessment-request.service';
import { RiskAssessmentRequest, RequestStatus, RequestPriority } from '../../src/risk/entities/risk-assessment-request.entity';
import { AssessmentType } from '../../src/risk/entities/risk-assessment.entity';
import { Risk } from '../../src/risk/entities/risk.entity';
import { RiskAssessment } from '../../src/risk/entities/risk-assessment.entity';
import { CreateRiskAssessmentRequestDto } from '../../src/risk/dto/request/create-risk-assessment-request.dto';
import { UpdateRiskAssessmentRequestDto } from '../../src/risk/dto/request/update-risk-assessment-request.dto';
import { WorkflowService } from '../../src/workflow/services/workflow.service';
import { EntityType, WorkflowTrigger } from '../../src/workflow/entities/workflow.entity';

describe('RiskAssessmentRequestService', () => {
  let service: RiskAssessmentRequestService;
  let requestRepository: Repository<RiskAssessmentRequest>;
  let riskRepository: Repository<Risk>;
  let assessmentRepository: Repository<RiskAssessment>;
  let workflowService: WorkflowService;

  const mockRequestRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    })),
  };

  const mockRiskRepository = {
    findOne: jest.fn(),
  };

  const mockAssessmentRepository = {
    findOne: jest.fn(),
  };

  const mockWorkflowService = {
    checkAndTriggerWorkflows: jest.fn(),
  };

  const mockRisk: Partial<Risk> = {
    id: 'risk-123',
    title: 'Test Risk',
    risk_id: 'RISK-001',
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  };

  const mockRequest: Partial<RiskAssessmentRequest> = {
    id: 'request-123',
    request_identifier: 'REQ-202501-0001',
    risk_id: 'risk-123',
    requested_by_id: 'user-123',
    requested_for_id: 'user-456',
    assessment_type: AssessmentType.CURRENT,
    priority: RequestPriority.MEDIUM,
    status: RequestStatus.PENDING,
    risk: mockRisk as Risk,
    requested_by: mockUser as any,
    requested_for: mockUser as any,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiskAssessmentRequestService,
        {
          provide: getRepositoryToken(RiskAssessmentRequest),
          useValue: mockRequestRepository,
        },
        {
          provide: getRepositoryToken(Risk),
          useValue: mockRiskRepository,
        },
        {
          provide: getRepositoryToken(RiskAssessment),
          useValue: mockAssessmentRepository,
        },
        {
          provide: WorkflowService,
          useValue: mockWorkflowService,
        },
      ],
    }).compile();

    service = module.get<RiskAssessmentRequestService>(RiskAssessmentRequestService);
    requestRepository = module.get<Repository<RiskAssessmentRequest>>(
      getRepositoryToken(RiskAssessmentRequest),
    );
    riskRepository = module.get<Repository<Risk>>(getRepositoryToken(Risk));
    assessmentRepository = module.get<Repository<RiskAssessment>>(
      getRepositoryToken(RiskAssessment),
    );
    workflowService = module.get<WorkflowService>(WorkflowService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all requests', async () => {
      const requests = [mockRequest];
      mockRequestRepository.find.mockResolvedValue(requests);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('request-123');
      expect(mockRequestRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: [
          'risk',
          'requested_by',
          'requested_for',
          'approved_by',
          'rejected_by',
          'resulting_assessment',
        ],
        order: { created_at: 'DESC' },
      });
    });

    it('should filter by riskId', async () => {
      mockRequestRepository.find.mockResolvedValue([mockRequest]);

      const result = await service.findAll({ riskId: 'risk-123' });

      expect(mockRequestRepository.find).toHaveBeenCalledWith({
        where: { risk_id: 'risk-123' },
        relations: expect.any(Array),
        order: { created_at: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });

    it('should filter by status', async () => {
      mockRequestRepository.find.mockResolvedValue([mockRequest]);

      const result = await service.findAll({ status: RequestStatus.PENDING });

      expect(mockRequestRepository.find).toHaveBeenCalledWith({
        where: { status: RequestStatus.PENDING },
        relations: expect.any(Array),
        order: { created_at: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a request by id', async () => {
      mockRequestRepository.findOne.mockResolvedValue(mockRequest);

      const result = await service.findOne('request-123');

      expect(result.id).toBe('request-123');
      expect(mockRequestRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'request-123' },
        relations: expect.any(Array),
      });
    });

    it('should throw NotFoundException if request not found', async () => {
      mockRequestRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto: CreateRiskAssessmentRequestDto = {
      risk_id: 'risk-123',
      assessment_type: AssessmentType.CURRENT,
      priority: RequestPriority.HIGH,
      requested_for_id: 'user-456',
      due_date: '2025-02-01',
      justification: 'Need to reassess current risk',
    };

    it('should create a new request successfully', async () => {
      mockRiskRepository.findOne.mockResolvedValue(mockRisk);
      const queryBuilder = mockRequestRepository.createQueryBuilder();
      queryBuilder.getOne.mockResolvedValue(null); // No existing request this month
      mockRequestRepository.create.mockReturnValue(mockRequest);
      mockRequestRepository.save.mockResolvedValue(mockRequest);
      mockRequestRepository.findOne.mockResolvedValue({
        ...mockRequest,
        ...createDto,
      } as any);

      const result = await service.create(createDto, 'user-123', 'org-123');

      expect(mockRiskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'risk-123' },
      });
      expect(mockRequestRepository.create).toHaveBeenCalled();
      expect(mockRequestRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if risk not found', async () => {
      mockRiskRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto, 'user-123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should trigger workflow on create', async () => {
      mockRiskRepository.findOne.mockResolvedValue(mockRisk);
      const queryBuilder = mockRequestRepository.createQueryBuilder();
      queryBuilder.getOne.mockResolvedValue(null);
      mockRequestRepository.create.mockReturnValue(mockRequest);
      mockRequestRepository.save.mockResolvedValue(mockRequest);
      mockRequestRepository.findOne.mockResolvedValue(mockRequest as any);

      await service.create(createDto, 'user-123', 'org-123');

      expect(mockWorkflowService.checkAndTriggerWorkflows).toHaveBeenCalledWith(
        EntityType.RISK,
        'risk-123',
        WorkflowTrigger.ON_CREATE,
        expect.objectContaining({
          request_id: mockRequest.id,
          assessment_type: AssessmentType.CURRENT,
          entityType: 'risk_assessment_request',
        }),
        true,
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdateRiskAssessmentRequestDto = {
      priority: RequestPriority.CRITICAL,
      notes: 'Updated notes',
    };

    it('should update request successfully', async () => {
      mockRequestRepository.findOne.mockResolvedValue(mockRequest);
      mockRequestRepository.save.mockResolvedValue({
        ...mockRequest,
        ...updateDto,
      });

      const result = await service.update('request-123', updateDto, 'user-123');

      expect(mockRequestRepository.findOne).toHaveBeenCalled();
      expect(mockRequestRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if request not found', async () => {
      mockRequestRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent', updateDto, 'user-123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should validate status transitions', async () => {
      const completedRequest = { ...mockRequest, status: RequestStatus.COMPLETED };
      mockRequestRepository.findOne.mockResolvedValue(completedRequest);

      await expect(
        service.update('request-123', { status: RequestStatus.PENDING }, 'user-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('approve', () => {
    it('should approve a request', async () => {
      mockRequestRepository.findOne.mockResolvedValue(mockRequest);
      mockRequestRepository.save.mockResolvedValue({
        ...mockRequest,
        status: RequestStatus.APPROVED,
        approved_by_id: 'user-123',
        approved_at: new Date(),
      });

      const result = await service.approve('request-123', 'user-123');

      expect(result.status).toBe(RequestStatus.APPROVED);
      expect(mockRequestRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: RequestStatus.APPROVED,
          approved_by_id: 'user-123',
        }),
      );
    });
  });

  describe('reject', () => {
    it('should reject a request with reason', async () => {
      // Ensure request is in a state that can be rejected (PENDING)
      const pendingRequest = { ...mockRequest, status: RequestStatus.PENDING };
      mockRequestRepository.findOne.mockResolvedValue(pendingRequest);
      mockRequestRepository.save.mockResolvedValue({
        ...pendingRequest,
        status: RequestStatus.REJECTED,
        rejected_by_id: 'user-123',
        rejected_at: new Date(),
        rejection_reason: 'Not valid',
      });

      // Mock findOne to return updated request for reload
      mockRequestRepository.findOne
        .mockResolvedValueOnce(pendingRequest) // First call in reject method
        .mockResolvedValueOnce({ // Second call after save for reload
          ...pendingRequest,
          status: RequestStatus.REJECTED,
          rejected_by_id: 'user-123',
          rejected_at: new Date(),
          rejection_reason: 'Not valid',
        });

      const result = await service.reject('request-123', 'user-123', 'Not valid');

      expect(result.status).toBe(RequestStatus.REJECTED);
      expect(mockRequestRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: RequestStatus.REJECTED,
          rejected_by_id: 'user-123',
          rejection_reason: 'Not valid',
        }),
      );
    });
  });

  describe('cancel', () => {
    it('should cancel a request', async () => {
      mockRequestRepository.findOne.mockResolvedValue(mockRequest);
      mockRequestRepository.save.mockResolvedValue({
        ...mockRequest,
        status: RequestStatus.CANCELLED,
      });

      const result = await service.cancel('request-123', 'user-123');

      expect(result.status).toBe(RequestStatus.CANCELLED);
    });
  });

  describe('complete', () => {
    const mockAssessment: Partial<RiskAssessment> = {
      id: 'assessment-123',
      risk_id: 'risk-123',
      assessment_type: AssessmentType.CURRENT,
    };

    it('should complete request and link assessment', async () => {
      mockRequestRepository.findOne.mockResolvedValue(mockRequest);
      mockAssessmentRepository.findOne.mockResolvedValue(mockAssessment);
      mockRequestRepository.save.mockResolvedValue({
        ...mockRequest,
        status: RequestStatus.COMPLETED,
        completed_at: new Date(),
        resulting_assessment_id: 'assessment-123',
      });

      const result = await service.complete('request-123', 'assessment-123', 'user-123');

      expect(result.status).toBe(RequestStatus.COMPLETED);
      expect(result.resulting_assessment_id).toBe('assessment-123');
    });

    it('should throw NotFoundException if assessment not found', async () => {
      mockRequestRepository.findOne.mockResolvedValue(mockRequest);
      mockAssessmentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.complete('request-123', 'non-existent', 'user-123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if assessment risk mismatch', async () => {
      mockRequestRepository.findOne.mockResolvedValue(mockRequest);
      mockAssessmentRepository.findOne.mockResolvedValue({
        ...mockAssessment,
        risk_id: 'different-risk',
      });

      await expect(
        service.complete('request-123', 'assessment-123', 'user-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a pending request', async () => {
      // mockRequest already has PENDING status, so it should be deletable
      const pendingRequest = { ...mockRequest, status: RequestStatus.PENDING };
      mockRequestRepository.findOne.mockResolvedValue(pendingRequest);
      mockRequestRepository.remove.mockResolvedValue(pendingRequest as any);

      await service.remove('request-123');

      expect(mockRequestRepository.findOne).toHaveBeenCalledWith({ where: { id: 'request-123' } });
      expect(mockRequestRepository.remove).toHaveBeenCalled();
    });

    it('should throw BadRequestException if request is not pending or cancelled', async () => {
      const completedRequest = { ...mockRequest, status: RequestStatus.COMPLETED };
      mockRequestRepository.findOne.mockResolvedValue(completedRequest);

      await expect(service.remove('request-123')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRequestRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('findPendingForUser', () => {
    it('should return pending requests for a user', async () => {
      mockRequestRepository.find.mockResolvedValue([mockRequest]);

      const result = await service.findPendingForUser('user-456');

      expect(mockRequestRepository.find).toHaveBeenCalledWith({
        where: {
          requested_for_id: 'user-456',
          status: RequestStatus.PENDING,
        },
        relations: expect.any(Array),
        order: { created_at: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });
  });
});
