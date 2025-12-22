"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Database,
  FileUp,
  FileDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Shield,
  FileText,
  Briefcase,
  History,
  Info,
} from "lucide-react";
import { governanceApi } from "@/lib/api/governance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { convertToCSV, downloadCSV } from "@/lib/utils/export";

export default function DataManagementPage() {
  const { toast } = useToast();
  const [importingType, setImportingType] = useState<'policies' | 'controls' | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<{ created: number; skipped: number; errors: string[] } | null>(null);

  const importMutation = useMutation({
    mutationFn: ({ type, file }: { type: 'policies' | 'controls', file: File }) => 
      governanceApi.importGovernanceData(type, file),
    onSuccess: (data) => {
      setResults(data);
      toast({
        title: "Import Completed",
        description: `Created ${data.created} items, skipped ${data.skipped}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.response?.data?.message || "An error occurred during import.",
        variant: "destructive",
      });
    },
  });

  const handleExport = async (type: 'policies' | 'controls' | 'influencers') => {
    try {
      const data = await governanceApi.exportGovernanceData(type);
      const csv = convertToCSV(data);
      downloadCSV(csv, `governance_${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
      toast({ title: "Export Successful", description: `${type} exported to CSV.` });
    } catch (error) {
      toast({ title: "Export Failed", description: "Could not export data.", variant: "destructive" });
    }
  };

  const entities = [
    { id: 'policies', name: 'Policies', icon: <FileText className="h-5 w-5 text-purple-500" />, canImport: true },
    { id: 'controls', name: 'Unified Controls', icon: <Shield className="h-5 w-5 text-green-500" />, canImport: true },
    { id: 'influencers', name: 'Influencers', icon: <Briefcase className="h-5 w-5 text-blue-500" />, canImport: false },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="h-8 w-8 text-primary" />
          Data Management Center
        </h1>
        <p className="text-muted-foreground">
          Bulk import and export governance entities to maintain your registry at scale
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {entities.map((entity) => (
          <Card key={entity.id}>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {entity.icon}
                <CardTitle>{entity.name}</CardTitle>
              </div>
              <CardDescription>Bulk operations for {entity.name.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2" 
                onClick={() => handleExport(entity.id as any)}
              >
                <FileDown className="h-4 w-4" />
                Export to CSV
              </Button>
              
              {entity.canImport && (
                <Button 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setImportingType(entity.id as any);
                    setResults(null);
                    setFile(null);
                  }}
                >
                  <FileUp className="h-4 w-4" />
                  Bulk Import
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {importingType && (
        <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Importing {importingType.charAt(0).toUpperCase() + importingType.slice(1)}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setImportingType(null)}>Cancel</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!results ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select CSV or JSON File</label>
                    <Input 
                      type="file" 
                      accept=".csv,.json" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      disabled={importMutation.isPending}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      className="w-full" 
                      disabled={!file || importMutation.isPending}
                      onClick={() => file && importMutation.mutate({ type: importingType, file })}
                    >
                      {importMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : "Start Import"}
                    </Button>
                  </div>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Template Format</AlertTitle>
                  <AlertDescription className="text-xs">
                    For <strong>Policies</strong>: title, description, category, status, content.<br/>
                    For <strong>Controls</strong>: title, control_identifier, domain, status, implementation_status.
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
                    <p className="text-xs text-green-600 font-bold uppercase">Created</p>
                    <p className="text-3xl font-black text-green-700">{results.created}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 text-center">
                    <p className="text-xs text-orange-600 font-bold uppercase">Skipped</p>
                    <p className="text-3xl font-black text-orange-700">{results.skipped}</p>
                  </div>
                </div>
                
                {results.errors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Import Log:</p>
                    <ScrollArea className="h-[200px] border rounded-md p-3 bg-background">
                      <ul className="space-y-1">
                        {results.errors.map((err, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex gap-2">
                            <span className="shrink-0 text-orange-500">!</span>
                            {err}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                )}
                
                <Button variant="outline" className="w-full" onClick={() => setResults(null)}>
                  Import Another File
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Recent Import History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground italic border-2 border-dashed rounded-lg">
            No recent import activity found.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


