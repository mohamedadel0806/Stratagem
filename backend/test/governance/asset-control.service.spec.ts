import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In, UpdateResult } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AssetControlService } from '../../src/governance/unified-controls/services/asset-control.service';
import { ControlAssetMapping, AssetType } from '../../src/governance/unified-controls/entities/control-asset-mapping.entity';
import { UnifiedControl, ImplementationStatus } from '../../src/governance/unified-controls/entities/unified-control.entity';

describe('AssetControlService', () => {
  let service: AssetControlService;
  let mappingRepository: Repository<ControlAssetMapping>;
  let controlRepository: Repository<UnifiedControl>;

  const mockControl = {
    id: 'control-1',
    control_identifier: 'AC-1',
    title: 'Access Control',
    description: 'Access control policy',
    type: 'Policy',
    domain: 'Access Control',
    implementation_status: ImplementationStatus.IMPLEMENTED,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  } as unknown as UnifiedControl;

  const mockMapping = {
    id: 'mapping-1',
    unified_control_id: 'control-1',
    asset_id: 'asset-1',
    asset_type: AssetType.APPLICATION,
    implementation_status: ImplementationStatus.IMPLEMENTED,
    implementation_notes: 'Test notes',
    is_automated: false,
    mapped_by: 'user-1',
    mapped_at: new Date(),
    last_test_date: null,
    last_test_result: null,
    effectiveness_score: 85,
    updated_at: new Date(),
  } as unknown as ControlAssetMapping;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetControlService,
        {
          provide: getRepositoryToken(ControlAssetMapping),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UnifiedControl),
          useValue: {
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AssetControlService>(AssetControlService);
    mappingRepository = module.get<Repository<ControlAssetMapping>>(
      getRepositoryToken(ControlAssetMapping),
    );
    controlRepository = module.get<Repository<UnifiedControl>>(
      getRepositoryToken(UnifiedControl),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('mapControlToAsset', () => {
    it('should map a control to an asset successfully', async () => {
      jest.spyOn(controlRepository, 'findOne').mockResolvedValue(mockControl);
      jest.spyOn(mappingRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(mappingRepository, 'create').mockReturnValue(mockMapping);
      jest.spyOn(mappingRepository, 'save').mockResolvedValue(mockMapping);

      const result = await service.mapControlToAsset(
        'control-1',
        {
          asset_id: 'asset-1',
          asset_type: AssetType.APPLICATION,
          implementation_status: ImplementationStatus.IMPLEMENTED,
        },
        'user-1',
      );

      expect(result).toEqual(mockMapping);
      expect(controlRepository.findOne).toHaveBeenCalledWith({ where: { id: 'control-1' } });
      expect(mappingRepository.create).toHaveBeenCalled();
      expect(mappingRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if control does not exist', async () => {
      jest.spyOn(controlRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.mapControlToAsset(
          'control-99',
          {
            asset_id: 'asset-1',
            asset_type: AssetType.APPLICATION,
          },
          'user-1',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if mapping already exists', async () => {
      jest.spyOn(controlRepository, 'findOne').mockResolvedValue(mockControl);
      jest.spyOn(mappingRepository, 'findOne').mockResolvedValue(mockMapping);

      await expect(
        service.mapControlToAsset(
          'control-1',
          {
            asset_id: 'asset-1',
            asset_type: AssetType.APPLICATION,
          },
          'user-1',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('mapControlToAssets', () => {
    it('should map a control to multiple assets', async () => {
      const mappings: any = [mockMapping, { ...mockMapping, id: 'mapping-2', asset_id: 'asset-2' }];

      jest.spyOn(controlRepository, 'findOne').mockResolvedValue(mockControl);
      jest.spyOn(mappingRepository, 'find').mockResolvedValue([]);
      jest.spyOn(mappingRepository, 'create').mockReturnValue(mockMapping);
      jest.spyOn(mappingRepository, 'save').mockResolvedValue(mappings);

      const result = await service.mapControlToAssets(
        'control-1',
        {
          asset_ids: ['asset-1', 'asset-2'],
          asset_type: AssetType.APPLICATION,
        },
        'user-1',
      );

      expect(result).toEqual(mappings);
      expect(mappingRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if some assets already mapped', async () => {
      jest.spyOn(controlRepository, 'findOne').mockResolvedValue(mockControl);
      jest.spyOn(mappingRepository, 'find').mockResolvedValue([mockMapping]);

      await expect(
        service.mapControlToAssets(
          'control-1',
          {
            asset_ids: ['asset-1', 'asset-2'],
            asset_type: AssetType.APPLICATION,
          },
          'user-1',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAssetControls', () => {
    it('should get all controls for an asset with pagination', async () => {
      const result = { mappings: [mockMapping], total: 1 };

      jest.spyOn(mappingRepository, 'findAndCount').mockResolvedValue([
        [mockMapping],
        1,
      ]);

      const response = await service.getAssetControls('asset-1', AssetType.APPLICATION, 1, 25);

      expect(response).toEqual(result);
      expect(mappingRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            asset_id: 'asset-1',
            asset_type: AssetType.APPLICATION,
          },
        }),
      );
    });

    it('should apply pagination correctly', async () => {
      jest.spyOn(mappingRepository, 'findAndCount').mockResolvedValue([
        [mockMapping],
        1,
      ]);

      await service.getAssetControls('asset-1', AssetType.APPLICATION, 2, 10);

      expect(mappingRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });
  });

  describe('getControlAssets', () => {
    it('should get all assets for a control', async () => {
      const result = { mappings: [mockMapping], total: 1 };

      jest.spyOn(mappingRepository, 'findAndCount').mockResolvedValue([
        [mockMapping],
        1,
      ]);

      const response = await service.getControlAssets('control-1', 1, 25);

      expect(response).toEqual(result);
      expect(mappingRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('updateMapping', () => {
    it('should update a control-asset mapping', async () => {
      const updatedMapping = {
        ...mockMapping,
        effectiveness_score: 90,
      };

      jest.spyOn(mappingRepository, 'findOne').mockResolvedValue(mockMapping);
      jest.spyOn(mappingRepository, 'save').mockResolvedValue(updatedMapping);

      const result = await service.updateMapping('control-1', 'asset-1', {
        effectiveness_score: 90,
      });

      expect(result).toEqual(updatedMapping);
      expect(mappingRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if mapping does not exist', async () => {
      jest.spyOn(mappingRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateMapping('control-1', 'asset-1', {
          effectiveness_score: 90,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMapping', () => {
    it('should delete a control-asset mapping', async () => {
      jest.spyOn(mappingRepository, 'findOne').mockResolvedValue(mockMapping);
      jest.spyOn(mappingRepository, 'remove').mockResolvedValue(mockMapping);

      await service.deleteMapping('control-1', 'asset-1');

      expect(mappingRepository.remove).toHaveBeenCalledWith(mockMapping);
    });

    it('should throw NotFoundException if mapping does not exist', async () => {
      jest.spyOn(mappingRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteMapping('control-1', 'asset-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAssetComplianceScore', () => {
    it('should calculate compliance score for an asset', async () => {
      const mappings = [
        {
          ...mockMapping,
          implementation_status: ImplementationStatus.IMPLEMENTED,
        },
        {
          ...mockMapping,
          asset_id: 'asset-2',
          implementation_status: ImplementationStatus.PLANNED,
        },
      ];

      jest.spyOn(mappingRepository, 'find').mockResolvedValue(mappings);

      const result = await service.getAssetComplianceScore('asset-1', AssetType.APPLICATION);

      expect(result.asset_id).toBe('asset-1');
      expect(result.asset_type).toBe(AssetType.APPLICATION);
      expect(result.total_controls).toBe(2);
      expect(result.implemented_controls).toBe(1);
      expect(result.compliance_percentage).toBeDefined();
    });

    it('should exclude NOT_APPLICABLE from compliance calculation', async () => {
      const mappings = [
        {
          ...mockMapping,
          implementation_status: ImplementationStatus.IMPLEMENTED,
        },
        {
          ...mockMapping,
          asset_id: 'asset-2',
          implementation_status: ImplementationStatus.NOT_APPLICABLE,
        },
      ];

      jest.spyOn(mappingRepository, 'find').mockResolvedValue(mappings);

      const result = await service.getAssetComplianceScore('asset-1', AssetType.APPLICATION);

      expect(result.total_controls).toBe(2);
      expect(result.compliance_percentage).toBe(100);
    });
  });

  describe('getControlEffectiveness', () => {
    it('should calculate effectiveness score for a control', async () => {
      const mappings = [
        { ...mockMapping, effectiveness_score: 85 },
        { ...mockMapping, asset_id: 'asset-2', effectiveness_score: 95 },
      ];

      jest.spyOn(mappingRepository, 'find').mockResolvedValue(mappings);
      jest.spyOn(controlRepository, 'findOne').mockResolvedValue(mockControl);

      const result = await service.getControlEffectiveness('control-1');

      expect(result.control_id).toBe('control-1');
      expect(result.control_identifier).toBe('AC-1');
      expect(result.total_assets).toBe(2);
      expect(result.average_effectiveness).toBeCloseTo(90);
    });

    it('should throw NotFoundException if control does not exist', async () => {
      jest.spyOn(mappingRepository, 'find').mockResolvedValue([]);
      jest.spyOn(controlRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getControlEffectiveness('control-99')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAssetControlMatrix', () => {
    it('should retrieve asset-control matrix', async () => {
      const mappingWithControl: any = {
        ...mockMapping,
        unified_control: mockControl,
      };

      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mappingWithControl]),
      };

      jest.spyOn(mappingRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getAssetControlMatrix();

      expect(result).toBeDefined();
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should filter by asset type', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      jest.spyOn(mappingRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      await service.getAssetControlMatrix(AssetType.APPLICATION);

      expect(mockQueryBuilder.where).toHaveBeenCalled();
    });
  });

  describe('getMatrixStatistics', () => {
    it('should calculate matrix statistics', async () => {
      jest.spyOn(mappingRepository, 'find').mockResolvedValue([mockMapping]);
      jest.spyOn(controlRepository, 'find').mockResolvedValue([mockControl]);

      const result = await service.getMatrixStatistics();

      expect(result.total_mappings).toBe(1);
      expect(result.by_implementation_status).toBeDefined();
      expect(result.by_asset_type).toBeDefined();
      expect(result.average_effectiveness).toBeDefined();
      expect(result.unmapped_controls_count).toBe(0);
    });
  });

  describe('bulkUpdateStatus', () => {
    it('should bulk update implementation status', async () => {
      const updateResult: any = { affected: 2 };

      jest.spyOn(mappingRepository, 'update').mockResolvedValue(updateResult);

      const result = await service.bulkUpdateStatus(
        {
          mapping_ids: ['mapping-1', 'mapping-2'],
          implementation_status: ImplementationStatus.IMPLEMENTED,
        },
        'user-1',
      );

      expect(result.updated).toBe(2);
      expect(mappingRepository.update).toHaveBeenCalledWith(
        { id: In(['mapping-1', 'mapping-2']) },
        expect.objectContaining({
          implementation_status: ImplementationStatus.IMPLEMENTED,
        }),
      );
    });
  });

  describe('getUnmappedControls', () => {
    it('should retrieve unmapped controls with pagination', async () => {
      const unmappedControl = { ...mockControl, id: 'control-2' };

      jest.spyOn(controlRepository, 'findAndCount').mockResolvedValue([
        [mockControl, unmappedControl],
        2,
      ]);

      const mockQueryBuilder: any = {
        distinct: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([{ mapping_unified_control_id: 'control-1' }]),
      };

      jest.spyOn(mappingRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getUnmappedControls(1, 25);

      expect(result.controls).toBeDefined();
      expect(controlRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('getComprehensiveStatistics', () => {
    it('should return comprehensive statistics', async () => {
      jest.spyOn(controlRepository, 'find').mockResolvedValue([mockControl]);
      jest.spyOn(mappingRepository, 'find').mockResolvedValue([mockMapping]);

      const result = await service.getComprehensiveStatistics();

      expect(result.total_controls).toBe(1);
      expect(result.total_mappings).toBe(1);
      expect(result.average_compliance_score).toBeDefined();
      expect(result.average_effectiveness_score).toBeDefined();
      expect(result.implementation_distribution).toBeDefined();
    });
  });

  describe('getComplianceByAssetType', () => {
    it('should return compliance statistics by asset type', async () => {
      jest.spyOn(mappingRepository, 'find').mockResolvedValue([mockMapping]);

      const result = await service.getComplianceByAssetType();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('asset_type');
      expect(result[0]).toHaveProperty('compliance_percentage');
    });
  });
});
