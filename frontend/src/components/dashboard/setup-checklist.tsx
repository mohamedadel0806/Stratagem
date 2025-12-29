"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { tenantsApi } from "@/lib/api/tenants"
import {
    CheckCircle2,
    Circle,
    ChevronRight,
    Plus,
    Building2,
    Shield,
    FileText,
    Users,
    ArrowRight,
    MoreHorizontal,
    Bell,
    ListTree,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { FrameworkSelector } from "../onboarding/framework-selector"

interface OnboardingStep {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    link: string
    required: boolean
}

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: "profile",
        title: "Complete Organization Profile",
        description: "Tell us about your industry and regulatory landscape.",
        icon: <Building2 className="h-5 w-5" />,
        link: "/settings/tenant",
        required: true,
    },
    {
        id: "framework",
        title: "Select Compliance Framework",
        description: "Choose the standards you need to follow (ISO, NIST, etc.).",
        icon: <Shield className="h-5 w-5" />,
        link: "/settings/tenant", // Will eventually be a specific wizard
        required: true,
    },
    {
        id: "assets",
        title: "Add Your First Asset",
        description: "Catalog your physical or information assets.",
        icon: <Plus className="h-5 w-5" />,
        link: "/dashboard/assets/all",
        required: false,
    },
    {
        id: "policy",
        title: "Upload a Policy",
        description: "Start managing your governance documents.",
        icon: <FileText className="h-5 w-5" />,
        link: "/dashboard/governance/policies",
        required: false,
    },
    {
        id: "users",
        title: "Invite Your Team",
        description: "Collaborate with your colleagues on GRC tasks.",
        icon: <Users className="h-5 w-5" />,
        link: "/settings/users",
        required: false,
    },
    {
        id: "notifications",
        title: "Configure Notifications",
        description: "Set up SMTP and branded email templates.",
        icon: <Bell className="h-5 w-5" />,
        link: "/settings/tenant",
        required: false,
    },
    {
        id: "lookups",
        title: "Add Lookups",
        description: "Categorize your assets and risks with custom values.",
        icon: <ListTree className="h-5 w-5" />,
        link: "/settings/tenant",
        required: false,
    },
    {
        id: "integrations",
        title: "Connect Integrations",
        description: "Sync data with external CMDB and REST APIs.",
        icon: <Zap className="h-5 w-5" />,
        link: "/settings/tenant",
        required: false,
    },
]

export function SetupChecklist() {
    const { data: session } = useSession()
    const tenantId = (session?.user as any)?.tenantId
    const queryClient = useQueryClient()
    const [frameworkDialogOpen, setFrameworkDialogOpen] = React.useState(false)

    const { data: tenant, isLoading } = useQuery({
        queryKey: ['tenant-onboarding', tenantId],
        queryFn: () => tenantsApi.getById(tenantId),
        enabled: !!tenantId,
    })

    const updateProgress = useMutation({
        mutationFn: (data: { completed?: string; skipped?: string }) =>
            tenantsApi.updateOnboardingProgress(tenantId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenant-onboarding', tenantId] })
        }
    })

    if (isLoading || !tenant) return null

    const progress = tenant.onboardingProgress || { completed: [], skipped: [] }
    const completedSteps = progress.completed || []
    const skippedSteps = progress.skipped || []

    const activeSteps = ONBOARDING_STEPS.filter(s => !completedSteps.includes(s.id) && !skippedSteps.includes(s.id))

    // Don't show if all required steps are done and most optional too, 
    // or if explicitly dismissed (could add a dismiss logic)
    const requiredCompleted = ONBOARDING_STEPS.filter(s => s.required && completedSteps.includes(s.id)).length
    const totalRequired = ONBOARDING_STEPS.filter(s => s.required).length

    if (requiredCompleted === totalRequired && activeSteps.length === 0) return null

    const percentComplete = Math.round((completedSteps.length / ONBOARDING_STEPS.length) * 100)

    return (
        <>
            <Card className="mb-8 border-primary/20 bg-primary/[0.02] dark:bg-primary/[0.05]">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-xl sm:text-2xl font-bold">Getting Started</CardTitle>
                            <CardDescription className="text-sm mt-1">
                                Complete these steps to get the most out of {tenant.name}.
                            </CardDescription>
                        </div>
                        <div className="flex w-full flex-col gap-2 sm:w-64">
                            <div className="flex justify-between text-xs font-medium">
                                <span>Overall Progress</span>
                                <span>{percentComplete}%</span>
                            </div>
                            <Progress value={percentComplete} className="h-2 transition-all duration-500 ease-out" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {ONBOARDING_STEPS.map((step) => {
                        const isCompleted = completedSteps.includes(step.id)
                        const isSkipped = skippedSteps.includes(step.id)

                        if (isCompleted || isSkipped) return null

                        return (
                            <div
                                key={step.id}
                                className="group relative flex flex-col justify-between rounded-lg border bg-background p-5 min-h-[180px] transition-all hover:border-primary/50 hover:shadow-md"
                            >
                                <div className="mb-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            {step.icon}
                                        </div>
                                        {step.required && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">
                                                Required
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="font-semibold leading-tight">{step.title}</h4>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {step.id === 'framework' ? (
                                        <Button size="sm" onClick={() => setFrameworkDialogOpen(true)} className="h-9 flex-1">
                                            Start Selection
                                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                        </Button>
                                    ) : (
                                        <Button size="sm" asChild className="h-9 flex-1">
                                            <Link href={step.link}>
                                                Get Started
                                                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                            </Link>
                                        </Button>
                                    )}
                                    {!step.required && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 px-3 text-sm min-w-[60px]"
                                            onClick={() => updateProgress.mutate({ skipped: step.id })}
                                        >
                                            Skip
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
            <FrameworkSelector open={frameworkDialogOpen} onOpenChange={setFrameworkDialogOpen} />
        </>
    )
}
