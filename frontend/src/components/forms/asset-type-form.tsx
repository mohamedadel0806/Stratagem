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
import { assetTypesApi, AssetType } from "@/lib/api/assets"
import { useToast } from "@/hooks/use-toast"

const assetTypeFormSchema = z.object({
    category: z.enum(["physical", "information", "application", "software", "supplier"]),
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
})

type AssetTypeFormValues = z.infer<typeof assetTypeFormSchema>

interface AssetTypeFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    typeId?: string
    initialData?: AssetType
    onSuccess?: () => void
}

export function AssetTypeForm({
    open,
    onOpenChange,
    typeId,
    initialData,
    onSuccess,
}: AssetTypeFormProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const isEditMode = !!typeId

    const form = useForm<AssetTypeFormValues>({
        resolver: zodResolver(assetTypeFormSchema),
        defaultValues: initialData
            ? {
                category: initialData.category as any,
                name: initialData.name,
                description: initialData.description || "",
                isActive: initialData.isActive !== false,
            }
            : {
                category: "physical",
                name: "",
                description: "",
                isActive: true,
            },
    })

    React.useEffect(() => {
        if (initialData) {
            form.reset({
                category: initialData.category as any,
                name: initialData.name,
                description: initialData.description || "",
                isActive: initialData.isActive !== false,
            })
        } else {
            form.reset({
                category: "physical",
                name: "",
                description: "",
                isActive: true,
            })
        }
    }, [initialData, form, open])

    const createMutation = useMutation({
        mutationFn: (data: AssetTypeFormValues) => assetTypesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asset-types"] })
            toast({ title: "Success", description: "Asset type created successfully" })
            onOpenChange(false)
            onSuccess?.()
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to create asset type",
                variant: "destructive",
            })
        },
    })

    const updateMutation = useMutation({
        mutationFn: (data: AssetTypeFormValues) => assetTypesApi.update(typeId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asset-types"] })
            toast({ title: "Success", description: "Asset type updated successfully" })
            onOpenChange(false)
            onSuccess?.()
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update asset type",
                variant: "destructive",
            })
        },
    })

    const mutation = isEditMode ? updateMutation : createMutation

    const onSubmit = (values: AssetTypeFormValues) => {
        mutation.mutate(values)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Asset Type" : "Create Asset Type"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "Update the asset type details" : "Add a custom asset type for your organization"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="physical">Physical Asset</SelectItem>
                                            <SelectItem value="information">Information Asset</SelectItem>
                                            <SelectItem value="application">Business Application</SelectItem>
                                            <SelectItem value="software">Software Asset</SelectItem>
                                            <SelectItem value="supplier">Supplier</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Laptops, Cloud Storage" {...field} />
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
                                        <Textarea placeholder="Optional description..." rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Saving..." : isEditMode ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
