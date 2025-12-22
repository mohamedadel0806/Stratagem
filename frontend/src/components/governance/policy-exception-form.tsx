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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  governanceApi,
  PolicyException,
  ExceptionType,
  CreatePolicyExceptionData,
  UpdatePolicyExceptionData,
} from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const exceptionSchema = z.object({
  exception_type: z.nativeEnum(ExceptionType).optional(),
  entity_id: z.string().uuid('Invalid entity ID'),
  entity_type: z.string().optional(),
  requesting_business_unit_id: z.string().uuid().optional().or(z.literal('')),
  business_justification: z.string().min(10, 'Business justification must be at least 10 characters'),
  compensating_controls: z.string().optional(),
  risk_assessment: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  auto_expire: z.boolean().optional(),
  next_review_date: z.string().optional(),
});

type ExceptionFormData = z.infer<typeof exceptionSchema>;

interface PolicyExceptionFormProps {
  exception?: PolicyException | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const typeOptions = Object.entries(ExceptionType).map(([key, value]) => ({
  value,
  label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
}));

export function PolicyExceptionForm({ exception, onSuccess, onCancel }: PolicyExceptionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ExceptionFormData>({
    resolver: zodResolver(exceptionSchema),
    defaultValues: exception
      ? {
          exception_type: exception.exception_type,
          entity_id: exception.entity_id,
          entity_type: exception.entity_type,
          requesting_business_unit_id: exception.requesting_business_unit_id || '',
          business_justification: exception.business_justification,
          compensating_controls: exception.compensating_controls || '',
          risk_assessment: exception.risk_assessment || '',
          start_date: exception.start_date ? new Date(exception.start_date).toISOString().split('T')[0] : '',
          end_date: exception.end_date ? new Date(exception.end_date).toISOString().split('T')[0] : '',
          auto_expire: exception.auto_expire,
          next_review_date: exception.next_review_date
            ? new Date(exception.next_review_date).toISOString().split('T')[0]
            : '',
        }
      : {
          exception_type: ExceptionType.POLICY,
          auto_expire: true,
        },
  });

  const mutation = useMutation({
    mutationFn: (data: ExceptionFormData) => {
      if (exception) {
        const updateData: UpdatePolicyExceptionData = {
          exception_type: data.exception_type,
          business_justification: data.business_justification,
          compensating_controls: data.compensating_controls || undefined,
          risk_assessment: data.risk_assessment || undefined,
          start_date: data.start_date || undefined,
          end_date: data.end_date || undefined,
          auto_expire: data.auto_expire,
          next_review_date: data.next_review_date || undefined,
        };
        return governanceApi.updatePolicyException(exception.id, updateData);
      } else {
        const createData: CreatePolicyExceptionData = {
          exception_type: data.exception_type,
          entity_id: data.entity_id,
          entity_type: data.entity_type || undefined,
          requesting_business_unit_id: data.requesting_business_unit_id || undefined,
          business_justification: data.business_justification,
          compensating_controls: data.compensating_controls || undefined,
          risk_assessment: data.risk_assessment || undefined,
          start_date: data.start_date || undefined,
          end_date: data.end_date || undefined,
          auto_expire: data.auto_expire,
          next_review_date: data.next_review_date || undefined,
        };
        return governanceApi.createPolicyException(createData);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: exception ? 'Exception updated successfully' : 'Exception requested successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['policy-exceptions'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save exception',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ExceptionFormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="exception_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exception Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {typeOptions.map((option) => (
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
            name="entity_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entity ID *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter entity UUID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="entity_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entity Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g., policy, standard, control" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requesting_business_unit_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Unit ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter business unit UUID (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="business_justification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Justification *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain why this exception is needed..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="compensating_controls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compensating Controls</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe compensating controls in place..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="risk_assessment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Assessment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Assess the risks associated with this exception..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="next_review_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Next Review Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="auto_expire"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Auto-Expire</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Automatically expire this exception when the end date is reached
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {exception ? 'Update Exception' : 'Request Exception'}
          </Button>
        </div>
      </form>
    </Form>
  );
}


