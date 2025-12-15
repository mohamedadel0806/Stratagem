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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  governanceApi,
  CreateFindingData,
  Finding,
  FindingSeverity,
  FindingStatus,
} from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';

const findingSchema = z.object({
  finding_identifier: z.string().min(1, 'Identifier is required').max(100),
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().min(1, 'Description is required'),
  severity: z.nativeEnum(FindingSeverity),
  finding_date: z.string().optional(),
  status: z.nativeEnum(FindingStatus).optional(),
  assessment_id: z.string().uuid().optional().or(z.literal('')),
  unified_control_id: z.string().uuid().optional().or(z.literal('')),
  remediation_owner_id: z.string().uuid().optional().or(z.literal('')),
  remediation_plan: z.string().optional(),
  remediation_due_date: z.string().optional(),
  retest_required: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

type FindingFormData = z.infer<typeof findingSchema>;

interface FindingFormProps {
  finding?: Finding | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function FindingForm({ finding, onSuccess, onCancel }: FindingFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FindingFormData>({
    resolver: zodResolver(findingSchema),
    defaultValues: finding
      ? {
          finding_identifier: finding.finding_identifier,
          title: finding.title,
          description: finding.description,
          severity: finding.severity,
          finding_date: finding.finding_date,
          status: finding.status,
          assessment_id: finding.assessment_id,
          unified_control_id: finding.unified_control_id,
          remediation_owner_id: finding.remediation_owner_id,
          remediation_plan: finding.remediation_plan,
          remediation_due_date: finding.remediation_due_date,
          retest_required: finding.retest_required,
          tags: finding.tags,
        }
      : {
          status: FindingStatus.OPEN,
          severity: FindingSeverity.MEDIUM,
          retest_required: false,
        },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateFindingData) => {
      if (finding) {
        return governanceApi.updateFinding(finding.id, data);
      }
      return governanceApi.createFinding(data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: finding ? 'Finding updated successfully' : 'Finding created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['findings'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save finding',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: FindingFormData) => {
    mutation.mutate(data as CreateFindingData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="finding_identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finding Identifier *</FormLabel>
                <FormControl>
                  <Input placeholder="FIND-2024-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="MFA not fully implemented" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed description of the finding..." rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={FindingSeverity.CRITICAL}>Critical</SelectItem>
                    <SelectItem value={FindingSeverity.HIGH}>High</SelectItem>
                    <SelectItem value={FindingSeverity.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={FindingSeverity.LOW}>Low</SelectItem>
                    <SelectItem value={FindingSeverity.INFO}>Informational</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={FindingStatus.OPEN}>Open</SelectItem>
                    <SelectItem value={FindingStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={FindingStatus.RESOLVED}>Resolved</SelectItem>
                    <SelectItem value={FindingStatus.CLOSED}>Closed</SelectItem>
                    <SelectItem value={FindingStatus.ACCEPTED}>Risk Accepted</SelectItem>
                    <SelectItem value={FindingStatus.REJECTED}>False Positive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finding_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finding Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="remediation_plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remediation Plan</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the remediation plan..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="remediation_due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remediation Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="retest_required"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Retest Required</FormLabel>
                  <p className="text-sm text-muted-foreground">Mark if retesting is required after remediation</p>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : finding ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}




