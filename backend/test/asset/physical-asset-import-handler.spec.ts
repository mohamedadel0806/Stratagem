import { Test, TestingModule } from '@nestjs/testing';
import { PhysicalAssetImportHandler } from '../../src/asset/services/import-handlers/physical-asset-import-handler';
import { PhysicalAssetService } from '../../src/asset/services/physical-asset.service';
import { CreatePhysicalAssetDto } from '../../src/asset/dto/create-physical-asset.dto';
import { CriticalityLevel, ConnectivityStatus, NetworkApprovalStatus } from '../../src/asset/entities/physical-asset.entity';

describe('PhysicalAssetImportHandler', () => {
  let handler: PhysicalAssetImportHandler;
  let physicalAssetService: PhysicalAssetService;

  const mockPhysicalAssetService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhysicalAssetImportHandler,
        {
          provide: PhysicalAssetService,
          useValue: mockPhysicalAssetService,
        },
      ],
    }).compile();

    handler = module.get<PhysicalAssetImportHandler>(PhysicalAssetImportHandler);
    physicalAssetService = module.get<PhysicalAssetService>(PhysicalAssetService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('mapFields', () => {
    it('should map CSV row to CreatePhysicalAssetDto correctly', () => {
      const row = {
        'Asset Description': 'Test Server',
        'Unique Identifier': 'PHY-001',
        'Location': 'Data Center A',
        'Criticality Level': 'high',
        'Connectivity Status': 'connected',
        'IP Addresses': '192.168.1.1,192.168.1.2',
      };

      const mapping = {
        'Asset Description': 'assetDescription',
        'Unique Identifier': 'uniqueIdentifier',
        'Location': 'physicalLocation',
        'Criticality Level': 'criticalityLevel',
        'Connectivity Status': 'connectivityStatus',
        'IP Addresses': 'ipAddresses',
      };

      const result = handler.mapFields(row, mapping);

      expect(result.assetDescription).toBe('Test Server');
      expect(result.uniqueIdentifier).toBe('PHY-001');
      expect(result.physicalLocation).toBe('Data Center A');
      expect(result.criticalityLevel).toBe('high');
      expect(result.connectivityStatus).toBe('connected');
      expect(result.ipAddresses).toEqual(['192.168.1.1', '192.168.1.2']);
    });

    it('should handle missing optional fields', () => {
      const row = {
        'Asset Description': 'Test Server',
      };

      const mapping = {
        'Asset Description': 'assetDescription',
      };

      const result = handler.mapFields(row, mapping);

      expect(result.assetDescription).toBe('Test Server');
      expect(result.uniqueIdentifier).toBeUndefined();
    });

    it('should parse comma-separated arrays correctly', () => {
      const row = {
        'Asset Description': 'Test Server',
        'MAC Addresses': '00:1B:44:11:3A:B7,00:1B:44:11:3A:B8',
      };

      const mapping = {
        'Asset Description': 'assetDescription',
        'MAC Addresses': 'macAddresses',
      };

      const result = handler.mapFields(row, mapping);

      expect(result.macAddresses).toEqual(['00:1B:44:11:3A:B7', '00:1B:44:11:3A:B8']);
    });
  });

  describe('validate', () => {
    it('should return empty array for valid data', () => {
      const data: CreatePhysicalAssetDto = {
        assetDescription: 'Test Server',
        uniqueIdentifier: 'PHY-001',
        criticalityLevel: CriticalityLevel.HIGH,
        connectivityStatus: ConnectivityStatus.CONNECTED,
        networkApprovalStatus: NetworkApprovalStatus.APPROVED,
      };

      const errors = handler.validate(data);

      expect(errors).toEqual([]);
    });

    it('should return errors for missing required fields', () => {
      const data: Partial<CreatePhysicalAssetDto> = {
        uniqueIdentifier: 'PHY-001',
        // Missing assetDescription
      };

      const errors = handler.validate(data as CreatePhysicalAssetDto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('assetDescription') || e.includes('description'))).toBe(true);
    });
  });

  describe('createAsset', () => {
    it('should call PhysicalAssetService.create with correct data', async () => {
      const data: CreatePhysicalAssetDto = {
        assetDescription: 'Test Server',
        uniqueIdentifier: 'PHY-001',
        criticalityLevel: CriticalityLevel.HIGH,
        connectivityStatus: ConnectivityStatus.CONNECTED,
        networkApprovalStatus: NetworkApprovalStatus.APPROVED,
      };

      const userId = 'user-123';
      const mockAsset = { id: 'asset-123', ...data };

      mockPhysicalAssetService.create.mockResolvedValue(mockAsset);

      const result = await handler.createAsset(data, userId);

      expect(mockPhysicalAssetService.create).toHaveBeenCalledWith(data, userId);
      expect(result).toEqual(mockAsset);
    });
  });

  // Note: getRequiredFields and getAssetType are not part of BaseImportHandler
  // They may be implemented differently or not needed for these handlers
});

