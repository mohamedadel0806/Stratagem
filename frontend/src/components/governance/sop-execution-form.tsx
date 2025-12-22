"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  governanceApi,
  SOPLog,
  ExecutionOutcome,
  CreateSOPLogData,
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
import { Plus, Trash2, Loader2, PlayCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stepResultSchema = z.object({
  step: z.string().min(1, "Step name is required"),
  result: z.string().min(1, "Result is required"),
  observations: z.string().optional(),
});

const sopLogSchema = z.object({
  sop_id: z.string().uuid("SOP is required"),
  execution_date: z.string().min(1, "Date is required"),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  outcome: z.nativeEnum(ExecutionOutcome),
  notes: z.string().optional(),
  step_results: z.array(stepResultSchema).optional(),
  executor_id: z.string().uuid().optional().or(z.literal("")),
});

type SOPLogFormData = z.infer<typeof sopLogSchema>;

interface SOPExecutionFormProps {
  log?: SOPLog | null;
  sopId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SOPExecutionForm({
  log,
  sopId,
  onSuccess,
  onCancel,
}: SOPExecutionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sopsData } = useQuery({
    queryKey: ["sops-list-simple"],
    queryFn: () => governanceApi.getSOPs({ limit: 100 }),
  });

  const form = useForm<SOPLogFormData>({
    resolver: zodResolver(sopLogSchema),
    defaultValues: log
      ? {
          sop_id: log.sop_id,
          execution_date: new Date(log.execution_date).toISOString().split('T')[0],
          start_time: log.start_time ? new Date(log.start_time).toISOString().slice(0, 16) : "",
          end_time: log.end_time ? new Date(log.end_time).toISOString().slice(0, 16) : "",
          outcome: log.outcome,
          notes: log.notes || "",
          step_results: log.step_results || [],
          executor_id: log.executor_id || "",
        }
      : {
          sop_id: sopId || "",
          execution_date: new Date().toISOString().split('T')[0],
          outcome: ExecutionOutcome.SUCCESSFUL,
          step_results: [{ step: "Step 1", result: "Completed" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "step_results",
  });

  const mutation = useMutation({
    mutationFn: (data: SOPLogFormData) => {
      const payload: CreateSOPLogData = {
        ...data,
        start_time: data.start_time ? new Date(data.start_time).toISOString() : undefined,
        end_time: data.end_time ? new Date(data.end_time).toISOString() : undefined,
        executor_id: data.executor_id || undefined,
      };

      if (log) {
        return governanceApi.updateSOPLog(log.id, payload);
      }
      return governanceApi.createSOPLog(payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `SOP execution ${log ? "updated" : "recorded"} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["sop-logs"] });
      if (sopId) {
        queryClient.invalidateQueries({ queryKey: ["sop-logs", sopId] });
      }
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save execution log",
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
            name="sop_id"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Procedure (SOP) *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!!sopId}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SOP to record" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sopsData?.data.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.sop_identifier}: {s.title}
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
            name="execution_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Execution Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="outcome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outcome</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ExecutionOutcome).map((o) => (
                      <SelectItem key={o} value={o} className="capitalize">
                        {o.replace(/_/g, " ")}
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
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>General Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Summary of the execution, deviations, or issues..."
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
            <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Step-by-Step Results</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append({ step: `Step ${fields.length + 1}`, result: "Success" })}
              className="text-xs"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Step
            </Button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <Card key={field.id} className="shadow-none border-dashed bg-muted/10">
                <CardContent className="p-3 space-y-3">
                  <div className="flex gap-3">
                    <FormField
                      control={form.control}
                      name={`step_results.${index}.step`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} className="h-8 text-xs font-semibold" placeholder="Step name/ID" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`step_results.${index}.result`}
                      render={({ field }) => (
                        <FormItem className="w-[120px]">
                          <FormControl>
                            <Input {...field} className="h-8 text-xs" placeholder="Result" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`step_results.${index}.observations`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea {...field} className="h-16 text-xs resize-none" placeholder="Observations for this step..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                Recording...
              </>
            ) : (
              log ? "Update Record" : "Confirm Execution"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}


