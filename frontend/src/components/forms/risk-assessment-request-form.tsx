"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import {
  riskAssessmentRequestsApi,
  CreateRiskAssessmentRequestData,
  RiskAssessmentRequest,
  AssessmentType,
  risksApi,
} from "@/lib/api/risks"
import { useToast } from "@/hooks/use-toast"
import { usersApi } from "@/lib/api/users"
import { Search, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

const riskAssessmentRequestFormSchema = z.object({
  risk_id: z.string().uuid("Risk ID is required"),
  requested_for_id: z.string().uuid().optional().or(z.literal("")),
  assessment_type: z.enum(["inherent", "current", "target"]),
  priority: z.enum(["critical", "high", "medium", "low"]).default("medium"),
  due_date: z.string().optional(),
  justification: z.string().optional(),
  notes: z.string().optional(),
})

type RiskAssessmentRequestFormValues = z.infer<typeof riskAssessmentRequestFormSchema>

interface RiskAssessmentRequestFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  riskId?: string
  initialData?: RiskAssessmentRequest
  onSuccess?: () => void
}

export function RiskAssessmentRequestForm({
  open,
  onOpenChange,
  riskId,
  initialData,
  onSuccess,
}: RiskAssessmentRequestFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isEditMode = !!initialData
  const [riskSearchQuery, setRiskSearchQuery] = React.useState("")
  const [riskDropdownOpen, setRiskDropdownOpen] = React.useState(false)

  // Fetch users for assignee dropdown
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    enabled: open,
  })

  // Fetch risks for searchable dropdown
  const { data: risksResponse, isLoading: isLoadingRisks } = useQuery({
    queryKey: ["risks", "search", riskSearchQuery],
    queryFn: () => risksApi.getAll({ search: riskSearchQuery, limit: 50 }),
    enabled: open && !isEditMode && !riskId,
  })

  const risks = risksResponse?.data || []
  const riskDropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        riskDropdownRef.current &&
        !riskDropdownRef.current.contains(event.target as Node)
      ) {
        setRiskDropdownOpen(false)
      }
    }

    if (riskDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [riskDropdownOpen])

  const form = useForm<RiskAssessmentRequestFormValues>({
    resolver: zodResolver(riskAssessmentRequestFormSchema),
    defaultValues: initialData
      ? {
          risk_id: initialData.risk_id,
          requested_for_id: initialData.requested_for_id || "",
          assessment_type: initialData.assessment_type,
          priority: initialData.priority as any,
          due_date: initialData.due_date ? new Date(initialData.due_date).toISOString().split("T")[0] : undefined,
          justification: initialData.justification,
          notes: initialData.notes,
        }
      : {
          risk_id: riskId || "",
          requested_for_id: "",
          assessment_type: "current",
          priority: "medium",
          due_date: undefined,
          justification: "",
          notes: "",
        },
  })

  // Reset form when initialData or riskId changes
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        risk_id: initialData.risk_id,
        requested_for_id: initialData.requested_for_id || "",
        assessment_type: initialData.assessment_type,
        priority: initialData.priority as any,
        due_date: initialData.due_date ? new Date(initialData.due_date).toISOString().split("T")[0] : undefined,
        justification: initialData.justification,
        notes: initialData.notes,
      })
    } else {
      form.reset({
        risk_id: riskId || "",
        requested_for_id: "",
        assessment_type: "current",
        priority: "medium",
        due_date: undefined,
        justification: "",
        notes: "",
      })
    }
  }, [initialData, riskId, form])

  // Reset search state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setRiskSearchQuery("")
      setRiskDropdownOpen(false)
    }
  }, [open])

  const createMutation = useMutation({
    mutationFn: (data: RiskAssessmentRequestFormValues) =>
      riskAssessmentRequestsApi.create({
        risk_id: data.risk_id,
        requested_for_id: data.requested_for_id || undefined,
        assessment_type: data.assessment_type,
        priority: data.priority,
        due_date: data.due_date,
        justification: data.justification,
        notes: data.notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-assessment-requests"] })
      queryClient.invalidateQueries({ queryKey: ["risk", riskId] })
      toast({
        title: "Success",
        description: "Assessment request created successfully",
      })
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create assessment request",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: RiskAssessmentRequestFormValues) =>
      riskAssessmentRequestsApi.update(initialData!.id, {
        requested_for_id: data.requested_for_id || undefined,
        priority: data.priority,
        due_date: data.due_date,
        justification: data.justification,
        notes: data.notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-assessment-requests"] })
      queryClient.invalidateQueries({ queryKey: ["risk", riskId] })
      toast({
        title: "Success",
        description: "Assessment request updated successfully",
      })
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update assessment request",
        variant: "destructive",
      })
    },
  })

  const mutation = isEditMode ? updateMutation : createMutation

  const onSubmit = (values: RiskAssessmentRequestFormValues) => {
    mutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Assessment Request" : "Create Assessment Request"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the assessment request details"
              : "Request a risk assessment to be performed"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isEditMode && !riskId && (
              <FormField
                control={form.control}
                name="risk_id"
                render={({ field }) => {
                  const selectedRisk = risks.find((r) => r.id === field.value)
                  return (
                    <FormItem>
                      <FormLabel>Risk *</FormLabel>
                      <FormControl>
                        <div className="relative" ref={riskDropdownRef} data-testid="risk-search-dropdown">
                          <div
                            className={cn(
                              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
                              !field.value && "text-muted-foreground"
                            )}
                            onClick={() => setRiskDropdownOpen(!riskDropdownOpen)}
                            data-testid="risk-dropdown-trigger"
                          >
                            <span className="flex items-center gap-2 flex-1">
                              {selectedRisk ? (
                                <>
                                  <span className="font-medium">{selectedRisk.title}</span>
                                  {selectedRisk.risk_id && (
                                    <span className="text-xs text-muted-foreground">
                                      ({selectedRisk.risk_id})
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted-foreground">Search and select a risk...</span>
                              )}
                            </span>
                            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                          </div>
                          {riskDropdownOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-[300px] overflow-hidden">
                              <div className="p-2 border-b">
                                <div className="relative">
                                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Search risks..."
                                    value={riskSearchQuery}
                                    onChange={(e) => setRiskSearchQuery(e.target.value)}
                                    className="pl-8"
                                    onClick={(e) => e.stopPropagation()}
                                    onFocus={(e) => e.stopPropagation()}
                                    autoFocus
                                    data-testid="risk-search-input"
                                  />
                                </div>
                              </div>
                              <div className="overflow-y-auto max-h-[250px]">
                                {isLoadingRisks ? (
                                  <div className="p-4 text-sm text-muted-foreground text-center">
                                    Loading risks...
                                  </div>
                                ) : risks.length === 0 ? (
                                  <div className="p-4 text-sm text-muted-foreground text-center">
                                    {riskSearchQuery ? "No risks found" : "Start typing to search risks"}
                                  </div>
                                ) : (
                                  risks.map((risk) => (
                                    <div
                                      key={risk.id}
                                      className={cn(
                                        "px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground flex items-center justify-between",
                                        field.value === risk.id && "bg-accent"
                                      )}
                                      onClick={() => {
                                        field.onChange(risk.id)
                                        setRiskDropdownOpen(false)
                                        setRiskSearchQuery("")
                                      }}
                                      data-testid={`risk-option-${risk.id}`}
                                    >
                                      <div className="flex flex-col gap-1 flex-1">
                                        <span className="font-medium">{risk.title}</span>
                                        {risk.risk_id && (
                                          <span className="text-xs text-muted-foreground">
                                            ID: {risk.risk_id}
                                          </span>
                                        )}
                                        {risk.category_name && (
                                          <span className="text-xs text-muted-foreground">
                                            Category: {risk.category_name}
                                          </span>
                                        )}
                                      </div>
                                      {field.value === risk.id && (
                                        <Check className="h-4 w-4 text-primary" />
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>Search and select the risk to assess</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            )}

            <FormField
              control={form.control}
              name="assessment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isEditMode}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inherent">Inherent Risk (Before Controls)</SelectItem>
                      <SelectItem value="current">Current Risk (With Controls)</SelectItem>
                      <SelectItem value="target">Target Risk (Desired State)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The type of assessment being requested</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requested_for_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                    value={field.value || "none"}
                    disabled={users === undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assessor (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (unassigned)</SelectItem>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Assign this request to a specific assessor (optional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Justification</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why this assessment is needed..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Reason for requesting this assessment</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes or instructions..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending} data-testid={isEditMode ? "assessment-request-form-submit-update" : "assessment-request-form-submit-create"}>
                {mutation.isPending ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update" : "Create Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

