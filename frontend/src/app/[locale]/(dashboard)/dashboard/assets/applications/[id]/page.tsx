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
import { BusinessApplicationForm } from '@/components/forms/business-application-form';
import { AssetDependencies } from '@/components/assets/asset-dependencies';
import { AssetAuditTrail } from '@/components/assets/asset-audit-trail';
import { DependencyGraph } from '@/components/assets/dependency-graph';
import { AssetComplianceTab } from '@/components/assets/asset-compliance-tab';
import { LinkedControlsList } from '@/components/governance/linked-controls-list';
import { AssetLinkedRisks } from '@/components/risks/asset-linked-risks';

export default function BusinessApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const appId = params.id as string;

  const { data: app, isLoading } = useQuery({
    queryKey: ['business-application', appId],
    queryFn: () => assetsApi.getBusinessApplication(appId),
    enabled: !!appId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteBusinessApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-applications'] });
      toast({
        title: 'Success',
        description: 'Application deleted successfully',
      });
      router.push('/en/dashboard/assets/applications');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete application',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!app) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Application not found</p>
            <Button onClick={() => router.push('/en/dashboard/assets/applications')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
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
          <Button variant="outline" onClick={() => router.push('/en/dashboard/assets/applications')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{app.applicationName}</h1>
            <p className="text-muted-foreground">{app.applicationIdentifier}</p>
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
              if (confirm('Are you sure you want to delete this application?')) {
                deleteMutation.mutate(app.id);
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
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
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
                  <p className="text-sm font-medium text-muted-foreground">Application Name</p>
                  <p>{app.applicationName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Identifier</p>
                  <p>{app.applicationIdentifier}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  {app.applicationType ? (
                    <Badge>{app.applicationType.replace('_', ' ')}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={app.status === 'active' ? 'default' : 'secondary'}>
                    {app.status}
                  </Badge>
                </div>
                {app.version && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Version</p>
                    <p>{app.version}</p>
                  </div>
                )}
                {app.patchLevel && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Patch Level</p>
                    <p>{app.patchLevel}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Criticality</p>
                  <Badge variant="secondary">{app.criticalityLevel}</Badge>
                </div>
                {app.description && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{app.description}</p>
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
                {app.ownerName && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Owner</p>
                    <p>{app.ownerName}</p>
                  </div>
                )}
                {app.businessUnit && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Business Unit</p>
                    <p>{app.businessUnit}</p>
                  </div>
                )}
                {app.department && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p>{app.department}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {app.hostingLocation && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Hosting Location</p>
                    <p>{app.hostingLocation}</p>
                  </div>
                )}
                {app.technologyStack && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Technology Stack</p>
                    <p>{app.technologyStack}</p>
                  </div>
                )}
                {app.url && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">URL</p>
                    <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {app.url}
                    </a>
                  </div>
                )}
                {app.deploymentDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Deployment Date</p>
                    <p>{app.deploymentDate}</p>
                  </div>
                )}
                {app.lastUpdateDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Update Date</p>
                    <p>{app.lastUpdateDate}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processes PII</p>
                  <Badge variant={app.processesPII ? 'destructive' : 'secondary'}>
                    {app.processesPII ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processes PHI</p>
                  <Badge variant={app.processesPHI ? 'destructive' : 'secondary'}>
                    {app.processesPHI ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processes Financial Data</p>
                  <Badge variant={app.processesFinancialData ? 'destructive' : 'secondary'}>
                    {app.processesFinancialData ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {app.dataTypesProcessed && app.dataTypesProcessed.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Data Types Processed</p>
                    <div className="flex flex-wrap gap-2">
                      {app.dataTypesProcessed.map((type: string) => (
                        <Badge key={type} variant="outline">{type}</Badge>
                      ))}
                    </div>
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
                {app.vendor && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vendor</p>
                    <p>{app.vendor}</p>
                  </div>
                )}
                {app.vendorContact && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact</p>
                    <p>{app.vendorContact}</p>
                  </div>
                )}
                {app.vendorEmail && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <a href={`mailto:${app.vendorEmail}`} className="text-blue-600 hover:underline">
                      {app.vendorEmail}
                    </a>
                  </div>
                )}
                {app.vendorPhone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p>{app.vendorPhone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {/* Compliance Assessment */}
          <AssetComplianceTab assetType="application" assetId={appId} />
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <AssetDependencies assetType="application" assetId={appId} />
        </TabsContent>

        <TabsContent value="graph" className="space-y-4">
          <DependencyGraph 
            assetType="application" 
            assetId={appId} 
            assetName={app.applicationName}
          />
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <AssetLinkedRisks assetType="application" assetId={appId} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AssetAuditTrail assetType="application" assetId={appId} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Business Application</DialogTitle>
            <DialogDescription>Update the application details</DialogDescription>
          </DialogHeader>
          <BusinessApplicationForm
            application={app}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['business-application', appId] });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

