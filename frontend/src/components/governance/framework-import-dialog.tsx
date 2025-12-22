"use client";

import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const importFormSchema = z.object({
  version: z.string().optional(),
  create_version: z.boolean().default(false),
  replace_existing: z.boolean().default(false),
  structure_json: z.string().optional(),
});

type ImportFormValues = z.infer<typeof importFormSchema>;

interface FrameworkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  framework: Framework;
}

export function FrameworkImportDialog({
  open,
  onOpenChange,
  framework,
}: FrameworkImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      version: "",
      create_version: false,
      replace_existing: false,
      structure_json: "",
    },
  });

  const importMutation = useMutation({
    mutationFn: async (data: ImportFormValues & { file?: File }) => {
      if (data.file) {
        return governanceApi.importFrameworkStructureFromFile(
          framework.id,
          data.file,
          {
            version: data.version || undefined,
            create_version: data.create_version,
            replace_existing: data.replace_existing,
          }
        );
      } else if (data.structure_json) {
        const structure = JSON.parse(data.structure_json);
        return governanceApi.importFrameworkStructure(framework.id, {
          structure,
          version: data.version || undefined,
          create_version: data.create_version,
          replace_existing: data.replace_existing,
        });
      } else {
        throw new Error("Either file or JSON structure is required");
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["compliance-frameworks"] });
      queryClient.invalidateQueries({ queryKey: ["framework-structure", framework.id] });
      queryClient.invalidateQueries({ queryKey: ["framework-versions", framework.id] });
      toast({
        title: "Success",
        description: `Framework structure imported successfully. ${result.requirementsCreated} requirements created.`,
      });
      form.reset();
      setFile(null);
      setFileError(null);
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to import structure",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      setFileError(null);
      return;
    }

    setFileError(null);

    // Validate file type
    if (
      !selectedFile.name.endsWith(".json") &&
      !selectedFile.name.endsWith(".csv") &&
      selectedFile.type !== "application/json" &&
      selectedFile.type !== "text/csv"
    ) {
      setFileError("Please upload a JSON or CSV file");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const onSubmit = (values: ImportFormValues) => {
    if (!file && !values.structure_json) {
      setFileError("Please upload a file or provide JSON structure");
      return;
    }

    importMutation.mutate({
      ...values,
      file: file || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Framework Structure</DialogTitle>
          <DialogDescription>
            Import framework structure from JSON or CSV file for {framework.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2.0, 2022" {...field} />
                  </FormControl>
                  <FormDescription>
                    Version identifier for this import (required if creating a version)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Import Method</FormLabel>
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormLabel className="text-sm font-normal">Upload File</FormLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".json,.csv"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    {file && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        {file.name}
                      </div>
                    )}
                  </div>
                  {fileError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{fileError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="structure_json"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">JSON Structure</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='{"domains": [{"name": "Access Control", "categories": [...]}]}'
                          className="font-mono text-sm min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Paste JSON structure directly
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="create_version"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Create Version</FormLabel>
                    <FormDescription>
                      Create a new framework version from this import
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="replace_existing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Replace Existing Requirements</FormLabel>
                    <FormDescription>
                      Delete existing requirements before importing (use with caution)
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setFile(null);
                  setFileError(null);
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={importMutation.isPending}>
                {importMutation.isPending ? "Importing..." : "Import Structure"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


