'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { controlAssetMappingApi, AssetType, ImplementationStatus } from '@/lib/api/governance';
import { assetsApi } from '@/lib/api/assets';
import { Search, Package, FileText, Monitor, Code, Building2, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AssetBrowserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  controlId: string;
  existingAssetIds?: Set<string>; // Track already linked assets
}

const assetTypeIcons = {
  [AssetType.PHYSICAL]: Package,
  [AssetType.INFORMATION]: FileText,
  [AssetType.APPLICATION]: Monitor,
  [AssetType.SOFTWARE]: Code,
  [AssetType.SUPPLIER]: Building2,
};

const assetTypeLabels = {
  [AssetType.PHYSICAL]: 'Physical',
  [AssetType.INFORMATION]: 'Information',
  [AssetType.APPLICATION]: 'Application',
  [AssetType.SOFTWARE]: 'Software',
  [AssetType.SUPPLIER]: 'Supplier',
};

export function AssetBrowserDialog({ open, onOpenChange, controlId, existingAssetIds = new Set() }: AssetBrowserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAssets, setSelectedAssets] = useState<Map<string, AssetType>>(new Map());
  const [activeTab, setActiveTab] = useState<AssetType>(AssetType.PHYSICAL);
  const [searchQuery, setSearchQuery] = useState('');
  const [implementationStatus, setImplementationStatus] = useState<ImplementationStatus | 'all'>('all');

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingLink, setPendingLink] = useState<{ assetIds: string[]; assetType: AssetType } | null>(null);
  const [linkProgress, setLinkProgress] = useState(0);

  const linkMutation = useMutation({
    mutationFn: async ({ assetIds, assetType }: { assetIds: string[]; assetType: AssetType }) => {
      setLinkProgress(50);
      const result = await controlAssetMappingApi.bulkLinkAssets(controlId, {
        asset_type: assetType,
        asset_ids: assetIds,
        implementation_status: (implementationStatus && implementationStatus !== 'all') ? (implementationStatus as ImplementationStatus) : undefined,
      });
      setLinkProgress(100);
      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['control-asset-mappings', controlId] });
      setSelectedAssets(new Map());
      setSearchQuery('');
      setLinkProgress(0);
      setShowConfirmDialog(false);
      onOpenChange(false);
      toast({
        title: 'Success',
        description: `${result.length} asset(s) linked successfully`,
      });
    },
    onError: (error: any) => {
      setLinkProgress(0);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to link assets',
        variant: 'destructive',
      });
    },
  });

  const handleToggleAsset = (assetId: string, assetType: AssetType) => {
    const newSelected = new Map(selectedAssets);
    if (newSelected.has(assetId)) {
      newSelected.delete(assetId);
    } else {
      newSelected.set(assetId, assetType);
    }
    setSelectedAssets(newSelected);
  };

  const handleLinkSelected = () => {
    if (selectedAssets.size === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select at least one asset to link',
        variant: 'destructive',
      });
      return;
    }

    // Group assets by type
    const assetsByType = new Map<AssetType, string[]>();
    selectedAssets.forEach((assetType, assetId) => {
      if (!assetsByType.has(assetType)) {
        assetsByType.set(assetType, []);
      }
      assetsByType.get(assetType)!.push(assetId);
    });

    // For single type, show confirmation dialog
    if (assetsByType.size === 1) {
      const [assetType, assetIds] = Array.from(assetsByType.entries())[0];
      setPendingLink({ assetIds, assetType });
      setShowConfirmDialog(true);
    } else {
      // Multiple types - proceed directly
      const linkPromises = Array.from(assetsByType.entries()).map(([assetType, assetIds]) =>
        linkMutation.mutateAsync({ assetIds, assetType })
      );
      Promise.all(linkPromises);
    }
  };

  const handleConfirmLink = () => {
    if (pendingLink) {
      linkMutation.mutate(pendingLink);
    }
  };

  const handleClose = () => {
    setSelectedAssets(new Map());
    setSearchQuery('');
    setImplementationStatus('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Link Assets to Control</DialogTitle>
          <DialogDescription>
            Search and select assets to link to this control. You can select multiple assets and link them at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-[200px]">
              <Select value={implementationStatus} onValueChange={(value) => setImplementationStatus(value as ImplementationStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Implementation Status (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Status</SelectItem>
                  <SelectItem value={ImplementationStatus.NOT_IMPLEMENTED}>Not Implemented</SelectItem>
                  <SelectItem value={ImplementationStatus.PLANNED}>Planned</SelectItem>
                  <SelectItem value={ImplementationStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={ImplementationStatus.IMPLEMENTED}>Implemented</SelectItem>
                  <SelectItem value={ImplementationStatus.NOT_APPLICABLE}>Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AssetType)} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value={AssetType.PHYSICAL}>Physical</TabsTrigger>
              <TabsTrigger value={AssetType.INFORMATION}>Information</TabsTrigger>
              <TabsTrigger value={AssetType.APPLICATION}>Application</TabsTrigger>
              <TabsTrigger value={AssetType.SOFTWARE}>Software</TabsTrigger>
              <TabsTrigger value={AssetType.SUPPLIER}>Supplier</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <AssetTypeTab
                assetType={activeTab}
                searchQuery={searchQuery}
                selectedAssets={selectedAssets}
                existingAssetIds={existingAssetIds}
                onToggleAsset={handleToggleAsset}
              />
            </div>
          </Tabs>

          {selectedAssets.size > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {selectedAssets.size} asset(s) selected
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAssets(new Map())}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}

          {linkProgress > 0 && linkProgress < 100 && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Linking assets...</span>
                <span className="text-muted-foreground">{linkProgress}%</span>
              </div>
              <Progress value={linkProgress} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={linkMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleLinkSelected}
            disabled={selectedAssets.size === 0 || linkMutation.isPending}
          >
            {linkMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Link {selectedAssets.size > 0 ? `${selectedAssets.size} ` : ''}Asset(s)
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Link Assets</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to link {pendingLink?.assetIds.length || 0} asset(s) to this control?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={linkMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLink} disabled={linkMutation.isPending}>
              {linkMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Link Assets
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

interface AssetTypeTabProps {
  assetType: AssetType;
  searchQuery: string;
  selectedAssets: Map<string, AssetType>;
  existingAssetIds: Set<string>;
  onToggleAsset: (assetId: string, assetType: AssetType) => void;
}

function AssetTypeTab({ assetType, searchQuery, selectedAssets, existingAssetIds, onToggleAsset }: AssetTypeTabProps) {
  const [page, setPage] = useState(1);
  const limit = 20;

  const getQueryFn = () => {
    const params: any = { page, limit };
    if (searchQuery) params.search = searchQuery;

    switch (assetType) {
      case AssetType.PHYSICAL:
        return () => assetsApi.getPhysicalAssets(params);
      case AssetType.INFORMATION:
        return () => assetsApi.getInformationAssets(params);
      case AssetType.APPLICATION:
        return () => assetsApi.getBusinessApplications(params);
      case AssetType.SOFTWARE:
        return () => assetsApi.getSoftwareAssets(params);
      case AssetType.SUPPLIER:
        return () => assetsApi.getSuppliers(params);
      default:
        return () => Promise.resolve({ data: [], total: 0, page: 1, limit: 20 });
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['assets', assetType, searchQuery, page],
    queryFn: getQueryFn(),
    enabled: true,
  });

  const AssetIcon = assetTypeIcons[assetType] || Package;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AssetIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">
          {searchQuery ? 'No assets found matching your search' : 'No assets available'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.data.map((asset: any) => {
        const assetId = asset.id;
        const isSelected = selectedAssets.has(assetId);
        const isAlreadyLinked = existingAssetIds.has(assetId);
        const assetName = asset.assetDescription || asset.applicationName || asset.uniqueIdentifier || asset.id;
        const assetIdentifier = asset.uniqueIdentifier || asset.applicationIdentifier || asset.assetIdentifier || '';

        return (
          <div
            key={assetId}
            className={`flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
              isAlreadyLinked ? 'opacity-50' : ''
            }`}
          >
            <Checkbox
              checked={isSelected}
              disabled={isAlreadyLinked}
              onCheckedChange={() => !isAlreadyLinked && onToggleAsset(assetId, assetType)}
            />
            <AssetIcon className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{assetName}</p>
              {assetIdentifier && (
                <p className="text-xs text-muted-foreground truncate">{assetIdentifier}</p>
              )}
            </div>
            {isAlreadyLinked && (
              <Badge variant="secondary" className="text-xs">
                Already Linked
              </Badge>
            )}
          </div>
        );
      })}

      {data.total > page * limit && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

