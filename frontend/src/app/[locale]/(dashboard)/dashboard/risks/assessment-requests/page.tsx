"use client"

import { useState, Suspense } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  riskAssessmentRequestsApi,
  RiskAssessmentRequest,
  AssessmentType,
} from "@/lib/api/risks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Check,
  X,
  ArrowRight,
} from "lucide-react"
import { RiskAssessmentRequestForm } from "@/components/forms/risk-assessment-request-form"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
  in_progress: "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-gray-100 text-gray-800 border-gray-300",
}

const priorityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-800 border-red-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-blue-100 text-blue-800 border-blue-300",
}

const assessmentTypeLabels: Record<AssessmentType, string> = {
  inherent: "Inherent Risk",
  current: "Current Risk",
  target: "Target Risk",
}

function AssessmentRequestsContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = params?.locale || "en"
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<RiskAssessmentRequest | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null)
  const [actioningRequestId, setActioningRequestId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | "cancel" | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  // Get riskId from query params if available
  const riskIdFilter = searchParams?.get('riskId') || undefined

  const { data: requests, isLoading } = useQuery({
    queryKey: ["risk-assessment-requests", statusFilter, riskIdFilter],
    queryFn: () =>
      riskAssessmentRequestsApi.getAll({
        riskId: riskIdFilter,
        status: statusFilter !== "all" ? statusFilter : undefined,
      }),
  })

  // Filter requests by search query
  const filteredRequests = (requests || []).filter((request) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      request.request_identifier.toLowerCase().includes(query) ||
      request.risk_title?.toLowerCase().includes(query) ||
      request.risk_identifier?.toLowerCase().includes(query) ||
      request.requested_by_name?.toLowerCase().includes(query) ||
      request.requested_for_name?.toLowerCase().includes(query) ||
      request.justification?.toLowerCase().includes(query)
    )
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => riskAssessmentRequestsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-assessment-requests"] })
      toast({
        title: "Success",
        description: "Assessment request deleted successfully",
      })
      setDeletingRequestId(null)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete assessment request",
        variant: "destructive",
      })
      setDeletingRequestId(null)
    },
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => riskAssessmentRequestsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-assessment-requests"] })
      toast({
        title: "Success",
        description: "Request approved successfully",
      })
      setActioningRequestId(null)
      setActionType(null)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve request",
        variant: "destructive",
      })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      riskAssessmentRequestsApi.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-assessment-requests"] })
      toast({
        title: "Success",
        description: "Request rejected successfully",
      })
      setActioningRequestId(null)
      setActionType(null)
      setRejectionReason("")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reject request",
        variant: "destructive",
      })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => riskAssessmentRequestsApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-assessment-requests"] })
      toast({
        title: "Success",
        description: "Request cancelled successfully",
      })
      setActioningRequestId(null)
      setActionType(null)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to cancel request",
        variant: "destructive",
      })
    },
  })

  const markInProgressMutation = useMutation({
    mutationFn: (id: string) => riskAssessmentRequestsApi.markInProgress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-assessment-requests"] })
      toast({
        title: "Success",
        description: "Request marked as in progress",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update request",
        variant: "destructive",
      })
    },
  })

  const handleEdit = (request: RiskAssessmentRequest) => {
    setEditingRequest(request)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setEditingRequest(null)
    setIsFormOpen(true)
  }

  const handleApprove = (id: string) => {
    setActioningRequestId(id)
    setActionType("approve")
  }

  const handleReject = (id: string) => {
    setActioningRequestId(id)
    setActionType("reject")
  }

  const handleCancel = (id: string) => {
    setActioningRequestId(id)
    setActionType("cancel")
  }

  const handleAction = () => {
    if (!actioningRequestId || !actionType) return

    switch (actionType) {
      case "approve":
        approveMutation.mutate(actioningRequestId)
        break
      case "reject":
        rejectMutation.mutate({ id: actioningRequestId, reason: rejectionReason || undefined })
        break
      case "cancel":
        cancelMutation.mutate(actioningRequestId)
        break
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading assessment requests...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Assessment Requests</h1>
          <p className="text-muted-foreground mt-1">
            Request and track risk assessments
          </p>
        </div>
        <Button onClick={handleCreate} data-testid="assessment-requests-new-button">
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by request ID, risk, or assignee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="assessment-requests-search-input"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all"
                ? "No requests match your search criteria"
                : "No assessment requests found. Create your first request to get started."}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button onClick={handleCreate} data-testid="assessment-requests-new-button">
                <Plus className="mr-2 h-4 w-4" />
                Create First Request
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">
                        {assessmentTypeLabels[request.assessment_type]} Assessment
                      </CardTitle>
                      <Badge variant="outline" className="font-mono text-xs">
                        {request.request_identifier}
                      </Badge>
                      <Badge className={statusColors[request.status] || "bg-gray-100 text-gray-800"}>
                        {statusLabels[request.status] || request.status}
                      </Badge>
                      <Badge className={priorityColors[request.priority] || "bg-gray-100 text-gray-800"}>
                        {request.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {request.risk_title && (
                        <Link
                          href={`/${locale}/dashboard/risks/${request.risk_id}`}
                          className="hover:underline font-medium"
                        >
                          Risk: {request.risk_title}
                        </Link>
                      )}
                      {request.requested_by_name && (
                        <span>Requested by: {request.requested_by_name}</span>
                      )}
                      {request.requested_for_name && (
                        <span>Assigned to: {request.requested_for_name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {request.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {request.status === "approved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markInProgressMutation.mutate(request.id)}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {["pending", "approved", "in_progress"].includes(request.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(request.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleEdit(request)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {["pending", "cancelled"].includes(request.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingRequestId(request.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {request.risk_id && (
                      <Link href={`/${locale}/dashboard/risks/${request.risk_id}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {request.justification && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Justification:</p>
                      <p className="text-sm">{request.justification}</p>
                    </div>
                  )}
                  {request.notes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Notes:</p>
                      <p className="text-sm">{request.notes}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                    {request.due_date && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due: {new Date(request.due_date).toLocaleDateString()}
                      </div>
                    )}
                    <div>
                      Created: {new Date(request.created_at).toLocaleDateString()}
                    </div>
                    {request.approval_workflow_id && (
                      <Link
                        href={`/${locale}/dashboard/workflows/history`}
                        className="text-primary hover:underline text-xs"
                      >
                        View Workflow →
                      </Link>
                    )}
                    {request.resulting_assessment_id && (
                      <Link
                        href={`/${locale}/dashboard/risks/${request.risk_id}#assessments`}
                        className="text-primary hover:underline"
                      >
                        View Assessment →
                      </Link>
                    )}
                  </div>
                  {request.rejection_reason && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{request.rejection_reason}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Request Form Dialog */}
      <RiskAssessmentRequestForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) {
            setEditingRequest(null)
          }
        }}
        riskId={editingRequest?.risk_id}
        initialData={editingRequest || undefined}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["risk-assessment-requests"] })
        }}
      />

      {/* Action Dialog (Approve/Reject/Cancel) */}
      <Dialog
        open={!!actioningRequestId && !!actionType}
        onOpenChange={(open) => {
          if (!open) {
            setActioningRequestId(null)
            setActionType(null)
            setRejectionReason("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "Approve Request"}
              {actionType === "reject" && "Reject Request"}
              {actionType === "cancel" && "Cancel Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" && "Are you sure you want to approve this assessment request?"}
              {actionType === "reject" &&
                "Are you sure you want to reject this assessment request? Please provide a reason."}
              {actionType === "cancel" && "Are you sure you want to cancel this assessment request?"}
            </DialogDescription>
          </DialogHeader>
          {actionType === "reject" && (
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this request is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActioningRequestId(null)
                setActionType(null)
                setRejectionReason("")
              }}
              disabled={
                approveMutation.isPending || rejectMutation.isPending || cancelMutation.isPending
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={approveMutation.isPending || rejectMutation.isPending || cancelMutation.isPending}
              variant={actionType === "reject" || actionType === "cancel" ? "destructive" : "default"}
            >
              {approveMutation.isPending || rejectMutation.isPending || cancelMutation.isPending
                ? "Processing..."
                : actionType === "approve"
                  ? "Approve"
                  : actionType === "reject"
                    ? "Reject"
                    : "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingRequestId}
        onOpenChange={(open) => !open && setDeletingRequestId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assessment Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this assessment request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingRequestId && deleteMutation.mutate(deletingRequestId)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function AssessmentRequestsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8">
        <div className="text-center">Loading assessment requests...</div>
      </div>
    }>
      <AssessmentRequestsContent />
    </Suspense>
  )
}



