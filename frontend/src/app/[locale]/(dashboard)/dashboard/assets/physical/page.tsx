'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi, PhysicalAsset, PhysicalAssetQueryParams } from '@/lib/api/assets';
import { usersApi, User } from '@/lib/api/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Search, Upload, CheckSquare, Square } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { BulkOperationsBar } from '@/components/assets/bulk-operations-bar-enhanced';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { ExportButton } from '@/components/export/export-button';
import { formatPhysicalAssetForExport, convertToCSV, downloadCSV } from '@/lib/utils/export';
import { PhysicalAssetForm } from '@/components/forms/physical-asset-form';
import { AssetImportWizard } from '@/components/forms/asset-import-wizard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AssetRiskBadge } from '@/components/assets/asset-risk-badge';
import { downloadSampleExcel } from '@/lib/utils/sample-excel-generator';
import { Download } from 'lucide-react';

export default function PhysicalAssetsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<PhysicalAsset | null>(null);
  const [filters, setFilters] = useState<PhysicalAssetQueryParams>({
    page: 1,
    limit: 20,
  });
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const getUserDisplayName = (user: User): string => {
    if (user.firstName || user.lastName) {
      return [user.firstName, user.lastName].filter(Boolean).join(' ');
    }
    return user.email;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['physical-assets', filters],
    queryFn: async () => {
      try {
        console.log('Fetching physical assets with filters:', filters);
        const result = await assetsApi.getPhysicalAssets(filters);
        console.log('Physical assets fetched successfully:', result);
        return result;
      } catch (err: any) {
        console.error('Error fetching physical assets:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        throw err;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deletePhysicalAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['physical-assets'] });
      toast({
        title: 'Success',
        description: 'Asset deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete asset',
        variant: 'destructive',
      });
    },
  });

  // Bulk selection handlers
  const toggleAssetSelection = useCallback((assetId: string) => {
    setSelectedAssets((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) {
        next.delete(assetId);
      } else {
        next.add(assetId);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (!data?.data) return;
    if (selectedAssets.size === data.data.length) {
      setSelectedAssets(new Set());
    } else {
      setSelectedAssets(new Set(data.data.map((a) => a.id)));
    }
  }, [data?.data, selectedAssets.size]);

  const clearSelection = useCallback(() => {
    setSelectedAssets(new Set());
  }, []);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    await Promise.all(ids.map((id) => assetsApi.deletePhysicalAsset(id)));
    queryClient.invalidateQueries({ queryKey: ['physical-assets'] });
  }, [queryClient]);

  const getTypeColor = (type: PhysicalAsset['assetType']) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    
    const typeName = typeof type === 'string' 
      ? type 
      : (typeof type === 'object' && type !== null && 'name' in type)
        ? (type as any).name || (type as any).code || 'other'
        : 'other';
    
    const colors: Record<string, string> = {
      server: 'bg-blue-100 text-blue-800',
      workstation: 'bg-green-100 text-green-800',
      network_device: 'bg-purple-100 text-purple-800',
      mobile_device: 'bg-yellow-100 text-yellow-800',
      iot_device: 'bg-orange-100 text-orange-800',
      printer: 'bg-pink-100 text-pink-800',
      storage_device: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[typeName] || colors.other;
  };

  const getCriticalityColor = (level: PhysicalAsset['criticalityLevel']) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[level] || colors.medium;
  };

  const handleFilterChange = (newFilters: Partial<PhysicalAssetQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleExport = () => {
    if (data?.data) {
      const csvData = data.data.map(formatPhysicalAssetForExport);
      const csv = convertToCSV(csvData);
      downloadCSV(csv, 'physical-assets');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <div>Loading assets...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading physical assets:', error);
    const errorStatus = (error as any)?.response?.status;
    const errorMessage = error instanceof Error 
      ? error.message 
      : (error as any)?.response?.data?.message || (error as any)?.response?.data?.error || 'Unknown error';
    const errorDetails = (error as any)?.response?.data;
    
    // Handle 401 errors gracefully - don't auto-redirect, let user retry
    if (errorStatus === 401) {
      return (
        <div className="container mx-auto py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-500 mb-2 font-semibold">
                Authentication error. Please try refreshing the page.
              </p>
              <div className="flex gap-2 justify-center mt-4">
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
                <Button variant="outline" onClick={() => router.push('/login')}>
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-500 mb-2 font-semibold">
              Error loading assets: {errorMessage}
            </p>
            {errorDetails && (
              <p className="text-sm text-muted-foreground mb-4">
                {JSON.stringify(errorDetails, null, 2)}
              </p>
            )}
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Physical Assets</h1>
          <p className="text-muted-foreground mt-2">
            Manage your physical IT assets and infrastructure
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Asset
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter physical assets</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableFilters
            searchValue={filters.search || ''}
            onSearchChange={(value) => handleFilterChange({ search: value })}
            filters={[
              {
                key: 'assetType',
                label: 'Asset Type',
                value: filters.assetType || '',
                options: [
                  { value: 'server', label: 'Server' },
                  { value: 'workstation', label: 'Workstation' },
                  { value: 'network_device', label: 'Network Device' },
                  { value: 'mobile_device', label: 'Mobile Device' },
                  { value: 'iot_device', label: 'IoT Device' },
                  { value: 'printer', label: 'Printer' },
                  { value: 'storage_device', label: 'Storage Device' },
                  { value: 'other', label: 'Other' },
                ],
                onChange: (value) => handleFilterChange({ assetType: value as PhysicalAsset['assetType'] }),
              },
              {
                key: 'criticalityLevel',
                label: 'Criticality',
                value: filters.criticalityLevel || '',
                options: [
                  { value: 'critical', label: 'Critical' },
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' },
                ],
                onChange: (value) => handleFilterChange({ criticalityLevel: value as PhysicalAsset['criticalityLevel'] }),
              },
              {
                key: 'connectivityStatus',
                label: 'Connectivity',
                value: filters.connectivityStatus || '',
                options: [
                  { value: 'connected', label: 'Connected' },
                  { value: 'disconnected', label: 'Disconnected' },
                  { value: 'unknown', label: 'Unknown' },
                ],
                onChange: (value) => handleFilterChange({ connectivityStatus: value as PhysicalAsset['connectivityStatus'] }),
              },
              {
                key: 'hasDependencies',
                label: 'Dependencies',
                value: filters.hasDependencies !== undefined ? String(filters.hasDependencies) : '',
                options: [
                  { value: '', label: 'All' },
                  { value: 'true', label: 'With Dependencies' },
                  { value: 'false', label: 'Without Dependencies' },
                ],
                onChange: (value) => handleFilterChange({ 
                  hasDependencies: value === '' ? undefined : value === 'true' 
                }),
              },
              {
                key: 'ownerId',
                label: 'Owner',
                value: filters.ownerId || '',
                options: [
                  { value: '', label: 'All owners' },
                  ...users.map((user) => ({
                    value: user.id,
                    label: getUserDisplayName(user),
                  })),
                ],
                onChange: (value) =>
                  handleFilterChange({
                    ownerId: value || undefined,
                  }),
              },
            ]}
            onClear={() => setFilters({ page: 1, limit: 20 })}
            storageKey="physical-assets"
            onLoadPreset={(presetFilters, searchValue) => {
              setFilters({
                page: 1,
                limit: 20,
                search: searchValue || undefined,
                assetType: presetFilters.assetType as PhysicalAsset['assetType'] || undefined,
                criticalityLevel: presetFilters.criticalityLevel as PhysicalAsset['criticalityLevel'] || undefined,
                connectivityStatus: presetFilters.connectivityStatus as PhysicalAsset['connectivityStatus'] || undefined,
                hasDependencies: presetFilters.hasDependencies !== undefined 
                  ? presetFilters.hasDependencies === 'true' || presetFilters.hasDependencies === true
                  : undefined,
                ownerId: (presetFilters.ownerId as string) || undefined,
              });
            }}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          {data && data.data.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSelectAll}
              className="text-muted-foreground"
            >
              {selectedAssets.size === data.data.length ? (
                <CheckSquare className="h-4 w-4 mr-2" />
              ) : (
                <Square className="h-4 w-4 mr-2" />
              )}
              {selectedAssets.size > 0 ? `${selectedAssets.size} selected` : 'Select all'}
            </Button>
          )}
          <div className="text-sm text-muted-foreground">
            {data?.total || 0} asset{data?.total !== 1 ? 's' : ''} found
          </div>
        </div>
        <ExportButton onExport={handleExport} />
      </div>

      {!data || data.data.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No physical assets found</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Asset
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((asset) => {
              return (
              <Card 
                key={asset.id} 
                className={`hover:shadow-lg transition-shadow ${selectedAssets.has(asset.id) ? 'ring-2 ring-primary' : ''}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-3">
                    <Checkbox
                      checked={selectedAssets.has(asset.id)}
                      onCheckedChange={() => toggleAssetSelection(asset.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{asset.assetDescription}</CardTitle>
                      <CardDescription className="mt-1">
                        {asset.uniqueIdentifier || asset.assetIdentifier}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {asset.assetType && (() => {
                        // Convert assetType to string BEFORE passing to Badge
                        const assetTypeDisplay = typeof asset.assetType === 'string' 
                          ? asset.assetType.replace('_', ' ')
                          : (typeof asset.assetType === 'object' && asset.assetType !== null && 'name' in asset.assetType)
                            ? (asset.assetType as any).name || (asset.assetType as any).code || (asset.assetType as any).id || 'Unknown'
                            : String(asset.assetType || 'Unknown');
                        return (
                          <Badge className={getTypeColor(asset.assetType)}>
                            {assetTypeDisplay}
                          </Badge>
                        );
                      })()}
                      {asset.criticalityLevel && (
                        <Badge className={getCriticalityColor(typeof asset.criticalityLevel === 'string' ? asset.criticalityLevel : (asset.criticalityLevel as any).name || (asset.criticalityLevel as any).code || 'medium')}>
                          {typeof asset.criticalityLevel === 'string' ? asset.criticalityLevel : (asset.criticalityLevel as any).name || (asset.criticalityLevel as any).code || 'Unknown'}
                        </Badge>
                      )}
                      {asset.connectivityStatus && (
                        <Badge variant="outline">{typeof asset.connectivityStatus === 'string' ? asset.connectivityStatus : (asset.connectivityStatus as any).name || (asset.connectivityStatus as any).code || 'Unknown'}</Badge>
                      )}
                      <AssetRiskBadge 
                        assetId={asset.id} 
                        assetType="physical" 
                        riskCount={asset.riskCount}
                      />
                    </div>

                    {asset.ownerName && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Owner: </span>
                        {asset.ownerName}
                      </div>
                    )}

                    {asset.businessUnit && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Business Unit: </span>
                        {typeof asset.businessUnit === 'string' ? asset.businessUnit : (asset.businessUnit as any).name || (asset.businessUnit as any).code || 'Unknown'}
                      </div>
                    )}

                    {asset.location && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Location: </span>
                        {asset.location}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/${locale}/dashboard/assets/physical/${asset.id}`)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAsset(asset)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(asset.id)}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>

          {data && data.total > 0 && (
            <Pagination
              currentPage={data.page || 1}
              totalPages={Math.ceil((data.total || 0) / (data.limit || 20)) || 1}
              onPageChange={handlePageChange}
              totalItems={data.total || 0}
              itemsPerPage={data.limit || 20}
            />
          )}
        </>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Physical Asset</DialogTitle>
            <DialogDescription>
              Add a new physical asset to your inventory
            </DialogDescription>
          </DialogHeader>
          <PhysicalAssetForm
            onSuccess={() => {
              setIsCreateOpen(false);
              queryClient.invalidateQueries({ queryKey: ['physical-assets'] });
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {editingAsset && (
        <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Physical Asset</DialogTitle>
              <DialogDescription>Update asset information</DialogDescription>
            </DialogHeader>
            <PhysicalAssetForm
              asset={editingAsset}
              onSuccess={() => {
                setEditingAsset(null);
                queryClient.invalidateQueries({ queryKey: ['physical-assets'] });
              }}
              onCancel={() => setEditingAsset(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Physical Assets</DialogTitle>
            <DialogDescription>
              Import assets from a CSV or Excel file. Follow the steps to map fields and preview data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await downloadSampleExcel('physical');
                  toast({
                    title: 'Download Started',
                    description: 'Sample Excel template is downloading',
                  });
                } catch (error: any) {
                  toast({
                    title: 'Download Failed',
                    description: error.message || 'Failed to download sample file',
                    variant: 'destructive',
                  });
                }
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Sample Excel
            </Button>
          </div>
          <AssetImportWizard
            onSuccess={() => {
              setIsImportOpen(false);
              queryClient.invalidateQueries({ queryKey: ['physical-assets'] });
            }}
            onCancel={() => setIsImportOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Bulk Operations Bar */}
      <BulkOperationsBar
        selectedCount={selectedAssets.size}
        selectedItems={data?.data.filter((a) => selectedAssets.has(a.id)) || []}
        onClearSelection={clearSelection}
        onDelete={handleBulkDelete}
        onUpdate={() => {
          queryClient.invalidateQueries({ queryKey: ['physical-assets'] });
          clearSelection();
        }}
        assetType="physical"
        exportColumns={[
          { header: 'Name', key: 'assetDescription' },
          { header: 'Identifier', key: 'uniqueIdentifier' },
          { header: 'Type', key: 'assetType' },
          { header: 'Criticality', key: 'criticalityLevel' },
          { header: 'Owner', key: 'ownerName' },
          { header: 'Location', key: 'location' },
          { header: 'Created', key: 'createdAt' },
        ]}
      />
    </div>
  );
}

