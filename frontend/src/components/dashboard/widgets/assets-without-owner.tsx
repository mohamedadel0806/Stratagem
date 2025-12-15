'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AssetWithoutOwner } from '@/lib/api/dashboard';
import { AlertTriangle, ExternalLink, Server, Database, AppWindow, Package, Building2 } from 'lucide-react';
import Link from 'next/link';

interface AssetsWithoutOwnerProps {
  data?: AssetWithoutOwner[];
  isLoading?: boolean;
}

const assetTypeConfig: Record<string, { icon: any; path: string; color: string }> = {
  physical: { icon: Server, path: 'physical', color: 'bg-blue-100 text-blue-800' },
  information: { icon: Database, path: 'information', color: 'bg-green-100 text-green-800' },
  application: { icon: AppWindow, path: 'applications', color: 'bg-purple-100 text-purple-800' },
  software: { icon: Package, path: 'software', color: 'bg-yellow-100 text-yellow-800' },
  supplier: { icon: Building2, path: 'suppliers', color: 'bg-orange-100 text-orange-800' },
};

const criticalityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
};

export function AssetsWithoutOwner({ data, isLoading }: AssetsWithoutOwnerProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assets Without Owner</CardTitle>
          <CardDescription>Assets requiring ownership assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasAssets = data && data.length > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Assets Without Owner
            </CardTitle>
            <CardDescription>Assets requiring ownership assignment</CardDescription>
          </div>
          {hasAssets && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {data.length} unassigned
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!hasAssets ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-green-800">All assets have owners</p>
            <p className="text-xs text-muted-foreground mt-1">
              Great job keeping your asset inventory organized!
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {data.map((asset) => {
              const config = assetTypeConfig[asset.type] || assetTypeConfig.physical;
              const Icon = config.icon;

              return (
                <div
                  key={`${asset.type}-${asset.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-1.5 rounded ${config.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{asset.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground truncate">
                          {asset.identifier}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${criticalityColors[asset.criticalityLevel] || ''}`}
                        >
                          {asset.criticalityLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/assets/${config.path}/${asset.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}








