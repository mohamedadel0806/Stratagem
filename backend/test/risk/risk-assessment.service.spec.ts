/**
 * Risk Assessment Service Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { RiskAssessmentService } from '../../src/risk/services/risk-assessment.service';
import { RiskAssessment, AssessmentType, ImpactLevel, ConfidenceLevel } from '../../src/risk/entities/risk-assessment.entity';
import { Risk, RiskLevel } from '../../src/risk/entities/risk.entity';
import { CreateRiskAssessmentDto } from '../../src/risk/dto/assessment/create-risk-assessment.dto';
import { RiskSettingsService } from '../../src/risk/services/risk-settings.service';

describe('RiskAssessmentService', () => {
  let service: RiskAssessmentService;
  let assessmentRepository: Repository<RiskAssessment>;
  let riskRepository: Repository<Risk>;
  let riskSettingsService: RiskSettingsService;

  const mockAssessmentRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockRiskRepository = {
    findOne: jest.fn(),
  };

  const mockRiskSettingsService = {
    validateAssessmentMethod: jest.fn(),
    validateScaleValues: jest.fn(),
    calculateRiskLevelFromSettings: jest.fn(),
    exceedsRiskAppetite: jest.fn().mockResolvedValue(false),
    getSettings: jest.fn().mockResolvedValue({
      default_assessment_method: 'qualitative_5x5',
      assessment_methods: [{ id: 'qualitative_5x5', name: '5x5 Qualitative' }],
    }),
    getActiveAssessmentMethods: jest.fn().mockResolvedValue([
      { id: 'qualitative_5x5', name: '5x5 Qualitative' },
    ]),
    getLikelihoodScale: jest.fn().mockResolvedValue([
      { value: 1, label: 'Very Low', description: 'Very low likelihood' },
      { value: 2, label: 'Low', description: 'Low likelihood' },
      { value: 3, label: 'Medium', description: 'Medium likelihood' },
      { value: 4, label: 'High', description: 'High likelihood' },
      { value: 5, label: 'Very High', description: 'Very high likelihood' },
    ]),
    getImpactScale: jest.fn().mockResolvedValue([
      { value: 1, label: 'Negligible', description: 'Negligible impact' },
      { value: 2, label: 'Minor', description: 'Minor impact' },
      { value: 3, label: 'Moderate', description: 'Moderate impact' },
      { value: 4, label: 'Major', description: 'Major impact' },
      { value: 5, label: 'Catastrophic', description: 'Catastrophic impact' },
    ]),
    getRiskLevelForScore: jest.fn().mockResolvedValue(RiskLevel.MEDIUM),
  };

  const mockRisk: Partial<Risk> = {
    id: 'risk-123',
    title: 'Test Risk',
  };

  const mockAssessment: Partial<RiskAssessment> = {
    id: 'assessment-123',
    risk_id: 'risk-123',
    assessment_type: AssessmentType.CURRENT,
    likelihood: 3,
    impact: 4,
    risk_score: 12,
    risk_level: RiskLevel.HIGH,
    assessment_date: new Date(),
    assessor_id: 'user-123',
    created_by: 'user-123',
    is_latest: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiskAssessmentService,
        {
          provide: getRepositoryToken(RiskAssessment),
          useValue: mockAssessmentRepository,
        },
        {
          provide: getRepositoryToken(Risk),
          useValue: mockRiskRepository,
        },
        {
          provide: RiskSettingsService,
          useValue: mockRiskSettingsService,
        },
      ],
    }).compile();

    service = module.get<RiskAssessmentService>(RiskAssessmentService);
    assessmentRepository = module.get<Repository<RiskAssessment>>(
      getRepositoryToken(RiskAssessment),
    );
    riskRepository = module.get<Repository<Risk>>(getRepositoryToken(Risk));
    riskSettingsService = module.get<RiskSettingsService>(RiskSettingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByRiskId', () => {
    it('should return assessments for a risk', async () => {
      mockAssessmentRepository.find.mockResolvedValue([mockAssessment]);

      const result = await service.findByRiskId('risk-123');

      expect(result).toHaveLength(1);
      expect(mockAssessmentRepository.find).toHaveBeenCalledWith({
        where: { risk_id: 'risk-123' },
        relations: ['assessor'],
        order: { assessment_date: 'DESC', created_at: 'DESC' },
      });
    });

    it('should filter by assessment type', async () => {
      mockAssessmentRepository.find.mockResolvedValue([mockAssessment]);

      const result = await service.findByRiskId('risk-123', AssessmentType.CURRENT);

      expect(mockAssessmentRepository.find).toHaveBeenCalledWith({
        where: { risk_id: 'risk-123', assessment_type: AssessmentType.CURRENT },
        relations: ['assessor'],
        order: { assessment_date: 'DESC', created_at: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findLatestByRiskId', () => {
    it('should return latest assessments by type', async () => {
      const assessments = [
        { ...mockAssessment, assessment_type: AssessmentType.INHERENT },
        { ...mockAssessment, id: 'assessment-456', assessment_type: AssessmentType.CURRENT },
        { ...mockAssessment, id: 'assessment-789', assessment_type: AssessmentType.TARGET },
      ];
      mockAssessmentRepository.find.mockResolvedValue(assessments);

      const result = await service.findLatestByRiskId('risk-123');

      expect(result.inherent).toBeDefined();
      expect(result.current).toBeDefined();
      expect(result.target).toBeDefined();
      expect(mockAssessmentRepository.find).toHaveBeenCalledWith({
        where: { risk_id: 'risk-123', is_latest: true },
        relations: ['assessor'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single assessment by id', async () => {
      mockAssessmentRepository.findOne.mockResolvedValue(mockAssessment);

      const result = await service.findOne('assessment-123');

      expect(result).toBeDefined();
      expect(mockAssessmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'assessment-123' },
        relations: ['assessor', 'risk'],
      });
    });

    it('should throw NotFoundException if assessment not found', async () => {
      mockAssessmentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto: CreateRiskAssessmentDto = {
      risk_id: 'risk-123',
      assessment_type: AssessmentType.CURRENT,
      likelihood: 3,
      impact: 4,
      financial_impact: ImpactLevel.MODERATE,
      operational_impact: ImpactLevel.MODERATE,
      assessment_date: '2025-01-15',
      assessment_method: 'qualitative_5x5',
      confidence_level: ConfidenceLevel.MEDIUM,
    };

    it('should create an assessment successfully', async () => {
      mockRiskRepository.findOne.mockResolvedValue(mockRisk);
      mockRiskSettingsService.validateAssessmentMethod = jest.fn().mockResolvedValue(true);
      mockRiskSettingsService.validateScaleValues = jest.fn().mockResolvedValue(undefined);
      mockRiskSettingsService.calculateRiskLevelFromSettings = jest.fn().mockResolvedValue(RiskLevel.HIGH);
      mockRiskSettingsService.exceedsRiskAppetite = jest.fn().mockResolvedValue(false);
      mockAssessmentRepository.create.mockReturnValue(mockAssessment);
      mockAssessmentRepository.save.mockResolvedValue(mockAssessment);
      mockAssessmentRepository.findOne.mockResolvedValue({
        ...mockAssessment,
        assessor: { id: 'user-123', email: 'test@example.com' },
        risk: mockRisk,
      } as any);

      const result = await service.create(createDto, 'user-123', 'org-123');

      expect(mockRiskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'risk-123' },
      });
      expect(mockAssessmentRepository.create).toHaveBeenCalled();
      expect(mockAssessmentRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if risk not found', async () => {
      mockRiskRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto, 'user-123')).rejects.toThrow(NotFoundException);
    });

    it('should validate assessment method', async () => {
      const createDtoWithMethod: CreateRiskAssessmentDto = {
        risk_id: 'risk-123',
        assessment_type: AssessmentType.CURRENT,
        likelihood: 3,
        impact: 4,
        assessment_method: 'invalid-method',
      };

      mockRiskRepository.findOne.mockResolvedValue(mockRisk);
      // Mock to return methods that don't include 'invalid-method'
      mockRiskSettingsService.getActiveAssessmentMethods = jest.fn().mockResolvedValue([
        { id: 'valid-method', name: 'Valid Method' },
      ]);

      // The service validates the method and throws if invalid
      await expect(service.create(createDtoWithMethod, 'user-123', 'org-123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should calculate risk score and level', async () => {
      mockRiskRepository.findOne.mockResolvedValue(mockRisk);
      mockRiskSettingsService.getActiveAssessmentMethods.mockResolvedValue([
        { id: 'qualitative_5x5', name: '5x5 Qualitative' },
      ]);
      mockRiskSettingsService.getRiskLevelForScore.mockResolvedValue(RiskLevel.HIGH);
      mockRiskSettingsService.exceedsRiskAppetite.mockResolvedValue(false);
      mockAssessmentRepository.create.mockReturnValue(mockAssessment);
      mockAssessmentRepository.save.mockResolvedValue(mockAssessment);
      mockAssessmentRepository.findOne.mockResolvedValue({
        ...mockAssessment,
        assessor: { id: 'user-123', email: 'test@example.com' },
        risk: mockRisk,
      } as any);

      await service.create(createDto, 'user-123', 'org-123');

      expect(mockAssessmentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          risk_score: 12, // 3 * 4
        }),
      );
      // risk_level is set by getRiskLevelForScore, which we've mocked to return HIGH
      const createdCall = mockAssessmentRepository.create.mock.calls[0][0];
      expect(createdCall.risk_score).toBe(12);
    });

    it('should check if risk exceeds appetite', async () => {
      mockRiskRepository.findOne.mockResolvedValue(mockRisk);
      mockRiskSettingsService.getActiveAssessmentMethods.mockResolvedValue([
        { id: 'qualitative_5x5', name: '5x5 Qualitative' },
      ]);
      mockRiskSettingsService.getRiskLevelForScore.mockResolvedValue(RiskLevel.HIGH);
      mockRiskSettingsService.exceedsRiskAppetite.mockResolvedValue(true);
      mockAssessmentRepository.create.mockReturnValue(mockAssessment);
      mockAssessmentRepository.save.mockResolvedValue(mockAssessment);
      mockAssessmentRepository.findOne.mockResolvedValue({
        ...mockAssessment,
        assessor: { id: 'user-123', email: 'test@example.com' },
        risk: mockRisk,
      } as any);

      await service.create(createDto, 'user-123', 'org-123');

      expect(mockRiskSettingsService.exceedsRiskAppetite).toHaveBeenCalledWith(12, 'org-123');
    });
  });

  describe('compareAssessments', () => {
    it('should compare inherent, current, and target assessments', async () => {
      const assessments = [
        { ...mockAssessment, assessment_type: AssessmentType.INHERENT, risk_score: 20 },
        { ...mockAssessment, id: 'assessment-456', assessment_type: AssessmentType.CURRENT, risk_score: 12 },
        { ...mockAssessment, id: 'assessment-789', assessment_type: AssessmentType.TARGET, risk_score: 6 },
      ];
      mockAssessmentRepository.find.mockResolvedValue(assessments);

      const result = await service.compareAssessments('risk-123');

      expect(result.inherent).toBeDefined();
      expect(result.current).toBeDefined();
      expect(result.target).toBeDefined();
      expect(result.risk_reduction_from_inherent).toBeDefined();
      expect(result.gap_to_target).toBeDefined();
    });

    it('should handle missing assessment types', async () => {
      const assessments = [
        { ...mockAssessment, assessment_type: AssessmentType.CURRENT, risk_score: 12 },
      ];
      mockAssessmentRepository.find.mockResolvedValue(assessments);

      const result = await service.compareAssessments('risk-123');

      expect(result.current).toBeDefined();
      expect(result.inherent).toBeUndefined();
      expect(result.target).toBeUndefined();
    });
  });

  describe('getAssessmentHistory', () => {
    it('should return assessment history with limit', async () => {
      const assessments = Array(15).fill(mockAssessment).map((a, i) => ({
        ...a,
        id: `assessment-${i}`,
      }));
      mockAssessmentRepository.find.mockResolvedValue(assessments.slice(0, 10));

      const result = await service.getAssessmentHistory('risk-123', 10);

      expect(result).toHaveLength(10);
      expect(mockAssessmentRepository.find).toHaveBeenCalledWith({
        where: { risk_id: 'risk-123' },
        relations: ['assessor'],
        order: { assessment_date: 'DESC', created_at: 'DESC' },
        take: 10,
      });
    });

    it('should use default limit when not provided', async () => {
      mockAssessmentRepository.find.mockResolvedValue([mockAssessment]);

      await service.getAssessmentHistory('risk-123');

      expect(mockAssessmentRepository.find).toHaveBeenCalledWith({
        where: { risk_id: 'risk-123' },
        relations: ['assessor'],
        order: { assessment_date: 'DESC', created_at: 'DESC' },
        take: 10,
      });
    });
  });

  describe('getLikelihoodScaleDescriptions', () => {
    it('should return likelihood scale from settings', async () => {
      const result = await service.getLikelihoodScaleDescriptions('org-123');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(mockRiskSettingsService.getLikelihoodScale).toHaveBeenCalledWith('org-123');
    });
  });

  describe('getImpactScaleDescriptions', () => {
    it('should return impact scale from settings', async () => {
      const result = await service.getImpactScaleDescriptions('org-123');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(mockRiskSettingsService.getImpactScale).toHaveBeenCalledWith('org-123');
    });
  });
});



