"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { governanceApi } from "@/lib/api/governance";
import { complianceApi, Framework } from "@/lib/api/compliance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const versionFormSchema = z.object({
  version: z.string().min(1, "Version is required"),
  version_notes: z.string().optional(),
  effective_date: z.string().optional(),
  is_current: z.boolean().default(false),
});

type VersionFormValues = z.infer<typeof versionFormSchema>;

interface CreateFrameworkVersionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  framework: Framework;
}

export function CreateFrameworkVersionForm({
  open,
  onOpenChange,
  framework,
}: CreateFrameworkVersionFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<VersionFormValues>({
    resolver: zodResolver(versionFormSchema),
    defaultValues: {
      version: "",
      version_notes: "",
      effective_date: "",
      is_current: false,
    },
  });

  const createVersionMutation = useMutation({
    mutationFn: (data: VersionFormValues) =>
      governanceApi.createFrameworkVersion(framework.id, {
        version: data.version,
        version_notes: data.version_notes,
        effective_date: data.effective_date,
        is_current: data.is_current,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["framework-versions", framework.id] });
      queryClient.invalidateQueries({ queryKey: ["compliance-frameworks"] });
      toast({
        title: "Success",
        description: "Framework version created successfully",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create version",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: VersionFormValues) => {
    createVersionMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Version</DialogTitle>
          <DialogDescription>
            Create a new version for {framework.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2.0, 2022, 1.1" {...field} />
                  </FormControl>
                  <FormDescription>
                    Version identifier (e.g., 2.0, 2022, 1.1)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe changes in this version..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="effective_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effective Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_current"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Set as Current Version</FormLabel>
                    <FormDescription>
                      This version will become the active version for the framework
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createVersionMutation.isPending}>
                {createVersionMutation.isPending ? "Creating..." : "Create Version"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


