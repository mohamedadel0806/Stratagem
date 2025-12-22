'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { governanceApi, CreateDomainData, ControlDomain } from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';
import { usersApi, User } from '@/lib/api/users';
import { Switch } from '@/components/ui/switch';

const domainSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().optional(),
  parent_id: z.string().uuid().optional().or(z.literal('')),
  owner_id: z.string().uuid().optional().or(z.literal('')),
  code: z.string().max(100).optional(),
  display_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

type DomainFormData = z.infer<typeof domainSchema>;

interface DomainFormProps {
  domain?: ControlDomain | null;
  onSuccess: () => void;
  onCancel: () => void;
  excludeId?: string; // For excluding current domain from parent selection
}

export function DomainForm({ domain, onSuccess, onCancel, excludeId }: DomainFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: domains = [] } = useQuery({
    queryKey: ['domains'],
    queryFn: () => governanceApi.getDomains(true), // Include inactive for parent selection
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<DomainFormData>({
    resolver: zodResolver(domainSchema),
    defaultValues: domain
      ? {
          name: domain.name,
          description: domain.description,
          parent_id: domain.parent_id || '',
          owner_id: domain.owner_id || '',
          code: domain.code,
          display_order: domain.display_order,
          is_active: domain.is_active,
        }
      : {
          is_active: true,
          display_order: 0,
        },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateDomainData) => {
      if (domain) {
        return governanceApi.updateDomain(domain.id, data);
      }
      return governanceApi.createDomain(data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: domain ? 'Domain updated successfully' : 'Domain created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['domain-hierarchy'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save domain',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: DomainFormData) => {
    mutation.mutate({
      ...data,
      parent_id: data.parent_id || undefined,
      owner_id: data.owner_id || undefined,
    } as CreateDomainData);
  };

  // Filter out current domain and its descendants from parent options
  const getAvailableParents = (): ControlDomain[] => {
    if (!domain || !excludeId) return domains;
    return domains.filter((d) => d.id !== excludeId);
  };

  const getUserDisplayName = (user: User): string => {
    if (user.firstName || user.lastName) {
      return [user.firstName, user.lastName].filter(Boolean).join(' ');
    }
    return user.email;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Identity and Access Management" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., IAM" />
              </FormControl>
              <FormDescription>Short code for the domain (e.g., IAM, NET, SEC)</FormDescription>
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
                <Textarea {...field} placeholder="Enter domain description..." rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="parent_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Domain</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent domain (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None (Root Domain)</SelectItem>
                    {getAvailableParents().map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} {d.code && `(${d.code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select a parent domain to create a hierarchy</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain Owner</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain owner (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">No Owner</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {getUserDisplayName(user)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Assign an owner responsible for this domain</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="display_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    min={0}
                  />
                </FormControl>
                <FormDescription>Order for display in lists (lower numbers appear first)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div>
                    <FormLabel>Active</FormLabel>
                    <FormDescription>Inactive domains won't appear in dropdowns</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : domain ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}


