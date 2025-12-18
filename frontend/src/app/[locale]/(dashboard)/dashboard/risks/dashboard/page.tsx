"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { risksApi } from "@/lib/api/risks"
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Target, 
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { RiskHeatmap } from "@/components/dashboard/widgets/risk-heatmap"
import { TopRisksWidget } from "@/components/dashboard/widgets/top-risks-widget"
import { TreatmentProgressWidget } from "@/components/dashboard/widgets/treatment-progress-widget"
import { RiskAppetiteWidget } from "@/components/dashboard/widgets/risk-appetite-widget"
import { RiskTrendChart } from "@/components/dashboard/widgets/risk-trend-chart"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function RiskDashboardPage() {
  const params = useParams()
  const locale = params.locale as string

  const { data: summary, isLoading } = useQuery({
    queryKey: ['risk-dashboard-summary'],
    queryFn: () => risksApi.getDashboardSummary(),
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of your organization's risk landscape
          </p>
        </div>
        <Link href={`/${locale}/dashboard/risks`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            View All Risks
          </Badge>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Risks</p>
                <p className="text-2xl font-bold mt-1">
                  {isLoading ? "..." : summary?.total_risks || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Risks</p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {isLoading ? "..." : summary?.critical_risks || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Treatments</p>
                <p className="text-2xl font-bold mt-1">
                  {isLoading ? "..." : summary?.active_treatments || 0}
                </p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Reviews</p>
                <p className="text-2xl font-bold mt-1 text-orange-600">
                  {isLoading ? "..." : summary?.overdue_reviews || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Level Breakdown */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Critical</p>
                <p className="text-xl font-bold text-red-600">
                  {isLoading ? "..." : summary?.critical_risks || 0}
                </p>
              </div>
              <Badge className="bg-red-600 text-white">Critical</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">High</p>
                <p className="text-xl font-bold text-orange-600">
                  {isLoading ? "..." : summary?.high_risks || 0}
                </p>
              </div>
              <Badge className="bg-orange-500 text-white">High</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Medium</p>
                <p className="text-xl font-bold text-yellow-600">
                  {isLoading ? "..." : summary?.medium_risks || 0}
                </p>
              </div>
              <Badge className="bg-yellow-400 text-black">Medium</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Low</p>
                <p className="text-xl font-bold text-green-600">
                  {isLoading ? "..." : summary?.low_risks || 0}
                </p>
              </div>
              <Badge className="bg-green-400 text-black">Low</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Risk Heatmap - Takes 2 columns */}
        <div className="md:col-span-2">
          <RiskHeatmap />
        </div>

        {/* Risk Appetite Widget */}
        <div>
          <RiskAppetiteWidget />
        </div>
      </div>

      {/* Secondary Widgets Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TopRisksWidget limit={5} />
        <TreatmentProgressWidget />
        <RiskTrendChart days={30} />
      </div>

      {/* KRI Status Summary */}
      {(summary?.kri_red_count || summary?.kri_amber_count) && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Key Risk Indicators (KRIs)</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-900 dark:text-red-100">Red Status</p>
                  <p className="text-2xl font-bold text-red-600">
                    {summary?.kri_red_count || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-100">Amber Status</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {summary?.kri_amber_count || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">Green Status</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(summary?.kri_red_count || 0) + (summary?.kri_amber_count || 0) === 0 
                      ? "All Clear" 
                      : "Monitoring"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Link href={`/${locale}/dashboard/risks?status=identified`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent p-2">
                View New Risks
              </Badge>
            </Link>
            <Link href={`/${locale}/dashboard/risks?current_risk_level=critical`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent p-2">
                View Critical Risks
              </Badge>
            </Link>
            <Link href={`/${locale}/dashboard/risks/settings`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent p-2">
                Risk Settings
              </Badge>
            </Link>
            <Link href={`/${locale}/dashboard/risks/analysis`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent p-2">
                Risk Analysis Tools
              </Badge>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}





