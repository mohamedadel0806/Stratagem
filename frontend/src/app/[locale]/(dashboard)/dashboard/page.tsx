"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { ComplianceStatus } from "@/components/dashboard/widgets/compliance-status"
import { TaskList } from "@/components/dashboard/widgets/task-list"
import { RiskHeatmap } from "@/components/dashboard/widgets/risk-heatmap"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import { AssetTypeChart } from "@/components/dashboard/widgets/asset-type-chart"
import { AssetCriticalityChart } from "@/components/dashboard/widgets/asset-criticality-chart"
import { SupplierCriticalityChart } from "@/components/dashboard/widgets/supplier-criticality-chart"
import { AssetsWithoutOwner } from "@/components/dashboard/widgets/assets-without-owner"
import { RecentAssetChanges } from "@/components/dashboard/widgets/recent-asset-changes"
import { PendingApprovalsWidget } from "@/components/dashboard/widgets/pending-approvals-widget"
import { AssetsByComplianceScope } from "@/components/dashboard/widgets/assets-by-compliance-scope"
import { AssetsWithOutdatedSecurityTests } from "@/components/dashboard/widgets/assets-with-outdated-security-tests"
import { AssetsConnectivityChart } from "@/components/dashboard/widgets/assets-connectivity-chart"
import { Button } from "@/components/ui/button"
import { dashboardApi } from "@/lib/api/dashboard"
import { AlertTriangle, FileText, Shield, Package } from "lucide-react"

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic';

type DashboardWidgetKey =
  | "assetType"
  | "criticality"
  | "withoutOwner"
  | "complianceScope"
  | "outdatedTests"
  | "connectivity"
  | "riskHeatmap"
  | "supplierCriticality";

const DEFAULT_WIDGETS: DashboardWidgetKey[] = [
  "assetType",
  "criticality",
  "withoutOwner",
  "complianceScope",
  "outdatedTests",
  "connectivity",
  "riskHeatmap",
  "supplierCriticality",
];

function useDashboardWidgetPreferences(): [DashboardWidgetKey[], (widgets: DashboardWidgetKey[]) => void] {
  const [widgets, setWidgets] = React.useState<DashboardWidgetKey[]>(DEFAULT_WIDGETS);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem("dashboard-widgets");
      if (stored) {
        const parsed = JSON.parse(stored) as DashboardWidgetKey[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWidgets(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const update = React.useCallback((next: DashboardWidgetKey[]) => {
    setWidgets(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("dashboard-widgets", JSON.stringify(next));
    }
  }, []);

  return [widgets, update];
}

async function exportDashboardToPdf(overview: any) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Asset Dashboard Summary", 14, 18);

  doc.setFontSize(11);
  let y = 30;

  doc.text(`Total Assets: ${overview?.assetStats?.countByType.total || 0}`, 14, y);
  y += 6;
  doc.text(`Total Risks: ${overview?.summary.totalRisks || 0}`, 14, y);
  y += 6;
  doc.text(`Active Policies: ${overview?.summary.activePolicies || 0}`, 14, y);
  y += 6;
  doc.text(`Compliance Score: ${overview?.summary.complianceScore || 0}%`, 14, y);
  y += 10;

  doc.text("Assets by Type:", 14, y);
  y += 6;
  const byType = overview?.assetStats?.countByType;
  if (byType) {
    doc.setFontSize(10);
    doc.text(`Physical: ${byType.physical || 0}`, 16, y); y += 5;
    doc.text(`Information: ${byType.information || 0}`, 16, y); y += 5;
    doc.text(`Applications: ${byType.application || 0}`, 16, y); y += 5;
    doc.text(`Software: ${byType.software || 0}`, 16, y); y += 5;
    doc.text(`Suppliers: ${byType.supplier || 0}`, 16, y); y += 8;
  }

  doc.setFontSize(11);
  doc.text("Assets by Criticality:", 14, y);
  y += 6;
  const byCrit = overview?.assetStats?.countByCriticality;
  if (byCrit) {
    doc.setFontSize(10);
    doc.text(`Critical: ${byCrit.critical || 0}`, 16, y); y += 5;
    doc.text(`High: ${byCrit.high || 0}`, 16, y); y += 5;
    doc.text(`Medium: ${byCrit.medium || 0}`, 16, y); y += 5;
    doc.text(`Low: ${byCrit.low || 0}`, 16, y); y += 8;
  }

  doc.save("asset-dashboard.pdf");
}

export default function DashboardPage() {
  const [enabledWidgets, setEnabledWidgets] = useDashboardWidgetPreferences();
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
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span>Widgets:</span>
            {(
              [
                "assetType",
                "criticality",
                "withoutOwner",
                "complianceScope",
                "outdatedTests",
                "connectivity",
                "riskHeatmap",
              ] as DashboardWidgetKey[]
            ).map((key) => (
              <button
                key={key}
                type="button"
                className={`px-2 py-1 rounded border text-[10px] ${
                  enabledWidgets.includes(key)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-muted"
                }`}
                onClick={() => {
                  setEnabledWidgets(
                    enabledWidgets.includes(key)
                      ? enabledWidgets.filter((k) => k !== key)
                      : [...enabledWidgets, key]
                  );
                }}
              >
                {key}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={() => overview && exportDashboardToPdf(overview)}
          >
            Export PDF
          </Button>
        </div>
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
        {enabledWidgets.includes("assetType") && (
          <AssetTypeChart 
            data={overview?.assetStats?.countByType} 
            isLoading={isLoading} 
          />
        )}
        {enabledWidgets.includes("criticality") && (
          <AssetCriticalityChart 
            data={overview?.assetStats?.countByCriticality} 
            isLoading={isLoading} 
          />
        )}
        {enabledWidgets.includes("withoutOwner") && (
          <AssetsWithoutOwner 
            data={overview?.assetStats?.assetsWithoutOwner} 
            isLoading={isLoading} 
          />
        )}
        {enabledWidgets.includes("complianceScope") && (
          <AssetsByComplianceScope
            data={overview?.assetStats?.assetsByComplianceScope}
            isLoading={isLoading}
          />
        )}
        {enabledWidgets.includes("outdatedTests") && (
          <AssetsWithOutdatedSecurityTests
            data={overview?.assetStats?.assetsWithOutdatedSecurityTests}
            isLoading={isLoading}
          />
        )}
        {enabledWidgets.includes("connectivity") && (
          <AssetsConnectivityChart
            data={overview?.assetStats?.countByConnectivityStatus}
            isLoading={isLoading}
          />
        )}
        {enabledWidgets.includes("supplierCriticality") && (
          <SupplierCriticalityChart
            data={overview?.supplierCriticality}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Risk & Compliance Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {enabledWidgets.includes("riskHeatmap") && (
          <div className="col-span-4">
            <RiskHeatmap organizationId="org-123" />
          </div>
        )}
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