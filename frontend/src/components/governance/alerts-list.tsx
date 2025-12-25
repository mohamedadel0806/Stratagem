'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertOctagon,
  Info,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Check,
  X,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { governanceApi, Alert, AlertStatus, AlertSeverity, AlertType } from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AlertsListProps {
  showDashboard?: boolean;
  maxItems?: number;
}

export const AlertsList: React.FC<AlertsListProps> = ({ showDashboard = false, maxItems }) => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(maxItems || 10);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<AlertStatus | ''>('');
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | ''>('');
  const [filterType, setFilterType] = useState<AlertType | ''>('');
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['alerts', page, limit, search, filterStatus, filterSeverity, filterType],
    queryFn: async () => {
      return await governanceApi.getAlerts({
        page,
        limit,
        search: search || undefined,
        status: filterStatus || undefined,
        severity: filterSeverity || undefined,
        type: filterType || undefined,
      });
    },
    staleTime: 30000,
  });

  const handleAcknowledge = async (id: string) => {
    try {
      await governanceApi.acknowledgeAlert(id);
      toast({
        title: 'Alert acknowledged',
        description: 'The alert has been marked as acknowledged.',
      });
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to acknowledge alert',
        variant: 'destructive',
      });
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await governanceApi.resolveAlert(id);
      toast({
        title: 'Alert resolved',
        description: 'The alert has been marked as resolved.',
      });
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to resolve alert',
        variant: 'destructive',
      });
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await governanceApi.dismissAlert(id);
      toast({
        title: 'Alert dismissed',
        description: 'The alert has been dismissed.',
      });
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to dismiss alert',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;
    try {
      await governanceApi.deleteAlert(id);
      toast({
        title: 'Alert deleted',
        description: 'The alert has been permanently deleted.',
      });
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete alert',
        variant: 'destructive',
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedAlerts.size === data?.alerts.length) {
      setSelectedAlerts(new Set());
    } else {
      const allIds = new Set(data?.alerts.map((a) => a.id) || []);
      setSelectedAlerts(allIds);
    }
  };

  const handleSelectAlert = (id: string) => {
    const newSelected = new Set(selectedAlerts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAlerts(newSelected);
  };

  const handleBulkAcknowledge = async () => {
    if (selectedAlerts.size === 0) return;
    try {
      for (const id of selectedAlerts) {
        await governanceApi.acknowledgeAlert(id);
      }
      toast({
        title: 'Alerts acknowledged',
        description: `${selectedAlerts.size} alert(s) marked as acknowledged.`,
      });
      setSelectedAlerts(new Set());
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to acknowledge some alerts',
        variant: 'destructive',
      });
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return <AlertOctagon className="h-4 w-4 text-red-600" />;
      case AlertSeverity.HIGH:
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case AlertSeverity.MEDIUM:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case AlertSeverity.LOW:
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return 'bg-red-100 text-red-800';
      case AlertSeverity.HIGH:
        return 'bg-orange-100 text-orange-800';
      case AlertSeverity.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case AlertSeverity.LOW:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.ACTIVE:
        return <Bell className="h-4 w-4 text-blue-600" />;
      case AlertStatus.ACKNOWLEDGED:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case AlertStatus.RESOLVED:
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case AlertStatus.DISMISSED:
        return <X className="h-4 w-4 text-gray-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.ACTIVE:
        return 'bg-blue-100 text-blue-800';
      case AlertStatus.ACKNOWLEDGED:
        return 'bg-yellow-100 text-yellow-800';
      case AlertStatus.RESOLVED:
        return 'bg-green-100 text-green-800';
      case AlertStatus.DISMISSED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
            <p>Failed to load alerts. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const alerts = data?.alerts || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
        <CardDescription>
          {total} alert{total !== 1 ? 's' : ''} found
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-9"
          />
          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value as AlertStatus | '');
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value={AlertStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={AlertStatus.ACKNOWLEDGED}>Acknowledged</SelectItem>
              <SelectItem value={AlertStatus.RESOLVED}>Resolved</SelectItem>
              <SelectItem value={AlertStatus.DISMISSED}>Dismissed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterSeverity}
            onValueChange={(value) => {
              setFilterSeverity(value as AlertSeverity | '');
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All severities</SelectItem>
              <SelectItem value={AlertSeverity.CRITICAL}>Critical</SelectItem>
              <SelectItem value={AlertSeverity.HIGH}>High</SelectItem>
              <SelectItem value={AlertSeverity.MEDIUM}>Medium</SelectItem>
              <SelectItem value={AlertSeverity.LOW}>Low</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterType}
            onValueChange={(value) => {
              setFilterType(value as AlertType | '');
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              <SelectItem value={AlertType.POLICY_REVIEW_OVERDUE}>Policy Review Overdue</SelectItem>
              <SelectItem value={AlertType.CONTROL_ASSESSMENT_PAST_DUE}>Control Assessment Past Due</SelectItem>
              <SelectItem value={AlertType.SOP_EXECUTION_FAILURE}>SOP Execution Failure</SelectItem>
              <SelectItem value={AlertType.AUDIT_FINDING}>Audit Finding</SelectItem>
              <SelectItem value={AlertType.COMPLIANCE_VIOLATION}>Compliance Violation</SelectItem>
              <SelectItem value={AlertType.RISK_THRESHOLD_EXCEEDED}>Risk Threshold Exceeded</SelectItem>
              <SelectItem value={AlertType.CUSTOM}>Custom</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              setLimit(parseInt(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedAlerts.size > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3">
            <span className="text-sm text-blue-900">
              {selectedAlerts.size} alert{selectedAlerts.size !== 1 ? 's' : ''} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkAcknowledge}
              className="ml-auto"
            >
              <Check className="mr-2 h-4 w-4" />
              Mark as Acknowledged
            </Button>
          </div>
        )}

        {/* Alerts Table */}
        {alerts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center">
            <Bell className="mx-auto mb-2 h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-600">No alerts found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        checked={selectedAlerts.size === alerts.length && alerts.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow
                      key={alert.id}
                      className={
                        selectedAlerts.has(alert.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedAlerts.has(alert.id)}
                          onChange={() => handleSelectAlert(alert.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="w-10">
                        {getSeverityIcon(alert.severity)}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/governance/alerts/${alert.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {alert.title}
                        </Link>
                        {alert.description && (
                          <p className="text-xs text-gray-600">{alert.description.substring(0, 60)}...</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs capitalize text-gray-600">
                          {alert.type.replace(/_/g, ' ')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(alert.status)}
                          <Badge className={getStatusBadge(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        {format(new Date(alert.createdAt), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/governance/alerts/${alert.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {alert.status === AlertStatus.ACTIVE && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleAcknowledge(alert.id)}
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  Acknowledge
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleResolve(alert.id)}
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Resolve
                                </DropdownMenuItem>
                              </>
                            )}
                            {alert.status !== AlertStatus.DISMISSED && (
                              <DropdownMenuItem
                                onClick={() => handleDismiss(alert.id)}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Dismiss
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(alert.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {page} of {totalPages} ({total} total)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
