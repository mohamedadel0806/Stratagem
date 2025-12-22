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
  AlertCircle,
  Calendar,
  User as UserIcon,
  Building,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import {
  governanceApi,
  ComplianceObligation,
  ObligationStatus,
  ObligationPriority,
  ObligationQueryParams,
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
import { ObligationForm } from "@/components/governance/obligation-form";
import { Pagination } from "@/components/ui/pagination";

export default function ObligationsRegisterPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingObligation, setEditingObligation] = useState<ComplianceObligation | null>(null);
  const [filters, setFilters] = useState<ObligationQueryParams>({
    page: 1,
    limit: 20,
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["compliance-obligations", filters],
    queryFn: () => governanceApi.getObligations(filters),
  });

  const { data: stats } = useQuery({
    queryKey: ["obligation-statistics"],
    queryFn: () => governanceApi.getObligationStatistics(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteObligation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance-obligations"] });
      toast({ title: "Success", description: "Obligation deleted successfully" });
    },
  });

  const getStatusBadge = (status: ObligationStatus) => {
    switch (status) {
      case ObligationStatus.MET:
        return <Badge className="bg-green-500">Met</Badge>;
      case ObligationStatus.PARTIALLY_MET:
        return <Badge className="bg-yellow-500">Partially Met</Badge>;
      case ObligationStatus.NOT_MET:
        return <Badge variant="destructive">Not Met</Badge>;
      case ObligationStatus.IN_PROGRESS:
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case ObligationStatus.OVERDUE:
        return <Badge variant="destructive" className="animate-pulse">Overdue</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{status.replace(/_/g, " ")}</Badge>;
    }
  };

  const getPriorityBadge = (priority: ObligationPriority) => {
    switch (priority) {
      case ObligationPriority.CRITICAL:
        return <Badge variant="destructive">Critical</Badge>;
      case ObligationPriority.HIGH:
        return <Badge className="bg-orange-500">High</Badge>;
      case ObligationPriority.MEDIUM:
        return <Badge className="bg-blue-500">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Compliance Obligations Register
          </h1>
          <p className="text-muted-foreground">
            Track and manage specific regulatory and internal compliance obligations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Register
          </Button>
          <Button onClick={() => { setEditingObligation(null); setIsFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Obligation
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-muted/30">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">Total Obligations</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 pb-4">
            <div className="text-2xl font-bold">{response?.meta.total || 0}</div>
          </CardContent>
        </Card>
        {/* Placeholder for real stats */}
        <Card className="bg-green-50 dark:bg-green-950/10 border-green-100 dark:border-green-900/30">
          <CardHeader className="py-3 px-4 text-green-700 dark:text-green-400">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 pb-4 text-green-700 dark:text-green-400">
            <div className="text-2xl font-bold">85%</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 dark:bg-orange-950/10 border-orange-100 dark:border-orange-900/30">
          <CardHeader className="py-3 px-4 text-orange-700 dark:text-orange-400">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 pb-4 text-orange-700 dark:text-orange-400">
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30">
          <CardHeader className="py-3 px-4 text-blue-700 dark:text-blue-400">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 pb-4 text-blue-700 dark:text-blue-400">
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, title or description..."
            className="pl-9"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <Select 
          value={filters.status || "all"} 
          onValueChange={(val) => setFilters({ ...filters, status: val === "all" ? undefined : (val as ObligationStatus), page: 1 })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(ObligationStatus).map(s => (
              <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={filters.priority || "all"} 
          onValueChange={(val) => setFilters({ ...filters, priority: val === "all" ? undefined : (val as ObligationPriority), page: 1 })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {Object.values(ObligationPriority).map(p => (
              <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Identifier</TableHead>
                <TableHead>Obligation Title</TableHead>
                <TableHead>Source Influencer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Loading register...</p>
                  </TableCell>
                </TableRow>
              ) : response?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No obligations found. Start by adding one or extracting from influencers.
                  </TableCell>
                </TableRow>
              ) : (
                response?.data.map((obligation) => (
                  <TableRow key={obligation.id} className="group">
                    <TableCell className="font-mono text-xs font-bold text-muted-foreground">
                      {obligation.obligation_identifier}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col max-w-[300px]">
                        <span className="text-sm font-semibold truncate" title={obligation.title}>
                          {obligation.title}
                        </span>
                        {obligation.description && (
                          <span className="text-xs text-muted-foreground truncate" title={obligation.description}>
                            {obligation.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {obligation.influencer ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">{obligation.influencer.name}</span>
                          {obligation.source_reference && (
                            <span className="text-[10px] text-muted-foreground">{obligation.source_reference}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Internal / Manual</span>
                      )}
                    </TableCell>
                    <TableCell>{getPriorityBadge(obligation.priority)}</TableCell>
                    <TableCell>
                      {obligation.due_date ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {format(new Date(obligation.due_date), "MMM d, yyyy")}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(obligation.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditingObligation(obligation); setIsFormOpen(true); }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Obligation
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this obligation?")) {
                                deleteMutation.mutate(obligation.id);
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
              {editingObligation ? "Edit Obligation" : "Add Compliance Obligation"}
            </DialogTitle>
            <DialogDescription>
              {editingObligation 
                ? "Update the details of this compliance requirement."
                : "Create a new specific obligation to track and fulfill."}
            </DialogDescription>
          </DialogHeader>
          <ObligationForm
            obligation={editingObligation}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


