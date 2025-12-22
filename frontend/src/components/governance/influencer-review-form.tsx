'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, ReviewInfluencerData, Influencer } from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const reviewSchema = z.object({
  revision_notes: z.string().optional(),
  next_review_date: z.string().optional(),
  review_frequency_days: z.number().int().min(30).max(3650).optional(),
  impact_assessment: z.object({
    affected_policies: z.array(z.string().uuid()).optional(),
    affected_controls: z.array(z.string().uuid()).optional(),
    business_units_impact: z.array(z.string().uuid()).optional(),
    risk_level: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    notes: z.string().optional(),
  }).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface InfluencerReviewFormProps {
  influencer: Influencer;
  onSuccess: () => void;
  onCancel: () => void;
}

export function InfluencerReviewForm({ influencer, onSuccess, onCancel }: InfluencerReviewFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      next_review_date: influencer.next_review_date
        ? new Date(influencer.next_review_date).toISOString().split('T')[0]
        : undefined,
      review_frequency_days: influencer.review_frequency_days || 365,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ReviewInfluencerData) => {
      return governanceApi.reviewInfluencer(influencer.id, data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Influencer review completed successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['influencer', influencer.id] });
      queryClient.invalidateQueries({ queryKey: ['influencers'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to complete review',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    mutation.mutate({
      revision_notes: data.revision_notes,
      next_review_date: data.next_review_date,
      review_frequency_days: data.review_frequency_days,
      impact_assessment: data.impact_assessment,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="revision_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Revision Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document what was reviewed, what changed, and any important notes..."
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                Document the review findings, changes made, and any important notes for future reference.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="next_review_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Review Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormDescription>When should this influencer be reviewed again?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="review_frequency_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review Frequency (Days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 365)}
                    min={30}
                    max={3650}
                  />
                </FormControl>
                <FormDescription>Days between reviews (e.g., 365 for annual)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div>
            <FormLabel className="text-base font-semibold">Impact Assessment</FormLabel>
            <FormDescription className="mt-1">
              Assess the impact of changes to this influencer on related policies, controls, and business units.
            </FormDescription>
          </div>

          <FormField
            control={form.control}
            name="impact_assessment.risk_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Overall risk level of the changes</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="impact_assessment.notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impact Notes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe the impact of changes on policies, controls, and business operations..."
                    rows={3}
                  />
                </FormControl>
                <FormDescription>Describe how this change affects related governance elements</FormDescription>
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
            {mutation.isPending ? 'Completing Review...' : 'Complete Review'}
          </Button>
        </div>
      </form>
    </Form>
  );
}


