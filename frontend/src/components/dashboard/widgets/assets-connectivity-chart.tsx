'use client';

import { FC } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AssetsByConnectivityProps {
  data?: {
    connected: number;
    disconnected: number;
    unknown: number;
  };
  isLoading?: boolean;
}

export const AssetsConnectivityChart: FC<AssetsByConnectivityProps> = ({ data, isLoading }) => {
  const chartData = [
    { status: 'Connected', value: data?.connected ?? 0 },
    { status: 'Disconnected', value: data?.disconnected ?? 0 },
    { status: 'Unknown', value: data?.unknown ?? 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets by Connectivity Status</CardTitle>
        <CardDescription>Distribution of assets by connectivity state</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};


