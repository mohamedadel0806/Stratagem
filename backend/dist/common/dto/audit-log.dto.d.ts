import { AuditAction } from '../entities/audit-log.entity';
export declare class CreateAuditLogDto {
    userId: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    description?: string;
    changes?: Record<string, any>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
export declare class AuditLogResponseDto {
    id: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    description?: string;
    changes?: Record<string, any>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    timestamp: string;
}
export declare class AuditLogSummaryDto {
    totalLogs: number;
    uniqueUsers: number;
    uniqueActions: number;
    uniqueEntities: number;
    oldestLog?: Date;
    newestLog?: Date;
}
