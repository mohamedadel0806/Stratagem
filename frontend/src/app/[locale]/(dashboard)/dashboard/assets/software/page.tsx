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
import { SoftwareAssetForm } from '@/components/forms/software-asset-form';
import { AssetImportWizard } from '@/components/forms/asset-import-wizard';
import { AssetRiskBadge } from '@/components/assets/asset-risk-badge';
import { downloadSampleExcel } from '@/lib/utils/sample-excel-generator';
import { Download } from 'lucide-react';

export default function SoftwareAssetsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingSoftware, setEditingSoftware] = useState<any>(null);
  const [filters, setFilters] = useState<any>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['software-assets', filters],
    queryFn: () => assetsApi.getSoftwareAssets(filters),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteSoftwareAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['software-assets'] });
      toast({
        title: 'Success',
        description: 'Software asset deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete software asset',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this software asset?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    console.error('Error loading software assets:', error);
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
          <h1 className="text-3xl font-bold">Software Assets</h1>
          <p className="text-muted-foreground">Manage your software licenses and installations</p>
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
            label: 'Type',
            value: filters.softwareType || '',
            options: [
              { value: '', label: 'All' },
              { value: 'operating_system', label: 'Operating System' },
              { value: 'application_software', label: 'Application Software' },
              { value: 'development_tool', label: 'Development Tool' },
              { value: 'database_software', label: 'Database Software' },
              { value: 'security_software', label: 'Security Software' },
              { value: 'utility', label: 'Utility' },
              { value: 'other', label: 'Other' },
            ],
            onChange: (value) => setFilters({ ...filters, softwareType: value, page: 1 }),
          },
          {
            label: 'Criticality',
            value: filters.criticalityLevel || '',
            options: [
              { value: '', label: 'All' },
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ],
            onChange: (value) => setFilters({ ...filters, criticalityLevel: value, page: 1 }),
          },
        ]}
      />

      {data?.data && data.data.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((software: any) => (
              <Card key={software.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{software.softwareName}</CardTitle>
                      <CardDescription>{software.softwareIdentifier}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {software.softwareType && (
                        <Badge variant="outline">{software.softwareType.replace('_', ' ')}</Badge>
                      )}
                      <AssetRiskBadge 
                        assetId={software.id} 
                        assetType="software" 
                        riskCount={(software as any).riskCount}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {software.version && (
                      <div>
                        <span className="font-medium">Version:</span> {software.version}
                      </div>
                    )}
                    {software.vendor && (
                      <div>
                        <span className="font-medium">Vendor:</span> {software.vendor}
                      </div>
                    )}
                    {software.licenseType && (
                      <div>
                        <span className="font-medium">License:</span> {software.licenseType}
                      </div>
                    )}
                    {software.numberOfLicenses && (
                      <div>
                        <span className="font-medium">Licenses:</span> {software.licensesInUse || 0} / {software.numberOfLicenses}
                      </div>
                    )}
                    {software.ownerName && (
                      <div>
                        <span className="font-medium">Owner:</span> {software.ownerName}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Criticality:</span>{' '}
                      <Badge variant="secondary">{software.criticalityLevel}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/en/dashboard/assets/software/${software.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingSoftware(software)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(software.id)}
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
            <p className="text-muted-foreground">No software assets found</p>
            <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Software Asset
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCreateOpen || !!editingSoftware} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingSoftware(null);
        }
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSoftware ? 'Edit' : 'Create'} Software Asset</DialogTitle>
            <DialogDescription>
              {editingSoftware ? 'Update the software asset details' : 'Add a new software asset to the system'}
            </DialogDescription>
          </DialogHeader>
          <SoftwareAssetForm
            software={editingSoftware || undefined}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingSoftware(null);
              queryClient.invalidateQueries({ queryKey: ['software-assets'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingSoftware(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Software Assets</DialogTitle>
            <DialogDescription>
              Import software assets from a CSV or Excel file. Follow the steps to map fields and preview data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await downloadSampleExcel('software');
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
            assetType="software"
            onSuccess={() => {
              setIsImportOpen(false);
              queryClient.invalidateQueries({ queryKey: ['software-assets'] });
            }}
            onCancel={() => setIsImportOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

