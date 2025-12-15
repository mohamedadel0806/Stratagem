'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface FindingSeverityData {
  critical: number;
  high: number;
  medium: number;
  low: number;
  resolved: number;
}

interface GovernanceFindingsSeverityProps {
  data: FindingSeverityData;
}

export function GovernanceFindingsSeverity({ data }: GovernanceFindingsSeverityProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Findings by Severity</CardTitle>
          <CardDescription>Active and resolved findings breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No findings data available</p>
        </CardContent>
      </Card>
    );
  }

  const total = data.critical + data.high + data.medium + data.low;
  const unresolved = total - data.resolved;

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const severities = [
    { label: 'Critical', value: data.critical, color: 'bg-red-500', icon: AlertCircle },
    { label: 'High', value: data.high, color: 'bg-orange-500', icon: AlertTriangle },
    { label: 'Medium', value: data.medium, color: 'bg-yellow-500', icon: AlertTriangle },
    { label: 'Low', value: data.low, color: 'bg-blue-500', icon: Info },
  ];

  const resolvedPercentage = total > 0 ? Math.round((data.resolved / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Findings by Severity</CardTitle>
        <CardDescription>Active and resolved findings breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Severity Bars */}
          <div className="space-y-3">
            {severities.map(severity => {
              const Icon = severity.icon;
              const percentage = total > 0 ? Math.round((severity.value / total) * 100) : 0;
              return (
                <div key={severity.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: severity.color }} />
                      <span className="text-sm font-medium">{severity.label}</span>
                    </div>
                    <Badge variant="secondary">{severity.value}</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${severity.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{percentage}% of total</p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Findings</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Unresolved</p>
              <p className="text-2xl font-bold text-orange-600">{unresolved}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{data.resolved}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Resolution Rate</p>
              <p className="text-2xl font-bold text-blue-600">{resolvedPercentage}%</p>
            </div>
          </div>

          {/* Critical Alert */}
          {data.critical > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-900">
                ⚠️ {data.critical} critical finding{data.critical !== 1 ? 's' : ''} require immediate attention
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
