import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportService } from '../../src/asset/services/import.service';
import { ImportLog, ImportFileType, ImportStatus } from '../../src/asset/entities/import-log.entity';
import { PhysicalAsset } from '../../src/asset/entities/physical-asset.entity';
import { PhysicalAssetService } from '../../src/asset/services/physical-asset.service';
import { PhysicalAssetImportHandler } from '../../src/asset/services/import-handlers/physical-asset-import-handler';
import { InformationAssetImportHandler } from '../../src/asset/services/import-handlers/information-asset-import-handler';
import { SoftwareAssetImportHandler } from '../../src/asset/services/import-handlers/software-asset-import-handler';
import { BusinessApplicationImportHandler } from '../../src/asset/services/import-handlers/business-application-import-handler';
import { SupplierImportHandler } from '../../src/asset/services/import-handlers/supplier-import-handler';
import { BadRequestException } from '@nestjs/common';

describe('ImportService', () => {
  let service: ImportService;
  let importLogRepository: Repository<ImportLog>;
  let assetRepository: Repository<PhysicalAsset>;
  let physicalAssetService: PhysicalAssetService;

  const mockImportLogRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    query: jest.fn(),
  };

  const mockAssetRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPhysicalAssetService = {
    create: jest.fn(),
  };

  const mockPhysicalAssetImportHandler = {
    mapFields: jest.fn(),
    validate: jest.fn(),
    createAsset: jest.fn(),
    getRequiredFields: jest.fn(),
    getAssetType: jest.fn(),
  };

  const mockInformationAssetImportHandler = {
    mapFieldsToAsset: jest.fn(),
    validateAssetData: jest.fn(),
    createAsset: jest.fn(),
    getRequiredFields: jest.fn(),
    getAssetType: jest.fn(),
  };

  const mockSoftwareAssetImportHandler = {
    mapFieldsToAsset: jest.fn(),
    validateAssetData: jest.fn(),
    createAsset: jest.fn(),
    getRequiredFields: jest.fn(),
    getAssetType: jest.fn(),
  };

  const mockBusinessApplicationImportHandler = {
    mapFieldsToAsset: jest.fn(),
    validateAssetData: jest.fn(),
    createAsset: jest.fn(),
    getRequiredFields: jest.fn(),
    getAssetType: jest.fn(),
  };

  const mockSupplierImportHandler = {
    mapFieldsToAsset: jest.fn(),
    validateAssetData: jest.fn(),
    createAsset: jest.fn(),
    getRequiredFields: jest.fn(),
    getAssetType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportService,
        {
          provide: getRepositoryToken(ImportLog),
          useValue: mockImportLogRepository,
        },
        {
          provide: getRepositoryToken(PhysicalAsset),
          useValue: mockAssetRepository,
        },
        {
          provide: PhysicalAssetService,
          useValue: mockPhysicalAssetService,
        },
        {
          provide: PhysicalAssetImportHandler,
          useValue: mockPhysicalAssetImportHandler,
        },
        {
          provide: InformationAssetImportHandler,
          useValue: mockInformationAssetImportHandler,
        },
        {
          provide: SoftwareAssetImportHandler,
          useValue: mockSoftwareAssetImportHandler,
        },
        {
          provide: BusinessApplicationImportHandler,
          useValue: mockBusinessApplicationImportHandler,
        },
        {
          provide: SupplierImportHandler,
          useValue: mockSupplierImportHandler,
        },
      ],
    }).compile();

    service = module.get<ImportService>(ImportService);
    importLogRepository = module.get<Repository<ImportLog>>(getRepositoryToken(ImportLog));
    assetRepository = module.get<Repository<PhysicalAsset>>(getRepositoryToken(PhysicalAsset));
    physicalAssetService = module.get<PhysicalAssetService>(PhysicalAssetService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('previewCSV', () => {
    it('should parse CSV file and return preview', async () => {
      const csvContent = `Asset Description,Unique Identifier,Location
Server 01,PHY-001,Data Center A
Server 02,PHY-002,Data Center B`;

      const fileBuffer = Buffer.from(csvContent);

      const result = await service.previewCSV(fileBuffer, 10);

      expect(result.headers).toEqual(['Asset Description', 'Unique Identifier', 'Location']);
      expect(result.totalRows).toBe(2);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0].rowNumber).toBe(2);
      expect(result.rows[0].data).toEqual({
        'Asset Description': 'Server 01',
        'Unique Identifier': 'PHY-001',
        'Location': 'Data Center A',
      });
    });

    it('should limit preview rows', async () => {
      const csvContent = `Header1,Header2
Row1,Value1
Row2,Value2
Row3,Value3
Row4,Value4
Row5,Value5`;

      const fileBuffer = Buffer.from(csvContent);

      const result = await service.previewCSV(fileBuffer, 3);

      expect(result.totalRows).toBe(5);
      expect(result.rows).toHaveLength(3); // Limited to 3 rows
    });

    it('should throw error for empty CSV', async () => {
      const fileBuffer = Buffer.from('');

      await expect(service.previewCSV(fileBuffer)).rejects.toThrow('CSV file is empty');
    });

    it('should throw error for invalid buffer', async () => {
      await expect(service.previewCSV(null as any)).rejects.toThrow('File buffer is required');
    });
  });

  describe('previewExcel', () => {
    it('should parse Excel file and return preview', async () => {
      // Create a simple Excel file buffer using xlsx
      const XLSX = require('xlsx');
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet([
        ['Asset Description', 'Unique Identifier', 'Location'],
        ['Server 01', 'PHY-001', 'Data Center A'],
        ['Server 02', 'PHY-002', 'Data Center B'],
      ]);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      const result = await service.previewExcel(excelBuffer, 10);

      expect(result.headers).toEqual(['Asset Description', 'Unique Identifier', 'Location']);
      expect(result.totalRows).toBe(2);
      expect(result.rows).toHaveLength(2);
    });

    it('should limit preview rows for Excel', async () => {
      const XLSX = require('xlsx');
      const workbook = XLSX.utils.book_new();
      const data = [['Header1', 'Header2']];
      for (let i = 1; i <= 10; i++) {
        data.push([`Row${i}`, `Value${i}`]);
      }
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      const result = await service.previewExcel(excelBuffer, 5);

      expect(result.totalRows).toBe(10);
      expect(result.rows).toHaveLength(5); // Limited to 5 rows
    });
  });

  describe('importAssets', () => {
    const userId = 'user-123';
    const fileName = 'test-assets.csv';
    const fieldMapping = {
      'Asset Description': 'assetDescription',
      'Unique Identifier': 'uniqueIdentifier',
      'Location': 'location',
    };

    it('should import assets from CSV successfully', async () => {
      const csvContent = `Asset Description,Unique Identifier,Location
Server 01,PHY-001,Data Center A
Server 02,PHY-002,Data Center B`;

      const fileBuffer = Buffer.from(csvContent);

      // Mock import log creation
      mockImportLogRepository.query.mockResolvedValueOnce([{
        id: 'import-log-123',
        status: ImportStatus.PROCESSING,
      }]);
      mockImportLogRepository.findOne.mockResolvedValueOnce({
        id: 'import-log-123',
        status: ImportStatus.PROCESSING,
      });

      // Mock handler methods (using actual method names from BaseImportHandler)
      mockPhysicalAssetImportHandler.getAssetType.mockReturnValue('physical');
      mockPhysicalAssetImportHandler.mapFields.mockImplementation((row, mapping) => ({
        assetDescription: row['Asset Description'],
        uniqueIdentifier: row['Unique Identifier'],
        location: row['Location'],
      }));
      mockPhysicalAssetImportHandler.validate.mockReturnValue([]);
      mockPhysicalAssetImportHandler.createAsset.mockResolvedValue({ id: 'asset-123' });

      const result = await service.importAssets(
        fileBuffer,
        ImportFileType.CSV,
        'physical',
        fieldMapping,
        userId,
        fileName,
      );

      expect(result.totalRecords).toBe(2);
      expect(result.successfulImports).toBe(2);
      expect(result.failedImports).toBe(0);
      expect(mockPhysicalAssetImportHandler.mapFields).toHaveBeenCalledTimes(2);
      expect(mockPhysicalAssetImportHandler.createAsset).toHaveBeenCalledTimes(2);
    });

    it('should handle validation errors during import', async () => {
      const csvContent = `Asset Description,Unique Identifier,Location
Server 01,PHY-001,Data Center A
,PHY-002,Data Center B`; // Missing required field

      const fileBuffer = Buffer.from(csvContent);

      mockImportLogRepository.query.mockResolvedValueOnce([{
        id: 'import-log-123',
        status: ImportStatus.PROCESSING,
      }]);
      mockImportLogRepository.findOne.mockResolvedValueOnce({
        id: 'import-log-123',
        status: ImportStatus.PROCESSING,
      });

      mockPhysicalAssetImportHandler.getAssetType.mockReturnValue('physical');
      mockPhysicalAssetImportHandler.mapFields.mockImplementation((row) => ({
        assetDescription: row['Asset Description'],
        uniqueIdentifier: row['Unique Identifier'],
        location: row['Location'],
      }));
      mockPhysicalAssetImportHandler.validate
        .mockReturnValueOnce([]) // First row valid
        .mockReturnValueOnce(['Asset Description is required']); // Second row invalid
      mockPhysicalAssetImportHandler.createAsset.mockResolvedValue({ id: 'asset-123' });

      const result = await service.importAssets(
        fileBuffer,
        ImportFileType.CSV,
        'physical',
        fieldMapping,
        userId,
        fileName,
      );

      expect(result.totalRecords).toBe(2);
      expect(result.successfulImports).toBe(1);
      expect(result.failedImports).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].row).toBe(3);
      expect(result.errors[0].errors).toContain('Asset Description is required');
    });

    it('should handle unsupported asset type', async () => {
      const fileBuffer = Buffer.from('test');

      await expect(
        service.importAssets(
          fileBuffer,
          ImportFileType.CSV,
          'invalid-type',
          {},
          userId,
          fileName,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should import from Excel file', async () => {
      const XLSX = require('xlsx');
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet([
        ['Asset Description', 'Unique Identifier', 'Location'],
        ['Server 01', 'PHY-001', 'Data Center A'],
      ]);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      mockImportLogRepository.query.mockResolvedValueOnce([{
        id: 'import-log-123',
        status: ImportStatus.PROCESSING,
      }]);
      mockImportLogRepository.findOne.mockResolvedValueOnce({
        id: 'import-log-123',
        status: ImportStatus.PROCESSING,
      });

      mockPhysicalAssetImportHandler.getAssetType.mockReturnValue('physical');
      mockPhysicalAssetImportHandler.mapFields.mockImplementation((row) => ({
        assetDescription: row['Asset Description'],
        uniqueIdentifier: row['Unique Identifier'],
        location: row['Location'],
      }));
      mockPhysicalAssetImportHandler.validate.mockReturnValue([]);
      mockPhysicalAssetImportHandler.createAsset.mockResolvedValue({ id: 'asset-123' });

      const result = await service.importAssets(
        excelBuffer,
        ImportFileType.EXCEL,
        'physical',
        fieldMapping,
        userId,
        'test.xlsx',
      );

      expect(result.totalRecords).toBe(1);
      expect(result.successfulImports).toBe(1);
    });
  });

  describe('getHandler', () => {
    it('should return correct handler for each asset type', () => {
      // Test that handlers are registered correctly
      expect(mockPhysicalAssetImportHandler).toBeDefined();
      expect(mockInformationAssetImportHandler).toBeDefined();
      expect(mockSoftwareAssetImportHandler).toBeDefined();
      expect(mockBusinessApplicationImportHandler).toBeDefined();
      expect(mockSupplierImportHandler).toBeDefined();
    });
  });
});

