import { AssetAuditService } from '../services/asset-audit.service';
import { AssetAuditLogResponseDto, AssetAuditLogQueryDto } from '../dto/asset-audit-log-response.dto';
export declare class AssetAuditController {
    private readonly auditService;
    constructor(auditService: AssetAuditService);
    getAuditTrail(type: string, id: string, query: AssetAuditLogQueryDto): Promise<{
        data: AssetAuditLogResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    private validateAssetType;
}
