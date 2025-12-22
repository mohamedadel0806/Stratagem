'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, SOP, SOPQueryParams, SOPStatus, SOPCategory } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Search, Filter, Grid3x3, List, SortAsc, SortDesc, FileText, X, Bookmark, BookmarkCheck, Tag } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { highlightText, extractAllTags } from '@/lib/utils/search-highlight';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SOPForm } from '@/components/governance/sop-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusLabels: Record<SOPStatus, string> = {
  [SOPStatus.DRAFT]: 'Draft',
  [SOPStatus.IN_REVIEW]: 'In Review',
  [SOPStatus.APPROVED]: 'Approved',
  [SOPStatus.PUBLISHED]: 'Published',
  [SOPStatus.ARCHIVED]: 'Archived',
};

const statusColors: Record<SOPStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [SOPStatus.DRAFT]: 'outline',
  [SOPStatus.IN_REVIEW]: 'secondary',
  [SOPStatus.APPROVED]: 'default',
  [SOPStatus.PUBLISHED]: 'default',
  [SOPStatus.ARCHIVED]: 'outline',
};

const categoryLabels: Record<SOPCategory, string> = {
  [SOPCategory.OPERATIONAL]: 'Operational',
  [SOPCategory.SECURITY]: 'Security',
  [SOPCategory.COMPLIANCE]: 'Compliance',
  [SOPCategory.THIRD_PARTY]: 'Third Party',
};

export default function SOPsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State hooks
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSOP, setEditingSOP] = useState<SOP | null>(null);
  const [filters, setFilters] = useState<SOPQueryParams>({
    page: 1,
    limit: 20,
  });
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'category' | 'tags'>('list');
  const [sortBy, setSortBy] = useState<string>('created_at:DESC');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [savedSearches, setSavedSearches] = useState<Array<{ name: string; query: string; filters: SOPQueryParams }>>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['sops', { ...filters, search: searchQuery, sort: sortBy }],
    queryFn: () => governanceApi.getSOPs({ ...filters, search: searchQuery, sort: sortBy }),
  });

  // Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteSOP(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sops'] });
      toast({
        title: 'Success',
        description: 'SOP deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete SOP',
        variant: 'destructive',
      });
    },
  });

  const sops = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 20, total: 0, totalPages: 0 };

  // Extract all tags from SOPs
  const allTags = useMemo(() => extractAllTags(sops), [sops]);

  // Group SOPs by category for browse view
  const sopsByCategory = sops.reduce((acc, sop) => {
    const category = sop.category || 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(sop);
    return acc;
  }, {} as Record<string, SOP[]>);

  // Group SOPs by tags for tag browse view
  const sopsByTag = useMemo(() => {
    const grouped: Record<string, SOP[]> = {};
    sops.forEach((sop) => {
      if (sop.tags && sop.tags.length > 0) {
        sop.tags.forEach((tag) => {
          if (!grouped[tag]) {
            grouped[tag] = [];
          }
          grouped[tag].push(sop);
        });
      }
    });
    return grouped;
  }, [sops]);

  // Filter SOPs by selected tag
  const filteredSOPs = useMemo(() => {
    if (selectedTag) {
      return sops.filter((sop) => sop.tags && sop.tags.includes(selectedTag));
    }
    return sops;
  }, [sops, selectedTag]);

  // Load saved searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sop-saved-searches');
      if (saved) {
        try {
          setSavedSearches(JSON.parse(saved));
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, []);

  // Generate search suggestions based on SOP titles and identifiers
  useEffect(() => {
    if (searchQuery.length > 1) {
      const suggestions = new Set<string>();
      sops.forEach((sop) => {
        if (sop.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(sop.title);
        }
        if (sop.sop_identifier.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(sop.sop_identifier);
        }
      });
      setSearchSuggestions(Array.from(suggestions).slice(0, 10));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, sops]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this SOP?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (sop: SOP) => {
    setEditingSOP(sop);
    setIsCreateOpen(true);
  };

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/governance/sops/${id}`);
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    setEditingSOP(null);
    queryClient.invalidateQueries({ queryKey: ['sops'] });
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
          <h2 className="text-xl font-semibold">Error loading SOPs</h2>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Standard Operating Procedures</h1>
          <p className="text-muted-foreground mt-1">
            Manage operational procedures for implementing controls
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/governance/sops/my-assigned`)}>
            <FileText className="h-4 w-4 mr-2" />
            My Assigned SOPs
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create SOP
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SOPs Library</CardTitle>
              <CardDescription>
                {meta.total} SOP{meta.total !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'category' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('category')}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'tags' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tags')}
              >
                <Tag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search SOPs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 hover:bg-muted"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setShowSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Advanced Search */}
            {showAdvancedSearch && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filters.status || ''} onValueChange={(value) => setFilters({ ...filters, status: value as SOPStatus || undefined })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={filters.category || ''} onValueChange={(value) => setFilters({ ...filters, category: value as SOPCategory || undefined })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All categories</SelectItem>
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at:DESC">Newest First</SelectItem>
                      <SelectItem value="created_at:ASC">Oldest First</SelectItem>
                      <SelectItem value="title:ASC">Title A-Z</SelectItem>
                      <SelectItem value="title:DESC">Title Z-A</SelectItem>
                      <SelectItem value="status:ASC">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={() => setFilters({ page: 1, limit: 20 })}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Content */}
            {viewMode === 'list' && (
              <div className="space-y-2">
                {filteredSOPs.map((sop) => (
                  <Card key={sop.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{highlightText(sop.title, searchQuery)}</h3>
                            <Badge variant={statusColors[sop.status]}>
                              {statusLabels[sop.status]}
                            </Badge>
                            {sop.category && (
                              <Badge variant="outline">
                                {categoryLabels[sop.category]}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {highlightText(sop.sop_identifier, searchQuery)}
                          </p>
                          {sop.tags && sop.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {sop.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {sop.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{sop.tags.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(sop.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(sop.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(sop)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(sop.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSOPs.map((sop) => (
                  <Card key={sop.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold line-clamp-2">{highlightText(sop.title, searchQuery)}</h3>
                          <p className="text-sm text-muted-foreground">{highlightText(sop.sop_identifier, searchQuery)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={statusColors[sop.status]}>
                            {statusLabels[sop.status]}
                          </Badge>
                          {sop.category && (
                            <Badge variant="outline">
                              {categoryLabels[sop.category]}
                            </Badge>
                          )}
                        </div>
                        {sop.tags && sop.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {sop.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {sop.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{sop.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(sop.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(sop)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {viewMode === 'category' && (
              <div className="space-y-6">
                {Object.entries(sopsByCategory).map(([category, categorySops]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-3 capitalize">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categorySops.map((sop) => (
                        <Card key={sop.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <h4 className="font-medium line-clamp-1">{highlightText(sop.title, searchQuery)}</h4>
                            <p className="text-sm text-muted-foreground">{highlightText(sop.sop_identifier, searchQuery)}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={statusColors[sop.status]} className="text-xs">
                                {statusLabels[sop.status]}
                              </Badge>
                              <Button variant="ghost" size="sm" onClick={() => handleView(sop.id)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'tags' && (
              <div className="space-y-6">
                {Object.entries(sopsByTag).map(([tag, tagSops]) => (
                  <div key={tag}>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4" />
                      <h3 className="text-lg font-semibold">{tag}</h3>
                      <Badge variant="secondary">{tagSops.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tagSops.map((sop) => (
                        <Card key={sop.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <h4 className="font-medium line-clamp-1">{highlightText(sop.title, searchQuery)}</h4>
                            <p className="text-sm text-muted-foreground">{highlightText(sop.sop_identifier, searchQuery)}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={statusColors[sop.status]} className="text-xs">
                                {statusLabels[sop.status]}
                              </Badge>
                              <Button variant="ghost" size="sm" onClick={() => handleView(sop.id)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={(page) => setFilters({ ...filters, page })}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSOP ? 'Edit SOP' : 'Create SOP'}</DialogTitle>
            <DialogDescription>
              {editingSOP ? 'Update the SOP details below.' : 'Fill in the details to create a new SOP.'}
            </DialogDescription>
          </DialogHeader>
          <SOPForm
            sop={editingSOP || undefined}
            onSuccess={handleCreateSuccess}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingSOP(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
