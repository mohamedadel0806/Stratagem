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
import { InformationAssetForm } from '@/components/forms/information-asset-form';
import { AssetDependencies } from '@/components/assets/asset-dependencies';
import { AssetAuditTrail } from '@/components/assets/asset-audit-trail';
import { DependencyGraph } from '@/components/assets/dependency-graph';
import { DependencyWarningDialog } from '@/components/assets/dependency-warning-dialog';
import { AssetComplianceTab } from '@/components/assets/asset-compliance-tab';
import { LinkedControlsList } from '@/components/governance/linked-controls-list';
import { AssetLinkedRisks } from '@/components/risks/asset-linked-risks';

export default function InformationAssetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const assetId = params.id as string;

  const { data: asset, isLoading } = useQuery({
    queryKey: ['information-asset', assetId],
    queryFn: () => assetsApi.getInformationAsset(assetId),
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
    mutationFn: (id: string) => assetsApi.deleteInformationAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['information-assets'] });
      toast({
        title: 'Success',
        description: 'Asset deleted successfully',
      });
      router.push('/en/dashboard/assets/information');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete asset',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!asset) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Asset not found</p>
            <Button onClick={() => router.push('/en/dashboard/assets/information')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/en/dashboard/assets/information')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{asset.assetName}</h1>
            <p className="text-muted-foreground">{asset.assetIdentifier}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)} data-testid="asset-edit-button">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            data-testid="asset-delete-button"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="classification" data-testid="tab-classification">Classification</TabsTrigger>
          <TabsTrigger value="ownership" data-testid="tab-ownership">Ownership</TabsTrigger>
          <TabsTrigger value="compliance" data-testid="tab-compliance">Compliance</TabsTrigger>
          <TabsTrigger value="controls" data-testid="tab-controls">Controls</TabsTrigger>
          <TabsTrigger value="risks" data-testid="tab-risks">Risks</TabsTrigger>
          <TabsTrigger value="dependencies" data-testid="tab-dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="graph" data-testid="tab-graph">Graph View</TabsTrigger>
          <TabsTrigger value="audit" data-testid="tab-audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Asset Name</p>
                  <p>{asset.assetName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Identifier</p>
                  <p>{asset.assetIdentifier}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data Classification</p>
                  <Badge>{asset.dataClassification}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Criticality</p>
                  <Badge variant="secondary">{asset.criticalityLevel}</Badge>
                </div>
                {asset.description && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{asset.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Classification</p>
                  <Badge>{asset.dataClassification}</Badge>
                </div>
                {asset.classificationDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Classification Date</p>
                    <p>{asset.classificationDate}</p>
                  </div>
                )}
                {asset.reclassificationDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reclassification Date</p>
                    <p>{asset.reclassificationDate}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contains PII</p>
                  <Badge variant={asset.containsPII ? 'destructive' : 'secondary'}>
                    {asset.containsPII ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contains PHI</p>
                  <Badge variant={asset.containsPHI ? 'destructive' : 'secondary'}>
                    {asset.containsPHI ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contains Financial Data</p>
                  <Badge variant={asset.containsFinancialData ? 'destructive' : 'secondary'}>
                    {asset.containsFinancialData ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contains IP</p>
                  <Badge variant={asset.containsIntellectualProperty ? 'destructive' : 'secondary'}>
                    {asset.containsIntellectualProperty ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ownership" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ownership & Business Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(asset.ownerName || (asset as any).owner) && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Owner</p>
                    <p>{formatDisplayValue(asset.ownerName || (asset as any).owner)}</p>
                  </div>
                )}
                {(asset.custodianName || (asset as any).custodian) && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Custodian</p>
                    <p>{formatDisplayValue(asset.custodianName || (asset as any).custodian)}</p>
                  </div>
                )}
                {(asset.businessUnit || (asset as any).businessUnitId) && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Business Unit</p>
                    <p>{formatDisplayValue(asset.businessUnit || (asset as any).businessUnitId)}</p>
                  </div>
                )}
                {(asset as any).department && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p>{formatDisplayValue((asset as any).department)}</p>
                  </div>
                )}
                {asset.storageLocation && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Storage Location</p>
                    <p>{asset.storageLocation}</p>
                  </div>
                )}
                {asset.storageType && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Storage Type</p>
                    <p>{asset.storageType}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {/* Retention Information */}
          <Card>
            <CardHeader>
              <CardTitle>Retention Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {asset.retentionPolicy && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Retention Policy</p>
                  <p>{asset.retentionPolicy}</p>
                </div>
              )}
              {asset.retentionExpiryDate && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Retention Expiry Date</p>
                  <p>{asset.retentionExpiryDate}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compliance Assessment */}
          <AssetComplianceTab assetType="information" assetId={assetId} />
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <LinkedControlsList assetType="information" assetId={assetId} />
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <AssetDependencies assetType="information" assetId={assetId} />
        </TabsContent>

        <TabsContent value="graph" className="space-y-4">
          <DependencyGraph 
            assetType="information" 
            assetId={assetId} 
            assetName={asset.assetName}
          />
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Linked risks provide context for how this information asset is used in risk assessments. Click a risk
            to open full details in the risk module.
          </p>
          <AssetLinkedRisks assetType="information" assetId={assetId} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AssetAuditTrail assetType="information" assetId={assetId} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Information Asset</DialogTitle>
            <DialogDescription>Update the information asset details</DialogDescription>
          </DialogHeader>
          <InformationAssetForm
            asset={asset}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['information-asset', assetId] });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DependencyWarningDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        assetType="information"
        assetId={assetId}
        assetName={asset.assetName}
        action="delete"
        onConfirm={() => {
          deleteMutation.mutate(asset.id);
          setIsDeleteDialogOpen(false);
        }}
        isConfirming={deleteMutation.isPending}
      />
    </div>
  );
}

