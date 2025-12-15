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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const informationAssetSchema = z.object({
  assetIdentifier: z.string().optional(),
  assetName: z.string().min(1, 'Asset name is required'),
  informationType: z.string().min(1, 'Information type is required'),
  description: z.string().optional(),
  dataClassification: z.enum(['public', 'internal', 'confidential', 'restricted', 'top_secret']),
  classificationDate: z.string().optional(),
  reclassificationDate: z.string().optional(),
  ownerId: z.string().optional(),
  custodianId: z.string().optional(),
  businessUnit: z.string().optional(),
  department: z.string().optional(),
  criticalityLevel: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  complianceRequirements: z.array(z.string()).optional(),
  containsPII: z.boolean().optional(),
  containsPHI: z.boolean().optional(),
  containsFinancialData: z.boolean().optional(),
  containsIntellectualProperty: z.boolean().optional(),
  storageLocation: z.string().optional(),
  storageType: z.string().optional(),
  retentionPolicy: z.string().optional(),
  retentionExpiryDate: z.string().optional(),
  notes: z.string().optional(),
});

type InformationAssetFormValues = z.infer<typeof informationAssetSchema>;

interface InformationAssetFormProps {
  asset?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function InformationAssetForm({ asset, onSuccess, onCancel }: InformationAssetFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Normalize asset data to ensure IDs are strings, not objects
  const normalizedAsset = useMemo(() => {
    if (!asset) return undefined;
    
    // Helper to safely extract ID from value
    const getStringId = (value: any): string => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value !== null) {
        return String(value?.id || value?.ownerId || value?.custodianId || value?.businessUnitId || '');
      }
      return String(value || '');
    };
    
    // Extract IDs from nested objects if they exist
    const normalized = {
      ...asset,
      ownerId: asset.ownerId ? getStringId(asset.ownerId) : (asset.informationOwner?.id || ''),
      custodianId: asset.custodianId ? getStringId(asset.custodianId) : (asset.assetCustodian?.id || ''),
      businessUnit: asset.businessUnit ? getStringId(asset.businessUnit) : (asset.businessUnitId || (asset.businessUnit?.id || '')),
    };
    
    return normalized;
  }, [asset]);

  // Fetch users for owner and custodian dropdowns
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
      if ('custodianId' in value) {
        return String(value.custodianId || '');
      }
      if ('businessUnitId' in value) {
        return String(value.businessUnitId || '');
      }
      return '';
    }
    return String(value || '');
  };

  const form = useForm<InformationAssetFormValues>({
    resolver: zodResolver(informationAssetSchema),
    defaultValues: {
      assetIdentifier: normalizedAsset?.assetIdentifier || '',
      assetName: normalizedAsset?.assetName || normalizedAsset?.name || '',
      informationType: normalizedAsset?.informationType || '',
      description: normalizedAsset?.description || '',
      dataClassification: normalizedAsset?.dataClassification || normalizedAsset?.classificationLevel || 'internal',
      classificationDate: normalizedAsset?.classificationDate || '',
      reclassificationDate: normalizedAsset?.reclassificationDate || '',
      ownerId: normalizedAsset?.ownerId || '',
      custodianId: normalizedAsset?.custodianId || '',
      businessUnit: normalizedAsset?.businessUnit || '',
      department: normalizedAsset?.department || '',
      criticalityLevel: normalizedAsset?.criticalityLevel || 'medium',
      complianceRequirements: normalizedAsset?.complianceRequirements || [],
      containsPII: normalizedAsset?.containsPII || false,
      containsPHI: normalizedAsset?.containsPHI || false,
      containsFinancialData: normalizedAsset?.containsFinancialData || false,
      containsIntellectualProperty: normalizedAsset?.containsIntellectualProperty || false,
      storageLocation: normalizedAsset?.storageLocation || '',
      storageType: normalizedAsset?.storageType || '',
      retentionPolicy: normalizedAsset?.retentionPolicy || '',
      retentionExpiryDate: normalizedAsset?.retentionExpiryDate || '',
      notes: normalizedAsset?.notes || '',
    },
  });

  // CRITICAL: Ensure all ID fields are strings IMMEDIATELY on mount and on every render
  // This prevents React from trying to render objects as children
  useEffect(() => {
    const fixObjectValues = () => {
      try {
        const currentValues = form.getValues();
        const updates: Partial<InformationAssetFormValues> = {};
        let needsUpdate = false;
        
        // Fix ownerId
        if (currentValues.ownerId && typeof currentValues.ownerId !== 'string') {
          updates.ownerId = extractId(currentValues.ownerId);
          needsUpdate = true;
        }
        
        // Fix custodianId
        if (currentValues.custodianId && typeof currentValues.custodianId !== 'string') {
          updates.custodianId = extractId(currentValues.custodianId);
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
            form.setValue(key as keyof InformationAssetFormValues, stringValue as any, { 
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
  }, [asset?.id]); // Run when asset changes

  const createMutation = useMutation({
    mutationFn: (data: InformationAssetFormValues) => assetsApi.createInformationAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['information-assets'] });
      toast({
        title: 'Success',
        description: 'Information asset created successfully',
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create information asset',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InformationAssetFormValues) => {
      if (!asset?.id) throw new Error('Asset ID is required');
      return assetsApi.updateInformationAsset(asset.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['information-assets'] });
      queryClient.invalidateQueries({ queryKey: ['information-asset', asset?.id] });
      toast({
        title: 'Success',
        description: 'Information asset updated successfully',
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update information asset',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: InformationAssetFormValues) => {
    // Clean up empty strings for UUID fields
    const cleanedData: InformationAssetFormValues = {
      ...values,
      ownerId: values.ownerId || undefined,
      custodianId: values.custodianId || undefined,
      businessUnit: values.businessUnit || undefined,
    };

    if (asset) {
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
            <TabsTrigger value="classification">Classification</TabsTrigger>
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="assetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name *</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="information-name-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="informationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Information Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger data-testid="information-type-input">
                        <SelectValue placeholder="Select information type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Customer Records">Customer Records</SelectItem>
                      <SelectItem value="Employee Records">Employee Records</SelectItem>
                      <SelectItem value="Financial Data">Financial Data</SelectItem>
                      <SelectItem value="Policy Documents">Policy Documents</SelectItem>
                      <SelectItem value="Intellectual Property">Intellectual Property</SelectItem>
                      <SelectItem value="Contract Documents">Contract Documents</SelectItem>
                      <SelectItem value="Legal Documents">Legal Documents</SelectItem>
                      <SelectItem value="Audit Reports">Audit Reports</SelectItem>
                      <SelectItem value="Financial Reports">Financial Reports</SelectItem>
                      <SelectItem value="Strategic Plans">Strategic Plans</SelectItem>
                      <SelectItem value="Security Documentation">Security Documentation</SelectItem>
                      <SelectItem value="Compliance Records">Compliance Records</SelectItem>
                      <SelectItem value="Health Records (PHI)">Health Records (PHI)</SelectItem>
                      <SelectItem value="Research Data">Research Data</SelectItem>
                      <SelectItem value="Trade Secrets">Trade Secrets</SelectItem>
                      <SelectItem value="Proprietary Information">Proprietary Information</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of information this asset contains
                  </FormDescription>
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

            <FormField
              control={form.control}
              name="criticalityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criticality Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger data-testid="information-criticality-dropdown-trigger">
                        <SelectValue placeholder="Select criticality level" />
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
          </TabsContent>

          <TabsContent value="classification" className="space-y-4">
            <FormField
              control={form.control}
              name="dataClassification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Classification *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger data-testid="information-classification-dropdown-trigger">
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                      <SelectItem value="top_secret">Top Secret</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="classificationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classification Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reclassificationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reclassification Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Sensitive Data Types</Label>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="containsPII"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="information-contains-pii-checkbox"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Contains PII (Personally Identifiable Information)</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="containsPHI"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">Contains PHI (Protected Health Information)</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="containsFinancialData"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="information-contains-financial-checkbox"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Contains Financial Data</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="containsIntellectualProperty"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">Contains Intellectual Property</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ownership" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                      <FormDescription>Select the owner of this information asset</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="custodianId"
                render={({ field }) => {
                  // Ensure value is always a string, never an object
                  const fieldValue = typeof field.value === 'object' && field.value !== null 
                    ? (field.value as any)?.id || '' 
                    : (field.value || '');
                  const stringValue = typeof fieldValue === 'string' ? fieldValue : String(fieldValue || '');
                  
                  return (
                    <FormItem>
                      <FormLabel>Custodian</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={stringValue || undefined}
                        disabled={isLoadingUsers}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingUsers ? "Loading..." : "Select custodian"} />
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
                      <FormDescription>Select the custodian of this information asset</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                      <FormDescription>Select the business unit for this information asset</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

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
            </div>
          </TabsContent>

          <TabsContent value="storage" className="space-y-4">
            <FormField
              control={form.control}
              name="storageLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select storage type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="file_server">File Server</SelectItem>
                      <SelectItem value="cloud_storage">Cloud Storage</SelectItem>
                      <SelectItem value="nas">Network Attached Storage (NAS)</SelectItem>
                      <SelectItem value="san">Storage Area Network (SAN)</SelectItem>
                      <SelectItem value="local_storage">Local Storage</SelectItem>
                      <SelectItem value="tape_storage">Tape Storage</SelectItem>
                      <SelectItem value="optical_storage">Optical Storage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the type of storage medium for this information asset</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="retentionPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retention Policy</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="retentionExpiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retention Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              data-testid="form-cancel-button"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            data-testid={asset ? 'form-submit-update' : 'form-submit-create'}
          >
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : asset ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

