'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { RemediationDashboard } from '@/lib/api/governance';

interface RemediationDashboardMetricsProps {
  data?: RemediationDashboard;
  isLoading?: boolean;
}

export function RemediationDashboardMetrics({
  data,
  isLoading = false,
}: RemediationDashboardMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-sm text-muted-foreground">No remediation data available</p>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      title: 'Total Open',
      value: data.total_open_findings,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      description: 'Active findings needing remediation',
    },
    {
      title: 'On Track',
      value: data.findings_on_track,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      description: 'On schedule to meet SLA',
    },
    {
      title: 'At Risk',
      value: data.findings_at_risk,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      description: 'Within 7 days of SLA due',
    },
    {
      title: 'Overdue',
      value: data.findings_overdue,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      description: 'Past SLA due date',
    },
    {
      title: 'SLA Compliance',
      value: `${data.sla_compliance_rate.toFixed(0)}%`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      description: 'Last 90 days compliance rate',
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <div className={`p-2 rounded-md ${metric.bgColor}`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average Time to Remediate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{data.average_days_to_completion}</p>
              <p className="text-sm text-muted-foreground">days</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on completed remediations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Critical Findings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {data.critical_findings.length} critical finding{data.critical_findings.length !== 1 ? 's' : ''} requiring immediate attention
              </p>
              {data.critical_findings.length > 0 && (
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {data.critical_findings.slice(0, 3).map((finding, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground">
                      • {finding.remediation_priority || 'Critical'} priority
                    </div>
                  ))}
                  {data.critical_findings.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{data.critical_findings.length - 3} more
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Items Alert */}
      {data.overdue_findings.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Overdue Remediations ({data.overdue_findings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {data.overdue_findings.slice(0, 5).map((finding, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded border border-destructive/20 bg-white dark:bg-slate-950"
                >
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Finding {idx + 1}</p>
                    <p className="text-xs text-muted-foreground">{finding.remediation_priority}</p>
                  </div>
                  <Badge variant="destructive">Overdue</Badge>
                </div>
              ))}
              {data.overdue_findings.length > 5 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{data.overdue_findings.length - 5} more overdue items
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Due Items */}
      {data.upcoming_due.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              Upcoming Due ({data.upcoming_due.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {data.upcoming_due.slice(0, 5).map((finding, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20"
                >
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Finding {idx + 1}</p>
                    <p className="text-xs text-muted-foreground">{finding.remediation_priority}</p>
                  </div>
                  <Badge variant="secondary">Due Soon</Badge>
                </div>
              ))}
              {data.upcoming_due.length > 5 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{data.upcoming_due.length - 5} more items due soon
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
