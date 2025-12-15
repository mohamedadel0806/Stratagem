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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { risksApi, riskCategoriesApi, CreateRiskData, RiskCategory, ThreatSource, RiskVelocity, RiskStatus } from "@/lib/api/risks"
import { usersApi } from "@/lib/api/users"
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"

// Simple toast implementation
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
}

const riskFormSchema = z.object({
  // Basic Information
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  risk_statement: z.string().optional(),
  category: z.string().optional(), // Legacy enum field
  category_id: z.string().optional(), // New category reference
  status: z.enum(["identified", "assessed", "mitigated", "accepted", "closed"]).optional(),
  ownerId: z.string().optional(),
  risk_analyst_id: z.string().optional(),
  
  // Risk Scoring (Current)
  likelihood: z.number().min(1).max(5).optional(),
  impact: z.number().min(1).max(5).optional(),
  
  // Risk Scenario
  threat_source: z.enum(["internal", "external", "natural", "unknown"]).optional(),
  risk_velocity: z.enum(["slow", "medium", "fast", "immediate"]).optional(),
  early_warning_signs: z.string().optional(),
  vulnerabilities: z.string().optional(),
  
  // Ownership & Dates
  date_identified: z.string().optional(),
  next_review_date: z.string().optional(),
  
  // Additional context
  status_notes: z.string().optional(),
  business_process: z.string().optional(),
  tags: z.string().optional(), // Will be converted to array
  
  // Inherent Risk (before controls)
  inherent_likelihood: z.number().min(1).max(5).optional(),
  inherent_impact: z.number().min(1).max(5).optional(),
  
  // Target Risk (goal)
  target_likelihood: z.number().min(1).max(5).optional(),
  target_impact: z.number().min(1).max(5).optional(),
})

type RiskFormValues = z.infer<typeof riskFormSchema>

interface RiskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  riskId?: string
  initialData?: {
    title: string
    description?: string
    risk_statement?: string
    category?: string
    category_id?: string
    status?: string
    ownerId?: string
    risk_analyst_id?: string
    likelihood?: number
    impact?: number
    threat_source?: ThreatSource
    risk_velocity?: RiskVelocity
    early_warning_signs?: string
    vulnerabilities?: string
    date_identified?: string
    next_review_date?: string
    status_notes?: string
    business_process?: string
    tags?: string[]
    inherent_likelihood?: number
    inherent_impact?: number
    target_likelihood?: number
    target_impact?: number
  }
}

const LIKELIHOOD_LABELS = [
  { value: 1, label: "Rare" },
  { value: 2, label: "Unlikely" },
  { value: 3, label: "Possible" },
  { value: 4, label: "Likely" },
  { value: 5, label: "Almost Certain" },
]

const IMPACT_LABELS = [
  { value: 1, label: "Insignificant" },
  { value: 2, label: "Minor" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "Major" },
  { value: 5, label: "Catastrophic" },
]

export function RiskForm({ open, onOpenChange, riskId, initialData }: RiskFormProps) {
  const queryClient = useQueryClient()
  const isEditMode = !!riskId
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['risk-categories'],
    queryFn: () => riskCategoriesApi.getAll(false, true),
    enabled: open,
  })

  // Fetch users for owner and analyst dropdowns
  const { data: usersList } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
    enabled: open,
  })

  const form = useForm<RiskFormValues>({
    resolver: zodResolver(riskFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      tags: initialData.tags?.join(', ') || '',
    } : {
      title: "",
      description: "",
      category: "compliance",
      category_id: undefined,
      status: "identified",
      ownerId: undefined,
      risk_analyst_id: undefined,
      likelihood: 3,
      impact: 3,
    },
  })

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        tags: initialData.tags?.join(', ') || '',
      })
    }
  }, [initialData, form])

  // Calculate risk score
  const watchedLikelihood = form.watch("likelihood") || 3
  const watchedImpact = form.watch("impact") || 3
  const currentScore = watchedLikelihood * watchedImpact
  
  const watchedInherentL = form.watch("inherent_likelihood")
  const watchedInherentI = form.watch("inherent_impact")
  const inherentScore = watchedInherentL && watchedInherentI ? watchedInherentL * watchedInherentI : null

  const watchedTargetL = form.watch("target_likelihood")
  const watchedTargetI = form.watch("target_impact")
  const targetScore = watchedTargetL && watchedTargetI ? watchedTargetL * watchedTargetI : null

  const getRiskLevel = (score: number) => {
    if (score >= 20) return { label: "Critical", color: "bg-red-500" }
    if (score >= 12) return { label: "High", color: "bg-orange-500" }
    if (score >= 6) return { label: "Medium", color: "bg-yellow-500" }
    return { label: "Low", color: "bg-green-500" }
  }

  const createMutation = useMutation({
    mutationFn: (data: CreateRiskData) => risksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risks"] })
      queryClient.invalidateQueries({ queryKey: ["risk-dashboard-summary"] })
      toast.success("Risk created successfully")
      form.reset()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create risk")
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: CreateRiskData) => risksApi.update(riskId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risks"] })
      queryClient.invalidateQueries({ queryKey: ["risk", riskId] })
      queryClient.invalidateQueries({ queryKey: ["risk-dashboard-summary"] })
      toast.success("Risk updated successfully")
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update risk")
    },
  })

  const mutation = isEditMode ? updateMutation : createMutation

  const onSubmit = (values: RiskFormValues) => {
    const data: CreateRiskData = {
      title: values.title,
      description: values.description,
      risk_statement: values.risk_statement,
      category: values.category as RiskCategory,
      category_id: values.category_id || undefined,
      status: values.status as RiskStatus,
      ownerId: values.ownerId || undefined,
      risk_analyst_id: values.risk_analyst_id || undefined,
      likelihood: values.likelihood,
      impact: values.impact,
      threat_source: values.threat_source as ThreatSource,
      risk_velocity: values.risk_velocity as RiskVelocity,
      early_warning_signs: values.early_warning_signs,
      date_identified: values.date_identified,
      next_review_date: values.next_review_date,
      status_notes: values.status_notes,
      business_process: values.business_process,
      tags: values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      inherent_likelihood: values.inherent_likelihood,
      inherent_impact: values.inherent_impact,
      current_likelihood: values.likelihood,
      current_impact: values.impact,
      target_likelihood: values.target_likelihood,
      target_impact: values.target_impact,
    }
    mutation.mutate(data)
  }

  const currentLevel = getRiskLevel(currentScore)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Risk" : "Create New Risk"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the risk details below."
              : "Add a new risk to the risk register. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Risk Score Summary */}
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <AlertTriangle className={`h-5 w-5 ${currentLevel.color === 'bg-red-500' ? 'text-red-500' : currentLevel.color === 'bg-orange-500' ? 'text-orange-500' : currentLevel.color === 'bg-yellow-500' ? 'text-yellow-500' : 'text-green-500'}`} />
              <div className="flex-1">
                <div className="text-sm font-medium">Risk Score</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {inherentScore && <span>Inherent: {inherentScore}</span>}
                  <span className="font-semibold">Current: {currentScore}</span>
                  {targetScore && <span>Target: {targetScore}</span>}
                </div>
              </div>
              <Badge className={`${currentLevel.color} text-white`}>
                {currentLevel.label} ({currentScore})
              </Badge>
            </div>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="scenario">Risk Scenario</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Data Breach Risk from Unauthorized Access" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="risk_statement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="If [threat] exploits [vulnerability], then [consequence] may occur..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use the format: "If [threat] exploits [vulnerability], then [consequence] may occur"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the risk in detail..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value === "none" ? undefined : value);
                            // Also set legacy category field for backward compatibility
                            const selectedCategory = categories?.find((c: any) => c.id === value);
                            if (selectedCategory) {
                              form.setValue("category", selectedCategory.code?.toLowerCase().replace(/_/g, '_') || "compliance");
                            }
                          }} 
                          value={field.value || "none"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None (use legacy category)</SelectItem>
                            {categories?.filter((c: any) => !c.parent_category_id).map((category: any) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Select from risk categories (or use legacy category below)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="identified">Identified</SelectItem>
                            <SelectItem value="assessed">Assessed</SelectItem>
                            <SelectItem value="mitigated">Mitigated</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Legacy Category Field (for backward compatibility - show if no category_id selected) */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className={form.watch("category_id") ? "hidden" : ""}>
                      <FormLabel>Category (Legacy)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "compliance"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="data_privacy">Data Privacy</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="operational">Operational</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="strategic">Strategic</SelectItem>
                          <SelectItem value="reputational">Reputational</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="human_capital">Human Capital</SelectItem>
                          <SelectItem value="third_party">Third Party</SelectItem>
                          <SelectItem value="environmental">Environmental</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Legacy category field (use Category dropdown above if available)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ownerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Owner</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                          value={field.value || "none"}
                          disabled={usersList === undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select owner (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No owner</SelectItem>
                            {usersList?.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.firstName && user.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Person responsible for managing this risk</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="risk_analyst_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Analyst</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                          value={field.value || "none"}
                          disabled={usersList === undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select analyst (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No analyst</SelectItem>
                            {usersList?.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.firstName && user.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Person who analyzes and assesses this risk</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date_identified"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Identified</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="next_review_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Review Date</FormLabel>
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
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tags separated by commas" {...field} />
                      </FormControl>
                      <FormDescription>e.g., GDPR, PCI-DSS, Customer Data</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Assessment Tab */}
              <TabsContent value="assessment" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Current Risk Assessment</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="likelihood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Likelihood (1-5)</FormLabel>
                          <Select
                            onValueChange={(v) => field.onChange(parseInt(v))}
                            value={String(field.value || 3)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LIKELIHOOD_LABELS.map(l => (
                                <SelectItem key={l.value} value={String(l.value)}>
                                  {l.value} - {l.label}
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
                          <FormLabel>Impact (1-5)</FormLabel>
                          <Select
                            onValueChange={(v) => field.onChange(parseInt(v))}
                            value={String(field.value || 3)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {IMPACT_LABELS.map(i => (
                                <SelectItem key={i.value} value={String(i.value)}>
                                  {i.value} - {i.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full justify-center"
                >
                  {showAdvanced ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Hide Inherent & Target Scores
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Set Inherent & Target Scores
                    </>
                  )}
                </Button>

                {showAdvanced && (
                  <>
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                      <h4 className="text-sm font-medium">Inherent Risk (Before Controls)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="inherent_likelihood"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inherent Likelihood</FormLabel>
                              <Select
                                onValueChange={(v) => field.onChange(parseInt(v))}
                                value={field.value ? String(field.value) : undefined}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {LIKELIHOOD_LABELS.map(l => (
                                    <SelectItem key={l.value} value={String(l.value)}>
                                      {l.value} - {l.label}
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
                          name="inherent_impact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inherent Impact</FormLabel>
                              <Select
                                onValueChange={(v) => field.onChange(parseInt(v))}
                                value={field.value ? String(field.value) : undefined}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {IMPACT_LABELS.map(i => (
                                    <SelectItem key={i.value} value={String(i.value)}>
                                      {i.value} - {i.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {inherentScore && (
                        <div className="text-sm">
                          Inherent Risk Score: <Badge className={getRiskLevel(inherentScore).color + " text-white"}>{inherentScore}</Badge>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                      <h4 className="text-sm font-medium">Target Risk (Goal After Treatment)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="target_likelihood"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Likelihood</FormLabel>
                              <Select
                                onValueChange={(v) => field.onChange(parseInt(v))}
                                value={field.value ? String(field.value) : undefined}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {LIKELIHOOD_LABELS.map(l => (
                                    <SelectItem key={l.value} value={String(l.value)}>
                                      {l.value} - {l.label}
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
                          name="target_impact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Impact</FormLabel>
                              <Select
                                onValueChange={(v) => field.onChange(parseInt(v))}
                                value={field.value ? String(field.value) : undefined}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {IMPACT_LABELS.map(i => (
                                    <SelectItem key={i.value} value={String(i.value)}>
                                      {i.value} - {i.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {targetScore && (
                        <div className="text-sm">
                          Target Risk Score: <Badge className={getRiskLevel(targetScore).color + " text-white"}>{targetScore}</Badge>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Risk Scenario Tab */}
              <TabsContent value="scenario" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="threat_source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Threat Source</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select threat source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                            <SelectItem value="natural">Natural</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Where does the threat originate?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="risk_velocity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Velocity</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select velocity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="slow">Slow (Months)</SelectItem>
                            <SelectItem value="medium">Medium (Weeks)</SelectItem>
                            <SelectItem value="fast">Fast (Days)</SelectItem>
                            <SelectItem value="immediate">Immediate (Hours)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How quickly can this risk materialize?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="vulnerabilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vulnerabilities Exploited</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What vulnerabilities could be exploited?"
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="early_warning_signs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Early Warning Signs</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What indicators might signal this risk is materializing?"
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_process"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Affected Business Process</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Customer Data Processing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes about the current status..."
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending} data-testid={isEditMode ? "risk-form-submit-update" : "risk-form-submit-create"}>
                {mutation.isPending
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Risk"
                  : "Create Risk"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
