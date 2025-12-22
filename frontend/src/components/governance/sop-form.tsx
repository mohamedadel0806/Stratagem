'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { governanceApi, SOP, SOPStatus, SOPCategory, CreateSOPData } from '@/lib/api/governance';
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

const sopFormSchema = z.object({
  sop_identifier: z.string().min(1, 'SOP identifier is required').max(100),
  title: z.string().min(1, 'Title is required').max(500),
  category: z.nativeEnum(SOPCategory).optional(),
  subcategory: z.string().max(100).optional(),
  purpose: z.string().optional(),
  scope: z.string().optional(),
  content: z.string().optional(),
  version: z.string().max(50).optional(),
  status: z.nativeEnum(SOPStatus).optional(),
  owner_id: z.string().optional(),
  review_frequency: z.string().max(50).optional(),
  next_review_date: z.string().optional(),
  linked_policies: z.array(z.string()).optional(),
  linked_standards: z.array(z.string()).optional(),
  control_ids: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

type SOPFormValues = z.infer<typeof sopFormSchema>;

interface SOPFormProps {
  sop?: SOP;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SOPForm({ sop, onSuccess, onCancel }: SOPFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch controls for linking
  const { data: controlsData } = useQuery({
    queryKey: ['unified-controls', { limit: 100 }],
    queryFn: () => governanceApi.getUnifiedControls({ limit: 100 }),
  });

  const form = useForm<SOPFormValues>({
    resolver: zodResolver(sopFormSchema),
    defaultValues: {
      sop_identifier: sop?.sop_identifier || '',
      title: sop?.title || '',
      category: sop?.category,
      subcategory: sop?.subcategory || '',
      purpose: sop?.purpose || '',
      scope: sop?.scope || '',
      content: sop?.content || '',
      version: sop?.version || '',
      status: sop?.status || SOPStatus.DRAFT,
      owner_id: sop?.owner_id || '',
      review_frequency: sop?.review_frequency || '',
      next_review_date: sop?.next_review_date || '',
      linked_policies: sop?.linked_policies || [],
      linked_standards: sop?.linked_standards || [],
      control_ids: sop?.controls?.map((c) => c.id) || [],
      tags: sop?.tags || [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSOPData) => governanceApi.createSOP(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'SOP created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['sops'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create SOP',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateSOPData) =>
      governanceApi.updateSOP(sop!.id, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'SOP updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['sops'] });
      queryClient.invalidateQueries({ queryKey: ['sop', sop!.id] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update SOP',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: SOPFormValues) => {
    const data: CreateSOPData = {
      sop_identifier: values.sop_identifier,
      title: values.title,
      category: values.category,
      subcategory: values.subcategory || undefined,
      purpose: values.purpose || undefined,
      scope: values.scope || undefined,
      content: values.content || undefined,
      version: values.version || undefined,
      status: values.status,
      owner_id: values.owner_id || undefined,
      review_frequency: values.review_frequency || undefined,
      next_review_date: values.next_review_date || undefined,
      linked_policies: values.linked_policies || undefined,
      linked_standards: values.linked_standards || undefined,
      control_ids: values.control_ids || undefined,
      tags: values.tags || undefined,
    };

    if (sop) {
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
            name="sop_identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SOP Identifier *</FormLabel>
                <FormControl>
                  <Input placeholder="SOP-USER-PROV-001" {...field} />
                </FormControl>
                <FormDescription>
                  Unique identifier for this SOP
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

              <FormField
                control={form.control}
                name="sop_identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SOP Identifier *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SOP-IT-001" data-testid="sop-form-identifier-input" {...field} />
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
                      <Input placeholder="Enter SOP title" data-testid="sop-form-title-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value={SOPCategory.OPERATIONAL}>Operational</SelectItem>
                    <SelectItem value={SOPCategory.SECURITY}>Security</SelectItem>
                    <SelectItem value={SOPCategory.COMPLIANCE}>Compliance</SelectItem>
                    <SelectItem value={SOPCategory.THIRD_PARTY}>Third Party</SelectItem>
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
                  value={field.value || SOPStatus.DRAFT}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={SOPStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={SOPStatus.IN_REVIEW}>In Review</SelectItem>
                    <SelectItem value={SOPStatus.APPROVED}>Approved</SelectItem>
                    <SelectItem value={SOPStatus.PUBLISHED}>Published</SelectItem>
                    <SelectItem value={SOPStatus.ARCHIVED}>Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Why this procedure exists"
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
                  placeholder="What is covered by this SOP"
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
                  placeholder="Detailed procedure steps and instructions"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detailed procedure steps and instructions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="sop-form-category-dropdown">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(SOPCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <Button type="submit" disabled={isLoading} data-testid={sop ? 'sop-form-submit-update' : 'sop-form-submit-create'}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {sop ? 'Update SOP' : 'Create SOP'}
          </Button>
        </div>
      </form>
    </Form>
  );
}


