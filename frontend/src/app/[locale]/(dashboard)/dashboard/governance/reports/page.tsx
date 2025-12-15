'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { governanceReportingApi, ReportType, ExportFormat } from '@/lib/api/governance';
import { FileDown, Loader2, FileText, Users, Shield, ClipboardCheck, AlertTriangle, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function GovernanceReportsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number; reportName: string } | null>(null);
  const [filters, setFilters] = useState<{
    format: ExportFormat;
    startDate?: string;
    endDate?: string;
    status?: string;
  }>({
    format: ExportFormat.CSV,
  });

  const handleExport = async (reportType: ReportType, customFilters?: any, silent = false) => {
    if (!silent) {
      setLoading(reportType);
    }
    try {
      const exportFilters = customFilters || filters;
      
      switch (reportType) {
        case ReportType.POLICY_COMPLIANCE:
          await governanceReportingApi.exportPolicyCompliance(exportFilters);
          break;
        case ReportType.INFLUENCER:
          await governanceReportingApi.exportInfluencer(exportFilters);
          break;
        case ReportType.CONTROL_IMPLEMENTATION:
          await governanceReportingApi.exportControlImplementation(exportFilters);
          break;
        case ReportType.ASSESSMENT:
          await governanceReportingApi.exportAssessment(exportFilters);
          break;
        case ReportType.FINDINGS:
          await governanceReportingApi.exportFindings(exportFilters);
          break;
        case ReportType.CONTROL_STATUS:
          await governanceReportingApi.exportControlStatus(exportFilters);
          break;
      }

      if (!silent) {
        toast({
          title: 'Report Generated',
          description: 'Your report has been downloaded successfully.',
        });
      }
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate report. Please try again.';
      if (!silent) {
        toast({
          title: 'Export Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      throw error;
    } finally {
      if (!silent) {
        setLoading(null);
      }
    }
  };

  const handleExportAll = async () => {
    setExportingAll(true);
    setExportProgress({ current: 0, total: reportCards.length, reportName: '' });
    
    const results: { success: boolean; reportName: string; error?: string }[] = [];
    
    try {
      for (let i = 0; i < reportCards.length; i++) {
        const report = reportCards[i];
        setExportProgress({ 
          current: i + 1, 
          total: reportCards.length, 
          reportName: report.title 
        });
        
        try {
          await handleExport(report.type, undefined, true);
          results.push({ success: true, reportName: report.title });
          
          // Longer delay between downloads to allow browser to process
          if (i < reportCards.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
          results.push({ 
            success: false, 
            reportName: report.title, 
            error: errorMessage 
          });
          // Continue with next report even if one fails
        }
      }
      
      // Show summary toast
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      if (failCount === 0) {
        toast({
          title: 'All Reports Exported',
          description: `Successfully exported ${successCount} report(s).`,
        });
      } else {
        toast({
          title: 'Export Completed with Errors',
          description: `${successCount} succeeded, ${failCount} failed. Check console for details.`,
          variant: 'destructive',
        });
        // Log failed reports
        results.filter(r => !r.success).forEach(r => {
          console.error(`Failed to export ${r.reportName}:`, r.error);
        });
      }
    } catch (error: any) {
      toast({
        title: 'Export All Failed',
        description: error.message || 'An unexpected error occurred while exporting reports.',
        variant: 'destructive',
      });
    } finally {
      setExportingAll(false);
      setExportProgress(null);
    }
  };

  const reportCards = [
    {
      type: ReportType.POLICY_COMPLIANCE,
      title: 'Policy Compliance Report',
      description: 'Export all policies with their compliance status, versions, and review dates',
      icon: FileText,
      supportsDateRange: true,
      supportsStatus: true,
    },
    {
      type: ReportType.INFLUENCER,
      title: 'Influencer Report',
      description: 'Export all regulatory and compliance influencers with their details',
      icon: Users,
      supportsDateRange: true,
      supportsStatus: true,
    },
    {
      type: ReportType.CONTROL_IMPLEMENTATION,
      title: 'Control Implementation Report',
      description: 'Export all controls with their implementation status and dates',
      icon: Shield,
      supportsDateRange: false,
      supportsStatus: true,
    },
    {
      type: ReportType.ASSESSMENT,
      title: 'Assessment Report',
      description: 'Export all assessments with scores, findings, and completion status',
      icon: ClipboardCheck,
      supportsDateRange: true,
      supportsStatus: true,
    },
    {
      type: ReportType.FINDINGS,
      title: 'Findings Report',
      description: 'Export all findings with severity, status, and remediation details',
      icon: AlertTriangle,
      supportsDateRange: true,
      supportsStatus: true,
    },
    {
      type: ReportType.CONTROL_STATUS,
      title: 'Control Status Summary',
      description: 'Export a summary of control status by domain, implementation, and type',
      icon: BarChart3,
      supportsDateRange: false,
      supportsStatus: false,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Governance Reports</h2>
          <p className="text-muted-foreground">Generate and export governance reports in various formats</p>
        </div>
      </div>

      {/* Global Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Set default filters for all reports (can be overridden per report)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select
                value={filters.format}
                onValueChange={(value) => setFilters({ ...filters, format: value as ExportFormat })}
              >
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ExportFormat.CSV}>CSV</SelectItem>
                  <SelectItem value={ExportFormat.EXCEL} disabled>
                    Excel (Coming Soon)
                  </SelectItem>
                  <SelectItem value={ExportFormat.PDF} disabled>
                    PDF (Coming Soon)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                placeholder="Filter by status"
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportCards.map((report) => {
          const Icon = report.icon;
          const isLoading = loading === report.type;

          return (
            <Card key={report.type}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="mt-2">{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleExport(report.type)}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileDown className="mr-2 h-4 w-4" />
                      Export Report
                    </>
                  )}
                </Button>
                <div className="mt-3 text-xs text-muted-foreground">
                  {report.supportsDateRange && 'Supports date range • '}
                  {report.supportsStatus && 'Supports status filter'}
                  {!report.supportsDateRange && !report.supportsStatus && 'No additional filters'}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Export</CardTitle>
          <CardDescription>Export all reports at once with current filters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleExportAll}
            disabled={loading !== null || exportingAll}
            variant="default"
            className="w-full md:w-auto"
          >
            {exportingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting All Reports...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Export All Reports
              </>
            )}
          </Button>
          {exportProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Exporting: {exportProgress.reportName}
                </span>
                <span className="text-muted-foreground">
                  {exportProgress.current} of {exportProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(exportProgress.current / exportProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

