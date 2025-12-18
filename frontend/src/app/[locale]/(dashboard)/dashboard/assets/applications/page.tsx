'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Upload, AlertTriangle, Shield, CheckCircle2, XCircle, Clock, CheckSquare, Square } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { BulkOperationsBar } from '@/components/assets/bulk-operations-bar-enhanced';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BusinessApplicationForm } from '@/components/forms/business-application-form';
import { AssetImportWizard } from '@/components/forms/asset-import-wizard';
import { AssetRiskBadge } from '@/components/assets/asset-risk-badge';
import { downloadSampleExcel } from '@/lib/utils/sample-excel-generator';
import { Download } from 'lucide-react';

export default function BusinessApplicationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<any>(null);
  const [filters, setFilters] = useState<any>({
    page: 1,
    limit: 20,
  });
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());

  const { data, isLoading, error } = useQuery({
    queryKey: ['business-applications', filters],
    queryFn: () => assetsApi.getBusinessApplications(filters),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteBusinessApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-applications'] });
      toast({
        title: 'Success',
        description: 'Application deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete application',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      deleteMutation.mutate(id);
    }
  };

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
      setSelectedAssets(new Set(data.data.map((a: any) => a.id)));
    }
  }, [data?.data, selectedAssets.size]);

  const clearSelection = useCallback(() => {
    setSelectedAssets(new Set());
  }, []);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    await Promise.all(ids.map((id) => assetsApi.deleteBusinessApplication(id)));
    queryClient.invalidateQueries({ queryKey: ['business-applications'] });
    clearSelection();
  }, [queryClient, clearSelection]);

  const getSecurityTestStatus = (app: any) => {
    if (!app.lastSecurityTestDate) {
      return { status: 'no-test', label: 'No Test', icon: Clock, variant: 'secondary' as const };
    }
    const testDate = new Date(app.lastSecurityTestDate);
    const daysSince = Math.floor((Date.now() - testDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince > 365) {
      return { status: 'overdue', label: 'Overdue', icon: AlertTriangle, variant: 'destructive' as const };
    }
    
    const severity = app.securityTestResults?.severity?.toLowerCase() || '';
    if (severity === 'critical' || severity === 'high' || severity === 'failed') {
      return { status: 'failed', label: 'Failed', icon: XCircle, variant: 'destructive' as const };
    }
    
    return { status: 'passed', label: 'Passed', icon: CheckCircle2, variant: 'default' as const };
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    console.error('Error loading business applications:', error);
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error loading applications: {error instanceof Error ? error.message : 'Unknown error'}</p>
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
          <h1
            className="text-3xl font-bold"
            data-testid="assets-business-app-title"
          >
            Business Applications
          </h1>
          <p className="text-muted-foreground">Manage your business applications and services</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            data-testid="assets-business-app-new-asset-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      <DataTableFilters
        searchValue={filters.search || ''}
        onSearchChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
        filters={[
          {
            key: 'applicationType',
            label: 'Type',
            value: filters.applicationType || '',
            options: [
              { value: '', label: 'All' },
              { value: 'web_application', label: 'Web Application' },
              { value: 'mobile_app', label: 'Mobile App' },
              { value: 'desktop_app', label: 'Desktop App' },
              { value: 'api_service', label: 'API Service' },
              { value: 'database', label: 'Database' },
              { value: 'cloud_service', label: 'Cloud Service' },
              { value: 'other', label: 'Other' },
            ],
            onChange: (value) => setFilters({ ...filters, applicationType: value, page: 1 }),
          },
          {
            key: 'status',
            label: 'Status',
            value: filters.status || '',
            options: [
              { value: '', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'deprecated', label: 'Deprecated' },
              { value: 'planned', label: 'Planned' },
            ],
            onChange: (value) => setFilters({ ...filters, status: value, page: 1 }),
          },
          {
            key: 'criticalityLevel',
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
          {
            key: 'missingVersion',
            label: 'Version Status',
            value: filters.missingVersion ? 'true' : '',
            options: [
              { value: '', label: 'All' },
              { value: 'true', label: 'Missing Version' },
            ],
            onChange: (value) => setFilters({ ...filters, missingVersion: value === 'true', page: 1 }),
          },
          {
            key: 'missingPatch',
            label: 'Patch Status',
            value: filters.missingPatch ? 'true' : '',
            options: [
              { value: '', label: 'All' },
              { value: 'true', label: 'Missing Patch' },
            ],
            onChange: (value) => setFilters({ ...filters, missingPatch: value === 'true', page: 1 }),
          },
          {
            key: 'securityTestStatus',
            label: 'Security Test Status',
            value: filters.securityTestStatus || '',
            options: [
              { value: '', label: 'All' },
              { value: 'no-test', label: 'No Test' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'failed', label: 'Failed' },
              { value: 'passed', label: 'Passed' },
            ],
            onChange: (value) => setFilters({ ...filters, securityTestStatus: value, page: 1 }),
          },
        ]}
      />

      {data?.data && data.data.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{data.data.length}</div>
              <p className="text-xs text-muted-foreground">Total Applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {data.data.filter((app: any) => app.versionNumber).length}
              </div>
              <p className="text-xs text-muted-foreground">With Version</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {data.data.filter((app: any) => app.patchLevel).length}
              </div>
              <p className="text-xs text-muted-foreground">With Patch Level</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-destructive">
                {data.data.filter((app: any) => !app.versionNumber || !app.patchLevel).length}
              </div>
              <p className="text-xs text-muted-foreground">Outdated (Missing Info)</p>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedAssets.size > 0 && (
        <BulkOperationsBar
          selectedCount={selectedAssets.size}
          selectedItems={data?.data.filter((a: any) => selectedAssets.has(a.id)) || []}
          onClearSelection={clearSelection}
          onDelete={handleBulkDelete}
          onUpdate={() => {
            queryClient.invalidateQueries({ queryKey: ['business-applications'] });
            clearSelection();
          }}
          assetType="application"
        />
      )}

      {data?.data && data.data.length > 0 ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSelectAll}
            >
              {selectedAssets.size === data.data.length ? (
                <>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Deselect All
                </>
              ) : (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Select All
                </>
              )}
            </Button>
            <span className="text-sm text-muted-foreground">
              {selectedAssets.size} of {data.data.length} selected
            </span>
          </div>
          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            data-testid="assets-business-app-list"
          >
            {data.data.map((app: any) => (
              <Card key={app.id} className={selectedAssets.has(app.id) ? 'ring-2 ring-primary' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Checkbox
                          checked={selectedAssets.has(app.id)}
                          onCheckedChange={() => toggleAssetSelection(app.id)}
                          className="mr-1"
                        />
                        <CardTitle className="text-lg">{app.applicationName}</CardTitle>
                        {(!app.versionNumber || !app.patchLevel) && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Outdated
                          </Badge>
                        )}
                        {(() => {
                          const testStatus = getSecurityTestStatus(app);
                          if (testStatus.status !== 'no-test') {
                            const Icon = testStatus.icon;
                            return (
                              <Badge variant={testStatus.variant} className="flex items-center gap-1">
                                <Icon className="h-3 w-3" />
                                {testStatus.label}
                              </Badge>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      <CardDescription>{app.uniqueIdentifier}</CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        {app.versionNumber ? (
                          <Badge variant="outline" className="font-mono">
                            v{app.versionNumber}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            No Version
                          </Badge>
                        )}
                        {app.patchLevel ? (
                          <Badge variant="outline" className="font-mono">
                            Patch {app.patchLevel}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            No Patch
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {app.status && <Badge variant="outline">{app.status}</Badge>}
                      <AssetRiskBadge 
                        assetId={app.id} 
                        assetType="application" 
                        riskCount={(app as any).riskCount}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Type:</span>{' '}
                      {app.applicationType ? (
                        <Badge variant="secondary">{app.applicationType.replace('_', ' ')}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                    {app.vendor && (
                      <div>
                        <span className="font-medium">Vendor:</span> {app.vendor}
                      </div>
                    )}
                    {app.ownerName && (
                      <div>
                        <span className="font-medium">Owner:</span> {app.ownerName}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Criticality:</span>{' '}
                      <Badge variant="secondary">{app.criticalityLevel}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/en/dashboard/assets/applications/${app.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingApp(app)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(app.id)}
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
            <p className="text-muted-foreground">No business applications found</p>
            <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Application
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCreateOpen || !!editingApp} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingApp(null);
        }
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingApp ? 'Edit' : 'Create'} Business Application</DialogTitle>
            <DialogDescription>
              {editingApp ? 'Update the application details' : 'Add a new business application to the system'}
            </DialogDescription>
          </DialogHeader>
          <BusinessApplicationForm
            application={editingApp || undefined}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingApp(null);
              queryClient.invalidateQueries({ queryKey: ['business-applications'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingApp(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Business Applications</DialogTitle>
            <DialogDescription>
              Import business applications from a CSV or Excel file. Follow the steps to map fields and preview data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await downloadSampleExcel('application');
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
            assetType="application"
            onSuccess={() => {
              setIsImportOpen(false);
              queryClient.invalidateQueries({ queryKey: ['business-applications'] });
            }}
            onCancel={() => setIsImportOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

