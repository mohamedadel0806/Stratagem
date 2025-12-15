import { apiClient } from './client';

export interface AssetCountByType {
  physical: number;
  information: number;
  application: number;
  software: number;
  supplier: number;
  total: number;
}

export interface AssetCountByCriticality {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface AssetWithoutOwner {
  id: string;
  name: string;
  type: string;
  identifier: string;
  criticalityLevel: string;
  createdAt: string;
}

export interface RecentAssetChange {
  id: string;
  assetType: string;
  assetId: string;
  assetName: string;
  action: string;
  fieldName?: string;
  changedByName?: string;
  createdAt: string;
}

export interface AssetByComplianceScope {
  scope: string;
  count: number;
}

export interface AssetWithOutdatedSecurityTest {
  id: string;
  name: string;
  type: string;
  lastSecurityTestDate?: string;
  daysSinceLastTest?: number;
}

export interface AssetStats {
  countByType: AssetCountByType;
  countByCriticality: AssetCountByCriticality;
  assetsWithoutOwner: AssetWithoutOwner[];
  recentChanges: RecentAssetChange[];
  assetsByComplianceScope?: AssetByComplianceScope[];
  assetsWithOutdatedSecurityTests?: AssetWithOutdatedSecurityTest[];
}

export interface DashboardOverview {
  summary: {
    totalRisks: number;
    activePolicies: number;
    complianceScore: number;
    pendingTasks: number;
    totalRequirements?: number;
    compliantRequirements?: number;
  };
  assetStats?: AssetStats;
}

export const dashboardApi = {
  getOverview: async (): Promise<DashboardOverview> => {
    // Return mock data during build time to prevent prerendering failures
    if (typeof window === 'undefined') {
      return {
        summary: {
          totalRisks: 0,
          activePolicies: 0,
          complianceScore: 0,
          pendingTasks: 0,
          totalRequirements: 0,
          compliantRequirements: 0,
        },
        assetStats: {
          countByType: {
            physical: 0,
            information: 0,
            application: 0,
            software: 0,
            supplier: 0,
            total: 0,
          },
          countByCriticality: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
          },
          assetsWithoutOwner: [],
          recentChanges: [],
          assetsByComplianceScope: [],
          assetsWithOutdatedSecurityTests: [],
        },
      };
    }

    try {
      const response = await apiClient.get<DashboardOverview>('/dashboard/overview');
      return response.data;
    } catch (error: any) {
      // Don't catch 401 errors - let them propagate to trigger redirect
      if (error.response?.status === 401) {
        throw error;
      }
      console.error('Failed to fetch dashboard overview:', error);
      // Return fallback data only for non-auth errors
      return {
        summary: {
          totalRisks: 0,
          activePolicies: 0,
          complianceScore: 0,
          pendingTasks: 0,
          totalRequirements: 0,
          compliantRequirements: 0,
        },
        assetStats: {
          countByType: {
            physical: 0,
            information: 0,
            application: 0,
            software: 0,
            supplier: 0,
            total: 0,
          },
          countByCriticality: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
          },
          assetsWithoutOwner: [],
          recentChanges: [],
        },
      };
    }
  },
};

