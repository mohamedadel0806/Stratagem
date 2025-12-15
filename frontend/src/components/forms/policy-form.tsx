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
import { policiesApi, CreatePolicyData } from "@/lib/api/policies"

// Simple toast implementation
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
}

const policyFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  policyType: z.enum([
    "security",
    "compliance",
    "operational",
    "it",
    "hr",
    "finance",
  ]),
  status: z.enum(["draft", "active", "under_review", "archived"]).optional(),
  version: z.string().optional(),
  effectiveDate: z.string().optional(),
  reviewDate: z.string().optional(),
})

type PolicyFormValues = z.infer<typeof policyFormSchema>

interface PolicyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  policyId?: string
  initialData?: {
    title: string
    description?: string
    policyType: string
    status?: string
    version?: string
    effectiveDate?: string
    reviewDate?: string
  }
}

export function PolicyForm({ open, onOpenChange, policyId, initialData }: PolicyFormProps) {
  const queryClient = useQueryClient()
  const isEditMode = !!policyId

  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      policyType: "compliance",
      status: "draft",
      version: "1.0",
      effectiveDate: "",
      reviewDate: "",
    },
  })

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])

  const createMutation = useMutation({
    mutationFn: (data: CreatePolicyData) => policiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] })
      toast.success("Policy created successfully")
      form.reset()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create policy")
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: CreatePolicyData) => policiesApi.update(policyId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] })
      queryClient.invalidateQueries({ queryKey: ["policy", policyId] })
      toast.success("Policy updated successfully")
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update policy")
    },
  })

  const mutation = isEditMode ? updateMutation : createMutation

  const onSubmit = (values: PolicyFormValues) => {
    const data = {
      title: values.title,
      description: values.description,
      policyType: values.policyType,
      status: values.status,
      version: values.version,
      effectiveDate: values.effectiveDate || undefined,
      reviewDate: values.reviewDate || undefined,
    }
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Policy" : "Create New Policy"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the policy details below."
              : "Add a new policy to the policy library. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Information Security Policy" {...field} />
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
                    <Textarea
                      placeholder="Describe the policy in detail..."
                      className="resize-none"
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
                name="policyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input placeholder="1.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="effectiveDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effective Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reviewDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  ? "Update Policy"
                  : "Create Policy"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

