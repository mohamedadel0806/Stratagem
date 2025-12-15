"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { GovernanceForecastPoint, GovernanceTrendPoint } from '@/lib/api/governance';

interface GovernanceTrendChartProps {
  history?: GovernanceTrendPoint[];
  forecast?: GovernanceForecastPoint[];
  isLoading?: boolean;
  lastUpdatedAt?: string;
}

const tooltipFormatter = (value: number | string, name: string) => {
  if (typeof value !== 'number') return value;
  if (name.toLowerCase().includes('compliance')) {
    return `${value.toFixed(1)}%`;
  }
  return value;
};

export function GovernanceTrendChart({ history = [], forecast = [], isLoading, lastUpdatedAt }: GovernanceTrendChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Trajectory</CardTitle>
          <CardDescription>Historical performance and forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const map = new Map<string, Record<string, string | number>>();

  history.forEach((point) => {
    map.set(point.date, {
      date: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(point.date)),
      historicalCompliance: point.complianceRate,
      historicalFindings: point.openFindings,
    });
  });

  forecast.forEach((point) => {
    const existing = map.get(point.date) ?? {
      date: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(point.date)),
    };

    map.set(point.date, {
      ...existing,
      forecastCompliance: point.projectedComplianceRate,
      forecastFindings: point.projectedOpenFindings,
    });
  });

  const chartData = Array.from(map.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([, value]) => value);

  const latestHistorical = history[history.length - 1];
  const firstForecast = forecast[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Compliance Trajectory</CardTitle>
            <CardDescription>Historical performance with a 14-day projection</CardDescription>
          </div>
          {lastUpdatedAt && (
            <span className="text-xs text-muted-foreground">
              Updated {new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(lastUpdatedAt))}
            </span>
          )}
        </div>
        {latestHistorical && firstForecast && (
          <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
            <div>
              <p className="text-muted-foreground">Current Compliance</p>
              <p className="text-2xl font-semibold">{latestHistorical.complianceRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Projected (14d)</p>
              <p className="text-2xl font-semibold">{firstForecast.projectedComplianceRate.toFixed(1)}%</p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
            No historical data yet. Snapshots will accumulate automatically.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" interval={Math.ceil(chartData.length / 6)} />
              <YAxis yAxisId="left" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}`} />
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                name="Compliance (Actual)"
                dataKey="historicalCompliance"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              <Line
                yAxisId="left"
                type="monotone"
                name="Compliance (Forecast)"
                dataKey="forecastCompliance"
                stroke="#22d3ee"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                connectNulls
              />
              <Line
                yAxisId="right"
                type="monotone"
                name="Open Findings"
                dataKey="historicalFindings"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              <Line
                yAxisId="right"
                type="monotone"
                name="Open Findings (Forecast)"
                dataKey="forecastFindings"
                stroke="#facc15"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
