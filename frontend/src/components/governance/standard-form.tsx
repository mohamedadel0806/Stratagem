'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { governanceApi, Standard, StandardStatus, CreateStandardData } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const standardFormSchema = z.object({
  standard_identifier: z.string().min(1, 'Standard identifier is required').max(100),
  title: z.string().min(1, 'Title is required').max(500),
  policy_id: z.string().optional(),
  control_objective_id: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  scope: z.string().optional(),
  applicability: z.string().optional(),
  compliance_measurement_criteria: z.string().optional(),
  version: z.string().max(50).optional(),
  status: z.nativeEnum(StandardStatus).optional(),
  owner_id: z.string().optional(),
  control_objective_ids: z.array(z.string()).optional(),
});

type StandardFormValues = z.infer<typeof standardFormSchema>;

interface StandardFormProps {
  standard?: Standard;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StandardForm({ standard, onSuccess, onCancel }: StandardFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch policies for dropdown
  const { data: policiesData } = useQuery({
    queryKey: ['policies', { limit: 100 }],
    queryFn: () => governanceApi.getPolicies({ limit: 100 }),
  });

  // Fetch control objectives for dropdown
  const { data: controlObjectivesData } = useQuery({
    queryKey: ['control-objectives', { limit: 100 }],
    queryFn: () => governanceApi.getControlObjectives({ limit: 100 }),
    enabled: !!standard?.policy_id || !!standard?.control_objective_id,
  });

  const form = useForm<StandardFormValues>({
    resolver: zodResolver(standardFormSchema),
    defaultValues: {
      standard_identifier: standard?.standard_identifier || '',
      title: standard?.title || '',
      policy_id: standard?.policy_id || '',
      control_objective_id: standard?.control_objective_id || '',
      description: standard?.description || '',
      content: standard?.content || '',
      scope: standard?.scope || '',
      applicability: standard?.applicability || '',
      compliance_measurement_criteria: standard?.compliance_measurement_criteria || '',
      version: standard?.version || '',
      status: standard?.status || StandardStatus.DRAFT,
      owner_id: standard?.owner_id || '',
      control_objective_ids: standard?.control_objectives?.map((co) => co.id) || [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateStandardData) => governanceApi.createStandard(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Standard created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['standards'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create standard',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateStandardData) =>
      governanceApi.updateStandard(standard!.id, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Standard updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['standards'] });
      queryClient.invalidateQueries({ queryKey: ['standard', standard!.id] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update standard',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: StandardFormValues) => {
    const data: CreateStandardData = {
      standard_identifier: values.standard_identifier,
      title: values.title,
      policy_id: values.policy_id || undefined,
      control_objective_id: values.control_objective_id || undefined,
      description: values.description || undefined,
      content: values.content || undefined,
      scope: values.scope || undefined,
      applicability: values.applicability || undefined,
      compliance_measurement_criteria: values.compliance_measurement_criteria || undefined,
      version: values.version || undefined,
      status: values.status,
      owner_id: values.owner_id || undefined,
      control_objective_ids: values.control_objective_ids || undefined,
    };

    if (standard) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="standard_identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Standard Identifier *</FormLabel>
                <FormControl>
                  <Input placeholder="STD-INFOSEC-001" {...field} />
                </FormControl>
                <FormDescription>
                  Unique identifier for this standard
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input placeholder="1.0" {...field} />
                </FormControl>
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
                <Input placeholder="Information Security Standard" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="policy_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Policy</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a policy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {policiesData?.data?.map((policy) => (
                      <SelectItem key={policy.id} value={policy.id}>
                        {policy.title}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || StandardStatus.DRAFT}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={StandardStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={StandardStatus.IN_REVIEW}>In Review</SelectItem>
                    <SelectItem value={StandardStatus.APPROVED}>Approved</SelectItem>
                    <SelectItem value={StandardStatus.PUBLISHED}>Published</SelectItem>
                    <SelectItem value={StandardStatus.ARCHIVED}>Archived</SelectItem>
                  </SelectContent>
                </Select>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the standard"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scope</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What is covered by this standard"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="applicability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applicability</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Who/what this standard applies to"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Full content of the standard document"
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detailed requirements and specifications
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="compliance_measurement_criteria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compliance Measurement Criteria</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="How compliance with this standard will be measured"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {standard ? 'Update Standard' : 'Create Standard'}
          </Button>
        </div>
      </form>
    </Form>
  );
}


