'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { assetsApi } from '@/lib/api/assets';
import { usersApi, User } from '@/lib/api/users';
import { businessUnitsApi, BusinessUnit } from '@/lib/api/business-units';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const businessApplicationSchema = z.object({
  applicationIdentifier: z.string().optional(),
  applicationName: z.string().min(1, 'Application name is required'),
  description: z.string().optional(),
  applicationType: z.enum(['web_application', 'mobile_app', 'desktop_app', 'api_service', 'database', 'cloud_service', 'other']),
  version: z.string().optional(),
  patchLevel: z.string().optional(),
  vendor: z.string().optional(),
  vendorContact: z.string().optional(),
  vendorEmail: z.string().optional(),
  vendorPhone: z.string().optional(),
  ownerId: z.string().optional(),
  businessUnit: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(['active', 'inactive', 'deprecated', 'planned']),
  criticalityLevel: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  dataTypesProcessed: z.array(z.string()).optional(),
  processesPII: z.boolean().optional(),
  processesPHI: z.boolean().optional(),
  processesFinancialData: z.boolean().optional(),
  hostingLocation: z.string().optional(),
  technologyStack: z.string().optional(),
  url: z.string().optional(),
  complianceRequirements: z.array(z.string()).optional(),
  deploymentDate: z.string().optional(),
  lastUpdateDate: z.string().optional(),
  notes: z.string().optional(),
});

type BusinessApplicationFormValues = z.infer<typeof businessApplicationSchema>;

interface BusinessApplicationFormProps {
  application?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BusinessApplicationForm({ application, onSuccess, onCancel }: BusinessApplicationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Normalize application data to ensure IDs are strings, not objects
  const normalizedApplication = useMemo(() => {
    if (!application) return undefined;
    
    // Helper to safely extract ID from value
    const getStringId = (value: any): string => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value !== null) {
        return String(value?.id || value?.ownerId || value?.businessUnitId || '');
      }
      return String(value || '');
    };
    
    // Extract IDs from nested objects if they exist
    const normalized = {
      ...application,
      ownerId: application.ownerId ? getStringId(application.ownerId) : (application.owner?.id || ''),
      businessUnit: application.businessUnit ? getStringId(application.businessUnit) : (application.businessUnitId || (application.businessUnit?.id || '')),
    };
    
    return normalized;
  }, [application]);

  // Fetch users for owner dropdown
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch business units for business unit dropdown
  const { data: businessUnits = [], isLoading: isLoadingBusinessUnits } = useQuery({
    queryKey: ['business-units'],
    queryFn: () => businessUnitsApi.getAll(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Helper to safely extract ID from value (string, object, or undefined)
  const extractId = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      if ('id' in value && typeof value.id === 'string') {
        return value.id;
      }
      if ('ownerId' in value) {
        return String(value.ownerId || '');
      }
      if ('businessUnitId' in value) {
        return String(value.businessUnitId || '');
      }
      return '';
    }
    return String(value || '');
  };

  const form = useForm<BusinessApplicationFormValues>({
    resolver: zodResolver(businessApplicationSchema),
    defaultValues: {
      applicationIdentifier: normalizedApplication?.applicationIdentifier || '',
      applicationName: normalizedApplication?.applicationName || '',
      description: normalizedApplication?.description || '',
      applicationType: normalizedApplication?.applicationType || 'other',
      version: normalizedApplication?.version || '',
      patchLevel: normalizedApplication?.patchLevel || '',
      vendor: normalizedApplication?.vendor || '',
      vendorContact: normalizedApplication?.vendorContact || '',
      vendorEmail: normalizedApplication?.vendorEmail || '',
      vendorPhone: normalizedApplication?.vendorPhone || '',
      ownerId: normalizedApplication?.ownerId || '',
      businessUnit: normalizedApplication?.businessUnit || '',
      department: normalizedApplication?.department || '',
      status: normalizedApplication?.status || 'active',
      criticalityLevel: normalizedApplication?.criticalityLevel || 'medium',
      dataTypesProcessed: normalizedApplication?.dataTypesProcessed || [],
      processesPII: normalizedApplication?.processesPII || false,
      processesPHI: normalizedApplication?.processesPHI || false,
      processesFinancialData: normalizedApplication?.processesFinancialData || false,
      hostingLocation: normalizedApplication?.hostingLocation || '',
      technologyStack: normalizedApplication?.technologyStack || '',
      url: normalizedApplication?.url || '',
      complianceRequirements: normalizedApplication?.complianceRequirements || [],
      deploymentDate: normalizedApplication?.deploymentDate || '',
      lastUpdateDate: normalizedApplication?.lastUpdateDate || '',
      notes: normalizedApplication?.notes || '',
    },
  });

  // CRITICAL: Ensure all ID fields are strings IMMEDIATELY on mount and on every render
  // This prevents React from trying to render objects as children
  useEffect(() => {
    const fixObjectValues = () => {
      try {
        const currentValues = form.getValues();
        const updates: Partial<BusinessApplicationFormValues> = {};
        let needsUpdate = false;
        
        // Fix ownerId
        if (currentValues.ownerId && typeof currentValues.ownerId !== 'string') {
          updates.ownerId = extractId(currentValues.ownerId);
          needsUpdate = true;
        }
        
        // Fix businessUnit
        if (currentValues.businessUnit && typeof currentValues.businessUnit !== 'string') {
          updates.businessUnit = extractId(currentValues.businessUnit);
          needsUpdate = true;
        }
        
        // Apply fixes immediately if needed
        if (needsUpdate) {
          Object.entries(updates).forEach(([key, value]) => {
            const stringValue = typeof value === 'string' ? value : String(value || '');
            form.setValue(key as keyof BusinessApplicationFormValues, stringValue as any, { 
              shouldValidate: false,
              shouldDirty: false,
              shouldTouch: false
            });
          });
        }
      } catch (error) {
        console.error('Error in fixObjectValues:', error);
      }
    };
    
    // Run immediately - don't wait
    fixObjectValues();
    
    // Also run after render to catch any late updates
    const timeoutId = setTimeout(fixObjectValues, 0);
    
    return () => clearTimeout(timeoutId);
  }, [application?.id]); // Run when application changes

  const createMutation = useMutation({
    mutationFn: (data: BusinessApplicationFormValues) => assetsApi.createBusinessApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-applications'] });
      toast({ title: 'Success', description: 'Application created successfully' });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create application',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: BusinessApplicationFormValues) => {
      if (!application?.id) throw new Error('Application ID is required');
      return assetsApi.updateBusinessApplication(application.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-applications'] });
      queryClient.invalidateQueries({ queryKey: ['business-application', application?.id] });
      toast({ title: 'Success', description: 'Application updated successfully' });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update application',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: BusinessApplicationFormValues) => {
    // Clean up empty strings for UUID fields
    const cleanedData: BusinessApplicationFormValues = {
      ...values,
      ownerId: values.ownerId || undefined,
      businessUnit: values.businessUnit || undefined,
    };

    if (application) {
      updateMutation.mutate(cleanedData);
    } else {
      createMutation.mutate(cleanedData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="vendor">Vendor</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="applicationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="applicationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="web_application">Web Application</SelectItem>
                        <SelectItem value="mobile_app">Mobile App</SelectItem>
                        <SelectItem value="desktop_app">Desktop App</SelectItem>
                        <SelectItem value="api_service">API Service</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="cloud_service">Cloud Service</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="deprecated">Deprecated</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patchLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patch Level</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="criticalityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Criticality</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <FormField
              control={form.control}
              name="hostingLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hosting Location</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hosting location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="on_premise">On-Premise</SelectItem>
                      <SelectItem value="cloud">Cloud</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="saas">SaaS (Software as a Service)</SelectItem>
                      <SelectItem value="paas">PaaS (Platform as a Service)</SelectItem>
                      <SelectItem value="iaas">IaaS (Infrastructure as a Service)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select where this application is hosted</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technologyStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technology Stack</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deploymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deployment Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastUpdateDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Update Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Data Processing</FormLabel>
              <FormField
                control={form.control}
                name="processesPII"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Processes PII</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="processesPHI"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Processes PHI</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="processesFinancialData"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Processes Financial Data</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="vendor" className="space-y-4">
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vendorContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Contact</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendorEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="vendorPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        // Always set as string
                        const stringVal = typeof value === 'string' ? value : String(value || '');
                        field.onChange(stringVal);
                        // Auto-populate business unit from owner profile if available
                        const selectedUser = users.find((user) => user.id === stringVal);
                        const ownerBusinessUnitId = selectedUser?.businessUnitId;
                        const currentBusinessUnit = form.getValues('businessUnit') as any;
                        const currentBusinessUnitId =
                          typeof currentBusinessUnit === 'string'
                            ? currentBusinessUnit
                            : (currentBusinessUnit?.id as string | undefined);
                        if (ownerBusinessUnitId && !currentBusinessUnitId) {
                          form.setValue('businessUnit', ownerBusinessUnitId, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      }}
                      value={String(field.value || '')}
                      disabled={isLoadingUsers}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingUsers ? "Loading..." : "Select owner"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.length === 0 && !isLoadingUsers ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">No users available</div>
                        ) : (
                          users.map((user: User) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.firstName} {user.lastName} {user.email ? `(${user.email})` : ''}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the owner of this application</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Unit</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        // Always set as string
                        const stringVal = typeof value === 'string' ? value : String(value || '');
                        field.onChange(stringVal);
                      }}
                      value={String(field.value || '')}
                      disabled={isLoadingBusinessUnits}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingBusinessUnits ? "Loading..." : "Select business unit"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessUnits.length === 0 && !isLoadingBusinessUnits ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">No business units available</div>
                        ) : (
                          businessUnits.map((unit: BusinessUnit) => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the business unit for this application</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : application ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

