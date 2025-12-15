'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileWarning,
  UserX,
  Shield,
  Download,
  Server,
  Database,
  AppWindow,
  Package,
  Building2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { dashboardApi } from '@/lib/api/dashboard';
import { generateAssetReportPDF } from '@/lib/utils/pdf-export';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const assetTypeConfig: Record<string, { icon: any; path: string; color: string }> = {
  physical: { icon: Server, path: 'physical', color: 'bg-blue-100 text-blue-800' },
  information: { icon: Database, path: 'information', color: 'bg-green-100 text-green-800' },
  application: { icon: AppWindow, path: 'applications', color: 'bg-purple-100 text-purple-800' },
  software: { icon: Package, path: 'software', color: 'bg-yellow-100 text-yellow-800' },
  supplier: { icon: Building2, path: 'suppliers', color: 'bg-orange-100 text-orange-800' },
};

const criticalityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export default function AssetReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard overview for asset stats
  const { data: overview, isLoading: isLoadingOverview, refetch } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => dashboardApi.getOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes - dashboard data doesn't change frequently
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Don't retry on 429 errors
      if (error?.response?.status === 429) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const assetStats = overview?.assetStats;

  // Export report to CSV
  const exportToCSV = (reportType: string, data: any[]) => {
    if (!data || data.length === 0) return;

    const headers = ['Name', 'Type', 'Identifier', 'Criticality', 'Created Date'];
    const rows = data.map((item) => [
      item.name,
      item.type,
      item.identifier,
      item.criticalityLevel || 'N/A',
      new Date(item.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((v) => `"${v}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `asset-report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Asset Reports</h1>
          <p className="text-muted-foreground mt-1">
            Pre-built reports for asset management insights
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingOverview ? '...' : assetStats?.countByType.total || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all asset types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Without Owners</CardTitle>
            <UserX className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {isLoadingOverview ? '...' : assetStats?.assetsWithoutOwner.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Need ownership assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Assets</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {isLoadingOverview ? '...' : assetStats?.countByCriticality.critical || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Require special attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Changes</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isLoadingOverview ? '...' : assetStats?.recentChanges.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In the last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="no-owner">
            <UserX className="h-4 w-4 mr-2" />
            Without Owner
          </TabsTrigger>
          <TabsTrigger value="criticality">
            <Shield className="h-4 w-4 mr-2" />
            By Criticality
          </TabsTrigger>
          <TabsTrigger value="by-type">
            <Package className="h-4 w-4 mr-2" />
            By Type
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Asset Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Type Distribution</CardTitle>
                <CardDescription>Number of assets by type</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOverview ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(assetTypeConfig).map(([type, config]) => {
                      const count = assetStats?.countByType[type as keyof typeof assetStats.countByType] || 0;
                      const total = assetStats?.countByType.total || 1;
                      const percentage = Math.round((count / total) * 100);
                      const Icon = config.icon;

                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium capitalize">{type}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Criticality Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Criticality Distribution</CardTitle>
                <CardDescription>Assets by criticality level</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOverview ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {(['critical', 'high', 'medium', 'low'] as const).map((level) => {
                      const count = assetStats?.countByCriticality[level] || 0;
                      const total =
                        (assetStats?.countByCriticality.critical || 0) +
                        (assetStats?.countByCriticality.high || 0) +
                        (assetStats?.countByCriticality.medium || 0) +
                        (assetStats?.countByCriticality.low || 0) || 1;
                      const percentage = Math.round((count / total) * 100);

                      return (
                        <div key={level} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge className={criticalityColors[level]}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                level === 'critical'
                                  ? 'bg-red-500'
                                  : level === 'high'
                                  ? 'bg-orange-500'
                                  : level === 'medium'
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Without Owner Tab */}
        <TabsContent value="no-owner">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserX className="h-5 w-5 text-amber-500" />
                  Assets Without Owner
                </CardTitle>
                <CardDescription>
                  These assets need ownership assignment for proper accountability
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!assetStats?.assetsWithoutOwner?.length}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportToCSV('without-owner', assetStats?.assetsWithoutOwner || [])}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export to CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => generateAssetReportPDF(
                    assetStats?.assetsWithoutOwner || [],
                    'without-owner',
                    'Assets Without Owner Report'
                  )}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export to PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              {isLoadingOverview ? (
                <div className="text-muted-foreground text-center py-8">Loading...</div>
              ) : !assetStats?.assetsWithoutOwner?.length ? (
                <div className="text-center py-8">
                  <div className="rounded-full bg-green-100 p-3 inline-flex mb-3">
                    <UserX className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="font-medium text-green-800">All assets have owners!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Great job maintaining ownership across your inventory.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Identifier</TableHead>
                      <TableHead>Criticality</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetStats.assetsWithoutOwner.map((asset) => {
                      const config = assetTypeConfig[asset.type] || assetTypeConfig.physical;
                      const Icon = config.icon;

                      return (
                        <TableRow key={`${asset.type}-${asset.id}`}>
                          <TableCell className="font-medium">{asset.name}</TableCell>
                          <TableCell>
                            <Badge className={config.color}>
                              <Icon className="h-3 w-3 mr-1" />
                              {asset.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {asset.identifier}
                          </TableCell>
                          <TableCell>
                            <Badge className={criticalityColors[asset.criticalityLevel] || ''}>
                              {asset.criticalityLevel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(asset.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/dashboard/assets/${config.path}/${asset.id}`}>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Criticality Tab */}
        <TabsContent value="criticality">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(['critical', 'high', 'medium', 'low'] as const).map((level) => (
              <Card key={level}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Badge className={`${criticalityColors[level]} text-sm`}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Badge>
                    <span className="text-2xl font-bold">
                      {assetStats?.countByCriticality[level] || 0}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {level === 'critical' && 'Mission-critical assets requiring highest protection'}
                    {level === 'high' && 'Important assets with significant business impact'}
                    {level === 'medium' && 'Standard assets with moderate importance'}
                    {level === 'low' && 'Low-priority assets with minimal impact'}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* By Type Tab */}
        <TabsContent value="by-type">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(assetTypeConfig).map(([type, config]) => {
              const Icon = config.icon;
              const count = assetStats?.countByType[type as keyof typeof assetStats.countByType] || 0;

              return (
                <Card key={type}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded ${config.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="capitalize">{type}</span>
                      </div>
                      <span className="text-2xl font-bold">{count}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/dashboard/assets/${config.path}`}>
                      <Button variant="outline" className="w-full">
                        View All
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

