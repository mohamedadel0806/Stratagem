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
import { governanceApi, CreateInfluencerData, Influencer, InfluencerCategory, InfluencerStatus, ApplicabilityStatus } from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';

const influencerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(500, 'Name must be less than 500 characters'),
  category: z.nativeEnum(InfluencerCategory),
  sub_category: z.string().max(200).optional(),
  issuing_authority: z.string().max(300).optional(),
  jurisdiction: z.string().max(200).optional(),
  reference_number: z.string().max(200).optional(),
  description: z.string().optional(),
  publication_date: z.string().optional(),
  effective_date: z.string().optional(),
  last_revision_date: z.string().optional(),
  next_review_date: z.string().optional(),
  status: z.nativeEnum(InfluencerStatus).optional(),
  applicability_status: z.nativeEnum(ApplicabilityStatus).optional(),
  applicability_justification: z.string().optional(),
  source_url: z.string().url().optional().or(z.literal('')),
  owner_id: z.string().uuid().optional().or(z.literal('')),
  business_units_affected: z.array(z.string().uuid()).optional(),
  tags: z.array(z.string()).optional(),
});

type InfluencerFormData = z.infer<typeof influencerSchema>;

interface InfluencerFormProps {
  influencer?: Influencer | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function InfluencerForm({ influencer, onSuccess, onCancel }: InfluencerFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InfluencerFormData>({
    resolver: zodResolver(influencerSchema),
    defaultValues: influencer
      ? {
          name: influencer.name,
          category: influencer.category,
          sub_category: influencer.sub_category,
          issuing_authority: influencer.issuing_authority,
          jurisdiction: influencer.jurisdiction,
          reference_number: influencer.reference_number,
          description: influencer.description,
          publication_date: influencer.publication_date,
          effective_date: influencer.effective_date,
          last_revision_date: influencer.last_revision_date,
          next_review_date: influencer.next_review_date,
          status: influencer.status,
          applicability_status: influencer.applicability_status,
          applicability_justification: influencer.applicability_justification,
          source_url: influencer.source_url,
          owner_id: influencer.owner_id,
          business_units_affected: influencer.business_units_affected,
          tags: influencer.tags,
        }
      : {
          category: InfluencerCategory.REGULATORY,
          status: InfluencerStatus.ACTIVE,
          applicability_status: ApplicabilityStatus.UNDER_REVIEW,
        },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateInfluencerData) => {
      if (influencer) {
        return governanceApi.updateInfluencer(influencer.id, data);
      }
      return governanceApi.createInfluencer(data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: influencer ? 'Influencer updated successfully' : 'Influencer created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['influencers'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save influencer',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InfluencerFormData) => {
    mutation.mutate(data as CreateInfluencerData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., NCA ECC" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={InfluencerCategory.INTERNAL}>Internal</SelectItem>
                    <SelectItem value={InfluencerCategory.CONTRACTUAL}>Contractual</SelectItem>
                    <SelectItem value={InfluencerCategory.STATUTORY}>Statutory</SelectItem>
                    <SelectItem value={InfluencerCategory.REGULATORY}>Regulatory</SelectItem>
                    <SelectItem value={InfluencerCategory.INDUSTRY_STANDARD}>Industry Standard</SelectItem>
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
            name="sub_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Category</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Cybersecurity" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reference_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., NCA-ECC-2023" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="issuing_authority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issuing Authority</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., National Cybersecurity Authority" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jurisdiction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jurisdiction</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Saudi Arabia" />
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
                <Textarea {...field} placeholder="Enter description..." rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value={InfluencerStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={InfluencerStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={InfluencerStatus.SUPERSEDED}>Superseded</SelectItem>
                    <SelectItem value={InfluencerStatus.RETIRED}>Retired</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicability_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicability Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select applicability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ApplicabilityStatus.APPLICABLE}>Applicable</SelectItem>
                    <SelectItem value={ApplicabilityStatus.NOT_APPLICABLE}>Not Applicable</SelectItem>
                    <SelectItem value={ApplicabilityStatus.UNDER_REVIEW}>Under Review</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="source_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" placeholder="https://..." />
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
            {mutation.isPending ? 'Saving...' : influencer ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}




