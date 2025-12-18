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

  const { data, isLoading, error } = useQuery({
    queryKey: ['sops', { ...filters, search: searchQuery, sort: sortBy }],
    queryFn: () => governanceApi.getSOPs({ ...filters, search: searchQuery, sort: sortBy }),
  });

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
      setSearchSuggestions(Array.from(suggestions).slice(0, 5));
      setShowSuggestions(suggestions.size > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, sops]);

  const handleSaveSearch = () => {
    const name = prompt('Enter a name for this search:');
    if (name && searchQuery) {
      const newSearch = {
        name,
        query: searchQuery,
        filters: { ...filters },
      };
      const updated = [...savedSearches, newSearch];
      setSavedSearches(updated);
      localStorage.setItem('sop-saved-searches', JSON.stringify(updated));
      toast({
        title: 'Success',
        description: 'Search saved successfully',
      });
    }
  };

  const handleLoadSavedSearch = (savedSearch: { name: string; query: string; filters: SOPQueryParams }) => {
    setSearchQuery(savedSearch.query);
    setFilters(savedSearch.filters);
    toast({
      title: 'Success',
      description: `Loaded search: ${savedSearch.name}`,
    });
  };

  const handleDeleteSavedSearch = (index: number) => {
    const updated = savedSearches.filter((_, i) => i !== index);
    setSavedSearches(updated);
    localStorage.setItem('sop-saved-searches', JSON.stringify(updated));
    toast({
      title: 'Success',
      description: 'Search deleted',
    });
  };

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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at:DESC">Newest First</SelectItem>
                  <SelectItem value="created_at:ASC">Oldest First</SelectItem>
                  <SelectItem value="title:ASC">Title (A-Z)</SelectItem>
                  <SelectItem value="title:DESC">Title (Z-A)</SelectItem>
                  <SelectItem value="updated_at:DESC">Recently Updated</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none border-x"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'category' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setViewMode('category');
                    setSelectedTag(null);
                  }}
                  className="rounded-none border-x"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'tags' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setViewMode('tags');
                    setSelectedTag(null);
                  }}
                  className="rounded-l-none"
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Enhanced Search Bar with Suggestions */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Search SOPs by title, identifier, description, or content..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setFilters({ ...filters, page: 1 });
                  }}
                  onFocus={() => setShowSuggestions(searchQuery.length > 1 && searchSuggestions.length > 0)}
                  className="pl-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({ ...filters, page: 1 });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setShowSuggestions(false);
                        }}
                      >
                        {highlightText(suggestion, searchQuery)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {searchQuery && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save Search
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Save Current Search</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleSaveSearch}
                      >
                        <BookmarkCheck className="h-4 w-4 mr-2" />
                        Save as New
                      </Button>
                      {savedSearches.length > 0 && (
                        <div className="space-y-1 mt-4">
                          <p className="text-sm font-medium">Saved Searches</p>
                          {savedSearches.map((saved, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 hover:bg-accent rounded"
                            >
                              <button
                                onClick={() => handleLoadSavedSearch(saved)}
                                className="flex-1 text-left text-sm"
                              >
                                {saved.name}
                              </button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleDeleteSavedSearch(idx)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {/* Advanced Filters */}
            <DataTableFilters
              filters={[
                {
                  key: 'status',
                  label: 'Status',
                  type: 'select',
                  options: [
                    { value: '', label: 'All Statuses' },
                    ...Object.entries(statusLabels).map(([value, label]) => ({
                      value,
                      label,
                    })),
                  ],
                },
                {
                  key: 'category',
                  label: 'Category',
                  type: 'select',
                  options: [
                    { value: '', label: 'All Categories' },
                    ...Object.entries(categoryLabels).map(([value, label]) => ({
                      value,
                      label,
                    })),
                  ],
                },
                {
                  key: 'owner_id',
                  label: 'Owner',
                  type: 'text',
                  placeholder: 'Owner ID...',
                },
              ]}
              values={filters}
              onChange={(newFilters) => setFilters({ ...filters, ...newFilters, page: 1 })}
            />
          </div>

          <div className="mt-4">
            {filteredSOPs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No SOPs found</p>
                {selectedTag && (
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      setSelectedTag(null);
                      setViewMode('list');
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Tag Filter
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First SOP
                </Button>
              </div>
            ) : viewMode === 'tags' ? (
              // Tags Browse View
              <div className="space-y-4">
                {selectedTag ? (
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTag(null)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filter
                    </Button>
                    <Badge variant="default" className="text-sm">
                      <Tag className="h-3 w-3 mr-1" />
                      {selectedTag} ({sopsByTag[selectedTag]?.length || 0} SOPs)
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Browse by Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {allTags.length > 0 ? (
                        allTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-accent text-sm"
                            onClick={() => setSelectedTag(tag)}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag} ({sopsByTag[tag]?.length || 0})
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No tags available</p>
                      )}
                    </div>
                  </div>
                )}
                {selectedTag && sopsByTag[selectedTag] && (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sopsByTag[selectedTag].map((sop) => (
                      <Card key={sop.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleView(sop.id)}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base line-clamp-2">
                              {highlightText(sop.title, searchQuery)}
                            </CardTitle>
                            <Badge variant={statusColors[sop.status]} className="ml-2 shrink-0">
                              {statusLabels[sop.status]}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            {highlightText(sop.sop_identifier, searchQuery)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {sop.purpose && (
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                              {highlightText(sop.purpose, searchQuery)}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            {sop.owner && (
                              <span>{sop.owner.first_name} {sop.owner.last_name}</span>
                            )}
                            {sop.controls && sop.controls.length > 0 && (
                              <span>{sop.controls.length} control{sop.controls.length !== 1 ? 's' : ''}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : viewMode === 'category' ? (
              // Category Browse View
              <Tabs defaultValue={Object.keys(sopsByCategory)[0] || ''} className="w-full">
                <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(sopsByCategory).length}, minmax(0, 1fr))` }}>
                  {Object.keys(sopsByCategory).map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {categoryLabels[category as SOPCategory] || category} ({sopsByCategory[category].length})
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.entries(sopsByCategory).map(([category, categorySOPs]) => (
                  <TabsContent key={category} value={category} className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {categorySOPs.map((sop) => (
                        <Card key={sop.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleView(sop.id)}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-base line-clamp-2">
                                {highlightText(sop.title, searchQuery)}
                              </CardTitle>
                              <Badge variant={statusColors[sop.status]} className="ml-2 shrink-0">
                                {statusLabels[sop.status]}
                              </Badge>
                            </div>
                            <CardDescription className="text-xs">
                              {highlightText(sop.sop_identifier, searchQuery)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {sop.purpose && (
                              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                {highlightText(sop.purpose, searchQuery)}
                              </p>
                            )}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              {sop.owner && (
                                <span>{sop.owner.first_name} {sop.owner.last_name}</span>
                              )}
                              {sop.controls && sop.controls.length > 0 && (
                                <span>{sop.controls.length} control{sop.controls.length !== 1 ? 's' : ''}</span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : viewMode === 'grid' ? (
              // Grid View
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSOPs.map((sop) => (
                  <Card key={sop.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base line-clamp-2">
                          {highlightText(sop.title, searchQuery)}
                        </CardTitle>
                        <Badge variant={statusColors[sop.status]} className="ml-2 shrink-0">
                          {statusLabels[sop.status]}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {highlightText(sop.sop_identifier, searchQuery)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {sop.purpose && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {highlightText(sop.purpose, searchQuery)}
                        </p>
                      )}
                      {sop.tags && sop.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {sop.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-accent"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(tag);
                                setViewMode('tags');
                              }}
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {sop.category && (
                            <Badge variant="outline" className="text-xs">
                              {categoryLabels[sop.category]}
                            </Badge>
                          )}
                          {sop.version && (
                            <Badge variant="outline" className="text-xs">v{sop.version}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleView(sop.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(sop)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // List View (default)
              <div className="space-y-2">
                {filteredSOPs.map((sop) => (
                  <div
                    key={sop.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {highlightText(sop.title, searchQuery)}
                          </h3>
                          <Badge variant={statusColors[sop.status]}>
                            {statusLabels[sop.status]}
                          </Badge>
                          {sop.category && (
                            <Badge variant="outline">
                              {categoryLabels[sop.category]}
                            </Badge>
                          )}
                          {sop.version && (
                            <Badge variant="outline">v{sop.version}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {highlightText(sop.sop_identifier, searchQuery)}
                        </p>
                        {sop.purpose && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {highlightText(sop.purpose, searchQuery)}
                          </p>
                        )}
                        {sop.tags && sop.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {sop.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs cursor-pointer hover:bg-accent"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTag(tag);
                                  setViewMode('tags');
                                }}
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          {sop.owner && (
                            <span>Owner: {sop.owner.first_name} {sop.owner.last_name}</span>
                          )}
                          {sop.controls && sop.controls.length > 0 && (
                            <span>{sop.controls.length} control{sop.controls.length !== 1 ? 's' : ''} linked</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(sop.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(sop)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(sop.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!selectedTag && meta.totalPages > 1 && (
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
              {editingSOP ? 'Edit SOP' : 'Create SOP'}
            </DialogTitle>
            <DialogDescription>
              {editingSOP
                ? 'Update the SOP details below'
                : 'Create a new standard operating procedure'}
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
