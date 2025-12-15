'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  governanceApi,
  UnifiedControl,
  UnifiedControlQueryParams,
  ControlType,
  ControlStatus,
  ImplementationStatus,
} from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UnifiedControlForm } from '@/components/governance/unified-control-form';

const controlTypeLabels: Record<ControlType, string> = {
  [ControlType.PREVENTIVE]: 'Preventive',
  [ControlType.DETECTIVE]: 'Detective',
  [ControlType.CORRECTIVE]: 'Corrective',
  [ControlType.COMPENSATING]: 'Compensating',
  [ControlType.ADMINISTRATIVE]: 'Administrative',
  [ControlType.TECHNICAL]: 'Technical',
  [ControlType.PHYSICAL]: 'Physical',
};

const statusLabels: Record<ControlStatus, string> = {
  [ControlStatus.DRAFT]: 'Draft',
  [ControlStatus.ACTIVE]: 'Active',
  [ControlStatus.DEPRECATED]: 'Deprecated',
};

const implementationLabels: Record<ImplementationStatus, string> = {
  [ImplementationStatus.NOT_IMPLEMENTED]: 'Not Implemented',
  [ImplementationStatus.PLANNED]: 'Planned',
  [ImplementationStatus.IN_PROGRESS]: 'In Progress',
  [ImplementationStatus.IMPLEMENTED]: 'Implemented',
  [ImplementationStatus.NOT_APPLICABLE]: 'Not Applicable',
};

export default function UnifiedControlsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingControl, setEditingControl] = useState<UnifiedControl | null>(null);
  const [filters, setFilters] = useState<UnifiedControlQueryParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['unified-controls', filters],
    queryFn: () => governanceApi.getUnifiedControls(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteUnifiedControl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-controls'] });
      toast({
        title: 'Success',
        description: 'Control deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete control',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this control?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (control: UnifiedControl) => {
    setEditingControl(control);
    setIsCreateOpen(true);
  };

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/governance/controls/${id}`);
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
          <h2 className="text-xl font-semibold">Error loading controls</h2>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Unified Controls</h1>
          <p className="text-muted-foreground">Manage unified control library with multi-framework mapping</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Control
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Control Library</CardTitle>
          <CardDescription>View and manage all unified controls</CardDescription>
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
                  key: 'control_type',
                  label: 'Control Type',
                  type: 'select',
                  options: Object.entries(controlTypeLabels).map(([value, label]) => ({ value, label })),
                },
                {
                  key: 'status',
                  label: 'Status',
                  type: 'select',
                  options: Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
                },
                {
                  key: 'implementation_status',
                  label: 'Implementation',
                  type: 'select',
                  options: Object.entries(implementationLabels).map(([value, label]) => ({ value, label })),
                },
                {
                  key: 'domain',
                  label: 'Domain',
                  type: 'text',
                  placeholder: 'e.g., IAM, Network Security',
                },
              ]}
            />

            {/* Table */}
            <div className="border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-semibold">Identifier</th>
                    <th className="p-4 text-left font-semibold">Title</th>
                    <th className="p-4 text-left font-semibold">Type</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Implementation</th>
                    <th className="p-4 text-left font-semibold">Domain</th>
                    <th className="p-4 text-left font-semibold">Owner</th>
                    <th className="p-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((control) => (
                    <tr key={control.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <Badge variant="outline">{control.control_identifier}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{control.title}</div>
                        {control.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">{control.description}</div>
                        )}
                      </td>
                      <td className="p-4">
                        {control.control_type && (
                          <Badge variant="secondary">{controlTypeLabels[control.control_type]}</Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            control.status === ControlStatus.ACTIVE
                              ? 'default'
                              : control.status === ControlStatus.DRAFT
                              ? 'outline'
                              : 'secondary'
                          }
                        >
                          {statusLabels[control.status]}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            control.implementation_status === ImplementationStatus.IMPLEMENTED
                              ? 'default'
                              : control.implementation_status === ImplementationStatus.IN_PROGRESS
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {implementationLabels[control.implementation_status]}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{control.domain || '-'}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {control.control_owner
                          ? `${control.control_owner.first_name} ${control.control_owner.last_name}`
                          : '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(control.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(control)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(control.id)}>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingControl ? 'Edit Control' : 'Create Control'}</DialogTitle>
            <DialogDescription>
              {editingControl ? 'Update control information' : 'Create a new unified control'}
            </DialogDescription>
          </DialogHeader>
          <UnifiedControlForm
            control={editingControl}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingControl(null);
              queryClient.invalidateQueries({ queryKey: ['unified-controls'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingControl(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

