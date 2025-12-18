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
import { SoftwareAssetForm } from '@/components/forms/software-asset-form';
import { AssetDependencies } from '@/components/assets/asset-dependencies';
import { AssetAuditTrail } from '@/components/assets/asset-audit-trail';
import { DependencyGraph } from '@/components/assets/dependency-graph';
import { DependencyWarningDialog } from '@/components/assets/dependency-warning-dialog';
import { AssetComplianceTab } from '@/components/assets/asset-compliance-tab';
import { LinkedControlsList } from '@/components/governance/linked-controls-list';
import { AssetLinkedRisks } from '@/components/risks/asset-linked-risks';

export default function SoftwareAssetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const locale = (params.locale as string) || 'en';
  const assetId = params.id as string;

  const { data: software, isLoading, error } = useQuery<any, any>({
    queryKey: ['software-asset', assetId],
    queryFn: () => assetsApi.getSoftwareAsset(assetId),
    enabled: !!assetId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteSoftwareAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['software-assets'] });
      toast({
        title: 'Success',
        description: 'Software asset deleted successfully',
      });
      router.push(`/${locale}/dashboard/assets/software`);
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Failed to delete software asset',
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
            <p className="text-muted-foreground mb-2">Error loading software asset</p>
            <p className="text-sm text-muted-foreground mb-4">
              {error?.response?.data?.message || error?.message || 'Unknown error'}
            </p>
            <Button onClick={() => router.push(`/${locale}/dashboard/assets/software`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Software Assets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!software) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Software asset not found</p>
            <p className="text-sm text-muted-foreground mb-4">Asset ID: {assetId}</p>
            <Button onClick={() => router.push(`/${locale}/dashboard/assets/software`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Software Assets
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
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/assets/software`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{software.softwareName}</h1>
            <p className="text-muted-foreground">{software.softwareIdentifier}</p>
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
          <TabsTrigger value="licensing">Licensing</TabsTrigger>
          <TabsTrigger value="vendor">Vendor</TabsTrigger>
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
                  <p className="text-sm font-medium text-muted-foreground">Software Name</p>
                  <p>{software.softwareName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Identifier</p>
                  <p>{software.softwareIdentifier}</p>
                </div>
                {software.softwareType && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <Badge>{String(software.softwareType).replace('_', ' ')}</Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Criticality</p>
                  {getCriticalityBadge(software.criticalityLevel)}
                </div>
                {software.version && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Version</p>
                    <p>{software.version}</p>
                  </div>
                )}
                {software.patchLevel && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Patch Level</p>
                    <p>{software.patchLevel}</p>
                  </div>
                )}
                {software.description && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{software.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licensing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>License Information</CardTitle>
              <CardDescription>Licensing and usage details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {software.licenseType && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">License Type</p>
                    <p>{software.licenseType}</p>
                  </div>
                )}
                {software.licenseKey && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">License Key</p>
                    <p className="font-mono text-xs break-all">{software.licenseKey}</p>
                  </div>
                )}
                {software.numberOfLicenses !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Licenses</p>
                    <p>{software.numberOfLicenses}</p>
                  </div>
                )}
                {software.licensesInUse !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Licenses In Use</p>
                    <p>{software.licensesInUse}</p>
                  </div>
                )}
                {software.licenseExpiryDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">License Expiry Date</p>
                    <p>{software.licenseExpiryDate}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {software.vendor && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vendor</p>
                    <p>{software.vendor}</p>
                  </div>
                )}
                {software.vendorContact && (
                  <div className="col-span-2 space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Vendor Contact</p>
                    <p>{software.vendorContact.name}</p>
                    {software.vendorContact.email && (
                      <p className="text-sm text-muted-foreground">{software.vendorContact.email}</p>
                    )}
                    {software.vendorContact.phone && (
                      <p className="text-sm text-muted-foreground">{software.vendorContact.phone}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <AssetComplianceTab assetType="software" assetId={assetId} />
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Linked risks show how this software asset is involved in wider risk scenarios. Click a risk entry to
            review full details and assessments.
          </p>
          <AssetLinkedRisks assetType="software" assetId={assetId} />
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <AssetDependencies assetType="software" assetId={assetId} />
        </TabsContent>

        <TabsContent value="graph" className="space-y-4">
          <DependencyGraph assetType="software" assetId={assetId} assetName={software.softwareName} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AssetAuditTrail assetType="software" assetId={assetId} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Software Asset</DialogTitle>
            <DialogDescription>Update the software asset details</DialogDescription>
          </DialogHeader>
          <SoftwareAssetForm
            asset={software}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['software-asset', assetId] });
              queryClient.invalidateQueries({ queryKey: ['software-assets'] });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DependencyWarningDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        assetType="software"
        assetId={assetId}
        assetName={software.softwareName}
        action="delete"
        onConfirm={() => {
          deleteMutation.mutate(software.id);
          setIsDeleteDialogOpen(false);
        }}
        isConfirming={deleteMutation.isPending}
      />
    </div>
  );
}
