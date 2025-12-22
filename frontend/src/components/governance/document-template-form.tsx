"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  governanceApi,
  DocumentTemplate,
  TemplateType,
  CreateDocumentTemplateData,
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
import { Loader2, FileCode, Save } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Switch } from "@/components/ui/switch";

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  type: z.nativeEnum(TemplateType),
  category: z.string().optional(),
  content: z.string().min(1, "Template content is required"),
  version: z.string().default("1.0"),
  isActive: z.boolean().default(true),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface DocumentTemplateFormProps {
  template?: DocumentTemplate | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DocumentTemplateForm({
  template,
  onSuccess,
  onCancel,
}: DocumentTemplateFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: template
      ? {
          name: template.name,
          description: template.description || "",
          type: template.type,
          category: template.category || "",
          content: template.content,
          version: template.version,
          isActive: template.isActive,
        }
      : {
          type: TemplateType.POLICY,
          isActive: true,
          version: "1.0",
          content: "<h1>Template Title</h1><p>Start drafting your template here...</p>",
        },
  });

  const mutation = useMutation({
    mutationFn: (data: TemplateFormData) => {
      if (template) {
        return governanceApi.updateDocumentTemplate(template.id, data);
      }
      return governanceApi.createDocumentTemplate(data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Template ${template ? "updated" : "created"} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["document-templates"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save template",
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
                <FormLabel>Template Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., ISO 27001 Access Control Policy" {...field} />
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
                <FormLabel>Document Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={TemplateType.POLICY}>Policy</SelectItem>
                    <SelectItem value={TemplateType.SOP}>SOP</SelectItem>
                    <SelectItem value={TemplateType.STANDARD}>Standard</SelectItem>
                    <SelectItem value={TemplateType.REPORT}>Report</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input placeholder="e.g., Information Security" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-8 p-4 bg-muted/30 rounded-lg">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Template Version</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                  <FormLabel>Active Status</FormLabel>
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What is this template for? Who should use it?"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Template Content *</FormLabel>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                    minHeight="400px"
                  />
                </FormControl>
                <FormDescription>
                  This content will be used as the starting point for new documents.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background pb-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending} className="gap-2">
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {template ? "Update Template" : "Create Template"}
          </Button>
        </div>
      </form>
    </Form>
  );
}


