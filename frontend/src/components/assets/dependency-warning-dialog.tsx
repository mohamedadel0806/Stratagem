'use client';

import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';

interface DependencyWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetType: AssetType;
  assetId: string;
  assetName: string;
  action: 'delete' | 'update';
  onConfirm: () => void;
  isConfirming?: boolean;
}

const assetTypeConfig: Record<string, { path: string; label: string }> = {
  physical: { path: 'physical', label: 'Physical' },
  information: { path: 'information', label: 'Information' },
  application: { path: 'applications', label: 'Application' },
  software: { path: 'software', label: 'Software' },
  supplier: { path: 'suppliers', label: 'Supplier' },
};

const relationshipLabels: Record<string, string> = {
  depends_on: 'Depends On',
  uses: 'Uses',
  contains: 'Contains',
  hosts: 'Hosts',
  processes: 'Processes',
  stores: 'Stores',
  other: 'Related To',
};

export function DependencyWarningDialog({
  open,
  onOpenChange,
  assetType,
  assetId,
  assetName,
  action,
  onConfirm,
  isConfirming = false,
}: DependencyWarningDialogProps) {
  const { data: dependencyCheck, isLoading } = useQuery({
    queryKey: ['asset-dependency-check', assetType, assetId],
    queryFn: () => assetsApi.checkAssetDependencies(assetType, assetId),
    enabled: open && !!assetId,
  });

  const hasDependencies = dependencyCheck?.hasDependencies ?? false;
  const hasIncoming = (dependencyCheck?.incomingCount ?? 0) > 0;

  if (!open) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {hasDependencies ? (
              <>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span>Warning: Asset Has Dependencies</span>
              </>
            ) : (
              <span>Confirm {action === 'delete' ? 'Deletion' : 'Update'}</span>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking dependencies...
                </div>
              ) : hasDependencies ? (
                <>
                  <p>
                    <span className="font-medium">{assetName}</span> has{' '}
                    <span className="font-semibold text-amber-600">
                      {dependencyCheck?.totalCount} dependency relationship
                      {dependencyCheck?.totalCount !== 1 ? 's' : ''}
                    </span>
                    . {action === 'delete' 
                      ? 'Deleting this asset may break these relationships.'
                      : 'Updating this asset may affect related assets.'}
                  </p>

                  {/* Incoming Dependencies (others depend on this) */}
                  {hasIncoming && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-800 mb-2 flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        {dependencyCheck?.incomingCount} asset
                        {dependencyCheck?.incomingCount !== 1 ? 's' : ''} depend on this asset:
                      </p>
                      <div className="space-y-1">
                        {dependencyCheck?.incoming.slice(0, 5).map((dep) => {
                          const config = assetTypeConfig[dep.sourceAssetType];
                          return (
                            <div
                              key={dep.id}
                              className="flex items-center justify-between text-sm bg-white rounded px-2 py-1"
                            >
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-[10px]">
                                  {config?.label || dep.sourceAssetType}
                                </Badge>
                                <span className="font-medium">{dep.sourceAssetName}</span>
                                <span className="text-muted-foreground">
                                  ({relationshipLabels[dep.relationshipType] || dep.relationshipType})
                                </span>
                              </div>
                              <Link
                                href={`/dashboard/assets/${config?.path}/${dep.sourceAssetId}`}
                                className="text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          );
                        })}
                        {(dependencyCheck?.incomingCount ?? 0) > 5 && (
                          <p className="text-xs text-muted-foreground pl-2">
                            ...and {(dependencyCheck?.incomingCount ?? 0) - 5} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Outgoing Dependencies (this depends on others) */}
                  {(dependencyCheck?.outgoingCount ?? 0) > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-1">
                        <ArrowRight className="h-4 w-4" />
                        This asset depends on {dependencyCheck?.outgoingCount} other asset
                        {dependencyCheck?.outgoingCount !== 1 ? 's' : ''}:
                      </p>
                      <div className="space-y-1">
                        {dependencyCheck?.outgoing.slice(0, 5).map((dep) => {
                          const config = assetTypeConfig[dep.targetAssetType];
                          return (
                            <div
                              key={dep.id}
                              className="flex items-center justify-between text-sm bg-white rounded px-2 py-1"
                            >
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-[10px]">
                                  {config?.label || dep.targetAssetType}
                                </Badge>
                                <span className="font-medium">{dep.targetAssetName}</span>
                                <span className="text-muted-foreground">
                                  ({relationshipLabels[dep.relationshipType] || dep.relationshipType})
                                </span>
                              </div>
                              <Link
                                href={`/dashboard/assets/${config?.path}/${dep.targetAssetId}`}
                                className="text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          );
                        })}
                        {(dependencyCheck?.outgoingCount ?? 0) > 5 && (
                          <p className="text-xs text-muted-foreground pl-2">
                            ...and {(dependencyCheck?.outgoingCount ?? 0) - 5} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
                    {action === 'delete'
                      ? 'Are you sure you want to delete this asset? This action cannot be undone.'
                      : 'Are you sure you want to proceed with this update?'}
                  </p>
                </>
              ) : (
                <p>
                  Are you sure you want to {action}{' '}
                  <span className="font-medium">{assetName}</span>?
                  {action === 'delete' && ' This action cannot be undone.'}
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConfirming}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isConfirming || isLoading}
            className={
              action === 'delete'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : ''
            }
          >
            {isConfirming ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {action === 'delete' ? 'Deleting...' : 'Updating...'}
              </>
            ) : (
              <>
                {action === 'delete' ? 'Delete Anyway' : 'Proceed'}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}









