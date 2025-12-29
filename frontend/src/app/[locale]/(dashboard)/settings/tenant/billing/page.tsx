"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { tenantsApi, SubscriptionTier } from "@/lib/api/tenants"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Shield, Zap, Building2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format } from "date-fns"

export default function BillingPage() {
    const { data: session } = useSession()
    const tenantId = (session?.user as any)?.tenantId
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const { data: tenant, isLoading } = useQuery({
        queryKey: ['tenant-billing', tenantId],
        queryFn: () => tenantsApi.getById(tenantId),
        enabled: !!tenantId,
    })

    const upgradeMutation = useMutation({
        mutationFn: (tier: SubscriptionTier) => tenantsApi.update(tenantId, { subscriptionTier: tier } as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenant-billing', tenantId] })
            queryClient.invalidateQueries({ queryKey: ['tenant-trial-status', tenantId] })
            toast({
                title: "Subscription Updated",
                description: "Your organization has been successfully upgraded.",
            })
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Upgrade Failed",
                description: "There was an error upgrading your subscription. Please try again.",
            })
        }
    })

    if (isLoading || !tenant) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                <div className="grid gap-6 md:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="h-[400px] animate-pulse bg-muted/50" />
                    ))}
                </div>
            </div>
        )
    }

    const tiers = [
        {
            name: "Starter",
            id: "starter",
            price: "$0",
            description: "Perfect for exploring the platform",
            features: [
                "Up to 2 users",
                "Basic Risk Register",
                "Asset Inventory",
                "Community Support"
            ],
            icon: <Building2 className="h-5 w-5 text-muted-foreground" />,
            tier: "starter"
        },
        {
            name: "Professional",
            id: "professional",
            price: "$499/mo",
            description: "Complete GRC management for growing teams",
            features: [
                "Up to 10 users",
                "Advanced Risk Analysis",
                "Policy Lifecycle Management",
                "Audit Logging",
                "Priority Email Support"
            ],
            icon: <Zap className="h-5 w-5 text-primary" />,
            tier: "professional",
            recommended: true
        },
        {
            name: "Enterprise",
            id: "enterprise",
            price: "Custom",
            description: "Enterprise-grade security and scale",
            features: [
                "Unlimited Users",
                "Multi-Tenancy Support",
                "Custom Compliance Frameworks",
                "Single Sign-On (SSO)",
                "Dedicated Account Manager",
                "24/7 Phone Support"
            ],
            icon: <Shield className="h-5 w-5 text-indigo-500" />,
            tier: "enterprise"
        }
    ]

    const daysRemaining = tenant.trialEndsAt
        ? Math.max(0, Math.ceil((new Date(tenant.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : 0

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold">Billing & Subscription</h3>
                <p className="text-muted-foreground">
                    Manage your organization's subscription and usage.
                </p>
            </div>

            <Separator />

            <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Current Plan: <span className="capitalize text-primary">{tenant.subscriptionTier}</span></CardTitle>
                        {tenant.status === 'trial' && (
                            <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                                Free Trial
                            </Badge>
                        )}
                    </div>
                    <CardDescription>
                        {tenant.status === 'trial'
                            ? `Your trial period ends on ${format(new Date(tenant.trialEndsAt!), 'MMMM dd, yyyy')}.`
                            : "Upgrade your plan to unlock more features and higher limits."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {tenant.status === 'trial' && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>{daysRemaining} days remaining</span>
                                <span>14 days total</span>
                            </div>
                            <Progress value={(daysRemaining / 14) * 100} className="h-2" />
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                {tiers.map((t) => (
                    <Card key={t.id} className={`relative flex flex-col ${t.recommended ? 'border-primary ring-1 ring-primary' : ''}`}>
                        {t.recommended && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                                Recommended
                            </div>
                        )}
                        <CardHeader>
                            <div className="mb-2 flex items-center gap-2">
                                {t.icon}
                                <CardTitle className="text-xl">{t.name}</CardTitle>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold">{t.price}</span>
                                {t.tier !== 'enterprise' && t.tier !== 'starter' && <span className="text-muted-foreground text-sm">/month</span>}
                            </div>
                            <CardDescription className="min-h-[40px] mt-2">
                                {t.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2 text-sm">
                                {t.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={t.tier === tenant.subscriptionTier ? "outline" : "default"}
                                disabled={t.tier === tenant.subscriptionTier || upgradeMutation.isPending}
                                onClick={() => upgradeMutation.mutate(t.tier as any)}
                            >
                                {t.tier === tenant.subscriptionTier ? "Current Plan" : (t.tier === 'enterprise' ? "Contact Sales" : "Upgrade")}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Subscription Management</AlertTitle>
                <AlertDescription className="text-sm">
                    Changing your subscription will instantly grant access to new features.
                    Pro-rated charges will be applied to your next billing cycle.
                </AlertDescription>
            </Alert>
        </div>
    )
}
