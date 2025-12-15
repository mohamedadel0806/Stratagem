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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { complianceApi, CreateFrameworkData } from "@/lib/api/compliance"

const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
}

const frameworkFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().optional(),
  description: z.string().optional(),
  region: z.string().optional(),
})

type FrameworkFormValues = z.infer<typeof frameworkFormSchema>

interface FrameworkFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  frameworkId?: string
  initialData?: {
    name: string
    code?: string
    description?: string
    region?: string
  }
}

export function FrameworkForm({ open, onOpenChange, frameworkId, initialData }: FrameworkFormProps) {
  const queryClient = useQueryClient()
  const isEditMode = !!frameworkId

  const form = useForm<FrameworkFormValues>({
    resolver: zodResolver(frameworkFormSchema),
    defaultValues: initialData || {
      name: "",
      code: "",
      description: "",
      region: "",
    },
  })

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])

  const createMutation = useMutation({
    mutationFn: (data: CreateFrameworkData) => complianceApi.createFramework(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance-frameworks"] })
      queryClient.invalidateQueries({ queryKey: ["compliance-status"] })
      toast.success("Framework created successfully")
      form.reset()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create framework")
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: CreateFrameworkData) => complianceApi.updateFramework(frameworkId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance-frameworks"] })
      queryClient.invalidateQueries({ queryKey: ["compliance-status"] })
      toast.success("Framework updated successfully")
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update framework")
    },
  })

  const mutation = isEditMode ? updateMutation : createMutation

  const onSubmit = (values: FrameworkFormValues) => {
    mutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Framework" : "Create Framework"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the framework details." : "Add a new compliance framework."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Framework Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., NCA, SAMA, ADGM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., NCA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Saudi Arabia, UAE" {...field} />
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
                    <Textarea placeholder="Framework description..." {...field} />
                  </FormControl>
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
                  ? "Update Framework"
                  : "Create Framework"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

