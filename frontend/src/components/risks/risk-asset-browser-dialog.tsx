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
import { riskLinksApi, RiskAssetType } from '@/lib/api/risks';
import { assetsApi } from '@/lib/api/assets';
import { Search, Package, FileText, Monitor, Code, Building2, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RiskAssetBrowserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  riskId: string;
  existingAssetIds?: Set<string>; // Track already linked assets
}

const assetTypeIcons = {
  physical: Package,
  information: FileText,
  application: Monitor,
  software: Code,
  supplier: Building2,
};

const assetTypeLabels = {
  physical: 'Physical',
  information: 'Information',
  application: 'Application',
  software: 'Software',
  supplier: 'Supplier',
};

export function RiskAssetBrowserDialog({ open, onOpenChange, riskId, existingAssetIds = new Set() }: RiskAssetBrowserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAssets, setSelectedAssets] = useState<Map<string, RiskAssetType>>(new Map());
  const [activeTab, setActiveTab] = useState<RiskAssetType>('physical');
  const [searchQuery, setSearchQuery] = useState('');
  const [impactDescription, setImpactDescription] = useState('');
  const [linkProgress, setLinkProgress] = useState(0);
  const [criticalityFilter, setCriticalityFilter] = useState<string>('');
  const [complianceFilter, setComplianceFilter] = useState<string>('');

  const linkMutation = useMutation({
    mutationFn: async ({ assetIds, assetType }: { assetIds: string[]; assetType: RiskAssetType }) => {
      setLinkProgress(50);
      const assets = assetIds.map(assetId => ({
        asset_type: assetType,
        asset_id: assetId,
        impact_description: impactDescription || undefined,
      }));
      const result = await riskLinksApi.bulkLinkAssets(riskId, assets);
      setLinkProgress(100);
      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['risk-assets', riskId] });
      queryClient.invalidateQueries({ queryKey: ['risk', riskId] });
      setSelectedAssets(new Map());
      setSearchQuery('');
      setImpactDescription('');
      setLinkProgress(0);
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

  const handleToggleAsset = (assetId: string, assetType: RiskAssetType) => {
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
    const assetsByType = new Map<RiskAssetType, string[]>();
    selectedAssets.forEach((assetType, assetId) => {
      if (!assetsByType.has(assetType)) {
        assetsByType.set(assetType, []);
      }
      assetsByType.get(assetType)!.push(assetId);
    });

    // Proceed directly without confirmation
    const linkPromises = Array.from(assetsByType.entries()).map(([assetType, assetIds]) =>
      linkMutation.mutateAsync({ assetIds, assetType })
    );
    Promise.all(linkPromises);
  };

  const handleClose = () => {
    setSelectedAssets(new Map());
    setSearchQuery('');
    setImpactDescription('');
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Link Assets to Risk</DialogTitle>
            <DialogDescription>
              Search and select assets to link to this risk. You can select multiple assets and link them at once.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="asset-search-input"
                />
              </div>
              <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Criticality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Criticality</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={complianceFilter} onValueChange={setComplianceFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Compliance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Compliance</SelectItem>
                  <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                  <SelectItem value="SOC 2">SOC 2</SelectItem>
                  <SelectItem value="PCI DSS">PCI DSS</SelectItem>
                  <SelectItem value="HIPAA">HIPAA</SelectItem>
                  <SelectItem value="GDPR">GDPR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedAssets.size > 0 && (
              <div className="space-y-2">
                <Label htmlFor="impact">Impact Description (Optional)</Label>
                <Textarea
                  id="impact"
                  placeholder="Describe how this risk impacts the selected assets..."
                  value={impactDescription}
                  onChange={(e) => setImpactDescription(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as RiskAssetType)} className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="physical">Physical</TabsTrigger>
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="application">Application</TabsTrigger>
                <TabsTrigger value="software">Software</TabsTrigger>
                <TabsTrigger value="supplier">Supplier</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="flex-1 overflow-y-auto mt-4">
                <AssetTypeTab
                  assetType={activeTab}
                  searchQuery={searchQuery}
                  selectedAssets={selectedAssets}
                  existingAssetIds={existingAssetIds}
                  onToggleAsset={handleToggleAsset}
                  criticalityFilter={criticalityFilter}
                  complianceFilter={complianceFilter}
                />
              </TabsContent>
            </Tabs>

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
              data-testid="link-asset-submit"
            >
              {linkMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Link {selectedAssets.size > 0 ? `${selectedAssets.size} ` : ''}Asset(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface AssetTypeTabProps {
  assetType: RiskAssetType;
  searchQuery: string;
  selectedAssets: Map<string, RiskAssetType>;
  existingAssetIds: Set<string>;
  onToggleAsset: (assetId: string, assetType: RiskAssetType) => void;
  criticalityFilter?: string;
  complianceFilter?: string;
}

function AssetTypeTab({ assetType, searchQuery, selectedAssets, existingAssetIds, onToggleAsset, criticalityFilter, complianceFilter }: AssetTypeTabProps) {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['assets', assetType, searchQuery, page, limit, criticalityFilter, complianceFilter],
    queryFn: () => {
      const params: any = {
        type: assetType,
        page,
        limit,
      };
      if (searchQuery) {
        params.search = searchQuery;
      }
      if (criticalityFilter) {
        params.criticalityLevel = criticalityFilter;
      }
      if (complianceFilter && (assetType === 'information' || assetType === 'application')) {
        params.complianceRequirement = complianceFilter;
      }
      return assetsApi.getAllAssets(params);
    },
  });

  const AssetIcon = assetTypeIcons[assetType];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
        <p className="text-sm text-muted-foreground">
          Failed to load assets. Please try again.
        </p>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
        <AssetIcon className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {searchQuery ? 'No assets found matching your search' : `No ${assetTypeLabels[assetType]} assets available`}
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
        const assetName = asset.name || asset.assetDescription || asset.applicationName || asset.uniqueIdentifier || asset.id;
        const assetIdentifier = asset.identifier || asset.uniqueIdentifier || asset.applicationIdentifier || asset.assetIdentifier || '';

        return (
          <div
            key={assetId}
            className={`flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
              isAlreadyLinked ? 'opacity-50' : ''
            }`}
            data-testid={`asset-item-${assetId}`}
          >
            <Checkbox
              checked={isSelected}
              disabled={isAlreadyLinked}
              onCheckedChange={() => !isAlreadyLinked && onToggleAsset(assetId, assetType)}
              data-testid={`asset-checkbox-${assetId}`}
            />
            <AssetIcon className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{assetName}</p>
              {assetIdentifier && (
                <p className="text-xs text-muted-foreground truncate">{assetIdentifier}</p>
              )}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {asset.criticalityLevel && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      asset.criticalityLevel === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                      asset.criticalityLevel === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      asset.criticalityLevel === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}
                  >
                    {asset.criticalityLevel}
                  </Badge>
                )}
                {asset.complianceRequirements && Array.isArray(asset.complianceRequirements) && asset.complianceRequirements.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {asset.complianceRequirements.length} Compliance
                  </Badge>
                )}
                {asset.classificationLevel && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {asset.classificationLevel}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAlreadyLinked && (
                <Badge variant="secondary" className="text-xs">
                  Already Linked
                </Badge>
              )}
            </div>
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



