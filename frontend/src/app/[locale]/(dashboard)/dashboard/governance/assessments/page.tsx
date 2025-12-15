'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  governanceApi,
  Assessment,
  AssessmentType,
  AssessmentStatus,
  AssessmentQueryParams,
} from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, FileText, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AssessmentForm } from '@/components/governance/assessment-form';

const assessmentTypeLabels: Record<AssessmentType, string> = {
  [AssessmentType.IMPLEMENTATION]: 'Implementation',
  [AssessmentType.DESIGN_EFFECTIVENESS]: 'Design Effectiveness',
  [AssessmentType.OPERATING_EFFECTIVENESS]: 'Operating Effectiveness',
  [AssessmentType.COMPLIANCE]: 'Compliance',
};

const statusLabels: Record<AssessmentStatus, string> = {
  [AssessmentStatus.NOT_STARTED]: 'Not Started',
  [AssessmentStatus.IN_PROGRESS]: 'In Progress',
  [AssessmentStatus.UNDER_REVIEW]: 'Under Review',
  [AssessmentStatus.COMPLETED]: 'Completed',
  [AssessmentStatus.CANCELLED]: 'Cancelled',
};

export default function AssessmentsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [filters, setFilters] = useState<AssessmentQueryParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['assessments', filters],
    queryFn: () => governanceApi.getAssessments(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast({
        title: 'Success',
        description: 'Assessment deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete assessment',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this assessment?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setIsCreateOpen(true);
  };

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/governance/assessments/${id}`);
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
          <h2 className="text-xl font-semibold">Error loading assessments</h2>
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
          <h1 className="text-3xl font-bold">Assessments</h1>
          <p className="text-muted-foreground">Manage control assessments and compliance evaluations</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Assessment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment List</CardTitle>
          <CardDescription>View and manage all assessments</CardDescription>
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
                  placeholder: 'Search by identifier, name, or description...',
                },
                {
                  key: 'assessment_type',
                  label: 'Assessment Type',
                  type: 'select',
                  options: Object.entries(assessmentTypeLabels).map(([value, label]) => ({ value, label })),
                },
                {
                  key: 'status',
                  label: 'Status',
                  type: 'select',
                  options: Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
                },
              ]}
            />

            {/* Table */}
            <div className="border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-semibold">Identifier</th>
                    <th className="p-4 text-left font-semibold">Name</th>
                    <th className="p-4 text-left font-semibold">Type</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Progress</th>
                    <th className="p-4 text-left font-semibold">Score</th>
                    <th className="p-4 text-left font-semibold">Dates</th>
                    <th className="p-4 text-left font-semibold">Lead Assessor</th>
                    <th className="p-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((assessment) => {
                    const progress =
                      assessment.controls_total && assessment.controls_total > 0
                        ? Math.round((assessment.controls_assessed / assessment.controls_total) * 100)
                        : 0;
                    return (
                      <tr key={assessment.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <Badge variant="outline">{assessment.assessment_identifier}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{assessment.name}</div>
                          {assessment.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">{assessment.description}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">{assessmentTypeLabels[assessment.assessment_type]}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              assessment.status === AssessmentStatus.COMPLETED
                                ? 'default'
                                : assessment.status === AssessmentStatus.IN_PROGRESS
                                ? 'secondary'
                                : assessment.status === AssessmentStatus.CANCELLED
                                ? 'destructive'
                                : 'outline'
                            }
                          >
                            {statusLabels[assessment.status]}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                              {assessment.controls_assessed}/{assessment.controls_total || 0}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          {assessment.overall_score !== undefined && assessment.overall_score !== null ? (
                            (() => {
                              const score = Number(assessment.overall_score);
                              if (isNaN(score)) {
                                return <span className="text-sm text-muted-foreground">-</span>;
                              }
                              return (
                                <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>
                                  {score.toFixed(0)}%
                                </Badge>
                              );
                            })()
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          <div className="flex flex-col gap-1">
                            {assessment.start_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(assessment.start_date).toLocaleDateString()}</span>
                              </div>
                            )}
                            {assessment.end_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(assessment.end_date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {assessment.lead_assessor
                            ? `${assessment.lead_assessor.first_name} ${assessment.lead_assessor.last_name}`
                            : '-'}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleView(assessment.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(assessment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(assessment.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
            <DialogTitle>{editingAssessment ? 'Edit Assessment' : 'Create Assessment'}</DialogTitle>
            <DialogDescription>
              {editingAssessment ? 'Update assessment information' : 'Create a new assessment'}
            </DialogDescription>
          </DialogHeader>
          <AssessmentForm
            assessment={editingAssessment}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingAssessment(null);
              queryClient.invalidateQueries({ queryKey: ['assessments'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingAssessment(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

