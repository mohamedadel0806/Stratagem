'use client';

import { useQuery } from '@tanstack/react-query';
import { governanceApi, ControlObjective, ImplementationStatus } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Calendar, User, FileText, Shield, AlertCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ControlObjectiveMapping } from '@/components/governance/control-objective-mapping';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PolicyExceptionForm } from '@/components/governance/policy-exception-form';
import { AuditLogList } from '@/components/governance/audit-log-list';

const implementationStatusLabels: Record<ImplementationStatus, string> = {
  [ImplementationStatus.NOT_IMPLEMENTED]: 'Not Implemented',
  [ImplementationStatus.PLANNED]: 'Planned',
  [ImplementationStatus.IN_PROGRESS]: 'In Progress',
  [ImplementationStatus.IMPLEMENTED]: 'Implemented',
  [ImplementationStatus.NOT_APPLICABLE]: 'Not Applicable',
};

const implementationStatusColors: Record<ImplementationStatus, string> = {
  [ImplementationStatus.NOT_IMPLEMENTED]: 'destructive',
  [ImplementationStatus.PLANNED]: 'secondary',
  [ImplementationStatus.IN_PROGRESS]: 'default',
  [ImplementationStatus.IMPLEMENTED]: 'default',
  [ImplementationStatus.NOT_APPLICABLE]: 'outline',
};

export default function ControlObjectiveDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const objectiveId = params.id as string;
  const [isExceptionOpen, setIsExceptionOpen] = useState(false);

  const { data: objective, isLoading } = useQuery({
    queryKey: ['control-objective', objectiveId],
    queryFn: () => governanceApi.getControlObjective(objectiveId),
  });

  if (isLoading) {
    return <div className="p-6">Loading control objective...</div>;
  }

  if (!objective) {
    return <div className="p-6">Control objective not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{objective.objective_identifier}</h1>
            <p className="text-muted-foreground mt-1">{objective.statement}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsExceptionOpen(true)} className="text-orange-600 border-orange-200 hover:bg-orange-50">
          <AlertCircle className="h-4 w-4 mr-2" />
          Request Exception
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mappings">Mapped Controls</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{objective.statement}</p>
                </CardContent>
              </Card>

              {objective.rationale && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rationale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{objective.rationale}</p>
                  </CardContent>
                </Card>
              )}

              {objective.domain && (
                <Card>
                  <CardHeader>
                    <CardTitle>Domain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{objective.domain}</Badge>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="mappings">
              <ControlObjectiveMapping objectiveId={objectiveId} />
            </TabsContent>

            <TabsContent value="audit">
              <AuditLogList entityType="ControlObjective" entityId={objectiveId} title="Objective Audit Trail" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                <Badge
                  variant={implementationStatusColors[objective.implementation_status] as any}
                >
                  {implementationStatusLabels[objective.implementation_status]}
                </Badge>
              </div>

              {objective.priority && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Priority</p>
                  <Badge variant="secondary">{objective.priority}</Badge>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Mandatory</p>
                <Badge variant={objective.mandatory ? 'default' : 'outline'}>
                  {objective.mandatory ? 'Yes' : 'No'}
                </Badge>
              </div>

              {objective.target_implementation_date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Target Date</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(objective.target_implementation_date).toLocaleDateString()}
                  </div>
                </div>
              )}

              {objective.actual_implementation_date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Actual Date</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(objective.actual_implementation_date).toLocaleDateString()}
                  </div>
                </div>
              )}

              {objective.responsible_party && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Responsible Party</p>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {objective.responsible_party.first_name} {objective.responsible_party.last_name}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {objective.policy && (
            <Card>
              <CardHeader>
                <CardTitle>Linked Policy</CardTitle>
                <CardDescription>Policy that contains this control objective</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <Link
                      href={`/${locale}/dashboard/governance/policies/${objective.policy.id}`}
                      className="text-sm font-medium hover:underline flex items-center gap-2"
                    >
                      {objective.policy.title}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {objective.policy.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isExceptionOpen} onOpenChange={setIsExceptionOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Policy Exception</DialogTitle>
            <DialogDescription>
              Submit a request for a deviation from objective: <strong>{objective.objective_identifier}</strong>
            </DialogDescription>
          </DialogHeader>
          <PolicyExceptionForm
            exception={{
              entity_id: objectiveId,
              entity_type: 'control_objective',
              exception_type: 'control' as any,
            } as any}
            onSuccess={() => setIsExceptionOpen(false)}
            onCancel={() => setIsExceptionOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


