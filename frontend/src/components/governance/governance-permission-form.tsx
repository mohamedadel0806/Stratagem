'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { governanceApi, GovernanceModule, GovernanceAction, CreateGovernancePermissionData } from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';

const permissionSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  module: z.nativeEnum(GovernanceModule),
  action: z.nativeEnum(GovernanceAction),
  resource_type: z.string().optional(),
  has_conditions: z.boolean().optional(),
  business_unit_restriction: z.boolean().optional(),
});

type PermissionFormData = z.infer<typeof permissionSchema>;

interface GovernancePermissionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const moduleOptions = Object.entries(GovernanceModule).map(([key, value]) => ({
  value,
  label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
}));

const actionOptions = Object.entries(GovernanceAction).map(([key, value]) => ({
  value,
  label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
}));

const roleOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'compliance_officer', label: 'Compliance Officer' },
  { value: 'risk_manager', label: 'Risk Manager' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'user', label: 'User' },
];

export function GovernancePermissionForm({ onSuccess, onCancel }: GovernancePermissionFormProps) {
  const { toast } = useToast();
  
  const form = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      has_conditions: false,
      business_unit_restriction: false,
    },
  });

  const hasConditions = form.watch('has_conditions');
  const businessUnitRestriction = form.watch('business_unit_restriction');

  const onSubmit = async (data: PermissionFormData) => {
    const permissionData: CreateGovernancePermissionData = {
      role: data.role,
      module: data.module,
      action: data.action,
      resource_type: data.resource_type || undefined,
      conditions: hasConditions && businessUnitRestriction
        ? { business_unit_id: 'user.business_unit_id' }
        : undefined,
    };

    try {
      await governanceApi.createGovernancePermission(permissionData);
      toast({
        title: 'Success',
        description: 'Permission created successfully',
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create permission',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="module"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Module *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a module" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {moduleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
            name="action"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an action" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {actionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="resource_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Type (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., policy, control, assessment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="has_conditions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Row-Level Security</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Apply conditions to restrict access (e.g., by business unit)
                </p>
              </div>
            </FormItem>
          )}
        />

        {hasConditions && (
          <FormField
            control={form.control}
            name="business_unit_restriction"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Restrict by Business Unit</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Users can only access resources from their business unit
                  </p>
                </div>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Permission</Button>
        </div>
      </form>
    </Form>
  );
}


