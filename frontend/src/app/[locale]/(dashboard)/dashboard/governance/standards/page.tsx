'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, Standard, StandardQueryParams, StandardStatus } from '@/lib/api/governance';
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
import { StandardForm } from '@/components/governance/standard-form';

const statusLabels: Record<StandardStatus, string> = {
  [StandardStatus.DRAFT]: 'Draft',
  [StandardStatus.IN_REVIEW]: 'In Review',
  [StandardStatus.APPROVED]: 'Approved',
  [StandardStatus.PUBLISHED]: 'Published',
  [StandardStatus.ARCHIVED]: 'Archived',
};

const statusColors: Record<StandardStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [StandardStatus.DRAFT]: 'outline',
  [StandardStatus.IN_REVIEW]: 'secondary',
  [StandardStatus.APPROVED]: 'default',
  [StandardStatus.PUBLISHED]: 'default',
  [StandardStatus.ARCHIVED]: 'outline',
};

export default function StandardsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [filters, setFilters] = useState<StandardQueryParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['standards', filters],
    queryFn: () => governanceApi.getStandards(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteStandard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standards'] });
      toast({
        title: 'Success',
        description: 'Standard deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete standard',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this standard?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (standard: Standard) => {
    setEditingStandard(standard);
    setIsCreateOpen(true);
  };

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/governance/standards/${id}`);
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    setEditingStandard(null);
    queryClient.invalidateQueries({ queryKey: ['standards'] });
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
          <h2 className="text-xl font-semibold">Error loading standards</h2>
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

  const standards = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 20, total: 0, totalPages: 0 };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Standards</h1>
          <p className="text-muted-foreground mt-1">
            Manage standards that specify how to implement control objectives
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Standard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Standards Library</CardTitle>
          <CardDescription>
            {meta.total} standard{meta.total !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableFilters
            filters={[
              {
                key: 'search',
                label: 'Search',
                type: 'text',
                placeholder: 'Search standards...',
              },
              {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: Object.entries(statusLabels).map(([value, label]) => ({
                  value,
                  label,
                })),
              },
            ]}
            values={filters}
            onChange={(newFilters) => setFilters({ ...filters, ...newFilters, page: 1 })}
          />

          <div className="mt-4 space-y-2">
            {standards.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No standards found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Standard
                </Button>
              </div>
            ) : (
              standards.map((standard) => (
                <div
                  key={standard.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{standard.title}</h3>
                        <Badge variant={statusColors[standard.status]}>
                          {statusLabels[standard.status]}
                        </Badge>
                        {standard.version && (
                          <Badge variant="outline">v{standard.version}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {standard.standard_identifier}
                      </p>
                      {standard.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {standard.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        {standard.policy && (
                          <span>Policy: {standard.policy.title}</span>
                        )}
                        {standard.owner && (
                          <span>Owner: {standard.owner.first_name} {standard.owner.last_name}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(standard.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(standard)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(standard.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {meta.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStandard ? 'Edit Standard' : 'Create Standard'}
            </DialogTitle>
            <DialogDescription>
              {editingStandard
                ? 'Update the standard details below'
                : 'Create a new standard to specify how to implement control objectives'}
            </DialogDescription>
          </DialogHeader>
          <StandardForm
            standard={editingStandard || undefined}
            onSuccess={handleCreateSuccess}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingStandard(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


