'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workflowsApi, WorkflowExecution } from '@/lib/api/workflows';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  AlertCircle,
  FileText,
  AlertTriangle,
  Shield,
  ClipboardList,
  Eye,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'in_progress':
      return <Play className="h-4 w-4 text-blue-500 animate-pulse" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'cancelled':
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'failed':
      return 'bg-red-500';
    case 'in_progress':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'cancelled':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

const getEntityIcon = (entityType: string) => {
  switch (entityType) {
    case 'policy':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'risk':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'compliance_requirement':
      return <Shield className="h-4 w-4 text-green-500" />;
    case 'task':
      return <ClipboardList className="h-4 w-4 text-purple-500" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getWorkflowTypeColor = (type: string) => {
  switch (type) {
    case 'approval':
      return 'bg-blue-100 text-blue-800';
    case 'escalation':
      return 'bg-orange-100 text-orange-800';
    case 'notification':
      return 'bg-green-100 text-green-800';
    case 'status_change':
      return 'bg-purple-100 text-purple-800';
    case 'deadline_reminder':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function WorkflowHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);

  const { data: executions = [], isLoading } = useQuery({
    queryKey: ['workflow-executions', statusFilter, entityTypeFilter],
    queryFn: () =>
      workflowsApi.getExecutions({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        entityType: entityTypeFilter !== 'all' ? entityTypeFilter : undefined,
        limit: 100,
      }),
  });

  const { data: executionDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['workflow-execution', selectedExecution?.id],
    queryFn: () =>
      selectedExecution ? workflowsApi.getExecutionById(selectedExecution.id) : null,
    enabled: !!selectedExecution,
  });

  const getEntityUrl = (entityType: string, entityId: string) => {
    switch (entityType) {
      case 'policy':
        return `/en/dashboard/policies/${entityId}`;
      case 'risk':
        return `/en/dashboard/risks/${entityId}`;
      case 'compliance_requirement':
        return `/en/dashboard/compliance/${entityId}`;
      case 'task':
        return `/en/dashboard/tasks/${entityId}`;
      default:
        return '#';
    }
  };

  // Calculate stats
  const stats = {
    total: executions.length,
    completed: executions.filter((e) => e.status === 'completed').length,
    failed: executions.filter((e) => e.status === 'failed').length,
    inProgress: executions.filter((e) => e.status === 'in_progress').length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading execution history...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workflow History</h1>
        <p className="text-muted-foreground mt-1">
          View and track workflow execution history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="risk">Risk</SelectItem>
                  <SelectItem value="compliance_requirement">Compliance</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Execution History</CardTitle>
          <CardDescription>
            {executions.length} execution{executions.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {executions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No workflow executions found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executions.map((execution) => (
                  <TableRow key={execution.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(execution.status)}
                        <Badge className={getStatusColor(execution.status)}>
                          {execution.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{execution.workflowName}</div>
                        <Badge variant="outline" className={getWorkflowTypeColor(execution.workflowType)}>
                          {execution.workflowType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEntityIcon(execution.entityType)}
                        <Link
                          href={getEntityUrl(execution.entityType, execution.entityId)}
                          className="text-primary hover:underline text-sm"
                        >
                          {execution.entityType.replace('_', ' ')}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      {execution.startedAt ? (
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {execution.completedAt ? (
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(execution.completedAt), { addSuffix: true })}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedExecution(execution)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Execution Details Dialog */}
      <Dialog open={!!selectedExecution} onOpenChange={() => setSelectedExecution(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Execution Details</DialogTitle>
            <DialogDescription>
              {selectedExecution?.workflowName}
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="py-8 text-center">Loading details...</div>
          ) : executionDetails ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(executionDetails.status)}
                    <Badge className={getStatusColor(executionDetails.status)}>
                      {executionDetails.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Workflow Type</div>
                  <Badge variant="outline" className={`mt-1 ${getWorkflowTypeColor(executionDetails.workflowType)}`}>
                    {executionDetails.workflowType}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Entity</div>
                  <div className="flex items-center gap-2 mt-1">
                    {getEntityIcon(executionDetails.entityType)}
                    <Link
                      href={getEntityUrl(executionDetails.entityType, executionDetails.entityId)}
                      className="text-primary hover:underline"
                    >
                      View {executionDetails.entityType.replace('_', ' ')}
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Started</div>
                  <div className="mt-1">
                    {executionDetails.startedAt
                      ? format(new Date(executionDetails.startedAt), 'PPp')
                      : '-'}
                  </div>
                </div>
                {executionDetails.completedAt && (
                  <div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                    <div className="mt-1">
                      {format(new Date(executionDetails.completedAt), 'PPp')}
                    </div>
                  </div>
                )}
                {executionDetails.errorMessage && (
                  <div className="col-span-2">
                    <div className="text-sm text-muted-foreground">Error</div>
                    <div className="mt-1 text-red-600 bg-red-50 p-2 rounded text-sm">
                      {executionDetails.errorMessage}
                    </div>
                  </div>
                )}
              </div>

              {/* Approvals */}
              {executionDetails.approvals && executionDetails.approvals.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Approval Steps</div>
                  <div className="space-y-2">
                    {executionDetails.approvals.map((approval) => (
                      <div
                        key={approval.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                            {approval.stepOrder}
                          </div>
                          <div>
                            <div className="font-medium">{approval.approverName}</div>
                            {approval.comments && (
                              <div className="text-sm text-muted-foreground">
                                "{approval.comments}"
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(approval.status)}
                          <Badge
                            className={
                              approval.status === 'approved'
                                ? 'bg-green-500'
                                : approval.status === 'rejected'
                                  ? 'bg-red-500'
                                  : approval.status === 'pending'
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-500'
                            }
                          >
                            {approval.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}








