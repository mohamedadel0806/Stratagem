'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { TestTube } from 'lucide-react';

const validationRuleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  assetType: z.enum(['physical', 'information', 'application', 'software', 'supplier', 'all']),
  fieldName: z.string().min(1, 'Field name is required'),
  validationType: z.enum([
    'required',
    'regex',
    'min_length',
    'max_length',
    'min_value',
    'max_value',
    'email',
    'url',
    'date',
    'custom',
  ]),
  regexPattern: z.string().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  customValidationScript: z.string().optional(),
  errorMessage: z.string().optional(),
  severity: z.enum(['error', 'warning']).default('error'),
  dependencies: z
    .array(
      z.object({
        field: z.string(),
        condition: z.string(),
        value: z.any(),
      }),
    )
    .optional(),
  isActive: z.boolean().default(true),
  applyToImport: z.boolean().default(false),
});

type ValidationRuleFormValues = z.infer<typeof validationRuleSchema>;

interface ValidationRuleFormProps {
  rule?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ValidationRuleForm({ rule, onSuccess, onCancel }: ValidationRuleFormProps) {
  const { toast } = useToast();
  const [testValue, setTestValue] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  const form = useForm<ValidationRuleFormValues>({
    resolver: zodResolver(validationRuleSchema),
    defaultValues: rule || {
      name: '',
      description: '',
      assetType: 'physical',
      fieldName: '',
      validationType: 'required',
      severity: 'error',
      isActive: true,
      applyToImport: false,
    },
  });

  const validationType = form.watch('validationType');

  const createMutation = useMutation({
    mutationFn: (data: ValidationRuleFormValues) => assetsApi.createValidationRule(data),
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
        description: error.response?.data?.message || 'Failed to create rule',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ValidationRuleFormValues) =>
      assetsApi.updateValidationRule(rule.id, data),
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
        description: error.response?.data?.message || 'Failed to update rule',
        variant: 'destructive',
      });
    },
  });

  const testMutation = useMutation({
    mutationFn: ({ ruleId, testValue }: { ruleId: string; testValue: any }) =>
      assetsApi.testValidationRule(ruleId, testValue),
    onSuccess: (result) => {
      setTestResult(result);
      toast({
        title: result.isValid ? 'Validation Passed' : 'Validation Failed',
        description: result.message,
        variant: result.isValid ? 'default' : 'destructive',
      });
    },
  });

  const onSubmit = (data: ValidationRuleFormValues) => {
    if (rule) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleTest = () => {
    if (!rule?.id) {
      toast({
        title: 'Error',
        description: 'Please save the rule first before testing',
        variant: 'destructive',
      });
      return;
    }

    testMutation.mutate({ ruleId: rule.id, testValue });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rule Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="IP Address Format Validation" />
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
                <Textarea {...field} placeholder="Description of this validation rule" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="assetType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <SelectItem value="all">All Types</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fieldName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ipAddress" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="validationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Validation Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="regex">Regex Pattern</SelectItem>
                  <SelectItem value="min_length">Minimum Length</SelectItem>
                  <SelectItem value="max_length">Maximum Length</SelectItem>
                  <SelectItem value="min_value">Minimum Value</SelectItem>
                  <SelectItem value="max_value">Maximum Value</SelectItem>
                  <SelectItem value="email">Email Format</SelectItem>
                  <SelectItem value="url">URL Format</SelectItem>
                  <SelectItem value="date">Date Format</SelectItem>
                  <SelectItem value="custom">Custom Script</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {validationType === 'regex' && (
          <FormField
            control={form.control}
            name="regexPattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regex Pattern</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}$" />
                </FormControl>
                <FormDescription>Enter a valid regular expression pattern</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {validationType === 'min_length' && (
          <FormField
            control={form.control}
            name="minLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Length</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {validationType === 'max_length' && (
          <FormField
            control={form.control}
            name="maxLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Length</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {validationType === 'min_value' && (
          <FormField
            control={form.control}
            name="minValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {validationType === 'max_value' && (
          <FormField
            control={form.control}
            name="maxValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {validationType === 'custom' && (
          <FormField
            control={form.control}
            name="customValidationScript"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Validation Script</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="return value && value.length > 0;"
                    className="font-mono text-sm"
                  />
                </FormControl>
                <FormDescription>
                  JavaScript function that returns true if valid, false otherwise. Use 'value' as the variable name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="errorMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Error Message</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Custom error message (optional)" />
              </FormControl>
              <FormDescription>
                Leave empty to use default error message
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
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
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="applyToImport"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Apply to Imports</FormLabel>
                <FormDescription>
                  Apply this validation rule during bulk asset imports
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {rule?.id && (
          <div className="border rounded-lg p-4 space-y-2">
            <Label>Test Validation Rule</Label>
            <div className="flex gap-2">
              <Input
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                placeholder="Enter test value"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleTest}
                disabled={testMutation.isPending}
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test
              </Button>
            </div>
            {testResult && (
              <div
                className={`text-sm p-2 rounded ${
                  testResult.isValid
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {testResult.message}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {rule ? 'Update' : 'Create'} Rule
          </Button>
        </div>
      </form>
    </Form>
  );
}
