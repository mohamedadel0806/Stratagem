'use client';

import { useQuery } from '@tanstack/react-query';
import { governanceApi } from '@/lib/api/governance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TagCloud } from '@/components/governance/tag-cloud';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Hash } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function TagManagementPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tagStats = [], isLoading } = useQuery({
    queryKey: ['influencer-tag-statistics'],
    queryFn: () => governanceApi.getTagStatistics(),
  });

  const { data: allTags = [] } = useQuery({
    queryKey: ['influencer-tags'],
    queryFn: () => governanceApi.getAllTags(),
  });

  const filteredTags = tagStats.filter(({ tag }) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagClick = (tag: string) => {
    router.push(`/${locale}/dashboard/governance/influencers?tags=${encodeURIComponent(tag)}`);
  };

  const totalInfluencers = tagStats.reduce((sum, { count }) => sum + count, 0);
  const uniqueTags = allTags.length;
  const mostUsedTag = tagStats[0];

  if (isLoading) {
    return <div className="p-6">Loading tags...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tag Management</h1>
          <p className="text-muted-foreground">Manage and explore tags for influencers</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueTags}</div>
            <p className="text-xs text-muted-foreground">Unique tags in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tagged Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInfluencers}</div>
            <p className="text-xs text-muted-foreground">Total tag assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used Tag</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostUsedTag ? mostUsedTag.tag : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {mostUsedTag ? `Used ${mostUsedTag.count} times` : 'No tags yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tag Cloud */}
      <TagCloud tags={tagStats} onTagClick={handleTagClick} />

      {/* Tag List */}
      <Card>
        <CardHeader>
          <CardTitle>All Tags</CardTitle>
          <CardDescription>Browse and manage all tags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {filteredTags.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {searchQuery ? 'No tags found matching your search' : 'No tags available'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTags.map(({ tag, count }) => (
                  <div
                    key={tag}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => handleTagClick(tag)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{tag}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {count} {count === 1 ? 'influencer' : 'influencers'}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


