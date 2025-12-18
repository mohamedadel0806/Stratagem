'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { workflowsApi, Approval, WorkflowExecution } from '@/lib/api/workflows';
import { ApprovalStatusBadge } from './approval-status';
import { ApprovalActions } from './approval-actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Clock, CheckCircle, XCircle, User, MessageSquare, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

interface ApprovalSectionProps {
  entityType: 'policy' | 'sop';
  entityId: string;
  currentUserId?: string;
}

export function ApprovalSection({ entityType, entityId, currentUserId }: ApprovalSectionProps) {
  // Get workflow executions for this entity
  const { data: executions, isLoading: executionsLoading } = useQuery({
    queryKey: ['workflow-executions', entityType, entityId],
    queryFn: () => workflowsApi.getExecutions({ entityType, entityId }),
    enabled: !!entityId,
  });

  // Get current user's pending approvals
  const { data: myPendingApprovals } = useQuery({
    queryKey: ['my-pending-approvals'],
    queryFn: () => workflowsApi.getMyPendingApprovals(),
    staleTime: 2 * 60 * 1000, // 2 minutes - approvals don't change that frequently
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Don't retry on 429 errors
      if (error?.response?.status === 429) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Set default selected execution (first one)
  const defaultExecutionId = executions && executions.length > 0 ? executions[0].id : null;
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(defaultExecutionId);

  // Update selected execution when executions load
  useEffect(() => {
    if (!selectedExecutionId && executions && executions.length > 0) {
      setSelectedExecutionId(executions[0].id);
    }
  }, [executions, selectedExecutionId]);

  // Get approvals for selected execution
  const { data: approvals, isLoading: approvalsLoading } = useQuery({
    queryKey: ['approvals', selectedExecutionId],
    queryFn: () => workflowsApi.getApprovals(selectedExecutionId!),
    enabled: !!selectedExecutionId,
  });

  // Get execution details
  const { data: executionDetails } = useQuery({
    queryKey: ['workflow-execution', selectedExecutionId],
    queryFn: () => workflowsApi.getExecutionById(selectedExecutionId!),
    enabled: !!selectedExecutionId,
  });

  // Find pending approvals for this entity
  const pendingApprovalsForEntity = myPendingApprovals?.filter(
    (approval) => approval.entityType === entityType && approval.entityId === entityId
  ) || [];

  if (executionsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approval Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!executions || executions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approval Status</CardTitle>
          <CardDescription>No approval workflows initiated for this {entityType === 'policy' ? 'policy' : 'SOP'}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Approval workflows will appear here when this {entityType === 'policy' ? 'policy' : 'SOP'} is submitted for approval.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentExecution = executions.find((e) => e.id === selectedExecutionId) || executions[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Status</CardTitle>
        <CardDescription>Workflow execution and approval history</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedExecutionId || executions[0]?.id} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${executions.length}, minmax(0, 1fr))` }}>
            {executions.map((execution, index) => (
              <TabsTrigger
                key={execution.id}
                value={execution.id}
                onClick={() => setSelectedExecutionId(execution.id)}
              >
                Workflow {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>

          {executions.map((execution) => (
            <TabsContent key={execution.id} value={execution.id} className="space-y-4 mt-4">
              {/* Workflow Execution Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{execution.workflowName}</h4>
                    <p className="text-sm text-muted-foreground">{execution.workflowType}</p>
                  </div>
                  <ApprovalStatusBadge
                    status={execution.status === 'completed' ? 'approved' : execution.status}
                  />
                </div>
                {execution.startedAt && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Started: {format(new Date(execution.startedAt), 'PPp')}
                  </div>
                )}
                {execution.completedAt && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    Completed: {format(new Date(execution.completedAt), 'PPp')}
                  </div>
                )}
              </div>

              {/* Pending Approvals for Current User */}
              {pendingApprovalsForEntity.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900">Action Required</h4>
                      <p className="text-sm text-yellow-700">
                        You have {pendingApprovalsForEntity.length} pending approval{pendingApprovalsForEntity.length > 1 ? 's' : ''} for this {entityType === 'policy' ? 'policy' : 'SOP'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    {pendingApprovalsForEntity.map((approval) => (
                      <div key={approval.id} className="p-3 bg-white rounded border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Approval Required</p>
                            <p className="text-xs text-muted-foreground">
                              Step {approval.stepOrder}
                            </p>
                          </div>
                          <ApprovalActions
                            approvalId={approval.id}
                            onSuccess={() => {
                              setSelectedExecutionId(execution.id);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval History */}
              {approvalsLoading && selectedExecutionId === execution.id ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : approvals && approvals.length > 0 && selectedExecutionId === execution.id ? (
                <div className="space-y-3">
                  <h4 className="font-semibold">Approval History</h4>
                  <div className="space-y-3">
                    {approvals
                      .sort((a, b) => a.stepOrder - b.stepOrder)
                      .map((approval) => (
                        <div
                          key={approval.id}
                          className="p-4 border rounded-lg bg-card"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{approval.approverName}</span>
                              <span className="text-sm text-muted-foreground">
                                (Step {approval.stepOrder})
                              </span>
                            </div>
                            <ApprovalStatusBadge status={approval.status} />
                          </div>
                          {approval.comments && (
                            <div className="mt-2 p-2 bg-muted rounded">
                              <div className="flex items-start gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <p className="text-sm">{approval.comments}</p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            {approval.respondedAt ? (
                              <>
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Responded: {format(new Date(approval.respondedAt), 'PPp')}
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Pending
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Created: {format(new Date(approval.createdAt), 'PPp')}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : selectedExecutionId === execution.id ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No approvals found for this workflow execution
                </div>
              ) : null}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

