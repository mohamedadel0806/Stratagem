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
import { krisApi, KRI, KRIStatus, KRITrend } from "@/lib/api/risks"
import { riskCategoriesApi, RiskCategoryData } from "@/lib/api/risks"
import { usersApi, User } from "@/lib/api/users"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const kriFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  category_id: z.string().optional(),
  measurement_unit: z.string().optional(),
  measurement_frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "annually"]).default("monthly"),
  data_source: z.string().optional(),
  calculation_method: z.string().optional(),
  threshold_green: z.coerce.number().optional().or(z.literal("")),
  threshold_amber: z.coerce.number().optional().or(z.literal("")),
  threshold_red: z.coerce.number().optional().or(z.literal("")),
  threshold_direction: z.enum(["above", "below", "both"]).default("above"),
  kri_owner_id: z.string().optional(),
  is_active: z.boolean().default(true),
  target_value: z.coerce.number().optional().or(z.literal("")),
  baseline_value: z.coerce.number().optional().or(z.literal("")),
})

type KRIFormValues = z.infer<typeof kriFormSchema>

interface KRIFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kriId?: string
  initialData?: Partial<KRI>
  onSuccess?: () => void
}

export function KRIForm({ open, onOpenChange, kriId, initialData, onSuccess }: KRIFormProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const isEditMode = !!kriId

  // Fetch users for owner selection
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  })

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['risk-categories'],
    queryFn: () => riskCategoriesApi.getAll(false, true),
  })

  // Fetch KRI if editing
  const { data: kri } = useQuery({
    queryKey: ['kri', kriId],
    queryFn: () => krisApi.getById(kriId!),
    enabled: isEditMode && !!kriId,
  })

  const form = useForm<KRIFormValues>({
    resolver: zodResolver(kriFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      category_id: initialData?.category_id || "",
      measurement_unit: initialData?.measurement_unit || "",
      measurement_frequency: initialData?.measurement_frequency || "monthly",
      data_source: initialData?.data_source || "",
      calculation_method: initialData?.calculation_method || "",
      threshold_green: initialData?.threshold_green || "",
      threshold_amber: initialData?.threshold_amber || "",
      threshold_red: initialData?.threshold_red || "",
      threshold_direction: (initialData?.threshold_direction as "above" | "below" | "both") || "above",
      kri_owner_id: initialData?.kri_owner_id || "",
      is_active: initialData?.is_active ?? true,
      target_value: initialData?.target_value || "",
      baseline_value: initialData?.baseline_value || "",
    },
  })

  // Update form when KRI data loads
  React.useEffect(() => {
    if (kri && isEditMode) {
      form.reset({
        name: kri.name,
        description: kri.description || "",
        category_id: kri.category_id || "",
        measurement_unit: kri.measurement_unit || "",
        measurement_frequency: kri.measurement_frequency,
        data_source: kri.data_source || "",
        calculation_method: kri.calculation_method || "",
        threshold_green: kri.threshold_green || "",
        threshold_amber: kri.threshold_amber || "",
        threshold_red: kri.threshold_red || "",
        threshold_direction: (kri.threshold_direction as "above" | "below" | "both") || "above",
        kri_owner_id: kri.kri_owner_id || "",
        is_active: kri.is_active ?? true,
        target_value: kri.target_value || "",
        baseline_value: kri.baseline_value || "",
      })
    }
  }, [kri, isEditMode, form])

  const createMutation = useMutation({
    mutationFn: (data: Partial<KRI>) => {
      return krisApi.create(data)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['kris'] })
      queryClient.invalidateQueries({ queryKey: ['kri'] })
      queryClient.invalidateQueries({ queryKey: ['risks'] })
      toast({
        title: 'Success',
        description: 'KRI created successfully',
      })
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create KRI',
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<KRI>) => krisApi.update(kriId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kris'] })
      queryClient.invalidateQueries({ queryKey: ['kri', kriId] })
      queryClient.invalidateQueries({ queryKey: ['risks'] })
      toast({
        title: 'Success',
        description: 'KRI updated successfully',
      })
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update KRI',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (values: KRIFormValues) => {
    const data: Partial<KRI> = {
      name: values.name,
      description: values.description || undefined,
      category_id: (values.category_id && values.category_id !== 'none') ? values.category_id : undefined,
      measurement_unit: values.measurement_unit || undefined,
      measurement_frequency: values.measurement_frequency,
      data_source: values.data_source || undefined,
      calculation_method: values.calculation_method || undefined,
      threshold_green: typeof values.threshold_green === 'number' ? values.threshold_green : undefined,
      threshold_amber: typeof values.threshold_amber === 'number' ? values.threshold_amber : undefined,
      threshold_red: typeof values.threshold_red === 'number' ? values.threshold_red : undefined,
      threshold_direction: values.threshold_direction,
      kri_owner_id: (values.kri_owner_id && values.kri_owner_id !== 'none') ? values.kri_owner_id : undefined,
      is_active: values.is_active,
      target_value: typeof values.target_value === 'number' ? values.target_value : undefined,
      baseline_value: typeof values.baseline_value === 'number' ? values.baseline_value : undefined,
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
          <DialogTitle>{isEditMode ? 'Edit KRI' : 'Create KRI'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update Key Risk Indicator details' : 'Create a new Key Risk Indicator'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="KRI name" {...field} />
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
                    <Textarea placeholder="Describe what this KRI measures..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {/* Category */}
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No category</SelectItem>
                        {categories?.map((category: RiskCategoryData) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Owner */}
              <FormField
                control={form.control}
                name="kri_owner_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KRI Owner</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Measurement Unit */}
              <FormField
                control={form.control}
                name="measurement_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Measurement Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., %, count, $, hours" {...field} />
                    </FormControl>
                    <FormDescription>Unit of measurement (e.g., percentage, count, currency)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Measurement Frequency */}
              <FormField
                control={form.control}
                name="measurement_frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Measurement Frequency *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Data Source */}
            <FormField
              control={form.control}
              name="data_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Source</FormLabel>
                  <FormControl>
                    <Input placeholder="Source of data (e.g., System X, Manual collection)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Calculation Method */}
            <FormField
              control={form.control}
              name="calculation_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calculation Method</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe how this KRI is calculated..." rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Threshold Direction */}
            <FormField
              control={form.control}
              name="threshold_direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Threshold Direction *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="above">Higher is worse (above threshold = red)</SelectItem>
                      <SelectItem value="below">Lower is worse (below threshold = red)</SelectItem>
                      <SelectItem value="both">Both directions (range)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Direction in which values indicate increased risk</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thresholds */}
            <div className="grid gap-4 md:grid-cols-3 border-t pt-4">
              <FormField
                control={form.control}
                name="threshold_green"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Green Threshold</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Green" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription className="text-green-600">Acceptable level</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="threshold_amber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amber Threshold</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Amber" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription className="text-amber-600">Warning level</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="threshold_red"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Red Threshold</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Red" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription className="text-red-600">Critical level</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Baseline Value */}
              <FormField
                control={form.control}
                name="baseline_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baseline Value</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Baseline" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Historical baseline for comparison</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Value */}
              <FormField
                control={form.control}
                name="target_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Target" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Desired target value</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Active Status */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Active KRIs are monitored and included in dashboards
                    </FormDescription>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} data-testid={isEditMode ? "kri-form-submit-update" : "kri-form-submit-create"}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Update KRI' : 'Create KRI'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

