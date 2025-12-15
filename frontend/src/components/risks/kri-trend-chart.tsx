"use client";

import { useQuery } from '@tanstack/react-query';
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
  ReferenceLine,
} from 'recharts';
import { krisApi, KRI, KRIMeasurement, KRIStatus } from '@/lib/api/risks';
import { Loader2 } from 'lucide-react';

interface KRITrendChartProps {
  kriId: string;
  kri?: KRI; // Optional: if provided, shows thresholds
  limit?: number;
  showThresholds?: boolean;
}

const tooltipFormatter = (value: number | string, name: string) => {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return value;
};

const getStatusColor = (status?: KRIStatus) => {
  switch (status) {
    case 'green':
      return '#16a34a'; // green-600
    case 'amber':
      return '#f59e0b'; // amber-500
    case 'red':
      return '#dc2626'; // red-600
    default:
      return '#6b7280'; // gray-500
  }
};

export function KRITrendChart({ kriId, kri, limit = 50, showThresholds = true }: KRITrendChartProps) {
  // #region agent log
  if (kri) {
    fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'kri-trend-chart.tsx:47',message:'KRI prop received',data:{kriId,kriExists:!!kri,currentValue:kri.current_value,currentValueType:typeof kri.current_value,currentValueIsNull:kri.current_value===null,currentValueIsUndefined:kri.current_value===undefined,currentValueConstructor:kri.current_value?.constructor?.name,fullKri:JSON.stringify(kri)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }
  // #endregion
  const { data: measurements, isLoading } = useQuery({
    queryKey: ['kri-measurements', kriId, limit],
    queryFn: () => krisApi.getMeasurements(kriId, limit),
    enabled: !!kriId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>KRI Trend</CardTitle>
          <CardDescription>Historical measurements over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!measurements || measurements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>KRI Trend</CardTitle>
          <CardDescription>Historical measurements over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-sm text-muted-foreground">
            No measurement data available yet. Add measurements to see trends.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data - sort by date
  const chartData = measurements
    .map((m: KRIMeasurement) => ({
      date: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(
        new Date(m.measurement_date)
      ),
      fullDate: m.measurement_date,
      value: m.value,
      status: m.status,
      timestamp: new Date(m.measurement_date).getTime(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  // Determine Y-axis domain based on data and thresholds
  const values = chartData.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  const padding = range * 0.1; // 10% padding

  let yAxisMin = Math.max(0, minValue - padding);
  let yAxisMax = maxValue + padding;

  // If thresholds are provided, ensure they're visible
  if (showThresholds && kri) {
    const thresholds = [
      kri.threshold_green,
      kri.threshold_amber,
      kri.threshold_red,
    ].filter((t) => t !== null && t !== undefined) as number[];

    if (thresholds.length > 0) {
      const minThreshold = Math.min(...thresholds);
      const maxThreshold = Math.max(...thresholds);
      yAxisMin = Math.min(yAxisMin, minThreshold - padding);
      yAxisMax = Math.max(yAxisMax, maxThreshold + padding);
    }
  }

  // Format unit for display
  const unit = kri?.measurement_unit || '';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>KRI Trend</CardTitle>
            <CardDescription>
              {kri?.name || 'Historical measurements'} over time
              {kri?.measurement_frequency && ` (${kri.measurement_frequency})`}
            </CardDescription>
          </div>
          {kri?.current_value !== null && kri?.current_value !== undefined && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Current Value</p>
              <p className="text-2xl font-semibold">
                {/* #region agent log */}
                {(()=>{const cv=kri.current_value;const numValue=typeof cv==='number'?cv:Number(cv);fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'kri-trend-chart.tsx:142',message:'After conversion to number',data:{originalValue:cv,originalType:typeof cv,convertedValue:numValue,convertedType:typeof numValue,isNaN:isNaN(numValue),toFixedResult:numValue.toFixed(2)},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});return numValue.toFixed(2);})()}
                {/* #endregion */}
                {unit && ` ${unit}`}
              </p>
              {kri.current_status && (
                <span
                  className="text-xs px-2 py-1 rounded mt-1 inline-block"
                  style={{
                    backgroundColor: getStatusColor(kri.current_status) + '20',
                    color: getStatusColor(kri.current_status),
                  }}
                >
                  {kri.current_status.toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              interval={Math.max(1, Math.floor(chartData.length / 6))}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={[yAxisMin, yAxisMax]}
              tickFormatter={(value) => `${value.toFixed(1)}${unit ? ` ${unit}` : ''}`}
              label={{
                value: unit ? `Value (${unit})` : 'Value',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip
              formatter={tooltipFormatter}
              labelFormatter={(label) => {
                const dataPoint = chartData.find((d) => d.date === label);
                if (dataPoint) {
                  return new Intl.DateTimeFormat('en', {
                    dateStyle: 'medium',
                  }).format(new Date(dataPoint.fullDate));
                }
                return label;
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Legend />

            {/* Threshold reference lines */}
            {showThresholds && kri && (
              <>
                {kri.threshold_red !== null && kri.threshold_red !== undefined && (
                  <ReferenceLine
                    y={kri.threshold_red}
                    stroke="#dc2626"
                    strokeDasharray="5 5"
                    label={{
                      value: `Red Threshold (${kri.threshold_red}${unit ? ` ${unit}` : ''})`,
                      position: 'right',
                      fill: '#dc2626',
                    }}
                  />
                )}
                {kri.threshold_amber !== null && kri.threshold_amber !== undefined && (
                  <ReferenceLine
                    y={kri.threshold_amber}
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    label={{
                      value: `Amber Threshold (${kri.threshold_amber}${unit ? ` ${unit}` : ''})`,
                      position: 'right',
                      fill: '#f59e0b',
                    }}
                  />
                )}
                {kri.threshold_green !== null && kri.threshold_green !== undefined && (
                  <ReferenceLine
                    y={kri.threshold_green}
                    stroke="#16a34a"
                    strokeDasharray="5 5"
                    label={{
                      value: `Green Threshold (${kri.threshold_green}${unit ? ` ${unit}` : ''})`,
                      position: 'right',
                      fill: '#16a34a',
                    }}
                  />
                )}
              </>
            )}

            {/* Value line with color based on status */}
            <Line
              type="monotone"
              dataKey="value"
              name={kri?.name || 'Value'}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Additional info */}
        {kri && (
          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-sm">
            {kri.threshold_green !== null && kri.threshold_green !== undefined && (
              <div>
                <p className="text-muted-foreground">Green Threshold</p>
                <p className="font-semibold text-green-600">
                  {kri.threshold_green} {unit}
                </p>
              </div>
            )}
            {kri.threshold_amber !== null && kri.threshold_amber !== undefined && (
              <div>
                <p className="text-muted-foreground">Amber Threshold</p>
                <p className="font-semibold text-amber-600">
                  {kri.threshold_amber} {unit}
                </p>
              </div>
            )}
            {kri.threshold_red !== null && kri.threshold_red !== undefined && (
              <div>
                <p className="text-muted-foreground">Red Threshold</p>
                <p className="font-semibold text-red-600">
                  {kri.threshold_red} {unit}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}