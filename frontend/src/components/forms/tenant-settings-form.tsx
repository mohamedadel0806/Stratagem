"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { tenantsApi, UpdateTenantData } from "@/lib/api/tenants"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { Users, HardDrive, Calendar, Building2, Shield, X, Globe, FileDown } from "lucide-react"

const tenantSettingsSchema = z.object({
    name: z.string().min(1, "Organization name is required"),
    industry: z.string().optional(),
    regulatoryScope: z.string().optional(),
    theme: z.enum(["light", "dark", "system"]),
    locale: z.string().min(2, "Locale is required"),
    custom_branding: z.boolean().default(false),
    allowedDomains: z.array(z.string().min(1)).default([]),
})

type TenantSettingsFormValues = z.infer<typeof tenantSettingsSchema>

export function TenantSettingsForm() {
    const { data: session, status } = useSession()
    const tenantId = (session?.user as any)?.tenantId

    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = React.useState(false)

    const { data: tenant, isLoading: isLoadingTenant } = useQuery({
        queryKey: ['tenant-settings', tenantId],
        queryFn: () => tenantsApi.getById(tenantId),
        enabled: !!tenantId,
        refetchOnWindowFocus: false,
    })

    const form = useForm<TenantSettingsFormValues>({
        resolver: zodResolver(tenantSettingsSchema),
        defaultValues: {
            name: "",
            industry: "",
            regulatoryScope: "",
            theme: "system",
            locale: "en-US",
            custom_branding: false,
            allowedDomains: [],
        },
    })

    // Reset form when tenant data is loaded
    React.useEffect(() => {
        if (tenant) {
            form.reset({
                name: tenant.name,
                industry: tenant.industry || "",
                regulatoryScope: tenant.regulatoryScope || "",
                theme: tenant.settings?.theme || "system",
                locale: tenant.settings?.locale || "en-US",
                custom_branding: tenant.settings?.custom_branding || false,
                allowedDomains: tenant.allowedDomains || [],
            })
        }
    }, [tenant, form])

    const updateTenantMutation = useMutation({
        mutationFn: (data: UpdateTenantData) => tenantsApi.update(tenantId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenant-settings', tenantId] })
            alert("Organization settings updated successfully")
        },
        onError: (error: any) => {
            alert(error?.response?.data?.message || "Failed to update settings")
        },
    })

    async function onSubmit(values: TenantSettingsFormValues) {
        if (!tenantId) return

        setIsLoading(true)
        try {
            const updateData: UpdateTenantData = {
                name: values.name,
                industry: values.industry,
                regulatoryScope: values.regulatoryScope,
                settings: {
                    ...tenant?.settings,
                    theme: values.theme,
                    locale: values.locale,
                    custom_branding: values.custom_branding,
                },
                allowedDomains: values.allowedDomains,
            }
            await updateTenantMutation.mutateAsync(updateData)
        } finally {
            setIsLoading(false)
        }
    }

    const [isExporting, setIsExporting] = React.useState(false)

    async function handleExport() {
        if (!tenantId) return
        setIsExporting(true)
        try {
            const data = await tenantsApi.exportData(tenantId)
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `stratagem-export-${tenant.code}-${new Date().toISOString().split('T')[0]}.json`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            alert("Failed to export data")
        } finally {
            setIsExporting(false)
        }
    }

    if (status === "loading") {
        return <div className="p-4">Loading session...</div>;
    }

    if (isLoadingTenant) {
        return <div className="flex items-center justify-center p-8">Loading settings...</div>
    }

    if (!tenantId) {
        return <div className="p-4 text-red-500">Error: Tenant ID not found in session. Status: {status}</div>
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 MB';
        const mb = bytes;
        if (mb < 1024) return `${mb.toFixed(2)} MB`;
        return `${(mb / 1024).toFixed(2)} GB`;
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const getSubscriptionBadge = (tier: string) => {
        const colors = {
            starter: 'bg-blue-100 text-blue-800',
            professional: 'bg-purple-100 text-purple-800',
            enterprise: 'bg-amber-100 text-amber-800',
        };
        return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    }

    const getStatusBadge = (status: string) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            trial: 'bg-blue-100 text-blue-800',
            suspended: 'bg-orange-100 text-orange-800',
            deleted: 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    }

    return (
        <div className="space-y-6">
            {/* Usage Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle>Organization Overview</CardTitle>
                    <CardDescription>
                        Current usage and subscription information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center space-x-4 rounded-lg border p-4">
                            <div className="rounded-full bg-blue-100 p-2">
                                <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <Badge className={getStatusBadge(tenant?.status || 'active')}>
                                    {tenant?.status?.toUpperCase() || 'ACTIVE'}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 rounded-lg border p-4">
                            <div className="rounded-full bg-purple-100 p-2">
                                <Shield className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Subscription</p>
                                <Badge className={getSubscriptionBadge(tenant?.subscriptionTier || 'starter')}>
                                    {tenant?.subscriptionTier?.toUpperCase() || 'STARTER'}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 rounded-lg border p-4">
                            <div className="rounded-full bg-green-100 p-2">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Users</p>
                                <p className="text-2xl font-bold">{tenant?.userCount || 0}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 rounded-lg border p-4">
                            <div className="rounded-full bg-amber-100 p-2">
                                <HardDrive className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                                <p className="text-2xl font-bold">{formatBytes(tenant?.storageUsedMB || 0)}</p>
                            </div>
                        </div>
                    </div>

                    {tenant?.lastActivityAt && (
                        <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Last activity: {formatDate(tenant.lastActivityAt)}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Settings Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Organization Settings</CardTitle>
                    <CardDescription>
                        Manage your organization's information and preferences
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Organization Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Organization Information</h3>
                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Organization Name *</Label>
                                    <Input
                                        id="name"
                                        data-testid="tenant-name-input"
                                        placeholder="Acme Corporation"
                                        disabled={isLoading}
                                        {...form.register("name")}
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input
                                        id="industry"
                                        placeholder="e.g., Financial Services, Healthcare"
                                        disabled={isLoading}
                                        {...form.register("industry")}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="regulatoryScope">Regulatory Scope</Label>
                                <Textarea
                                    id="regulatoryScope"
                                    placeholder="e.g., GDPR, SOC 2, ISO 27001, HIPAA"
                                    disabled={isLoading}
                                    rows={2}
                                    {...form.register("regulatoryScope")}
                                />
                                <p className="text-sm text-muted-foreground">
                                    List the regulatory frameworks and compliance standards your organization follows
                                </p>
                            </div>
                        </div>

                        {/* Appearance & Localization */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Appearance & Localization</h3>
                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="theme">Theme</Label>
                                    <Select
                                        onValueChange={(value) => form.setValue("theme", value as any)}
                                        defaultValue={form.watch("theme")}
                                        value={form.watch("theme")}
                                    >
                                        <SelectTrigger data-testid="tenant-theme-select">
                                            <SelectValue placeholder="Select theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="locale">Language</Label>
                                    <Select
                                        onValueChange={(value) => form.setValue("locale", value)}
                                        defaultValue={form.watch("locale")}
                                        value={form.watch("locale")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en-US">English (US)</SelectItem>
                                            <SelectItem value="en-GB">English (UK)</SelectItem>
                                            <SelectItem value="ar-SA">Arabic (Saudi Arabia)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="custom_branding"
                                    data-testid="tenant-branding-checkbox"
                                    checked={form.watch("custom_branding")}
                                    onCheckedChange={(checked) => form.setValue("custom_branding", checked as boolean)}
                                />
                                <Label htmlFor="custom_branding" className="cursor-pointer">
                                    Enable Custom Branding
                                </Label>
                            </div>
                        </div>

                        {/* Security & Access */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Security & Access</h3>
                            <Separator />

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Allowed Email Domains</Label>
                                    <div className="flex flex-wrap gap-2 mb-2 p-2 min-h-[40px] border rounded-md bg-muted/20">
                                        {form.watch("allowedDomains").length === 0 && (
                                            <span className="text-sm text-muted-foreground italic px-2 py-1">No domains specified</span>
                                        )}
                                        {form.watch("allowedDomains").map((domain, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                {domain}
                                                <X
                                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                    onClick={() => {
                                                        const currentOptions = form.getValues("allowedDomains");
                                                        form.setValue("allowedDomains", currentOptions.filter((_, i) => i !== index));
                                                    }}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            id="new-domain"
                                            placeholder="e.g., example.com"
                                            data-testid="domain-input"
                                            className="max-w-xs"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const input = e.currentTarget;
                                                    const val = input.value.trim().toLowerCase();
                                                    if (val && !form.getValues("allowedDomains").includes(val)) {
                                                        form.setValue("allowedDomains", [...form.getValues("allowedDomains"), val]);
                                                        input.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                const input = document.getElementById('new-domain') as HTMLInputElement;
                                                const val = input.value.trim().toLowerCase();
                                                if (val && !form.getValues("allowedDomains").includes(val)) {
                                                    form.setValue("allowedDomains", [...form.getValues("allowedDomains"), val]);
                                                    input.value = '';
                                                }
                                            }}
                                        >
                                            Add Domain
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        New users signing up with an email from these domains will be automatically assigned to your organization.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading} data-testid="tenant-save-button">
                                {isLoading && <span className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            {/* Data Management */}
            <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive">Data Management</CardTitle>
                    <CardDescription>
                        Export organization data for backup or portability (GDPR compliance)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Export All Data</p>
                            <p className="text-sm text-muted-foreground">
                                Download a JSON file containing all your organization's assets, policies, risks, and audit logs.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            disabled={isExporting}
                            onClick={handleExport}
                            className="shrink-0"
                        >
                            {isExporting ? <span className="mr-2 h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full" /> : <FileDown className="mr-2 h-4 w-4" />}
                            Export JSON
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
