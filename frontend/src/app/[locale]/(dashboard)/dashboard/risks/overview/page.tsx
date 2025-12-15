"use client"

import { useQuery } from "@tanstack/react-query"
import { risksApi, riskTreatmentsApi, krisApi } from "@/lib/api/risks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import { RiskHeatmap } from "@/components/risks/risk-heatmap"
import { RiskTrendChart } from "@/components/risks/risk-trend-chart"
import { ShieldAlert, Target, Activity, TrendingUp, AlertTriangle, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { RiskExportButton } from "@/components/export/risk-export-button"

export default function RiskDashboardPage() {
  const params = useParams()
  const locale = params?.locale || 'en'

  const { data: dashboardSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['risk-dashboard-summary'],
    queryFn: () => risksApi.getDashboardSummary(),
  })

  const { data: topRisks, isLoading: topRisksLoading } = useQuery({
    queryKey: ['top-risks'],
    queryFn: () => risksApi.getTopRisks(10),
  })

  const { data: reviewDueRisks, isLoading: reviewDueLoading } = useQuery({
    queryKey: ['risks-review-due'],
    queryFn: () => risksApi.getRisksNeedingReview(30),
  })

  const { data: heatmapData, isLoading: heatmapLoading } = useQuery({
    queryKey: ['risk-heatmap'],
    queryFn: () => risksApi.getHeatmap(),
  })

  const { data: treatmentSummary, isLoading: treatmentLoading } = useQuery({
    queryKey: ['treatment-summary'],
    queryFn: () => riskTreatmentsApi.getSummary(),
  })

  const { data: kriSummary, isLoading: kriLoading } = useQuery({
    queryKey: ['kri-summary'],
    queryFn: () => krisApi.getSummary(),
  })

  // Fetch all risks for export
  const { data: allRisks } = useQuery({
    queryKey: ['all-risks-for-export'],
    queryFn: () => risksApi.getAll({ limit: 1000 }),
  })

  // Fetch treatments for export
  const { data: treatments } = useQuery({
    queryKey: ['all-treatments-for-export'],
    queryFn: () => riskTreatmentsApi.getAll(),
  })

  // Fetch KRIs for export
  const { data: kris } = useQuery({
    queryKey: ['all-kris-for-export'],
    queryFn: () => krisApi.getAll(),
  })

  const summary = dashboardSummary || {}
  const heatmap = heatmapData || {}

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Risk Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of risk management activities
          </p>
        </div>
        <RiskExportButton
          risks={allRisks?.data || []}
          treatments={treatments || []}
          kris={kris || []}
          heatmapCells={heatmap?.cells || heatmap?.heatmap?.cells || []}
          dashboardSummary={summary}
          variant="full"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Risks"
          value={summaryLoading ? "..." : summary.total_risks || 0}
          icon={<ShieldAlert className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Critical Risks"
          value={summaryLoading ? "..." : summary.critical_risks || 0}
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          className="border-red-200 dark:border-red-900"
        />
        <StatsCard
          title="Active Treatments"
          value={treatmentLoading ? "..." : treatmentSummary?.active_treatments || summary.active_treatments || 0}
          icon={<Target className="h-4 w-4 text-green-500" />}
          className="border-green-200 dark:border-green-900"
        />
        <StatsCard
          title="Active KRIs"
          value={kriLoading ? "..." : kriSummary?.active_kris || 0}
          icon={<Activity className="h-4 w-4 text-blue-500" />}
          className="border-blue-200 dark:border-blue-900"
        />
      </div>

      {/* Risk Level Distribution */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.critical_risks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.total_risks ? Math.round((summary.critical_risks / summary.total_risks) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{summary.high_risks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.total_risks ? Math.round((summary.high_risks / summary.total_risks) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Medium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary.medium_risks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.total_risks ? Math.round((summary.medium_risks / summary.total_risks) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.low_risks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.total_risks ? Math.round((summary.low_risks / summary.total_risks) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Risk Heatmap */}
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Risk Heatmap</CardTitle>
            <CardDescription>Risk distribution by likelihood and impact</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskHeatmap 
              data={heatmap?.cells ? { cells: heatmap.cells } : heatmap} 
              isLoading={heatmapLoading} 
            />
          </CardContent>
        </Card>

        {/* Risk Trend Chart */}
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Risk Trends</CardTitle>
            <CardDescription>Risk level changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskTrendChart />
          </CardContent>
        </Card>
      </div>

      {/* Top Risks and Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Risks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Risks</CardTitle>
              <Link href={`/${locale}/dashboard/risks`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  View All
                </Badge>
              </Link>
            </div>
            <CardDescription>Highest risk scores requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {topRisksLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : topRisks && topRisks.length > 0 ? (
              <div className="space-y-2">
                {topRisks.slice(0, 5).map((risk: any) => {
                  // Convert enum to number if needed (handles both "3" and "MEDIUM" formats)
                  const toNumber = (val: any): number => {
                    if (typeof val === 'number') return val
                    const num = Number(val)
                    if (!isNaN(num)) return num
                    // Handle enum string keys
                    const enumMap: Record<string, number> = {
                      'VERY_LOW': 1, 'LOW': 2, 'MEDIUM': 3, 'HIGH': 4, 'VERY_HIGH': 5
                    }
                    return enumMap[val?.toUpperCase()] || 3
                  }
                  
                  // Calculate score from likelihood x impact if current_risk_score not set
                  const likelihood = toNumber(risk.current_likelihood || risk.likelihood)
                  const impact = toNumber(risk.current_impact || risk.impact)
                  const riskScore = risk.current_risk_score || (likelihood * impact) || 0
                  
                  // Determine risk level from score if not explicitly set
                  const computeRiskLevel = (score: number, explicitLevel?: string) => {
                    if (explicitLevel) return explicitLevel
                    if (score >= 20) return 'critical'
                    if (score >= 12) return 'high'
                    if (score >= 6) return 'medium'
                    if (score >= 1) return 'low'
                    return 'unknown'
                  }
                  
                  const riskLevel = computeRiskLevel(riskScore, risk.current_risk_level)
                  
                  const getLevelColor = (level?: string) => {
                    switch (level) {
                      case 'critical': return 'bg-red-500 text-white'
                      case 'high': return 'bg-orange-500 text-white'
                      case 'medium': return 'bg-yellow-500 text-white'
                      case 'low': return 'bg-green-500 text-white'
                      default: return 'bg-gray-500 text-white'
                    }
                  }
                  return (
                    <Link
                      key={risk.id}
                      href={`/${locale}/dashboard/risks/${risk.id}`}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{risk.title}</span>
                          {risk.risk_id && (
                            <Badge variant="outline" className="font-mono text-xs">
                              {risk.risk_id}
                            </Badge>
                          )}
                        </div>
                        <Badge className={`${getLevelColor(riskLevel)} text-xs`}>
                          {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} ({riskScore})
                        </Badge>
                      </div>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No risks found</div>
            )}
          </CardContent>
        </Card>

        {/* Review Due & Treatment Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Reviews</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Review Due */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="font-semibold text-sm">Review Due</span>
                </div>
                <Badge variant="secondary">
                  {reviewDueLoading ? "..." : reviewDueRisks?.length || 0}
                </Badge>
              </div>
              {reviewDueRisks && reviewDueRisks.length > 0 ? (
                <div className="space-y-1">
                  {reviewDueRisks.slice(0, 3).map((risk: any) => (
                    <Link
                      key={risk.id}
                      href={`/${locale}/dashboard/risks/${risk.id}`}
                      className="text-sm text-muted-foreground hover:text-primary block truncate"
                    >
                      {risk.risk_id} - {risk.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No reviews due</p>
              )}
            </div>

            {/* Treatment Progress */}
            {treatmentSummary && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-sm">Treatment Progress</span>
                  </div>
                  <Badge variant="secondary">
                    {treatmentSummary.completed_treatments || 0} / {treatmentSummary.total_treatments || 0}
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${treatmentSummary.total_treatments
                        ? Math.round((treatmentSummary.completed_treatments / treatmentSummary.total_treatments) * 100)
                        : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* KRI Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-sm">KRI Status</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-red-50 dark:bg-red-950 rounded">
                  <div className="font-bold text-red-600">{summary.kri_red_count || kriSummary?.red_count || 0}</div>
                  <div className="text-muted-foreground">Red</div>
                </div>
                <div className="text-center p-2 bg-amber-50 dark:bg-amber-950 rounded">
                  <div className="font-bold text-amber-600">{summary.kri_amber_count || kriSummary?.amber_count || 0}</div>
                  <div className="text-muted-foreground">Amber</div>
                </div>
                <div className="text-center p-2 bg-green-50 dark:bg-green-950 rounded">
                  <div className="font-bold text-green-600">{kriSummary?.green_count || 0}</div>
                  <div className="text-muted-foreground">Green</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

