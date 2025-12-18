'use client';

import { useQuery } from '@tanstack/react-query';
import { governanceApi, Policy, PolicyStatus } from '@/lib/api/governance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft, Calendar, User } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const statusLabels: Record<PolicyStatus, string> = {
  [PolicyStatus.DRAFT]: 'Draft',
  [PolicyStatus.IN_REVIEW]: 'In Review',
  [PolicyStatus.APPROVED]: 'Approved',
  [PolicyStatus.PUBLISHED]: 'Published',
  [PolicyStatus.ARCHIVED]: 'Archived',
};

export default function MyAssignedPoliciesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  const { data, isLoading } = useQuery({
    queryKey: ['my-assigned-policies'],
    queryFn: () => governanceApi.getMyAssignedPolicies(),
  });

  const policies = data?.data || [];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading assigned policies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Assigned Policies</h1>
          <p className="text-muted-foreground mt-1">
            Policies that have been assigned to you
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/governance/policies`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Policies
        </Button>
      </div>

      {policies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No Assigned Policies</p>
            <p className="text-sm text-muted-foreground">
              You don't have any policies assigned to you yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {policies.map((policy: Policy) => (
            <Card key={policy.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      <Link
                        href={`/${locale}/dashboard/governance/policies/${policy.id}`}
                        className="hover:underline"
                      >
                        {policy.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>{policy.policy_type}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      policy.status === PolicyStatus.PUBLISHED
                        ? 'default'
                        : policy.status === PolicyStatus.IN_REVIEW
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {statusLabels[policy.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {policy.published_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Published: {new Date(policy.published_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {policy.owner && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>
                        Owner: {policy.owner.first_name} {policy.owner.last_name}
                      </span>
                    </div>
                  )}
                  {policy.version && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>Version {policy.version}</span>
                    </div>
                  )}
                </div>
                {policy.requires_acknowledgment && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Acknowledgment Required
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Please acknowledge that you have read and understood this policy.
                    </p>
                  </div>
                )}
                <div className="mt-4">
                  <Link href={`/${locale}/dashboard/governance/policies/${policy.id}`}>
                    <Button variant="outline" size="sm">
                      View Policy
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
