'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, UnifiedControl, AssetType, ImplementationStatus } from '@/lib/api/governance';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface BulkAssetControlAssignmentProps {
  onSuccess?: () => void;
}

interface AssignmentProgress {
  total: number;
  completed: number;
  failed: number;
  current?: string;
}

export function BulkAssetControlAssignment({ onSuccess }: BulkAssetControlAssignmentProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | ''>('');
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  const [selectedControlIds, setSelectedControlIds] = useState<Set<string>>(new Set());
  const [implementationStatus, setImplementationStatus] = useState<ImplementationStatus>(
    ImplementationStatus.NOT_IMPLEMENTED,
  );
  const [implementationNotes, setImplementationNotes] = useState('');
  const [progress, setProgress] = useState<AssignmentProgress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch assets based on selected type
  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ['assets', selectedAssetType],
    queryFn: async () => {
      if (!selectedAssetType) return [];
      switch (selectedAssetType) {
        case AssetType.PHYSICAL:
          const physical = await assetsApi.getPhysicalAssets({ limit: 1000 });
          return physical.data || [];
        case AssetType.INFORMATION:
          const information = await assetsApi.getInformationAssets({ limit: 1000 });
          return information.data || [];
        case AssetType.APPLICATION:
          const applications = await assetsApi.getBusinessApplications({ limit: 1000 });
          return applications.data || [];
        case AssetType.SOFTWARE:
          const software = await assetsApi.getSoftwareAssets({ limit: 1000 });
          return software.data || [];
        case AssetType.SUPPLIER:
          const suppliers = await assetsApi.getSuppliers({ limit: 1000 });
          return suppliers.data || [];
        default:
          return [];
      }
    },
    enabled: isOpen && !!selectedAssetType,
  });

  // Fetch controls
  const { data: controlsData, isLoading: controlsLoading } = useQuery({
    queryKey: ['unified-controls', { limit: 1000 }],
    queryFn: () => governanceApi.getUnifiedControls({ limit: 1000 }),
    enabled: isOpen,
  });

  const controls = controlsData?.data || [];

  const linkControlsMutation = useMutation({
    mutationFn: async ({
      assetId,
      controlIds,
    }: {
      assetId: string;
      controlIds: string[];
    }) => {
      const response = await governanceApi.linkControlsToAsset(
        selectedAssetType as AssetType,
        assetId,
        controlIds,
        implementationStatus,
        implementationNotes || undefined,
      );
      return response;
    },
  });

  const handleBulkAssign = async () => {
    if (!selectedAssetType || selectedAssetIds.size === 0 || selectedControlIds.size === 0) {
      toast({
        title: 'Error',
        description: 'Please select asset type, at least one asset, and at least one control',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    const assetIdsArray = Array.from(selectedAssetIds);
    const controlIdsArray = Array.from(selectedControlIds);
    const total = assetIdsArray.length * controlIdsArray.length;

    setProgress({
      total,
      completed: 0,
      failed: 0,
    });

    let completed = 0;
    let failed = 0;
    const errors: string[] = [];

    try {
      for (const assetId of assetIdsArray) {
        setProgress((prev) => (prev ? { ...prev, current: assetId } : null));

        try {
          const result = await linkControlsMutation.mutateAsync({
            assetId,
            controlIds: controlIdsArray,
          });

          completed += result.created?.length || 0;
          if (result.alreadyLinked && result.alreadyLinked.length > 0) {
            completed += result.alreadyLinked.length;
          }
        } catch (error: any) {
          failed += controlIdsArray.length;
          errors.push(`Asset ${assetId}: ${error.message || 'Failed to link controls'}`);
        }

        setProgress({
          total,
          completed,
          failed,
          current: assetId,
        });
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['asset-controls'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['unified-controls'] });

      toast({
        title: 'Bulk Assignment Complete',
        description: `Successfully linked controls to ${completed} asset-control pairs. ${failed > 0 ? `${failed} failed.` : ''}`,
        variant: failed > 0 ? 'default' : 'default',
      });

      if (errors.length > 0 && errors.length <= 5) {
        errors.forEach((error) => {
          toast({
            title: 'Assignment Error',
            description: error,
            variant: 'destructive',
          });
        });
      }

      setIsProcessing(false);
      setProgress(null);
      setIsOpen(false);
      setSelectedAssetIds(new Set());
      setSelectedControlIds(new Set());
      onSuccess?.();
    } catch (error: any) {
      setIsProcessing(false);
      setProgress(null);
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete bulk assignment',
        variant: 'destructive',
      });
    }
  };

  const toggleAsset = (assetId: string) => {
    const newSet = new Set(selectedAssetIds);
    if (newSet.has(assetId)) {
      newSet.delete(assetId);
    } else {
      newSet.add(assetId);
    }
    setSelectedAssetIds(newSet);
  };

  const toggleControl = (controlId: string) => {
    const newSet = new Set(selectedControlIds);
    if (newSet.has(controlId)) {
      newSet.delete(controlId);
    } else {
      newSet.add(controlId);
    }
    setSelectedControlIds(newSet);
  };

  const selectAllAssets = () => {
    if (assets) {
      setSelectedAssetIds(new Set(assets.map((asset: any) => asset.id)));
    }
  };

  const deselectAllAssets = () => {
    setSelectedAssetIds(new Set());
  };

  const selectAllControls = () => {
    setSelectedControlIds(new Set(controls.map((c) => c.id)));
  };

  const deselectAllControls = () => {
    setSelectedControlIds(new Set());
  };

  const getAssetName = (asset: any): string => {
    return asset.name || asset.title || asset.hostname || asset.identifier || asset.id;
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <Link2 className="h-4 w-4 mr-2" />
        Bulk Assign Controls
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Assign Controls to Assets</DialogTitle>
            <DialogDescription>
              Select multiple assets and controls to create mappings in bulk
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Asset Type Selection */}
            <div>
              <Label htmlFor="asset-type">Asset Type *</Label>
              <Select value={selectedAssetType} onValueChange={(value) => setSelectedAssetType(value as AssetType)}>
                <SelectTrigger id="asset-type">
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AssetType.PHYSICAL}>Physical Assets</SelectItem>
                  <SelectItem value={AssetType.INFORMATION}>Information Assets</SelectItem>
                  <SelectItem value={AssetType.APPLICATION}>Business Applications</SelectItem>
                  <SelectItem value={AssetType.SOFTWARE}>Software Assets</SelectItem>
                  <SelectItem value={AssetType.SUPPLIER}>Suppliers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Implementation Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="implementation-status">Implementation Status</Label>
                <Select
                  value={implementationStatus}
                  onValueChange={(value) => setImplementationStatus(value as ImplementationStatus)}
                >
                  <SelectTrigger id="implementation-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ImplementationStatus.NOT_IMPLEMENTED}>Not Implemented</SelectItem>
                    <SelectItem value={ImplementationStatus.PLANNED}>Planned</SelectItem>
                    <SelectItem value={ImplementationStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={ImplementationStatus.IMPLEMENTED}>Implemented</SelectItem>
                    <SelectItem value={ImplementationStatus.NOT_APPLICABLE}>Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="implementation-notes">Implementation Notes (Optional)</Label>
              <Textarea
                id="implementation-notes"
                value={implementationNotes}
                onChange={(e) => setImplementationNotes(e.target.value)}
                placeholder="Add notes about the implementation..."
                rows={3}
              />
            </div>

            {/* Progress Indicator */}
            {isProcessing && progress && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing assignments...</span>
                      <span>
                        {progress.completed + progress.failed} / {progress.total}
                      </span>
                    </div>
                    <Progress
                      value={((progress.completed + progress.failed) / progress.total) * 100}
                      className="h-2"
                    />
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        {progress.completed} completed
                      </div>
                      {progress.failed > 0 && (
                        <div className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-red-600" />
                          {progress.failed} failed
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Asset Selection */}
            {selectedAssetType && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Select Assets ({selectedAssetIds.size} selected)</CardTitle>
                      <CardDescription>Choose assets to assign controls to</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={selectAllAssets}>
                        Select All
                      </Button>
                      <Button variant="outline" size="sm" onClick={deselectAllAssets}>
                        Deselect All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {assetsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : assets && assets.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {assets.map((asset: any) => (
                        <div
                          key={asset.id}
                          className="flex items-center gap-3 p-2 rounded border hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={selectedAssetIds.has(asset.id)}
                            onCheckedChange={() => toggleAsset(asset.id)}
                            disabled={isProcessing}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{getAssetName(asset)}</p>
                            {asset.businessUnit && (
                              <p className="text-xs text-muted-foreground">{asset.businessUnit}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No assets found for this type
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Control Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Select Controls ({selectedControlIds.size} selected)</CardTitle>
                    <CardDescription>Choose controls to assign to the selected assets</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={selectAllControls}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={deselectAllControls}>
                      Deselect All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {controlsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : controls.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {controls.map((control) => (
                      <div
                        key={control.id}
                        className="flex items-center gap-3 p-2 rounded border hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={selectedControlIds.has(control.id)}
                          onCheckedChange={() => toggleControl(control.id)}
                          disabled={isProcessing}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {control.control_identifier}
                            </Badge>
                            <span className="text-sm font-medium">{control.title}</span>
                          </div>
                          {control.domain && (
                            <p className="text-xs text-muted-foreground mt-1">Domain: {control.domain}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No controls found</p>
                )}
              </CardContent>
            </Card>

            {/* Summary */}
            {selectedAssetIds.size > 0 && selectedControlIds.size > 0 && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-sm">
                    <p className="font-medium mb-2">Assignment Summary</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>
                        {selectedAssetIds.size} asset(s) × {selectedControlIds.size} control(s) ={' '}
                        {selectedAssetIds.size * selectedControlIds.size} total mappings
                      </li>
                      <li>Implementation Status: {implementationStatus.replace('_', ' ')}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                onClick={handleBulkAssign}
                disabled={
                  !selectedAssetType ||
                  selectedAssetIds.size === 0 ||
                  selectedControlIds.size === 0 ||
                  isProcessing
                }
              >
                {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Assign {selectedAssetIds.size * selectedControlIds.size} Mapping(s)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
