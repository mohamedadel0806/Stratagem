"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Building2, User, Settings, FileCheck, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { useRouter } from "next/navigation"

const onboardingSchema = z.object({
    // Step 1: Organization Details
    tenantName: z.string().min(2, "Organization name must be at least 2 characters"),
    tenantCode: z.string().min(2, "Organization code must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Code must be lowercase letters, numbers, and hyphens only"),
    industry: z.string().optional(),
    regulatoryScope: z.string().optional(),
    subscriptionTier: z.enum(["starter", "professional", "enterprise"]).default("starter"),

    // Step 2: Admin User
    adminEmail: z.string().email("Invalid email address"),
    adminFirstName: z.string().min(2, "First name must be at least 2 characters"),
    adminLastName: z.string().min(2, "Last name must be at least 2 characters"),
    initialBusinessUnitName: z.string().optional(),

    // Step 3: Settings
    theme: z.enum(["light", "dark", "system"]).default("system"),
    locale: z.string().default("en-US"),
    customBranding: z.boolean().default(false),
})

type OnboardingFormValues = z.infer<typeof onboardingSchema>

const STEPS = [
    { id: 1, name: "Organization", icon: Building2 },
    { id: 2, name: "Admin User", icon: User },
    { id: 3, name: "Settings", icon: Settings },
    { id: 4, name: "Review", icon: FileCheck },
]

export function TenantOnboardingWizard() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = React.useState(1)
    const [direction, setDirection] = React.useState(0)
    const [isValidating, setIsValidating] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [createdTenant, setCreatedTenant] = React.useState<any>(null)

    const form = useForm<OnboardingFormValues>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            tenantName: "",
            tenantCode: "",
            industry: "",
            regulatoryScope: "",
            subscriptionTier: "starter",
            adminEmail: "",
            adminFirstName: "",
            adminLastName: "",
            initialBusinessUnitName: "",
            theme: "system",
            locale: "en-US",
            customBranding: false,
        },
    })

    // Auto-generate tenant code from name
    const watchTenantName = form.watch("tenantName")
    React.useEffect(() => {
        if (watchTenantName && !form.getValues("tenantCode")) {
            const code = watchTenantName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            form.setValue("tenantCode", code)
        }
    }, [watchTenantName, form])

    const nextStep = async () => {
        setIsValidating(true)
        const fieldsToValidate = getFieldsForStep(currentStep)
        const isValid = await form.trigger(fieldsToValidate as any)
        setIsValidating(false)

        if (isValid) {
            setDirection(1)
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
        }
    }

    const prevStep = () => {
        setDirection(-1)
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    const onSubmit = async (values: OnboardingFormValues) => {
        setIsSubmitting(true)
        try {
            const response = await apiClient.post('/tenants', {
                tenantName: values.tenantName,
                tenantCode: values.tenantCode,
                industry: values.industry,
                regulatoryScope: values.regulatoryScope,
                subscriptionTier: values.subscriptionTier,
                adminEmail: values.adminEmail,
                adminFirstName: values.adminFirstName,
                adminLastName: values.adminLastName,
                initialBusinessUnitName: values.initialBusinessUnitName || "Main Business Unit",
                settings: {
                    theme: values.theme,
                    locale: values.locale,
                    custom_branding: values.customBranding,
                },
            })

            setCreatedTenant(response.data)
            setCurrentStep(5) // Success step
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to create organization")
        } finally {
            setIsSubmitting(false)
        }
    }

    const getFieldsForStep = (step: number): string[] => {
        switch (step) {
            case 1:
                return ["tenantName", "tenantCode", "industry", "regulatoryScope", "subscriptionTier"]
            case 2:
                return ["adminEmail", "adminFirstName", "adminLastName"]
            case 3:
                return ["theme", "locale"]
            default:
                return []
        }
    }

    const progress = (currentStep / STEPS.length) * 100

    if (currentStep === 5 && createdTenant) {
        return (
            <Card className="mx-auto max-w-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Organization Created Successfully!</CardTitle>
                    <CardDescription>
                        Your organization has been set up and is ready to use
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <p className="text-sm font-medium">Organization Details:</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Name: {createdTenant.tenant?.name}</li>
                            <li>• Code: {createdTenant.tenant?.code}</li>
                            <li>• Admin Email: {createdTenant.adminUser?.email}</li>
                        </ul>
                    </div>

                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm font-medium text-amber-900">📧 Invitation Email Sent</p>
                        <p className="mt-1 text-sm text-amber-700">
                            A temporary password has been sent to {createdTenant.adminUser?.email}.
                            The admin can use it to log in and set a new password.
                        </p>
                    </div>

                    <Button
                        onClick={() => router.push('/admin/tenants')}
                        className="w-full"
                    >
                        View All Organizations
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="mx-auto max-w-4xl">
            <CardHeader>
                <CardTitle>Create New Organization</CardTitle>
                <CardDescription>
                    Set up a new organization in {STEPS.length} simple steps
                </CardDescription>
                <div className="mt-4">
                    <Progress value={progress} className="h-2" />
                    <div className="mt-2 flex justify-between">
                        {STEPS.map((step) => {
                            const Icon = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = currentStep > step.id
                            return (
                                <div
                                    key={step.id}
                                    className={`flex flex-col items-center ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                                        }`}
                                >
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${isActive ? 'border-primary bg-primary/10' : isCompleted ? 'border-green-600 bg-green-50' : 'border-muted'
                                        }`}>
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-5 w-5" />
                                        ) : (
                                            <Icon className="h-5 w-5" />
                                        )}
                                    </div>
                                    <span className="mt-1 text-xs font-medium">{step.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            initial={{
                                x: direction > 0 ? 20 : -20,
                                opacity: 0
                            }}
                            animate={{
                                x: 0,
                                opacity: 1
                            }}
                            exit={{
                                x: direction < 0 ? 20 : -20,
                                opacity: 0
                            }}
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                        >
                            {/* Step 1: Organization Details */}
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Organization Information</h3>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="tenantName">Organization Name *</Label>
                                            <Input
                                                id="tenantName"
                                                placeholder="Acme Corporation"
                                                {...form.register("tenantName")}
                                            />
                                            {form.formState.errors.tenantName && (
                                                <p className="text-sm text-red-500">{form.formState.errors.tenantName.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tenantCode">Organization Code *</Label>
                                            <Input
                                                id="tenantCode"
                                                placeholder="acme-corp"
                                                {...form.register("tenantCode")}
                                            />
                                            {form.formState.errors.tenantCode && (
                                                <p className="text-sm text-red-500">{form.formState.errors.tenantCode.message}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground">Lowercase letters, numbers, and hyphens only</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="industry">Industry</Label>
                                            <Input
                                                id="industry"
                                                placeholder="e.g., Financial Services"
                                                {...form.register("industry")}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subscriptionTier">Subscription Tier *</Label>
                                            <Select
                                                onValueChange={(value) => form.setValue("subscriptionTier", value as any)}
                                                defaultValue={form.watch("subscriptionTier")}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="starter">Starter</SelectItem>
                                                    <SelectItem value="professional">Professional</SelectItem>
                                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="regulatoryScope">Regulatory Scope</Label>
                                        <Textarea
                                            id="regulatoryScope"
                                            placeholder="e.g., GDPR, SOC 2, ISO 27001"
                                            rows={2}
                                            {...form.register("regulatoryScope")}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Admin User */}
                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Administrator Account</h3>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="adminFirstName">First Name *</Label>
                                            <Input
                                                id="adminFirstName"
                                                placeholder="John"
                                                {...form.register("adminFirstName")}
                                            />
                                            {form.formState.errors.adminFirstName && (
                                                <p className="text-sm text-red-500">{form.formState.errors.adminFirstName.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="adminLastName">Last Name *</Label>
                                            <Input
                                                id="adminLastName"
                                                placeholder="Doe"
                                                {...form.register("adminLastName")}
                                            />
                                            {form.formState.errors.adminLastName && (
                                                <p className="text-sm text-red-500">{form.formState.errors.adminLastName.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="adminEmail">Email Address *</Label>
                                        <Input
                                            id="adminEmail"
                                            type="email"
                                            placeholder="admin@acme.com"
                                            {...form.register("adminEmail")}
                                        />
                                        {form.formState.errors.adminEmail && (
                                            <p className="text-sm text-red-500">{form.formState.errors.adminEmail.message}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            A temporary password will be sent to this email
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="initialBusinessUnitName">Initial Business Unit Name</Label>
                                        <Input
                                            id="initialBusinessUnitName"
                                            placeholder="Main Business Unit"
                                            {...form.register("initialBusinessUnitName")}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Settings */}
                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Preferences</h3>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="theme">Theme</Label>
                                            <Select
                                                onValueChange={(value) => form.setValue("theme", value as any)}
                                                defaultValue={form.watch("theme")}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
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
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
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
                                            id="customBranding"
                                            checked={form.watch("customBranding")}
                                            onCheckedChange={(checked) => form.setValue("customBranding", checked as boolean)}
                                        />
                                        <Label htmlFor="customBranding" className="cursor-pointer">
                                            Enable Custom Branding
                                        </Label>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Review */}
                            {currentStep === 4 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Review & Confirm</h3>

                                    <div className="space-y-4 rounded-lg border p-4">
                                        <div>
                                            <h4 className="font-medium">Organization</h4>
                                            <dl className="mt-2 space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">Name:</dt>
                                                    <dd className="font-medium">{form.watch("tenantName")}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">Code:</dt>
                                                    <dd className="font-medium">{form.watch("tenantCode")}</dd>
                                                </div>
                                                {form.watch("industry") && (
                                                    <div className="flex justify-between">
                                                        <dt className="text-muted-foreground">Industry:</dt>
                                                        <dd className="font-medium">{form.watch("industry")}</dd>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">Subscription:</dt>
                                                    <dd className="font-medium capitalize">{form.watch("subscriptionTier")}</dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div>
                                            <h4 className="font-medium">Administrator</h4>
                                            <dl className="mt-2 space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">Name:</dt>
                                                    <dd className="font-medium">{form.watch("adminFirstName")} {form.watch("adminLastName")}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">Email:</dt>
                                                    <dd className="font-medium">{form.watch("adminEmail")}</dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div>
                                            <h4 className="font-medium">Settings</h4>
                                            <dl className="mt-2 space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">Theme:</dt>
                                                    <dd className="font-medium capitalize">{form.watch("theme")}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">Language:</dt>
                                                    <dd className="font-medium">{form.watch("locale")}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">Custom Branding:</dt>
                                                    <dd className="font-medium">{form.watch("customBranding") ? "Enabled" : "Disabled"}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1 || isSubmitting || isValidating}
                        >
                            Previous
                        </Button>

                        {currentStep < 4 ? (
                            <Button type="button" onClick={nextStep} disabled={isValidating}>
                                {isValidating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Next
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Organization
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
