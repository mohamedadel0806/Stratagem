'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InformationAssetForm } from '@/components/forms/information-asset-form';
import { AssetImportWizard } from '@/components/forms/asset-import-wizard';
import { AssetRiskBadge } from '@/components/assets/asset-risk-badge';
import { downloadSampleExcel } from '@/lib/utils/sample-excel-generator';
import { Download } from 'lucide-react';

export default function InformationAssetsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [filters, setFilters] = useState<any>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['information-assets', filters],
    queryFn: () => assetsApi.getInformationAssets(filters),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteInformationAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['information-assets'] });
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

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    console.error('Error loading information assets:', error);
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error loading assets: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Information Assets</h1>
          <p className="text-muted-foreground">Manage your information assets and data classification</p>
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

      <DataTableFilters
        searchValue={filters.search || ''}
        onSearchChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
        filters={[
          {
            label: 'Classification',
            value: filters.dataClassification || '',
            options: [
              { value: '', label: 'All' },
              { value: 'public', label: 'Public' },
              { value: 'internal', label: 'Internal' },
              { value: 'confidential', label: 'Confidential' },
              { value: 'restricted', label: 'Restricted' },
              { value: 'secret', label: 'Secret' },
            ],
            onChange: (value) => setFilters({ ...filters, dataClassification: value, page: 1 }),
          },
        ]}
      />

      {data?.data && data.data.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((asset: any) => (
              <Card key={asset.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{asset.name || 'Unnamed Asset'}</CardTitle>
                      <CardDescription>{asset.informationType || 'Information Asset'}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{asset.classificationLevel || 'N/A'}</Badge>
                      <AssetRiskBadge 
                        assetId={asset.id} 
                        assetType="information" 
                        riskCount={(asset as any).riskCount}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {asset.description && (
                      <div className="text-muted-foreground line-clamp-2">
                        {asset.description}
                      </div>
                    )}
                    {asset.informationOwner && (
                      <div>
                        <span className="font-medium">Owner:</span>{' '}
                        {asset.informationOwner.firstName && asset.informationOwner.lastName
                          ? `${asset.informationOwner.firstName} ${asset.informationOwner.lastName}`
                          : asset.informationOwner.email}
                      </div>
                    )}
                    {asset.businessUnit && (
                      <div>
                        <span className="font-medium">Business Unit:</span> {asset.businessUnit.name || asset.businessUnit}
                      </div>
                    )}
                    {asset.storageMedium && (
                      <div>
                        <span className="font-medium">Storage:</span> {asset.storageMedium}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/en/dashboard/assets/information/${asset.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingAsset(asset)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(asset.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination
            currentPage={data.page}
            totalPages={Math.ceil(data.total / data.limit)}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No information assets found</p>
            <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Asset
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCreateOpen || !!editingAsset} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingAsset(null);
        }
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAsset ? 'Edit' : 'Create'} Information Asset</DialogTitle>
            <DialogDescription>
              {editingAsset ? 'Update the information asset details' : 'Add a new information asset to the system'}
            </DialogDescription>
          </DialogHeader>
          <InformationAssetForm
            asset={editingAsset || undefined}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingAsset(null);
              queryClient.invalidateQueries({ queryKey: ['information-assets'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingAsset(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Information Assets</DialogTitle>
            <DialogDescription>
              Import information assets from a CSV or Excel file. Follow the steps to map fields and preview data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await downloadSampleExcel('information');
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
            assetType="information"
            onSuccess={() => {
              setIsImportOpen(false);
              queryClient.invalidateQueries({ queryKey: ['information-assets'] });
            }}
            onCancel={() => setIsImportOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

