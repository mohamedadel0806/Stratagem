"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Clock,
  Settings,
  Webhook,
  Activity,
  Shield,
  Filter,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Copy,
  Terminal,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  governanceApi,
  IntegrationHook,
  HookType,
  HookAction,
} from "@/lib/api/governance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { IntegrationHookForm } from "@/components/governance/integration-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function IntegrationsAdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedHook, setSelectedHook] = useState<IntegrationHook | null>(null);
  const [isLogsOpen, setIsLogsOpen] = useState(false);

  const { data: hooks = [], isLoading } = useQuery({
    queryKey: ["integration-hooks"],
    queryFn: () => governanceApi.getIntegrationHooks(),
  });

  const { data: logs = [], isFetching: isLogsLoading } = useQuery({
    queryKey: ["integration-logs", selectedHook?.id],
    queryFn: () => governanceApi.getIntegrationLogs(selectedHook!.id),
    enabled: !!selectedHook && isLogsOpen,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Webhook URL copied to clipboard" });
  };

  const getHookActionBadge = (action: HookAction) => {
    switch (action) {
      case HookAction.CREATE_EVIDENCE: return <Badge className="bg-blue-500">Create Evidence</Badge>;
      case HookAction.CREATE_FINDING: return <Badge className="bg-orange-500">Create Finding</Badge>;
      case HookAction.UPDATE_CONTROL_STATUS: return <Badge className="bg-green-500">Update Control</Badge>;
      default: return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Webhook className="h-8 w-8 text-primary" />
            External Integrations
          </h1>
          <p className="text-muted-foreground">
            Securely connect external security tools and SIEMs to automate governance workflows
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Webhook
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Active Webhooks</CardTitle>
            <CardDescription>Configured secure entry points for incoming compliance data</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name & Source</TableHead>
                  <TableHead>Triggered Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : hooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      No webhooks configured yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  hooks.map((hook) => (
                    <TableRow key={hook.id} className="group hover:bg-muted/30">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{hook.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">{hook.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getHookActionBadge(hook.action)}</TableCell>
                      <TableCell>
                        <Badge variant={hook.isActive ? "default" : "outline"} className={hook.isActive ? "bg-green-500" : ""}>
                          {hook.isActive ? "Active" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard(`${window.location.origin}/api/v1/governance/integrations/webhook/${hook.secretKey}`)}
                            title="Copy Webhook URL"
                          >
                            <Copy className="h-4 w-4 text-primary" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => { setSelectedHook(hook); setIsLogsOpen(true); }}
                            title="View Logs"
                          >
                            <Terminal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Quick Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-bold text-primary">ENDPOINT URL</p>
              <code className="text-[10px] block p-2 bg-background border rounded font-mono break-all text-muted-foreground">
                POST /api/v1/governance/integrations/webhook/[SECRET]
              </code>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-primary">EXAMPLE PAYLOAD</p>
              <pre className="text-[9px] block p-2 bg-black text-green-400 border rounded font-mono overflow-x-auto">
{`{
  "title": "Unauthenticated Login",
  "description": "Detected from 10.0.0.5",
  "severity": "high"
}`}
              </pre>
            </div>
            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
              * The system will automatically map incoming JSON keys to the internal data model based on your configured mapping rules.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Logs Dialog */}
      <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Delivery Logs: {selectedHook?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden mt-4">
            {isLogsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Outcome</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} className="text-xs">
                        <TableCell className="font-mono text-muted-foreground">
                          {format(new Date(log.created_at), "MMM d, HH:mm:ss")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.status === "success" ? "default" : "destructive"} className="h-5 text-[9px]">
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{log.ipAddress}</TableCell>
                        <TableCell className="max-w-xs truncate font-mono text-muted-foreground">
                          {log.status === "success" ? "Entity Created" : log.errorMessage}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure New Integration Webhook</DialogTitle>
            <DialogDescription>
              Create a secure endpoint to receive compliance data from third-party tools.
            </DialogDescription>
          </DialogHeader>
          <IntegrationHookForm
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


