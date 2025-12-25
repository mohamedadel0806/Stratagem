'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  governanceApi,
  Evidence,
  EvidenceType,
  EvidenceStatus,
  EvidenceQueryParams,
} from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, FileText, Calendar, Download, Archive } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EvidenceForm } from '@/components/governance/evidence-form';
import { EvidencePackageDialog } from '@/components/governance/evidence-package-dialog';

const evidenceTypeLabels: Record<EvidenceType, string> = {
  [EvidenceType.POLICY_DOCUMENT]: 'Policy Document',
  [EvidenceType.CONFIGURATION_SCREENSHOT]: 'Configuration Screenshot',
  [EvidenceType.SYSTEM_LOG]: 'System Log',
  [EvidenceType.SCAN_REPORT]: 'Scan Report',
  [EvidenceType.TEST_RESULT]: 'Test Result',
  [EvidenceType.CERTIFICATION]: 'Certification',
  [EvidenceType.TRAINING_RECORD]: 'Training Record',
  [EvidenceType.MEETING_MINUTES]: 'Meeting Minutes',
  [EvidenceType.EMAIL_CORRESPONDENCE]: 'Email Correspondence',
  [EvidenceType.CONTRACT]: 'Contract',
  [EvidenceType.OTHER]: 'Other',
};

const statusLabels: Record<EvidenceStatus, string> = {
  [EvidenceStatus.DRAFT]: 'Draft',
  [EvidenceStatus.UNDER_REVIEW]: 'Under Review',
  [EvidenceStatus.APPROVED]: 'Approved',
  [EvidenceStatus.EXPIRED]: 'Expired',
  [EvidenceStatus.REJECTED]: 'Rejected',
};

export default function EvidencePage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<Evidence | null>(null);
  const [filters, setFilters] = useState<EvidenceQueryParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['evidence', filters],
    queryFn: () => governanceApi.getEvidence(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteEvidence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      toast({
        title: 'Success',
        description: 'Evidence deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete evidence',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this evidence?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (evidence: Evidence) => {
    setEditingEvidence(evidence);
    setIsCreateOpen(true);
  };

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/governance/evidence/${id}`);
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
          <h2 className="text-xl font-semibold">Error loading evidence</h2>
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
      <div className="flex justify-between items-center" data-testid="evidence-header">
        <div>
          <h1 className="text-3xl font-bold" data-testid="evidence-page-title">Evidence</h1>
          <p className="text-muted-foreground">Manage evidence repository for controls and assessments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPackageOpen(true)} data-testid="generate-evidence-package-button">
            <Archive className="mr-2 h-4 w-4" />
            Generate Package
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} data-testid="add-evidence-button">
            <Plus className="mr-2 h-4 w-4" />
            Add Evidence
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evidence Repository</CardTitle>
          <CardDescription>View and manage all evidence items</CardDescription>
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
                  key: 'evidence_type',
                  label: 'Evidence Type',
                  type: 'select',
                  options: Object.entries(evidenceTypeLabels).map(([value, label]) => ({ value, label })),
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
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full min-w-[1200px]" data-testid="evidence-table">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-semibold whitespace-nowrap" data-testid="evidence-table-header-identifier">Identifier</th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap" data-testid="evidence-table-header-title">Title</th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap" data-testid="evidence-table-header-type">Type</th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap" data-testid="evidence-table-header-status">Status</th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap" data-testid="evidence-table-header-file">File</th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap" data-testid="evidence-table-header-collection-date">Collection Date</th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap" data-testid="evidence-table-header-valid-until">Valid Until</th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap" data-testid="evidence-table-header-collector">Collector</th>
                    <th className="p-4 text-right font-semibold whitespace-nowrap" data-testid="evidence-table-header-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((evidence) => (
                      <tr key={evidence.id} className="border-b hover:bg-muted/50" data-testid={`evidence-row-${evidence.id}`}>
                      <td className="p-4 whitespace-nowrap">
                        <Badge variant="outline">{evidence.evidence_identifier}</Badge>
                      </td>
                      <td className="p-4 min-w-[200px]">
                        <div className="font-medium">{evidence.title}</div>
                        {evidence.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">{evidence.description}</div>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <Badge variant="secondary">{evidenceTypeLabels[evidence.evidence_type]}</Badge>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <Badge
                          variant={
                            evidence.status === EvidenceStatus.APPROVED
                              ? 'default'
                              : evidence.status === EvidenceStatus.UNDER_REVIEW
                              ? 'secondary'
                              : evidence.status === EvidenceStatus.EXPIRED || evidence.status === EvidenceStatus.REJECTED
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {statusLabels[evidence.status]}
                        </Badge>
                      </td>
                      <td className="p-4 min-w-[150px]">
                        {evidence.filename ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate max-w-[120px]">{evidence.filename}</span>
                            {evidence.file_size && (
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                ({typeof evidence.file_size === 'string' 
                                  ? (parseInt(evidence.file_size) / 1024).toFixed(1)
                                  : (evidence.file_size / 1024).toFixed(1)} KB)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                        {evidence.collection_date ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span>{new Date(evidence.collection_date).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                        {evidence.valid_until_date ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span>{new Date(evidence.valid_until_date).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                        {evidence.collector
                          ? `${evidence.collector.firstName || ''} ${evidence.collector.lastName || ''}`.trim() || evidence.collector.email || '-'
                          : '-'}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(evidence.id)} data-testid={`evidence-view-button-${evidence.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(evidence)} data-testid={`evidence-edit-button-${evidence.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(evidence.id)} data-testid={`evidence-delete-button-${evidence.id}`}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-muted-foreground whitespace-nowrap">
                        No evidence found. Click "Add Evidence" to create your first evidence item.
                      </td>
                    </tr>
                  )}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="evidence-dialog">
          <DialogHeader>
            <DialogTitle>{editingEvidence ? 'Edit Evidence' : 'Create Evidence'}</DialogTitle>
            <DialogDescription>
              {editingEvidence ? 'Update evidence information' : 'Create a new evidence item'}
            </DialogDescription>
          </DialogHeader>
          <EvidenceForm
            evidence={editingEvidence}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingEvidence(null);
              queryClient.invalidateQueries({ queryKey: ['evidence'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingEvidence(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Package Dialog */}
      <EvidencePackageDialog
        open={isPackageOpen}
        onOpenChange={setIsPackageOpen}
      />
    </div>
  );
}

