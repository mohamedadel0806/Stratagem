"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { invitationsApi } from "@/lib/api/invitations"
import { UserRole } from "@/lib/api/users"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Mail, ShieldCheck, UserPlus } from "lucide-react"

const inviteSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.nativeEnum(UserRole),
})

type InviteFormValues = z.infer<typeof inviteSchema>

interface InviteUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const form = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            email: "",
            role: UserRole.USER,
        },
    })

    const inviteUser = useMutation({
        mutationFn: (values: InviteFormValues) =>
            invitationsApi.create(values.email, values.role),
        onSuccess: () => {
            toast({
                title: "Invitation sent",
                description: "The invitation link has been generated successfully.",
            })
            queryClient.invalidateQueries({ queryKey: ["invitations"] })
            onOpenChange(false)
            form.reset()
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to send invitation",
            })
        }
    })

    function onSubmit(values: InviteFormValues) {
        inviteUser.mutate(values)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Invite Team Member
                    </DialogTitle>
                    <DialogDescription>
                        Send an invitation link to a new member of your organization.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="colleague@company.com"
                                                className="pl-9"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organization Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={UserRole.USER}>
                                                <div className="flex items-center gap-2">
                                                    <span>User</span>
                                                    <span className="text-[10px] text-muted-foreground">(Standard access)</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value={UserRole.ADMIN}>
                                                <div className="flex items-center gap-2">
                                                    <span>Admin</span>
                                                    <span className="text-[10px] text-primary">(Manage organization)</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={inviteUser.isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={inviteUser.isPending}>
                                {inviteUser.isPending ? "Sending..." : "Send Invitation"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
