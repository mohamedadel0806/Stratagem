export declare class DashboardSummaryDto {
    totalRisks: number;
    activePolicies: number;
    complianceScore: number;
    pendingTasks: number;
    totalRequirements: number;
    compliantRequirements: number;
}
export declare class AssetCountByTypeDto {
    physical: number;
    information: number;
    application: number;
    software: number;
    supplier: number;
    total: number;
}
export declare class AssetCountByCriticalityDto {
    critical: number;
    high: number;
    medium: number;
    low: number;
}
export declare class AssetWithoutOwnerDto {
    id: string;
    name: string;
    type: string;
    identifier: string;
    criticalityLevel?: string;
    createdAt: Date;
}
export declare class RecentAssetChangeDto {
    id: string;
    assetType: string;
    assetId: string;
    assetName: string;
    action: string;
    fieldName?: string;
    changedByName?: string;
    createdAt: Date;
}
export declare class AssetByComplianceScopeDto {
    scope: string;
    count: number;
}
export declare class AssetWithOutdatedSecurityTestDto {
    id: string;
    name: string;
    type: string;
    lastSecurityTestDate?: Date;
    daysSinceLastTest?: number;
}
export declare class AssetStatsDto {
    countByType: AssetCountByTypeDto;
    countByCriticality: AssetCountByCriticalityDto;
    assetsWithoutOwner: AssetWithoutOwnerDto[];
    recentChanges: RecentAssetChangeDto[];
    assetsByComplianceScope?: AssetByComplianceScopeDto[];
    assetsWithOutdatedSecurityTests?: AssetWithOutdatedSecurityTestDto[];
}
export declare class DashboardOverviewDto {
    summary: DashboardSummaryDto;
    assetStats?: AssetStatsDto;
}
