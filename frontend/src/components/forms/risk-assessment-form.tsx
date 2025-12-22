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
import { riskAssessmentsApi, riskSettingsApi, CreateAssessmentData, AssessmentType, RiskAssessment } from "@/lib/api/risks"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const riskAssessmentFormSchema = z.object({
  assessment_type: z.enum(["inherent", "current", "target"]),
  likelihood: z.number().min(1).max(5),
  impact: z.number().min(1).max(5),
  financial_impact: z.enum(["low", "medium", "high"]).optional(),
  financial_impact_amount: z.number().optional(),
  operational_impact: z.enum(["low", "medium", "high"]).optional(),
  reputational_impact: z.enum(["low", "medium", "high"]).optional(),
  compliance_impact: z.enum(["low", "medium", "high"]).optional(),
  safety_impact: z.enum(["low", "medium", "high"]).optional(),
  assessment_date: z.string().optional(),
  assessment_method: z.string().optional(),
  assessment_notes: z.string().optional(),
  assumptions: z.string().optional(),
  confidence_level: z.enum(["high", "medium", "low"]).optional(),
})

type RiskAssessmentFormValues = z.infer<typeof riskAssessmentFormSchema>

interface RiskAssessmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  riskId: string
  assessmentId?: string
  initialData?: RiskAssessment
  onSuccess?: () => void
}

const LIKELIHOOD_LABELS = [
  { value: 1, label: "1 - Rare" },
  { value: 2, label: "2 - Unlikely" },
  { value: 3, label: "3 - Possible" },
  { value: 4, label: "4 - Likely" },
  { value: 5, label: "5 - Almost Certain" },
]

const IMPACT_LABELS = [
  { value: 1, label: "1 - Insignificant" },
  { value: 2, label: "2 - Minor" },
  { value: 3, label: "3 - Moderate" },
  { value: 4, label: "4 - Major" },
  { value: 5, label: "5 - Catastrophic" },
]

const IMPACT_LEVEL_LABELS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

const CONFIDENCE_LABELS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

export function RiskAssessmentForm({
  open,
  onOpenChange,
  riskId,
  assessmentId,
  initialData,
  onSuccess,
}: RiskAssessmentFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isEditMode = !!assessmentId

  // Fetch assessment methods from settings
  const { data: assessmentMethods } = useQuery({
    queryKey: ["risk-assessment-methods"],
    queryFn: () => riskSettingsApi.getAssessmentMethods(),
    enabled: open,
  })

  const form = useForm<RiskAssessmentFormValues>({
    resolver: zodResolver(riskAssessmentFormSchema),
    defaultValues: initialData
      ? {
          assessment_type: initialData.assessment_type,
          likelihood: initialData.likelihood,
          impact: initialData.impact,
          financial_impact: initialData.financial_impact as any,
          financial_impact_amount: initialData.financial_impact_amount,
          operational_impact: initialData.operational_impact as any,
          reputational_impact: initialData.reputational_impact as any,
          compliance_impact: initialData.compliance_impact as any,
          safety_impact: initialData.safety_impact as any,
          assessment_date: initialData.assessment_date
            ? new Date(initialData.assessment_date).toISOString().split("T")[0]
            : undefined,
          assessment_method: initialData.assessment_method,
          assessment_notes: initialData.assessment_notes,
          assumptions: initialData.assumptions,
          confidence_level: initialData.confidence_level as any,
        }
      : {
          assessment_type: "current",
          likelihood: 3,
          impact: 3,
          assessment_date: new Date().toISOString().split("T")[0],
          confidence_level: "medium",
        },
  })

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        assessment_type: initialData.assessment_type,
        likelihood: initialData.likelihood,
        impact: initialData.impact,
        financial_impact: initialData.financial_impact as any,
        financial_impact_amount: initialData.financial_impact_amount,
        operational_impact: initialData.operational_impact as any,
        reputational_impact: initialData.reputational_impact as any,
        compliance_impact: initialData.compliance_impact as any,
        safety_impact: initialData.safety_impact as any,
        assessment_date: initialData.assessment_date
          ? new Date(initialData.assessment_date).toISOString().split("T")[0]
          : undefined,
        assessment_method: initialData.assessment_method,
        assessment_notes: initialData.assessment_notes,
        assumptions: initialData.assumptions,
        confidence_level: initialData.confidence_level as any,
      })
    } else {
      form.reset({
        assessment_type: "current",
        likelihood: 3,
        impact: 3,
        assessment_date: new Date().toISOString().split("T")[0],
        confidence_level: "medium",
      })
    }
  }, [initialData, form])

  // Calculate risk score
  const watchedLikelihood = form.watch("likelihood") || 3
  const watchedImpact = form.watch("impact") || 3
  const currentScore = watchedLikelihood * watchedImpact

  const getRiskLevel = (score: number) => {
    if (score >= 20) return { label: "Critical", color: "bg-red-500 text-white" }
    if (score >= 12) return { label: "High", color: "bg-orange-500 text-white" }
    if (score >= 6) return { label: "Medium", color: "bg-yellow-500 text-white" }
    return { label: "Low", color: "bg-green-500 text-white" }
  }

  const riskLevel = getRiskLevel(currentScore)

  const createMutation = useMutation({
    mutationFn: (data: RiskAssessmentFormValues) =>
      riskAssessmentsApi.create({
        risk_id: riskId,
        assessment_type: data.assessment_type,
        likelihood: data.likelihood,
        impact: data.impact,
        financial_impact: data.financial_impact,
        financial_impact_amount: data.financial_impact_amount,
        operational_impact: data.operational_impact,
        reputational_impact: data.reputational_impact,
        compliance_impact: data.compliance_impact,
        safety_impact: data.safety_impact,
        assessment_date: data.assessment_date || new Date().toISOString().split("T")[0],
        assessment_method: data.assessment_method,
        assessment_notes: data.assessment_notes,
        assumptions: data.assumptions,
        confidence_level: data.confidence_level || "medium",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-assessments", riskId] })
      queryClient.invalidateQueries({ queryKey: ["risk-assessments-latest", riskId] })
      queryClient.invalidateQueries({ queryKey: ["risk", riskId] })
      toast({
        title: "Success",
        description: "Risk assessment created successfully",
      })
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create risk assessment",
        variant: "destructive",
      })
    },
  })

  const mutation = createMutation

  const onSubmit = (values: RiskAssessmentFormValues) => {
    mutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Risk Assessment" : "Create Risk Assessment"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the risk assessment details" : "Create a new assessment for this risk"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Risk Score Preview */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Calculated Risk Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl font-bold">{currentScore}</span>
                    <Badge className={riskLevel.color}>{riskLevel.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Likelihood: {watchedLikelihood} × Impact: {watchedImpact}
                  </p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="impacts">Impacts</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="assessment_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="assessment-form-assessment-type-dropdown">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="inherent">Inherent Risk (Before Controls)</SelectItem>
                          <SelectItem value="current">Current Risk (With Controls)</SelectItem>
                          <SelectItem value="target">Target Risk (Desired State)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The type of risk assessment being performed</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="likelihood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Likelihood *</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="assessment-form-likelihood-dropdown">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LIKELIHOOD_LABELS.map((item) => (
                              <SelectItem key={item.value} value={item.value.toString()}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="impact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impact *</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="assessment-form-impact-dropdown">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {IMPACT_LABELS.map((item) => (
                              <SelectItem key={item.value} value={item.value.toString()}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="assessment_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="assessment-form-date-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="impacts" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="financial_impact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Financial Impact</FormLabel>
                        <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} value={field.value || "none"}>
                          <FormControl>
                            <SelectTrigger data-testid="assessment-form-financial-impact-dropdown">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {IMPACT_LEVEL_LABELS.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("financial_impact") && (
                    <FormField
                      control={form.control}
                      name="financial_impact_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Financial Impact Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              data-testid="assessment-form-financial-impact-amount-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="operational_impact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operational Impact</FormLabel>
                        <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} value={field.value || "none"}>
                          <FormControl>
                            <SelectTrigger data-testid="assessment-form-operational-impact-dropdown">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {IMPACT_LEVEL_LABELS.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reputational_impact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reputational Impact</FormLabel>
                        <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} value={field.value || "none"}>
                          <FormControl>
                            <SelectTrigger data-testid="assessment-form-reputational-impact-dropdown">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {IMPACT_LEVEL_LABELS.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="compliance_impact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compliance Impact</FormLabel>
                        <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} value={field.value || "none"}>
                          <FormControl>
                            <SelectTrigger data-testid="assessment-form-compliance-impact-dropdown">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {IMPACT_LEVEL_LABELS.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="safety_impact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Safety Impact</FormLabel>
                        <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} value={field.value || "none"}>
                          <FormControl>
                            <SelectTrigger data-testid="assessment-form-safety-impact-dropdown">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {IMPACT_LEVEL_LABELS.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <FormField
                  control={form.control}
                  name="assessment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Method</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} value={field.value || "none"}>
                        <FormControl>
                          <SelectTrigger data-testid="assessment-form-method-dropdown">
                            <SelectValue placeholder="Select method..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {assessmentMethods?.map((method) => (
                            <SelectItem key={method.id} value={method.name}>
                              {method.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>The methodology used for this assessment</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confidence_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confidence Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "medium"}>
                        <FormControl>
                          <SelectTrigger data-testid="assessment-form-confidence-level-dropdown">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONFIDENCE_LABELS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Your confidence in the accuracy of this assessment</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessment_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Document your assessment rationale..." rows={4} {...field} data-testid="assessment-form-notes-textarea" />
                      </FormControl>
                      <FormDescription>Detailed notes about this assessment</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assumptions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assumptions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any assumptions made during assessment..." rows={3} {...field} data-testid="assessment-form-assumptions-textarea" />
                      </FormControl>
                      <FormDescription>Key assumptions underlying this assessment</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending} data-testid="assessment-form-cancel-button">
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending} data-testid={isEditMode ? "assessment-form-submit-update" : "assessment-form-submit-create"}>
                {mutation.isPending ? "Creating..." : "Create Assessment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}



