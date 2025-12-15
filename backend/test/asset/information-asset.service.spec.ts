import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InformationAssetService } from '../../src/asset/services/information-asset.service';
import { InformationAsset } from '../../src/asset/entities/information-asset.entity';
import { AssetAuditService } from '../../src/asset/services/asset-audit.service';
import { RiskAssetLinkService } from '../../src/risk/services/risk-asset-link.service';
import { CreateInformationAssetDto } from '../../src/asset/dto/create-information-asset.dto';
import { ClassificationLevel } from '../../src/asset/entities/information-asset.entity';

describe('InformationAssetService', () => {
  let service: InformationAssetService;
  let assetRepository: Repository<InformationAsset>;
  let auditService: AssetAuditService;

  const mockAssetRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockAuditService = {
    logCreate: jest.fn(),
    logUpdate: jest.fn(),
    logDelete: jest.fn(),
  };

  const mockRiskAssetLinkService = {
    getRisksForAsset: jest.fn().mockResolvedValue([]),
    getAssetRiskScore: jest.fn().mockResolvedValue({ total_risks: 0, aggregated_risk_score: 0 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InformationAssetService,
        {
          provide: getRepositoryToken(InformationAsset),
          useValue: mockAssetRepository,
        },
        {
          provide: AssetAuditService,
          useValue: mockAuditService,
        },
        {
          provide: RiskAssetLinkService,
          useValue: mockRiskAssetLinkService,
        },
      ],
    }).compile();

    service = module.get<InformationAssetService>(InformationAssetService);
    assetRepository = module.get<Repository<InformationAsset>>(getRepositoryToken(InformationAsset));
    auditService = module.get<AssetAuditService>(AssetAuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-123';
    const createDto: CreateInformationAssetDto = {
      name: 'Customer Database',
      informationType: 'Customer Records',
      classificationLevel: ClassificationLevel.CONFIDENTIAL,
    };

    it('should create an information asset successfully', async () => {
      const mockAsset = {
        id: 'asset-123',
        ...createDto,
        createdBy: userId,
        updatedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock findOne to return null (no duplicate) first, then return the created asset
      mockAssetRepository.findOne
        .mockResolvedValueOnce(null) // No duplicate found
        .mockResolvedValueOnce({
          ...mockAsset,
          informationOwner: null,
          assetCustodian: null,
          businessUnit: null,
        }); // Return created asset after save
      mockAssetRepository.create.mockReturnValue(mockAsset);
      mockAssetRepository.save.mockResolvedValue(mockAsset);

      const result = await service.create(createDto, userId);

      expect(mockAssetRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createDto,
          createdBy: userId,
          updatedBy: userId,
        }),
      );
      expect(mockAssetRepository.save).toHaveBeenCalled();
      expect(mockAuditService.logCreate).toHaveBeenCalledWith('information', 'asset-123', userId);
      expect(result).toBeDefined();
      expect(result.id).toBe('asset-123');
    });

    it('should handle date fields correctly', async () => {
      const createDtoWithDates: CreateInformationAssetDto = {
        ...createDto,
        classificationDate: '2024-01-15',
        reclassificationDate: '2024-06-15',
      };

      const mockAsset = {
        id: 'asset-123',
        ...createDtoWithDates,
        classificationDate: new Date('2024-01-15'),
        reclassificationDate: new Date('2024-06-15'),
        createdBy: userId,
        updatedBy: userId,
      };

      // Mock findOne to return null (no duplicate) first, then return the created asset
      mockAssetRepository.findOne
        .mockResolvedValueOnce(null) // No duplicate found
        .mockResolvedValueOnce({
          ...mockAsset,
          informationOwner: null,
          assetCustodian: null,
          businessUnit: null,
        }); // Return created asset after save
      mockAssetRepository.create.mockReturnValue(mockAsset);
      mockAssetRepository.save.mockResolvedValue(mockAsset);

      await service.create(createDtoWithDates, userId);

      expect(mockAssetRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          classificationDate: expect.any(Date),
          reclassificationDate: expect.any(Date),
        }),
      );
    });

    it('should handle optional fields correctly', async () => {
      const createDtoWithOptional: CreateInformationAssetDto = {
        ...createDto,
        assetLocation: 'Primary Data Center',
        storageMedium: 'Database',
        retentionPeriod: '7 years',
        complianceRequirements: ['GDPR', 'CCPA'],
      };

      const mockAsset = {
        id: 'asset-123',
        ...createDtoWithOptional,
        createdBy: userId,
        updatedBy: userId,
      };

      // Mock findOne to return null (no duplicate) first, then return the created asset
      mockAssetRepository.findOne
        .mockResolvedValueOnce(null) // No duplicate found
        .mockResolvedValueOnce({
          ...mockAsset,
          informationOwner: null,
          assetCustodian: null,
          businessUnit: null,
        }); // Return created asset after save
      mockAssetRepository.create.mockReturnValue(mockAsset);
      mockAssetRepository.save.mockResolvedValue(mockAsset);

      const result = await service.create(createDtoWithOptional, userId);

      expect(result).toBeDefined();
      expect(mockAssetRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          assetLocation: 'Primary Data Center',
          storageMedium: 'Database',
          retentionPeriod: '7 years',
          complianceRequirements: ['GDPR', 'CCPA'],
        }),
      );
    });
  });
});

