'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetCountByType } from '@/lib/api/dashboard';
import { Server, Database, AppWindow, Package, Building2 } from 'lucide-react';

interface AssetTypeChartProps {
  data?: AssetCountByType;
  isLoading?: boolean;
}

const assetTypeConfig = [
  { key: 'physical', label: 'Physical', color: '#3b82f6', icon: Server },
  { key: 'information', label: 'Information', color: '#10b981', icon: Database },
  { key: 'application', label: 'Applications', color: '#8b5cf6', icon: AppWindow },
  { key: 'software', label: 'Software', color: '#f59e0b', icon: Package },
  { key: 'supplier', label: 'Suppliers', color: '#ef4444', icon: Building2 },
] as const;

export function AssetTypeChart({ data, isLoading }: AssetTypeChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assets by Type</CardTitle>
          <CardDescription>Distribution across asset categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = data?.total || 0;

  // Calculate percentages and create arc data
  const chartData = assetTypeConfig.map((config) => ({
    ...config,
    value: data?.[config.key as keyof AssetCountByType] || 0,
    percentage: total > 0 ? ((data?.[config.key as keyof AssetCountByType] || 0) / total) * 100 : 0,
  }));

  // Create donut chart segments
  let cumulativePercentage = 0;
  const segments = chartData.map((item) => {
    const startAngle = cumulativePercentage * 3.6; // 360 / 100
    cumulativePercentage += item.percentage;
    const endAngle = cumulativePercentage * 3.6;
    return { ...item, startAngle, endAngle };
  });

  // SVG donut chart
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Assets by Type</CardTitle>
        <CardDescription>Distribution across asset categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Donut Chart */}
          <div className="relative">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-muted/20"
              />
              {/* Segments */}
              {chartData.map((item, index) => {
                const segmentLength = (item.percentage / 100) * circumference;
                const currentOffset = offset;
                offset += segmentLength;
                
                if (item.value === 0) return null;

                return (
                  <circle
                    key={item.key}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                    strokeDashoffset={-currentOffset}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{total}</span>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2">
            {chartData.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-medium tabular-nums">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}











