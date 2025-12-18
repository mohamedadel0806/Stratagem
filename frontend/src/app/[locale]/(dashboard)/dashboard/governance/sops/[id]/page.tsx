'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, SOP, SOPStatus, SOPCategory } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowLeft, FileText, Send } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SOPForm } from '@/components/governance/sop-form';
import { ApprovalSection } from '@/components/governance/approval-section';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

const statusLabels: Record<SOPStatus, string> = {
  [SOPStatus.DRAFT]: 'Draft',
  [SOPStatus.IN_REVIEW]: 'In Review',
  [SOPStatus.APPROVED]: 'Approved',
  [SOPStatus.PUBLISHED]: 'Published',
  [SOPStatus.ARCHIVED]: 'Archived',
};

const categoryLabels: Record<SOPCategory, string> = {
  [SOPCategory.OPERATIONAL]: 'Operational',
  [SOPCategory.SECURITY]: 'Security',
  [SOPCategory.COMPLIANCE]: 'Compliance',
  [SOPCategory.THIRD_PARTY]: 'Third Party',
};

export default function SOPDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const sopId = params.id as string;

  const { data: sop, isLoading } = useQuery({
    queryKey: ['sop', sopId],
    queryFn: () => governanceApi.getSOP(sopId),
    enabled: !!sopId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteSOP(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sops'] });
      toast({
        title: 'Success',
        description: 'SOP deleted successfully',
      });
      router.push(`/${locale}/dashboard/governance/sops`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete SOP',
        variant: 'destructive',
      });
    },
  });

  const submitForApprovalMutation = useMutation({
    mutationFn: async () => {
      // Update SOP status to IN_REVIEW which should trigger workflows automatically
      return governanceApi.updateSOP(sopId, {
        ...sop,
        status: SOPStatus.IN_REVIEW,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sop', sopId] });
      queryClient.invalidateQueries({ queryKey: ['workflow-executions', 'sop', sopId] });
      toast({
        title: 'Success',
        description: 'SOP submitted for approval. Workflow triggered.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit for approval',
        variant: 'destructive',
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      return governanceApi.publishSOP(sopId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sop', sopId] });
      toast({
        title: 'Success',
        description: 'SOP published successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to publish SOP',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading SOP details...</p>
        </div>
      </div>
    );
  }

  if (!sop) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">SOP not found</p>
            <Button onClick={() => router.push(`/${locale}/dashboard/governance/sops`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to SOPs
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
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/governance/sops`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{sop.title}</h1>
            <p className="text-muted-foreground">{sop.sop_identifier}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {sop.status === SOPStatus.DRAFT && (
            <Button
              onClick={() => {
                if (confirm('Submit this SOP for approval? This will trigger the approval workflow.')) {
                  submitForApprovalMutation.mutate();
                }
              }}
              disabled={submitForApprovalMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {submitForApprovalMutation.isPending ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          )}
          {(sop.status === SOPStatus.APPROVED || sop.status === SOPStatus.IN_REVIEW) && (
            <Button
              onClick={() => {
                if (confirm('Publish this SOP? It will be made available to assigned users.')) {
                  publishMutation.mutate();
                }
              }}
              disabled={publishMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              {publishMutation.isPending ? 'Publishing...' : 'Publish'}
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Are you sure you want to delete this SOP?')) {
                deleteMutation.mutate(sop.id);
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>SOP Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SOP Identifier</p>
                  <p className="text-sm font-medium">{sop.sop_identifier}</p>
                </div>
                {sop.category && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <Badge variant="outline">{categoryLabels[sop.category]}</Badge>
                  </div>
                )}
                {sop.version && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Version</p>
                    <Badge variant="outline">v{sop.version}</Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      sop.status === SOPStatus.PUBLISHED
                        ? 'default'
                        : sop.status === SOPStatus.IN_REVIEW
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {statusLabels[sop.status]}
                  </Badge>
                </div>
                {sop.owner && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Owner</p>
                    <p className="text-sm">
                      {sop.owner.first_name} {sop.owner.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{sop.owner.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dates & Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sop.effective_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Effective Date</p>
                    <p className="text-sm">
                      {new Date(sop.effective_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {sop.published_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Published Date</p>
                    <p className="text-sm">
                      {new Date(sop.published_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {sop.next_review_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Review Date</p>
                    <p className="text-sm">
                      {new Date(sop.next_review_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {sop.review_frequency && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Review Frequency</p>
                    <p className="text-sm">{sop.review_frequency}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sop.purpose && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                    <p className="text-sm whitespace-pre-wrap">{sop.purpose}</p>
                  </div>
                )}
                {sop.scope && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Scope</p>
                    <p className="text-sm whitespace-pre-wrap">{sop.scope}</p>
                  </div>
                )}
                {sop.controls && sop.controls.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Linked Controls</p>
                    <p className="text-sm">{sop.controls.length} control(s) linked</p>
                  </div>
                )}
                {sop.tags && sop.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {sop.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SOP Content</CardTitle>
              <CardDescription>The full text content of this SOP</CardDescription>
            </CardHeader>
            <CardContent>
              {sop.content ? (
                <div className="prose prose-sm max-w-none">
                  <RichTextEditor
                    content={sop.content}
                    onChange={() => {}}
                    editable={false}
                    minHeight="400px"
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No content provided for this SOP.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <ApprovalSection entityType="sop" entityId={sop.id} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit SOP</DialogTitle>
            <DialogDescription>Update the SOP details</DialogDescription>
          </DialogHeader>
          <SOPForm
            sop={sop}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['sop', sopId] });
              toast({
                title: 'Success',
                description: 'SOP updated successfully',
              });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
