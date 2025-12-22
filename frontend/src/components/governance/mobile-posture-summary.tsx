'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { GovernanceDashboardDto } from '@/lib/api/governance';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';
import { useEffect } from 'react';

interface MobilePostureSummaryProps {
  dashboard?: GovernanceDashboardDto;
  isLoading?: boolean;
  onExport?: () => void;
}

export function MobilePostureSummary({
  dashboard,
  isLoading = false,
  onExport,
}: MobilePostureSummaryProps) {
  const { announceToScreenReader } = useKeyboardNavigation();

  // Calculate overall compliance score
  const totalControls = dashboard?.summary.totalControls || 0;
  const implementedControls = dashboard?.summary.implementedControls || 0;
  const complianceScore = totalControls > 0
    ? Math.round((implementedControls / totalControls) * 100)
    : 0;

  // Calculate policy compliance rate
  const totalPolicies = dashboard?.summary.totalPolicies || 0;
  const publishedPolicies = dashboard?.summary.publishedPolicies || 0;
  const policyComplianceRate = totalPolicies > 0
    ? Math.round((publishedPolicies / totalPolicies) * 100)
    : 0;

  // Determine overall status
  const getOverallStatus = () => {
    if (complianceScore >= 90 && policyComplianceRate >= 90) return 'excellent';
    if (complianceScore >= 75 && policyComplianceRate >= 75) return 'good';
    if (complianceScore >= 50 && policyComplianceRate >= 50) return 'fair';
    return 'needs-attention';
  };

  const overallStatus = getOverallStatus();

  // Announce compliance score changes to screen readers
  useEffect(() => {
    if (dashboard && !isLoading) {
      announceToScreenReader(
        `Compliance posture updated. Overall compliance: ${complianceScore} percent. Status: ${getStatusLabel(overallStatus)}`,
        'polite'
      );
    }
  }, [dashboard, complianceScore, overallStatus, isLoading, announceToScreenReader]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'fair':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      default:
        return 'Needs Attention';
    }
  };

  const criticalFindings = dashboard?.summary.criticalFindings || 0;
  const openFindings = dashboard?.summary.openFindings || 0;
  const inProgressAssessments = dashboard?.summary.inProgressAssessments || 0;

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 md:hidden">
      {/* Overall Status Card */}
      <Card className="border-2" role="region" aria-label="Compliance posture summary">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold" id="compliance-posture-title">
              Compliance Posture
            </CardTitle>
            <Badge
              variant="outline"
              className={`${getStatusColor(overallStatus)} text-white border-0`}
              aria-label={`Overall status: ${getStatusLabel(overallStatus)}`}
            >
              {getStatusLabel(overallStatus)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Compliance Score */}
          <div className="space-y-2" role="progressbar" aria-valuenow={complianceScore} aria-valuemin={0} aria-valuemax={100} aria-label={`Overall compliance: ${complianceScore} percent`}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Compliance</span>
              <span className="font-semibold text-lg" aria-live="polite">{complianceScore}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3" role="presentation">
              <div
                className={`h-3 rounded-full transition-all ${getStatusColor(overallStatus)}`}
                style={{ width: `${complianceScore}%` }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2" role="group" aria-label="Quick actions">
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="flex-1 text-xs min-h-[44px] min-w-[44px]"
                aria-label="Export compliance posture report"
              >
                <Download className="h-3 w-3 mr-1" aria-hidden="true" />
                Export
              </Button>
            )}
            <Link href="/dashboard/governance" className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs min-h-[44px]" aria-label="View full governance dashboard">
                View Full Dashboard
                <ChevronRight className="h-3 w-3 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Key compliance metrics">
        {/* Policies */}
        <Card role="article" aria-labelledby="policies-metric">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <Badge variant="secondary" className="text-xs" aria-label={`Policy compliance rate: ${policyComplianceRate} percent`}>
                {policyComplianceRate}%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold" id="policies-metric" aria-label={`Total policies: ${totalPolicies}`}>
                {totalPolicies}
              </p>
              <p className="text-xs text-muted-foreground">Total Policies</p>
              <p className="text-xs text-muted-foreground" aria-label={`${publishedPolicies} policies published`}>
                {publishedPolicies} published
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card role="article" aria-labelledby="controls-metric">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <Badge variant="secondary" className="text-xs" aria-label={`Control implementation rate: ${complianceScore} percent`}>
                {complianceScore}%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold" id="controls-metric" aria-label={`Total controls: ${totalControls}`}>
                {totalControls}
              </p>
              <p className="text-xs text-muted-foreground">Total Controls</p>
              <p className="text-xs text-muted-foreground" aria-label={`${implementedControls} controls implemented`}>
                {implementedControls} implemented
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Findings */}
        <Card role="article" aria-labelledby="findings-metric" className={criticalFindings > 0 ? 'border-destructive' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
              {criticalFindings > 0 && (
                <Badge variant="destructive" className="text-xs" aria-label={`${criticalFindings} critical findings`}>
                  {criticalFindings} critical
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold" id="findings-metric" aria-label={`Open findings: ${openFindings}`}>
                {openFindings}
              </p>
              <p className="text-xs text-muted-foreground">Open Findings</p>
              {criticalFindings > 0 && (
                <p className="text-xs text-destructive font-medium" role="alert" aria-live="assertive">
                  {criticalFindings} require attention
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assessments */}
        <Card role="article" aria-labelledby="assessments-metric">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              {inProgressAssessments > 0 && (
                <Badge variant="outline" className="text-xs" aria-label={`${inProgressAssessments} assessments in progress`}>
                  {inProgressAssessments} active
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold" id="assessments-metric" aria-label={`Completed assessments: ${dashboard?.summary.completedAssessments || 0}`}>
                {dashboard?.summary.completedAssessments || 0}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-xs text-muted-foreground" aria-label={`${inProgressAssessments} assessments in progress`}>
                {inProgressAssessments} in progress
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalFindings > 0 && (
        <Card className="border-destructive" role="alert" aria-live="assertive">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
              <CardTitle className="text-base font-semibold text-destructive" id="critical-findings-alert">
                Critical Findings
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3" aria-describedby="critical-findings-alert">
              {criticalFindings} critical finding{criticalFindings !== 1 ? 's' : ''} require
              immediate attention.
            </p>
            <Link href="/dashboard/governance/findings?severity=critical">
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full min-h-[44px]" 
                aria-label={`Review ${criticalFindings} critical finding${criticalFindings !== 1 ? 's' : ''}`}
              >
                Review Findings
                <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <Card role="navigation" aria-label="Quick navigation links">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2" role="list">
          <Link href="/dashboard/governance/reports" role="listitem">
            <Button variant="ghost" className="w-full justify-between min-h-[44px]" size="sm" aria-label="Navigate to Executive Reports">
              <span>Executive Reports</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/dashboard/governance/policies" role="listitem">
            <Button variant="ghost" className="w-full justify-between min-h-[44px]" size="sm" aria-label="Navigate to Policy Management">
              <span>Policy Management</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/dashboard/governance/controls" role="listitem">
            <Button variant="ghost" className="w-full justify-between min-h-[44px]" size="sm" aria-label="Navigate to Control Library">
              <span>Control Library</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/dashboard/governance/gap-analysis" role="listitem">
            <Button variant="ghost" className="w-full justify-between min-h-[44px]" size="sm" aria-label="Navigate to Gap Analysis">
              <span>Gap Analysis</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}


