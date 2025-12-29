import { TenantStatus, SubscriptionTier } from '../../common/entities/tenant.entity';

export class TenantListResponseDto {
    id: string;
    name: string;
    code: string;
    status: TenantStatus;
    subscriptionTier: SubscriptionTier;
    userCount: number;
    createdAt: Date;
    lastActivityAt?: Date;
}

export class TenantStatsDto {
    totalTenants: number;
    activeTenants: number;
    trialTenants: number;
    suspendedTenants: number;
    totalUsers: number;
    storageUsedMB: number;
}

export class TenantUsageDto {
    tenantId: string;
    userCount: number;
    riskCount: number;
    assetCount: number;
    controlCount: number;
    policyCount: number;
    assessmentCount: number;
    storageUsedMB: number;
    lastActivityAt?: Date;
}

export class TenantAuditLogDto {
    id: string;
    action: string;
    performedBy: string;
    performedByName: string;
    changes: Record<string, any>;
    description?: string;
    createdAt: Date;
}
