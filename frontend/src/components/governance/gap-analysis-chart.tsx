'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/card';

interface FrameworkGap {
  frameworkId: string;
  frameworkName: string;
  totalRequirements: number;
  mappedRequirements: number;
  unmappedRequirements: number;
  coveragePercentage: number;
  criticalGapsCount: number;
  highPriorityGapsCount: number;
}

interface GapAnalysisChartProps {
  frameworks: FrameworkGap[];
}

export function GapAnalysisChart({ frameworks }: GapAnalysisChartProps) {
  const chartData = frameworks.map(fw => ({
    name: fw.frameworkName.slice(0, 15), // Truncate for display
    mapped: fw.mappedRequirements,
    unmapped: fw.unmappedRequirements,
    coverage: fw.coveragePercentage,
    fullName: fw.frameworkName,
  }));

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return '#22c55e'; // green
    if (coverage >= 70) return '#3b82f6'; // blue
    if (coverage >= 50) return '#eab308'; // yellow
    if (coverage >= 30) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#fff' }}
            content={({ active, payload }) => {
              if (active && payload?.[0]) {
                const data = payload[0].payload;
                return (
                  <div className="p-2 text-white text-sm">
                    <p className="font-semibold">{data.fullName}</p>
                    <p>Mapped: {data.mapped}</p>
                    <p>Unmapped: {data.unmapped}</p>
                    <p className="font-semibold">Coverage: {data.coverage}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="mapped" name="Mapped Requirements" fill="#22c55e" />
          <Bar yAxisId="left" dataKey="unmapped" name="Unmapped Requirements" fill="#ef4444" />
          <Bar
            yAxisId="right"
            dataKey="coverage"
            name="Coverage %"
            fill="#8884d8"
            opacity={0.7}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCoverageColor(entry.coverage)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid gap-2 sm:grid-cols-2">
        {frameworks.map(fw => (
          <div key={fw.frameworkId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">{fw.frameworkName}</p>
              <p className="text-xs text-muted-foreground">
                {fw.mappedRequirements}/{fw.totalRequirements} requirements
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold" style={{ color: getCoverageColor(fw.coveragePercentage) }}>
                {fw.coveragePercentage}%
              </p>
              {fw.criticalGapsCount > 0 && (
                <p className="text-xs text-destructive font-medium">
                  {fw.criticalGapsCount} critical
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
