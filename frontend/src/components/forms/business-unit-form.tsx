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
import { businessUnitsApi, BusinessUnit } from "@/lib/api/business-units"
import { useToast } from "@/hooks/use-toast"

const businessUnitFormSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    code: z.string().optional(),
    description: z.string().optional(),
    parentId: z.string().optional(),
})

type BusinessUnitFormValues = z.infer<typeof businessUnitFormSchema>

interface BusinessUnitFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    unitId?: string
    initialData?: BusinessUnit
    parentOptions?: BusinessUnit[]
    onSuccess?: () => void
}

export function BusinessUnitForm({
    open,
    onOpenChange,
    unitId,
    initialData,
    parentOptions = [],
    onSuccess,
}: BusinessUnitFormProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const isEditMode = !!unitId

    const form = useForm<BusinessUnitFormValues>({
        resolver: zodResolver(businessUnitFormSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                code: initialData.code || "",
                description: initialData.description || "",
                parentId: initialData.parentId || "",
            }
            : {
                name: "",
                code: "",
                description: "",
                parentId: "",
            },
    })

    React.useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                code: initialData.code || "",
                description: initialData.description || "",
                parentId: initialData.parentId || "",
            })
        } else {
            form.reset({
                name: "",
                code: "",
                description: "",
                parentId: "",
            })
        }
    }, [initialData, form, open])

    const createMutation = useMutation({
        mutationFn: (data: BusinessUnitFormValues) => {
            const payload: any = { ...data };
            if (payload.parentId === "none" || !payload.parentId) {
                delete payload.parentId;
            }
            return businessUnitsApi.create(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-units"] })
            toast({ title: "Success", description: "Business unit created successfully" })
            onOpenChange(false)
            onSuccess?.()
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to create business unit",
                variant: "destructive",
            })
        },
    })

    const updateMutation = useMutation({
        mutationFn: (data: BusinessUnitFormValues) => {
            const payload: any = { ...data };
            if (payload.parentId === "none" || !payload.parentId) {
                payload.parentId = null;
            }
            return businessUnitsApi.update(unitId!, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-units"] })
            toast({ title: "Success", description: "Business unit updated successfully" })
            onOpenChange(false)
            onSuccess?.()
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update business unit",
                variant: "destructive",
            })
        },
    })

    const onSubmit = (values: BusinessUnitFormValues) => {
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
                    <DialogTitle>{isEditMode ? "Edit Business Unit" : "Create Business Unit"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "Update the business unit details" : "Add a new business unit to your organization"}
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
                                        <Input placeholder="e.g., Engineering, Marketing" {...field} />
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
                                        <Input placeholder="e.g., ENG, MKT" {...field} />
                                    </FormControl>
                                    <FormDescription>Optional shorthand code</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="parentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parent Unit</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="None (top level)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">None (top level)</SelectItem>
                                            {parentOptions.filter(u => u.id !== unitId).map((unit) => (
                                                <SelectItem key={unit.id} value={unit.id}>
                                                    {unit.name}
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
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Saving..." : isEditMode ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
