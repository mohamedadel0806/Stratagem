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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { riskCategoriesApi, RiskCategoryData } from "@/lib/api/risks"
import { useToast } from "@/hooks/use-toast"

const riskCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be less than 200 characters"),
  code: z.string().min(1, "Code is required").max(50, "Code must be less than 50 characters"),
  description: z.string().optional(),
  parent_category_id: z.string().optional(),
  risk_tolerance: z.enum(["low", "medium", "high"]).default("medium"),
  is_active: z.boolean().default(true),
  display_order: z.number().min(0).default(0),
  color: z.string().max(20).optional(),
  icon: z.string().max(50).optional(),
})

type RiskCategoryFormValues = z.infer<typeof riskCategoryFormSchema>

interface RiskCategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId?: string
  initialData?: RiskCategoryData
  parentOptions?: RiskCategoryData[] // For selecting parent category
  onSuccess?: () => void
}

export function RiskCategoryForm({
  open,
  onOpenChange,
  categoryId,
  initialData,
  parentOptions = [],
  onSuccess,
}: RiskCategoryFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isEditMode = !!categoryId

  const form = useForm<RiskCategoryFormValues>({
    resolver: zodResolver(riskCategoryFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          code: initialData.code,
          description: initialData.description || "",
          parent_category_id: initialData.parent_category_id || "",
          risk_tolerance: initialData.risk_tolerance,
          is_active: initialData.is_active,
          display_order: initialData.display_order,
          color: initialData.color || "",
          icon: initialData.icon || "",
        }
      : {
          name: "",
          code: "",
          description: "",
          parent_category_id: "",
          risk_tolerance: "medium",
          is_active: true,
          display_order: 0,
          color: "",
          icon: "",
        },
  })

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        code: initialData.code,
        description: initialData.description || "",
        parent_category_id: initialData.parent_category_id || "",
        risk_tolerance: initialData.risk_tolerance,
        is_active: initialData.is_active,
        display_order: initialData.display_order,
        color: initialData.color || "",
        icon: initialData.icon || "",
      })
    } else {
      form.reset({
        name: "",
        code: "",
        description: "",
        parent_category_id: "",
        risk_tolerance: "medium",
        is_active: true,
        display_order: 0,
        color: "",
        icon: "",
      })
    }
  }, [initialData, form])

  // Filter out current category and its children from parent options to prevent circular references
  const availableParentOptions = React.useMemo(() => {
    if (!categoryId) return parentOptions
    const filterCategoryAndChildren = (category: RiskCategoryData): RiskCategoryData[] => {
      if (category.id === categoryId) return []
      const children = category.sub_categories?.flatMap(filterCategoryAndChildren) || []
      return [category, ...children]
    }
    return parentOptions.filter(cat => !filterCategoryAndChildren(cat).some(c => c.id === categoryId))
  }, [parentOptions, categoryId])

  const createMutation = useMutation({
    mutationFn: (data: RiskCategoryFormValues) =>
      riskCategoriesApi.create({
        name: data.name,
        code: data.code,
        description: data.description || undefined,
        parent_category_id: data.parent_category_id || undefined,
        risk_tolerance: data.risk_tolerance,
        is_active: data.is_active,
        display_order: data.display_order,
        color: data.color || undefined,
        icon: data.icon || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-categories"] })
      toast({
        title: "Success",
        description: "Risk category created successfully",
      })
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create risk category",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: RiskCategoryFormValues) =>
      riskCategoriesApi.update(categoryId!, {
        name: data.name,
        code: data.code,
        description: data.description || undefined,
        parent_category_id: data.parent_category_id || undefined,
        risk_tolerance: data.risk_tolerance,
        is_active: data.is_active,
        display_order: data.display_order,
        color: data.color || undefined,
        icon: data.icon || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-categories"] })
      toast({
        title: "Success",
        description: "Risk category updated successfully",
      })
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update risk category",
        variant: "destructive",
      })
    },
  })

  const mutation = isEditMode ? updateMutation : createMutation

  const onSubmit = (values: RiskCategoryFormValues) => {
    mutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Risk Category" : "Create Risk Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the risk category details"
              : "Create a new risk category to organize and classify risks"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cybersecurity" {...field} />
                  </FormControl>
                  <FormDescription>The display name of the category</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CYBER" {...field} disabled={isEditMode} />
                  </FormControl>
                  <FormDescription>
                    Unique identifier code (cannot be changed after creation)
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
                      placeholder="Describe what types of risks belong to this category..."
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
                name="parent_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                      value={field.value || "none"}
                      disabled={availableParentOptions.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="None (top level)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None (top level)</SelectItem>
                        {availableParentOptions.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name} ({category.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Optional parent category for hierarchical organization</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="risk_tolerance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Tolerance *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The default risk tolerance for this category</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="#3b82f6" {...field} />
                    </FormControl>
                    <FormDescription>Hex color code</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input placeholder="Shield" {...field} />
                    </FormControl>
                    <FormDescription>Icon name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Inactive categories will be hidden from selection lists
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

