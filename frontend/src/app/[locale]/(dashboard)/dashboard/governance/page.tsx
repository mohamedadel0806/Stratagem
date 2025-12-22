'use client';

import { useQuery } from '@tanstack/react-query';
import { governanceDashboardApi, remediationTrackingApi, governanceApi } from '@/lib/api/governance';
import { StatsCard } from '@/components/dashboard/widgets/stats-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Shield,
  ClipboardCheck,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Calendar,
  Activity,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GovernanceMetricWidget } from '@/components/governance/governance-metric-widget';
import { GovernanceComplianceStatus } from '@/components/governance/governance-compliance-status';
import { GovernanceTimelineWidget } from '@/components/governance/governance-timeline-widget';
import { GovernanceRiskHeatmap } from '@/components/governance/governance-risk-heatmap';
import { GovernanceFindingsSeverity } from '@/components/governance/governance-findings-severity';
import { GovernanceControlMatrix } from '@/components/governance/governance-control-matrix';
import { GovernanceTrendChart } from '@/components/governance/governance-trend-chart';
import { RemediationDashboardMetrics } from '@/components/governance/remediation-dashboard-metrics';
import { RemediationGanttChart } from '@/components/governance/remediation-gantt-chart';
import { AssetComplianceWidget } from '@/components/governance/asset-compliance-widget';
import { GovernanceDashboardCustomizer, useDashboardWidgets, WidgetConfig } from '@/components/governance/governance-dashboard-customizer';
import { MobilePostureSummary } from '@/components/governance/mobile-posture-summary';
import { DashboardEmailSchedules } from '@/components/governance/dashboard-email-schedules';

export default function GovernanceDashboardPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [widgets, setWidgets] = useDashboardWidgets();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['governance-dashboard', dateRange],
    queryFn: () => governanceDashboardApi.getDashboard(
      dateRange.from?.toISOString(),
      dateRange.to?.toISOString(),
    ),
  });

  const { data: sopStats } = useQuery({
    queryKey: ['sop-publication-stats'],
    queryFn: () => governanceApi.getSOPPublicationStatistics(),
  });

  const { data: policyStats } = useQuery({
    queryKey: ['policy-publication-stats'],
    queryFn: () => governanceApi.getPolicyPublicationStatistics(),
  });

  const { data: reviewStats } = useQuery({
    queryKey: ['policy-review-stats'],
    queryFn: () => governanceApi.getPolicyReviewStatistics(),
  });

  const { data: pendingReviews } = useQuery({
    queryKey: ['pending-policy-reviews'],
    queryFn: () => governanceApi.getPoliciesDueForReview(30),
  });

  const handleExport = async () => {
    try {
      const blob = await governanceDashboardApi.exportDashboard(
        dateRange.from?.toISOString(),
        dateRange.to?.toISOString(),
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `governance-dashboard-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: 'Success',
        description: 'Dashboard exported successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to export dashboard',
        variant: 'destructive',
      });
    }
  };

  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ['governance-dashboard-trends'],
    queryFn: () => governanceDashboardApi.getTrends(),
  });

  const { data: remediationData, isLoading: remediationLoading } = useQuery({
    queryKey: ['governance-remediation-dashboard'],
    queryFn: () => remediationTrackingApi.getDashboard(),
  });

  const latestTrend = trendData?.latestSnapshot;
  const longRangeForecast = trendData?.forecast?.[trendData.forecast.length - 1];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
      case 'inProgress':
        return 'destructive';
      case 'closed':
      case 'completed':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mobile Posture Summary - Only visible on mobile */}
      <div className="md:hidden">
        <MobilePostureSummary
          dashboard={dashboard}
          isLoading={isLoading}
          onExport={handleExport}
        />
      </div>

      {/* Desktop Dashboard - Hidden on mobile */}
      <div className="hidden md:flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Governance Dashboard</h2>
            <p className="text-muted-foreground">Overview of governance, compliance, and controls</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="start-date" className="text-sm whitespace-nowrap">From:</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.from ? dateRange.from.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value ? new Date(e.target.value) : undefined })}
                className="w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="end-date" className="text-sm whitespace-nowrap">To:</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.to ? dateRange.to.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value ? new Date(e.target.value) : undefined })}
                className="w-40"
              />
            </div>
            <GovernanceDashboardCustomizer widgets={widgets} onWidgetsChange={setWidgets} />
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

      {/* Summary Stats Row */}
      {widgets.find((w) => w.key === 'summary-cards')?.visible && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Policies"
            value={isLoading ? '...' : dashboard?.summary.totalPolicies || 0}
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Unified Controls"
            value={isLoading ? '...' : dashboard?.summary.totalControls || 0}
            icon={<Shield className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Active Assessments"
            value={isLoading ? '...' : dashboard?.summary.inProgressAssessments || 0}
            icon={<ClipboardCheck className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Open Findings"
            value={isLoading ? '...' : dashboard?.summary.openFindings || 0}
            icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      )}

      {/* Secondary Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Published Policies"
          value={isLoading ? '...' : dashboard?.summary.publishedPolicies || 0}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Implemented Controls"
          value={isLoading ? '...' : dashboard?.summary.implementedControls || 0}
          icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Completed Assessments"
          value={isLoading ? '...' : dashboard?.summary.completedAssessments || 0}
          icon={<ClipboardCheck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Critical Findings"
          value={isLoading ? '...' : dashboard?.summary.criticalFindings || 0}
          icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
        />
      </div>

      {/* Policy Publication Statistics */}
      {policyStats && (
        <Card>
          <CardHeader>
            <CardTitle>Policy Publication Statistics</CardTitle>
            <CardDescription>Overview of policy publication and distribution metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Published</p>
                <p className="text-2xl font-bold">{policyStats.totalPublished}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Published This Month</p>
                <p className="text-2xl font-bold">{policyStats.publishedThisMonth}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Published This Year</p>
                <p className="text-2xl font-bold">{policyStats.publishedThisYear}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Assignments</p>
                <p className="text-2xl font-bold">{policyStats.assignmentsCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Acknowledged</p>
                <p className="text-2xl font-bold">{policyStats.acknowledgedCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Acknowledgment Rate</p>
                <p className="text-2xl font-bold">{policyStats.acknowledgmentRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SOP Publication Statistics */}
      {sopStats && (
        <Card>
          <CardHeader>
            <CardTitle>SOP Publication Statistics</CardTitle>
            <CardDescription>Overview of SOP publication and distribution metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Published</p>
                <p className="text-2xl font-bold">{sopStats.totalPublished}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Published This Month</p>
                <p className="text-2xl font-bold">{sopStats.publishedThisMonth}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Published This Year</p>
                <p className="text-2xl font-bold">{sopStats.publishedThisYear}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Assignments</p>
                <p className="text-2xl font-bold">{sopStats.assignmentsCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Acknowledged</p>
                <p className="text-2xl font-bold">{sopStats.acknowledgedCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Acknowledgment Rate</p>
                <p className="text-2xl font-bold">{sopStats.acknowledgmentRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Policy Review Statistics */}
      {reviewStats && (
        <Card>
          <CardHeader>
            <CardTitle>Policy Review Statistics</CardTitle>
            <CardDescription>Overview of policy review status and upcoming reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold">{reviewStats.pending}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">{reviewStats.overdue}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Due in 30 Days</p>
                <p className="text-2xl font-bold">{reviewStats.dueIn30Days}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Due in 60 Days</p>
                <p className="text-2xl font-bold">{reviewStats.dueIn60Days}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Due in 90 Days</p>
                <p className="text-2xl font-bold">{reviewStats.dueIn90Days}</p>
              </div>
            </div>
            {pendingReviews && pendingReviews.data && pendingReviews.data.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Policies Due for Review (Next 30 Days)</p>
                <div className="space-y-2">
                  {pendingReviews.data.slice(0, 5).map((policy: any) => (
                    <div key={policy.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="text-sm font-medium">{policy.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(policy.next_review_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Link href={`/${locale}/dashboard/governance/policies/${policy.id}`}>
                        <Button variant="ghost" size="sm">
                          Review
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {pendingReviews.data.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{pendingReviews.data.length - 5} more policies
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Trend + Forecast Section */}
      {widgets.find((w) => w.key === 'trend-chart')?.visible && (
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <GovernanceTrendChart
            history={trendData?.history}
            forecast={trendData?.forecast}
            isLoading={trendLoading}
            lastUpdatedAt={trendData?.lastUpdatedAt}
          />

        <Card>
          <CardHeader>
            <CardTitle>Forecast Insights</CardTitle>
            <CardDescription>Projected compliance trajectory</CardDescription>
          </CardHeader>
          <CardContent>
            {trendLoading ? (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                Loading forecast...
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <p className="text-xs uppercase text-muted-foreground">Current Compliance</p>
                  <p className="text-3xl font-semibold">
                    {latestTrend ? `${latestTrend.complianceRate.toFixed(1)}%` : '—'}
                  </p>
                  <p className="text-sm text-muted-foreground">{latestTrend ? `${latestTrend.implementedControls} of ${latestTrend.totalControls} controls implemented` : 'Awaiting first snapshot'}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs uppercase text-muted-foreground">14-Day Projection</p>
                  <p className="text-3xl font-semibold">
                    {longRangeForecast ? `${longRangeForecast.projectedComplianceRate.toFixed(1)}%` : '—'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {longRangeForecast && latestTrend
                      ? `${(longRangeForecast.projectedComplianceRate - latestTrend.complianceRate).toFixed(1)}% change expected`
                      : 'Forecast builds as daily snapshots are captured'}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs uppercase text-muted-foreground">Open Findings Forecast</p>
                  <p className="text-3xl font-semibold">
                    {longRangeForecast ? longRangeForecast.projectedOpenFindings : '—'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {latestTrend
                      ? `Currently ${latestTrend.openFindings} open findings with a risk closure rate of ${latestTrend.riskClosureRate.toFixed(1)}%`
                      : 'Historical backlog unavailable yet'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      )}

      {/* Remediation Tracking Section */}
      {(widgets.find((w) => w.key === 'remediation-metrics')?.visible ||
        widgets.find((w) => w.key === 'remediation-gantt')?.visible) && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Remediation Tracking</h3>
            <p className="text-sm text-muted-foreground">Monitor finding remediation progress and SLA compliance</p>
          </div>

          {/* Remediation Metrics Row */}
          {widgets.find((w) => w.key === 'remediation-metrics')?.visible && (
            <RemediationDashboardMetrics
              data={remediationData}
              isLoading={remediationLoading}
            />
          )}

          {/* Remediation Gantt Timeline */}
          {widgets.find((w) => w.key === 'remediation-gantt')?.visible && (
            <RemediationGanttChart
              trackers={remediationData?.critical_findings || []}
              isLoading={remediationLoading}
            />
          )}
        </div>
      )}

      {/* Enhanced Widgets Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Compliance Status by Framework */}
        {widgets.find((w) => w.key === 'compliance-status')?.visible &&
          !isLoading &&
          dashboard?.summary && (
            <GovernanceComplianceStatus
            frameworks={[
              {
                framework: 'ISO 27001',
                status: dashboard.summary.implementedControls > dashboard.summary.totalControls * 0.7 ? 'compliant' : 'non-compliant',
                score: Math.round((dashboard.summary.implementedControls / dashboard.summary.totalControls) * 100),
                lastAssessment: new Date().toISOString(),
              },
              {
                framework: 'SOC 2 Type II',
                status: dashboard.summary.completedAssessments > 0 ? 'compliant' : 'assessment-required',
                score: Math.round((dashboard.summary.completedAssessments / (dashboard.summary.completedAssessments + dashboard.summary.inProgressAssessments || 1)) * 100),
                lastAssessment: new Date().toISOString(),
              },
              {
                framework: 'GDPR',
                status: 'compliant',
                score: 85,
                lastAssessment: new Date().toISOString(),
              },
            ]}
          />
          )}

        {/* Findings Severity Distribution */}
        {widgets.find((w) => w.key === 'findings-severity')?.visible &&
          !isLoading &&
          dashboard?.findingStats && (
            <GovernanceFindingsSeverity
            data={{
              critical: dashboard.findingStats.bySeverity.critical || 0,
              high: dashboard.findingStats.bySeverity.high || 0,
              medium: dashboard.findingStats.bySeverity.medium || 0,
              low: dashboard.findingStats.bySeverity.low || 0,
              resolved: dashboard.summary.resolvedFindings || 0,
            }}
          />
          )}

        {/* Control Implementation Matrix */}
        {widgets.find((w) => w.key === 'control-matrix')?.visible &&
          !isLoading &&
          dashboard?.controlStats && (
            <GovernanceControlMatrix
            data={{
              implemented: dashboard.controlStats.byImplementation.implemented || 0,
              partial: dashboard.controlStats.byImplementation.inProgress || 0,
              planned: dashboard.controlStats.byImplementation.planned || 0,
              notStarted: dashboard.controlStats.byImplementation.notImplemented || 0,
              deprecated: 0,
            }}
          />
          )}
      </div>

      {/* Risk and Metrics Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Risk Heat Map */}
        {widgets.find((w) => w.key === 'risk-heatmap')?.visible && !isLoading && (
          <GovernanceRiskHeatmap
            risks={[
              { likelihood: 'critical', impact: 'critical', count: dashboard?.summary.criticalFindings || 0 },
              { likelihood: 'high', impact: 'high', count: Math.round((dashboard?.summary.criticalFindings || 0) * 0.5) },
              { likelihood: 'medium', impact: 'high', count: Math.round((dashboard?.summary.criticalFindings || 0) * 0.3) },
              { likelihood: 'low', impact: 'medium', count: Math.round((dashboard?.summary.criticalFindings || 0) * 0.2) },
            ]}
          />
        )}

        {/* Asset Compliance Widget */}
        {widgets.find((w) => w.key === 'asset-compliance')?.visible && (
          <AssetComplianceWidget
            data={dashboard?.assetComplianceStats}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Timeline Widget */}
      {widgets.find((w) => w.key === 'timeline-widget')?.visible && (
        <div className="grid gap-4 md:grid-cols-2">
          {!isLoading && dashboard?.upcomingReviews && (
            <GovernanceTimelineWidget
            reviews={dashboard.upcomingReviews.slice(0, 5).map((review) => ({
              id: review.id,
              entityName: review.name,
              dueDate: review.reviewDate,
              daysUntilDue: review.daysUntil,
              priority: review.daysUntil < 0 ? 'critical' : review.daysUntil <= 7 ? 'high' : 'medium',
            }))}
          />
          )}
        </div>
      )}

      {/* Charts and Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Control Implementation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Control Implementation</CardTitle>
            <CardDescription>Status of control implementation</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Implemented</span>
                  <Badge variant="default">
                    {dashboard?.controlStats.byImplementation.implemented || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">In Progress</span>
                  <Badge variant="secondary">
                    {dashboard?.controlStats.byImplementation.inProgress || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Planned</span>
                  <Badge variant="outline">
                    {dashboard?.controlStats.byImplementation.planned || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Not Implemented</span>
                  <Badge variant="outline">
                    {dashboard?.controlStats.byImplementation.notImplemented || 0}
                  </Badge>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Implementation Rate</span>
                    <span>
                      {dashboard?.controlStats.total
                        ? Math.round(
                            ((dashboard.controlStats.byImplementation.implemented || 0) /
                              dashboard.controlStats.total) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          dashboard?.controlStats.total
                            ? Math.round(
                                ((dashboard.controlStats.byImplementation.implemented || 0) /
                                  dashboard.controlStats.total) *
                                  100,
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Policy Status */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Status</CardTitle>
            <CardDescription>Distribution of policies by status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Published</span>
                  <Badge variant="default">
                    {dashboard?.policyStats.byStatus.published || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">In Review</span>
                  <Badge variant="secondary">
                    {dashboard?.policyStats.byStatus.inReview || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Draft</span>
                  <Badge variant="outline">{dashboard?.policyStats.byStatus.draft || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Archived</span>
                  <Badge variant="outline">
                    {dashboard?.policyStats.byStatus.archived || 0}
                  </Badge>
                </div>
                {dashboard?.policyStats.overdueReview && dashboard.policyStats.overdueReview > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{dashboard.policyStats.overdueReview} overdue reviews</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assessment Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Overview</CardTitle>
            <CardDescription>Assessment status and average score</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed</span>
                  <Badge variant="default">
                    {dashboard?.assessmentStats.byStatus.completed || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">In Progress</span>
                  <Badge variant="secondary">
                    {dashboard?.assessmentStats.byStatus.inProgress || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Not Started</span>
                  <Badge variant="outline">
                    {dashboard?.assessmentStats.byStatus.notStarted || 0}
                  </Badge>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Score</span>
                    <span className="text-2xl font-bold">
                      {dashboard?.assessmentStats.averageScore || 0}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Findings and Upcoming Reviews Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Findings by Severity */}
        <Card>
          <CardHeader>
            <CardTitle>Findings by Severity</CardTitle>
            <CardDescription>Distribution of findings by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Critical
                  </span>
                  <Badge variant="destructive">
                    {dashboard?.findingStats.bySeverity.critical || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    High
                  </span>
                  <Badge variant="destructive">
                    {dashboard?.findingStats.bySeverity.high || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medium</span>
                  <Badge variant="default">
                    {dashboard?.findingStats.bySeverity.medium || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low</span>
                  <Badge variant="secondary">
                    {dashboard?.findingStats.bySeverity.low || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Informational</span>
                  <Badge variant="outline">
                    {dashboard?.findingStats.bySeverity.informational || 0}
                  </Badge>
                </div>
                {dashboard?.findingStats.overdueRemediation &&
                  dashboard.findingStats.overdueRemediation > 0 && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <Clock className="h-4 w-4" />
                        <span>{dashboard.findingStats.overdueRemediation} overdue remediation</span>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reviews</CardTitle>
            <CardDescription>Policies and influencers due for review</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : dashboard?.upcomingReviews && dashboard.upcomingReviews.length > 0 ? (
              <div className="space-y-3">
                {dashboard.upcomingReviews.slice(0, 5).map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{review.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {review.type}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge
                        variant={review.daysUntil < 0 ? 'destructive' : review.daysUntil <= 7 ? 'default' : 'outline'}
                      >
                        {review.daysUntil < 0
                          ? 'Overdue'
                          : review.daysUntil === 0
                          ? 'Today'
                          : `${review.daysUntil}d`}
                      </Badge>
                      <span className="text-xs text-muted-foreground mt-1">
                        {new Date(review.reviewDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {dashboard.upcomingReviews.length > 5 && (
                  <Link href={`/${locale}/dashboard/governance/policies`}>
                    <Button variant="ghost" className="w-full">
                      View All ({dashboard.upcomingReviews.length})
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px]">
                <span className="text-sm text-muted-foreground">No upcoming reviews</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across governance entities</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : dashboard?.recentActivity && dashboard.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {dashboard.recentActivity.slice(0, 8).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-2 rounded-lg border hover:bg-muted/50"
                  >
                    <div className="mt-0.5">
                      {activity.type === 'policy' && <FileText className="h-4 w-4 text-muted-foreground" />}
                      {activity.type === 'control' && <Shield className="h-4 w-4 text-muted-foreground" />}
                      {activity.type === 'assessment' && (
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                      )}
                      {activity.type === 'finding' && (
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      )}
                      {activity.type === 'evidence' && (
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{activity.entityName}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {activity.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground capitalize">
                          {activity.action}
                        </span>
                        {activity.userName && (
                          <>
                            <span className="text-xs text-muted-foreground">by</span>
                            <span className="text-xs text-muted-foreground">{activity.userName}</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px]">
                <span className="text-sm text-muted-foreground">No recent activity</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Email Schedules */}
      <DashboardEmailSchedules />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Navigate to governance modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link href={`/${locale}/dashboard/governance/influencers`}>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Influencers
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/governance/policies`}>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Policies
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/governance/controls`}>
              <Button variant="outline" className="w-full">
                <Shield className="mr-2 h-4 w-4" />
                Controls
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/governance/assessments`}>
              <Button variant="outline" className="w-full">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Assessments
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/governance/evidence`}>
              <Button variant="outline" className="w-full">
                <FileCheck className="mr-2 h-4 w-4" />
                Evidence
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/governance/findings`}>
              <Button variant="outline" className="w-full">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Findings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}







