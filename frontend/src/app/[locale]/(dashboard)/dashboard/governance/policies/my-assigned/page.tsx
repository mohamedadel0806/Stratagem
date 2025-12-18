'use client';

import { useQuery } from '@tanstack/react-query';
import { governanceApi, Policy, PolicyStatus } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ArrowLeft, FileText, Clock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const statusLabels: Record<PolicyStatus, string> = {
  [PolicyStatus.DRAFT]: 'Draft',
  [PolicyStatus.IN_REVIEW]: 'In Review',
  [PolicyStatus.APPROVED]: 'Approved',
  [PolicyStatus.PUBLISHED]: 'Published',
  [PolicyStatus.ARCHIVED]: 'Archived',
};

const statusColors: Record<PolicyStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [PolicyStatus.DRAFT]: 'outline',
  [PolicyStatus.IN_REVIEW]: 'secondary',
  [PolicyStatus.APPROVED]: 'default',
  [PolicyStatus.PUBLISHED]: 'default',
  [PolicyStatus.ARCHIVED]: 'outline',
};

export default function MyAssignedPoliciesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-assigned-policies'],
    queryFn: () => governanceApi.getMyAssignedPolicies(),
  });

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/governance/policies/${id}`);
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
            <p className="text-muted-foreground mb-4">Error loading assigned policies</p>
            <Button onClick={() => router.push(`/${locale}/dashboard/governance/policies`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Policies
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const policies = data?.data || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Assigned Policies</h2>
          <p className="text-muted-foreground">Policies that have been assigned to you</p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/governance/policies`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Policies
        </Button>
      </div>

      {/* Policies List */}
      {!policies || policies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Assigned Policies</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any policies assigned to you yet.
            </p>
            <Button onClick={() => router.push(`/${locale}/dashboard/governance/policies`)}>
              Browse All Policies
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{policy.title}</CardTitle>
                    <CardDescription className="text-xs">{policy.policy_type}</CardDescription>
                  </div>
                  <Badge variant={statusColors[policy.status]}>{statusLabels[policy.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {policy.purpose && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{policy.purpose}</p>
                  )}
                  {policy.published_date && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Published: {new Date(policy.published_date).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleView(policy.id)}
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
      )}
    </div>
  );
}
