import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { CreateAuditLogDto } from '../dto/audit-log.dto';
export declare class AuditLogService {
    private auditLogRepository;
    private readonly logger;
    constructor(auditLogRepository: Repository<AuditLog>);
    log(dto: CreateAuditLogDto): Promise<AuditLog>;
    logBulk(dtos: CreateAuditLogDto[]): Promise<void>;
    getEntityLogs(entityType: string, entityId: string, limit?: number): Promise<AuditLog[]>;
    getUserLogs(userId: string, limit?: number): Promise<AuditLog[]>;
    getActionLogs(action: string, limit?: number): Promise<AuditLog[]>;
    getLogsByDateRange(startDate: Date, endDate: Date, limit?: number): Promise<AuditLog[]>;
    getEntityTrail(entityType: string, entityIds: string[], limit?: number): Promise<AuditLog[]>;
    getAllLogs(skip?: number, take?: number): Promise<{
        logs: AuditLog[];
        total: number;
    }>;
    search(query: string, limit?: number): Promise<AuditLog[]>;
    exportToCSV(entityType?: string, entityId?: string): Promise<string>;
    cleanupOldLogs(daysToKeep?: number): Promise<number>;
    getSummary(): Promise<{
        totalLogs: number;
        uniqueUsers: number;
        uniqueActions: number;
        uniqueEntities: number;
        oldestLog: Date;
        newestLog: Date;
    }>;
}
