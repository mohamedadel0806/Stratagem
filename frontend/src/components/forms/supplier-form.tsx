'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { assetsApi } from '@/lib/api/assets';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormValidationSummary, extractServerErrors } from './form-validation-summary';

const supplierSchema = z.object({
  supplierIdentifier: z.string().optional(),
  supplierName: z.string().min(1, 'Supplier name is required'),
  description: z.string().optional(),
  supplierType: z.enum(['vendor', 'consultant', 'service_provider', 'contractor', 'partner', 'other']),
  primaryContactName: z.string().optional(),
  primaryContactEmail: z.string().optional(),
  primaryContactPhone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  website: z.string().optional(),
  criticalityLevel: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  businessUnit: z.string().optional(),
  contractReference: z.string().optional(),
  contractStartDate: z.string().optional(),
  contractEndDate: z.string().optional(),
  goodsOrServicesProvided: z.string().optional(),
  complianceRequirements: z.array(z.string()).optional(),
  hasDataAccess: z.boolean().optional(),
  requiresNDA: z.boolean().optional(),
  hasSecurityAssessment: z.boolean().optional(),
  additionalContacts: z.array(z.any()).optional(),
  notes: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  supplier?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SupplierForm({ supplier, onSuccess, onCancel }: SupplierFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      supplierIdentifier: supplier?.supplierIdentifier || '',
      supplierName: supplier?.supplierName || '',
      description: supplier?.description || '',
      supplierType: supplier?.supplierType || 'other',
      primaryContactName: supplier?.primaryContactName || '',
      primaryContactEmail: supplier?.primaryContactEmail || '',
      primaryContactPhone: supplier?.primaryContactPhone || '',
      address: supplier?.address || '',
      city: supplier?.city || '',
      country: supplier?.country || '',
      postalCode: supplier?.postalCode || '',
      website: supplier?.website || '',
      criticalityLevel: supplier?.criticalityLevel || 'medium',
      businessUnit: supplier?.businessUnit || '',
      contractReference: supplier?.contractReference || '',
      contractStartDate: supplier?.contractStartDate || '',
      contractEndDate: supplier?.contractEndDate || '',
      goodsOrServicesProvided: supplier?.goodsOrServicesProvided || '',
      complianceRequirements: supplier?.complianceRequirements || [],
      hasDataAccess: supplier?.hasDataAccess || false,
      requiresNDA: supplier?.requiresNDA || false,
      hasSecurityAssessment: supplier?.hasSecurityAssessment || false,
      additionalContacts: supplier?.additionalContacts || [],
      notes: supplier?.notes || '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: SupplierFormValues) => assetsApi.createSupplier(data),
    onSuccess: () => {
      // Clear server errors on success
      setServerErrors([]);
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({ title: 'Success', description: 'Supplier created successfully' });
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error?.message || 'Failed to create supplier';
      setServerErrors(extractServerErrors(error, errorMessage));
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: SupplierFormValues) => {
      if (!supplier?.id) throw new Error('Supplier ID is required');
      return assetsApi.updateSupplier(supplier.id, data);
    },
    onSuccess: () => {
      // Clear server errors on success
      setServerErrors([]);
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier', supplier?.id] });
      toast({ title: 'Success', description: 'Supplier updated successfully' });
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error?.message || 'Failed to update supplier';
      
      // Collect server errors for display
      const errors: string[] = [];
      if (error?.response?.data?.message) {
        errors.push(error.response.data.message);
      }
      if (error?.response?.data?.details?.errors) {
        errors.push(...(Array.isArray(error.response.data.details.errors) 
          ? error.response.data.details.errors 
          : [error.response.data.details.errors]));
      }
      setServerErrors(errors.length > 0 ? errors : [errorMessage]);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: SupplierFormValues) => {
    // Clear previous server errors
    setServerErrors([]);
    
    if (supplier) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormValidationSummary
          formErrors={form.formState.errors}
          serverErrors={serverErrors}
        />
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="supplierName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Name *</FormLabel>
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
                name="supplierType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vendor">Vendor</SelectItem>
                        <SelectItem value="consultant">Consultant</SelectItem>
                        <SelectItem value="service_provider">Service Provider</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                        <SelectItem value="partner">Partner</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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

            <FormField
              control={form.control}
              name="businessUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Unit</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goodsOrServicesProvided"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goods/Services Provided</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="space-y-2">
              <FormLabel>Primary Contact</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryContactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
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
                name="primaryContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Address</FormLabel>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input type="url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="contract" className="space-y-4">
            <FormField
              control={form.control}
              name="contractReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Reference</FormLabel>
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
                name="contractStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <div className="space-y-2">
              <FormLabel>Security & Compliance</FormLabel>
              <FormField
                control={form.control}
                name="hasDataAccess"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Has Data Access</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requiresNDA"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Requires NDA</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasSecurityAssessment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Has Security Assessment</FormLabel>
                  </FormItem>
                )}
              />
            </div>

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
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : supplier ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

