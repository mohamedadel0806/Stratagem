"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlayCircle,
  Calendar,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity,
} from "lucide-react";
import {
  governanceApi,
  SOPLog,
  ExecutionOutcome,
  SOPLogQueryParams,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SOPExecutionForm } from "@/components/governance/sop-execution-form";
import { Pagination } from "@/components/ui/pagination";

export default function SOPExecutionsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<SOPLog | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<SOPLogQueryParams>({
    page: 1,
    limit: 20,
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["sop-logs", filters],
    queryFn: () => governanceApi.getSOPLogs(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteSOPLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sop-logs"] });
      toast({ title: "Success", description: "Execution record deleted successfully" });
    },
  });

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getOutcomeBadge = (outcome: ExecutionOutcome) => {
    switch (outcome) {
      case ExecutionOutcome.SUCCESSFUL:
        return <Badge className="bg-green-500">Successful</Badge>;
      case ExecutionOutcome.FAILED:
        return <Badge variant="destructive">Failed</Badge>;
      case ExecutionOutcome.PARTIALLY_COMPLETED:
        return <Badge className="bg-yellow-500 text-black">Partial</Badge>;
      default:
        return <Badge variant="outline">{outcome}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            SOP Execution Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor and record standardized procedure executions across the organization
          </p>
        </div>
        <Button onClick={() => { setEditingLog(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Record Execution
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by SOP title or notes..."
            className="pl-9"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <Select 
          value={filters.outcome || "all"} 
          onValueChange={(val) => setFilters({ ...filters, outcome: val === "all" ? undefined : (val as ExecutionOutcome), page: 1 })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Outcome" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Outcomes</SelectItem>
            {Object.values(ExecutionOutcome).map(o => (
              <SelectItem key={o} value={o} className="capitalize">{o.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Procedure (SOP)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Executor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Clock className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Loading execution logs...</p>
                  </TableCell>
                </TableRow>
              ) : response?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No SOP executions recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                response?.data.map((log) => (
                  <>
                    <TableRow key={log.id} className="group hover:bg-muted/30">
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleRow(log.id)}>
                          {expandedRows.has(log.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{log.sop?.title}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{log.sop?.sop_identifier}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {format(new Date(log.execution_date), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {log.start_time && log.end_time ? (
                          <span>
                            {Math.round((new Date(log.end_time).getTime() - new Date(log.start_time).getTime()) / 60000)} mins
                          </span>
                        ) : "-"}
                      </TableCell>
                      <TableCell>{getOutcomeBadge(log.outcome)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs">
                          <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{log.executor?.first_name} {log.executor?.last_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setEditingLog(log); setIsFormOpen(true); }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Record
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this record?")) {
                                  deleteMutation.mutate(log.id);
                                }
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(log.id) && (
                      <TableRow className="bg-muted/10 border-b">
                        <TableCell colSpan={7} className="p-0">
                          <div className="p-6 pl-14 space-y-4 animate-in fade-in slide-in-from-top-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Execution Notes</h4>
                                <p className="text-sm bg-background p-3 rounded-md border italic">
                                  {log.notes || "No notes provided for this execution."}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Step Breakdown</h4>
                                <div className="space-y-2">
                                  {log.step_results?.map((step, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-background border rounded-md text-xs">
                                      <div className="flex flex-col">
                                        <span className="font-semibold">{step.step}</span>
                                        {step.observations && <span className="text-[10px] text-muted-foreground">{step.observations}</span>}
                                      </div>
                                      <Badge variant={step.result.toLowerCase() === "success" || step.result.toLowerCase() === "completed" ? "default" : "outline"} className="h-5 text-[9px]">
                                        {step.result}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {response?.meta && (
        <Pagination
          currentPage={response.meta.page}
          totalPages={response.meta.totalPages}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLog ? "Edit Execution Record" : "Record SOP Execution"}
            </DialogTitle>
            <DialogDescription>
              {editingLog 
                ? "Update the details of this procedure execution."
                : "Log a new instance of procedure execution for audit and compliance tracking."}
            </DialogDescription>
          </DialogHeader>
          <SOPExecutionForm
            log={editingLog}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


