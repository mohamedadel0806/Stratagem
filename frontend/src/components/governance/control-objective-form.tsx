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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  governanceApi,
  CreateControlObjectiveData,
  ControlObjective,
  ImplementationStatus,
} from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';

const controlObjectiveSchema = z.object({
  objective_identifier: z.string().min(1, 'Identifier is required').max(100),
  statement: z.string().min(1, 'Statement is required'),
  rationale: z.string().optional(),
  domain: z.string().max(200).optional(),
  priority: z.string().max(50).optional(),
  mandatory: z.boolean().optional(),
  responsible_party_id: z.string().uuid().optional().or(z.literal('')),
  implementation_status: z.nativeEnum(ImplementationStatus).optional(),
  target_implementation_date: z.string().optional(),
  display_order: z.number().int().optional(),
});

type ControlObjectiveFormData = z.infer<typeof controlObjectiveSchema>;

interface ControlObjectiveFormProps {
  policyId: string;
  objective?: ControlObjective | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ControlObjectiveForm({
  policyId,
  objective,
  onSuccess,
  onCancel,
}: ControlObjectiveFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ControlObjectiveFormData>({
    resolver: zodResolver(controlObjectiveSchema),
    defaultValues: objective
      ? {
          objective_identifier: objective.objective_identifier,
          statement: objective.statement,
          rationale: objective.rationale,
          domain: objective.domain,
          priority: objective.priority,
          mandatory: objective.mandatory,
          responsible_party_id: objective.responsible_party_id,
          implementation_status: objective.implementation_status,
          target_implementation_date: objective.target_implementation_date,
          display_order: objective.display_order,
        }
      : {
          mandatory: true,
          implementation_status: ImplementationStatus.NOT_IMPLEMENTED,
        },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateControlObjectiveData) => {
      const payload = {
        ...data,
        policy_id: policyId,
      };
      if (objective) {
        return governanceApi.updateControlObjective(objective.id, payload);
      }
      return governanceApi.createControlObjective(payload);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: objective
          ? 'Control objective updated successfully'
          : 'Control objective created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['control-objectives', policyId] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save control objective',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ControlObjectiveFormData) => {
    mutation.mutate(data as CreateControlObjectiveData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="objective_identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objective Identifier *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., CO-IAM-001" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="statement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statement *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="The organization shall..."
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rationale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rationale</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Why is this objective needed?" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., IAM, Network Security" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., critical, high, medium, low" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="implementation_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Implementation Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ImplementationStatus.NOT_IMPLEMENTED}>
                      Not Implemented
                    </SelectItem>
                    <SelectItem value={ImplementationStatus.PLANNED}>Planned</SelectItem>
                    <SelectItem value={ImplementationStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={ImplementationStatus.IMPLEMENTED}>Implemented</SelectItem>
                    <SelectItem value={ImplementationStatus.NOT_APPLICABLE}>Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target_implementation_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Implementation Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : objective ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}







