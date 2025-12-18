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
  CreateUnifiedControlData,
  UnifiedControl,
  ControlType,
  ControlComplexity,
  ControlCostImpact,
  ControlStatus,
  ImplementationStatus,
} from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';

const unifiedControlSchema = z.object({
  control_identifier: z.string().min(1, 'Identifier is required').max(100),
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().optional(),
  control_type: z.nativeEnum(ControlType).optional(),
  control_category: z.string().max(200).optional(),
  domain: z.string().max(200).optional(),
  complexity: z.nativeEnum(ControlComplexity).optional(),
  cost_impact: z.nativeEnum(ControlCostImpact).optional(),
  status: z.nativeEnum(ControlStatus).optional(),
  implementation_status: z.nativeEnum(ImplementationStatus).optional(),
  control_owner_id: z.string().uuid().optional().or(z.literal('')),
  control_procedures: z.string().optional(),
  testing_procedures: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type UnifiedControlFormData = z.infer<typeof unifiedControlSchema>;

interface UnifiedControlFormProps {
  control?: UnifiedControl | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UnifiedControlForm({ control, onSuccess, onCancel }: UnifiedControlFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UnifiedControlFormData>({
    resolver: zodResolver(unifiedControlSchema),
    defaultValues: control
      ? {
          control_identifier: control.control_identifier,
          title: control.title,
          description: control.description,
          control_type: control.control_type,
          control_category: control.control_category,
          domain: control.domain,
          complexity: control.complexity,
          cost_impact: control.cost_impact,
          status: control.status,
          implementation_status: control.implementation_status,
          control_owner_id: control.control_owner_id,
          control_procedures: control.control_procedures,
          testing_procedures: control.testing_procedures,
          tags: control.tags,
        }
      : {
          status: ControlStatus.DRAFT,
          implementation_status: ImplementationStatus.NOT_IMPLEMENTED,
        },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateUnifiedControlData) => {
      if (control) {
        return governanceApi.updateUnifiedControl(control.id, data);
      }
      return governanceApi.createUnifiedControl(data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: control ? 'Control updated successfully' : 'Control created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['unified-controls'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save control',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: UnifiedControlFormData) => {
    mutation.mutate(data as CreateUnifiedControlData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="control_identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control Identifier *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., UCL-IAM-001" />
                </FormControl>
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
                    <SelectItem value={ControlStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={ControlStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={ControlStatus.DEPRECATED}>Deprecated</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Multi-Factor Authentication" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe the control..." rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="control_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ControlType.PREVENTIVE}>Preventive</SelectItem>
                    <SelectItem value={ControlType.DETECTIVE}>Detective</SelectItem>
                    <SelectItem value={ControlType.CORRECTIVE}>Corrective</SelectItem>
                    <SelectItem value={ControlType.COMPENSATING}>Compensating</SelectItem>
                    <SelectItem value={ControlType.ADMINISTRATIVE}>Administrative</SelectItem>
                    <SelectItem value={ControlType.TECHNICAL}>Technical</SelectItem>
                    <SelectItem value={ControlType.PHYSICAL}>Physical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complexity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ControlComplexity.HIGH}>High</SelectItem>
                    <SelectItem value={ControlComplexity.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={ControlComplexity.LOW}>Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost_impact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Impact</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ControlCostImpact.HIGH}>High</SelectItem>
                    <SelectItem value={ControlCostImpact.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={ControlCostImpact.LOW}>Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                    <SelectItem value={ImplementationStatus.NOT_IMPLEMENTED}>Not Implemented</SelectItem>
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
        </div>

        <FormField
          control={form.control}
          name="control_procedures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Control Procedures</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe how the control is implemented..." rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="testing_procedures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Testing Procedures</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe how the control is tested..." rows={5} />
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
            {mutation.isPending ? 'Saving...' : control ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}





