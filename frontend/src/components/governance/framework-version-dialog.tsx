"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { governanceApi, FrameworkVersion } from "@/lib/api/governance";
import { complianceApi, Framework } from "@/lib/api/compliance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2 } from "lucide-react";
import { FrameworkVersionsList } from "./framework-versions-list";
import { CreateFrameworkVersionForm } from "./create-framework-version-form";
import { useToast } from "@/hooks/use-toast";

interface FrameworkVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  framework: Framework;
}

export function FrameworkVersionDialog({
  open,
  onOpenChange,
  framework,
}: FrameworkVersionDialogProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: versions = [], isLoading } = useQuery({
    queryKey: ["framework-versions", framework.id],
    queryFn: () => governanceApi.getFrameworkVersions(framework.id),
    enabled: open,
  });

  const setCurrentVersionMutation = useMutation({
    mutationFn: (version: string) =>
      governanceApi.setCurrentFrameworkVersion(framework.id, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["framework-versions", framework.id] });
      queryClient.invalidateQueries({ queryKey: ["compliance-frameworks"] });
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Framework Versions: {framework.name}</DialogTitle>
                <DialogDescription>
                  Manage versions and version history for this framework
                </DialogDescription>
              </div>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Version
              </Button>
            </div>
          </DialogHeader>

          {isLoading ? (
            <div className="text-center py-8">Loading versions...</div>
          ) : (
            <FrameworkVersionsList
              versions={versions}
              currentVersion={framework.version}
              onSetCurrent={(version) => setCurrentVersionMutation.mutate(version)}
            />
          )}
        </DialogContent>
      </Dialog>

      <CreateFrameworkVersionForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        framework={framework}
      />
    </>
  );
}


