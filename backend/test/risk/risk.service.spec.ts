/**
 * Risk Service Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { RiskService } from '../../src/risk/services/risk.service';
import { Risk, RiskStatus, RiskLikelihood, RiskImpact, RiskLevel, RiskCategory_OLD } from '../../src/risk/entities/risk.entity';
import { RiskAssetLink } from '../../src/risk/entities/risk-asset-link.entity';
import { RiskControlLink } from '../../src/risk/entities/risk-control-link.entity';
import { RiskTreatment } from '../../src/risk/entities/risk-treatment.entity';
import { KRIRiskLink } from '../../src/risk/entities/kri-risk-link.entity';
import { CreateRiskDto } from '../../src/risk/dto/create-risk.dto';
import { UpdateRiskDto } from '../../src/risk/dto/update-risk.dto';
import { WorkflowService } from '../../src/workflow/services/workflow.service';
import { RiskSettingsService } from '../../src/risk/services/risk-settings.service';

describe('RiskService', () => {
  let service: RiskService;
  let riskRepository: Repository<Risk>;
  let assetLinkRepository: Repository<RiskAssetLink>;
  let controlLinkRepository: Repository<RiskControlLink>;
  let treatmentRepository: Repository<RiskTreatment>;
  let kriLinkRepository: Repository<KRIRiskLink>;
  let workflowService: WorkflowService;
  let riskSettingsService: RiskSettingsService;

  // Mock query builder
  const createMockQueryBuilder = () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getCount: jest.fn(),
      getMany: jest.fn(),
    };
    return mockQueryBuilder;
  };

  // Helper to mock integration counts
  const mockIntegrationCounts = (riskIds: string[]) => {
    const counts = riskIds.map(id => ({ risk_id: id, count: '0' }));
    const queryBuilderMock = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(counts),
    };
    
    mockAssetLinkRepository.createQueryBuilder.mockReturnValue(queryBuilderMock);
    mockControlLinkRepository.createQueryBuilder.mockReturnValue(queryBuilderMock);
    mockTreatmentRepository.createQueryBuilder.mockReturnValue(queryBuilderMock);
    mockKriLinkRepository.createQueryBuilder.mockReturnValue(queryBuilderMock);
  };

  const mockRiskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(() => createMockQueryBuilder()),
  };

  const mockAssetLinkRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockControlLinkRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockTreatmentRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockKriLinkRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockWorkflowService = {
    checkAndTriggerWorkflows: jest.fn(),
  };

  const mockRiskSettingsService = {
    calculateRiskLevel: jest.fn(),
    exceedsRiskAppetite: jest.fn(),
    getRiskAppetiteThresholds: jest.fn(),
  };

  const mockRisk: Partial<Risk> = {
    id: 'risk-123',
    title: 'Test Risk',
    description: 'Test risk description',
    status: RiskStatus.IDENTIFIED,
    likelihood: RiskLikelihood.MEDIUM,
    impact: RiskImpact.MEDIUM,
    current_risk_score: 9,
    current_risk_level: RiskLevel.MEDIUM,
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted_at: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiskService,
        {
          provide: getRepositoryToken(Risk),
          useValue: mockRiskRepository,
        },
        {
          provide: getRepositoryToken(RiskAssetLink),
          useValue: mockAssetLinkRepository,
        },
        {
          provide: getRepositoryToken(RiskControlLink),
          useValue: mockControlLinkRepository,
        },
        {
          provide: getRepositoryToken(RiskTreatment),
          useValue: mockTreatmentRepository,
        },
        {
          provide: getRepositoryToken(KRIRiskLink),
          useValue: mockKriLinkRepository,
        },
        {
          provide: WorkflowService,
          useValue: mockWorkflowService,
        },
        {
          provide: RiskSettingsService,
          useValue: mockRiskSettingsService,
        },
      ],
    }).compile();

    service = module.get<RiskService>(RiskService);
    riskRepository = module.get<Repository<Risk>>(getRepositoryToken(Risk));
    assetLinkRepository = module.get<Repository<RiskAssetLink>>(getRepositoryToken(RiskAssetLink));
    controlLinkRepository = module.get<Repository<RiskControlLink>>(getRepositoryToken(RiskControlLink));
    treatmentRepository = module.get<Repository<RiskTreatment>>(getRepositoryToken(RiskTreatment));
    kriLinkRepository = module.get<Repository<KRIRiskLink>>(getRepositoryToken(KRIRiskLink));
    workflowService = module.get<WorkflowService>(WorkflowService);
    riskSettingsService = module.get<RiskSettingsService>(RiskSettingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated risks', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getCount.mockResolvedValue(10);
      mockQueryBuilder.getMany.mockResolvedValue([mockRisk]);
      mockRiskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      
      mockIntegrationCounts(['risk-123']);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(10);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should apply search filter', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue([mockRisk]);
      mockRiskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      
      mockIntegrationCounts(['risk-123']);

      await service.findAll({ search: 'test' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(risk.title ILIKE :search OR risk.description ILIKE :search OR risk.risk_id ILIKE :search)',
        { search: '%test%' },
      );
    });

    it('should apply status filter', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue([mockRisk]);
      mockRiskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      
      mockIntegrationCounts(['risk-123']);

      await service.findAll({ status: RiskStatus.IDENTIFIED });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('risk.status = :status', {
        status: RiskStatus.IDENTIFIED,
      });
    });

    it('should apply category filter', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue([mockRisk]);
      mockRiskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      
      mockIntegrationCounts(['risk-123']);

      await service.findAll({ category: RiskCategory_OLD.OPERATIONAL });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('risk.category = :category', {
        category: RiskCategory_OLD.OPERATIONAL,
      });
    });

    it('should apply pagination', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getCount.mockResolvedValue(50);
      mockQueryBuilder.getMany.mockResolvedValue([mockRisk]);
      mockRiskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      
      mockIntegrationCounts(['risk-123']);

      await service.findAll({ page: 2, limit: 10 });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('should use default pagination when not provided', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getCount.mockResolvedValue(10);
      mockQueryBuilder.getMany.mockResolvedValue([mockRisk]);
      mockRiskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      
      mockIntegrationCounts(['risk-123']);

      const result = await service.findAll();

      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });
  });

  describe('findOne', () => {
    it('should return a risk by id', async () => {
      mockRiskRepository.findOne.mockResolvedValue(mockRisk);
      mockIntegrationCounts(['risk-123']);
      mockRiskSettingsService.getRiskAppetiteThresholds.mockResolvedValue({
        low: 6,
        medium: 12,
        high: 20,
      });
      mockRiskSettingsService.exceedsRiskAppetite.mockResolvedValue(false);

      const result = await service.findOne('risk-123');

      expect(mockRiskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'risk-123' },
        relations: ['owner', 'risk_category', 'risk_sub_category', 'risk_analyst'],
      });
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if risk not found', async () => {
      mockRiskRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createRiskDto: CreateRiskDto = {
      title: 'New Risk',
      description: 'New risk description',
      category: RiskCategory_OLD.OPERATIONAL,
      likelihood: RiskLikelihood.HIGH,
      impact: RiskImpact.HIGH,
      ownerId: 'user-123',
    };

    it('should create a risk successfully', async () => {
      mockRiskRepository.create.mockReturnValue(mockRisk);
      mockRiskRepository.save.mockResolvedValue(mockRisk);
      mockRiskSettingsService.calculateRiskLevel.mockReturnValue('high');

      const result = await service.create(createRiskDto, 'user-123');

      expect(mockRiskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: createRiskDto.title,
          description: createRiskDto.description,
          category: createRiskDto.category,
          likelihood: createRiskDto.likelihood,
          impact: createRiskDto.impact,
          ownerId: createRiskDto.ownerId,
          created_by: 'user-123',
        }),
      );
      expect(mockRiskRepository.save).toHaveBeenCalled();
      expect(mockWorkflowService.checkAndTriggerWorkflows).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should use default status when not provided', async () => {
      const dtoWithoutStatus = { ...createRiskDto };
      delete (dtoWithoutStatus as any).status;
      mockRiskRepository.create.mockReturnValue(mockRisk);
      mockRiskRepository.save.mockResolvedValue(mockRisk);
      mockRiskSettingsService.calculateRiskLevel.mockReturnValue('high');

      await service.create(dtoWithoutStatus, 'user-123');

      expect(mockRiskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: RiskStatus.IDENTIFIED,
        }),
      );
    });

    it('should trigger workflow on create', async () => {
      mockRiskRepository.create.mockReturnValue(mockRisk);
      mockRiskRepository.save.mockResolvedValue(mockRisk);
      mockRiskSettingsService.calculateRiskLevel.mockReturnValue('high');

      await service.create(createRiskDto, 'user-123');

      expect(mockWorkflowService.checkAndTriggerWorkflows).toHaveBeenCalledWith(
        expect.any(String), // EntityType
        mockRisk.id,
        expect.any(String), // WorkflowTrigger
        expect.objectContaining({
          status: mockRisk.status,
        }),
      );
    });
  });

  describe('update', () => {
    const updateRiskDto: UpdateRiskDto = {
      title: 'Updated Risk Title',
      status: RiskStatus.ASSESSED,
    };

    it('should update a risk successfully', async () => {
      const existingRisk = { ...mockRisk, version_number: 1 };
      mockRiskRepository.findOne.mockResolvedValue(existingRisk);
      mockRiskRepository.save.mockResolvedValue({ ...existingRisk, ...updateRiskDto });
      mockIntegrationCounts(['risk-123']);

      const result = await service.update('risk-123', updateRiskDto, 'user-123');

      expect(mockRiskRepository.findOne).toHaveBeenCalledWith({ where: { id: 'risk-123' } });
      expect(mockRiskRepository.save).toHaveBeenCalled();
      expect(mockWorkflowService.checkAndTriggerWorkflows).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if risk not found', async () => {
      mockRiskRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent', updateRiskDto, 'user-123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should increment version number on update', async () => {
      const existingRisk = { ...mockRisk, version_number: 1 };
      mockRiskRepository.findOne.mockResolvedValue(existingRisk);
      const updatedRisk = { ...existingRisk, ...updateRiskDto, version_number: 2 };
      mockRiskRepository.save.mockResolvedValue(updatedRisk);
      mockIntegrationCounts(['risk-123']);

      await service.update('risk-123', updateRiskDto, 'user-123');

      expect(mockRiskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          version_number: 2,
        }),
      );
    });

    it('should trigger status change workflow when status changes', async () => {
      const existingRisk = { ...mockRisk, status: RiskStatus.IDENTIFIED, version_number: 1 };
      mockRiskRepository.findOne.mockResolvedValue(existingRisk);
      const updatedRisk = { ...existingRisk, status: RiskStatus.ASSESSED };
      mockRiskRepository.save.mockResolvedValue(updatedRisk);
      mockIntegrationCounts(['risk-123']);

      await service.update('risk-123', { status: RiskStatus.ASSESSED }, 'user-123');

      // Should be called twice: once for ON_UPDATE, once for ON_STATUS_CHANGE
      expect(mockWorkflowService.checkAndTriggerWorkflows).toHaveBeenCalledTimes(2);
    });
  });

  describe('remove', () => {
    it('should soft delete a risk', async () => {
      mockRiskRepository.findOne.mockResolvedValue(mockRisk);
      mockRiskRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove('risk-123');

      expect(mockRiskRepository.findOne).toHaveBeenCalledWith({ where: { id: 'risk-123' } });
      expect(mockRiskRepository.softDelete).toHaveBeenCalledWith('risk-123');
    });

    it('should throw NotFoundException if risk not found', async () => {
      mockRiskRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Integration Counts', () => {
    it('should get integration counts for risks', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue([mockRisk]);
      mockRiskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      
      mockIntegrationCounts(['risk-123']);

      const result = await service.findAll();

      expect(result.data).toBeDefined();
      expect(mockAssetLinkRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockControlLinkRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});



