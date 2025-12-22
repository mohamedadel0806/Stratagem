"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar as CalendarIcon,
  User as UserIcon,
  Tag as TagIcon,
  Info,
  Clock,
} from "lucide-react";
import {
  governanceApi,
  AuditLog,
  AuditActionType,
  AuditLogQueryParams,
} from "@/lib/api/governance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface AuditLogListProps {
  entityType?: string;
  entityId?: string;
  title?: string;
}

export function AuditLogList({ entityType, entityId, title = "Audit Logs" }: AuditLogListProps) {
  const [params, setParams] = useState<AuditLogQueryParams>({
    skip: 0,
    take: 50,
    entityType,
    entityId,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const { toast } = useToast();

  const { data: auditResponse, isLoading } = useQuery({
    queryKey: ["governance-audit-logs", params, searchQuery],
    queryFn: async () => {
      if (searchQuery.length >= 2) {
        const results = await governanceApi.searchAuditLogs(searchQuery, params.take);
        return { data: results, total: results.length, skip: 0, take: params.take };
      }
      return governanceApi.getAuditLogs(params);
    },
  });

  const logs = auditResponse?.data || [];
  const total = auditResponse?.total || 0;

  const handleExport = async () => {
    try {
      await governanceApi.exportAuditLogs(params.entityType, params.entityId);
      toast({
        title: "Export Successful",
        description: "Audit logs have been exported to CSV",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export audit logs",
        variant: "destructive",
      });
    }
  };

  const getActionBadge = (action: AuditActionType) => {
    switch (action) {
      case AuditActionType.CREATE:
        return <Badge className="bg-green-500">Create</Badge>;
      case AuditActionType.UPDATE:
        return <Badge className="bg-blue-500">Update</Badge>;
      case AuditActionType.DELETE:
        return <Badge variant="destructive">Delete</Badge>;
      case AuditActionType.APPROVE:
      case AuditActionType.PUBLISH:
        return <Badge className="bg-purple-500">{action}</Badge>;
      case AuditActionType.ASSIGN:
        return <Badge className="bg-orange-500">Assign</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search actions or entities..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {!entityType && (
            <Select
              value={params.entityType || "all"}
              onValueChange={(value) =>
                setParams((prev) => ({
                  ...prev,
                  entityType: value === "all" ? undefined : value,
                  skip: 0,
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="Policy">Policy</SelectItem>
                <SelectItem value="Influencer">Influencer</SelectItem>
                <SelectItem value="UnifiedControl">Unified Control</SelectItem>
                <SelectItem value="ControlDomain">Control Domain</SelectItem>
                <SelectItem value="FrameworkVersion">Framework Version</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select
            value={params.action || "all"}
            onValueChange={(value) =>
              setParams((prev) => ({
                ...prev,
                action: value === "all" ? undefined : (value as AuditActionType),
                skip: 0,
              }))
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value={AuditActionType.CREATE}>Create</SelectItem>
              <SelectItem value={AuditActionType.UPDATE}>Update</SelectItem>
              <SelectItem value={AuditActionType.DELETE}>Delete</SelectItem>
              <SelectItem value={AuditActionType.APPROVE}>Approve</SelectItem>
              <SelectItem value={AuditActionType.PUBLISH}>Publish</SelectItem>
              <SelectItem value={AuditActionType.ASSIGN}>Assign</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handleExport} title="Export to CSV">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[80px] text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span>Loading audit logs...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No audit logs found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                          {log.user ? `${log.user.first_name[0]}${log.user.last_name[0]}` : "SYS"}
                        </div>
                        <span className="text-sm">
                          {log.user ? `${log.user.first_name} ${log.user.last_name}` : "System"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">
                          {log.entityType}
                        </span>
                        <span className="text-xs font-mono truncate w-32" title={log.entityId}>
                          {log.entityId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm" title={log.description}>
                      {log.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {total > (params.take || 50) && (
        <div className="flex justify-between items-center py-4">
          <span className="text-sm text-muted-foreground">
            Showing {params.skip! + 1} to {Math.min(params.skip! + params.take!, total)} of {total} entries
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={params.skip === 0}
              onClick={() => setParams((prev) => ({ ...prev, skip: Math.max(0, prev.skip! - prev.take!) }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={params.skip! + params.take! >= total}
              onClick={() => setParams((prev) => ({ ...prev, skip: prev.skip! + prev.take! }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Log Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Audit Log Details
            </DialogTitle>
            <DialogDescription>
              Detailed information for audit record {selectedLog?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <ScrollArea className="mt-4 pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Timestamp</label>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(selectedLog.timestamp), "PPPPpppp")}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Action</label>
                    <div>{getActionBadge(selectedLog.action)}</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">User</label>
                    <div className="flex items-center gap-2 text-sm">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      {selectedLog.user ? `${selectedLog.user.first_name} ${selectedLog.user.last_name} (${selectedLog.user.email})` : "System Process"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">IP Address</label>
                    <div className="text-sm font-mono">{selectedLog.ipAddress || "Internal"}</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Entity Type</label>
                    <div className="flex items-center gap-2 text-sm">
                      <TagIcon className="h-4 w-4 text-muted-foreground" />
                      {selectedLog.entityType}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Entity ID</label>
                    <div className="text-sm font-mono text-xs">{selectedLog.entityId}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Description</label>
                  <p className="text-sm border rounded-md p-3 bg-muted/30">
                    {selectedLog.description}
                  </p>
                </div>

                {selectedLog.changes && Object.keys(selectedLog.changes).length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Changes</label>
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="h-8 text-xs">Field</TableHead>
                            <TableHead className="h-8 text-xs">Old Value</TableHead>
                            <TableHead className="h-8 text-xs">New Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(selectedLog.changes).map(([field, change]) => (
                            <TableRow key={field}>
                              <TableCell className="py-2 text-xs font-semibold">{field}</TableCell>
                              <TableCell className="py-2 text-xs text-red-600 bg-red-50/30">
                                <pre className="whitespace-pre-wrap max-w-[200px]">
                                  {JSON.stringify(change.old, null, 2)}
                                </pre>
                              </TableCell>
                              <TableCell className="py-2 text-xs text-green-600 bg-green-50/30">
                                <pre className="whitespace-pre-wrap max-w-[200px]">
                                  {JSON.stringify(change.new, null, 2)}
                                </pre>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Metadata</label>
                    <div className="bg-muted p-3 rounded-md">
                      <pre className="text-xs font-mono">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">User Agent</label>
                  <p className="text-[10px] text-muted-foreground italic break-all">
                    {selectedLog.userAgent || "N/A"}
                  </p>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


