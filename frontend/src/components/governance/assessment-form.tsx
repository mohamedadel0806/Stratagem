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
  CreateAssessmentData,
  Assessment,
  AssessmentType,
  AssessmentStatus,
} from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';

const assessmentSchema = z.object({
  assessment_identifier: z.string().min(1, 'Identifier is required').max(100),
  name: z.string().min(1, 'Name is required').max(500),
  description: z.string().optional(),
  assessment_type: z.nativeEnum(AssessmentType),
  scope_description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.nativeEnum(AssessmentStatus).optional(),
  lead_assessor_id: z.string().uuid().optional().or(z.literal('')),
  assessment_procedures: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

interface AssessmentFormProps {
  assessment?: Assessment | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AssessmentForm({ assessment, onSuccess, onCancel }: AssessmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: assessment
      ? {
          assessment_identifier: assessment.assessment_identifier,
          name: assessment.name,
          description: assessment.description,
          assessment_type: assessment.assessment_type,
          scope_description: assessment.scope_description,
          start_date: assessment.start_date,
          end_date: assessment.end_date,
          status: assessment.status,
          lead_assessor_id: assessment.lead_assessor_id,
          assessment_procedures: assessment.assessment_procedures,
          tags: assessment.tags,
        }
      : {
          status: AssessmentStatus.NOT_STARTED,
          assessment_type: AssessmentType.OPERATING_EFFECTIVENESS,
        },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateAssessmentData) => {
      if (assessment) {
        return governanceApi.updateAssessment(assessment.id, data);
      }
      return governanceApi.createAssessment(data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: assessment ? 'Assessment updated successfully' : 'Assessment created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save assessment',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: AssessmentFormData) => {
    mutation.mutate(data as CreateAssessmentData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="assessment_identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assessment Identifier *</FormLabel>
                <FormControl>
                  <Input placeholder="ASSESS-2024-Q1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assessment Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Q1 2024 Security Controls Assessment" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Assessment description..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="assessment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assessment Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assessment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={AssessmentType.IMPLEMENTATION}>Implementation</SelectItem>
                    <SelectItem value={AssessmentType.DESIGN_EFFECTIVENESS}>Design Effectiveness</SelectItem>
                    <SelectItem value={AssessmentType.OPERATING_EFFECTIVENESS}>Operating Effectiveness</SelectItem>
                    <SelectItem value={AssessmentType.COMPLIANCE}>Compliance</SelectItem>
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
                    <SelectItem value={AssessmentStatus.NOT_STARTED}>Not Started</SelectItem>
                    <SelectItem value={AssessmentStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={AssessmentStatus.UNDER_REVIEW}>Under Review</SelectItem>
                    <SelectItem value={AssessmentStatus.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={AssessmentStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="scope_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scope Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the assessment scope..." rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
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
          name="assessment_procedures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Procedures</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the assessment procedures to be followed..."
                  rows={4}
                  {...field}
                />
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
            {mutation.isPending ? 'Saving...' : assessment ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

