"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  governanceApi,
  ControlObjective,
  UnifiedControl,
} from "@/lib/api/governance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  ExternalLink,
  Shield,
  Loader2,
  Search,
  CheckCircle,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ControlObjectiveMappingProps {
  objectiveId: string;
}

export function ControlObjectiveMapping({ objectiveId }: ControlObjectiveMappingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const [isBrowserOpen, setIsCreateOpen] = useState(false);

  const { data: linkedControls = [], isLoading } = useQuery({
    queryKey: ["control-objective-unified-controls", objectiveId],
    queryFn: () => governanceApi.getUnifiedControlsByObjective(objectiveId),
  });

  const unlinkMutation = useMutation({
    mutationFn: (controlId: string) =>
      governanceApi.unlinkUnifiedControlsFromObjective(objectiveId, [controlId]),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["control-objective-unified-controls", objectiveId],
      });
      toast({
        title: "Success",
        description: "Unified control unlinked successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to unlink control",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Mapped Unified Controls
          </CardTitle>
          <CardDescription>
            Link this objective to specific controls in the unified library
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Map Controls
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : linkedControls.length > 0 ? (
          <div className="space-y-3">
            {linkedControls.map((control) => (
              <div
                key={control.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {control.title}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {control.control_identifier}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      Type: {control.control_type || "N/A"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Status: {control.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/${locale}/dashboard/governance/controls/${control.id}`}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm("Are you sure you want to unlink this control?")) {
                        unlinkMutation.mutate(control.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
            <p className="text-sm text-muted-foreground">
              No unified controls mapped to this objective yet.
            </p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => setIsCreateOpen(true)}
            >
              Start mapping controls
            </Button>
          </div>
        )}
      </CardContent>

      <ControlObjectiveBrowserDialog
        open={isBrowserOpen}
        onOpenChange={setIsCreateOpen}
        objectiveId={objectiveId}
        existingControlIds={new Set(linkedControls.map((c) => c.id))}
      />
    </Card>
  );
}

interface ControlObjectiveBrowserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objectiveId: string;
  existingControlIds: Set<string>;
}

function ControlObjectiveBrowserDialog({
  open,
  onOpenChange,
  objectiveId,
  existingControlIds,
}: ControlObjectiveBrowserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedControls, setSelectedControls] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const { data: controlsData, isLoading } = useQuery({
    queryKey: ["unified-controls-browser"],
    queryFn: () => governanceApi.getUnifiedControls({ limit: 100 }),
    enabled: open,
  });

  const controls = controlsData?.data || [];

  const filteredControls = controls.filter((control) => {
    const matchesSearch =
      !searchQuery ||
      control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.control_identifier?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const linkMutation = useMutation({
    mutationFn: () =>
      governanceApi.linkUnifiedControlsToObjective(
        objectiveId,
        Array.from(selectedControls)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["control-objective-unified-controls", objectiveId],
      });
      setSelectedControls(new Set());
      setSearchQuery("");
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Controls mapped successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to map controls",
        variant: "destructive",
      });
    },
  });

  const handleToggle = (id: string) => {
    const newSelected = new Set(selectedControls);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedControls(newSelected);
  };

  const availableControls = filteredControls.filter(
    (c) => !existingControlIds.has(c.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Map Unified Controls</DialogTitle>
          <DialogDescription>
            Select one or more controls from the unified library to satisfy this objective.
          </DialogDescription>
        </DialogHeader>

        <div className="relative my-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search controls..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto border rounded-md mt-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : availableControls.length > 0 ? (
            <div className="divide-y">
              {availableControls.map((control) => (
                <div
                  key={control.id}
                  className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleToggle(control.id)}
                >
                  <Checkbox
                    checked={selectedControls.has(control.id)}
                    onCheckedChange={() => handleToggle(control.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {control.title}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {control.control_identifier}
                      </Badge>
                    </div>
                    {control.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {control.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No available controls found.
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={selectedControls.size === 0 || linkMutation.isPending}
            onClick={() => linkMutation.mutate()}
          >
            {linkMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Mapping...
              </>
            ) : (
              `Map ${selectedControls.size} Control${
                selectedControls.size !== 1 ? "s" : ""
              }`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


