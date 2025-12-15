'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { workflowsApi, PendingApproval } from '@/lib/api/workflows';
import { governanceApi } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApprovalActions } from '@/components/governance/approval-actions';
import { FileText, AlertCircle, Clock, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';

const entityTypeLabels: Record<string, string> = {
  policy: 'Policy',
  risk: 'Risk',
  compliance_requirement: 'Compliance Requirement',
  task: 'Task',
};

const entityRoutes: Record<string, (id: string, locale: string) => string> = {
  policy: (id, locale) => `/${locale}/dashboard/governance/policies/${id}`,
  risk: (id, locale) => `/${locale}/dashboard/risks/${id}`,
  compliance_requirement: (id, locale) => `/${locale}/dashboard/compliance/requirements/${id}`,
  task: (id, locale) => `/${locale}/dashboard/tasks/${id}`,
};

export default function PendingApprovalsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const queryClient = useQueryClient();

  const { data: pendingApprovals, isLoading, error } = useQuery({
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

  // Group approvals by entity type
  const groupedApprovals = pendingApprovals?.reduce(
    (acc, approval) => {
      const key = approval.entityType || 'other';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(approval);
      return acc;
    },
    {} as Record<string, PendingApproval[]>,
  ) || {};

  const handleApprovalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['my-pending-approvals'] });
    queryClient.invalidateQueries({ queryKey: ['approvals'] });
    queryClient.invalidateQueries({ queryKey: ['my-approvals'] });
    // Also invalidate the specific entity queries
    pendingApprovals?.forEach((approval) => {
      queryClient.invalidateQueries({ queryKey: ['workflow-executions', approval.entityType, approval.entityId] });
      if (approval.entityType === 'policy') {
        queryClient.invalidateQueries({ queryKey: ['policy', approval.entityId] });
      }
    });
  };

  const handleViewEntity = (approval: PendingApproval) => {
    const route = entityRoutes[approval.entityType]?.(approval.entityId, locale);
    if (route) {
      router.push(route);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <p className="text-destructive font-semibold mb-2">Error loading approvals</p>
            <p className="text-sm text-muted-foreground">
              {(error as any)?.response?.data?.message || 'Failed to load pending approvals'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPending = pendingApprovals?.length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pending Approvals</h1>
          <p className="text-muted-foreground">Review and approve pending workflow requests</p>
        </div>
        {totalPending > 0 && (
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Clock className="h-4 w-4 mr-2" />
            {totalPending} Pending
          </Badge>
        )}
      </div>

      {totalPending === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-sm text-muted-foreground">
                You don't have any pending approvals at this time.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedApprovals).map(([entityType, approvals]) => (
            <Card key={entityType}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {entityType === 'policy' && <FileText className="h-5 w-5" />}
                  {entityTypeLabels[entityType] || entityType}
                  <Badge variant="outline">{approvals.length}</Badge>
                </CardTitle>
                <CardDescription>
                  {approvals.length} pending approval{approvals.length > 1 ? 's' : ''} for{' '}
                  {entityTypeLabels[entityType] || entityType.toLowerCase()} items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvals.map((approval) => (
                    <Card key={approval.id} className="border-l-4 border-l-yellow-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{approval.workflowName}</h3>
                              <Badge variant="secondary">Step {approval.stepOrder}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Workflow Type: {approval.workflowType}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Requested: {format(new Date(approval.createdAt), 'PPp')}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewEntity(approval)}
                              className="mt-2"
                            >
                              View {entityTypeLabels[approval.entityType] || approval.entityType}
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <ApprovalActions
                              approvalId={approval.id}
                              onSuccess={handleApprovalSuccess}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewEntity(approval)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
