"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  FileWarning,
} from "lucide-react";
import {
  governanceApi,
  PolicyException,
  ExceptionStatus,
  ExceptionType,
} from "@/lib/api/governance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuHeader,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { PolicyExceptionForm } from "@/components/governance/policy-exception-form";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PolicyExceptionsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedException, setSelectedException] = useState<PolicyException | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: response, isLoading } = useQuery({
    queryKey: ["policy-exceptions", searchQuery, statusFilter],
    queryFn: () =>
      governanceApi.getPolicyExceptions({
        search: searchQuery,
        status: statusFilter === "all" ? undefined : (statusFilter as ExceptionStatus),
      }),
  });

  const exceptions = response?.data || [];

  const approveMutation = useMutation({
    mutationFn: (id: string) => governanceApi.approvePolicyException(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-exceptions"] });
      toast({ title: "Success", description: "Exception approved successfully" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      governanceApi.rejectPolicyException(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-exceptions"] });
      toast({ title: "Success", description: "Exception rejected successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deletePolicyException(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-exceptions"] });
      toast({ title: "Success", description: "Exception deleted successfully" });
    },
  });

  const getStatusBadge = (status: ExceptionStatus) => {
    switch (status) {
      case ExceptionStatus.APPROVED:
        return <Badge className="bg-green-500">Approved</Badge>;
      case ExceptionStatus.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>;
      case ExceptionStatus.UNDER_REVIEW:
        return <Badge className="bg-blue-500 text-white">Under Review</Badge>;
      case ExceptionStatus.REQUESTED:
        return <Badge variant="secondary">Requested</Badge>;
      case ExceptionStatus.EXPIRED:
        return <Badge variant="outline">Expired</Badge>;
      case ExceptionStatus.REVOKED:
        return <Badge variant="outline" className="text-muted-foreground">Revoked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = (id: string) => {
    if (confirm("Are you sure you want to approve this exception?")) {
      approveMutation.mutate(id);
    }
  };

  const handleReject = (id: string) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      rejectMutation.mutate({ id, reason });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this exception request?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Policy Exceptions</h1>
          <p className="text-muted-foreground">
            Manage and track formal deviations from established policies and controls
          </p>
        </div>
        <Button onClick={() => { setSelectedException(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Request Exception
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID or justification..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={ExceptionStatus.REQUESTED}>Requested</SelectItem>
            <SelectItem value={ExceptionStatus.UNDER_REVIEW}>Under Review</SelectItem>
            <SelectItem value={ExceptionStatus.APPROVED}>Approved</SelectItem>
            <SelectItem value={ExceptionStatus.REJECTED}>Rejected</SelectItem>
            <SelectItem value={ExceptionStatus.EXPIRED}>Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identifier</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span>Loading exceptions...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : exceptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No policy exceptions found.
                  </TableCell>
                </TableRow>
              ) : (
                exceptions.map((exception) => (
                  <TableRow key={exception.id}>
                    <TableCell className="font-mono text-xs font-bold">
                      {exception.exception_identifier}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {exception.exception_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {exception.requester?.first_name} {exception.requester?.last_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {exception.requesting_business_unit?.name || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(exception.request_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {exception.end_date 
                        ? format(new Date(exception.end_date), "MMM d, yyyy")
                        : "Permanent"}
                    </TableCell>
                    <TableCell>{getStatusBadge(exception.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => { setSelectedException(exception); setIsViewOpen(true); }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          
                          {(exception.status === ExceptionStatus.REQUESTED || exception.status === ExceptionStatus.UNDER_REVIEW) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-green-600 focus:text-green-600 focus:bg-green-50"
                                onClick={() => handleApprove(exception.id)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive focus:bg-red-50"
                                onClick={() => handleReject(exception.id)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setSelectedException(exception); setIsFormOpen(true); }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Request
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(exception.id)}
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

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedException ? "Edit Exception Request" : "Request Policy Exception"}
            </DialogTitle>
            <DialogDescription>
              Submit a formal request for a deviation from policy or standard requirement.
            </DialogDescription>
          </DialogHeader>
          <PolicyExceptionForm
            exception={selectedException}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-primary" />
              Exception Details: {selectedException?.exception_identifier}
            </DialogTitle>
          </DialogHeader>
          
          {selectedException && (
            <ScrollArea className="mt-4 pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Status</span>
                    <div>{getStatusBadge(selectedException.status)}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Type</span>
                    <div className="capitalize">{selectedException.exception_type}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Requester</span>
                    <div className="text-sm">
                      {selectedException.requester?.first_name} {selectedException.requester?.last_name}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Request Date</span>
                    <div className="text-sm">{format(new Date(selectedException.request_date), "PPPP")}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Duration</span>
                    <div className="text-sm">
                      {selectedException.start_date ? format(new Date(selectedException.start_date), "PP") : "Immediate"} 
                      {" to "} 
                      {selectedException.end_date ? format(new Date(selectedException.end_date), "PP") : "Permanent"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Entity ID</span>
                    <div className="text-xs font-mono truncate" title={selectedException.entity_id}>
                      {selectedException.entity_id}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Business Justification</span>
                  <div className="text-sm bg-muted/30 p-3 rounded-md border">
                    {selectedException.business_justification}
                  </div>
                </div>

                {selectedException.compensating_controls && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Compensating Controls</span>
                    <div className="text-sm bg-muted/30 p-3 rounded-md border">
                      {selectedException.compensating_controls}
                    </div>
                  </div>
                )}

                {selectedException.risk_assessment && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Risk Assessment</span>
                    <div className="text-sm bg-orange-50/30 p-3 rounded-md border border-orange-100 flex gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                      {selectedException.risk_assessment}
                    </div>
                  </div>
                )}

                {selectedException.status === ExceptionStatus.APPROVED && (
                  <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-green-800 uppercase">Approved By</span>
                        <div className="text-sm">
                          {selectedException.approver?.first_name} {selectedException.approver?.last_name}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-green-800 uppercase">Approval Date</span>
                        <div className="text-sm">
                          {selectedException.approval_date ? format(new Date(selectedException.approval_date), "PP") : "N/A"}
                        </div>
                      </div>
                    </div>
                    {selectedException.approval_conditions && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-green-800 uppercase">Approval Conditions</span>
                        <div className="text-sm">{selectedException.approval_conditions}</div>
                      </div>
                    )}
                  </div>
                )}

                {selectedException.status === ExceptionStatus.REJECTED && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-xs font-semibold text-red-800 uppercase">Rejection Reason</span>
                    <div className="text-sm mt-1">{selectedException.rejection_reason}</div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


