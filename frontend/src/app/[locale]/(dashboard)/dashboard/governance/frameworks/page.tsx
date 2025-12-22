"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { complianceApi, Framework } from "@/lib/api/compliance";
import { governanceApi, FrameworkVersion } from "@/lib/api/governance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, History, FileText, Edit, Trash2, CheckCircle2, X } from "lucide-react";
import { FrameworkForm } from "@/components/forms/framework-form";
import { FrameworkVersionDialog } from "@/components/governance/framework-version-dialog";
import { FrameworkImportDialog } from "@/components/governance/framework-import-dialog";
import { FrameworkVersionsList } from "@/components/governance/framework-versions-list";
import { FrameworkStructureViewer } from "@/components/governance/framework-structure-viewer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function GovernanceFrameworksPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [editingFramework, setEditingFramework] = useState<Framework | null>(null);
  const [deletingFrameworkId, setDeletingFrameworkId] = useState<string | null>(null);
  const [viewingStructureFrameworkId, setViewingStructureFrameworkId] = useState<string | null>(null);

  const { data: frameworks = [], isLoading } = useQuery({
    queryKey: ["compliance-frameworks"],
    queryFn: () => complianceApi.getFrameworks(),
  });

  const { data: frameworkStructure } = useQuery({
    queryKey: ["framework-structure", viewingStructureFrameworkId],
    queryFn: () => governanceApi.getFrameworkWithStructure(viewingStructureFrameworkId!),
    enabled: !!viewingStructureFrameworkId,
  });

  const deleteFrameworkMutation = useMutation({
    mutationFn: (id: string) => complianceApi.deleteFramework(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance-frameworks"] });
      toast({
        title: "Success",
        description: "Framework deleted successfully",
      });
      setDeletingFrameworkId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete framework",
        variant: "destructive",
      });
    },
  });

  const setCurrentVersionMutation = useMutation({
    mutationFn: ({ frameworkId, version }: { frameworkId: string; version: string }) =>
      governanceApi.setCurrentFrameworkVersion(frameworkId, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance-frameworks"] });
      queryClient.invalidateQueries({ queryKey: ["framework-versions"] });
      toast({
        title: "Success",
        description: "Version set as current",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to set current version",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading frameworks...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Governance Frameworks</h1>
          <p className="text-muted-foreground">
            Manage compliance frameworks, versions, and structure
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Framework
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {frameworks.map((framework) => (
          <Card key={framework.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{framework.name}</CardTitle>
                  {framework.code && (
                    <CardDescription className="mt-1">{framework.code}</CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {framework.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {framework.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFramework(framework);
                      setIsVersionDialogOpen(true);
                    }}
                  >
                    <History className="mr-2 h-4 w-4" />
                    Versions
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFramework(framework);
                      setIsImportDialogOpen(true);
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingStructureFrameworkId(framework.id)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Structure
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingFramework(framework)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingFrameworkId(framework.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {frameworks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Frameworks</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first compliance framework
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Framework
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Framework Dialog */}
      <FrameworkForm
        open={isCreateOpen || !!editingFramework}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingFramework(null);
          }
        }}
        frameworkId={editingFramework?.id}
        initialData={editingFramework}
      />

      {/* Version Dialog */}
      {selectedFramework && (
        <FrameworkVersionDialog
          open={isVersionDialogOpen}
          onOpenChange={setIsVersionDialogOpen}
          framework={selectedFramework}
        />
      )}

      {/* Import Dialog */}
      {selectedFramework && (
        <FrameworkImportDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          framework={selectedFramework}
        />
      )}

      {/* Structure Viewer Dialog */}
      <Dialog open={!!viewingStructureFrameworkId} onOpenChange={(open) => !open && setViewingStructureFrameworkId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Framework Structure</DialogTitle>
            <DialogDescription>
              View the hierarchical structure of this framework
            </DialogDescription>
          </DialogHeader>
          {frameworkStructure && (
            <FrameworkStructureViewer structure={frameworkStructure} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingFrameworkId} onOpenChange={(open) => !open && setDeletingFrameworkId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Framework</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this framework? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingFrameworkId && deleteFrameworkMutation.mutate(deletingFrameworkId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


