import { Repository } from 'typeorm';
import { AssetAuditLog, AssetType, AuditAction } from '../entities/asset-audit-log.entity';
export interface CreateAuditLogDto {
    assetType: AssetType;
    assetId: string;
    action: AuditAction;
    fieldName?: string;
    oldValue?: string;
    newValue?: string;
    changedById?: string;
    changeReason?: string;
}
export interface AuditLogQueryDto {
    from?: string | Date;
    to?: string | Date;
    userId?: string;
    action?: AuditAction;
    page?: number;
    limit?: number;
}
export declare class AssetAuditService {
    private auditLogRepository;
    constructor(auditLogRepository: Repository<AssetAuditLog>);
    createLog(logData: CreateAuditLogDto): Promise<AssetAuditLog>;
    logCreate(assetType: AssetType, assetId: string, userId: string, changeReason?: string): Promise<void>;
    logUpdate(assetType: AssetType, assetId: string, changes: Record<string, {
        old: any;
        new: any;
    }>, userId: string, changeReason?: string): Promise<void>;
    logDelete(assetType: AssetType, assetId: string, userId: string, changeReason?: string): Promise<void>;
    getAuditLogs(assetType: AssetType, assetId: string, query?: AuditLogQueryDto): Promise<{
        data: AssetAuditLog[];
        total: number;
        page: number;
        limit: number;
    }>;
    private serializeValue;
}
