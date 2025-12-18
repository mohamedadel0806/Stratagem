'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, UnifiedControl, ControlType, ControlStatus, ImplementationStatus } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowLeft, Link2, Plus } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedControlForm } from '@/components/governance/unified-control-form';
import { LinkedAssetsList } from '@/components/governance/linked-assets-list';
import { AssetBrowserDialog } from '@/components/governance/asset-browser-dialog';
import { controlAssetMappingApi } from '@/lib/api/governance';
import { ControlLinkedRisks } from '@/components/risks/control-linked-risks';
import { ControlFrameworkMapping } from '@/components/governance/control-framework-mapping';

const controlTypeLabels: Record<ControlType, string> = {
  [ControlType.PREVENTIVE]: 'Preventive',
  [ControlType.DETECTIVE]: 'Detective',
  [ControlType.CORRECTIVE]: 'Corrective',
  [ControlType.COMPENSATING]: 'Compensating',
  [ControlType.ADMINISTRATIVE]: 'Administrative',
  [ControlType.TECHNICAL]: 'Technical',
  [ControlType.PHYSICAL]: 'Physical',
};

const statusLabels: Record<ControlStatus, string> = {
  [ControlStatus.DRAFT]: 'Draft',
  [ControlStatus.ACTIVE]: 'Active',
  [ControlStatus.DEPRECATED]: 'Deprecated',
};

const implementationLabels: Record<ImplementationStatus, string> = {
  [ImplementationStatus.NOT_IMPLEMENTED]: 'Not Implemented',
  [ImplementationStatus.PLANNED]: 'Planned',
  [ImplementationStatus.IN_PROGRESS]: 'In Progress',
  [ImplementationStatus.IMPLEMENTED]: 'Implemented',
  [ImplementationStatus.NOT_APPLICABLE]: 'Not Applicable',
};

export default function UnifiedControlDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssetBrowserOpen, setIsAssetBrowserOpen] = useState(false);
  const controlId = params.id as string;

  const { data: controlData, isLoading } = useQuery({
    queryKey: ['unified-control', controlId],
    queryFn: () => governanceApi.getUnifiedControl(controlId),
    enabled: !!controlId,
  });

  const control = controlData?.data;

  const { data: linkedAssets } = useQuery({
    queryKey: ['control-asset-mappings', controlId],
    queryFn: () => controlAssetMappingApi.getLinkedAssets(controlId),
    enabled: !!controlId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteUnifiedControl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-controls'] });
      toast({
        title: 'Success',
        description: 'Control deleted successfully',
      });
      router.push(`/${locale}/dashboard/governance/controls`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete control',
        variant: 'destructive',
      });
    },
  });

  // Get existing asset IDs to prevent duplicate links
  const existingAssetIds = new Set<string>();
  if (linkedAssets) {
    linkedAssets.forEach((mapping) => {
      existingAssetIds.add(mapping.asset_id);
    });
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading control details...</p>
        </div>
      </div>
    );
  }

  if (!control) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Control not found</p>
            <Button onClick={() => router.push(`/${locale}/dashboard/governance/controls`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Controls
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
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/governance/controls`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{control.title}</h1>
            <p className="text-muted-foreground">{control.control_identifier}</p>
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
              if (confirm('Are you sure you want to delete this control?')) {
                deleteMutation.mutate(control.id);
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
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="assets">Linked Assets</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Control Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Control Identifier</p>
                  <p className="text-sm font-medium">{control.control_identifier}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Control Type</p>
                  {control.control_type && (
                    <Badge variant="outline">{controlTypeLabels[control.control_type]}</Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={control.status === ControlStatus.ACTIVE ? 'default' : 'secondary'}>
                    {statusLabels[control.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Implementation Status</p>
                  <Badge
                    variant={
                      control.implementation_status === ImplementationStatus.IMPLEMENTED
                        ? 'default'
                        : control.implementation_status === ImplementationStatus.NOT_IMPLEMENTED
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {implementationLabels[control.implementation_status]}
                  </Badge>
                </div>
                {control.control_category && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p className="text-sm">{control.control_category}</p>
                  </div>
                )}
                {control.domain && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Domain</p>
                    <p className="text-sm">{control.domain}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                {control.description ? (
                  <p className="text-sm whitespace-pre-wrap">{control.description}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No description provided</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ownership</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {control.control_owner ? (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Control Owner</p>
                    <p className="text-sm">
                      {control.control_owner.first_name} {control.control_owner.last_name}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No owner assigned</p>
                )}
                {control.complexity && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Complexity</p>
                    <Badge variant="outline">{control.complexity}</Badge>
                  </div>
                )}
                {control.cost_impact && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cost Impact</p>
                    <Badge variant="outline">{control.cost_impact}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {control.control_procedures && (
            <Card>
              <CardHeader>
                <CardTitle>Control Procedures</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{control.control_procedures}</p>
              </CardContent>
            </Card>
          )}

          {control.testing_procedures && (
            <Card>
              <CardHeader>
                <CardTitle>Testing Procedures</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{control.testing_procedures}</p>
              </CardContent>
            </Card>
          )}

          {control.tags && control.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {control.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-4">
          <ControlFrameworkMapping controlId={controlId} />
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Linked Assets</h2>
              <p className="text-muted-foreground">Assets that implement or relate to this control</p>
            </div>
            <Button onClick={() => setIsAssetBrowserOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Link Assets
            </Button>
          </div>
          <LinkedAssetsList controlId={controlId} />
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <ControlLinkedRisks controlId={controlId} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Unified Control</DialogTitle>
            <DialogDescription>Update the control details</DialogDescription>
          </DialogHeader>
          <UnifiedControlForm
            control={control}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['unified-control', controlId] });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AssetBrowserDialog
        open={isAssetBrowserOpen}
        onOpenChange={setIsAssetBrowserOpen}
        controlId={controlId}
        existingAssetIds={existingAssetIds}
      />
    </div>
  );
}

