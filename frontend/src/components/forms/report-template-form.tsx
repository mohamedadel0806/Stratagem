'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FieldSelector } from '@/components/reports/field-selector';
import { FilterBuilder } from '@/components/reports/filter-builder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const baseReportTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  reportType: z.enum([
    'asset_inventory',
    'compliance_report',
    'security_test_report',
    'software_inventory',
    'contract_expiration',
    'supplier_criticality',
    'custom',
  ]),
  format: z.enum(['excel', 'pdf', 'csv']).default('excel'),
  fieldSelection: z.array(z.string()).optional(),
  filters: z.record(z.any()).optional(),
  grouping: z.record(z.any()).optional(),
  isScheduled: z.boolean().default(false),
  scheduleFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional(),
  scheduleCron: z.string().optional(),
  scheduleTime: z.string().optional(),
  distributionListId: z.string().optional(),
  isShared: z.boolean().optional(),
  sharedWithUserIds: z.array(z.string()).optional(),
  sharedWithTeamIds: z.array(z.string()).optional(),
  isOrganizationWide: z.boolean().optional(),
});

const reportTemplateSchema = baseReportTemplateSchema.superRefine((data, ctx) => {
  // Only validate schedule fields if scheduling is enabled
  if (data.isScheduled) {
    // If scheduled, scheduleFrequency or scheduleCron must be provided
    if (!data.scheduleFrequency && !data.scheduleCron) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Schedule frequency or custom cron expression is required when scheduling is enabled',
        path: ['scheduleFrequency'],
      });
    }
  }
  // If not scheduled, no validation needed for schedule fields
});

type ReportTemplateFormValues = z.infer<typeof reportTemplateSchema>;

interface ReportTemplateFormProps {
  template?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReportTemplateForm({ template, onSuccess, onCancel }: ReportTemplateFormProps) {
  const { toast } = useToast();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const form = useForm<ReportTemplateFormValues>({
    resolver: zodResolver(reportTemplateSchema),
    defaultValues: template || {
      name: '',
      description: '',
      reportType: 'asset_inventory',
      format: 'excel',
      fieldSelection: [],
      filters: {},
      isScheduled: false,
      isShared: false,
      sharedWithUserIds: [],
      sharedWithTeamIds: [],
      isOrganizationWide: false,
    },
  });

  // Reset form when template changes
  useEffect(() => {
    if (template) {
      // Ensure fieldSelection is an array
      let fieldSelection = template.fieldSelection || [];
      if (typeof fieldSelection === 'string') {
        try {
          fieldSelection = JSON.parse(fieldSelection);
        } catch (e) {
          fieldSelection = [];
        }
      }
      if (!Array.isArray(fieldSelection)) {
        fieldSelection = [];
      }
      
      // Ensure filters is an object
      let filters = template.filters || {};
      if (typeof filters === 'string') {
        try {
          filters = JSON.parse(filters);
        } catch (e) {
          filters = {};
        }
      }
      if (typeof filters !== 'object' || Array.isArray(filters)) {
        filters = {};
      }
      
      // Ensure grouping is an object
      let grouping = template.grouping || {};
      if (typeof grouping === 'string') {
        try {
          grouping = JSON.parse(grouping);
        } catch (e) {
          grouping = {};
        }
      }
      if (typeof grouping !== 'object' || Array.isArray(grouping)) {
        grouping = {};
      }
      
      const isScheduled = Boolean(template.isScheduled);
      form.reset({
        name: template.name || '',
        description: template.description || '',
        reportType: template.reportType || 'asset_inventory',
        format: template.format || 'excel',
        fieldSelection,
        filters,
        grouping,
        isScheduled,
        // Only set schedule fields if scheduling is enabled
        scheduleFrequency: isScheduled ? template.scheduleFrequency : undefined,
        scheduleCron: isScheduled ? template.scheduleCron : undefined,
        scheduleTime: isScheduled ? template.scheduleTime : undefined,
        distributionListId: isScheduled ? template.distributionListId : undefined,
        // Sharing fields
        isShared: template.isShared || false,
        sharedWithUserIds: template.sharedWithUserIds || [],
        sharedWithTeamIds: template.sharedWithTeamIds || [],
        isOrganizationWide: template.isOrganizationWide || false,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        reportType: 'asset_inventory',
        format: 'excel',
        fieldSelection: [],
        filters: {},
        grouping: {},
        isScheduled: false,
        scheduleFrequency: undefined,
        scheduleCron: undefined,
        scheduleTime: undefined,
        distributionListId: undefined,
      });
    }
  }, [template, form]);

  const { data: distributionLists } = useQuery({
    queryKey: ['email-distribution-lists'],
    queryFn: () => assetsApi.getEmailDistributionLists(),
    enabled: form.watch('isScheduled'),
  });

  const createMutation = useMutation({
    mutationFn: (data: ReportTemplateFormValues) => assetsApi.createReportTemplate(data),
    onSuccess: () => {
      if (!isMountedRef.current) return;
      toast({
        title: 'Success',
        description: 'Report template created successfully',
      });
      // Use requestAnimationFrame to ensure UI updates complete
      requestAnimationFrame(() => {
        if (isMountedRef.current) {
          onSuccess();
        }
      });
    },
    onError: (error: any) => {
      if (!isMountedRef.current) return;
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create template',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; data: ReportTemplateFormValues }) =>
      assetsApi.updateReportTemplate(data.id, data.data),
    onSuccess: () => {
      if (!isMountedRef.current) return;
      toast({
        title: 'Success',
        description: 'Report template updated successfully',
      });
      // Use requestAnimationFrame to ensure UI updates complete
      requestAnimationFrame(() => {
        if (isMountedRef.current) {
          onSuccess();
        }
      });
    },
    onError: (error: any) => {
      if (!isMountedRef.current) return;
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update template',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ReportTemplateFormValues) => {
    // Check if template exists and has an ID (for updates)
    // If template exists but has no ID, it's a new template from "Use Template"
    if (template && template.id) {
      // Validate that we have a valid ID
      if (!template.id || typeof template.id !== 'string') {
        toast({
          title: 'Error',
          description: 'Invalid template ID. Cannot update template.',
          variant: 'destructive',
        });
        return;
      }
      updateMutation.mutate({ id: template.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          // Show validation errors
          const firstError = Object.values(errors)[0];
          toast({
            title: 'Validation Error',
            description: firstError?.message || 'Please fix the form errors before submitting.',
            variant: 'destructive',
          });
        })} 
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Weekly Asset Inventory Report" />
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
                <Textarea {...field} placeholder="Description of this report template" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reportType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Report Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="asset_inventory">Asset Inventory</SelectItem>
                  <SelectItem value="compliance_report">Compliance Report</SelectItem>
                  <SelectItem value="security_test_report">Security Test Report</SelectItem>
                  <SelectItem value="software_inventory">Software Inventory</SelectItem>
                  <SelectItem value="contract_expiration">Contract Expiration</SelectItem>
                  <SelectItem value="supplier_criticality">Supplier Criticality</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Export Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Tabs defaultValue="fields" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fields">Field Selection</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
          </TabsList>
          <TabsContent value="fields" className="space-y-2">
            <FormField
              control={form.control}
              name="fieldSelection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Fields to Include</FormLabel>
                  <FormDescription>
                    Choose which fields should be included in the report
                  </FormDescription>
                  <FormControl>
                    <FieldSelector
                      reportType={form.watch('reportType')}
                      selectedFields={field.value || []}
                      onFieldsChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="filters" className="space-y-2">
            <FormField
              control={form.control}
              name="filters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apply Filters</FormLabel>
                  <FormDescription>
                    Add filters to narrow down the data included in the report
                  </FormDescription>
                  <FormControl>
                    <FilterBuilder
                      filters={field.value || {}}
                      onFiltersChange={field.onChange}
                      reportType={form.watch('reportType')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="isScheduled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    // Clear schedule fields when disabling scheduling
                    if (!checked) {
                      form.setValue('scheduleFrequency', undefined);
                      form.setValue('scheduleCron', undefined);
                      form.setValue('scheduleTime', undefined);
                      form.setValue('distributionListId', undefined);
                    }
                  }} 
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Schedule this report</FormLabel>
                <FormDescription>
                  Automatically generate and send this report on a schedule
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch('isScheduled') && (
          <>
            <FormField
              control={form.control}
              name="scheduleFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Frequency</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value === '' ? undefined : value);
                    }} 
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select how often this report should be generated
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduleTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>Time of day to run the report (HH:mm format)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distributionListId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Distribution List</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select distribution list" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {distributionLists?.map((list: any) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select an email distribution list to receive scheduled reports
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              'Saving...'
            ) : template && template.id ? (
              'Update Template'
            ) : (
              'Create Template'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

