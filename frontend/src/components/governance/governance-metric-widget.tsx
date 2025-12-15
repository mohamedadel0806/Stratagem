'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricTrendData {
  label: string;
  value: number;
  target: number;
  trend?: number; // percentage change
  trendUp?: boolean;
  status?: 'success' | 'warning' | 'critical';
}

interface GovernanceMetricWidgetProps {
  title: string;
  description?: string;
  metrics: MetricTrendData[];
}

export function GovernanceMetricWidget({ title, description, metrics }: GovernanceMetricWidgetProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-100 text-emerald-700';
      case 'warning':
        return 'bg-amber-100 text-amber-700';
      case 'critical':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric, index) => {
          const percentage = metric.target > 0 ? Math.round((metric.value / metric.target) * 100) : 0;
          const isPositive = metric.trend ? metric.trend > 0 : true;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.value} / {metric.target}
                  </Badge>
                  {metric.trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(metric.trend)}%
                    </div>
                  )}
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{percentage}% complete</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
