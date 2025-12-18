'use client';

import { useQuery } from '@tanstack/react-query';
import { governanceApi, SOP, SOPQueryParams, SOPStatus, SOPCategory } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ArrowLeft, FileText, CheckCircle2, Clock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { DataTableFilters } from '@/components/filters/data-table-filters';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

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

export default function MyAssignedSOPsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const [filters, setFilters] = useState<SOPQueryParams>({
    page: 1,
    limit: 20,
  });
  const [sortBy, setSortBy] = useState<string>('created_at:DESC');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-assigned-sops', { ...filters, search: searchQuery, sort: sortBy }],
    queryFn: () => governanceApi.getMyAssignedSOPs({ ...filters, search: searchQuery, sort: sortBy }),
  });

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/governance/sops/${id}`);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Error loading assigned SOPs</p>
            <Button onClick={() => router.push(`/${locale}/dashboard/governance/sops`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to SOPs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Assigned SOPs</h2>
          <p className="text-muted-foreground">SOPs that have been assigned to you</p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/governance/sops`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All SOPs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search SOPs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFilters({ ...filters, page: 1 });
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value === 'all' ? undefined : (value as SOPStatus), page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue />
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
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value === 'all' ? undefined : (value as SOPCategory), page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at:DESC">Newest First</SelectItem>
                  <SelectItem value="created_at:ASC">Oldest First</SelectItem>
                  <SelectItem value="title:ASC">Title A-Z</SelectItem>
                  <SelectItem value="title:DESC">Title Z-A</SelectItem>
                  <SelectItem value="published_date:DESC">Recently Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SOPs List */}
      {!data || data.data.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Assigned SOPs</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any SOPs assigned to you yet.
            </p>
            <Button onClick={() => router.push(`/${locale}/dashboard/governance/sops`)}>
              Browse All SOPs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((sop) => (
              <Card key={sop.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{sop.title}</CardTitle>
                      <CardDescription className="text-xs">{sop.sop_identifier}</CardDescription>
                    </div>
                    <Badge variant={statusColors[sop.status]}>{statusLabels[sop.status]}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sop.category && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Category:</span>
                        <Badge variant="outline">{categoryLabels[sop.category]}</Badge>
                      </div>
                    )}
                    {sop.purpose && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{sop.purpose}</p>
                    )}
                    {sop.published_date && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Published: {new Date(sop.published_date).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleView(sop.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data.meta.totalPages > 1 && (
            <Pagination
              currentPage={data.meta.page}
              totalPages={data.meta.totalPages}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          )}
        </>
      )}
    </div>
  );
}
