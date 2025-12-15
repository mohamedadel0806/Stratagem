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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { complianceApi, CreateRequirementData } from "@/lib/api/compliance"
import { useQuery } from "@tanstack/react-query"

const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
}

const requirementFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  requirementCode: z.string().optional(),
  category: z.string().optional(),
  complianceDeadline: z.string().optional(),
  applicability: z.string().optional(),
  frameworkId: z.string().min(1, "Framework is required"),
  status: z.enum(["not_started", "in_progress", "compliant", "non_compliant", "partially_compliant"]).optional(),
})

type RequirementFormValues = z.infer<typeof requirementFormSchema>

interface RequirementFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requirementId?: string
  initialData?: {
    title: string
    description?: string
    requirementCode?: string
    category?: string
    complianceDeadline?: string
    applicability?: string
    frameworkId: string
    status?: string
  }
}

export function RequirementForm({ open, onOpenChange, requirementId, initialData }: RequirementFormProps) {
  const queryClient = useQueryClient()
  const isEditMode = !!requirementId

  // Fetch frameworks for dropdown
  const { data: frameworks } = useQuery({
    queryKey: ["compliance-frameworks"],
    queryFn: () => complianceApi.getFrameworks(),
    enabled: open,
  })

  const form = useForm<RequirementFormValues>({
    resolver: zodResolver(requirementFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      requirementCode: "",
      category: "",
      complianceDeadline: "",
      applicability: "",
      frameworkId: "",
      status: "not_started",
    },
  })

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])

  const createMutation = useMutation({
    mutationFn: (data: CreateRequirementData) => complianceApi.createRequirement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance-requirements"] })
      queryClient.invalidateQueries({ queryKey: ["compliance-status"] })
      toast.success("Requirement created successfully")
      form.reset()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create requirement")
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: CreateRequirementData) => complianceApi.updateRequirement(requirementId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance-requirements"] })
      queryClient.invalidateQueries({ queryKey: ["compliance-status"] })
      toast.success("Requirement updated successfully")
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update requirement")
    },
  })

  const mutation = isEditMode ? updateMutation : createMutation

  const onSubmit = (values: RequirementFormValues) => {
    mutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Requirement" : "Create Requirement"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the requirement details." : "Add a new compliance requirement."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="frameworkId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Framework *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined} disabled={isEditMode}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {frameworks?.map((fw) => (
                        <SelectItem key={fw.id} value={fw.id}>
                          {fw.name} {fw.code && `(${fw.code})`}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Requirement title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirementCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirement Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., NCA-REQ-001" {...field} />
                  </FormControl>
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
                    <Textarea placeholder="Requirement description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Governance, Protection, Monitoring" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="complianceDeadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compliance Deadline</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., January 31 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicability</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., All entities, Cloud users" {...field} />
                  </FormControl>
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
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="compliant">Compliant</SelectItem>
                      <SelectItem value="partially_compliant">Partially Compliant</SelectItem>
                      <SelectItem value="non_compliant">Non Compliant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
                  ? "Update Requirement"
                  : "Create Requirement"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

