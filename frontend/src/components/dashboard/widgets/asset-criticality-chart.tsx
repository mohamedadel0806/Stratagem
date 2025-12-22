'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetCountByCriticality } from '@/lib/api/dashboard';

interface AssetCriticalityChartProps {
  data?: AssetCountByCriticality;
  isLoading?: boolean;
}

const criticalityConfig = [
  { key: 'critical', label: 'Critical', color: '#dc2626', bgColor: 'bg-red-500' },
  { key: 'high', label: 'High', color: '#f97316', bgColor: 'bg-orange-500' },
  { key: 'medium', label: 'Medium', color: '#eab308', bgColor: 'bg-yellow-500' },
  { key: 'low', label: 'Low', color: '#22c55e', bgColor: 'bg-green-500' },
] as const;

export function AssetCriticalityChart({ data, isLoading }: AssetCriticalityChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assets by Criticality</CardTitle>
          <CardDescription>Risk-based asset classification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = criticalityConfig.map((config) => ({
    ...config,
    value: data?.[config.key as keyof AssetCountByCriticality] || 0,
  }));

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Assets by Criticality</CardTitle>
        <CardDescription>Risk-based asset classification</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.map((item) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const barWidth = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

            return (
              <div key={item.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground tabular-nums">
                      {percentage.toFixed(0)}%
                    </span>
                    <span className="font-semibold tabular-nums w-8 text-right">
                      {item.value}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary footer */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Assets</span>
          <span className="font-semibold">{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}











