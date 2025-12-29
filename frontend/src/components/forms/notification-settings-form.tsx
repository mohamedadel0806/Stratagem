"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { tenantsApi, NotificationSettings } from "@/lib/api/tenants"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { Loader2, Mail, Palette, Save, Send } from "lucide-react"

const smtpSchema = z.object({
    host: z.string().min(1, "SMTP Host is required"),
    port: z.coerce.number().min(1, "Port is required"),
    secure: z.boolean().default(false),
    auth: z.object({
        user: z.string().min(1, "Username is required"),
        pass: z.string().min(1, "Password is required"),
    }),
    fromEmail: z.string().email("Invalid email address"),
    fromName: z.string().min(1, "From Name is required"),
})

const brandingSchema = z.object({
    logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    companyName: z.string().optional(),
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").optional().or(z.literal("")),
    supportEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
    footerText: z.string().optional(),
})

const notificationSettingsSchema = z.object({
    smtpConfig: smtpSchema.optional(),
    notificationBranding: brandingSchema.optional(),
})

type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>

export function NotificationSettingsForm() {
    const { data: session } = useSession()
    const tenantId = (session?.user as any)?.tenantId
    const queryClient = useQueryClient()
    const [isTesting, setIsTesting] = React.useState(false)

    const { data: settings, isLoading } = useQuery({
        queryKey: ['notification-settings', tenantId],
        queryFn: () => tenantsApi.getNotificationSettings(tenantId),
        enabled: !!tenantId,
    })

    const form = useForm<NotificationSettingsValues>({
        resolver: zodResolver(notificationSettingsSchema),
        defaultValues: {
            smtpConfig: {
                host: "",
                port: 587,
                secure: false,
                auth: { user: "", pass: "" },
                fromEmail: "",
                fromName: "",
            },
            notificationBranding: {
                logoUrl: "",
                companyName: "",
                primaryColor: "#000000",
                supportEmail: "",
                footerText: "",
            },
        },
    })

    React.useEffect(() => {
        if (settings) {
            form.reset({
                smtpConfig: settings.smtpConfig || {
                    host: "",
                    port: 587,
                    secure: false,
                    auth: { user: "", pass: "" },
                    fromEmail: "",
                    fromName: "",
                },
                notificationBranding: settings.notificationBranding || {
                    logoUrl: "",
                    companyName: "",
                    primaryColor: "#000000",
                    supportEmail: "",
                    footerText: "",
                },
            })
        }
    }, [settings, form])

    const updateMutation = useMutation({
        mutationFn: (data: NotificationSettings) => tenantsApi.updateNotificationSettings(tenantId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notification-settings', tenantId] })
            alert("Notification settings updated successfully")
        },
    })

    const testMutation = useMutation({
        mutationFn: (data: NotificationSettings) => tenantsApi.testNotificationSettings(tenantId, data),
        onSuccess: (data) => {
            alert(data.message)
        },
        onError: (error: any) => {
            alert(error?.response?.data?.message || "Connection test failed")
        },
    })

    const onSave = async (values: NotificationSettingsValues) => {
        await updateMutation.mutateAsync(values as NotificationSettings)
    }

    const onTest = async () => {
        const values = form.getValues()
        if (!values.smtpConfig?.host) {
            alert("Please fill in SMTP configuration before testing")
            return
        }
        setIsTesting(true)
        try {
            await testMutation.mutateAsync(values as NotificationSettings)
        } finally {
            setIsTesting(false)
        }
    }

    if (isLoading) {
        return <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            {/* SMTP Configuration */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <div>
                            <CardTitle>SMTP Configuration</CardTitle>
                            <CardDescription>Configure your organization's outgoing mail server</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="smtp-host">Host</Label>
                            <Input id="smtp-host" placeholder="smtp.example.com" {...form.register("smtpConfig.host")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtp-port">Port</Label>
                            <Input id="smtp-port" type="number" placeholder="587" {...form.register("smtpConfig.port")} />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="smtp-secure"
                            checked={form.watch("smtpConfig.secure")}
                            onCheckedChange={(checked) => form.setValue("smtpConfig.secure", checked)}
                        />
                        <Label htmlFor="smtp-secure">Use SSL/TLS (Secure Connection)</Label>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="smtp-user">Username</Label>
                            <Input id="smtp-user" placeholder="username@example.com" {...form.register("smtpConfig.auth.user")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtp-pass">Password</Label>
                            <Input id="smtp-pass" type="password" placeholder="••••••••" {...form.register("smtpConfig.auth.pass")} />
                        </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="from-email">From Email Address</Label>
                            <Input id="from-email" placeholder="notifications@yourdomain.com" {...form.register("smtpConfig.fromEmail")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="from-name">From Name</Label>
                            <Input id="from-name" placeholder="Acme GRC Notifications" {...form.register("smtpConfig.fromName")} />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="mr-2"
                            onClick={onTest}
                            disabled={isTesting}
                        >
                            {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Test Connection
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Branding */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-purple-500" />
                        <div>
                            <CardTitle>Notification Branding</CardTitle>
                            <CardDescription>Customize the look and feel of outgoing emails</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input id="company-name" placeholder="Acme Corp" {...form.register("notificationBranding.companyName")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="primary-color">Primary Brand Color</Label>
                            <div className="flex gap-2">
                                <Input id="primary-color" placeholder="#000000" className="flex-1" {...form.register("notificationBranding.primaryColor")} />
                                <div
                                    className="w-10 h-10 border rounded shadow-sm"
                                    style={{ backgroundColor: form.watch("notificationBranding.primaryColor") || "#000000" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo-url">Logo URL</Label>
                        <Input id="logo-url" placeholder="https://example.com/logo.png" {...form.register("notificationBranding.logoUrl")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="support-email">Support Email Address</Label>
                        <Input id="support-email" placeholder="support@acme.com" {...form.register("notificationBranding.supportEmail")} />
                        <p className="text-sm text-muted-foreground">This email will be used as the "Reply-To" address and in the email footer.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="footer-text">Email Footer Text</Label>
                        <Input id="footer-text" placeholder="© 2024 Acme Corp. All rights reserved." {...form.register("notificationBranding.footerText")} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Notification Settings
                </Button>
            </div>
        </form>
    )
}
