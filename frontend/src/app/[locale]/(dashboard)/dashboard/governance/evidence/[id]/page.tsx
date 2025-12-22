"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  governanceApi,
  Evidence,
  EvidenceType,
  EvidenceStatus,
} from "@/lib/api/governance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User, 
  Shield, 
  Tag, 
  Download, 
  Eye, 
  Trash2, 
  Edit,
  ExternalLink,
  Lock,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EvidenceForm } from "@/components/governance/evidence-form";

const typeLabels: Record<EvidenceType, string> = {
  [EvidenceType.POLICY_DOCUMENT]: "Policy Document",
  [EvidenceType.CONFIGURATION_SCREENSHOT]: "Configuration Screenshot",
  [EvidenceType.SYSTEM_LOG]: "System Log",
  [EvidenceType.SCAN_REPORT]: "Scan Report",
  [EvidenceType.TEST_RESULT]: "Test Result",
  [EvidenceType.CERTIFICATION]: "Certification",
  [EvidenceType.TRAINING_RECORD]: "Training Record",
  [EvidenceType.MEETING_MINUTES]: "Meeting Minutes",
  [EvidenceType.EMAIL_CORRESPONDENCE]: "Email Correspondence",
  [EvidenceType.CONTRACT]: "Contract",
  [EvidenceType.OTHER]: "Other",
};

const statusLabels: Record<EvidenceStatus, string> = {
  [EvidenceStatus.DRAFT]: "Draft",
  [EvidenceStatus.UNDER_REVIEW]: "Under Review",
  [EvidenceStatus.APPROVED]: "Approved",
  [EvidenceStatus.EXPIRED]: "Expired",
  [EvidenceStatus.REJECTED]: "Rejected",
};

export default function EvidenceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const evidenceId = params.id as string;

  const { data: response, isLoading } = useQuery({
    queryKey: ["evidence", evidenceId],
    queryFn: () => governanceApi.getEvidenceItem(evidenceId),
    enabled: !!evidenceId,
  });

  const evidence = response?.data;

  const deleteMutation = useMutation({
    mutationFn: () => governanceApi.deleteEvidence(evidenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      toast({ title: "Success", description: "Evidence deleted successfully" });
      router.push(`/${locale}/dashboard/governance/evidence`);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: EvidenceStatus) => 
      governanceApi.updateEvidence(evidenceId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence", evidenceId] });
      toast({ title: "Status Updated", description: "Evidence status has been changed." });
    },
  });

  if (isLoading) return <div className="p-6">Loading evidence details...</div>;
  if (!evidence) return <div className="p-6">Evidence not found</div>;

  const handleDownload = async () => {
    if (!evidence.filename) return;
    try {
      const blob = await governanceApi.downloadEvidenceFile(evidence.filename);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", evidence.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({ title: "Download Failed", description: "Could not retrieve file.", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{evidence.title}</h1>
              <Badge variant="outline" className="font-mono">{evidence.evidence_identifier}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">{typeLabels[evidence.evidence_type]}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {evidence.status !== EvidenceStatus.APPROVED && (
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => updateStatusMutation.mutate(EvidenceStatus.APPROVED)}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => {
            if (confirm("Delete this evidence?")) deleteMutation.mutate();
          }}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>File Information</CardTitle>
              <CardDescription>Physical storage details and verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-background rounded-md border shadow-sm">
                    <FileText className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{evidence.filename || "No file uploaded"}</p>
                    <p className="text-sm text-muted-foreground">
                      {evidence.file_size ? `${(Number(evidence.file_size) / 1024).toFixed(1)} KB` : "N/A"} • {evidence.mime_type || "Unknown Type"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownload} disabled={!evidence.filename}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" asChild disabled={!evidence.filename}>
                    <a href={evidence.file_path} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </a>
                  </Button>
                </div>
              </div>

              {evidence.file_hash && (
                <div className="p-3 bg-muted/30 rounded-md border border-dashed flex items-start gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">SHA-256 File Hash</p>
                    <p className="text-xs font-mono break-all">{evidence.file_hash}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{evidence.description || "No description provided."}</p>
            </CardContent>
          </Card>

          {/* Linkages would go here */}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lifecycle & Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase">Current Status</p>
                <Badge className={
                  evidence.status === EvidenceStatus.APPROVED ? "bg-green-500" :
                  evidence.status === EvidenceStatus.REJECTED ? "bg-red-500" :
                  "bg-blue-500"
                }>
                  {statusLabels[evidence.status]}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase">Collection Date</p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(evidence.collection_date), "PPPP")}
                </div>
              </div>

              {evidence.valid_until_date && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Expiration Date</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(evidence.valid_until_date), "PPPP")}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase">Collector</p>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {evidence.collector?.first_name} {evidence.collector?.last_name}
                </div>
              </div>

              {evidence.confidential && (
                <div className="flex items-center gap-2 p-2 bg-red-50 text-red-700 rounded-md border border-red-100">
                  <Lock className="h-4 w-4" />
                  <span className="text-xs font-bold">Restricted / Confidential</span>
                </div>
              )}
            </CardContent>
          </Card>

          {evidence.tags && evidence.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {evidence.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Evidence</DialogTitle>
          </DialogHeader>
          <EvidenceForm
            evidence={evidence}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ["evidence", evidenceId] });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


