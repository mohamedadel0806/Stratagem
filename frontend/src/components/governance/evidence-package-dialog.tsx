"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { governanceApi } from "@/lib/api/governance";
import { 
  Archive, 
  Loader2, 
  Shield, 
  ClipboardCheck, 
  Calendar,
  Download,
  AlertCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EvidencePackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EvidencePackageDialog({
  open,
  onOpenChange,
}: EvidencePackageDialogProps) {
  const { toast } = useToast();
  const [packageType, setPackageType] = useState<"all" | "control" | "assessment">("all");
  const [selectedId, setSelectedId] = useState<string>("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const { data: controlsData } = useQuery({
    queryKey: ["unified-controls-for-package"],
    queryFn: () => governanceApi.getUnifiedControls({ limit: 100 }),
    enabled: packageType === "control",
  });

  const { data: assessmentsData } = useQuery({
    queryKey: ["assessments-for-package"],
    queryFn: () => governanceApi.getAssessments({ limit: 100 }),
    enabled: packageType === "assessment",
  });

  const generateMutation = useMutation({
    mutationFn: () => governanceApi.generateEvidencePackage({
      controlId: packageType === "control" ? selectedId : undefined,
      assessmentId: packageType === "assessment" ? selectedId : undefined,
      startDate: dateRange.start || undefined,
      endDate: dateRange.end || undefined,
    }),
    onSuccess: () => {
      toast({
        title: "Package Generated",
        description: "Your evidence package has been generated and downloaded.",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.response?.data?.message || "Could not bundle evidence items.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if ((packageType === "control" || packageType === "assessment") && !selectedId) {
      toast({
        title: "Selection Required",
        description: `Please select a ${packageType} to continue.`,
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-primary" />
            Generate Evidence Package
          </DialogTitle>
          <DialogDescription>
            Bundle evidence files and metadata into a single ZIP file for auditing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Package Scope</Label>
            <Select 
              value={packageType} 
              onValueChange={(val: any) => {
                setPackageType(val);
                setSelectedId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Approved Evidence</SelectItem>
                <SelectItem value="control">Linked to Specific Control</SelectItem>
                <SelectItem value="assessment">Linked to Specific Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {packageType === "control" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              <Label>Unified Control</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select control..." />
                </SelectTrigger>
                <SelectContent>
                  {controlsData?.data.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.control_identifier}: {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {packageType === "assessment" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              <Label>Control Assessment</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment..." />
                </SelectTrigger>
                <SelectContent>
                  {assessmentsData?.data.map(a => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.assessment_identifier}: {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input 
                type="date" 
                value={dateRange.start} 
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input 
                type="date" 
                value={dateRange.end} 
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>

          <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-xs text-blue-700 dark:text-blue-300">
              The package will include all relevant files and a <strong>manifest.json</strong> containing metadata and collection timestamps.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={generateMutation.isPending}
            className="gap-2"
          >
            {generateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {generateMutation.isPending ? "Bundling..." : "Generate & Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


