'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, PolicyException, ExceptionStatus } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, XCircle, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusLabels: Record<ExceptionStatus, string> = {
  [ExceptionStatus.REQUESTED]: 'Requested',
  [ExceptionStatus.UNDER_REVIEW]: 'Under Review',
  [ExceptionStatus.APPROVED]: 'Approved',
  [ExceptionStatus.REJECTED]: 'Rejected',
  [ExceptionStatus.EXPIRED]: 'Expired',
  [ExceptionStatus.REVOKED]: 'Revoked',
};

const statusColors: Record<ExceptionStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [ExceptionStatus.REQUESTED]: 'outline',
  [ExceptionStatus.UNDER_REVIEW]: 'secondary',
  [ExceptionStatus.APPROVED]: 'default',
  [ExceptionStatus.REJECTED]: 'destructive',
  [ExceptionStatus.EXPIRED]: 'outline',
  [ExceptionStatus.REVOKED]: 'destructive',
};

export default function PolicyExceptionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const exceptionId = params.id as string;
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [approvalConditions, setApprovalConditions] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: exceptionData, isLoading } = useQuery({
    queryKey: ['policy-exception', exceptionId],
    queryFn: () => governanceApi.getPolicyException(exceptionId),
    enabled: !!exceptionId,
  });

  const exception = exceptionData?.data;

  const approveMutation = useMutation({
    mutationFn: (conditions?: string) => governanceApi.approvePolicyException(exceptionId, conditions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-exception', exceptionId] });
      queryClient.invalidateQueries({ queryKey: ['policy-exceptions'] });
      setIsApproveOpen(false);
      setApprovalConditions('');
      toast({
        title: 'Success',
        description: 'Exception approved successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to approve exception',
        variant: 'destructive',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => governanceApi.rejectPolicyException(exceptionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-exception', exceptionId] });
      queryClient.invalidateQueries({ queryKey: ['policy-exceptions'] });
      setIsRejectOpen(false);
      setRejectionReason('');
      toast({
        title: 'Success',
        description: 'Exception rejected successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reject exception',
        variant: 'destructive',
      });
    },
  });

  const canApprove =
    exception &&
    (exception.status === ExceptionStatus.REQUESTED || exception.status === ExceptionStatus.UNDER_REVIEW);

  const canReject =
    exception &&
    (exception.status === ExceptionStatus.REQUESTED || exception.status === ExceptionStatus.UNDER_REVIEW);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading exception details...</p>
        </div>
      </div>
    );
  }

  if (!exception) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Exception not found</p>
            <Button onClick={() => router.push(`/${locale}/dashboard/governance/exceptions`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Exceptions
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
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/governance/exceptions`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{exception.exception_identifier}</h1>
            <p className="text-muted-foreground">Policy Exception Request</p>
          </div>
        </div>
        <div className="flex gap-2">
          {canApprove && (
            <Button variant="default" onClick={() => setIsApproveOpen(true)}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          )}
          {canReject && (
            <Button variant="destructive" onClick={() => setIsRejectOpen(true)}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Exception Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={statusColors[exception.status]} className="mt-1">
                    {statusLabels[exception.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Exception Type</p>
                  <p className="text-sm font-medium">{exception.exception_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entity ID</p>
                  <p className="text-sm font-medium">{exception.entity_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entity Type</p>
                  <p className="text-sm font-medium">{exception.entity_type || 'N/A'}</p>
                </div>
                {exception.request_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Request Date</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(exception.request_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {exception.requester && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Requested By</p>
                    <p className="text-sm font-medium">
                      {exception.requester.first_name} {exception.requester.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{exception.requester.email}</p>
                  </div>
                )}
                {exception.requesting_business_unit && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Business Unit</p>
                    <p className="text-sm font-medium">{exception.requesting_business_unit.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approval Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {exception.approver && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved By</p>
                    <p className="text-sm font-medium">
                      {exception.approver.first_name} {exception.approver.last_name}
                    </p>
                  </div>
                )}
                {exception.approval_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approval Date</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(exception.approval_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
                {exception.approval_conditions && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approval Conditions</p>
                    <p className="text-sm whitespace-pre-wrap">{exception.approval_conditions}</p>
                  </div>
                )}
                {exception.rejection_reason && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rejection Reason</p>
                    <p className="text-sm whitespace-pre-wrap text-destructive">{exception.rejection_reason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Justification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{exception.business_justification}</p>
            </CardContent>
          </Card>

          {exception.compensating_controls && (
            <Card>
              <CardHeader>
                <CardTitle>Compensating Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{exception.compensating_controls}</p>
              </CardContent>
            </Card>
          )}

          {exception.risk_assessment && (
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{exception.risk_assessment}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {exception.start_date && (
              <Card>
                <CardHeader>
                  <CardTitle>Start Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(exception.start_date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {exception.end_date && (
              <Card>
                <CardHeader>
                  <CardTitle>End Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(exception.end_date).toLocaleDateString()}</span>
                  </div>
                  {exception.auto_expire && (
                    <Badge variant="outline" className="mt-2">
                      Auto-Expire Enabled
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {exception.next_review_date && (
            <Card>
              <CardHeader>
                <CardTitle>Next Review Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(exception.next_review_date).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Approve Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Exception</DialogTitle>
            <DialogDescription>Add any conditions for this approval (optional)</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="conditions">Approval Conditions</Label>
              <Textarea
                id="conditions"
                placeholder="Enter any conditions for this approval..."
                rows={4}
                value={approvalConditions}
                onChange={(e) => setApprovalConditions(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => approveMutation.mutate(approvalConditions || undefined)}
                disabled={approveMutation.isPending}
              >
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Exception</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this exception</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for rejection..."
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (!rejectionReason.trim()) {
                    toast({
                      title: 'Error',
                      description: 'Rejection reason is required',
                      variant: 'destructive',
                    });
                    return;
                  }
                  rejectMutation.mutate(rejectionReason);
                }}
                disabled={rejectMutation.isPending || !rejectionReason.trim()}
              >
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


