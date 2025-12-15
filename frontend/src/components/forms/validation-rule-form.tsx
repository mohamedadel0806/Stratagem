'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { validationRulesApi, complianceApi, ValidationRule, AssetType } from '@/lib/api/compliance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Trash2, Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const operatorOptions = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'in', label: 'In (Array)' },
  { value: 'not_in', label: 'Not In (Array)' },
  { value: 'exists', label: 'Exists' },
  { value: 'not_exists', label: 'Not Exists' },
];

const validationRuleSchema = z.object({
  requirementId: z.string().min(1, 'Requirement is required'),
  assetType: z.enum(['physical', 'information', 'application', 'software', 'supplier']),
  ruleName: z.string().min(1, 'Rule name is required'),
  ruleDescription: z.string().optional(),
  priority: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  validationLogic: z.object({
    conditions: z.array(
      z.object({
        field: z.string().min(1, 'Field is required'),
        operator: z.string(),
        value: z.any(),
      }),
    ),
    complianceCriteria: z.array(
      z.object({
        field: z.string().min(1, 'Field is required'),
        operator: z.string(),
        value: z.any(),
      }),
    ).min(1, 'At least one compliance criterion is required'),
    nonComplianceCriteria: z
      .array(
        z.object({
          field: z.string().min(1, 'Field is required'),
          operator: z.string(),
          value: z.any(),
        }),
      )
      .optional(),
    partialComplianceCriteria: z
      .array(
        z.object({
          field: z.string().min(1, 'Field is required'),
          operator: z.string(),
          value: z.any(),
        }),
      )
      .optional(),
  }),
});

type ValidationRuleFormData = z.infer<typeof validationRuleSchema>;

interface ValidationRuleFormProps {
  rule?: ValidationRule;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ValidationRuleForm({ rule, onSuccess, onCancel }: ValidationRuleFormProps) {
  const { toast } = useToast();
  const isEditing = !!rule;

  // Fetch requirements - ensure we get the requirement that's already selected when editing
  const { data: requirementsData, isLoading: isLoadingRequirements } = useQuery({
    queryKey: ['compliance-requirements', isEditing && rule?.requirementId ? rule.requirementId : 'all'],
    queryFn: () => {
      if (isEditing && rule?.requirementId) {
        // When editing, first try to get the specific requirement
        return complianceApi.getRequirement(rule.requirementId)
          .then(specificReq => {
            // Then get a smaller list of other requirements
            return complianceApi.getRequirements({ limit: 100 })
              .then(allReqs => {
                // Combine the specific requirement with the list
                const allIds = new Set(allReqs.data.map(r => r.id));
                if (!allIds.has(specificReq.id)) {
                  return {
                    ...allReqs,
                    data: [specificReq, ...allReqs.data]
                  };
                }
                return allReqs;
              });
          })
          .catch(error => {
            console.error('Failed to fetch specific requirement, falling back to list:', error);
            // Fallback to regular list if specific fetch fails
            return complianceApi.getRequirements({ limit: 200 });
          });
      }
      return complianceApi.getRequirements({ limit: 500 });
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    enabled: !!(rule && isEditing) || !isEditing, // Only enable query when form is properly initialized
  });

  const form = useForm<ValidationRuleFormData>({
    resolver: zodResolver(validationRuleSchema),
    defaultValues: {
      requirementId: rule?.requirementId || '',
      assetType: rule?.assetType || 'physical',
      ruleName: rule?.ruleName || '',
      ruleDescription: rule?.ruleDescription || '',
      priority: rule?.priority || 0,
      isActive: rule?.isActive ?? true,
      validationLogic: rule?.validationLogic || {
        conditions: [],
        complianceCriteria: [{ field: '', operator: 'equals', value: '' }],
        nonComplianceCriteria: [],
        partialComplianceCriteria: [],
      },
    },
  });

  // Update form values when rule prop changes (for editing)
  useEffect(() => {
    if (rule && isEditing) {
      form.reset({
        requirementId: rule.requirementId,
        assetType: rule.assetType,
        ruleName: rule.ruleName,
        ruleDescription: rule.ruleDescription || '',
        priority: rule.priority,
        isActive: rule.isActive,
        validationLogic: rule.validationLogic,
      });
    }
  }, [rule, isEditing, form]);

  const conditionsArray = useFieldArray({
    control: form.control,
    name: 'validationLogic.conditions',
  });

  const complianceCriteriaArray = useFieldArray({
    control: form.control,
    name: 'validationLogic.complianceCriteria',
  });

  const nonComplianceCriteriaArray = useFieldArray({
    control: form.control,
    name: 'validationLogic.nonComplianceCriteria',
  });

  const partialComplianceCriteriaArray = useFieldArray({
    control: form.control,
    name: 'validationLogic.partialComplianceCriteria',
  });

  const createMutation = useMutation({
    mutationFn: (data: ValidationRuleFormData) => {
      // Ensure required fields are present for creation
      const createData = {
        requirementId: data.requirementId,
        assetType: data.assetType,
        ruleName: data.ruleName,
        ruleDescription: data.ruleDescription,
        validationLogic: {
          conditions: (data.validationLogic.conditions || []).filter(c => c.field && c.operator) as any[],
          complianceCriteria: (data.validationLogic.complianceCriteria || []).filter(c => c.field && c.operator) as any[],
          nonComplianceCriteria: (data.validationLogic.nonComplianceCriteria || []).filter(c => c.field && c.operator) as any[],
          partialComplianceCriteria: (data.validationLogic.partialComplianceCriteria || []).filter(c => c.field && c.operator) as any[],
        },
        priority: data.priority,
        isActive: data.isActive,
      };
      return validationRulesApi.create(createData);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Validation rule created successfully',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create validation rule',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<ValidationRuleFormData>) => {
      // Ensure we don't send undefined fields and properly type the validationLogic
      const updateData: any = {};
      if (data.ruleName !== undefined) updateData.ruleName = data.ruleName;
      if (data.ruleDescription !== undefined) updateData.ruleDescription = data.ruleDescription;
      if (data.validationLogic !== undefined) updateData.validationLogic = data.validationLogic;
      if (data.priority !== undefined) updateData.priority = data.priority;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;
      
      return validationRulesApi.update(rule!.id, updateData);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Validation rule updated successfully',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update validation rule',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ValidationRuleFormData) => {
    if (isEditing) {
      // For editing, don't send requirementId as it can't be changed
      const { requirementId, ...updateData } = data;
      updateMutation.mutate(updateData);
    } else {
      createMutation.mutate(data);
    }
  };

  const addCriterion = (
    type: 'compliance' | 'nonCompliance' | 'partial',
  ) => {
    // Create criterion with required fields to match API expectations
    const newCriterion = { field: '', operator: 'equals', value: '' };
    if (type === 'compliance') {
      complianceCriteriaArray.append(newCriterion);
    } else if (type === 'nonCompliance') {
      nonComplianceCriteriaArray.append(newCriterion);
    } else {
      partialComplianceCriteriaArray.append(newCriterion);
    }
  };

  const renderCriterionField = (
    index: number,
    fieldName: 'complianceCriteria' | 'nonComplianceCriteria' | 'partialComplianceCriteria',
  ) => {
    const array =
      fieldName === 'complianceCriteria'
        ? complianceCriteriaArray
        : fieldName === 'nonComplianceCriteria'
          ? nonComplianceCriteriaArray
          : partialComplianceCriteriaArray;

    return (
      <Card key={`${fieldName}-${index}`}>
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`validationLogic.${fieldName}.${index}.field`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., criticalityLevel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`validationLogic.${fieldName}.${index}.operator`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operator</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {operatorOptions.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`validationLogic.${fieldName}.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Value or JSON array"
                      {...field}
                      value={typeof field.value === 'object' ? JSON.stringify(field.value) : field.value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        try {
                          field.onChange(JSON.parse(val));
                        } catch {
                          field.onChange(val);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => array.remove(index)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="requirementId"
            render={({ field }) => {
              const hasRequirements = requirementsData?.data && requirementsData.data.length > 0;
              // Only set value if requirements are loaded and value exists in the list
              const selectValue = hasRequirements && field.value && requirementsData.data.some(r => r.id === field.value)
                ? field.value
                : '';
              
              // Find current requirement for display when editing
              const currentRequirement = isEditing && rule?.requirementId && requirementsData?.data
                ? requirementsData.data.find(r => r.id === rule.requirementId)
                : null;
              
              return (
                <FormItem>
                  <FormLabel>Requirement</FormLabel>
                  {isLoadingRequirements ? (
                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                      Loading requirements...
                    </div>
                  ) : !hasRequirements ? (
                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                      No requirements available
                    </div>
                  ) : isEditing && currentRequirement ? (
                    <div className="space-y-2">
                      <div className="p-2 bg-muted rounded-md">
                        <div className="font-medium">{currentRequirement.title}</div>
                        {currentRequirement.requirementCode && (
                          <div className="text-sm text-muted-foreground">
                            Code: {currentRequirement.requirementCode}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Requirement cannot be changed when editing
                      </div>
                    </div>
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      value={selectValue}
                      disabled={isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select requirement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {requirementsData.data.map((req) => (
                          <SelectItem key={req.id} value={req.id}>
                            {req.requirementCode || req.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="assetType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="information">Information</SelectItem>
                    <SelectItem value="application">Application</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ruleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rule Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Criticality Level Required" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ruleDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe what this rule validates..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Higher priority rules are evaluated first</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active</FormLabel>
                  <FormDescription>Enable or disable this validation rule</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Conditions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Conditions that must be met for this rule to apply
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {conditionsArray.fields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`validationLogic.conditions.${index}.field`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., criticalityLevel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`validationLogic.conditions.${index}.operator`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operator</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {operatorOptions.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`validationLogic.conditions.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Value or JSON array"
                              {...field}
                              value={typeof field.value === 'object' ? JSON.stringify(field.value) : field.value || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                try {
                                  field.onChange(JSON.parse(val));
                                } catch {
                                  field.onChange(val);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => conditionsArray.remove(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => conditionsArray.append({ field: '', operator: 'equals', value: '' })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </CardContent>
        </Card>

        {/* Compliance Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Criteria</CardTitle>
            <p className="text-sm text-muted-foreground">
              Criteria that must be met for the asset to be compliant
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceCriteriaArray.fields.map((field, index) =>
              renderCriterionField(index, 'complianceCriteria'),
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => addCriterion('compliance')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Compliance Criterion
            </Button>
          </CardContent>
        </Card>

        {/* Non-Compliance Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Non-Compliance Criteria (Optional)</CardTitle>
            <p className="text-sm text-muted-foreground">
              Criteria that indicate non-compliance
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {nonComplianceCriteriaArray.fields.map((field, index) =>
              renderCriterionField(index, 'nonComplianceCriteria'),
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => addCriterion('nonCompliance')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Non-Compliance Criterion
            </Button>
          </CardContent>
        </Card>

        {/* Partial Compliance Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Partial Compliance Criteria (Optional)</CardTitle>
            <p className="text-sm text-muted-foreground">
              Criteria that indicate partial compliance
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {partialComplianceCriteriaArray.fields.map((field, index) =>
              renderCriterionField(index, 'partialComplianceCriteria'),
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => addCriterion('partial')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Partial Compliance Criterion
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {(createMutation.isPending || updateMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? 'Update Rule' : 'Create Rule'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

