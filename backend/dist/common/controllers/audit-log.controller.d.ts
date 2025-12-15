import { AuditLogService } from '../services/audit-log.service';
import { CreateAuditLogDto, AuditLogResponseDto, AuditLogSummaryDto } from '../dto/audit-log.dto';
export declare class AuditLogController {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    getEntityLogs(entityType: string, entityId: string, limit?: string): Promise<AuditLogResponseDto[]>;
    getUserLogs(userId: string, limit?: string): Promise<AuditLogResponseDto[]>;
    getActionLogs(action: string, limit?: string): Promise<AuditLogResponseDto[]>;
    search(query: string, limit?: string): Promise<AuditLogResponseDto[]>;
    getAllLogs(skip?: string, take?: string): Promise<{
        data: AuditLogResponseDto[];
        total: number;
        skip: number;
        take: number;
    }>;
    getSummary(): Promise<AuditLogSummaryDto>;
    exportCsv(entityType?: string, entityId?: string): Promise<{
        contentType: string;
        content: string;
        filename: string;
    }>;
    create(dto: CreateAuditLogDto, user: any): Promise<AuditLogResponseDto>;
    getEntityTrail(entityType: string, entityIds: string, limit?: string): Promise<AuditLogResponseDto[]>;
    private toResponseDto;
}
