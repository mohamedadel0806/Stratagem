"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useQuery, useMutation } from "@tanstack/react-query"
import { invitationsApi } from "@/lib/api/invitations"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ShieldCheck, UserPlus, Loader2, CheckCircle2 } from "lucide-react"

const acceptSchema = z.object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type AcceptFormValues = z.infer<typeof acceptSchema>

export default function AcceptInvitationPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const token = params.token as string

    const { data: invitation, isLoading, error } = useQuery({
        queryKey: ["invitation", token],
        queryFn: () => invitationsApi.getByToken(token),
    })

    const form = useForm<AcceptFormValues>({
        resolver: zodResolver(acceptSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
        },
    })

    const acceptInvitation = useMutation({
        mutationFn: (values: AcceptFormValues) =>
            invitationsApi.accept(token, {
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
            }),
        onSuccess: () => {
            toast({
                title: "Welcome aboard!",
                description: "Your account has been created. You can now log in.",
            })
            router.push("/login")
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to accept invitation",
            })
        }
    })

    function onSubmit(values: AcceptFormValues) {
        acceptInvitation.mutate(values)
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !invitation) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="max-w-md w-full border-destructive/20">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-destructive">Invalid or Expired Link</CardTitle>
                        <CardDescription>
                            This invitation link is invalid, has expired, or has already been used.
                            Please contact your administrator for a new invitation.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button className="w-full" variant="outline" onClick={() => router.push("/login")}>
                            Go to Login
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserPlus className="h-6 w-6" />
                    </div>
                    <CardTitle>Join {invitation.tenant?.name || "Organization"}</CardTitle>
                    <CardDescription>
                        You've been invited to join <strong>{invitation.tenant?.name}</strong>.
                        Complete your profile to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-1">
                                <FormLabel className="text-xs text-muted-foreground">Email Address</FormLabel>
                                <Input value={invitation.email} disabled className="bg-muted/50" />
                            </div>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full mt-6"
                                disabled={acceptInvitation.isPending}
                            >
                                {acceptInvitation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Accept Invitation"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center border-t py-4">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        Secure invitation from {invitation.tenant?.name}
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
