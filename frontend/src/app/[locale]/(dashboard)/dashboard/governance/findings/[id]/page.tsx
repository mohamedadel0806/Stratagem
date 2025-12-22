'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, Finding, FindingSeverity, FindingStatus } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowLeft, Calendar, AlertTriangle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FindingForm } from '@/components/governance/finding-form';
import { FindingLinkedRisks } from '@/components/risks/finding-linked-risks';
import { FindingRemediationTracker } from '@/components/governance/finding-remediation-tracker';

const severityLabels: Record<FindingSeverity, string> = {
  [FindingSeverity.CRITICAL]: 'Critical',
  [FindingSeverity.HIGH]: 'High',
  [FindingSeverity.MEDIUM]: 'Medium',
  [FindingSeverity.LOW]: 'Low',
  [FindingSeverity.INFO]: 'Informational',
};

const statusLabels: Record<FindingStatus, string> = {
  [FindingStatus.OPEN]: 'Open',
  [FindingStatus.IN_PROGRESS]: 'In Progress',
  [FindingStatus.RESOLVED]: 'Resolved',
  [FindingStatus.CLOSED]: 'Closed',
  [FindingStatus.ACCEPTED]: 'Risk Accepted',
  [FindingStatus.REJECTED]: 'False Positive',
};

const severityColors: Record<FindingSeverity, string> = {
  [FindingSeverity.CRITICAL]: 'destructive',
  [FindingSeverity.HIGH]: 'destructive',
  [FindingSeverity.MEDIUM]: 'default',
  [FindingSeverity.LOW]: 'secondary',
  [FindingSeverity.INFO]: 'outline',
};

export default function FindingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const findingId = params.id as string;

  const { data: findingData, isLoading } = useQuery({
    queryKey: ['finding', findingId],
    queryFn: () => governanceApi.getFinding(findingId),
    enabled: !!findingId,
  });

  const finding = findingData?.data;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteFinding(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['findings'] });
      toast({
        title: 'Success',
        description: 'Finding deleted successfully',
      });
      router.push(`/${locale}/dashboard/governance/findings`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete finding',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading finding details...</p>
        </div>
      </div>
    );
  }

  if (!finding) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Finding not found</p>
            <Button onClick={() => router.push(`/${locale}/dashboard/governance/findings`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Findings
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
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/governance/findings`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{finding.title}</h1>
            <p className="text-muted-foreground">{finding.finding_identifier}</p>
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
              if (confirm('Are you sure you want to delete this finding?')) {
                deleteMutation.mutate(finding.id);
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
          <TabsTrigger value="remediation">Remediation</TabsTrigger>
          <TabsTrigger value="risks">Linked Risks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Finding Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Finding Identifier</p>
                  <p className="text-sm font-medium">{finding.finding_identifier}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Severity</p>
                  <Badge variant={severityColors[finding.severity] as any}>
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {severityLabels[finding.severity]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      finding.status === FindingStatus.CLOSED || finding.status === FindingStatus.RESOLVED
                        ? 'default'
                        : finding.status === FindingStatus.IN_PROGRESS
                        ? 'secondary'
                        : finding.status === FindingStatus.ACCEPTED || finding.status === FindingStatus.REJECTED
                        ? 'outline'
                        : 'destructive'
                    }
                  >
                    {statusLabels[finding.status]}
                  </Badge>
                </div>
                {finding.finding_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Finding Date</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(finding.finding_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
                {finding.source_type && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Source Type</p>
                    <p className="text-sm">{finding.source_type}</p>
                  </div>
                )}
                {finding.source_name && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Source Name</p>
                    <p className="text-sm">{finding.source_name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                {finding.description ? (
                  <p className="text-sm whitespace-pre-wrap">{finding.description}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No description provided</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Remediation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {finding.remediation_owner ? (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Remediation Owner</p>
                    <p className="text-sm">
                      {finding.remediation_owner.first_name} {finding.remediation_owner.last_name}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No owner assigned</p>
                )}
                {finding.remediation_due_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(finding.remediation_due_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
                {finding.remediation_plan && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Remediation Plan</p>
                    <p className="text-sm whitespace-pre-wrap">{finding.remediation_plan}</p>
                  </div>
                )}
                {finding.risk_accepted_by && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Risk Accepted</p>
                    <Badge variant="outline">Yes</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {finding.unified_control && (
            <Card>
              <CardHeader>
                <CardTitle>Related Control</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{finding.unified_control.control_identifier}</Badge>
                  <span className="text-sm font-medium">{finding.unified_control.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/${locale}/dashboard/governance/controls/${finding.unified_control?.id}`)}
                  >
                    View Control
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="remediation" className="space-y-4">
          <FindingRemediationTracker findingId={findingId} />
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <FindingLinkedRisks findingId={findingId} />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Finding</DialogTitle>
            <DialogDescription>Update finding information</DialogDescription>
          </DialogHeader>
          <FindingForm
            finding={finding}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['finding', findingId] });
              queryClient.invalidateQueries({ queryKey: ['findings'] });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}



