'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi, PhysicalAsset } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowLeft, Download } from 'lucide-react';
import { generateAssetDetailPDF } from '@/lib/utils/pdf-export';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { PhysicalAssetForm } from '@/components/forms/physical-asset-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetDependencies } from '@/components/assets/asset-dependencies';
import { AssetAuditTrail } from '@/components/assets/asset-audit-trail';
import { DependencyGraph } from '@/components/assets/dependency-graph';
import { DependencyWarningDialog } from '@/components/assets/dependency-warning-dialog';
import { AssetComplianceTab } from '@/components/assets/asset-compliance-tab';
import { LinkedControlsList } from '@/components/governance/linked-controls-list';
import { AssetLinkedRisks } from '@/components/risks/asset-linked-risks';

export default function PhysicalAssetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const locale = (params.locale as string) || 'en';
  const assetId = params.id as string;

  const { data: asset, isLoading, error } = useQuery<PhysicalAsset, any>({
    queryKey: ['physical-asset', assetId],
    queryFn: async () => {
      console.log('Fetching physical asset with ID:', assetId);
      try {
        const result = await assetsApi.getPhysicalAsset(assetId);
        return result;
      } catch (err: any) {
        console.error('Error fetching physical asset:', err);
        toast({
          title: 'Error',
          description: err.response?.data?.message || err.message || 'Failed to load asset',
          variant: 'destructive',
        });
        throw err;
      }
    },
    enabled: !!assetId,
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deletePhysicalAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['physical-assets'] });
      toast({
        title: 'Success',
        description: 'Asset deleted successfully',
      });
      router.push(`/${locale}/dashboard/assets/physical`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete asset',
        variant: 'destructive',
      });
    },
  });

  const getTypeColor = (type: PhysicalAsset['assetType']) => {
    const typeStr = typeof type === 'string' ? type : type?.name || 'other';
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
    return colors[typeStr] || colors.other;
  };

  const getTypeDisplay = (type: PhysicalAsset['assetType']) => {
    if (typeof type === 'string') {
      return type.replace('_', ' ');
    }
    if (typeof type === 'object' && type !== null && 'name' in type) {
      return (type as any).name || (type as any).code || 'other';
    }
    return 'other';
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

  const handleExportPDF = () => {
    if (!asset) return;
    
    const sections = [
      {
        title: 'Basic Information',
        fields: [
          { label: 'Asset Type', value: getTypeDisplay(asset.assetType) },
          { label: 'Manufacturer', value: asset.manufacturer || '' },
          { label: 'Model', value: asset.model || '' },
          { label: 'Serial Number', value: asset.serialNumber || '' },
          { label: 'Vendor', value: asset.vendor || '' },
        ],
      },
      {
        title: 'Location & Network',
        fields: [
          { label: 'Location', value: asset.location || '' },
          { label: 'Building', value: asset.building || '' },
          { label: 'Room', value: asset.room || '' },
          { label: 'IP Addresses', value: asset.ipAddresses?.join(', ') || '' },
          { label: 'MAC Addresses', value: asset.macAddresses?.join(', ') || '' },
          { label: 'Connectivity Status', value: asset.connectivityStatus || '' },
          { label: 'Network Approval', value: asset.networkApprovalStatus || '' },
        ],
      },
      {
        title: 'Ownership',
        fields: [
          { label: 'Owner', value: asset.ownerName || '' },
          { label: 'Business Unit', value: asset.businessUnit || '' },
          { label: 'Department', value: asset.department || '' },
        ],
      },
      {
        title: 'Compliance & Security',
        fields: [
          { label: 'Criticality Level', value: asset.criticalityLevel || '' },
          { label: 'Data Classification', value: asset.dataClassification || '' },
          { label: 'Compliance Requirements', value: asset.complianceRequirements?.join(', ') || '' },
        ],
      },
      {
        title: 'Dates',
        fields: [
          { label: 'Purchase Date', value: asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : '' },
          { label: 'Warranty Expiry', value: asset.warrantyExpiryDate ? new Date(asset.warrantyExpiryDate).toLocaleDateString() : '' },
          { label: 'Created', value: asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : '' },
          { label: 'Last Updated', value: asset.updatedAt ? new Date(asset.updatedAt).toLocaleDateString() : '' },
        ],
      },
    ];

    generateAssetDetailPDF(
      { ...asset, assetName: asset.assetDescription },
      'physical',
      sections
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading asset...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-2">Error loading asset</p>
            <p className="text-sm text-muted-foreground mb-4">
              {(error as any)?.response?.data?.message || (error as any)?.message || 'Unknown error'}
            </p>
            <Button onClick={() => router.push(`/${locale}/dashboard/assets/physical`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Asset not found</p>
            <p className="text-sm text-muted-foreground mb-4">Asset ID: {assetId}</p>
            <Button onClick={() => router.push(`/${locale}/dashboard/assets/physical`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/assets/physical`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{asset.assetDescription}</h1>
            <p className="text-muted-foreground mt-1">{asset.assetIdentifier}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
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

      <div className="flex flex-wrap gap-2 mb-6">
        <Badge className={getTypeColor(asset.assetType)}>
          {getTypeDisplay(asset.assetType)}
        </Badge>
        <Badge className={getCriticalityColor(asset.criticalityLevel)}>
          {asset.criticalityLevel}
        </Badge>
        <Badge variant="outline">{asset.connectivityStatus}</Badge>
        {asset.networkApprovalStatus !== 'not_required' && (
          <Badge variant="outline">Network: {asset.networkApprovalStatus}</Badge>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="location">Location & Network</TabsTrigger>
          <TabsTrigger value="ownership">Ownership</TabsTrigger>
          <TabsTrigger value="compliance">Compliance & Security</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="graph">Graph View</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Asset Type:</span>
                  <p>{getTypeDisplay(asset.assetType)}</p>
                </div>
                {asset.manufacturer && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Manufacturer:</span>
                    <p>{asset.manufacturer}</p>
                  </div>
                )}
                {asset.model && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Model:</span>
                    <p>{asset.model}</p>
                  </div>
                )}
                {asset.serialNumber && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Serial Number:</span>
                    <p>{asset.serialNumber}</p>
                  </div>
                )}
                {asset.vendor && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Vendor:</span>
                    <p>{asset.vendor}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {asset.purchaseDate && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Purchase Date:</span>
                    <p>{new Date(asset.purchaseDate).toLocaleDateString()}</p>
                  </div>
                )}
                {asset.warrantyExpiryDate && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Warranty Expiry:</span>
                    <p>{new Date(asset.warrantyExpiryDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Created:</span>
                  <p>{new Date(asset.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Last Updated:</span>
                  <p>{new Date(asset.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {asset.location && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Location:</span>
                  <p>{asset.location}</p>
                </div>
              )}
              {asset.building && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Building:</span>
                  <p>{asset.building}</p>
                </div>
              )}
              {asset.floor && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Floor:</span>
                  <p>{asset.floor}</p>
                </div>
              )}
              {asset.room && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Room:</span>
                  <p>{asset.room}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Connectivity Status:</span>
                <p>{asset.connectivityStatus}</p>
              </div>
              {asset.ipAddresses && asset.ipAddresses.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">IP Addresses:</span>
                  <p>{asset.ipAddresses.join(', ')}</p>
                </div>
              )}
              {asset.macAddresses && asset.macAddresses.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">MAC Addresses:</span>
                  <p>{asset.macAddresses.join(', ')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ownership" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ownership & Business Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {asset.ownerName && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Owner:</span>
                  <p>{asset.ownerName}</p>
                </div>
              )}
              {asset.businessUnit && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Business Unit:</span>
                  <p>{asset.businessUnit}</p>
                </div>
              )}
              {asset.department && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Department:</span>
                  <p>{asset.department}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-muted-foreground">Criticality Level:</span>
                <p>{asset.criticalityLevel}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {/* Security Information */}
          <Card>
            <CardHeader>
              <CardTitle>Security Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {asset.dataClassification && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Data Classification:</span>
                  <p>{asset.dataClassification}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-muted-foreground">Data Types:</span>
                <div className="flex gap-2 mt-1">
                  {asset.containsPII && <Badge>PII</Badge>}
                  {asset.containsPHI && <Badge>PHI</Badge>}
                  {asset.containsFinancialData && <Badge>Financial Data</Badge>}
                  {!asset.containsPII && !asset.containsPHI && !asset.containsFinancialData && (
                    <span className="text-sm text-muted-foreground">None specified</span>
                  )}
                </div>
              </div>
              {asset.complianceRequirements && asset.complianceRequirements.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Linked Frameworks:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {asset.complianceRequirements.map((req) => (
                      <Badge key={req} variant="outline">{req}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compliance Assessment */}
          <AssetComplianceTab assetType="physical" assetId={assetId} />
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <LinkedControlsList assetType="physical" assetId={assetId} />
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <AssetDependencies assetType="physical" assetId={assetId} />
        </TabsContent>

        <TabsContent value="graph" className="space-y-4">
          <DependencyGraph 
            assetType="physical" 
            assetId={assetId} 
            assetName={asset.assetDescription}
          />
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Linked risks show how this asset contributes to overall risk. Click a risk title to open full details
            and manage assessments and treatments from the risk module.
          </p>
          <AssetLinkedRisks assetType="physical" assetId={assetId} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AssetAuditTrail assetType="physical" assetId={assetId} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Physical Asset</DialogTitle>
            <DialogDescription>Update asset information</DialogDescription>
          </DialogHeader>
          <PhysicalAssetForm
            asset={asset}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['physical-asset', assetId] });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DependencyWarningDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        assetType="physical"
        assetId={assetId}
        assetName={asset.assetDescription}
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

