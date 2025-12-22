'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecentAssetChange } from '@/lib/api/dashboard';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Server, 
  Database, 
  AppWindow, 
  Package, 
  Building2,
  Clock,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface RecentAssetChangesProps {
  data?: RecentAssetChange[];
  isLoading?: boolean;
}

const assetTypeConfig: Record<string, { icon: any; path: string; label: string }> = {
  physical: { icon: Server, path: 'physical', label: 'Physical' },
  information: { icon: Database, path: 'information', label: 'Information' },
  application: { icon: AppWindow, path: 'applications', label: 'Application' },
  software: { icon: Package, path: 'software', label: 'Software' },
  supplier: { icon: Building2, path: 'suppliers', label: 'Supplier' },
};

const actionConfig: Record<string, { icon: any; color: string; label: string }> = {
  create: { icon: Plus, color: 'text-green-600 bg-green-100', label: 'Created' },
  update: { icon: Pencil, color: 'text-blue-600 bg-blue-100', label: 'Updated' },
  delete: { icon: Trash2, color: 'text-red-600 bg-red-100', label: 'Deleted' },
};

export function RecentAssetChanges({ data, isLoading }: RecentAssetChangesProps) {
  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Recent Asset Changes</CardTitle>
          <CardDescription>Latest activity across all assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasChanges = data && data.length > 0;

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Asset Changes</CardTitle>
            <CardDescription>Latest activity across all assets</CardDescription>
          </div>
          {hasChanges && (
            <Badge variant="outline" className="text-xs">
              Last {data.length} changes
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!hasChanges ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No recent changes</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
            
            <div className="space-y-1 max-h-[350px] overflow-y-auto pr-2">
              {data.map((change, index) => {
                const typeConfig = assetTypeConfig[change.assetType] || assetTypeConfig.physical;
                const action = actionConfig[change.action] || actionConfig.update;
                const ActionIcon = action.icon;
                const TypeIcon = typeConfig.icon;

                return (
                  <div
                    key={change.id}
                    className="relative flex items-start gap-3 py-2.5 pl-1"
                  >
                    {/* Timeline dot */}
                    <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${action.color}`}>
                      <ActionIcon className="h-3.5 w-3.5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/dashboard/assets/${typeConfig.path}/${change.assetId}`}
                          className="font-medium text-sm hover:underline truncate max-w-[200px]"
                        >
                          {change.assetName}
                        </Link>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                          <TypeIcon className="h-2.5 w-2.5" />
                          {typeConfig.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <span className="font-medium">{action.label}</span>
                        {change.fieldName && (
                          <>
                            <span>•</span>
                            <span className="italic">{change.fieldName}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {change.changedByName || 'System'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(change.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}











