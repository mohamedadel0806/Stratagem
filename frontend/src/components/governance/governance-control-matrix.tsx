'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

interface ControlImplementationStatus {
  implemented: number;
  partial: number;
  planned: number;
  notStarted: number;
  deprecated: number;
}

interface GovernanceControlMatrixProps {
  data: ControlImplementationStatus;
}

export function GovernanceControlMatrix({ data }: GovernanceControlMatrixProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Control Implementation Matrix</CardTitle>
          <CardDescription>Status distribution across controls</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No control data available</p>
        </CardContent>
      </Card>
    );
  }

  const total = data.implemented + data.partial + data.planned + data.notStarted + data.deprecated;
  const implementedPercentage = total > 0 ? Math.round((data.implemented / total) * 100) : 0;

  const statuses = [
    {
      label: 'Implemented',
      value: data.implemented,
      color: 'bg-green-500',
      icon: CheckCircle2,
      description: 'Fully operational',
    },
    {
      label: 'Partial',
      value: data.partial,
      color: 'bg-blue-500',
      icon: AlertCircle,
      description: 'Partially completed',
    },
    {
      label: 'Planned',
      value: data.planned,
      color: 'bg-yellow-500',
      icon: Clock,
      description: 'In roadmap',
    },
    {
      label: 'Not Started',
      value: data.notStarted,
      color: 'bg-gray-500',
      icon: XCircle,
      description: 'Awaiting initiation',
    },
    {
      label: 'Deprecated',
      value: data.deprecated,
      color: 'bg-red-500',
      icon: XCircle,
      description: 'No longer applicable',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Control Implementation Matrix</CardTitle>
        <CardDescription>Status distribution across {total} controls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main Progress Indicator */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Implementation</span>
              <span className="text-2xl font-bold">{implementedPercentage}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-green-500 transition-all"
                style={{ width: `${implementedPercentage}%` }}
              />
            </div>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            {statuses.map(status => {
              const Icon = status.icon;
              const percentage = total > 0 ? Math.round((status.value / total) * 100) : 0;
              return (
                <div key={status.label} className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 mt-0.5" style={{ color: status.color }} />
                      <div>
                        <p className="text-sm font-medium">{status.label}</p>
                        <p className="text-xs text-muted-foreground">{status.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Badge variant="secondary">{status.value} controls</Badge>
                    <p className="text-xs text-muted-foreground">{percentage}% of total</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{data.implemented + data.partial}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{data.planned}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{data.notStarted}</p>
              <p className="text-xs text-muted-foreground">Backlog</p>
            </div>
          </div>

          {/* Action Items */}
          {data.notStarted > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-900">
                📋 {data.notStarted} control{data.notStarted !== 1 ? 's' : ''} awaiting implementation
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
