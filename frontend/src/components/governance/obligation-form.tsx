"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  governanceApi,
  ComplianceObligation,
  ObligationStatus,
  ObligationPriority,
  CreateComplianceObligationData,
} from "@/lib/api/governance";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const obligationSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().optional(),
  influencer_id: z.string().uuid().optional().or(z.literal("")),
  source_reference: z.string().max(200).optional(),
  owner_id: z.string().uuid().optional().or(z.literal("")),
  business_unit_id: z.string().uuid().optional().or(z.literal("")),
  status: z.nativeEnum(ObligationStatus).optional(),
  priority: z.nativeEnum(ObligationPriority).optional(),
  due_date: z.string().optional(),
  evidence_summary: z.string().optional(),
});

type ObligationFormData = z.infer<typeof obligationSchema>;

interface ObligationFormProps {
  obligation?: ComplianceObligation | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ObligationForm({
  obligation,
  onSuccess,
  onCancel,
}: ObligationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: influencersData } = useQuery({
    queryKey: ["influencers-list-simple"],
    queryFn: () => governanceApi.getInfluencers({ limit: 100 }),
  });

  const form = useForm<ObligationFormData>({
    resolver: zodResolver(obligationSchema),
    defaultValues: obligation
      ? {
          title: obligation.title,
          description: obligation.description || "",
          influencer_id: obligation.influencer_id || "",
          source_reference: obligation.source_reference || "",
          owner_id: obligation.owner_id || "",
          business_unit_id: obligation.business_unit_id || "",
          status: obligation.status,
          priority: obligation.priority,
          due_date: obligation.due_date ? new Date(obligation.due_date).toISOString().split('T')[0] : "",
          evidence_summary: obligation.evidence_summary || "",
        }
      : {
          status: ObligationStatus.NOT_STARTED,
          priority: ObligationPriority.MEDIUM,
        },
  });

  const mutation = useMutation({
    mutationFn: (data: ObligationFormData) => {
      const payload: CreateComplianceObligationData = {
        ...data,
        influencer_id: data.influencer_id || undefined,
        owner_id: data.owner_id || undefined,
        business_unit_id: data.business_unit_id || undefined,
        due_date: data.due_date || undefined,
      };

      if (obligation) {
        return governanceApi.updateObligation(obligation.id, payload);
      }
      return governanceApi.createObligation(payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Obligation ${obligation ? "updated" : "created"} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["compliance-obligations"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save obligation",
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Obligation Title *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Data Retention Policy Compliance" {...field} />
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
                <Textarea
                  placeholder="Detailed description of the compliance obligation..."
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
            name="influencer_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Influencer</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select influencer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {influencersData?.data.map((inf) => (
                      <SelectItem key={inf.id} value={inf.id}>
                        {inf.name}
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
            name="source_reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Reference</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Article 4.2, Section B" {...field} />
                </FormControl>
                <FormDescription className="text-[10px]">
                  Specific reference within the influencer document
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ObligationStatus).map((status) => (
                      <SelectItem key={status} value={status} className="capitalize">
                        {status.replace(/_/g, " ")}
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
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ObligationPriority).map((priority) => (
                      <SelectItem key={priority} value={priority} className="capitalize">
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Unit Selector - Simplified for now */}
          <FormField
            control={form.control}
            name="business_unit_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsible Business Unit</FormLabel>
                <FormControl>
                  <Input placeholder="Business Unit UUID (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="evidence_summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evidence Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Summary of evidence demonstrating compliance..."
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              obligation ? "Update Obligation" : "Create Obligation"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}


