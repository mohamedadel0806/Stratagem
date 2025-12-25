'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { Loader2, TrendingUp, CheckCircle, AlertCircle, Layers } from 'lucide-react';
import { governanceApi } from '@/lib/api/governance';

interface AssetControlStatisticsProps {
  refreshInterval?: number;
  showExport?: boolean;
}

const COLORS = {
  implemented: '#10b981',
  planned: '#3b82f6',
  inProgress: '#f59e0b',
  notImplemented: '#ef4444',
  notApplicable: '#6b7280',
};

export function AssetControlStatistics({
  refreshInterval = 30000,
  showExport = true,
}: AssetControlStatisticsProps) {
  const [selectedAssetType, setSelectedAssetType] = useState<string>('');

  // Fetch comprehensive statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['asset-control-statistics'],
    queryFn: () => governanceApi.getAssetControlStatistics(),
    refetchInterval: refreshInterval,
  });

  // Fetch asset type breakdown
  const { data: assetTypeStats, isLoading: assetTypeLoading } = useQuery({
    queryKey: ['asset-control-by-type'],
    queryFn: () => governanceApi.getComplianceByAssetType(),
    refetchInterval: refreshInterval,
  });

  // Fetch matrix statistics
  const { data: matrixStats, isLoading: matrixLoading } = useQuery({
    queryKey: ['matrix-statistics'],
    queryFn: () => governanceApi.getMatrixStatistics(),
    refetchInterval: refreshInterval,
  });

  const isLoading = statsLoading || assetTypeLoading || matrixLoading;

  // Prepare implementation distribution chart data
  const implementationChartData = stats?.implementation_distribution
    ? Object.entries(stats.implementation_distribution).map(([status, count]) => ({
        name: status.replace(/_/g, ' ').toUpperCase(),
        value: count,
      }))
    : [];

  // Prepare asset type chart data
  const assetTypeChartData = assetTypeStats
    ? assetTypeStats.map(item => ({
        name: item.asset_type.replace(/_/g, ' ').toUpperCase(),
        compliance: item.compliance_percentage,
        count: item.total_mappings,
      }))
    : [];

  // Prepare status distribution for pie chart
  const statusDistributionData = matrixStats?.by_implementation_status
    ? Object.entries(matrixStats.by_implementation_status).map(([status, count]) => ({
        name: status.replace(/_/g, ' ').toUpperCase(),
        value: count,
      }))
    : [];

  const statusPieColors: Record<string, string> = {
    'NOT_IMPLEMENTED': COLORS.notImplemented,
    'PLANNED': COLORS.planned,
    'IN_PROGRESS': COLORS.inProgress,
    'IMPLEMENTED': COLORS.implemented,
    'NOT_APPLICABLE': COLORS.notApplicable,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total_controls ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.total_mappings ?? 0} mapped to assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.average_compliance_score?.toFixed(1) ?? 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average across all assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Control Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.average_effectiveness_score?.toFixed(1) ?? 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average effectiveness score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unmapped Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{matrixStats?.unmapped_controls_count ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {(((matrixStats?.unmapped_controls_count ?? 0) / (stats?.total_controls ?? 1)) * 100).toFixed(1)}%
              of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="distribution">Implementation Status</TabsTrigger>
          <TabsTrigger value="assetType">By Asset Type</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        {/* Implementation Distribution */}
        <TabsContent value="distribution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Status Distribution</CardTitle>
              <CardDescription>
                Break down of all control-asset mappings by implementation status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statusDistributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={statusPieColors[entry.name] || COLORS.notImplemented}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} mappings`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No data available
                </div>
              )}

              {/* Status Summary Table */}
              <div className="mt-6 space-y-2">
                {statusDistributionData.map((item) => {
                  const percentage = stats?.total_mappings
                    ? ((item.value / stats.total_mappings) * 100).toFixed(1)
                    : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: statusPieColors[item.name],
                          }}
                        />
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.value}</span>
                        <span className="text-xs text-muted-foreground">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Asset Type Compliance */}
        <TabsContent value="assetType" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance by Asset Type</CardTitle>
              <CardDescription>
                Compliance percentage and mapping count for each asset type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assetTypeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={assetTypeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="compliance" fill={COLORS.implemented} name="Compliance %" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No data available
                </div>
              )}

              {/* Asset Type Summary */}
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {assetTypeStats?.map((item) => (
                  <Card key={item.asset_type} className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{item.asset_type.toUpperCase()}</h4>
                        <Badge variant="outline">
                          {item.compliance_percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Total Mappings: {item.total_mappings}</p>
                        <p>Implemented: {item.implemented}</p>
                        <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{
                              width: `${item.compliance_percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Key Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Summary of asset-control integration metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-sm text-muted-foreground">Total Mappings</span>
                  <span className="text-lg font-semibold">{matrixStats?.total_mappings ?? 0}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-sm text-muted-foreground">Total Controls</span>
                  <span className="text-lg font-semibold">{stats?.total_controls ?? 0}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-sm text-muted-foreground">Average Compliance</span>
                  <span className="text-lg font-semibold">
                    {stats?.average_compliance_score?.toFixed(1) ?? 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-sm text-muted-foreground">Average Effectiveness</span>
                  <span className="text-lg font-semibold">
                    {stats?.average_effectiveness_score?.toFixed(1) ?? 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Unmapped Controls</span>
                  <Badge variant="secondary">{matrixStats?.unmapped_controls_count ?? 0}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Controls by Domain */}
            <Card>
              <CardHeader>
                <CardTitle>Mapping Summary</CardTitle>
                <CardDescription>Distribution of mappings across asset types</CardDescription>
              </CardHeader>
              <CardContent>
                {matrixStats?.by_asset_type && Object.keys(matrixStats.by_asset_type).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(matrixStats.by_asset_type).map(([assetType, count]) => (
                      <div key={assetType} className="flex items-center justify-between text-sm">
                        <span className="capitalize text-muted-foreground">{assetType}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all"
                              style={{
                                width: `${((count / (matrixStats.total_mappings ?? 1)) * 100).toFixed(0)}%`,
                              }}
                            />
                          </div>
                          <span className="font-medium w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    No mapping data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Note */}
      <div className="text-xs text-muted-foreground p-4 border rounded-lg bg-muted/50">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
        <p>Data refreshes every {(refreshInterval / 1000).toFixed(0)} seconds</p>
      </div>
    </div>
  );
}
