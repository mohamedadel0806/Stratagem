'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/helpers';

interface TagCloudProps {
  tags: Array<{ tag: string; count: number }>;
  onTagClick?: (tag: string) => void;
  maxTags?: number;
  className?: string;
}

export function TagCloud({ tags, onTagClick, maxTags = 50, className }: TagCloudProps) {
  // Calculate size based on count (relative to max count)
  const maxCount = Math.max(...tags.map((t) => t.count), 1);
  const minSize = 0.75;
  const maxSize = 1.5;

  const getTagSize = (count: number) => {
    const ratio = count / maxCount;
    return minSize + (maxSize - minSize) * ratio;
  };

  const displayedTags = tags.slice(0, maxTags);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Tag Cloud</CardTitle>
        <CardDescription>
          Click on a tag to filter influencers. Size indicates usage frequency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {displayedTags.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tags available</p>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center items-center min-h-[200px]">
            {displayedTags.map(({ tag, count }) => (
              <Badge
                key={tag}
                variant="secondary"
                className={cn(
                  'cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors',
                  onTagClick && 'hover:scale-105'
                )}
                style={{
                  fontSize: `${getTagSize(count)}rem`,
                  padding: '0.5rem 0.75rem',
                }}
                onClick={() => onTagClick?.(tag)}
              >
                {tag} ({count})
              </Badge>
            ))}
          </div>
        )}
        {tags.length > maxTags && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Showing {maxTags} of {tags.length} tags
          </p>
        )}
      </CardContent>
    </Card>
  );
}


