import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryDto {
  @ApiProperty()
  totalRisks: number;

  @ApiProperty()
  activePolicies: number;

  @ApiProperty()
  complianceScore: number;

  @ApiProperty()
  pendingTasks: number;

  @ApiProperty()
  totalRequirements: number;

  @ApiProperty()
  compliantRequirements: number;
}

export class AssetCountByTypeDto {
  @ApiProperty()
  physical: number;

  @ApiProperty()
  information: number;

  @ApiProperty()
  application: number;

  @ApiProperty()
  software: number;

  @ApiProperty()
  supplier: number;

  @ApiProperty()
  total: number;
}

export class AssetCountByCriticalityDto {
  @ApiProperty()
  critical: number;

  @ApiProperty()
  high: number;

  @ApiProperty()
  medium: number;

  @ApiProperty()
  low: number;
}

export class SupplierCriticalityDto {
  @ApiProperty()
  critical: number;

  @ApiProperty()
  high: number;

  @ApiProperty()
  medium: number;

  @ApiProperty()
  low: number;
}

export class AssetWithoutOwnerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  identifier: string;

  @ApiProperty({ required: false, nullable: true })
  criticalityLevel?: string;

  @ApiProperty()
  createdAt: Date;
}

export class RecentAssetChangeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  assetType: string;

  @ApiProperty()
  assetId: string;

  @ApiProperty()
  assetName: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  fieldName?: string;

  @ApiProperty()
  changedByName?: string;

  @ApiProperty()
  createdAt: Date;
}

export class AssetByComplianceScopeDto {
  @ApiProperty()
  scope: string;

  @ApiProperty()
  count: number;
}

export class AssetWithOutdatedSecurityTestDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  lastSecurityTestDate?: Date;

  @ApiProperty()
  daysSinceLastTest?: number;
}

export class AssetStatsDto {
  @ApiProperty({ type: AssetCountByTypeDto })
  countByType: AssetCountByTypeDto;

  @ApiProperty({ type: AssetCountByCriticalityDto })
  countByCriticality: AssetCountByCriticalityDto;

  @ApiProperty({ type: [AssetWithoutOwnerDto] })
  assetsWithoutOwner: AssetWithoutOwnerDto[];

  @ApiProperty({ type: [RecentAssetChangeDto] })
  recentChanges: RecentAssetChangeDto[];

  @ApiProperty({ type: [AssetByComplianceScopeDto], required: false })
  assetsByComplianceScope?: AssetByComplianceScopeDto[];

  @ApiProperty({ type: [AssetWithOutdatedSecurityTestDto], required: false })
  assetsWithOutdatedSecurityTests?: AssetWithOutdatedSecurityTestDto[];

  @ApiProperty({ description: 'Counts of assets by connectivity status', required: false })
  countByConnectivityStatus?: {
    connected: number;
    disconnected: number;
    unknown: number;
  };

  @ApiProperty({ type: SupplierCriticalityDto, required: false })
  supplierCriticality?: SupplierCriticalityDto;
}

export class DashboardOverviewDto {
  @ApiProperty()
  summary: DashboardSummaryDto;

  @ApiProperty({ type: AssetStatsDto, required: false })
  assetStats?: AssetStatsDto;

  @ApiProperty({ type: SupplierCriticalityDto, required: false })
  supplierCriticality?: SupplierCriticalityDto;
}

