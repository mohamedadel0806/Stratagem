'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetByComplianceScope } from '@/lib/api/dashboard';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface AssetsByComplianceScopeProps {
  data?: AssetByComplianceScope[];
  isLoading?: boolean;
}

export function AssetsByComplianceScope({ data, isLoading }: AssetsByComplianceScopeProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assets by Compliance Scope</CardTitle>
          <CardDescription>Distribution of assets across compliance scopes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[220px]">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = data && data.length > 0;
  const chartData = (data || []).map((item) => ({
    scope: item.scope || 'Unspecified',
    count: item.count || 0,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Assets by Compliance Scope</CardTitle>
        <CardDescription>Which frameworks/regulations your assets participate in</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground">
            No compliance scope data available yet.
          </div>
        ) : (
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="scope"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ fontSize: 12 }}
                  formatter={(value: any) => [value, 'Assets']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


