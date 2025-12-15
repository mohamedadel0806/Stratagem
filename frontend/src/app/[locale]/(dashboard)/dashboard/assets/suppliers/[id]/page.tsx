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
import { AssetComplianceTab } from '@/components/assets/asset-compliance-tab';
import { LinkedControlsList } from '@/components/governance/linked-controls-list';
import { AssetLinkedRisks } from '@/components/risks/asset-linked-risks';

export default function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const supplierId = params.id as string;

  const { data: supplier, isLoading } = useQuery({
    queryKey: ['supplier', supplierId],
    queryFn: () => assetsApi.getSupplier(supplierId),
    enabled: !!supplierId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: 'Success',
        description: 'Supplier deleted successfully',
      });
      router.push('/en/dashboard/assets/suppliers');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete supplier',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!supplier) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Supplier not found</p>
            <Button onClick={() => router.push('/en/dashboard/assets/suppliers')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Suppliers
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
          <Button variant="outline" onClick={() => router.push('/en/dashboard/assets/suppliers')}>
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
            onClick={() => {
              if (confirm('Are you sure you want to delete this supplier?')) {
                deleteMutation.mutate(supplier.id);
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
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  {supplier.supplierType ? (
                    <Badge>{supplier.supplierType.replace('_', ' ')}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Criticality</p>
                  <Badge variant="secondary">{supplier.criticalityLevel}</Badge>
                </div>
                {supplier.description && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{supplier.description}</p>
                  </div>
                )}
                {supplier.businessUnit && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Business Unit</p>
                    <p>{supplier.businessUnit}</p>
                  </div>
                )}
                {supplier.goodsOrServicesProvided && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Goods/Services Provided</p>
                    <p>{supplier.goodsOrServicesProvided}</p>
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

          {supplier.additionalContacts && supplier.additionalContacts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplier.additionalContacts.map((contact: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <p className="font-medium">{contact.name}</p>
                      {contact.role && <p className="text-sm text-muted-foreground">{contact.role}</p>}
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline">
                          {contact.email}
                        </a>
                      )}
                      {contact.phone && <p className="text-sm">{contact.phone}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contract" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {supplier.contractReference && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contract Reference</p>
                    <p>{supplier.contractReference}</p>
                  </div>
                )}
                {supplier.contractStartDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                    <p>{supplier.contractStartDate}</p>
                  </div>
                )}
                {supplier.contractEndDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">End Date</p>
                    <p>{supplier.contractEndDate}</p>
                  </div>
                )}
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Has Data Access</p>
                  <Badge variant={supplier.hasDataAccess ? 'destructive' : 'secondary'}>
                    {supplier.hasDataAccess ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requires NDA</p>
                  <Badge variant={supplier.requiresNDA ? 'destructive' : 'secondary'}>
                    {supplier.requiresNDA ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Security Assessment</p>
                  <Badge variant={supplier.hasSecurityAssessment ? 'default' : 'secondary'}>
                    {supplier.hasSecurityAssessment ? 'Completed' : 'Not Completed'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Assessment */}
          <AssetComplianceTab assetType="supplier" assetId={supplierId} />
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <AssetDependencies assetType="supplier" assetId={supplierId} />
        </TabsContent>

        <TabsContent value="graph" className="space-y-4">
          <DependencyGraph 
            assetType="supplier" 
            assetId={supplierId} 
            assetName={supplier.supplierName}
          />
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <AssetLinkedRisks assetType="supplier" assetId={supplierId} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AssetAuditTrail assetType="supplier" assetId={supplierId} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update the supplier details</DialogDescription>
          </DialogHeader>
          <SupplierForm
            supplier={supplier}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['supplier', supplierId] });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

