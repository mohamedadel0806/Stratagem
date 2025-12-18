'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi } from '@/lib/api/governance';
import { workflowsApi } from '@/lib/api/workflows';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface PolicyWorkflowSectionProps {
  policyId: string;
}

export function PolicyWorkflowSection({ policyId }: PolicyWorkflowSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [comments, setComments] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  const { data: workflows, isLoading: workflowsLoading } = useQuery({
    queryKey: ['policy-workflows', policyId],
    queryFn: () => governanceApi.getPolicyWorkflows(policyId),
    enabled: !!policyId,
  });

  const { data: pendingApprovals, isLoading: approvalsLoading } = useQuery({
    queryKey: ['policy-pending-approvals', policyId],
    queryFn: () => governanceApi.getPolicyPendingApprovals(policyId),
    enabled: !!policyId,
  });

  const approveMutation = useMutation({
    mutationFn: async ({ approvalId, status, comments, signature }: any) => {
      await workflowsApi.approve(approvalId, status, comments, signature);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-workflows', policyId] });
      queryClient.invalidateQueries({ queryKey: ['policy-pending-approvals', policyId] });
      queryClient.invalidateQueries({ queryKey: ['policy', policyId] });
      setApprovalDialogOpen(false);
      setSelectedApproval(null);
      setComments('');
      toast({
        title: 'Success',
        description: 'Approval processed successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to process approval',
        variant: 'destructive',
      });
    },
  });

  const handleApprove = (approval: any) => {
    setSelectedApproval(approval);
    setApprovalDialogOpen(true);
  };

  const handleSubmitApproval = (status: 'approved' | 'rejected') => {
    if (!selectedApproval) return;
    
    setIsApproving(true);
    approveMutation.mutate(
      {
        approvalId: selectedApproval.id,
        status,
        comments,
      },
      {
        onSettled: () => {
          setIsApproving(false);
        },
      },
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      case 'cancelled':
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (workflowsLoading || approvalsLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading workflow information...</p>
        </CardContent>
      </Card>
    );
  }

  const workflowExecutions = workflows?.data || [];
  const pending = pendingApprovals?.data || [];

  return (
    <div className="space-y-4">
      {/* Pending Approvals Section */}
      {pending.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Pending Approvals
            </CardTitle>
            <CardDescription>You have {pending.length} pending approval(s) for this policy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.map((approval: any) => (
              <div key={approval.id} className="border rounded-lg p-4 bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{approval.workflowName}</p>
                    <p className="text-sm text-muted-foreground">Step {approval.stepOrder}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(approval)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Review & Approve
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(approval.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Workflow Executions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow History</CardTitle>
          <CardDescription>All workflow executions for this policy</CardDescription>
        </CardHeader>
        <CardContent>
          {workflowExecutions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No workflow executions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workflowExecutions.map((execution: any) => (
                <div key={execution.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{execution.workflowName}</p>
                      <p className="text-sm text-muted-foreground capitalize">{execution.workflowType}</p>
                    </div>
                    {getStatusBadge(execution.status)}
                  </div>

                  {execution.approvals && execution.approvals.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Approval Steps:</p>
                      <div className="space-y-2">
                        {execution.approvals
                          .sort((a: any, b: any) => a.stepOrder - b.stepOrder)
                          .map((approval: any) => (
                            <div
                              key={approval.id}
                              className="flex items-center justify-between p-2 bg-muted rounded"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Step {approval.stepOrder}:</span>
                                <span className="text-sm">{approval.approverName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getApprovalStatusBadge(approval.status)}
                                {approval.respondedAt && (
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(approval.respondedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                    <p>
                      Started: {execution.startedAt ? new Date(execution.startedAt).toLocaleString() : 'N/A'}
                    </p>
                    {execution.completedAt && (
                      <p>Completed: {new Date(execution.completedAt).toLocaleString()}</p>
                    )}
                    {execution.errorMessage && (
                      <p className="text-red-600 mt-1">Error: {execution.errorMessage}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review & Approve</DialogTitle>
            <DialogDescription>
              {selectedApproval?.workflowName} - Step {selectedApproval?.stepOrder}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comments">Comments (Optional)</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any comments about your decision..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setApprovalDialogOpen(false);
                setSelectedApproval(null);
                setComments('');
              }}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleSubmitApproval('rejected')}
              disabled={isApproving}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => handleSubmitApproval('approved')}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isApproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
