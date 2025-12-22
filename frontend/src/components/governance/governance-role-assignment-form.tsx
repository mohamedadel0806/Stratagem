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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { governanceApi, AssignRoleData } from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';

const assignmentSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  role: z.string().min(1, 'Role is required'),
  business_unit_id: z.string().uuid().optional().or(z.literal('')),
  expires_at: z.string().optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface GovernanceRoleAssignmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const roleOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'compliance_officer', label: 'Compliance Officer' },
  { value: 'risk_manager', label: 'Risk Manager' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'user', label: 'User' },
];

export function GovernanceRoleAssignmentForm({ onSuccess, onCancel }: GovernanceRoleAssignmentFormProps) {
  const { toast } = useToast();
  
  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
  });

  const onSubmit = async (data: AssignmentFormData) => {
    const assignmentData: AssignRoleData = {
      user_id: data.user_id,
      role: data.role,
      business_unit_id: data.business_unit_id || undefined,
      expires_at: data.expires_at || undefined,
    };

    try {
      await governanceApi.assignRole(assignmentData);
      toast({
        title: 'Success',
        description: 'Role assigned successfully',
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to assign role',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID *</FormLabel>
              <FormControl>
                <Input placeholder="Enter user UUID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="business_unit_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Unit ID (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter business unit UUID for row-level security" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expires_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Assign Role</Button>
        </div>
      </form>
    </Form>
  );
}


