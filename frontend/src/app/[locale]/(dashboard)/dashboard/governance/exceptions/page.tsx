'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  governanceApi,
  PolicyException,
  ExceptionStatus,
  ExceptionType,
  PolicyExceptionQueryParams,
} from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PolicyExceptionForm } from '@/components/governance/policy-exception-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const typeLabels: Record<ExceptionType, string> = {
  [ExceptionType.POLICY]: 'Policy',
  [ExceptionType.STANDARD]: 'Standard',
  [ExceptionType.CONTROL]: 'Control',
  [ExceptionType.BASELINE]: 'Baseline',
};

export default function PolicyExceptionsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingException, setEditingException] = useState<PolicyException | null>(null);
  const [filters, setFilters] = useState<PolicyExceptionQueryParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['policy-exceptions', filters],
    queryFn: () => governanceApi.getPolicyExceptions(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deletePolicyException(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-exceptions'] });
      toast({
        title: 'Success',
        description: 'Exception deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete exception',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this exception?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (exception: PolicyException) => {
    setEditingException(exception);
    setIsCreateOpen(true);
  };

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/governance/exceptions/${id}`);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    const errorMessage = (error as any)?.response?.data?.message;
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive mb-4">Error loading exceptions</p>
            <p className="text-sm text-muted-foreground">{errorMessage || 'An unexpected error occurred'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const exceptions = data?.data || [];
  const total = data?.total || 0;
  const page = data?.page || 1;
  const limit = data?.limit || 20;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Policy Exceptions</h1>
          <p className="text-muted-foreground mt-1">Request and manage exceptions to policies, standards, and controls</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Request Exception
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value === 'all' ? undefined : (value as ExceptionStatus), page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select
                value={filters.exception_type || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, exception_type: value === 'all' ? undefined : (value as ExceptionType), page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {exceptions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg font-medium mb-2">No Exceptions Found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {Object.keys(filters).length > 2
                  ? 'Try adjusting your filters'
                  : 'Get started by requesting a policy exception'}
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Request Exception
              </Button>
            </CardContent>
          </Card>
        ) : (
          exceptions.map((exception) => (
            <Card key={exception.id} className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{exception.exception_identifier}</CardTitle>
                      <Badge variant={statusColors[exception.status]}>
                        {statusLabels[exception.status]}
                      </Badge>
                      {exception.exception_type && (
                        <Badge variant="outline">{typeLabels[exception.exception_type]}</Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {exception.business_justification}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handleView(exception.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(exception)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(exception.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Requested By</p>
                    <p className="font-medium">
                      {exception.requester
                        ? `${exception.requester.first_name} ${exception.requester.last_name}`
                        : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Request Date</p>
                    <p className="font-medium">
                      {new Date(exception.request_date).toLocaleDateString()}
                    </p>
                  </div>
                  {exception.end_date && (
                    <div>
                      <p className="text-muted-foreground">Expires</p>
                      <p className="font-medium">
                        {new Date(exception.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {exception.approval_date && (
                    <div>
                      <p className="text-muted-foreground">Approved</p>
                      <p className="font-medium">
                        {new Date(exception.approval_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {total > limit && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / limit)}
          onPageChange={(newPage) => setFilters({ ...filters, page: newPage })}
        />
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingException ? 'Edit Exception' : 'Request Policy Exception'}
            </DialogTitle>
            <DialogDescription>
              {editingException
                ? 'Update exception information'
                : 'Request an exception to a policy, standard, control, or baseline'}
            </DialogDescription>
          </DialogHeader>
          <PolicyExceptionForm
            exception={editingException}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingException(null);
              queryClient.invalidateQueries({ queryKey: ['policy-exceptions'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingException(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
