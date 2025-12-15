'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { workflowsApi } from '@/lib/api/workflows';
import { Clock, ArrowRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export function PendingApprovalsWidget() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  const { data: pendingApprovals, isLoading } = useQuery({
    queryKey: ['my-pending-approvals'],
    queryFn: () => workflowsApi.getMyPendingApprovals(),
    staleTime: 2 * 60 * 1000, // 2 minutes - approvals don't change that frequently
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Don't retry on 429 errors
      if (error?.response?.status === 429) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const count = pendingApprovals?.length || 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Pending Approvals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{count}</span>
              <Badge variant={count > 0 ? 'secondary' : 'outline'}>
                {count === 0 ? 'All clear' : count > 1 ? 'Items' : 'Item'}
              </Badge>
            </div>
          </div>
          {count > 0 && (
            <p className="text-sm text-muted-foreground">
              You have {count} pending approval{count > 1 ? 's' : ''} requiring your attention.
            </p>
          )}
          {count === 0 && (
            <p className="text-sm text-muted-foreground">
              No pending approvals at this time.
            </p>
          )}
          <Link href={`/${locale}/dashboard/workflows/approvals`}>
            <Button variant={count > 0 ? 'default' : 'outline'} className="w-full" size="sm">
              {count > 0 ? 'Review Approvals' : 'View Approvals'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}




