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
  FileText,
  Filter,
  History,
  ClipboardCheck,
  Calendar,
} from "lucide-react";
import {
  governanceApi,
  ControlTest,
  ControlTestStatus,
  ControlTestResult,
  ControlTestQueryParams,
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
import { ControlTestForm } from "@/components/governance/control-test-form";
import { Pagination } from "@/components/ui/pagination";

export default function ControlTestingPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<ControlTest | null>(null);
  const [filters, setFilters] = useState<ControlTestQueryParams>({
    page: 1,
    limit: 20,
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["control-tests", filters],
    queryFn: () => governanceApi.getControlTests(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteControlTest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["control-tests"] });
      toast({ title: "Success", description: "Test record deleted successfully" });
    },
  });

  const getStatusBadge = (status: ControlTestStatus) => {
    switch (status) {
      case ControlTestStatus.COMPLETED:
        return <Badge className="bg-green-500">Completed</Badge>;
      case ControlTestStatus.IN_PROGRESS:
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case ControlTestStatus.PLANNED:
        return <Badge variant="secondary">Planned</Badge>;
      case ControlTestStatus.CANCELLED:
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getResultBadge = (result?: ControlTestResult) => {
    if (!result) return <Badge variant="outline">N/A</Badge>;
    switch (result) {
      case ControlTestResult.PASS:
        return <Badge className="bg-green-600">Pass</Badge>;
      case ControlTestResult.FAIL:
        return <Badge variant="destructive">Fail</Badge>;
      case ControlTestResult.INCONCLUSIVE:
        return <Badge className="bg-yellow-500 text-black">Inconclusive</Badge>;
      default:
        return <Badge variant="outline">{result}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            Control Testing & Validation
          </h1>
          <p className="text-muted-foreground">
            Monitor effectiveness and schedule periodic validation of unified controls
          </p>
        </div>
        <Button onClick={() => { setEditingTest(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Test Record
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tests, procedures or observations..."
            className="pl-9"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <Select 
          value={filters.status || "all"} 
          onValueChange={(val) => setFilters({ ...filters, status: val === "all" ? undefined : (val as ControlTestStatus), page: 1 })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(ControlTestStatus).map(s => (
              <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={filters.result || "all"} 
          onValueChange={(val) => setFilters({ ...filters, result: val === "all" ? undefined : (val as ControlTestResult), page: 1 })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Result" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Results</SelectItem>
            {Object.values(ControlTestResult).map(r => (
              <SelectItem key={r} value={r} className="capitalize">{r.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Test Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Effectiveness</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Clock className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Loading test records...</p>
                  </TableCell>
                </TableRow>
              ) : response?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No control tests recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                response?.data.map((test) => (
                  <TableRow key={test.id} className="group hover:bg-muted/30">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{test.unified_control?.title}</span>
                        <span className="text-xs font-mono text-muted-foreground">{test.unified_control?.control_identifier}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {test.test_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {format(new Date(test.test_date), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(test.status)}</TableCell>
                    <TableCell>{getResultBadge(test.result)}</TableCell>
                    <TableCell>
                      {test.effectiveness_score !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-1.5 max-w-[60px]">
                            <div 
                              className={`h-1.5 rounded-full ${
                                test.effectiveness_score >= 80 ? 'bg-green-500' :
                                test.effectiveness_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${test.effectiveness_score}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{test.effectiveness_score}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditingTest(test); setIsFormOpen(true); }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this test record?")) {
                                deleteMutation.mutate(test.id);
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
              {editingTest ? "Edit Test Record" : "Record Control Test"}
            </DialogTitle>
            <DialogDescription>
              {editingTest 
                ? "Update the details of this control validation."
                : "Schedule a new test or record the results of a validation exercise."}
            </DialogDescription>
          </DialogHeader>
          <ControlTestForm
            test={editingTest}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


