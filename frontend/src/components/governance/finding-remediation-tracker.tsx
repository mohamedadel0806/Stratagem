'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { remediationTrackingApi, RemediationTracker, RemediationPriority, CreateRemediationTrackerData, UpdateRemediationTrackerData, CompleteRemediationData } from '@/lib/api/governance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, CheckCircle2, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RemediationTrackerForm } from './remediation-tracker-form';
// Format date helper
const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const priorityLabels: Record<RemediationPriority, string> = {
  [RemediationPriority.CRITICAL]: 'Critical',
  [RemediationPriority.HIGH]: 'High',
  [RemediationPriority.MEDIUM]: 'Medium',
  [RemediationPriority.LOW]: 'Low',
};

const priorityColors: Record<RemediationPriority, string> = {
  [RemediationPriority.CRITICAL]: 'destructive',
  [RemediationPriority.HIGH]: 'destructive',
  [RemediationPriority.MEDIUM]: 'default',
  [RemediationPriority.LOW]: 'secondary',
};

const statusColors: Record<string, string> = {
  on_track: 'default',
  at_risk: 'secondary',
  overdue: 'destructive',
  completed: 'outline',
};

interface FindingRemediationTrackerProps {
  findingId: string;
}

export function FindingRemediationTracker({ findingId }: FindingRemediationTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTracker, setEditingTracker] = useState<RemediationTracker | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['remediation-trackers', findingId],
    queryFn: () => remediationTrackingApi.getTrackersByFinding(findingId),
    enabled: !!findingId,
  });

  const completeMutation = useMutation({
    mutationFn: ({ trackerId, data }: { trackerId: string; data: CompleteRemediationData }) =>
      remediationTrackingApi.completeRemediation(trackerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remediation-trackers', findingId] });
      queryClient.invalidateQueries({ queryKey: ['finding', findingId] });
      toast({
        title: 'Success',
        description: 'Remediation marked as complete',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to complete remediation',
        variant: 'destructive',
      });
    },
  });

  const trackers = data?.data || [];

  const getStatus = (tracker: RemediationTracker): string => {
    if (tracker.completion_date) return 'completed';
    const today = new Date();
    const dueDate = new Date(tracker.sla_due_date);
    const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) return 'overdue';
    if (daysUntil <= 7) return 'at_risk';
    return 'on_track';
  };

  const getDaysUntil = (tracker: RemediationTracker): number => {
    const today = new Date();
    const dueDate = new Date(tracker.sla_due_date);
    return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading remediation trackers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Remediation Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Track remediation progress and SLA compliance
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tracker
        </Button>
      </div>

      {trackers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No Remediation Trackers</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create a remediation tracker to monitor progress and SLA compliance
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Tracker
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {trackers.map((tracker) => {
            const status = getStatus(tracker);
            const daysUntil = getDaysUntil(tracker);

            return (
              <Card key={tracker.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">Remediation Tracker</CardTitle>
                      <Badge variant={priorityColors[tracker.remediation_priority] as any}>
                        {priorityLabels[tracker.remediation_priority]}
                      </Badge>
                      <Badge variant={statusColors[status] as any}>
                        {status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </div>
                    {!tracker.completion_date && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTracker(tracker);
                            setIsCreateOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const notes = prompt('Enter completion notes:');
                            if (notes !== null) {
                              completeMutation.mutate({
                                trackerId: tracker.id,
                                data: {
                                  completion_notes: notes || 'Remediation completed',
                                },
                              });
                            }
                          }}
                          disabled={completeMutation.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Complete
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">SLA Due Date</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {formatDate(tracker.sla_due_date)}
                        </span>
                        {!tracker.completion_date && (
                          <Badge variant={daysUntil < 0 ? 'destructive' : daysUntil <= 7 ? 'secondary' : 'outline'} className="ml-2">
                            {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days remaining`}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {tracker.assigned_to_name && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Assigned To</p>
                        <p className="text-sm">{tracker.assigned_to_name}</p>
                      </div>
                    )}
                    {tracker.completion_date && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Completed</p>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm">
                              {formatDate(tracker.completion_date)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">SLA Status</p>
                          <Badge variant={tracker.sla_met ? 'default' : 'destructive'}>
                            {tracker.sla_met ? 'SLA Met' : 'SLA Missed'}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>

                  {!tracker.completion_date && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-muted-foreground">Progress</p>
                        <span className="text-sm font-medium">{tracker.progress_percent}%</span>
                      </div>
                      <Progress value={tracker.progress_percent} className="h-2" />
                    </div>
                  )}

                  {tracker.remediation_steps && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Remediation Steps</p>
                      <p className="text-sm whitespace-pre-wrap">{tracker.remediation_steps}</p>
                    </div>
                  )}

                  {tracker.progress_notes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Progress Notes</p>
                      <p className="text-sm whitespace-pre-wrap">{tracker.progress_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTracker ? 'Edit Remediation Tracker' : 'Create Remediation Tracker'}
            </DialogTitle>
            <DialogDescription>
              {editingTracker
                ? 'Update remediation tracker information'
                : 'Create a new remediation tracker to monitor progress and SLA compliance'}
            </DialogDescription>
          </DialogHeader>
          <RemediationTrackerForm
            findingId={findingId}
            tracker={editingTracker}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingTracker(null);
              queryClient.invalidateQueries({ queryKey: ['remediation-trackers', findingId] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingTracker(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


