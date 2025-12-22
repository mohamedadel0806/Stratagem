'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, SOP } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, Plus, Edit, Trash2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SOPScheduleManagerProps {
  sopId: string;
  sop?: SOP;
}

const frequencyOptions = [
  { value: 'WEEKLY', label: 'Weekly', cronExpression: '0 9 ? * MON' },
  { value: 'BIWEEKLY', label: 'Bi-weekly', cronExpression: '0 9 ? * MON/2' },
  { value: 'MONTHLY', label: 'Monthly', cronExpression: '0 9 1 * ?' },
  { value: 'QUARTERLY', label: 'Quarterly', cronExpression: '0 9 1 1,4,7,10 ?' },
  { value: 'SEMIANNUALLY', label: 'Semi-annually', cronExpression: '0 9 1 1,7 ?' },
  { value: 'ANNUALLY', label: 'Annually', cronExpression: '0 9 1 1 ?' },
];

export function SOPScheduleManager({ sopId, sop }: SOPScheduleManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [frequency, setFrequency] = useState('MONTHLY');
  const [nextReviewDate, setNextReviewDate] = useState(
    sop?.next_review_date ? new Date(sop.next_review_date).toISOString().split('T')[0] : ''
  );

  // Fetch schedules for this SOP
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['sop-schedules', sopId],
    queryFn: () => governanceApi.getSOPSchedules?.({ sop_id: sopId }),
    enabled: !!sopId,
  });

  // Create schedule mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      const selectedFreq = frequencyOptions.find((f) => f.value === frequency);
      return governanceApi.createSOPSchedule?.({
        sop_id: sopId,
        next_review_date: nextReviewDate ? new Date(nextReviewDate).toISOString() : undefined,
        frequency,
        cron_expression: selectedFreq?.cronExpression,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Schedule created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['sop-schedules', sopId] });
      setIsOpen(false);
      setFrequency('MONTHLY');
      setNextReviewDate('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create schedule',
        variant: 'destructive',
      });
    },
  });

  // Delete schedule mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteSOPSchedule?.(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Schedule deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['sop-schedules', sopId] });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete schedule',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Review Schedules</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage automated review reminders for this SOP
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      {/* Schedules List */}
      {schedules && schedules.length > 0 ? (
        <div className="grid gap-4">
          {schedules.map((schedule: any) => (
            <Card key={schedule.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {frequencyOptions.find((f) => f.value === schedule.frequency)?.label ||
                          schedule.frequency}
                      </span>
                    </div>

                    {schedule.next_review_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Next Review: {new Date(schedule.next_review_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {schedule.cron_expression && (
                      <div className="text-xs text-muted-foreground bg-muted p-2 rounded font-mono">
                        Cron: {schedule.cron_expression}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Delete this schedule?')) {
                          setDeleteId(schedule.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No schedules configured</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create a schedule to enable automated review reminders
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Schedule Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Review Schedule</DialogTitle>
            <DialogDescription>
              Set up an automated schedule for reviewing this SOP
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Frequency */}
            <div>
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Selected schedule: {frequencyOptions.find((f) => f.value === frequency)?.cronExpression}
              </p>
            </div>

            {/* Next Review Date */}
            <div>
              <Label>Next Review Date</Label>
              <Input
                type="date"
                value={nextReviewDate}
                onChange={(e) => setNextReviewDate(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending || !frequency}
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this schedule? This will stop automated review reminders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SOPScheduleManager;
