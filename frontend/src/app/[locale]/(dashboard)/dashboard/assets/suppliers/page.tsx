'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SupplierForm } from '@/components/forms/supplier-form';
import { AssetImportWizard } from '@/components/forms/asset-import-wizard';
import { AssetRiskBadge } from '@/components/assets/asset-risk-badge';
import { downloadSampleExcel } from '@/lib/utils/sample-excel-generator';
import { Download } from 'lucide-react';

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic';

export default function SuppliersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [filters, setFilters] = useState<any>({
    page: 1,
    limit: 20,
  });
  // Track when component has mounted on client to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // #region agent log
  const isWindowDefined = typeof window !== 'undefined';
  const queryEnabled = mounted; // Only enable query after mount to prevent hydration mismatch
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'suppliers/page.tsx:48',message:'Component render - mount state',data:{mounted,isWindowDefined,queryEnabled},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  }, [mounted, isWindowDefined, queryEnabled]);
  useEffect(() => {
    setMounted(true);
    fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'suppliers/page.tsx:50',message:'Component mounted on client',data:{mounted:true},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  }, []);
  // #endregion

  const { data, isLoading, error } = useQuery({
    queryKey: ['suppliers', filters],
    queryFn: () => assetsApi.getSuppliers(filters),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: mounted, // Only enable query after mount to prevent hydration mismatch
  });

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'suppliers/page.tsx:62',message:'Query state after useQuery',data:{isLoading,hasData:!!data,dataLength:data?.data?.length,error:!!error,enabled:mounted},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A,B'})}).catch(()=>{});
  }, [isLoading, data, error, mounted]);
  useEffect(() => {
    if (data?.data) {
      fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'suppliers/page.tsx:66',message:'Rendering supplier cards list',data:{supplierCount:data.data.length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'E'})}).catch(()=>{});
    }
  }, [data?.data]);
  // #endregion

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: 'Success',
        description: 'Supplier deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete supplier',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      deleteMutation.mutate(id);
    }
  };

  if (error) {
    console.error('Error loading suppliers:', error);
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error loading suppliers: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // #region agent log
  const renderPath = !mounted ? 'ssr' : (isLoading ? 'loading' : (!data?.data || data.data.length === 0) ? 'empty' : 'data');
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'suppliers/page.tsx:90',message:'Render path decision',data:{renderPath,mounted,isLoading,hasData:!!data?.data,dataLength:data?.data?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B,E'})}).catch(()=>{});
  }, [renderPath, mounted, isLoading, data]);
  // #endregion

  // Render consistent fallback during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="p-6 space-y-6">
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {isLoading && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      )}
      {!isLoading && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Suppliers</h1>
              <p className="text-muted-foreground">Manage your third-party suppliers and vendors</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Supplier
              </Button>
            </div>
          </div>

          <DataTableFilters
        searchValue={filters.search || ''}
        onSearchChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
        filters={[
          {
            label: 'Type',
            value: filters.supplierType || '',
            options: [
              { value: '', label: 'All' },
              { value: 'vendor', label: 'Vendor' },
              { value: 'consultant', label: 'Consultant' },
              { value: 'service_provider', label: 'Service Provider' },
              { value: 'contractor', label: 'Contractor' },
              { value: 'partner', label: 'Partner' },
              { value: 'other', label: 'Other' },
            ],
            onChange: (value) => setFilters({ ...filters, supplierType: value, page: 1 }),
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
            {data.data.map((supplier: any) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{supplier.supplierName}</CardTitle>
                      <CardDescription>{supplier.supplierIdentifier}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {supplier.supplierType && (
                        <Badge variant="outline">{supplier.supplierType.replace('_', ' ')}</Badge>
                      )}
                      <AssetRiskBadge 
                        assetId={supplier.id} 
                        assetType="supplier" 
                        riskCount={(supplier as any).riskCount}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {supplier.primaryContactName && (
                      <div>
                        <span className="font-medium">Contact:</span> {supplier.primaryContactName}
                      </div>
                    )}
                    {supplier.primaryContactEmail && (
                      <div>
                        <span className="font-medium">Email:</span> {supplier.primaryContactEmail}
                      </div>
                    )}
                    {supplier.country && (
                      <div>
                        <span className="font-medium">Country:</span> {supplier.country}
                      </div>
                    )}
                    {supplier.contractReference && (
                      <div>
                        <span className="font-medium">Contract:</span> {supplier.contractReference}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Criticality:</span>{' '}
                      <Badge variant="secondary">{supplier.criticalityLevel}</Badge>
                    </div>
                    {supplier.hasDataAccess && (
                      <div>
                        <Badge variant="destructive">Has Data Access</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/en/dashboard/assets/suppliers/${supplier.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingSupplier(supplier)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(supplier.id)}
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
            <p className="text-muted-foreground">No suppliers found</p>
            <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Supplier
            </Button>
            </CardContent>
          </Card>
          )}
        </>
      )}

      <Dialog open={isCreateOpen || !!editingSupplier} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingSupplier(null);
        }
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? 'Edit' : 'Create'} Supplier</DialogTitle>
            <DialogDescription>
              {editingSupplier ? 'Update the supplier details' : 'Add a new supplier to the system'}
            </DialogDescription>
          </DialogHeader>
          <SupplierForm
            supplier={editingSupplier || undefined}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingSupplier(null);
              queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingSupplier(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Suppliers</DialogTitle>
            <DialogDescription>
              Import suppliers from a CSV or Excel file. Follow the steps to map fields and preview data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await downloadSampleExcel('supplier');
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
            assetType="supplier"
            onSuccess={() => {
              setIsImportOpen(false);
              queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            }}
            onCancel={() => setIsImportOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

