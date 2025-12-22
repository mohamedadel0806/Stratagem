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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { riskTreatmentsApi, CreateTreatmentData, TreatmentStrategy, TreatmentStatus, TreatmentPriority, RiskTreatment } from "@/lib/api/risks"
import { risksApi, Risk } from "@/lib/api/risks"
import { usersApi, User } from "@/lib/api/users"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const treatmentFormSchema = z.object({
  risk_id: z.string().min(1, "Risk is required"),
  strategy: z.enum(["mitigate", "transfer", "avoid", "accept"]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  treatment_owner_id: z.string().optional(),
  status: z.enum(["planned", "in_progress", "completed", "deferred", "cancelled"]).default("planned"),
  priority: z.enum(["critical", "high", "medium", "low"]).default("medium"),
  start_date: z.string().optional(),
  target_completion_date: z.string().optional(),
  estimated_cost: z.coerce.number().positive().optional().or(z.literal("")),
  expected_risk_reduction: z.string().optional(),
  residual_likelihood: z.coerce.number().min(1).max(5).optional().or(z.literal("")),
  residual_impact: z.coerce.number().min(1).max(5).optional().or(z.literal("")),
  implementation_notes: z.string().optional(),
})

type TreatmentFormValues = z.infer<typeof treatmentFormSchema>

interface TreatmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  treatmentId?: string
  riskId?: string
  initialData?: Partial<RiskTreatment>
  onSuccess?: () => void
}

export function TreatmentForm({ open, onOpenChange, treatmentId, riskId, initialData, onSuccess }: TreatmentFormProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const isEditMode = !!treatmentId

  // Fetch users for owner selection
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  })

  // Fetch risks if no riskId provided
  const { data: risks } = useQuery({
    queryKey: ['risks', 'all'],
    queryFn: () => risksApi.getAll({ limit: 1000 }),
    enabled: !riskId,
  })

  // Fetch treatment if editing
  const { data: treatment } = useQuery({
    queryKey: ['treatment', treatmentId],
    queryFn: () => riskTreatmentsApi.getById(treatmentId!),
    enabled: isEditMode && !!treatmentId,
  })

  const form = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentFormSchema),
    defaultValues: {
      risk_id: riskId || initialData?.risk_id || "",
      strategy: initialData?.strategy || "mitigate",
      title: initialData?.title || "",
      description: initialData?.description || "",
      treatment_owner_id: initialData?.treatment_owner_id || "",
      status: initialData?.status || "planned",
      priority: initialData?.priority || "medium",
      start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : "",
      target_completion_date: initialData?.target_completion_date ? new Date(initialData.target_completion_date).toISOString().split('T')[0] : "",
      estimated_cost: initialData?.estimated_cost || "",
      expected_risk_reduction: initialData?.expected_risk_reduction || "",
      residual_likelihood: initialData?.residual_likelihood || "",
      residual_impact: initialData?.residual_impact || "",
      implementation_notes: initialData?.implementation_notes || "",
    },
  })

  // Update form when treatment data loads
  React.useEffect(() => {
    if (treatment && isEditMode) {
      form.reset({
        risk_id: treatment.risk_id,
        strategy: treatment.strategy,
        title: treatment.title,
        description: treatment.description || "",
        treatment_owner_id: treatment.treatment_owner_id || "",
        status: treatment.status,
        priority: treatment.priority,
        start_date: treatment.start_date ? new Date(treatment.start_date).toISOString().split('T')[0] : "",
        target_completion_date: treatment.target_completion_date ? new Date(treatment.target_completion_date).toISOString().split('T')[0] : "",
        estimated_cost: treatment.estimated_cost || "",
        expected_risk_reduction: treatment.expected_risk_reduction || "",
        residual_likelihood: treatment.residual_likelihood || "",
        residual_impact: treatment.residual_impact || "",
        implementation_notes: treatment.implementation_notes || "",
      })
    }
  }, [treatment, isEditMode, form])

  const createMutation = useMutation({
    mutationFn: (data: CreateTreatmentData) => riskTreatmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
      queryClient.invalidateQueries({ queryKey: ['treatment'] })
      if (riskId) {
        queryClient.invalidateQueries({ queryKey: ['risk-treatments', riskId] })
      }
      toast({
        title: 'Success',
        description: 'Treatment created successfully',
      })
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create treatment',
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateTreatmentData>) => riskTreatmentsApi.update(treatmentId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
      queryClient.invalidateQueries({ queryKey: ['treatment', treatmentId] })
      if (riskId) {
        queryClient.invalidateQueries({ queryKey: ['risk-treatments', riskId] })
      }
      toast({
        title: 'Success',
        description: 'Treatment updated successfully',
      })
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update treatment',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (values: TreatmentFormValues) => {
    const data: CreateTreatmentData = {
      risk_id: values.risk_id,
      strategy: values.strategy,
      title: values.title,
      description: values.description || undefined,
      treatment_owner_id: (values.treatment_owner_id && values.treatment_owner_id !== 'none') ? values.treatment_owner_id : undefined,
      status: values.status,
      priority: values.priority,
      start_date: values.start_date || undefined,
      target_completion_date: values.target_completion_date || undefined,
      estimated_cost: typeof values.estimated_cost === 'number' ? values.estimated_cost : undefined,
      expected_risk_reduction: values.expected_risk_reduction || undefined,
      residual_likelihood: typeof values.residual_likelihood === 'number' ? values.residual_likelihood : undefined,
      residual_impact: typeof values.residual_impact === 'number' ? values.residual_impact : undefined,
      implementation_notes: values.implementation_notes || undefined,
    }

    if (isEditMode) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Treatment' : 'Create Treatment'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update treatment plan details' : 'Create a new risk treatment plan'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Risk Selection (if not pre-filled) */}
            {!riskId && (
              <FormField
                control={form.control}
                name="risk_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a risk" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {risks?.data?.map((risk: Risk) => (
                          <SelectItem key={risk.id} value={risk.id}>
                            {risk.risk_id} - {risk.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {/* Strategy */}
              <FormField
                control={form.control}
                name="strategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strategy *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="treatment-form-strategy-dropdown">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mitigate">Mitigate</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="avoid">Avoid</SelectItem>
                        <SelectItem value="accept">Accept</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="treatment-form-status-dropdown">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="deferred">Deferred</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Treatment plan title" {...field} data-testid="treatment-form-title-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the treatment plan..." rows={3} {...field} data-testid="treatment-form-description-textarea" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {/* Owner */}
              <FormField
                control={form.control}
                name="treatment_owner_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Owner</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="treatment-form-owner-dropdown">
                          <SelectValue placeholder="Select owner (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No owner</SelectItem>
                        {users?.map((user: User) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="treatment-form-priority-dropdown">
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="treatment-form-start-date-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Completion Date */}
              <FormField
                control={form.control}
                name="target_completion_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Completion Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="treatment-form-end-date-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Estimated Cost */}
            <FormField
              control={form.control}
              name="estimated_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Cost</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} data-testid="treatment-form-cost-input" />
                  </FormControl>
                  <FormDescription>Estimated cost for implementing this treatment</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expected Risk Reduction */}
            <FormField
              control={form.control}
              name="expected_risk_reduction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Risk Reduction</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe expected reduction in risk..." rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {/* Residual Likelihood */}
              <FormField
                control={form.control}
                name="residual_likelihood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residual Likelihood (1-5)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}
                      value={field.value ? String(field.value) : "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select likelihood" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="1">1 - Rare</SelectItem>
                        <SelectItem value="2">2 - Unlikely</SelectItem>
                        <SelectItem value="3">3 - Possible</SelectItem>
                        <SelectItem value="4">4 - Likely</SelectItem>
                        <SelectItem value="5">5 - Almost Certain</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Likelihood after treatment implementation</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Residual Impact */}
              <FormField
                control={form.control}
                name="residual_impact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residual Impact (1-5)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}
                      value={field.value ? String(field.value) : "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select impact" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="1">1 - Insignificant</SelectItem>
                        <SelectItem value="2">2 - Minor</SelectItem>
                        <SelectItem value="3">3 - Moderate</SelectItem>
                        <SelectItem value="4">4 - Major</SelectItem>
                        <SelectItem value="5">5 - Catastrophic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Impact after treatment implementation</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Implementation Notes */}
            <FormField
              control={form.control}
              name="implementation_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Implementation Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes about implementation..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} data-testid="treatment-form-cancel-button">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} data-testid={isEditMode ? "treatment-form-submit-update" : "treatment-form-submit-create"}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Update Treatment' : 'Create Treatment'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

