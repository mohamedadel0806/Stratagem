'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, Policy, PolicyStatus, ReviewFrequency } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowLeft, FileText, Send } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PolicyForm } from '@/components/governance/policy-form';
import { ApprovalSection } from '@/components/governance/approval-section';
import { ControlObjectivesSection } from '@/components/governance/control-objectives-section';
import { PolicyVersionComparison } from '@/components/governance/policy-version-comparison';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

const statusLabels: Record<PolicyStatus, string> = {
  [PolicyStatus.DRAFT]: 'Draft',
  [PolicyStatus.IN_REVIEW]: 'In Review',
  [PolicyStatus.APPROVED]: 'Approved',
  [PolicyStatus.PUBLISHED]: 'Published',
  [PolicyStatus.ARCHIVED]: 'Archived',
};

const reviewFrequencyLabels: Record<ReviewFrequency, string> = {
  [ReviewFrequency.ANNUAL]: 'Annual',
  [ReviewFrequency.BIENNIAL]: 'Biennial',
  [ReviewFrequency.TRIENNIAL]: 'Triennial',
  [ReviewFrequency.QUARTERLY]: 'Quarterly',
  [ReviewFrequency.MONTHLY]: 'Monthly',
  [ReviewFrequency.AS_NEEDED]: 'As Needed',
};

export default function PolicyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const policyId = params.id as string;

  const { data: policy, isLoading } = useQuery({
    queryKey: ['policy', policyId],
    queryFn: () => governanceApi.getPolicy(policyId),
    enabled: !!policyId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deletePolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast({
        title: 'Success',
        description: 'Policy deleted successfully',
      });
      router.push(`/${locale}/dashboard/governance/policies`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete policy',
        variant: 'destructive',
      });
    },
  });

  const submitForApprovalMutation = useMutation({
    mutationFn: async () => {
      // Update policy status to IN_REVIEW which should trigger workflows automatically
      return governanceApi.updatePolicy(policyId, {
        ...policy,
        status: PolicyStatus.IN_REVIEW,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy', policyId] });
      queryClient.invalidateQueries({ queryKey: ['workflow-executions', 'policy', policyId] });
      toast({
        title: 'Success',
        description: 'Policy submitted for approval. Workflow triggered.',
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading policy details...</p>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Policy not found</p>
            <Button onClick={() => router.push(`/${locale}/dashboard/governance/policies`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Policies
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
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/governance/policies`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{policy.title}</h1>
            <p className="text-muted-foreground">{policy.policy_type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {policy.status === PolicyStatus.DRAFT && (
            <Button
              onClick={() => {
                if (confirm('Submit this policy for approval? This will trigger the approval workflow.')) {
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
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Are you sure you want to delete this policy?')) {
                deleteMutation.mutate(policy.id);
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
          <TabsTrigger value="control-objectives">Control Objectives</TabsTrigger>
          <TabsTrigger value="versions">Version Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Policy Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Policy Type</p>
                  <p className="text-sm font-medium">{policy.policy_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Version</p>
                  <Badge variant="outline">v{policy.version}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      policy.status === PolicyStatus.PUBLISHED
                        ? 'default'
                        : policy.status === PolicyStatus.IN_REVIEW
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {statusLabels[policy.status]}
                  </Badge>
                </div>
                {policy.owner && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Owner</p>
                    <p className="text-sm">
                      {policy.owner.first_name} {policy.owner.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{policy.owner.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dates & Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {policy.effective_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Effective Date</p>
                    <p className="text-sm">
                      {new Date(policy.effective_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {policy.approval_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approval Date</p>
                    <p className="text-sm">
                      {new Date(policy.approval_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {policy.next_review_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Review Date</p>
                    <p className="text-sm">
                      {new Date(policy.next_review_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Review Frequency</p>
                  <p className="text-sm">{reviewFrequencyLabels[policy.review_frequency]}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {policy.purpose && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                    <p className="text-sm whitespace-pre-wrap">{policy.purpose}</p>
                  </div>
                )}
                {policy.scope && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Scope</p>
                    <p className="text-sm whitespace-pre-wrap">{policy.scope}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requires Acknowledgment</p>
                  <Badge variant={policy.requires_acknowledgment ? 'default' : 'outline'}>
                    {policy.requires_acknowledgment ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {policy.tags && policy.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {policy.tags.map((tag) => (
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
              <CardTitle>Policy Content</CardTitle>
              <CardDescription>The full text content of this policy</CardDescription>
            </CardHeader>
            <CardContent>
              {policy.content ? (
                <div className="prose prose-sm max-w-none">
                  <RichTextEditor
                    content={policy.content}
                    onChange={() => {}}
                    editable={false}
                    minHeight="400px"
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No content provided for this policy.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <ApprovalSection policyId={policy.id} />
        </TabsContent>

        <TabsContent value="control-objectives" className="space-y-4">
          <ControlObjectivesSection policyId={policyId} />
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          {policy && (
            <PolicyVersionComparison 
              policyId={policyId} 
              currentVersion={(policy as any)?.data || (policy as Policy)} 
            />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
            <DialogDescription>Update the policy details</DialogDescription>
          </DialogHeader>
          <PolicyForm
            policy={policy}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['policy', policyId] });
              toast({
                title: 'Success',
                description: 'Policy updated successfully',
              });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

