"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { governanceApi } from "@/lib/api/governance";
import { FileUp, Loader2, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface InfluencerImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InfluencerImportDialog({
  open,
  onOpenChange,
}: InfluencerImportDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    created: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  const importMutation = useMutation({
    mutationFn: (file: File) => governanceApi.importInfluencers(file),
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["influencers"] });
      if (data.created > 0) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${data.created} influencers.`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.response?.data?.message || "An unexpected error occurred during import.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = () => {
    if (file) {
      importMutation.mutate(file);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "name,category,sub_category,issuing_authority,jurisdiction,reference_number,description,publication_date,effective_date,status,applicability_status,source_url\n" +
      "Example Regulation,regulatory,Privacy,Authority Name,Global,REG-001,Description here,2023-01-01,2023-01-01,active,applicable,https://example.com";
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "influencer_import_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const reset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) reset();
    }}>
      <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Import Influencers
          </DialogTitle>
          <DialogDescription>
            Upload a CSV or JSON file to bulk import influencers into the registry.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select File</label>
              <Input
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                disabled={importMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: CSV, JSON. Maximum file size: 50MB.
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription className="text-xs">
                Ensure your file columns match the required fields: name, category, status, and applicability_status.
              </AlertDescription>
            </Alert>

            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4" />
              Download CSV Template
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4 flex-1 overflow-hidden flex flex-col">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-100 dark:border-green-900/30 text-center">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Created</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{result.created}</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-100 dark:border-orange-900/30 text-center">
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Skipped/Errors</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{result.skipped}</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="flex-1 flex flex-col min-h-0">
                <p className="text-sm font-medium mb-2">Import Details:</p>
                <ScrollArea className="flex-1 border rounded-md p-2 bg-muted/30">
                  <ul className="space-y-1">
                    {result.errors.map((err, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="shrink-0">•</span>
                        <span>{err}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Import process completed</span>
            </div>
          </div>
        )}

        <DialogFooter>
          {!result ? (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={importMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!file || importMutation.isPending}
              >
                {importMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Start Import"
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


