'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Server,
  FileText,
  AppWindow,
  Package,
  Building2,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { AssetComplianceStats, AssetComplianceByType } from '@/lib/api/governance';

interface AssetComplianceWidgetProps {
  data?: AssetComplianceStats;
  isLoading?: boolean;
}

const assetTypeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  physical: { icon: Server, label: 'Physical Assets', color: 'text-blue-600' },
  information: { icon: FileText, label: 'Information Assets', color: 'text-purple-600' },
  application: { icon: AppWindow, label: 'Applications', color: 'text-green-600' },
  software: { icon: Package, label: 'Software', color: 'text-orange-600' },
  supplier: { icon: Building2, label: 'Suppliers', color: 'text-pink-600' },
};

const getComplianceColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 70) return 'text-yellow-600';
  if (percentage >= 50) return 'text-orange-600';
  return 'text-red-600';
};

const getComplianceBadge = (percentage: number): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
  if (percentage >= 90) return { label: 'Compliant', variant: 'default' };
  if (percentage >= 70) return { label: 'Mostly Compliant', variant: 'secondary' };
  if (percentage >= 50) return { label: 'Partially Compliant', variant: 'outline' };
  return { label: 'Non-Compliant', variant: 'destructive' };
};

export function AssetComplianceWidget({ data, isLoading }: AssetComplianceWidgetProps) {
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Compliance Status</CardTitle>
          <CardDescription>Compliance metrics across all asset types</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Compliance Status</CardTitle>
          <CardDescription>Compliance metrics across all asset types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No asset compliance data available</p>
            <p className="text-xs text-muted-foreground mt-1">Link controls to assets to see compliance metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { label: complianceLabel, variant: complianceBadgeVariant } = getComplianceBadge(data.overallCompliancePercentage);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Asset Compliance Status</CardTitle>
            <CardDescription>Compliance metrics across all asset types</CardDescription>
          </div>
          <Badge variant={complianceBadgeVariant}>{complianceLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Compliance Percentage */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Compliance</span>
            <span className={`text-3xl font-bold ${getComplianceColor(data.overallCompliancePercentage)}`}>
              {data.overallCompliancePercentage}%
            </span>
          </div>
          <Progress value={data.overallCompliancePercentage} className="h-2" />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{data.assetsWithControls} assets with controls</span>
            <span>{data.assetsWithoutControls} without controls</span>
          </div>
        </div>

        {/* Compliance Breakdown */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-green-700 dark:text-green-400">{data.compliantAssets}</div>
            <div className="text-xs text-green-600">Compliant</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-yellow-700 dark:text-yellow-400">{data.partiallyCompliantAssets}</div>
            <div className="text-xs text-yellow-600">Partial</div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
            <XCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-red-700 dark:text-red-400">{data.nonCompliantAssets}</div>
            <div className="text-xs text-red-600">Non-Compliant</div>
          </div>
        </div>

        {/* By Asset Type */}
        {data.byAssetType && data.byAssetType.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">By Asset Type</h4>
            <div className="space-y-2">
              {data.byAssetType.map((typeData) => {
                const assetTypeKey = typeof typeData.assetType === 'string' 
                  ? typeData.assetType 
                  : (typeof typeData.assetType === 'object' && typeData.assetType !== null && 'name' in typeData.assetType)
                    ? (typeData.assetType as any).name || (typeData.assetType as any).code || (typeData.assetType as any).id || 'unknown'
                    : String(typeData.assetType || 'unknown');
                const config = assetTypeConfig[assetTypeKey] || { 
                  icon: Server, 
                  label: assetTypeKey, 
                  color: 'text-gray-600' 
                };
                const Icon = config.icon;
                return (
                  <div key={assetTypeKey} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm truncate">{config.label}</span>
                        <span className={`text-sm font-medium ${getComplianceColor(typeData.compliancePercentage)}`}>
                          {typeData.compliancePercentage}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{typeData.assetsWithControls} / {typeData.totalAssets} with controls</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Non-Compliant Assets */}
        {data.topNonCompliantAssets && data.topNonCompliantAssets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-600">Assets Requiring Attention</h4>
            <div className="space-y-1">
              {data.topNonCompliantAssets.slice(0, 3).map((asset) => {
                const assetTypeKey = typeof asset.assetType === 'string' 
                  ? asset.assetType 
                  : (typeof asset.assetType === 'object' && asset.assetType !== null && 'name' in asset.assetType)
                    ? (asset.assetType as any).name || (asset.assetType as any).code || (asset.assetType as any).id || 'unknown'
                    : String(asset.assetType || 'unknown');
                const config = assetTypeConfig[assetTypeKey] || { icon: Server, label: assetTypeKey, color: 'text-gray-600' };
                const Icon = config.icon;
                return (
                  <div key={`${assetTypeKey}-${asset.assetId}`} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/50 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-red-500" />
                      <span className="truncate max-w-[150px]">{asset.assetName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-medium">{asset.compliancePercentage}%</span>
                      <span className="text-xs text-muted-foreground">({asset.criticalGaps} gaps)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View All Link */}
        <div className="pt-2 border-t">
          <Link href={`/${locale}/dashboard/assets/compliance`}>
            <Button variant="outline" size="sm" className="w-full">
              View Asset Compliance Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
