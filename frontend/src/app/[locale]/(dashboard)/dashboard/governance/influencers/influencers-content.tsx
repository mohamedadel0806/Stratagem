'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, Influencer, InfluencerQueryParams, InfluencerCategory, InfluencerStatus, ApplicabilityStatus } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Search, Hash, X, FileUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InfluencerForm } from '@/components/governance/influencer-form';
import { TagCloud } from '@/components/governance/tag-cloud';
import { InfluencerImportDialog } from '@/components/governance/influencer-import-dialog';

const categoryLabels: Record<InfluencerCategory, string> = {
  [InfluencerCategory.INTERNAL]: 'Internal',
  [InfluencerCategory.CONTRACTUAL]: 'Contractual',
  [InfluencerCategory.STATUTORY]: 'Statutory',
  [InfluencerCategory.REGULATORY]: 'Regulatory',
  [InfluencerCategory.INDUSTRY_STANDARD]: 'Industry Standard',
};

const statusLabels: Record<InfluencerStatus, string> = {
  [InfluencerStatus.ACTIVE]: 'Active',
  [InfluencerStatus.PENDING]: 'Pending',
  [InfluencerStatus.SUPERSEDED]: 'Superseded',
  [InfluencerStatus.RETIRED]: 'Retired',
};

const applicabilityLabels: Record<ApplicabilityStatus, string> = {
  [ApplicabilityStatus.APPLICABLE]: 'Applicable',
  [ApplicabilityStatus.NOT_APPLICABLE]: 'Not Applicable',
  [ApplicabilityStatus.UNDER_REVIEW]: 'Under Review',
};

export function InfluencersPageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(null);
  const [showTagCloud, setShowTagCloud] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [filters, setFilters] = useState<InfluencerQueryParams>({
    page: 1,
    limit: 20,
  });

  // Initialize filters from URL params
  useEffect(() => {
    const tagsParam = searchParams.get('tags');
    if (tagsParam) {
      setFilters((prev) => ({
        ...prev,
        tags: [tagsParam],
      }));
    }
  }, [searchParams]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['influencers', filters],
    queryFn: () => governanceApi.getInfluencers(filters),
  });

  const { data: tagStats = [] } = useQuery({
    queryKey: ['influencer-tag-statistics'],
    queryFn: () => governanceApi.getTagStatistics(),
  });

  const { data: allTags = [] } = useQuery({
    queryKey: ['influencer-tags'],
    queryFn: () => governanceApi.getAllTags(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteInfluencer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['influencers'] });
      toast({
        title: 'Success',
        description: 'Influencer deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete influencer',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this influencer?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (influencer: Influencer) => {
    setEditingInfluencer(influencer);
    setIsCreateOpen(true);
  };

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/governance/influencers/${id}`);
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
          <h2 className="text-xl font-semibold">Error loading influencers</h2>
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
      <div className="flex justify-between items-center" data-testid="influencers-header">
        <div>
          <h1 className="text-3xl font-bold" data-testid="influencers-page-title">Influencers</h1>
          <p className="text-muted-foreground">Manage governance influencers and regulatory requirements</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowTagCloud(!showTagCloud)}
            data-testid="show-tags-button"
          >
            <Hash className="mr-2 h-4 w-4" />
            {showTagCloud ? 'Hide' : 'Show'} Tags
          </Button>
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/governance/influencers/tags`)} data-testid="manage-tags-button">
            <Hash className="mr-2 h-4 w-4" />
            Manage Tags
          </Button>
          <Button variant="outline" onClick={() => setIsImportOpen(true)} data-testid="import-influencers-button">
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} data-testid="add-influencer-button">
            <Plus className="mr-2 h-4 w-4" />
            Add Influencer
          </Button>
        </div>
      </div>

      {/* Tag Cloud */}
      {showTagCloud && (
        <TagCloud
          tags={tagStats}
          onTagClick={(tag) => {
            setFilters((prev) => {
              const currentTags = prev.tags || [];
              const isSelected = currentTags.includes(tag);
              return {
                ...prev,
                tags: isSelected ? currentTags.filter((t) => t !== tag) : [...currentTags, tag],
                page: 1,
              };
            });
          }}
        />
      )}

      {/* Active Tag Filters */}
      {filters.tags && filters.tags.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Filtered by tags:</span>
              {filters.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        tags: prev.tags?.filter((t) => t !== tag),
                        page: 1,
                      }));
                    }}
                    className="ml-1 rounded-full hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters((prev) => {
                    const { tags, ...rest } = prev;
                    return { ...rest, page: 1 };
                  });
                }}
              >
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Influencer Registry</CardTitle>
          <CardDescription>View and manage all governance influencers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <DataTableFilters
              searchPlaceholder="Search by name, authority, or description..."
              searchValue={filters.search || ''}
              onSearchChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
              filters={[
                {
                  key: 'category',
                  label: 'Category',
                  options: Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
                  value: filters.category || '',
                  onChange: (value) => setFilters({ ...filters, category: value, page: 1 }),
                },
                {
                  key: 'status',
                  label: 'Status',
                  options: Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
                  value: filters.status || '',
                  onChange: (value) => setFilters({ ...filters, status: value, page: 1 }),
                },
                {
                  key: 'applicability_status',
                  label: 'Applicability',
                  options: Object.entries(applicabilityLabels).map(([value, label]) => ({ value, label })),
                  value: filters.applicability_status || '',
                  onChange: (value) => setFilters({ ...filters, applicability_status: value, page: 1 }),
                },
              ]}
              onClear={() => setFilters({ page: 1, limit: 20 })}
            />

            {/* Table */}
            <div className="border rounded-lg">
              <table className="w-full" data-testid="influencers-table">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-semibold" data-testid="influencers-table-header-name">Name</th>
                    <th className="p-4 text-left font-semibold" data-testid="influencers-table-header-category">Category</th>
                    <th className="p-4 text-left font-semibold" data-testid="influencers-table-header-status">Status</th>
                    <th className="p-4 text-left font-semibold" data-testid="influencers-table-header-applicability">Applicability</th>
                    <th className="p-4 text-left font-semibold" data-testid="influencers-table-header-tags">Tags</th>
                    <th className="p-4 text-left font-semibold" data-testid="influencers-table-header-authority">Issuing Authority</th>
                    <th className="p-4 text-left font-semibold" data-testid="influencers-table-header-next-review">Next Review</th>
                    <th className="p-4 text-right font-semibold" data-testid="influencers-table-header-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((influencer) => (
                    <tr key={influencer.id} className="border-b hover:bg-muted/50" data-testid={`influencer-row-${influencer.id}`}>
                      <td className="p-4">
                        <div className="font-medium">{influencer.name}</div>
                        {influencer.reference_number && (
                          <div className="text-sm text-muted-foreground">{influencer.reference_number}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{categoryLabels[influencer.category]}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            influencer.status === InfluencerStatus.ACTIVE
                              ? 'default'
                              : influencer.status === InfluencerStatus.PENDING
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {statusLabels[influencer.status]}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            influencer.applicability_status === ApplicabilityStatus.APPLICABLE
                              ? 'default'
                              : influencer.applicability_status === ApplicabilityStatus.NOT_APPLICABLE
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {applicabilityLabels[influencer.applicability_status]}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {influencer.tags && influencer.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {influencer.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                onClick={() => {
                                  setFilters((prev) => ({
                                    ...prev,
                                    tags: prev.tags?.includes(tag) ? prev.tags : [...(prev.tags || []), tag],
                                    page: 1,
                                  }));
                                }}
                              >
                                {tag}
                              </Badge>
                            ))}
                            {influencer.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{influencer.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {influencer.issuing_authority || '-'}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {influencer.next_review_date
                          ? new Date(influencer.next_review_date).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(influencer.id)}
                            data-testid={`influencer-view-button-${influencer.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(influencer)}
                            data-testid={`influencer-edit-button-${influencer.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(influencer.id)}
                            data-testid={`influencer-delete-button-${influencer.id}`}
                          >
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="influencer-dialog">
          <DialogHeader>
            <DialogTitle>
              {editingInfluencer ? 'Edit Influencer' : 'Create Influencer'}
            </DialogTitle>
            <DialogDescription>
              {editingInfluencer
                ? 'Update influencer information'
                : 'Add a new governance influencer to the registry'}
            </DialogDescription>
          </DialogHeader>
          <InfluencerForm
            influencer={editingInfluencer}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingInfluencer(null);
              queryClient.invalidateQueries({ queryKey: ['influencers'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingInfluencer(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <InfluencerImportDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
      />
    </div>
  );
}


