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
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const softwareAssetSchema = z.object({
  softwareIdentifier: z.string().optional(),
  softwareName: z.string().min(1, 'Software name is required'),
  description: z.string().optional(),
  softwareType: z.enum(['operating_system', 'application_software', 'development_tool', 'database_software', 'security_software', 'utility', 'other']),
  version: z.string().optional(),
  patchLevel: z.string().optional(),
  vendor: z.string().optional(),
  vendorContact: z.string().optional(),
  vendorEmail: z.string().optional(),
  vendorPhone: z.string().optional(),
  licenseType: z.string().optional(),
  licenseKey: z.string().optional(),
  numberOfLicenses: z.number().optional(),
  licensesInUse: z.number().optional(),
  licenseExpiryDate: z.string().optional(),
  ownerId: z.string().optional(),
  businessUnit: z.string().optional(),
  criticalityLevel: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  installedOnAssets: z.array(z.string()).optional(),
  complianceRequirements: z.array(z.string()).optional(),
  purchaseDate: z.string().optional(),
  installationDate: z.string().optional(),
  notes: z.string().optional(),
});

type SoftwareAssetFormValues = z.infer<typeof softwareAssetSchema>;

interface SoftwareAssetFormProps {
  software?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SoftwareAssetForm({ software, onSuccess, onCancel }: SoftwareAssetFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Normalize software data to ensure IDs are strings, not objects
  const normalizedSoftware = useMemo(() => {
    if (!software) return undefined;
    
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
      ...software,
      ownerId: software.ownerId ? getStringId(software.ownerId) : (software.owner?.id || ''),
      businessUnit: software.businessUnit ? getStringId(software.businessUnit) : (software.businessUnitId || (software.businessUnit?.id || '')),
    };
    
    return normalized;
  }, [software]);

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

  const form = useForm<SoftwareAssetFormValues>({
    resolver: zodResolver(softwareAssetSchema),
    defaultValues: {
      softwareIdentifier: normalizedSoftware?.softwareIdentifier || '',
      softwareName: normalizedSoftware?.softwareName || '',
      description: normalizedSoftware?.description || '',
      softwareType: normalizedSoftware?.softwareType || 'other',
      version: normalizedSoftware?.version || '',
      patchLevel: normalizedSoftware?.patchLevel || '',
      vendor: normalizedSoftware?.vendor || '',
      vendorContact: normalizedSoftware?.vendorContact || '',
      vendorEmail: normalizedSoftware?.vendorEmail || '',
      vendorPhone: normalizedSoftware?.vendorPhone || '',
      licenseType: normalizedSoftware?.licenseType || '',
      licenseKey: normalizedSoftware?.licenseKey || '',
      numberOfLicenses: normalizedSoftware?.numberOfLicenses || undefined,
      licensesInUse: normalizedSoftware?.licensesInUse || undefined,
      licenseExpiryDate: normalizedSoftware?.licenseExpiryDate || '',
      ownerId: normalizedSoftware?.ownerId || '',
      businessUnit: normalizedSoftware?.businessUnit || '',
      criticalityLevel: normalizedSoftware?.criticalityLevel || 'medium',
      installedOnAssets: normalizedSoftware?.installedOnAssets || [],
      complianceRequirements: normalizedSoftware?.complianceRequirements || [],
      purchaseDate: normalizedSoftware?.purchaseDate || '',
      installationDate: normalizedSoftware?.installationDate || '',
      notes: normalizedSoftware?.notes || '',
    },
  });

  // CRITICAL: Ensure all ID fields are strings IMMEDIATELY on mount and on every render
  // This prevents React from trying to render objects as children
  useEffect(() => {
    const fixObjectValues = () => {
      try {
        const currentValues = form.getValues();
        const updates: Partial<SoftwareAssetFormValues> = {};
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
            form.setValue(key as keyof SoftwareAssetFormValues, stringValue as any, { 
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
  }, [software?.id]); // Run when software changes

  const createMutation = useMutation({
    mutationFn: (data: SoftwareAssetFormValues) => assetsApi.createSoftwareAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['software-assets'] });
      toast({ title: 'Success', description: 'Software asset created successfully' });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create software asset',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: SoftwareAssetFormValues) => {
      if (!software?.id) throw new Error('Software ID is required');
      return assetsApi.updateSoftwareAsset(software.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['software-assets'] });
      queryClient.invalidateQueries({ queryKey: ['software-asset', software?.id] });
      toast({ title: 'Success', description: 'Software asset updated successfully' });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update software asset',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: SoftwareAssetFormValues) => {
    // Clean up empty strings for UUID fields
    const cleanedData: SoftwareAssetFormValues = {
      ...values,
      ownerId: values.ownerId || undefined,
      businessUnit: values.businessUnit || undefined,
    };

    if (software) {
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
            <TabsTrigger value="licensing">Licensing</TabsTrigger>
            <TabsTrigger value="vendor">Vendor</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="softwareName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Software Name *</FormLabel>
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
                name="softwareType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Software Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="operating_system">Operating System</SelectItem>
                        <SelectItem value="application_software">Application Software</SelectItem>
                        <SelectItem value="development_tool">Development Tool</SelectItem>
                        <SelectItem value="database_software">Database Software</SelectItem>
                        <SelectItem value="security_software">Security Software</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
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
            </div>
          </TabsContent>

          <TabsContent value="licensing" className="space-y-4">
            <FormField
              control={form.control}
              name="licenseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select license type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="proprietary">Proprietary</SelectItem>
                      <SelectItem value="open_source">Open Source</SelectItem>
                      <SelectItem value="freeware">Freeware</SelectItem>
                      <SelectItem value="shareware">Shareware</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="perpetual">Perpetual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the type of license for this software</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licenseKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Key</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="numberOfLicenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Licenses</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="licensesInUse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licenses In Use</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="licenseExpiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Expiry</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="installationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installation Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
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
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => {
                // Ensure value is always a string, never an object
                const fieldValue = typeof field.value === 'object' && field.value !== null 
                  ? (field.value as any)?.id || '' 
                  : (field.value || '');
                const stringValue = typeof fieldValue === 'string' ? fieldValue : String(fieldValue || '');
                
                return (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={stringValue || undefined}
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
                    <FormDescription>Select the owner of this software asset</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="businessUnit"
              render={({ field }) => {
                // Use state to ensure value is ALWAYS a string - prevents React rendering error
                const [safeValue, setSafeValue] = useState<string>(() => {
                  // Initialize from field value, ensuring it's a string
                  const raw = field.value;
                  if (!raw) return '';
                  if (typeof raw === 'string') return raw;
                  if (typeof raw === 'object' && raw !== null) {
                    const id = (raw as any)?.id || '';
                    // Fix form value immediately
                    if (id) {
                      setTimeout(() => {
                        form.setValue('businessUnit', id, { shouldValidate: false, shouldDirty: false });
                      }, 0);
                    }
                    return String(id);
                  }
                  return String(raw || '');
                });
                
                // Sync with form value changes, but always ensure it's a string
                useEffect(() => {
                  const raw = field.value;
                  
                  // Skip if already a string and matches current safeValue
                  if (typeof raw === 'string' && raw === safeValue) {
                    return;
                  }
                  
                  let newValue = '';
                  
                  if (!raw) {
                    newValue = '';
                  } else if (typeof raw === 'string') {
                    newValue = raw;
                  } else if (typeof raw === 'object' && raw !== null) {
                    // Object detected - extract ID
                    const obj = raw as any;
                    newValue = String(obj?.id || obj?.businessUnitId || '');
                    // Fix form value immediately
                    if (newValue) {
                      form.setValue('businessUnit', newValue, { shouldValidate: false, shouldDirty: false });
                    } else {
                      // If extraction failed, clear the value
                      form.setValue('businessUnit', '', { shouldValidate: false, shouldDirty: false });
                    }
                  } else {
                    newValue = String(raw || '');
                  }
                  
                  // Only update if different to prevent loops
                  if (newValue !== safeValue) {
                    setSafeValue(newValue);
                  }
                }, [field.value]); // Only depend on field.value, not safeValue
                
                return (
                  <FormItem>
                    <FormLabel>Business Unit</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        // Always set as string
                        const stringVal = typeof value === 'string' ? value : String(value || '');
                        setSafeValue(stringVal);
                        field.onChange(stringVal);
                      }}
                      value={safeValue || undefined}
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
                    <FormDescription>Select the business unit for this software asset</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

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
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : software ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

