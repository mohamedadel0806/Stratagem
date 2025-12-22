"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  governanceApi,
  HookType,
  HookAction,
  CreateIntegrationHookData,
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
import { Loader2, Plus, Trash2, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

const hookSchema = z.object({
  name: z.string().min(1, "Hook name is required"),
  description: z.string().optional(),
  type: z.nativeEnum(HookType),
  action: z.nativeEnum(HookAction),
  isActive: z.boolean().default(true),
  mapping: z.record(z.string()).default({
    title: "alert_name",
    description: "message",
    severity: "level",
  }),
});

type HookFormData = z.infer<typeof hookSchema>;

interface IntegrationHookFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function IntegrationHookForm({
  onSuccess,
  onCancel,
}: IntegrationHookFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<HookFormData>({
    resolver: zodResolver(hookSchema),
    defaultValues: {
      type: HookType.CUSTOM,
      action: HookAction.CREATE_EVIDENCE,
      isActive: true,
      mapping: {
        title: "title",
        description: "description",
        severity: "severity",
      },
    },
  });

  const mutation = useMutation({
    mutationFn: (data: HookFormData) => {
      const payload: CreateIntegrationHookData = {
        name: data.name,
        description: data.description,
        type: data.type,
        action: data.action,
        isActive: data.isActive,
        config: {
          mapping: data.mapping,
        },
      };
      return governanceApi.createIntegrationHook(payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Integration hook created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["integration-hooks"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create hook",
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
                <FormLabel>Hook Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Splunk Security Alerts" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source System</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={HookType.SIEM}>SIEM (Splunk/Sentinel)</SelectItem>
                    <SelectItem value={HookType.VULNERABILITY_SCANNER}>Vulnerability Scanner</SelectItem>
                    <SelectItem value={HookType.CLOUD_MONITOR}>Cloud Monitor (AWS/Azure)</SelectItem>
                    <SelectItem value={HookType.CUSTOM}>Custom / Generic</SelectItem>
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
                <FormLabel>Triggered Action</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={HookAction.CREATE_EVIDENCE}>Create Evidence Record</SelectItem>
                    <SelectItem value={HookAction.CREATE_FINDING}>Raise Compliance Finding</SelectItem>
                    <SelectItem value={HookAction.UPDATE_CONTROL_STATUS}>Update Control Status</SelectItem>
                  </SelectContent>
                </Select>
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
                <Textarea placeholder="Explain how this integration will be used..." rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Payload Field Mapping</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><Info className="h-3.5 w-3.5" /></TooltipTrigger>
                <TooltipContent className="max-w-xs text-[10px]">
                  Map keys from the external JSON payload to internal fields. 
                  Example: If the SIEM sends {"{ 'msg': 'text' }"}, map <strong>description</strong> to <strong>msg</strong>.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-dashed">
            {Object.keys(form.getValues().mapping).map((target) => (
              <div key={target} className="space-y-1">
                <FormLabel className="text-[10px] uppercase font-bold text-primary">{target}</FormLabel>
                <Input 
                  placeholder={`Payload field for ${target}`} 
                  className="h-8 text-xs bg-background"
                  {...form.register(`mapping.${target}` as any)}
                />
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
                Initializing...
              </>
            ) : (
              "Generate Webhook URL"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


