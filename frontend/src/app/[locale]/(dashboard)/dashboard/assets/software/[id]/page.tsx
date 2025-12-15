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
import { AssetComplianceTab } from '@/components/assets/asset-compliance-tab';
import { LinkedControlsList } from '@/components/governance/linked-controls-list';
import { AssetLinkedRisks } from '@/components/risks/asset-linked-risks';

export default function SoftwareAssetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const softwareId = params.id as string;

  const { data: software, isLoading } = useQuery({
    queryKey: ['software-asset', softwareId],
    queryFn: () => assetsApi.getSoftwareAsset(softwareId),
    enabled: !!softwareId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteSoftwareAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['software-assets'] });
      toast({
        title: 'Success',
        description: 'Software asset deleted successfully',
      });
      router.push('/en/dashboard/assets/software');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete software asset',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!software) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Software asset not found</p>
            <Button onClick={() => router.push('/en/dashboard/assets/software')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Software Assets
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
          <Button variant="outline" onClick={() => router.push('/en/dashboard/assets/software')}>
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
            onClick={() => {
              if (confirm('Are you sure you want to delete this software asset?')) {
                deleteMutation.mutate(software.id);
              }
            }}
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
          <TabsTrigger value="vendor">Vendor Information</TabsTrigger>
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
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  {software.softwareType ? (
                    <Badge>{software.softwareType.replace('_', ' ')}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Criticality</p>
                  <Badge variant="secondary">{software.criticalityLevel}</Badge>
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

          <Card>
            <CardHeader>
              <CardTitle>Ownership</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {software.ownerName && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Owner</p>
                    <p>{software.ownerName}</p>
                  </div>
                )}
                {software.businessUnit && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Business Unit</p>
                    <p>{software.businessUnit}</p>
                  </div>
                )}
                {software.purchaseDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                    <p>{software.purchaseDate}</p>
                  </div>
                )}
                {software.installationDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Installation Date</p>
                    <p>{software.installationDate}</p>
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
                    <p className="font-mono text-xs">{software.licenseKey}</p>
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
              {software.numberOfLicenses && software.licensesInUse !== undefined && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">License Usage</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${(software.licensesInUse / software.numberOfLicenses) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {software.licensesInUse} of {software.numberOfLicenses} licenses in use
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {software.installedOnAssets && software.installedOnAssets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Installed On Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {software.installedOnAssets.map((assetId: string) => (
                    <Badge key={assetId} variant="outline">{assetId}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact</p>
                    <p>{software.vendorContact}</p>
                  </div>
                )}
                {software.vendorEmail && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <a href={`mailto:${software.vendorEmail}`} className="text-blue-600 hover:underline">
                      {software.vendorEmail}
                    </a>
                  </div>
                )}
                {software.vendorPhone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p>{software.vendorPhone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {/* Compliance Assessment */}
          <AssetComplianceTab assetType="software" assetId={softwareId} />
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <AssetDependencies assetType="software" assetId={softwareId} />
        </TabsContent>

        <TabsContent value="graph" className="space-y-4">
          <DependencyGraph 
            assetType="software" 
            assetId={softwareId} 
            assetName={software.softwareName}
          />
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <AssetLinkedRisks assetType="software" assetId={softwareId} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AssetAuditTrail assetType="software" assetId={softwareId} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Software Asset</DialogTitle>
            <DialogDescription>Update the software asset details</DialogDescription>
          </DialogHeader>
          <SoftwareAssetForm
            software={software}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['software-asset', softwareId] });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

