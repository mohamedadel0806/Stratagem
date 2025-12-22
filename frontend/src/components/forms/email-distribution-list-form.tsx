'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { usersApi } from '@/lib/api/users';
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
import { Plus, X } from 'lucide-react';

const distributionListSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  emailAddresses: z.array(z.string().email('Invalid email address')).min(1, 'At least one email is required'),
  userIds: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

type DistributionListFormValues = z.infer<typeof distributionListSchema>;

interface EmailDistributionListFormProps {
  list?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmailDistributionListForm({
  list,
  onSuccess,
  onCancel,
}: EmailDistributionListFormProps) {
  const { toast } = useToast();

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const form = useForm<DistributionListFormValues>({
    resolver: zodResolver(distributionListSchema),
    defaultValues: list || {
      name: '',
      description: '',
      emailAddresses: [''],
      userIds: [],
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'emailAddresses',
  });

  const createMutation = useMutation({
    mutationFn: (data: DistributionListFormValues) => assetsApi.createEmailDistributionList(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Distribution list created successfully',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create distribution list',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: DistributionListFormValues) =>
      assetsApi.updateEmailDistributionList(list.id, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Distribution list updated successfully',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update distribution list',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: DistributionListFormValues) => {
    // Filter out empty email addresses
    const filteredData = {
      ...data,
      emailAddresses: data.emailAddresses.filter(email => email.trim() !== ''),
    };

    if (list) {
      updateMutation.mutate(filteredData);
    } else {
      createMutation.mutate(filteredData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>List Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Executive Team" />
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
                <Textarea {...field} placeholder="Description of this distribution list" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label>Email Addresses</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`emailAddresses.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} type="email" placeholder="email@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append('')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Email
          </Button>
        </div>

        {users && users.length > 0 && (
          <div className="space-y-2">
            <Label>Users</Label>
            <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto">
              {users.map((user: any) => (
                <FormField
                  key={user.id}
                  control={form.control}
                  name="userIds"
                  render={({ field }) => {
                    const userIds = field.value || [];
                    return (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={userIds.includes(user.id)}
                            onCheckedChange={(checked) => {
                              const newUserIds = checked
                                ? [...userIds, user.id]
                                : userIds.filter((id: string) => id !== user.id);
                              field.onChange(newUserIds);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
                <FormDescription>
                  Only active distribution lists will receive scheduled reports
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {list ? 'Update' : 'Create'} List
          </Button>
        </div>
      </form>
    </Form>
  );
}



