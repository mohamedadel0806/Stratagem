'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  governanceApi,
  Finding,
  FindingSeverity,
  FindingStatus,
  FindingQueryParams,
} from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FindingForm } from '@/components/governance/finding-form';

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

export default function FindingsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFinding, setEditingFinding] = useState<Finding | null>(null);
  const [filters, setFilters] = useState<FindingQueryParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['findings', filters],
    queryFn: () => governanceApi.getFindings(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteFinding(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['findings'] });
      toast({
        title: 'Success',
        description: 'Finding deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete finding',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this finding?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (finding: Finding) => {
    setEditingFinding(finding);
    setIsCreateOpen(true);
  };

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/governance/findings/${id}`);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || 'Unknown error';
    const statusCode = (error as any)?.response?.status;

    return (
      <div className="p-6">
        <div className="text-red-500 space-y-2">
          <h2 className="text-xl font-semibold">Error loading findings</h2>
          <p>{errorMessage}</p>
          {statusCode === 401 && (
            <p className="text-sm text-muted-foreground">
              Please make sure you are logged in and have the necessary permissions.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center" data-testid="findings-header">
        <div>
          <h1 className="text-3xl font-bold" data-testid="findings-page-title">Findings</h1>
          <p className="text-muted-foreground">Manage assessment findings and remediation tracking</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} data-testid="add-finding-button">
          <Plus className="mr-2 h-4 w-4" />
          New Finding
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Findings Repository</CardTitle>
          <CardDescription>View and manage all assessment findings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <DataTableFilters
              filters={filters}
              onFiltersChange={setFilters}
              filterConfig={[
                {
                  key: 'search',
                  label: 'Search',
                  type: 'text',
                  placeholder: 'Search by identifier, title, or description...',
                },
                {
                  key: 'severity',
                  label: 'Severity',
                  type: 'select',
                  options: Object.entries(severityLabels).map(([value, label]) => ({ value, label })),
                },
                {
                  key: 'status',
                  label: 'Status',
                  type: 'select',
                  options: Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
                },
              ]}
              data-testid="findings-filters"
            />

            {/* Table */}
            <div className="border rounded-lg">
              <table className="w-full" data-testid="findings-table">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-semibold" data-testid="findings-table-header-identifier">Identifier</th>
                    <th className="p-4 text-left font-semibold" data-testid="findings-table-header-title">Title</th>
                    <th className="p-4 text-left font-semibold" data-testid="findings-table-header-severity">Severity</th>
                    <th className="p-4 text-left font-semibold" data-testid="findings-table-header-status">Status</th>
                    <th className="p-4 text-left font-semibold" data-testid="findings-table-header-finding-date">Finding Date</th>
                    <th className="p-4 text-left font-semibold" data-testid="findings-table-header-remediation-due">Remediation Due</th>
                    <th className="p-4 text-left font-semibold" data-testid="findings-table-header-remediation-owner">Remediation Owner</th>
                    <th className="p-4 text-left font-semibold" data-testid="findings-table-header-control">Control</th>
                    <th className="p-4 text-right font-semibold" data-testid="findings-table-header-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((finding) => (
                    <tr key={finding.id} className="border-b hover:bg-muted/50" data-testid={`finding-row-${finding.id}`}>
                      <td className="p-4">
                        <Badge variant="outline">{finding.finding_identifier}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{finding.title}</div>
                        {finding.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">{finding.description}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant={severityColors[finding.severity] as any}>
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          {severityLabels[finding.severity]}
                        </Badge>
                      </td>
                      <td className="p-4">
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
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {finding.finding_date ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(finding.finding_date).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {finding.remediation_due_date ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(finding.remediation_due_date).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {finding.remediation_owner
                          ? `${finding.remediation_owner.first_name} ${finding.remediation_owner.last_name}`
                          : '-'}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {finding.unified_control?.control_identifier || '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(finding.id)} data-testid={`finding-view-button-${finding.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(finding)} data-testid={`finding-edit-button-${finding.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(finding.id)} data-testid={`finding-delete-button-${finding.id}`}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data?.meta && (
              <Pagination
                currentPage={data.meta.page}
                totalPages={data.meta.totalPages}
                totalItems={data.meta.total}
                itemsPerPage={data.meta.limit}
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="finding-dialog">
          <DialogHeader>
            <DialogTitle>{editingFinding ? 'Edit Finding' : 'Create Finding'}</DialogTitle>
            <DialogDescription>
              {editingFinding ? 'Update finding information' : 'Create a new finding'}
            </DialogDescription>
          </DialogHeader>
          <FindingForm
            finding={editingFinding}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingFinding(null);
              queryClient.invalidateQueries({ queryKey: ['findings'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingFinding(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

