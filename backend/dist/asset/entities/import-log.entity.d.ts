import { User } from '../../users/entities/user.entity';
export declare enum ImportStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    PARTIAL = "partial"
}
export declare enum ImportFileType {
    CSV = "csv",
    EXCEL = "excel"
}
export declare class ImportLog {
    id: string;
    fileName: string;
    fileType: ImportFileType;
    assetType: string;
    status: ImportStatus;
    totalRecords: number;
    successfulImports: number;
    failedImports: number;
    errorReport: string;
    fieldMapping: Record<string, string>;
    importedById: string;
    importedBy: User;
    notes: string;
    createdAt: Date;
    completedAt: Date;
}
