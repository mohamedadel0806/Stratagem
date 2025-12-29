"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Plus,
    RefreshCw,
    Trash2,
    ExternalLink,
    Activity,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Settings,
    Shield,
    Clock,
    ChevronRight,
    Database,
    Globe,
} from "lucide-react";
import { assetsApi, IntegrationConfig } from "@/lib/api/assets";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
import { IntegrationForm } from "./integration-form";
import { format } from "date-fns";

export function IntegrationSettings() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState<IntegrationConfig | null>(null);

    const { data: integrations = [], isLoading } = useQuery({
        queryKey: ["integrations"],
        queryFn: () => assetsApi.getIntegrations(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => assetsApi.deleteIntegration(id),
        onSuccess: () => {
            toast({ title: "Deleted", description: "Integration removed successfully" });
            queryClient.invalidateQueries({ queryKey: ["integrations"] });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete integration",
                variant: "destructive",
            });
        },
    });

    const syncMutation = useMutation({
        mutationFn: (id: string) => assetsApi.syncIntegration(id),
        onSuccess: () => {
            toast({ title: "Sync Started", description: "Background synchronization triggered" });
            queryClient.invalidateQueries({ queryKey: ["integrations"] });
        },
        onError: (error: any) => {
            toast({
                title: "Sync Failed",
                description: error.response?.data?.message || "Failed to start sync",
                variant: "destructive",
            });
        },
    });

    const testMutation = useMutation({
        mutationFn: (id: string) => assetsApi.testIntegrationConnection(id),
        onSuccess: (data) => {
            if (data.success) {
                toast({ title: "Connected", description: "Successfully verified connection" });
            } else {
                toast({
                    title: "Connection Failed",
                    description: data.message,
                    variant: "destructive",
                });
            }
        },
    });

    const getStatusBadge = (status: IntegrationConfig["status"]) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-green-500 hover:bg-green-600 transition-colors">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Active
                    </Badge>
                );
            case "inactive":
                return (
                    <Badge variant="outline" className="text-muted-foreground">
                        Inactive
                    </Badge>
                );
            case "error":
                return (
                    <Badge variant="destructive">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Error
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">External System Integrations</h2>
                    <p className="text-sm text-muted-foreground">
                        Synchronize asset data from CMDBs, Cloud providers, and inventory systems.
                    </p>
                </div>
                <Button onClick={() => { setSelectedIntegration(null); setIsFormOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Integration
                </Button>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : integrations.length === 0 ? (
                    <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <RefreshCw className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>No Integrations Found</CardTitle>
                        <CardDescription className="max-w-[300px] mt-2">
                            Connect your first external system to start automating your asset inventory.
                        </CardDescription>
                        <Button variant="outline" className="mt-6" onClick={() => setIsFormOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Configure Now
                        </Button>
                    </Card>
                ) : (
                    integrations.map((integration) => (
                        <Card key={integration.id} className="overflow-hidden group hover:border-primary/50 transition-all duration-200">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="h-12 w-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                                        {integration.integrationType === "cmdb" ? <Database className="h-6 w-6 text-primary" /> :
                                            integration.integrationType === "webhook" ? <Shield className="h-6 w-6 text-primary" /> :
                                                <ExternalLink className="h-6 w-6 text-primary" />}
                                    </div>

                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold truncate">{integration.name}</h3>
                                            {getStatusBadge(integration.status)}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Globe className="h-3 w-3" />
                                                {new URL(integration.endpointUrl).hostname}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Every {integration.syncInterval || "24h"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="hidden lg:flex items-center gap-8 ml-auto px-6 border-l border-dashed">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Last Sync</p>
                                            <p className="text-xs font-medium">
                                                {integration.lastSyncAt ? format(new Date(integration.lastSyncAt), "MMM d, HH:mm") : "Never"}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Next Sync</p>
                                            <p className="text-xs font-medium text-primary">
                                                {integration.nextSyncAt ? format(new Date(integration.nextSyncAt), "MMM d, HH:mm") : "Manual Only"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-muted/30 md:bg-transparent p-4 md:p-6 border-t md:border-t-0 md:border-l flex items-center justify-end gap-2 shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => testMutation.mutate(integration.id)}
                                        title="Test Connection"
                                        disabled={testMutation.isPending}
                                    >
                                        <Activity className={`h-4 w-4 ${testMutation.isPending && testMutation.variables === integration.id ? "animate-pulse" : ""}`} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => syncMutation.mutate(integration.id)}
                                        title="Manual Sync"
                                        disabled={syncMutation.isPending}
                                    >
                                        <RefreshCw className={`h-4 w-4 ${syncMutation.isPending && syncMutation.variables === integration.id ? "animate-spin" : ""}`} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => { setSelectedIntegration(integration); setIsFormOpen(true); }}
                                        title="Edit Settings"
                                    >
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                            if (confirm("Are you sure you want to remove this integration?")) {
                                                deleteMutation.mutate(integration.id);
                                            }
                                        }}
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {integration.lastSyncError && (
                                <div className="px-6 py-2 bg-destructive/5 text-destructive text-[10px] flex items-center gap-2 border-t border-destructive/10">
                                    <AlertCircle className="h-3 w-3" />
                                    Last error: {integration.lastSyncError}
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedIntegration ? "Edit Integration" : "New External Integration"}</DialogTitle>
                        <DialogDescription>
                            Configure how the platform connects to your external systems.
                        </DialogDescription>
                    </DialogHeader>
                    <IntegrationForm
                        initialData={selectedIntegration}
                        onSuccess={() => setIsFormOpen(false)}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
