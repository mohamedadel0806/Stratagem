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
import { governanceApi, ControlDomain } from "@/lib/api/governance"
import { useToast } from "@/hooks/use-toast"

const controlDomainFormSchema = z.object({
    name: z.string().min(1, "Name is required").max(200, "Name must be less than 200 characters"),
    code: z.string().optional(),
    description: z.string().optional(),
    parent_id: z.string().optional(),
    display_order: z.number().int().default(0),
    is_active: z.boolean().default(true),
})

type ControlDomainFormValues = z.infer<typeof controlDomainFormSchema>

interface ControlDomainFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    domainId?: string
    initialData?: ControlDomain
    parentOptions?: ControlDomain[]
    onSuccess?: () => void
}

export function ControlDomainForm({
    open,
    onOpenChange,
    domainId,
    initialData,
    parentOptions = [],
    onSuccess,
}: ControlDomainFormProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const isEditMode = !!domainId

    const form = useForm<ControlDomainFormValues>({
        resolver: zodResolver(controlDomainFormSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                code: initialData.code || "",
                description: initialData.description || "",
                parent_id: initialData.parent_id || "",
                display_order: initialData.display_order || 0,
                is_active: initialData.is_active ?? true,
            }
            : {
                name: "",
                code: "",
                description: "",
                parent_id: "",
                display_order: 0,
                is_active: true,
            },
    })

    React.useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                code: initialData.code || "",
                description: initialData.description || "",
                parent_id: initialData.parent_id || "",
                display_order: initialData.display_order || 0,
                is_active: initialData.is_active ?? true,
            })
        } else {
            form.reset({
                name: "",
                code: "",
                description: "",
                parent_id: "",
                display_order: 0,
                is_active: true,
            })
        }
    }, [initialData, form, open])

    const createMutation = useMutation({
        mutationFn: (data: ControlDomainFormValues) => {
            const payload: any = { ...data };
            if (payload.parent_id === "none" || !payload.parent_id) {
                delete payload.parent_id;
            }
            return governanceApi.createDomain(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["control-domains"] })
            toast({ title: "Success", description: "Control domain created successfully" })
            onOpenChange(false)
            onSuccess?.()
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to create control domain",
                variant: "destructive",
            })
        },
    })

    const updateMutation = useMutation({
        mutationFn: (data: ControlDomainFormValues) => {
            const payload: any = { ...data };
            if (payload.parent_id === "none" || !payload.parent_id) {
                payload.parent_id = null;
            }
            return governanceApi.updateDomain(domainId!, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["control-domains"] })
            toast({ title: "Success", description: "Control domain updated successfully" })
            onOpenChange(false)
            onSuccess?.()
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update control domain",
                variant: "destructive",
            })
        },
    })

    const onSubmit = (values: ControlDomainFormValues) => {
        if (isEditMode) {
            updateMutation.mutate(values)
        } else {
            createMutation.mutate(values)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Control Domain" : "Create Control Domain"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "Update the control domain details" : "Add a new control domain to your library"}
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
                                        <Input placeholder="e.g., Access Control, Asset Management" {...field} />
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
                                        <Input placeholder="e.g., AC, AM" {...field} />
                                    </FormControl>
                                    <FormDescription>Short code for this domain</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="parent_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parent Domain</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="None (top level)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">None (top level)</SelectItem>
                                            {parentOptions.filter(d => d.id !== domainId).map((domain) => (
                                                <SelectItem key={domain.id} value={domain.id}>
                                                    {domain.name}
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
                                        <Textarea placeholder="Optional description..." rows={3} {...field} />
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
