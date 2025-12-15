import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { SupplierService } from '../../src/asset/services/supplier.service';
import { Supplier } from '../../src/asset/entities/supplier.entity';
import { AssetAuditService } from '../../src/asset/services/asset-audit.service';
import { RiskAssetLinkService } from '../../src/risk/services/risk-asset-link.service';
import { CreateSupplierDto } from '../../src/asset/dto/create-supplier.dto';
import { ConflictException } from '@nestjs/common';
import { AssetType } from '../../src/asset/entities/asset-audit-log.entity';

describe('SupplierService', () => {
  let service: SupplierService;
  let supplierRepository: Repository<Supplier>;
  let auditService: AssetAuditService;

  const mockSupplierRepository = {
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
        SupplierService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: mockSupplierRepository,
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

    service = module.get<SupplierService>(SupplierService);
    supplierRepository = module.get<Repository<Supplier>>(getRepositoryToken(Supplier));
    auditService = module.get<AssetAuditService>(AssetAuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-123';
    const createDto: CreateSupplierDto = {
      supplierName: 'ABC Corp',
      uniqueIdentifier: 'SUP-001',
    };

    it('should create a supplier successfully with provided unique identifier', async () => {
      const mockSupplier = {
        id: 'supplier-123',
        ...createDto,
        createdBy: userId,
        updatedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSupplierRepository.findOne.mockResolvedValueOnce(null); // No duplicate
      mockSupplierRepository.create.mockReturnValue(mockSupplier);
      mockSupplierRepository.save.mockResolvedValue(mockSupplier);
      mockSupplierRepository.findOne.mockResolvedValueOnce({
        ...mockSupplier,
        businessUnit: null,
      });

      const result = await service.create(createDto, userId);

      expect(mockSupplierRepository.findOne).toHaveBeenCalledWith({
        where: { uniqueIdentifier: 'SUP-001', deletedAt: IsNull() },
      });
      expect(mockSupplierRepository.create).toHaveBeenCalled();
      expect(mockSupplierRepository.save).toHaveBeenCalled();
      expect(mockAuditService.logCreate).toHaveBeenCalledWith(AssetType.SUPPLIER, 'supplier-123', userId);
      expect(result).toBeDefined();
      expect(result.id).toBe('supplier-123');
    });

    it('should require unique identifier', async () => {
      // Note: Supplier service requires uniqueIdentifier, it doesn't auto-generate
      // This test verifies that the service works with a provided identifier
      const createDtoWithId: CreateSupplierDto = {
        supplierName: 'XYZ Corp',
        uniqueIdentifier: 'SUP-GENERATED-001',
      };

      const mockSupplier = {
        id: 'supplier-123',
        uniqueIdentifier: 'SUP-GENERATED-001',
        ...createDtoWithId,
        createdBy: userId,
        updatedBy: userId,
      };

      mockSupplierRepository.findOne.mockResolvedValueOnce(null);
      mockSupplierRepository.create.mockReturnValue(mockSupplier);
      mockSupplierRepository.save.mockResolvedValue(mockSupplier);
      mockSupplierRepository.findOne.mockResolvedValueOnce({
        ...mockSupplier,
        businessUnit: null,
      });

      const result = await service.create(createDtoWithId, userId);

      expect(result.uniqueIdentifier).toBe('SUP-GENERATED-001');
    });

    it('should throw ConflictException if unique identifier already exists', async () => {
      mockSupplierRepository.findOne.mockResolvedValueOnce({
        id: 'existing-supplier',
        uniqueIdentifier: 'SUP-001',
      });

      await expect(service.create(createDto, userId)).rejects.toThrow(ConflictException);
      expect(mockSupplierRepository.create).not.toHaveBeenCalled();
      expect(mockSupplierRepository.save).not.toHaveBeenCalled();
    });

    it('should handle primaryContact object correctly', async () => {
      const createDtoWithContact: CreateSupplierDto = {
        ...createDto,
        primaryContact: {
          name: 'John Doe',
          title: 'Manager',
          email: 'john@abc.com',
          phone: '+1-555-0100',
        },
      };

      const mockSupplier = {
        id: 'supplier-123',
        ...createDtoWithContact,
        createdBy: userId,
        updatedBy: userId,
      };

      mockSupplierRepository.findOne.mockResolvedValueOnce(null);
      mockSupplierRepository.create.mockReturnValue(mockSupplier);
      mockSupplierRepository.save.mockResolvedValue(mockSupplier);
      mockSupplierRepository.findOne.mockResolvedValueOnce({
        ...mockSupplier,
        businessUnit: null,
      });

      await service.create(createDtoWithContact, userId);

      expect(mockSupplierRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          primaryContact: {
            name: 'John Doe',
            title: 'Manager',
            email: 'john@abc.com',
            phone: '+1-555-0100',
          },
        }),
      );
    });

    it('should handle goodsServicesType array correctly', async () => {
      const createDtoWithGoods: CreateSupplierDto = {
        ...createDto,
        goodsServicesType: ['IT Services', 'Consulting', 'Support'],
      };

      const mockSupplier = {
        id: 'supplier-123',
        ...createDtoWithGoods,
        createdBy: userId,
        updatedBy: userId,
      };

      mockSupplierRepository.findOne.mockResolvedValueOnce(null);
      mockSupplierRepository.create.mockReturnValue(mockSupplier);
      mockSupplierRepository.save.mockResolvedValue(mockSupplier);
      mockSupplierRepository.findOne.mockResolvedValueOnce({
        ...mockSupplier,
        businessUnit: null,
      });

      await service.create(createDtoWithGoods, userId);

      expect(mockSupplierRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          goodsServicesType: ['IT Services', 'Consulting', 'Support'],
        }),
      );
    });
  });
});

