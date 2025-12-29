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
import { governanceApi, Standard, StandardStatus } from "@/lib/api/governance"
import { useToast } from "@/hooks/use-toast"

const standardFormSchema = z.object({
    standard_identifier: z.string().min(1, "Identifier is required"),
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    description: z.string().optional(),
    content: z.string().optional(),
    scope: z.string().optional(),
    applicability: z.string().optional(),
    version: z.string().optional(),
    status: z.nativeEnum(StandardStatus).default(StandardStatus.DRAFT),
})

type StandardFormValues = z.infer<typeof standardFormSchema>

interface StandardFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    standardId?: string
    initialData?: Standard
    onSuccess?: () => void
}

export function StandardForm({
    open,
    onOpenChange,
    standardId,
    initialData,
    onSuccess,
}: StandardFormProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const isEditMode = !!standardId

    const form = useForm<StandardFormValues>({
        resolver: zodResolver(standardFormSchema),
        defaultValues: initialData
            ? {
                standard_identifier: initialData.standard_identifier,
                title: initialData.title,
                description: initialData.description || "",
                content: initialData.content || "",
                scope: initialData.scope || "",
                applicability: initialData.applicability || "",
                version: initialData.version || "",
                status: initialData.status as StandardStatus,
            }
            : {
                standard_identifier: "",
                title: "",
                description: "",
                content: "",
                scope: "",
                applicability: "",
                version: "1.0",
                status: StandardStatus.DRAFT,
            },
    })

    React.useEffect(() => {
        if (initialData) {
            form.reset({
                standard_identifier: initialData.standard_identifier,
                title: initialData.title,
                description: initialData.description || "",
                content: initialData.content || "",
                scope: initialData.scope || "",
                applicability: initialData.applicability || "",
                version: initialData.version || "",
                status: initialData.status as StandardStatus,
            })
        } else {
            form.reset({
                standard_identifier: "",
                title: "",
                description: "",
                content: "",
                scope: "",
                applicability: "",
                version: "1.0",
                status: StandardStatus.DRAFT,
            })
        }
    }, [initialData, form, open])

    const createMutation = useMutation({
        mutationFn: (data: StandardFormValues) => {
            return governanceApi.createStandard(data as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["standards"] })
            toast({ title: "Success", description: "Standard created successfully" })
            onOpenChange(false)
            onSuccess?.()
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to create standard",
                variant: "destructive",
            })
        },
    })

    const updateMutation = useMutation({
        mutationFn: (data: StandardFormValues) => {
            return governanceApi.updateStandard(standardId!, data as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["standards"] })
            toast({ title: "Success", description: "Standard updated successfully" })
            onOpenChange(false)
            onSuccess?.()
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update standard",
                variant: "destructive",
            })
        },
    })

    const onSubmit = (values: StandardFormValues) => {
        if (isEditMode) {
            updateMutation.mutate(values)
        } else {
            createMutation.mutate(values)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Standard" : "Create Standard"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "Update the standard details" : "Add a new standard to your library"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="standard_identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Identifier *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., ISO-27001-A.5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="version"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Version</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 2022" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Information Security Policy" {...field} />
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
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(StandardStatus).map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Optional description..." rows={2} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Detailed standard requirements..." rows={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : isEditMode ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
