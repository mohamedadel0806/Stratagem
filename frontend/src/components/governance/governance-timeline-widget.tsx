'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UpcomingReview {
  id: string;
  entityName: string;
  entityType: string;
  dueDate: string;
  daysUntilDue: number;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

interface GovernanceTimelineWidgetProps {
  reviews: UpcomingReview[];
  maxItems?: number;
}

export function GovernanceTimelineWidget({ reviews, maxItems = 5 }: GovernanceTimelineWidgetProps) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'outline';
    }
  };

  const getDaysColor = (days: number) => {
    if (days <= 3) return 'text-red-600 font-bold';
    if (days <= 7) return 'text-amber-600 font-bold';
    return 'text-gray-600';
  };

  const sortedReviews = [...reviews]
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
    .slice(0, maxItems);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Reviews
        </CardTitle>
        <CardDescription>Next reviews and assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedReviews.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">No upcoming reviews</p>
          ) : (
            sortedReviews.map((review, index) => (
              <div key={review.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${getDaysColor(review.daysUntilDue)}`}>
                    {review.daysUntilDue}d
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{review.entityName}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.entityType} • Due {formatDistanceToNow(new Date(review.dueDate), { addSuffix: true })}
                  </p>
                  {review.assignee && (
                    <p className="text-xs text-muted-foreground">Assigned to {review.assignee}</p>
                  )}
                </div>
                {review.priority && (
                  <Badge className={getPriorityColor(review.priority)} variant="outline">
                    {review.priority}
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
