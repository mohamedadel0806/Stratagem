import { AssetType, AuditAction } from '../entities/asset-audit-log.entity';
export declare class AssetAuditLogResponseDto {
    id: string;
    assetType: AssetType;
    assetId: string;
    action: AuditAction;
    fieldName?: string;
    oldValue?: string;
    newValue?: string;
    changedBy?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    changeReason?: string;
    createdAt: string | Date;
}
export declare class AssetAuditLogQueryDto {
    from?: string;
    to?: string;
    userId?: string;
    action?: AuditAction;
    page?: number;
    limit?: number;
}
