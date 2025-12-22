"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  governanceApi,
  SecureBaseline,
  BaselineStatus,
  CreateSecureBaselineData,
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
import { Plus, Trash2, Loader2, GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const requirementSchema = z.object({
  requirement_identifier: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  configuration_value: z.string().optional(),
  validation_method: z.string().optional(),
  display_order: z.number().optional(),
});

const baselineSchema = z.object({
  name: z.string().min(1, "Name is required").max(500),
  description: z.string().optional(),
  category: z.string().optional(),
  version: z.string().optional(),
  status: z.nativeEnum(BaselineStatus).optional(),
  owner_id: z.string().uuid().optional().or(z.literal("")),
  requirements: z.array(requirementSchema).optional(),
  control_objective_ids: z.array(z.string().uuid()).optional(),
});

type BaselineFormData = z.infer<typeof baselineSchema>;

interface BaselineFormProps {
  baseline?: SecureBaseline | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BaselineForm({
  baseline,
  onSuccess,
  onCancel,
}: BaselineFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BaselineFormData>({
    resolver: zodResolver(baselineSchema),
    defaultValues: baseline
      ? {
          name: baseline.name,
          description: baseline.description || "",
          category: baseline.category || "",
          version: baseline.version || "",
          status: baseline.status,
          owner_id: baseline.owner_id || "",
          requirements: baseline.requirements.map(r => ({
            requirement_identifier: r.requirement_identifier,
            title: r.title,
            description: r.description || "",
            configuration_value: r.configuration_value || "",
            validation_method: r.validation_method || "",
            display_order: r.display_order,
          })),
          control_objective_ids: baseline.control_objectives.map(co => co.id),
        }
      : {
          status: BaselineStatus.DRAFT,
          requirements: [{ requirement_identifier: "REQ-01", title: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "requirements",
  });

  const mutation = useMutation({
    mutationFn: (data: BaselineFormData) => {
      const payload: CreateSecureBaselineData = {
        ...data,
        owner_id: data.owner_id || undefined,
      };

      if (baseline) {
        return governanceApi.updateBaseline(baseline.id, payload);
      }
      return governanceApi.createBaseline(payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Baseline ${baseline ? "updated" : "created"} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["secure-baselines"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save baseline",
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Baseline Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Windows 11 Secure Configuration" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., OS, Cloud, Network" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1.0.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    {Object.values(BaselineStatus).map((status) => (
                      <SelectItem key={status} value={status} className="capitalize">
                        {status}
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
            name="owner_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner (User UUID)</FormLabel>
                <FormControl>
                  <Input placeholder="Owner ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="General purpose and scope of this baseline..."
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Baseline Requirements</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ 
                requirement_identifier: `REQ-${String(fields.length + 1).padStart(2, '0')}`, 
                title: "" 
              })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Requirement
            </Button>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name={`requirements.${index}.requirement_identifier`}
                      render={({ field }) => (
                        <FormItem className="w-[120px]">
                          <FormLabel className="text-xs uppercase font-bold text-muted-foreground">ID</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-8 text-xs font-mono" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`requirements.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Title</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-8 text-xs font-medium" placeholder="Requirement title..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-6 h-8 w-8 text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`requirements.${index}.configuration_value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Desired Configuration</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-8 text-xs" placeholder="e.g. Enabled, 1024, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`requirements.${index}.validation_method`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Validation Method</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-8 text-xs" placeholder="e.g. GPO, Registry Key, Script" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

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
              baseline ? "Update Baseline" : "Create Baseline"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}


