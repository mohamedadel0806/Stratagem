'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ArrowLeft, Loader2, Archive, Download } from 'lucide-react';
import { governanceApi, ComplianceReport, ComplianceScore } from '@/lib/api/governance';
import { ComplianceTrendChart } from './compliance-trend-chart';
import { ComplianceGapWidget } from './compliance-gap-widget';

export const ComplianceReportDetail: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const reportId = params?.id as string;

  const [report, setReport] = useState<ComplianceReport | null>(null);

  // Fetch report
  const { data: reportData, isLoading, isError, error } = useQuery({
    queryKey: ['compliance-report', reportId],
    queryFn: async () => {
      if (!reportId) return null;
      try {
        const response = await governanceApi.getComplianceReport(reportId);
        return response.data as ComplianceReport;
      } catch (err) {
        console.error('Error fetching report:', err);
        throw err;
      }
    },
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (reportData) {
      setReport(reportData);
    }
  }, [reportData]);

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

  const handleArchive = async () => {
    if (!reportId) return;
    try {
      await governanceApi.archiveComplianceReport(reportId);
      alert('Report archived successfully');
      router.push('/governance/compliance/reports');
    } catch (err) {
      console.error('Error archiving report:', err);
      alert('Failed to archive report');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load report'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{report.report_name}</h1>
            <p className="text-gray-500 mt-1">
              {new Date(report.period_start_date).toLocaleDateString()} -{' '}
              {new Date(report.period_end_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          {!report.is_archived && (
            <Button variant="outline" size="sm" onClick={handleArchive}>
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
          )}
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex gap-2">
        {report.is_archived && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            Archived
          </span>
        )}
        {report.is_final && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            Final
          </span>
        )}
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Compliance Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {/* Main Score */}
            <div className={`p-6 rounded-lg border ${getRatingColor(report.overall_compliance_rating)}`}>
              <div className="text-4xl font-bold">{report.overall_compliance_score.toFixed(1)}</div>
              <div className="text-sm font-medium mt-1">{report.overall_compliance_rating}</div>
            </div>

            {/* Policy Score */}
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{report.policies_compliance_score.toFixed(1)}</div>
              <div className="text-sm font-medium text-blue-700 mt-1">Policy Score</div>
            </div>

            {/* Control Score */}
            <div className="p-6 rounded-lg bg-purple-50 border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{report.controls_compliance_score.toFixed(1)}</div>
              <div className="text-sm font-medium text-purple-700 mt-1">Control Score</div>
            </div>

            {/* Asset Score */}
            <div className="p-6 rounded-lg bg-orange-50 border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{report.assets_compliance_score.toFixed(1)}</div>
              <div className="text-sm font-medium text-orange-700 mt-1">Asset Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {/* Policy Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Policy Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Policies</span>
              <span className="font-semibold">{report.total_policies}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Published</span>
              <span className="font-semibold text-green-600">{report.policies_published}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Acknowledged</span>
              <span className="font-semibold text-blue-600">{report.policies_acknowledged}</span>
            </div>
            <div className="text-xs text-gray-500 pt-2 border-t">
              Acknowledgment Rate: {report.total_policies > 0 ? ((report.policies_acknowledged / report.total_policies) * 100).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>

        {/* Control Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Control Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Controls</span>
              <span className="font-semibold">{report.total_controls}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Implemented</span>
              <span className="font-semibold text-green-600">{report.controls_implemented}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="font-semibold text-yellow-600">{report.controls_partial}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Not Implemented</span>
              <span className="font-semibold text-red-600">{report.controls_not_implemented}</span>
            </div>
          </CardContent>
        </Card>

        {/* Asset Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Asset Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Assets</span>
              <span className="font-semibold">{report.total_assets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Compliant</span>
              <span className="font-semibold text-green-600">{report.assets_compliant}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Compliance Rate</span>
              <span className="font-semibold">{report.asset_compliance_percentage.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gaps Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Critical Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{report.critical_gaps}</div>
            <p className="text-xs text-gray-500 mt-1">Require immediate action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Medium Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{report.medium_gaps}</div>
            <p className="text-xs text-gray-500 mt-1">Should be addressed soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Low Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{report.low_gaps}</div>
            <p className="text-xs text-gray-500 mt-1">Monitor and plan</p>
          </CardContent>
        </Card>
      </div>

      {/* Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast</CardTitle>
          <CardDescription>Projected compliance improvement</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Projected Next Score</div>
            <div className="text-2xl font-bold text-blue-600">{report.projected_score_next_period.toFixed(1)}</div>
            <div className="text-xs text-blue-600 mt-1">Next reporting period</div>
          </div>
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Days to EXCELLENT</div>
            <div className="text-2xl font-bold text-green-600">{report.projected_days_to_excellent}</div>
            <div className="text-xs text-green-600 mt-1">At current improvement rate</div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="trend" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trend">Trend</TabsTrigger>
          <TabsTrigger value="gaps">Gaps</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Trend Tab */}
        <TabsContent value="trend" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Trend</CardTitle>
              <CardDescription>Historical compliance scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ComplianceTrendChart trends={report.compliance_trend} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gaps Tab */}
        <TabsContent value="gaps" className="mt-4">
          <ComplianceGapWidget gaps={report.gap_details} />
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Breakdown</CardTitle>
              <CardDescription>Compliance by department</CardDescription>
            </CardHeader>
            <CardContent>
              {report.department_breakdown && report.department_breakdown.length > 0 ? (
                <div className="space-y-4">
                  {report.department_breakdown.map((dept, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{dept.department}</h3>
                        <div className="text-2xl font-bold text-blue-600">
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
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No department breakdown available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {report.executive_summary && (
                <div>
                  <h3 className="font-semibold text-sm mb-2">Summary</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.executive_summary}</p>
                </div>
              )}
              {report.key_findings && (
                <div>
                  <h3 className="font-semibold text-sm mb-2">Key Findings</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.key_findings}</p>
                </div>
              )}
              {report.recommendations && (
                <div>
                  <h3 className="font-semibold text-sm mb-2">Recommendations</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.recommendations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 font-medium">Report Period</div>
              <div className="text-sm font-semibold mt-1 capitalize">
                {report.report_period.toLowerCase()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 font-medium">Generated On</div>
              <div className="text-sm font-semibold mt-1">
                {new Date(report.generated_at).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 font-medium">Created By</div>
              <div className="text-sm font-semibold mt-1">
                {report.created_by?.first_name} {report.created_by?.last_name}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 font-medium">Status</div>
              <div className="text-sm font-semibold mt-1">
                {report.is_archived ? 'Archived' : report.is_final ? 'Final' : 'Draft'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
