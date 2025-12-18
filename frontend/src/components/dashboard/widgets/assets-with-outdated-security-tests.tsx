'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AssetWithOutdatedSecurityTest } from '@/lib/api/dashboard';
import { AlertTriangle, ShieldAlert, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AssetsWithOutdatedSecurityTestsProps {
  data?: AssetWithOutdatedSecurityTest[];
  isLoading?: boolean;
}

export function AssetsWithOutdatedSecurityTests({
  data,
  isLoading,
}: AssetsWithOutdatedSecurityTestsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assets with Outdated Security Tests</CardTitle>
          <CardDescription>Assets whose last security test is stale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[220px]">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasAssets = data && data.length > 0;
  const items = (data || []).slice(0, 10);

  const getSeverityBadge = (daysSince?: number) => {
    if (daysSince === undefined || daysSince === null) {
      return (
        <Badge variant="outline" className="text-xs">
          Unknown
        </Badge>
      );
    }
    if (daysSince > 365) {
      return (
        <Badge variant="destructive" className="text-xs">
          &gt; 12 months
        </Badge>
      );
    }
    if (daysSince > 180) {
      return (
        <Badge variant="outline" className="border-orange-300 bg-orange-50 text-orange-800 text-xs">
          &gt; 6 months
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 text-xs">
        Stale
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              Assets with Outdated Security Tests
            </CardTitle>
            <CardDescription>Prioritize assets that need new testing</CardDescription>
          </div>
          {hasAssets && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {data?.length} at risk
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!hasAssets ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-emerald-100 p-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-emerald-800">
              No assets with outdated security tests detected
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Keep running regular security tests to maintain this status.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {items.map((asset) => (
              <div
                key={`${asset.type}-${asset.id}`}
                className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{asset.name}</p>
                    {getSeverityBadge(asset.daysSinceLastTest)}
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="truncate capitalize">{asset.type}</span>
                    <span>
                      Last test:{' '}
                      {asset.lastSecurityTestDate
                        ? new Date(asset.lastSecurityTestDate).toLocaleDateString()
                        : 'Unknown'}
                    </span>
                  </div>
                </div>
                <Link href={`/dashboard/assets/${asset.type}/${asset.id}`}>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-2">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


