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
import {
  governanceApi,
  CreatePolicyData,
  Policy,
  PolicyStatus,
  ReviewFrequency,
} from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ControlObjectivesSection } from './control-objectives-section';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { PolicyTemplateSelector } from './policy-template-selector';

const policySchema = z.object({
  policy_type: z.string().min(1, 'Policy type is required').max(200),
  title: z.string().min(1, 'Title is required').max(500),
  content: z.string().optional(),
  purpose: z.string().optional(),
  scope: z.string().optional(),
  owner_id: z.string().uuid().optional().or(z.literal('')),
  business_units: z.preprocess(
    (val) => (val === null || val === undefined ? [] : val),
    z.array(z.string().uuid()).optional()
  ),
  status: z.nativeEnum(PolicyStatus).optional(),
  approval_date: z.string().optional(),
  effective_date: z.string().min(1, 'Effective date is required'),
  review_frequency: z.nativeEnum(ReviewFrequency).optional(),
  next_review_date: z.string().optional(),
  linked_influencers: z.preprocess(
    (val) => (val === null || val === undefined ? [] : val),
    z.array(z.string().uuid()).optional()
  ),
  tags: z.preprocess(
    (val) => (val === null || val === undefined ? [] : val),
    z.array(z.string()).optional()
  ),
  requires_acknowledgment: z.boolean().optional(),
  acknowledgment_due_days: z.number().min(1).max(365).optional(),
});

type PolicyFormData = z.infer<typeof policySchema>;

interface PolicyFormProps {
  policy?: Policy | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PolicyForm({ policy, onSuccess, onCancel }: PolicyFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Helper function to format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString?: string | null): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const form = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
        defaultValues: policy
      ? {
          policy_type: policy.policy_type,
          title: policy.title,
          content: policy.content || '',
          purpose: policy.purpose || '',
          scope: policy.scope || '',
          owner_id: policy.owner_id || '',
          business_units: policy.business_units || [],
          status: policy.status,
          approval_date: formatDateForInput(policy.approval_date),
          effective_date: formatDateForInput(policy.effective_date) || '',
          review_frequency: policy.review_frequency,
          next_review_date: formatDateForInput(policy.next_review_date),
          linked_influencers: policy.linked_influencers || [],
          tags: policy.tags || [],
          requires_acknowledgment: policy.requires_acknowledgment ?? true,
          acknowledgment_due_days: policy.acknowledgment_due_days ?? 30,
        }
      : {
          status: PolicyStatus.DRAFT,
          review_frequency: ReviewFrequency.ANNUAL,
          requires_acknowledgment: true,
          acknowledgment_due_days: 30,
          effective_date: '', // Required field, user must fill it
        },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreatePolicyData) => {
      console.log('Mutation called with data:', data);
      console.log('Policy ID:', policy?.id);
      
      if (policy) {
        console.log('Updating policy:', policy.id);
        return governanceApi.updatePolicy(policy.id, data);
      }
      console.log('Creating new policy');
      return governanceApi.createPolicy(data);
    },
    onSuccess: (response) => {
      console.log('Mutation success:', response);
      toast({
        title: 'Success',
        description: policy ? 'Policy updated successfully' : 'Policy created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      console.error('Error response:', error.response?.data);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to save policy',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: PolicyFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Form validation errors:', form.formState.errors);
    
    // Clean up empty strings, null values, and empty arrays for optional fields
    const cleanedData: CreatePolicyData = {
      ...data,
      owner_id: data.owner_id || undefined,
      approval_date: data.approval_date || undefined,
      next_review_date: data.next_review_date || undefined,
      business_units: data.business_units && data.business_units.length > 0 ? data.business_units : undefined,
      linked_influencers: data.linked_influencers && data.linked_influencers.length > 0 ? data.linked_influencers : undefined,
      tags: data.tags && data.tags.length > 0 ? data.tags : undefined,
      purpose: data.purpose || undefined,
      scope: data.scope || undefined,
      content: data.content || undefined,
    };
    
    console.log('Cleaned data for submission:', cleanedData);
    mutation.mutate(cleanedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="control-objectives">Control Objectives</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="policy_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Type *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Information Security" />
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
                        <SelectItem value={PolicyStatus.DRAFT}>Draft</SelectItem>
                        <SelectItem value={PolicyStatus.IN_REVIEW}>In Review</SelectItem>
                        <SelectItem value={PolicyStatus.APPROVED}>Approved</SelectItem>
                        <SelectItem value={PolicyStatus.PUBLISHED}>Published</SelectItem>
                        <SelectItem value={PolicyStatus.ARCHIVED}>Archived</SelectItem>
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
                    <Input {...field} placeholder="e.g., Information Security Policy" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Why does this policy exist?" rows={3} />
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
                    <Textarea {...field} placeholder="What and who does this policy cover?" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="effective_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effective Date *</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" required />
                    </FormControl>
                    <FormDescription>Required: The date when this policy becomes effective</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="next_review_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Review Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="review_frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ReviewFrequency.ANNUAL}>Annual</SelectItem>
                      <SelectItem value={ReviewFrequency.BIENNIAL}>Biennial</SelectItem>
                      <SelectItem value={ReviewFrequency.TRIENNIAL}>Triennial</SelectItem>
                      <SelectItem value={ReviewFrequency.QUARTERLY}>Quarterly</SelectItem>
                      <SelectItem value={ReviewFrequency.MONTHLY}>Monthly</SelectItem>
                      <SelectItem value={ReviewFrequency.AS_NEEDED}>As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <FormLabel>Policy Content</FormLabel>
              <PolicyTemplateSelector
                onSelectTemplate={(template) => {
                  form.setValue('content', template.content);
                  form.setValue('title', template.name);
                }}
                currentContent={form.watch('content')}
              />
              <FormDescription className="text-xs">
                Start from a template or begin with a blank document
              </FormDescription>
            </div>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditor
                      content={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Enter policy content. Use the toolbar above to format your text..."
                      minHeight="400px"
                    />
                  </FormControl>
                  <FormDescription>
                    Use the formatting toolbar to create rich text content with headings, lists, links, and more.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="control-objectives" className="space-y-4">
            {policy && (
              <ControlObjectivesSection policyId={policy.id} />
            )}
            {!policy && (
              <div className="text-sm text-muted-foreground">
                Save the policy first to add control objectives
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <FormField
              control={form.control}
              name="requires_acknowledgment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Requires Acknowledgment</FormLabel>
                    <FormDescription>
                      Users must acknowledge reading this policy
                    </FormDescription>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('requires_acknowledgment') && (
              <FormField
                control={form.control}
                name="acknowledgment_due_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acknowledgment Due Days</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        max={365}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of days users have to acknowledge the policy
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Show validation errors */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm font-semibold text-destructive mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>
                  <strong>{field}:</strong> {error?.message as string}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending || form.formState.isSubmitting}
            onClick={() => {
              // Trigger validation
              form.trigger();
              console.log('Button clicked - Form errors:', form.formState.errors);
              console.log('Form values:', form.getValues());
            }}
          >
            {mutation.isPending || form.formState.isSubmitting ? 'Saving...' : policy ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

