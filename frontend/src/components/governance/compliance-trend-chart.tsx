'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ComplianceReportTrend } from '@/lib/api/governance';

interface ComplianceTrendChartProps {
  trends: ComplianceReportTrend[];
}

export const ComplianceTrendChart: React.FC<ComplianceTrendChartProps> = ({ trends }) => {
  if (!trends || trends.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        No trend data available
      </div>
    );
  }

  // Format data for the chart
  const chartData = trends.map(trend => ({
    ...trend,
    date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px',
          }}
          formatter={(value) => {
            if (typeof value === 'number') {
              return value.toFixed(1);
            }
            return value;
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value) => {
            const labels: { [key: string]: string } = {
              overall_score: 'Overall Score',
              policies_score: 'Policy Score',
              controls_score: 'Control Score',
              assets_score: 'Asset Score',
            };
            return labels[value] || value;
          }}
        />
        <Line
          type="monotone"
          dataKey="overall_score"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ fill: '#2563eb', r: 4 }}
          activeDot={{ r: 6 }}
          name="Overall Score"
        />
        <Line
          type="monotone"
          dataKey="policies_score"
          stroke="#7c3aed"
          strokeWidth={2}
          dot={{ fill: '#7c3aed', r: 4 }}
          activeDot={{ r: 6 }}
          name="Policy Score"
        />
        <Line
          type="monotone"
          dataKey="controls_score"
          stroke="#059669"
          strokeWidth={2}
          dot={{ fill: '#059669', r: 4 }}
          activeDot={{ r: 6 }}
          name="Control Score"
        />
        <Line
          type="monotone"
          dataKey="assets_score"
          stroke="#f97316"
          strokeWidth={2}
          dot={{ fill: '#f97316', r: 4 }}
          activeDot={{ r: 6 }}
          name="Asset Score"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
