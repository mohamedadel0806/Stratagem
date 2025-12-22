"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  workflowsApi,
  WorkflowTriggerRule,
  RuleOperator,
  CreateWorkflowTriggerRuleData,
} from "@/lib/api/workflows";
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
import { Plus, Trash2, Loader2, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const conditionSchema = z.object({
  field: z.string().min(1, "Field is required"),
  operator: z.nativeEnum(RuleOperator),
  value: z.string().min(1, "Value is required"),
});

const ruleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  entityType: z.string().min(1, "Entity Type is required"),
  trigger: z.string().min(1, "Trigger is required"),
  workflowId: z.string().uuid("Workflow is required"),
  priority: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  conditions: z.array(conditionSchema),
});

type RuleFormData = z.infer<typeof ruleSchema>;

interface WorkflowRuleFormProps {
  rule?: WorkflowTriggerRule | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function WorkflowRuleForm({
  rule,
  onSuccess,
  onCancel,
}: WorkflowRuleFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workflows = [] } = useQuery({
    queryKey: ["workflows-list"],
    queryFn: () => workflowsApi.getAll(),
  });

  const form = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: rule
      ? {
          name: rule.name,
          description: rule.description || "",
          entityType: rule.entityType,
          trigger: rule.trigger,
          workflowId: rule.workflowId,
          priority: rule.priority,
          isActive: rule.isActive,
          conditions: rule.conditions.map(c => ({
            field: c.field,
            operator: c.operator,
            value: typeof c.value === 'string' ? c.value : JSON.stringify(c.value),
          })),
        }
      : {
          isActive: true,
          priority: 0,
          conditions: [{ field: "status", operator: RuleOperator.EQUALS, value: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "conditions",
  });

  const mutation = useMutation({
    mutationFn: (data: RuleFormData) => {
      const payload: CreateWorkflowTriggerRuleData = {
        ...data,
      };

      if (rule) {
        return workflowsApi.updateRule(rule.id, payload);
      }
      return workflowsApi.createRule(payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Workflow rule ${rule ? "updated" : "created"} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["workflow-rules"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save workflow rule",
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
                <FormLabel>Rule Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., High Risk Assessment Approval" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="entityType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entity Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="risk">Risk</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="sop">SOP</SelectItem>
                    <SelectItem value="compliance_requirement">Requirement</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trigger"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trigger Event</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="on_create">On Create</SelectItem>
                    <SelectItem value="on_update">On Update</SelectItem>
                    <SelectItem value="on_status_change">On Status Change</SelectItem>
                    <SelectItem value="on_deadline_passed">On Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workflowId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Execute Workflow *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workflow template..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {workflows.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name} ({w.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The specific workflow to trigger when conditions match</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-8 p-4 bg-muted/30 rounded-lg">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Priority Order</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>Higher numbers take precedence</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                <div className="space-y-0.5 mr-4">
                  <FormLabel>Rule Active</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Conditions (AND logic)</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ field: "", operator: RuleOperator.EQUALS, value: "" })}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Condition
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`conditions.${index}.field`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Field (e.g. status, category)" className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`conditions.${index}.operator`}
                  render={({ field }) => (
                    <FormItem className="w-[140px]">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Operator" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={RuleOperator.EQUALS}>Equals</SelectItem>
                          <SelectItem value={RuleOperator.NOT_EQUALS}>Not Equals</SelectItem>
                          <SelectItem value={RuleOperator.CONTAINS}>Contains</SelectItem>
                          <SelectItem value={RuleOperator.GREATER_THAN}>Greater Than</SelectItem>
                          <SelectItem value={RuleOperator.LESS_THAN}>Less Than</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`conditions.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Value" className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
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
              rule ? "Update Rule" : "Create Rule"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}


