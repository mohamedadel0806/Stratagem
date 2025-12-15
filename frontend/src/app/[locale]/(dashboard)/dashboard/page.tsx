"use client"

import { useQuery } from "@tanstack/react-query"
import { ComplianceStatus } from "@/components/dashboard/widgets/compliance-status"
import { TaskList } from "@/components/dashboard/widgets/task-list"
import { RiskHeatmap } from "@/components/dashboard/widgets/risk-heatmap"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import { AssetTypeChart } from "@/components/dashboard/widgets/asset-type-chart"
import { AssetCriticalityChart } from "@/components/dashboard/widgets/asset-criticality-chart"
import { AssetsWithoutOwner } from "@/components/dashboard/widgets/assets-without-owner"
import { RecentAssetChanges } from "@/components/dashboard/widgets/recent-asset-changes"
import { PendingApprovalsWidget } from "@/components/dashboard/widgets/pending-approvals-widget"
import { dashboardApi } from "@/lib/api/dashboard"
import { AlertTriangle, FileText, Shield, Package } from "lucide-react"

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  // Only run query on client side to avoid build-time API calls
  const { data: overview, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => dashboardApi.getOverview(),
    enabled: typeof window !== 'undefined', // Only run on client side
    staleTime: 5 * 60 * 1000, // 5 minutes - dashboard data doesn't change frequently
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Don't retry on 429 errors
      if (error?.response?.status === 429) {
        return false;
      }
      return failureCount < 2;
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Assets"
          value={isLoading ? "..." : overview?.assetStats?.countByType.total || 0}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Risks"
          value={isLoading ? "..." : overview?.summary.totalRisks || 0}
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        />
        <ComplianceStatus />
        <StatsCard
          title="Active Policies"
          value={isLoading ? "..." : overview?.summary.activePolicies || 0}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Asset Analytics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AssetTypeChart 
          data={overview?.assetStats?.countByType} 
          isLoading={isLoading} 
        />
        <AssetCriticalityChart 
          data={overview?.assetStats?.countByCriticality} 
          isLoading={isLoading} 
        />
        <AssetsWithoutOwner 
          data={overview?.assetStats?.assetsWithoutOwner} 
          isLoading={isLoading} 
        />
      </div>

      {/* Risk & Compliance Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RiskHeatmap organizationId="org-123" />
        </div>
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold leading-none tracking-tight mb-4">Compliance Score</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{overview?.summary.complianceScore || 0}%</span>
                <Shield className="h-8 w-8 text-primary" />
              </div>
              {overview?.summary.totalRequirements && (
                <div className="text-sm text-muted-foreground">
                  {overview.summary.compliantRequirements || 0} of {overview.summary.totalRequirements} requirements compliant
                </div>
              )}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${overview?.summary.complianceScore || 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentAssetChanges 
          data={overview?.assetStats?.recentChanges} 
          isLoading={isLoading} 
        />
        <TaskList />
        <PendingApprovalsWidget />
      </div>
    </div>
  )
}