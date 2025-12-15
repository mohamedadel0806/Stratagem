import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoftwareAssetService } from '../../src/asset/services/software-asset.service';
import { SoftwareAsset } from '../../src/asset/entities/software-asset.entity';
import { AssetAuditService } from '../../src/asset/services/asset-audit.service';
import { RiskAssetLinkService } from '../../src/risk/services/risk-asset-link.service';
import { CreateSoftwareAssetDto } from '../../src/asset/dto/create-software-asset.dto';

describe('SoftwareAssetService', () => {
  let service: SoftwareAssetService;
  let assetRepository: Repository<SoftwareAsset>;
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
        SoftwareAssetService,
        {
          provide: getRepositoryToken(SoftwareAsset),
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

    service = module.get<SoftwareAssetService>(SoftwareAssetService);
    assetRepository = module.get<Repository<SoftwareAsset>>(getRepositoryToken(SoftwareAsset));
    auditService = module.get<AssetAuditService>(AssetAuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-123';
    const createDto: CreateSoftwareAssetDto = {
      softwareName: 'Microsoft Office',
      versionNumber: '2021',
      vendorName: 'Microsoft',
    };

    it('should create a software asset successfully', async () => {
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
          vendor: null,
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
      expect(mockAuditService.logCreate).toHaveBeenCalledWith('software', 'asset-123', userId);
      expect(result).toBeDefined();
      expect(result.id).toBe('asset-123');
    });

    it('should handle vendorContact object correctly', async () => {
      // Reset mocks
      mockAssetRepository.findOne.mockClear();
      mockAssetRepository.create.mockClear();
      const createDtoWithContact: CreateSoftwareAssetDto = {
        ...createDto,
        vendorContact: {
          name: 'John Doe',
          email: 'john@microsoft.com',
          phone: '+1-555-0100',
        },
      };

      const mockAsset = {
        id: 'asset-123',
        ...createDtoWithContact,
        createdBy: userId,
        updatedBy: userId,
      };

      // Mock findOne to return null (no duplicate) first, then return the created asset
      mockAssetRepository.findOne
        .mockResolvedValueOnce(null) // No duplicate found
        .mockResolvedValueOnce({
          ...mockAsset,
          vendor: null,
          businessUnit: null,
        }); // Return created asset after save
      mockAssetRepository.create.mockReturnValue(mockAsset);
      mockAssetRepository.save.mockResolvedValue(mockAsset);

      await service.create(createDtoWithContact, userId);

      expect(mockAssetRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          vendorContact: {
            name: 'John Doe',
            email: 'john@microsoft.com',
            phone: '+1-555-0100',
          },
        }),
      );
    });

    it('should handle license fields correctly', async () => {
      const createDtoWithLicense: CreateSoftwareAssetDto = {
        ...createDto,
        licenseCount: 50,
        licenseExpiry: '2025-12-31',
      };

      const mockAsset = {
        id: 'asset-123',
        ...createDtoWithLicense,
        licenseExpiry: new Date('2025-12-31'),
        createdBy: userId,
        updatedBy: userId,
      };

      // Mock findOne to return null (no duplicate) first, then return the created asset
      mockAssetRepository.findOne
        .mockResolvedValueOnce(null) // No duplicate found
        .mockResolvedValueOnce({
          ...mockAsset,
          vendor: null,
          businessUnit: null,
        }); // Return created asset after save
      mockAssetRepository.create.mockReturnValue(mockAsset);
      mockAssetRepository.save.mockResolvedValue(mockAsset);

      await service.create(createDtoWithLicense, userId);

      expect(mockAssetRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          licenseCount: 50,
          licenseExpiry: expect.any(Date),
        }),
      );
    });
  });
});

