import { Repository } from 'typeorm';
import { ImportLog, ImportFileType } from '../entities/import-log.entity';
import { PhysicalAsset } from '../entities/physical-asset.entity';
import { PhysicalAssetService } from './physical-asset.service';
import { PhysicalAssetImportHandler } from './import-handlers/physical-asset-import-handler';
import { InformationAssetImportHandler } from './import-handlers/information-asset-import-handler';
import { SoftwareAssetImportHandler } from './import-handlers/software-asset-import-handler';
import { BusinessApplicationImportHandler } from './import-handlers/business-application-import-handler';
import { SupplierImportHandler } from './import-handlers/supplier-import-handler';
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
    errors: Array<{
        row: number;
        errors: string[];
    }>;
}
export declare class ImportService {
    private importLogRepository;
    private assetRepository;
    private physicalAssetService;
    private physicalAssetImportHandler;
    private informationAssetImportHandler;
    private softwareAssetImportHandler;
    private businessApplicationImportHandler;
    private supplierImportHandler;
    private handlers;
    constructor(importLogRepository: Repository<ImportLog>, assetRepository: Repository<PhysicalAsset>, physicalAssetService: PhysicalAssetService, physicalAssetImportHandler: PhysicalAssetImportHandler, informationAssetImportHandler: InformationAssetImportHandler, softwareAssetImportHandler: SoftwareAssetImportHandler, businessApplicationImportHandler: BusinessApplicationImportHandler, supplierImportHandler: SupplierImportHandler);
    private getHandler;
    previewCSV(fileBuffer: Buffer, limit?: number): Promise<ImportPreview>;
    previewExcel(fileBuffer: Buffer, limit?: number): Promise<ImportPreview>;
    importAssets(fileBuffer: Buffer, fileType: ImportFileType, assetType: string, fieldMapping: Record<string, string>, userId: string, fileName: string): Promise<ImportResult>;
    importPhysicalAssets(fileBuffer: Buffer, fileType: ImportFileType, fieldMapping: Record<string, string>, userId: string, fileName: string): Promise<ImportResult>;
    getImportHistory(assetType?: string, limit?: number): Promise<ImportLog[]>;
    getImportLog(id: string): Promise<ImportLog>;
}
