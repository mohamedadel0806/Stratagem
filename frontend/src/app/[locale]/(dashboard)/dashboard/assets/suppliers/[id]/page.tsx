'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SupplierForm } from '@/components/forms/supplier-form';
import { AssetDependencies } from '@/components/assets/asset-dependencies';
import { AssetAuditTrail } from '@/components/assets/asset-audit-trail';
import { DependencyGraph } from '@/components/assets/dependency-graph';
import { DependencyWarningDialog } from '@/components/assets/dependency-warning-dialog';
import { AssetComplianceTab } from '@/components/assets/asset-compliance-tab';
import { LinkedControlsList } from '@/components/governance/linked-controls-list';
import { AssetLinkedRisks } from '@/components/risks/asset-linked-risks';

export default function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const locale = (params.locale as string) || 'en';
  const assetId = params.id as string;

  const { data: supplier, isLoading, error } = useQuery<any, any>({
    queryKey: ['supplier', assetId],
    queryFn: () => assetsApi.getSupplier(assetId),
    enabled: !!assetId,
  });

  const formatDisplayValue = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if (value.name && value.code) return `${value.name} (${value.code})`;
      if (value.name) return value.name;
      if (value.firstName || value.lastName) {
        return [value.firstName, value.lastName].filter(Boolean).join(' ');
      }
      if (value.email) return value.email;
      if (value.code) return value.code;
      if (value.id) return value.id;
    }
    return String(value);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: 'Success',
        description: 'Supplier deleted successfully',
      });
      router.push(`/${locale}/dashboard/assets/suppliers`);
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Failed to delete supplier',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-2">Error loading supplier</p>
            <p className="text-sm text-muted-foreground mb-4">
              {error?.response?.data?.message || error?.message || 'Unknown error'}
            </p>
            <Button onClick={() => router.push(`/${locale}/dashboard/assets/suppliers`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Suppliers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Supplier not found</p>
            <p className="text-sm text-muted-foreground mb-4">Supplier ID: {assetId}</p>
            <Button onClick={() => router.push(`/${locale}/dashboard/assets/suppliers`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Suppliers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getCriticalityBadge = (level: string | undefined) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    const cls = level ? colors[level] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800';
    return <Badge className={cls}>{level || 'Unknown'}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/assets/suppliers`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{supplier.supplierName}</h1>
            <p className="text-muted-foreground">{supplier.supplierIdentifier}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
          <TabsTrigger value="contract">Contract Details</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="graph">Graph View</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supplier Name</p>
                  <p>{supplier.supplierName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Identifier</p>
                  <p>{supplier.supplierIdentifier}</p>
                </div>
                {supplier.supplierType && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <Badge>{String(supplier.supplierType).replace('_', ' ')}</Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Criticality</p>
                  {getCriticalityBadge(supplier.criticalityLevel)}
                </div>
                {supplier.businessUnit && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Business Unit</p>
                    <p>{formatDisplayValue(supplier.businessUnit)}</p>
                  </div>
                )}
                {supplier.goodsOrServicesProvided && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Goods/Services Provided</p>
                    <p>{supplier.goodsOrServicesProvided}</p>
                  </div>
                )}
                {supplier.description && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{supplier.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Primary Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {supplier.primaryContactName && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Name</p>
                    <p>{supplier.primaryContactName}</p>
                  </div>
                )}
                {supplier.primaryContactEmail && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <a href={`mailto:${supplier.primaryContactEmail}`} className="text-blue-600 hover:underline">
                      {supplier.primaryContactEmail}
                    </a>
                  </div>
                )}
                {supplier.primaryContactPhone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p>{supplier.primaryContactPhone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {supplier.address && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Street Address</p>
                    <p>{supplier.address}</p>
                  </div>
                )}
                {supplier.city && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">City</p>
                    <p>{supplier.city}</p>
                  </div>
                )}
                {supplier.country && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Country</p>
                    <p>{supplier.country}</p>
                  </div>
                )}
                {supplier.postalCode && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Postal Code</p>
                    <p>{supplier.postalCode}</p>
                  </div>
                )}
                {supplier.website && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Website</p>
                    <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {supplier.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contract" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {supplier.contractStatus && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Contract Status</p>
                  <Badge
                    variant={
                      supplier.contractStatus === 'expired'
                        ? 'destructive'
                        : supplier.contractStatus === 'pending_renewal'
                        ? 'default'
                        : supplier.contractStatus === 'active'
                        ? 'default'
                        : 'secondary'
                    }
                    className={
                      supplier.contractStatus === 'expired'
                        ? 'bg-red-100 text-red-800'
                        : supplier.contractStatus === 'pending_renewal'
                        ? 'bg-yellow-100 text-yellow-800'
                        : supplier.contractStatus === 'active'
                        ? 'bg-green-100 text-green-800'
                        : ''
                    }
                  >
                    {supplier.contractStatus === 'expired'
                      ? 'Expired'
                      : supplier.contractStatus === 'pending_renewal'
                      ? 'Pending Renewal'
                      : supplier.contractStatus === 'active'
                      ? 'Active'
                      : 'No Contract'}
                  </Badge>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {supplier.contractReference && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contract Reference</p>
                    <p>{supplier.contractReference}</p>
                  </div>
                )}
                {supplier.contractStartDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contract Start Date</p>
                    <p>{new Date(supplier.contractStartDate).toLocaleDateString()}</p>
                  </div>
                )}
                {supplier.contractEndDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contract End Date</p>
                    <p>{new Date(supplier.contractEndDate).toLocaleDateString()}</p>
                    {supplier.contractEndDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.ceil((new Date(supplier.contractEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                      </p>
                    )}
                  </div>
                )}
                {supplier.autoRenewal !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Auto Renewal</p>
                    <p>{supplier.autoRenewal ? 'Yes' : 'No'}</p>
                  </div>
                )}
                {supplier.contractValue && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contract Value</p>
                    <p>
                      {supplier.currency || 'USD'} {supplier.contractValue.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <AssetComplianceTab assetType="supplier" assetId={assetId} />
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <AssetLinkedRisks assetType="supplier" assetId={assetId} />
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <AssetDependencies assetType="supplier" assetId={assetId} />
        </TabsContent>

        <TabsContent value="graph" className="space-y-4">
          <DependencyGraph assetType="supplier" assetId={assetId} assetName={supplier.supplierName} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AssetAuditTrail assetType="supplier" assetId={assetId} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update the supplier details</DialogDescription>
          </DialogHeader>
          <SupplierForm
            asset={supplier}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['supplier', assetId] });
              queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DependencyWarningDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        assetType="supplier"
        assetId={assetId}
        assetName={supplier.supplierName}
        action="delete"
        onConfirm={() => {
          deleteMutation.mutate(supplier.id);
          setIsDeleteDialogOpen(false);
        }}
        isConfirming={deleteMutation.isPending}
      />
    </div>
  );
}
