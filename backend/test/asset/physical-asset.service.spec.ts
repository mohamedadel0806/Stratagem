import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { PhysicalAssetService } from '../../src/asset/services/physical-asset.service';
import { PhysicalAsset } from '../../src/asset/entities/physical-asset.entity';
import { AssetDependency } from '../../src/asset/entities/asset-dependency.entity';
import { AssetAuditService } from '../../src/asset/services/asset-audit.service';
import { RiskAssetLinkService } from '../../src/risk/services/risk-asset-link.service';
import { CreatePhysicalAssetDto } from '../../src/asset/dto/create-physical-asset.dto';
import { ConflictException } from '@nestjs/common';
import { CriticalityLevel, ConnectivityStatus, NetworkApprovalStatus } from '../../src/asset/entities/physical-asset.entity';

describe('PhysicalAssetService', () => {
  let service: PhysicalAssetService;
  let assetRepository: Repository<PhysicalAsset>;
  let dependencyRepository: Repository<AssetDependency>;
  let auditService: AssetAuditService;

  const mockAssetRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockDependencyRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
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
        PhysicalAssetService,
        {
          provide: getRepositoryToken(PhysicalAsset),
          useValue: mockAssetRepository,
        },
        {
          provide: getRepositoryToken(AssetDependency),
          useValue: mockDependencyRepository,
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

    service = module.get<PhysicalAssetService>(PhysicalAssetService);
    assetRepository = module.get<Repository<PhysicalAsset>>(getRepositoryToken(PhysicalAsset));
    dependencyRepository = module.get<Repository<AssetDependency>>(getRepositoryToken(AssetDependency));
    auditService = module.get<AssetAuditService>(AssetAuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-123';
    const createDto: CreatePhysicalAssetDto = {
      assetDescription: 'Test Server',
      uniqueIdentifier: 'PHY-001',
      assetTypeId: 'asset-type-uuid-123',
      criticalityLevel: CriticalityLevel.HIGH,
      connectivityStatus: ConnectivityStatus.CONNECTED,
      networkApprovalStatus: NetworkApprovalStatus.APPROVED,
    };

    it('should create a physical asset successfully with provided unique identifier', async () => {
      const mockAsset = {
        id: 'asset-123',
        uniqueIdentifier: 'PHY-001',
        ...createDto,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAssetRepository.findOne.mockResolvedValueOnce(null); // No duplicate
      mockAssetRepository.create.mockReturnValue(mockAsset);
      mockAssetRepository.save.mockResolvedValue(mockAsset);
      mockAssetRepository.findOne.mockResolvedValueOnce({
        ...mockAsset,
        owner: null,
        assetType: null,
        businessUnit: null,
      });

      const result = await service.create(createDto, userId);

      expect(mockAssetRepository.findOne).toHaveBeenCalledWith({
        where: { uniqueIdentifier: 'PHY-001', deletedAt: IsNull() },
      });
      expect(mockAssetRepository.create).toHaveBeenCalled();
      expect(mockAssetRepository.save).toHaveBeenCalled();
      expect(mockAuditService.logCreate).toHaveBeenCalledWith('physical', 'asset-123', userId);
      expect(result).toBeDefined();
      expect(result.id).toBe('asset-123');
    });

    it('should create a physical asset with provided unique identifier', async () => {
      const createDtoWithId: CreatePhysicalAssetDto = {
        ...createDto,
        uniqueIdentifier: 'CUSTOM-001',
      };

      const mockAsset = {
        id: 'asset-123',
        uniqueIdentifier: 'CUSTOM-001',
        ...createDtoWithId,
        createdBy: userId,
      };

      mockAssetRepository.findOne.mockResolvedValueOnce(null); // No duplicate
      mockAssetRepository.create.mockReturnValue(mockAsset);
      mockAssetRepository.save.mockResolvedValue(mockAsset);
      mockAssetRepository.findOne.mockResolvedValueOnce({
        ...mockAsset,
        owner: null,
        assetType: null,
        businessUnit: null,
      });

      const result = await service.create(createDtoWithId, userId);

      expect(mockAssetRepository.findOne).toHaveBeenCalledWith({
        where: { uniqueIdentifier: 'CUSTOM-001', deletedAt: IsNull() },
      });
      expect(result.uniqueIdentifier).toBe('CUSTOM-001');
    });

    it('should throw ConflictException if unique identifier already exists', async () => {
      const createDtoWithId: CreatePhysicalAssetDto = {
        ...createDto,
        uniqueIdentifier: 'EXISTING-001',
      };

      mockAssetRepository.findOne.mockResolvedValueOnce({
        id: 'existing-asset',
        uniqueIdentifier: 'EXISTING-001',
      });

      await expect(service.create(createDtoWithId, userId)).rejects.toThrow(ConflictException);
      expect(mockAssetRepository.create).not.toHaveBeenCalled();
      expect(mockAssetRepository.save).not.toHaveBeenCalled();
    });

    it('should handle date fields correctly', async () => {
      const createDtoWithDates: CreatePhysicalAssetDto = {
        ...createDto,
        purchaseDate: '2024-01-15',
        warrantyExpiry: '2025-01-15',
      };

      const mockAsset = {
        id: 'asset-123',
        uniqueIdentifier: 'PHY-001',
        ...createDtoWithDates,
        purchaseDate: new Date('2024-01-15'),
        warrantyExpiry: new Date('2025-01-15'),
        createdBy: userId,
      };

      jest.spyOn(service as any, 'generateUniqueIdentifier').mockResolvedValue('PHY-001');
      mockAssetRepository.findOne.mockResolvedValueOnce(null);
      mockAssetRepository.create.mockReturnValue(mockAsset);
      mockAssetRepository.save.mockResolvedValue(mockAsset);
      mockAssetRepository.findOne.mockResolvedValueOnce({
        ...mockAsset,
        owner: null,
        assetType: null,
        businessUnit: null,
      });

      await service.create(createDtoWithDates, userId);

      expect(mockAssetRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          purchaseDate: expect.any(Date),
          warrantyExpiry: expect.any(Date),
        }),
      );
    });

    it('should handle array fields correctly', async () => {
      const createDtoWithArrays: CreatePhysicalAssetDto = {
        ...createDto,
        ipAddresses: ['192.168.1.1', '192.168.1.2'],
        macAddresses: ['00:1B:44:11:3A:B7'],
        complianceRequirements: ['GDPR', 'HIPAA'],
      };

      const mockAsset = {
        id: 'asset-123',
        uniqueIdentifier: 'PHY-001',
        ...createDtoWithArrays,
        createdBy: userId,
      };

      jest.spyOn(service as any, 'generateUniqueIdentifier').mockResolvedValue('PHY-001');
      mockAssetRepository.findOne.mockResolvedValueOnce(null);
      mockAssetRepository.create.mockReturnValue(mockAsset);
      mockAssetRepository.save.mockResolvedValue(mockAsset);
      mockAssetRepository.findOne.mockResolvedValueOnce({
        ...mockAsset,
        owner: null,
        assetType: null,
        businessUnit: null,
      });

      await service.create(createDtoWithArrays, userId);

      expect(mockAssetRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ipAddresses: ['192.168.1.1', '192.168.1.2'],
          macAddresses: ['00:1B:44:11:3A:B7'],
          complianceRequirements: ['GDPR', 'HIPAA'],
        }),
      );
    });
  });
});

