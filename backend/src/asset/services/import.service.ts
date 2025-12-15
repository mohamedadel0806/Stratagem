import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportLog, ImportStatus, ImportFileType } from '../entities/import-log.entity';
import { PhysicalAsset } from '../entities/physical-asset.entity';
import { CreatePhysicalAssetDto } from '../dto/create-physical-asset.dto';
import { PhysicalAssetService } from './physical-asset.service';
import { AssetImportHandler } from './import-handlers/asset-import-handler.interface';
import { PhysicalAssetImportHandler } from './import-handlers/physical-asset-import-handler';
import { InformationAssetImportHandler } from './import-handlers/information-asset-import-handler';
import { SoftwareAssetImportHandler } from './import-handlers/software-asset-import-handler';
import { BusinessApplicationImportHandler } from './import-handlers/business-application-import-handler';
import { SupplierImportHandler } from './import-handlers/supplier-import-handler';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parse } = require('csv-parse/sync');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');

export interface ImportPreviewRow {
  rowNumber: number;
  data: Record<string, any>;
  errors?: string[];
}

export interface ImportPreview {
  headers: string[];
  rows: ImportPreviewRow[];
  totalRows: number;
}

export interface ImportResult {
  importLogId: string;
  totalRecords: number;
  successfulImports: number;
  failedImports: number;
  errors: Array<{ row: number; errors: string[] }>;
}

@Injectable()
export class ImportService {
  private handlers: Map<string, AssetImportHandler> = new Map();

  constructor(
    @InjectRepository(ImportLog)
    private importLogRepository: Repository<ImportLog>,
    @InjectRepository(PhysicalAsset)
    private assetRepository: Repository<PhysicalAsset>,
    private physicalAssetService: PhysicalAssetService,
    private physicalAssetImportHandler: PhysicalAssetImportHandler,
    private informationAssetImportHandler: InformationAssetImportHandler,
    private softwareAssetImportHandler: SoftwareAssetImportHandler,
    private businessApplicationImportHandler: BusinessApplicationImportHandler,
    private supplierImportHandler: SupplierImportHandler,
  ) {
    // Register handlers for each asset type
    this.handlers.set('physical', this.physicalAssetImportHandler);
    this.handlers.set('information', this.informationAssetImportHandler);
    this.handlers.set('software', this.softwareAssetImportHandler);
    this.handlers.set('application', this.businessApplicationImportHandler);
    this.handlers.set('supplier', this.supplierImportHandler);
  }

  /**
   * Get handler for asset type
   */
  private getHandler(assetType: string): AssetImportHandler {
    const handler = this.handlers.get(assetType);
    if (!handler) {
      throw new BadRequestException(`Unsupported asset type: ${assetType}`);
    }
    return handler;
  }

  /**
   * Parse CSV file and return preview (first 10 rows)
   */
  async previewCSV(fileBuffer: Buffer, limit: number = 10): Promise<ImportPreview> {
    try {
      if (!fileBuffer) {
        throw new BadRequestException('File buffer is required');
      }

      if (!Buffer.isBuffer(fileBuffer)) {
        throw new BadRequestException('Invalid file buffer type');
      }

      const content = fileBuffer.toString('utf-8');
      
      if (!content || content.trim().length === 0) {
        throw new BadRequestException('CSV file is empty');
      }

      let records: any[];
      try {
        records = parse(content, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          relax_column_count: true,
        });
      } catch (parseError: any) {
        throw new BadRequestException(`CSV parsing failed: ${parseError.message || 'Invalid CSV format'}`);
      }

      if (!records || records.length === 0) {
        throw new BadRequestException('No data rows found in CSV file');
      }

      const headers = records.length > 0 ? Object.keys(records[0]) : [];
      const previewRows = records.slice(0, limit).map((record: any, index: number) => ({
        rowNumber: index + 2, // +2 because row 1 is header, and index is 0-based
        data: record,
      }));

      return {
        headers,
        rows: previewRows,
        totalRows: records.length,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage = error?.message || 'Unknown error occurred';
      throw new BadRequestException(`Failed to parse CSV: ${errorMessage}`);
    }
  }

  /**
   * Parse Excel file and return preview (first 10 rows)
   */
  async previewExcel(fileBuffer: Buffer, limit: number = 10): Promise<ImportPreview> {
    try {
      if (!fileBuffer) {
        throw new BadRequestException('File buffer is required');
      }

      if (!Buffer.isBuffer(fileBuffer)) {
        throw new BadRequestException('Invalid file buffer type');
      }

      let workbook: any;
      try {
        workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      } catch (readError: any) {
        throw new BadRequestException(`Failed to read Excel file: ${readError.message || 'Invalid Excel format'}`);
      }

      if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new BadRequestException('Excel file has no sheets');
      }

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      if (!worksheet) {
        throw new BadRequestException(`Sheet "${firstSheetName}" not found in Excel file`);
      }

      let data: any[];
      try {
        data = XLSX.utils.sheet_to_json(worksheet, { defval: null }) as any[];
      } catch (jsonError: any) {
        throw new BadRequestException(`Failed to parse Excel sheet: ${jsonError.message || 'Invalid sheet data'}`);
      }

      if (data.length === 0) {
        return {
          headers: [],
          rows: [],
          totalRows: 0,
        };
      }

      const headers = Object.keys(data[0] as any);
      const previewRows = (data as any[]).slice(0, limit).map((record: any, index: number) => ({
        rowNumber: index + 2, // +2 because row 1 is header, and index is 0-based
        data: record,
      }));

      return {
        headers,
        rows: previewRows,
        totalRows: data.length,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to parse Excel: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Import assets from CSV/Excel with field mapping (generic method for all asset types)
   */
  async importAssets(
    fileBuffer: Buffer,
    fileType: ImportFileType,
    assetType: string,
    fieldMapping: Record<string, string>,
    userId: string,
    fileName: string,
  ): Promise<ImportResult> {
    const handler = this.getHandler(assetType);

    // Create import log using raw query to bypass naming strategy issues
    const fieldMappingJson = JSON.stringify(fieldMapping);
    const result = await this.importLogRepository.query(
      `INSERT INTO import_logs ("fileName", "fileType", "assetType", "status", "fieldMapping", "importedById", "createdAt")
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, NOW())
       RETURNING id, status, "totalRecords", "successfulImports", "failedImports", "createdAt"`,
      [fileName, fileType, assetType, ImportStatus.PROCESSING, fieldMappingJson, userId],
    );
    
    const savedLog = await this.importLogRepository.findOne({
      where: { id: result[0].id },
    });
    
    if (!savedLog) {
      throw new BadRequestException('Failed to create import log');
    }

    try {
      // Parse file (supports both CSV and Excel)
      let records: any[];
      if (fileType === ImportFileType.CSV) {
        const content = fileBuffer.toString('utf-8');
        records = parse(content, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          relax_column_count: true,
        });
      } else {
        // Excel file parsing
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        records = XLSX.utils.sheet_to_json(worksheet, { defval: null }) as any[];
      }

      const errors: Array<{ row: number; errors: string[] }> = [];
      let successfulImports = 0;
      let failedImports = 0;

      // Process each record
      for (let i = 0; i < records.length; i++) {
        const row = records[i];
        const rowNumber = i + 2; // +2 because row 1 is header, and index is 0-based

        try {
          // Map CSV/Excel columns to asset fields using handler
          const assetData = handler.mapFields(row, fieldMapping);

          // Validate required fields using handler
          const validationErrors = handler.validate(assetData);
          if (validationErrors.length > 0) {
            errors.push({ row: rowNumber, errors: validationErrors });
            failedImports++;
            continue;
          }

          // Create asset using handler
          await handler.createAsset(assetData, userId);
          successfulImports++;
        } catch (error: any) {
          errors.push({
            row: rowNumber,
            errors: [error.message || 'Unknown error'],
          });
          failedImports++;
        }
      }

      // Update import log
      savedLog.status =
        failedImports === 0
          ? ImportStatus.COMPLETED
          : successfulImports > 0
            ? ImportStatus.PARTIAL
            : ImportStatus.FAILED;
      savedLog.totalRecords = records.length;
      savedLog.successfulImports = successfulImports;
      savedLog.failedImports = failedImports;
      savedLog.errorReport = JSON.stringify(errors);
      savedLog.completedAt = new Date();
      await this.importLogRepository.save(savedLog);

      return {
        importLogId: savedLog.id,
        totalRecords: records.length,
        successfulImports,
        failedImports,
        errors,
      };
    } catch (error: any) {
      savedLog.status = ImportStatus.FAILED;
      savedLog.errorReport = JSON.stringify([{ message: error.message }]);
      savedLog.completedAt = new Date();
      await this.importLogRepository.save(savedLog);
      throw error;
    }
  }

  /**
   * Import physical assets from CSV/Excel with field mapping (backward compatibility)
   */
  async importPhysicalAssets(
    fileBuffer: Buffer,
    fileType: ImportFileType,
    fieldMapping: Record<string, string>,
    userId: string,
    fileName: string,
  ): Promise<ImportResult> {
    return this.importAssets(fileBuffer, fileType, 'physical', fieldMapping, userId, fileName);
  }


  /**
   * Get import history
   */
  async getImportHistory(assetType?: string, limit: number = 20): Promise<ImportLog[]> {
    const query = this.importLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.importedBy', 'user')
      .orderBy('log.createdAt', 'DESC')
      .take(limit);

    if (assetType) {
      query.where('log.assetType = :assetType', { assetType });
    }

    return query.getMany();
  }

  /**
   * Get import log by ID
   */
  async getImportLog(id: string): Promise<ImportLog> {
    const log = await this.importLogRepository.findOne({
      where: { id },
      relations: ['importedBy'],
    });

    if (!log) {
      throw new BadRequestException(`Import log with ID ${id} not found`);
    }

    return log;
  }
}

