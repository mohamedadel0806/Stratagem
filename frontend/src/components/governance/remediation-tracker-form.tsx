'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { remediationTrackingApi, RemediationTracker, RemediationPriority, CreateRemediationTrackerData, UpdateRemediationTrackerData } from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const trackerSchema = z.object({
  remediation_priority: z.nativeEnum(RemediationPriority),
  sla_due_date: z.string().min(1, 'SLA due date is required'),
  remediation_steps: z.string().optional(),
  assigned_to_id: z.string().uuid().optional().or(z.literal('')),
  progress_percent: z.number().min(0).max(100).optional(),
  progress_notes: z.string().optional(),
});

type TrackerFormData = z.infer<typeof trackerSchema>;

interface RemediationTrackerFormProps {
  findingId: string;
  tracker?: RemediationTracker | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const priorityOptions = Object.entries(RemediationPriority).map(([key, value]) => ({
  value,
  label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
}));

export function RemediationTrackerForm({ findingId, tracker, onSuccess, onCancel }: RemediationTrackerFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TrackerFormData>({
    resolver: zodResolver(trackerSchema),
    defaultValues: tracker
      ? {
          remediation_priority: tracker.remediation_priority,
          sla_due_date: tracker.sla_due_date ? new Date(tracker.sla_due_date).toISOString().split('T')[0] : '',
          remediation_steps: tracker.remediation_steps || '',
          assigned_to_id: tracker.assigned_to_id || '',
          progress_percent: tracker.progress_percent || 0,
          progress_notes: tracker.progress_notes || '',
        }
      : {
          remediation_priority: RemediationPriority.MEDIUM,
          progress_percent: 0,
        },
  });

  const mutation = useMutation({
    mutationFn: (data: TrackerFormData) => {
      if (tracker) {
        const updateData: UpdateRemediationTrackerData = {
          remediation_priority: data.remediation_priority,
          sla_due_date: data.sla_due_date,
          remediation_steps: data.remediation_steps || undefined,
          assigned_to_id: data.assigned_to_id || undefined,
          progress_percent: data.progress_percent,
          progress_notes: data.progress_notes || undefined,
        };
        return remediationTrackingApi.updateTracker(tracker.id, updateData);
      } else {
        const createData: CreateRemediationTrackerData = {
          remediation_priority: data.remediation_priority,
          sla_due_date: data.sla_due_date,
          remediation_steps: data.remediation_steps || undefined,
          assigned_to_id: data.assigned_to_id || undefined,
        };
        return remediationTrackingApi.createTracker(findingId, createData);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: tracker ? 'Remediation tracker updated successfully' : 'Remediation tracker created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['remediation-trackers', findingId] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save remediation tracker',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: TrackerFormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="remediation_priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sla_due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SLA Due Date *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assigned_to_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned To (User ID)</FormLabel>
              <FormControl>
                <Input placeholder="Enter user UUID (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {tracker && (
          <>
            <FormField
              control={form.control}
              name="progress_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      value={field.value || 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="progress_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add progress notes..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="remediation_steps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remediation Steps</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the remediation steps..." {...field} rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {tracker ? 'Update Tracker' : 'Create Tracker'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
