'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, Policy, PolicyQueryParams, PolicyStatus, ReviewFrequency } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PolicyForm } from '@/components/governance/policy-form';

const statusLabels: Record<PolicyStatus, string> = {
  [PolicyStatus.DRAFT]: 'Draft',
  [PolicyStatus.IN_REVIEW]: 'In Review',
  [PolicyStatus.APPROVED]: 'Approved',
  [PolicyStatus.PUBLISHED]: 'Published',
  [PolicyStatus.ARCHIVED]: 'Archived',
};

const statusColors: Record<PolicyStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [PolicyStatus.DRAFT]: 'outline',
  [PolicyStatus.IN_REVIEW]: 'secondary',
  [PolicyStatus.APPROVED]: 'default',
  [PolicyStatus.PUBLISHED]: 'default',
  [PolicyStatus.ARCHIVED]: 'outline',
};

export default function PoliciesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [filters, setFilters] = useState<PolicyQueryParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['policies', filters],
    queryFn: () => governanceApi.getPolicies(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deletePolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast({
        title: 'Success',
        description: 'Policy deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete policy',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this policy?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setIsCreateOpen(true);
  };

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/governance/policies/${id}`);
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
          <h2 className="text-xl font-semibold">Error loading policies</h2>
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
      <div className="flex justify-between items-center" data-testid="policies-header">
        <div>
          <h1 className="text-3xl font-bold" data-testid="policies-page-title">Policies</h1>
          <p className="text-muted-foreground">Manage governance policies and control objectives</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/governance/policies/my-assigned`)} data-testid="my-assigned-policies-button">
            <FileText className="h-4 w-4 mr-2" />
            My Assigned Policies
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} data-testid="add-policy-button">
            <Plus className="mr-2 h-4 w-4" />
            Add Policy
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Policy Registry</CardTitle>
          <CardDescription>View and manage all governance policies</CardDescription>
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
                  placeholder: 'Search by title or content...',
                },
                {
                  key: 'status',
                  label: 'Status',
                  type: 'select',
                  options: Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
                },
                {
                  key: 'policy_type',
                  label: 'Policy Type',
                  type: 'text',
                  placeholder: 'e.g., Information Security',
                },
              ]}
              data-testid="policies-filters"
            />

            {/* Table */}
            <div className="border rounded-lg">
              <table className="w-full" data-testid="policies-table">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-semibold" data-testid="policies-table-header-title">Title</th>
                    <th className="p-4 text-left font-semibold" data-testid="policies-table-header-type">Type</th>
                    <th className="p-4 text-left font-semibold" data-testid="policies-table-header-version">Version</th>
                    <th className="p-4 text-left font-semibold" data-testid="policies-table-header-status">Status</th>
                    <th className="p-4 text-left font-semibold" data-testid="policies-table-header-objectives">Control Objectives</th>
                    <th className="p-4 text-left font-semibold" data-testid="policies-table-header-owner">Owner</th>
                    <th className="p-4 text-left font-semibold" data-testid="policies-table-header-next-review">Next Review</th>
                    <th className="p-4 text-right font-semibold" data-testid="policies-table-header-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((policy) => (
                    <tr key={policy.id} className="border-b hover:bg-muted/50" data-testid={`policy-row-${policy.id}`}>
                      <td className="p-4">
                        <div className="font-medium">{policy.title}</div>
                        {policy.purpose && (
                          <div className="text-sm text-muted-foreground line-clamp-1">{policy.purpose}</div>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{policy.policy_type}</td>
                      <td className="p-4">
                        <Badge variant="outline">v{policy.version}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={statusColors[policy.status]}>{statusLabels[policy.status]}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              policy.control_objectives && policy.control_objectives.length > 0
                                ? 'default'
                                : 'outline'
                            }
                            className="text-xs"
                          >
                            {policy.control_objectives?.length || 0} Objectives
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {policy.owner
                          ? `${policy.owner.first_name} ${policy.owner.last_name}`
                          : '-'}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {policy.next_review_date
                          ? new Date(policy.next_review_date).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(policy.id)} data-testid={`policy-view-button-${policy.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(policy)} data-testid={`policy-edit-button-${policy.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(policy.id)} data-testid={`policy-delete-button-${policy.id}`}>
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
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="policy-dialog">
          <DialogHeader>
            <DialogTitle>{editingPolicy ? 'Edit Policy' : 'Create Policy'}</DialogTitle>
            <DialogDescription>
              {editingPolicy ? 'Update policy information' : 'Create a new governance policy'}
            </DialogDescription>
          </DialogHeader>
          <PolicyForm
            policy={editingPolicy}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingPolicy(null);
              queryClient.invalidateQueries({ queryKey: ['policies'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingPolicy(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

