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
  Settings,
  ShieldAlert,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  governanceApi,
  SecureBaseline,
  BaselineStatus,
  BaselineQueryParams,
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
import { BaselineForm } from "@/components/governance/baseline-form";
import { Pagination } from "@/components/ui/pagination";

export default function SecureBaselinesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBaseline, setEditingBaseline] = useState<SecureBaseline | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<BaselineQueryParams>({
    page: 1,
    limit: 20,
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["secure-baselines", filters],
    queryFn: () => governanceApi.getBaselines(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteBaseline(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["secure-baselines"] });
      toast({ title: "Success", description: "Baseline deleted successfully" });
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

  const getStatusBadge = (status: BaselineStatus) => {
    switch (status) {
      case BaselineStatus.ACTIVE:
        return <Badge className="bg-green-500">Active</Badge>;
      case BaselineStatus.DRAFT:
        return <Badge variant="secondary">Draft</Badge>;
      case BaselineStatus.DEPRECATED:
        return <Badge variant="destructive">Deprecated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Secure Baselines
          </h1>
          <p className="text-muted-foreground">
            Define and manage secure configuration standards for IT assets
          </p>
        </div>
        <Button onClick={() => { setEditingBaseline(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Baseline
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, name or category..."
            className="pl-9"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <Select 
          value={filters.status || "all"} 
          onValueChange={(val) => setFilters({ ...filters, status: val === "all" ? undefined : (val as BaselineStatus), page: 1 })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(BaselineStatus).map(s => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
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
                <TableHead className="w-[120px]">Identifier</TableHead>
                <TableHead>Baseline Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Clock className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Loading baselines...</p>
                  </TableCell>
                </TableRow>
              ) : response?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    No secure baselines defined yet.
                  </TableCell>
                </TableRow>
              ) : (
                response?.data.map((baseline) => (
                  <>
                    <TableRow key={baseline.id} className="group hover:bg-muted/30">
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleRow(baseline.id)}>
                          {expandedRows.has(baseline.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-muted-foreground">
                        {baseline.baseline_identifier}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{baseline.name}</span>
                          {baseline.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1">{baseline.description}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{baseline.category || "General"}</Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium">v{baseline.version || "1.0"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {baseline.requirements?.length || 0} items
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(baseline.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setEditingBaseline(baseline); setIsFormOpen(true); }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Baseline
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {}}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this baseline?")) {
                                  deleteMutation.mutate(baseline.id);
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
                    {expandedRows.has(baseline.id) && (
                      <TableRow className="bg-muted/10 border-b">
                        <TableCell colSpan={8} className="p-0">
                          <div className="p-4 pl-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-1">
                            {baseline.requirements?.length > 0 ? (
                              baseline.requirements.map((req) => (
                                <Card key={req.id} className="bg-background shadow-none border-dashed border-2">
                                  <CardContent className="p-3 space-y-2">
                                    <div className="flex justify-between items-start">
                                      <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono">{req.requirement_identifier}</span>
                                      <Badge variant="outline" className="text-[9px] h-4">Value: {req.configuration_value || "N/A"}</Badge>
                                    </div>
                                    <p className="text-xs font-semibold leading-tight">{req.title}</p>
                                    <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">{req.description}</p>
                                    <div className="pt-1 flex items-center gap-1.5 text-[9px] text-muted-foreground border-t">
                                      <ShieldAlert className="h-3 w-3" />
                                      Validation: {req.validation_method || "Manual"}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            ) : (
                              <div className="col-span-full py-4 text-center text-xs text-muted-foreground italic">
                                No requirements defined for this baseline.
                              </div>
                            )}
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
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBaseline ? "Edit Secure Baseline" : "Create Secure Baseline"}
            </DialogTitle>
            <DialogDescription>
              {editingBaseline 
                ? "Update the configuration standards and requirements for this baseline."
                : "Define a new set of secure configuration standards for assets."}
            </DialogDescription>
          </DialogHeader>
          <BaselineForm
            baseline={editingBaseline}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


