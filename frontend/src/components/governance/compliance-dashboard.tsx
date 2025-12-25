'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TrendingDown, TrendingUp, Minus, RefreshCw, Download } from 'lucide-react';
import { governanceApi, ComplianceDashboardData, ComplianceScore } from '@/lib/api/governance';
import { ComplianceTrendChart } from './compliance-trend-chart';
import { ComplianceGapWidget } from './compliance-gap-widget';

export const ComplianceDashboard: React.FC = () => {
  const [reportData, setReportData] = useState<ComplianceDashboardData | null>(null);

  // Fetch dashboard data
  const { data: dashboardData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['compliance-dashboard'],
    queryFn: async () => {
      try {
        const response = await governanceApi.getComplianceDashboard();
        return response.data as ComplianceDashboardData;
      } catch (err) {
        console.error('Error fetching compliance dashboard:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (dashboardData) {
      setReportData(dashboardData);
    }
  }, [dashboardData]);

  // Get rating color
  const getRatingColor = (rating: ComplianceScore): string => {
    switch (rating) {
      case ComplianceScore.EXCELLENT:
        return 'text-green-600 bg-green-50 border-green-200';
      case ComplianceScore.GOOD:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case ComplianceScore.FAIR:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case ComplianceScore.POOR:
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get trend icon
  const getTrendIcon = (direction: 'IMPROVING' | 'STABLE' | 'DECLINING') => {
    switch (direction) {
      case 'IMPROVING':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'DECLINING':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'STABLE':
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (isError || !reportData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load compliance dashboard data'}
        </AlertDescription>
      </Alert>
    );
  }

  const latestReport = reportData.latest_report;
  const trendColor = reportData.score_trend >= 0 ? 'text-green-600' : 'text-red-600';
  const trendPercent = Math.abs(reportData.score_trend);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {latestReport?.period_end_date
              ? `As of ${new Date(latestReport.period_end_date).toLocaleDateString()}`
              : 'No reports generated yet'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Compliance Score</CardTitle>
          <CardDescription>Current compliance posture and rating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Main Score */}
            <div className={`p-6 rounded-lg border ${getRatingColor(reportData.current_rating)}`}>
              <div className="text-4xl font-bold">{reportData.current_score.toFixed(1)}</div>
              <div className="text-sm font-medium mt-1">{reportData.current_rating}</div>
              <div className={`text-sm mt-2 flex items-center gap-1 ${trendColor}`}>
                {reportData.score_trend >= 0 ? '↑' : '↓'} {trendPercent.toFixed(1)}%
              </div>
            </div>

            {/* Policy Score */}
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{reportData.policies_score.toFixed(1)}</div>
              <div className="text-sm font-medium text-blue-700 mt-1">Policy Compliance</div>
              <div className="text-xs text-blue-600 mt-2">
                {reportData.policy_completion_rate.toFixed(0)}% complete
              </div>
            </div>

            {/* Control Score */}
            <div className="p-6 rounded-lg bg-purple-50 border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{reportData.controls_score.toFixed(1)}</div>
              <div className="text-sm font-medium text-purple-700 mt-1">Control Compliance</div>
              <div className="text-xs text-purple-600 mt-2">
                {reportData.control_implementation_rate.toFixed(0)}% implemented
              </div>
            </div>

            {/* Asset Score */}
            <div className="p-6 rounded-lg bg-orange-50 border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{reportData.assets_score.toFixed(1)}</div>
              <div className="text-sm font-medium text-orange-700 mt-1">Asset Compliance</div>
              <div className="text-xs text-orange-600 mt-2">
                {reportData.asset_compliance_rate.toFixed(0)}% compliant
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics and Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Policy Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Policy Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {latestReport && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Policies</span>
                  <span className="font-semibold">{latestReport.total_policies}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Published</span>
                  <span className="font-semibold text-green-600">{latestReport.policies_published}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Acknowledged</span>
                  <span className="font-semibold text-blue-600">{latestReport.policies_acknowledged}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Control Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Control Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {latestReport && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Controls</span>
                  <span className="font-semibold">{latestReport.total_controls}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Implemented</span>
                  <span className="font-semibold text-green-600">{latestReport.controls_implemented}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-semibold text-yellow-600">{latestReport.controls_partial}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Not Implemented</span>
                  <span className="font-semibold text-red-600">{latestReport.controls_not_implemented}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Asset Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Asset Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {latestReport && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Assets</span>
                  <span className="font-semibold">{latestReport.total_assets}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Compliant</span>
                  <span className="font-semibold text-green-600">{latestReport.assets_compliant}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Compliance Rate</span>
                  <span className="font-semibold">{latestReport.asset_compliance_percentage.toFixed(1)}%</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed view */}
      {latestReport && (
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="gaps">Gaps</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          {/* Trends Tab */}
          <TabsContent value="trends" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Trend</CardTitle>
                <CardDescription>Historical compliance scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ComplianceTrendChart trends={latestReport.compliance_trend} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gaps Tab */}
          <TabsContent value="gaps" className="mt-4">
            <ComplianceGapWidget gaps={latestReport.gap_details} />
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Breakdown</CardTitle>
                <CardDescription>Compliance by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {latestReport.department_breakdown && latestReport.department_breakdown.length > 0 ? (
                    latestReport.department_breakdown.map((dept, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold">{dept.department}</h3>
                          <div className={`text-2xl font-bold ${getRatingColor(
                            dept.overall_score >= 85 ? ComplianceScore.EXCELLENT :
                            dept.overall_score >= 70 ? ComplianceScore.GOOD :
                            dept.overall_score >= 55 ? ComplianceScore.FAIR :
                            ComplianceScore.POOR
                          )}`}>
                            {dept.overall_score.toFixed(1)}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-gray-600">Policy Score</div>
                            <div className="text-lg font-semibold">{dept.policies_score.toFixed(1)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Control Score</div>
                            <div className="text-lg font-semibold">{dept.controls_score.toFixed(1)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Asset Score</div>
                            <div className="text-lg font-semibold">{dept.assets_score.toFixed(1)}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No department breakdown available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
                <CardDescription>Key findings and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {latestReport.executive_summary && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Summary</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{latestReport.executive_summary}</p>
                  </div>
                )}
                {latestReport.key_findings && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Key Findings</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{latestReport.key_findings}</p>
                  </div>
                )}
                {latestReport.recommendations && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Recommendations</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{latestReport.recommendations}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Forecast Card */}
      {latestReport && (
        <Card>
          <CardHeader>
            <CardTitle>Forecast</CardTitle>
            <CardDescription>Projected compliance improvement</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Projected Score</div>
              <div className="text-2xl font-bold text-blue-600">{latestReport.projected_score_next_period.toFixed(1)}</div>
              <div className="text-xs text-blue-600 mt-1">Next reporting period</div>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Days to EXCELLENT</div>
              <div className="text-2xl font-bold text-green-600">{latestReport.projected_days_to_excellent} days</div>
              <div className="text-xs text-green-600 mt-1">At current improvement rate</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
