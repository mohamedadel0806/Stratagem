'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';
import { assetsApi, CreatePhysicalAssetData, PhysicalAsset, AssetType } from '@/lib/api/assets';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormValidationSummary, extractServerErrors } from './form-validation-summary';

const physicalAssetSchema = z.object({
  uniqueIdentifier: z.string().min(1, 'Unique identifier is required'),
  assetDescription: z.string().min(1, 'Asset description is required'),
  assetTypeId: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  businessPurpose: z.string().optional(),
  ownerId: z.string().optional(),
  businessUnitId: z.string().optional(),
  physicalLocation: z.string().optional(),
  criticalityLevel: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  connectivityStatus: z.enum(['connected', 'disconnected', 'unknown']).optional(),
  networkApprovalStatus: z.enum(['approved', 'pending', 'rejected', 'not_required']).optional(),
  notes: z.string().optional(),
  // Reason for changes when updating an existing asset (optional but recommended)
  changeReason: z.string().optional(),
});

type PhysicalAssetFormValues = z.infer<typeof physicalAssetSchema>;

interface PhysicalAssetFormProps {
  asset?: PhysicalAsset;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function getUserDisplayName(user: User): string {
  if (user.firstName || user.lastName) {
    return [user.firstName, user.lastName].filter(Boolean).join(' ');
  }
  return user.email;
}

function getBusinessUnitDisplayName(bu: BusinessUnit): string {
  if (bu.name && bu.code) return `${bu.name} (${bu.code})`;
  return bu.name || bu.code || '';
}

export function PhysicalAssetForm({ asset, onSuccess, onCancel }: PhysicalAssetFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const normalizedAsset = useMemo(() => {
    if (!asset) return undefined;

    const ensureString = (value: unknown): string | undefined => {
      if (!value) return undefined;
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value !== null && 'id' in value) {
        return String((value as { id?: string }).id || '');
      }
      return String(value);
    };

    return {
      ...asset,
      ownerId: ensureString((asset as any).ownerId ?? (asset as any).owner),
      businessUnitId: ensureString(
        (asset as any).businessUnitId ?? (asset as any).businessUnit,
      ),
      assetTypeId: ensureString((asset as any).assetTypeId ?? (asset as any).assetType),
      physicalLocation:
        (asset as any).physicalLocation ??
        (asset as any).location ??
        (asset as any).room ??
        (asset as any).building,
    };
  }, [asset]);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: businessUnits = [] } = useQuery({
    queryKey: ['business-units'],
    queryFn: () => businessUnitsApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: assetTypes = [] } = useQuery({
    queryKey: ['asset-types', 'physical'],
    queryFn: () => assetsApi.getAssetTypes('physical'),
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<PhysicalAssetFormValues>({
    resolver: zodResolver(physicalAssetSchema),
    defaultValues: {
      uniqueIdentifier:
        normalizedAsset?.uniqueIdentifier || normalizedAsset?.assetIdentifier || '',
      assetDescription: normalizedAsset?.assetDescription || '',
      // Ensure all ID fields are strings, not objects
      assetTypeId: typeof (normalizedAsset as any)?.assetTypeId === 'string' 
        ? (normalizedAsset as any)?.assetTypeId 
        : (typeof (normalizedAsset as any)?.assetTypeId === 'object' && (normalizedAsset as any)?.assetTypeId?.id 
            ? String((normalizedAsset as any).assetTypeId.id) 
            : ''),
      manufacturer: normalizedAsset?.manufacturer || '',
      model: normalizedAsset?.model || '',
      businessPurpose: normalizedAsset?.businessPurpose || '',
      ownerId: typeof (normalizedAsset as any)?.ownerId === 'string' 
        ? (normalizedAsset as any)?.ownerId 
        : (typeof (normalizedAsset as any)?.ownerId === 'object' && (normalizedAsset as any)?.ownerId?.id 
            ? String((normalizedAsset as any).ownerId.id) 
            : ''),
      businessUnitId: typeof (normalizedAsset as any)?.businessUnitId === 'string' 
        ? (normalizedAsset as any)?.businessUnitId 
        : (typeof (normalizedAsset as any)?.businessUnitId === 'object' && (normalizedAsset as any)?.businessUnitId?.id 
            ? String((normalizedAsset as any).businessUnitId.id) 
            : ''),
      physicalLocation: (normalizedAsset as any)?.physicalLocation || '',
      criticalityLevel: normalizedAsset?.criticalityLevel || 'medium',
      connectivityStatus: normalizedAsset?.connectivityStatus || 'connected',
      networkApprovalStatus: normalizedAsset?.networkApprovalStatus || 'not_required',
      notes: '',
      changeReason: '',
    },
  });

  // Effect to ensure all ID fields are strings (not objects) after form initialization
  useEffect(() => {
    if (!normalizedAsset) return;

    // Helper to safely get string ID from value
    const getStringId = (value: any): string | undefined => {
      if (!value) return undefined;
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value !== null && 'id' in value) {
        return String((value as { id?: string }).id || '');
      }
      return String(value);
    };

    // Check and normalize ownerId
    const currentOwnerId = form.getValues('ownerId');
    if (currentOwnerId && typeof currentOwnerId !== 'string') {
      const normalizedOwnerId = getStringId(currentOwnerId);
      if (normalizedOwnerId !== currentOwnerId) {
        form.setValue('ownerId', normalizedOwnerId || '', { shouldValidate: false });
      }
    }

    // Check and normalize businessUnitId
    const currentBusinessUnitId = form.getValues('businessUnitId');
    if (currentBusinessUnitId && typeof currentBusinessUnitId !== 'string') {
      const normalizedBusinessUnitId = getStringId(currentBusinessUnitId);
      if (normalizedBusinessUnitId !== currentBusinessUnitId) {
        form.setValue('businessUnitId', normalizedBusinessUnitId || '', { shouldValidate: false });
      }
    }

    // Check and normalize assetTypeId
    const currentAssetTypeId = form.getValues('assetTypeId');
    if (currentAssetTypeId && typeof currentAssetTypeId !== 'string') {
      const normalizedAssetTypeId = getStringId(currentAssetTypeId);
      if (normalizedAssetTypeId !== currentAssetTypeId) {
        form.setValue('assetTypeId', normalizedAssetTypeId || '', { shouldValidate: false });
      }
    }
  }, [normalizedAsset, form]);

  const createMutation = useMutation({
    mutationFn: (values: PhysicalAssetFormValues) => {
      const payload: CreatePhysicalAssetData = {
        uniqueIdentifier: values.uniqueIdentifier,
        assetDescription: values.assetDescription,
        assetTypeId: values.assetTypeId || undefined,
        manufacturer: values.manufacturer || undefined,
        model: values.model || undefined,
        businessPurpose: values.businessPurpose || undefined,
        ownerId: values.ownerId || undefined,
        businessUnitId: values.businessUnitId || undefined,
        physicalLocation: values.physicalLocation || undefined,
        criticalityLevel: values.criticalityLevel,
        connectivityStatus: values.connectivityStatus,
        networkApprovalStatus: values.networkApprovalStatus,
      };
      return assetsApi.createPhysicalAsset(payload);
    },
    onSuccess: () => {
      // Clear server errors on success
      setServerErrors([]);
      queryClient.invalidateQueries({ queryKey: ['physical-assets'] });
      toast({
        title: 'Success',
        description: 'Physical asset created successfully',
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create physical asset';
      
      setServerErrors(extractServerErrors(error, errorMessage));
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: PhysicalAssetFormValues) => {
      if (!asset?.id) {
        throw new Error('Asset ID is required to update a physical asset');
      }
      const payload: Partial<CreatePhysicalAssetData & { changeReason?: string }> = {
        uniqueIdentifier: values.uniqueIdentifier,
        assetDescription: values.assetDescription,
        assetTypeId: values.assetTypeId || undefined,
        manufacturer: values.manufacturer || undefined,
        model: values.model || undefined,
        businessPurpose: values.businessPurpose || undefined,
        ownerId: values.ownerId || undefined,
        businessUnitId: values.businessUnitId || undefined,
        physicalLocation: values.physicalLocation || undefined,
        criticalityLevel: values.criticalityLevel,
        connectivityStatus: values.connectivityStatus,
        networkApprovalStatus: values.networkApprovalStatus,
      };
      // Always send changeReason when provided so backend can record it in the audit log
      if (values.changeReason && values.changeReason.trim().length > 0) {
        (payload as any).changeReason = values.changeReason.trim();
      }
      return assetsApi.updatePhysicalAsset(asset.id, payload);
    },
    onSuccess: () => {
      // Clear server errors on success
      setServerErrors([]);
      queryClient.invalidateQueries({ queryKey: ['physical-assets'] });
      if (asset?.id) {
        queryClient.invalidateQueries({ queryKey: ['physical-asset', asset.id] });
      }
      toast({
        title: 'Success',
        description: 'Physical asset updated successfully',
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update physical asset';
      
      // Collect server errors for display (ensure all are strings)
      const errors: string[] = [];
      if (error?.response?.data?.message) {
        errors.push(typeof error.response.data.message === 'string' 
          ? error.response.data.message 
          : String(error.response.data.message));
      }
      // Handle validation errors from backend (can be array or object)
      if (error?.response?.data?.details?.errors) {
        const detailErrors = Array.isArray(error.response.data.details.errors) 
          ? error.response.data.details.errors 
          : [error.response.data.details.errors];
        detailErrors.forEach((err: any) => {
          if (typeof err === 'string') {
            errors.push(err);
          } else if (typeof err === 'object' && err !== null) {
            // Handle objects like {id, name, code} by extracting meaningful message
            if (err.message) errors.push(String(err.message));
            else if (err.name) errors.push(String(err.name));
            else if (err.id) errors.push(`Error: ${String(err.id)}`);
            else errors.push(JSON.stringify(err));
          } else {
            errors.push(String(err));
          }
        });
      }
      setServerErrors(errors.length > 0 ? errors : [errorMessage]);
      
      // If the error is about changeReason being required, set it on the field
      if (errorMessage.includes('reason for change') || errorMessage.includes('changeReason')) {
        form.setError('changeReason', {
          type: 'manual',
          message: errorMessage,
        });
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: PhysicalAssetFormValues) => {
    // Clear previous server errors
    setServerErrors([]);
    if (asset) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Helper to get field display name
  const getFieldDisplayName = (fieldName: string): string => {
    const fieldMap: Record<string, string> = {
      uniqueIdentifier: 'Unique Identifier',
      assetDescription: 'Asset Description',
      assetTypeId: 'Asset Type',
      manufacturer: 'Manufacturer',
      model: 'Model',
      businessPurpose: 'Business Purpose',
      ownerId: 'Owner',
      businessUnitId: 'Business Unit',
      physicalLocation: 'Physical Location',
      criticalityLevel: 'Criticality Level',
      connectivityStatus: 'Connectivity Status',
      networkApprovalStatus: 'Network Approval Status',
      changeReason: 'Reason for Change',
      notes: 'Notes',
    };
    return fieldMap[fieldName] || fieldName;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormValidationSummary
          formErrors={form.formState.errors}
          serverErrors={serverErrors}
          fieldNameMapper={getFieldDisplayName}
        />

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="uniqueIdentifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unique Identifier *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-testid="physical-unique-id-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assetDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      {...field}
                      data-testid="physical-description-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assetTypeId"
              render={({ field }) => {
                // Safely extract string value from field (handle objects)
                const fieldValue = field.value;
                let stringValue: string | undefined = undefined;
                
                if (!fieldValue) {
                  stringValue = undefined;
                } else if (typeof fieldValue === 'string') {
                  stringValue = fieldValue;
                } else if (typeof fieldValue === 'object' && fieldValue !== null) {
                  // Handle objects like {id, name, code}
                  if ('id' in fieldValue) {
                    stringValue = String((fieldValue as any).id || '') || undefined;
                  } else {
                    // If no id, try to stringify but log a warning
                    console.warn('Unexpected object in assetTypeId field:', fieldValue);
                    stringValue = undefined;
                  }
                } else {
                  stringValue = String(fieldValue) || undefined;
                }
                
                // Final safety check - ensure it's a string or undefined
                if (stringValue !== undefined && typeof stringValue !== 'string') {
                  console.error('assetTypeId value is not a string:', stringValue);
                  stringValue = undefined;
                }
                
                return (
                  <FormItem>
                    <FormLabel>Asset Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={stringValue || ''}
                    >
                      <FormControl>
                        <SelectTrigger
                          aria-label="Asset Type"
                          data-testid="physical-asset-type-dropdown-trigger"
                        >
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assetTypes.map((type: AssetType) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </TabsContent>

          <TabsContent value="ownership" className="space-y-4">
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => {
                // Safely extract string value from field (handle objects)
                const fieldValue = field.value;
                let stringValue: string | undefined = undefined;
                
                if (!fieldValue) {
                  stringValue = undefined;
                } else if (typeof fieldValue === 'string') {
                  stringValue = fieldValue;
                } else if (typeof fieldValue === 'object' && fieldValue !== null) {
                  // Handle objects like {id, name, code}
                  if ('id' in fieldValue) {
                    stringValue = String((fieldValue as any).id || '') || undefined;
                  } else {
                    // If no id, try to stringify but log a warning
                    console.warn('Unexpected object in ownerId field:', fieldValue);
                    stringValue = undefined;
                  }
                } else {
                  stringValue = String(fieldValue) || undefined;
                }
                
                // Final safety check - ensure it's a string or undefined
                if (stringValue !== undefined && typeof stringValue !== 'string') {
                  console.error('ownerId value is not a string:', stringValue);
                  stringValue = undefined;
                }
                
                return (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Auto-populate business unit from owner profile if available
                        const selectedUser = users.find((user) => user.id === value);
                        const ownerBusinessUnitId = selectedUser?.businessUnitId;
                        const currentBusinessUnitId = form.getValues('businessUnitId');
                        if (ownerBusinessUnitId && !currentBusinessUnitId) {
                          form.setValue('businessUnitId', ownerBusinessUnitId, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      }}
                      value={stringValue || ''}
                    >
                      <FormControl>
                        <SelectTrigger aria-label="Owner">
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {getUserDisplayName(user)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="businessUnitId"
              render={({ field }) => {
                // Safely extract string value from field (handle objects)
                const fieldValue = field.value;
                let stringValue: string | undefined = undefined;
                
                if (!fieldValue) {
                  stringValue = undefined;
                } else if (typeof fieldValue === 'string') {
                  stringValue = fieldValue;
                } else if (typeof fieldValue === 'object' && fieldValue !== null) {
                  // Handle objects like {id, name, code}
                  if ('id' in fieldValue) {
                    stringValue = String((fieldValue as any).id || '') || undefined;
                  } else {
                    // If no id, try to stringify but log a warning
                    console.warn('Unexpected object in businessUnitId field:', fieldValue);
                    stringValue = undefined;
                  }
                } else {
                  stringValue = String(fieldValue) || undefined;
                }
                
                // Final safety check - ensure it's a string or undefined
                if (stringValue !== undefined && typeof stringValue !== 'string') {
                  console.error('businessUnitId value is not a string:', stringValue);
                  stringValue = undefined;
                }
                
                return (
                  <FormItem>
                    <FormLabel>Business Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={stringValue || ''}
                    >
                      <FormControl>
                        <SelectTrigger aria-label="Business Unit">
                          <SelectValue placeholder="Select business unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessUnits.map((bu) => (
                          <SelectItem key={bu.id} value={bu.id}>
                            {getBusinessUnitDisplayName(bu)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <FormField
              control={form.control}
              name="physicalLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Location</FormLabel>
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
                  <FormLabel>Criticality Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="physical-criticality-dropdown-trigger">
                        <SelectValue placeholder="Select criticality" />
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

            <FormField
              control={form.control}
              name="connectivityStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connectivity Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select connectivity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="connected">Connected</SelectItem>
                      <SelectItem value="disconnected">Disconnected</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {asset && (
              <FormField
                control={form.control}
                name="changeReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Change</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Briefly explain why you are updating this asset (e.g. ownership, criticality, or location change)."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
            disabled={isSubmitting}
            data-testid={asset ? 'form-submit-update' : 'form-submit-create'}
          >
            {asset ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
