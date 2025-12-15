import { Test, TestingModule } from '@nestjs/testing';
import { InformationAssetImportHandler } from '../../src/asset/services/import-handlers/information-asset-import-handler';
import { InformationAssetService } from '../../src/asset/services/information-asset.service';
import { CreateInformationAssetDto } from '../../src/asset/dto/create-information-asset.dto';
import { ClassificationLevel } from '../../src/asset/entities/information-asset.entity';

describe('InformationAssetImportHandler', () => {
  let handler: InformationAssetImportHandler;
  let informationAssetService: InformationAssetService;

  const mockInformationAssetService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InformationAssetImportHandler,
        {
          provide: InformationAssetService,
          useValue: mockInformationAssetService,
        },
      ],
    }).compile();

    handler = module.get<InformationAssetImportHandler>(InformationAssetImportHandler);
    informationAssetService = module.get<InformationAssetService>(InformationAssetService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('mapFields', () => {
    it('should map CSV row to CreateInformationAssetDto correctly', () => {
      const row = {
        'Asset Name': 'Customer Database',
        'Information Type': 'Customer Records',
        'Data Classification': 'confidential',
        'Storage Location': 'Data Center A',
      };

      const mapping = {
        'Asset Name': 'name',
        'Information Type': 'informationType',
        'Data Classification': 'classificationLevel',
        'Storage Location': 'assetLocation',
      };

      const result = handler.mapFields(row, mapping);

      expect(result.name).toBe('Customer Database');
      expect(result.informationType).toBe('Customer Records');
      expect(result.classificationLevel).toBe('confidential');
      expect(result.assetLocation).toBe('Data Center A');
    });

    it('should handle informationType field correctly', () => {
      const row = {
        'Asset Name': 'Test Asset',
        'Information Type': 'Financial Data',
      };

      const mapping = {
        'Asset Name': 'name',
        'Information Type': 'informationType',
      };

      const result = handler.mapFields(row, mapping);

      expect(result.informationType).toBe('Financial Data');
    });
  });

  describe('validate', () => {
    it('should return empty array for valid data', () => {
      const data: CreateInformationAssetDto = {
        name: 'Customer Database',
        informationType: 'Customer Records',
        classificationLevel: ClassificationLevel.CONFIDENTIAL,
      };

      const errors = handler.validate(data);

      expect(errors).toEqual([]);
    });

    it('should return errors for missing required fields', () => {
      const data: Partial<CreateInformationAssetDto> = {
        name: 'Test Asset',
        // Missing informationType and classificationLevel
      };

      const errors = handler.validate(data as CreateInformationAssetDto);

      expect(errors.length).toBeGreaterThan(0);
      // The validation should catch at least one missing required field
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('createAsset', () => {
    it('should call InformationAssetService.create with correct data', async () => {
      const data: CreateInformationAssetDto = {
        name: 'Customer Database',
        informationType: 'Customer Records',
        classificationLevel: ClassificationLevel.CONFIDENTIAL,
      };

      const userId = 'user-123';
      const mockAsset = { id: 'asset-123', ...data };

      mockInformationAssetService.create.mockResolvedValue(mockAsset);

      const result = await handler.createAsset(data, userId);

      expect(mockInformationAssetService.create).toHaveBeenCalledWith(data, userId);
      expect(result).toEqual(mockAsset);
    });
  });

  // Note: getRequiredFields and getAssetType are not part of BaseImportHandler
  // They may be implemented differently or not needed for these handlers
});

