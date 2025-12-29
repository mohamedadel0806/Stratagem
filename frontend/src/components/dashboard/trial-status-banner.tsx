"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { tenantsApi } from "@/lib/api/tenants"
import { AlertTriangle, ChevronRight, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { differenceInDays, isAfter } from "date-fns"

export function TrialStatusBanner() {
    const { data: session } = useSession()
    const tenantId = (session?.user as any)?.tenantId

    const { data: tenant, isLoading } = useQuery({
        queryKey: ['tenant-trial-status', tenantId],
        queryFn: () => tenantsApi.getById(tenantId),
        enabled: !!tenantId,
    })

    if (isLoading || !tenant || tenant.status !== 'trial') {
        return null
    }

    const now = new Date()
    const trialEndsAt = tenant.trialEndsAt ? new Date(tenant.trialEndsAt) : null
    const isExpired = trialEndsAt ? !isAfter(trialEndsAt, now) : false
    const daysRemaining = trialEndsAt ? differenceInDays(trialEndsAt, now) : 0

    if (isExpired) {
        return (
            <Alert variant="destructive" className="mb-4 animate-in fade-in slide-in-from-top-4">
                <AlertTriangle className="h-4 w-4" />
                <div className="flex w-full items-center justify-between gap-4">
                    <div>
                        <AlertTitle className="text-sm font-bold">Trial Expired</AlertTitle>
                        <AlertDescription className="text-xs">
                            Your trial period has ended. Access to critical management features is now restricted.
                            Please upgrade to a professional plan to continue.
                        </AlertDescription>
                    </div>
                    <Button variant="destructive" size="sm" asChild className="shrink-0 bg-white text-destructive hover:bg-white/90">
                        <Link href="/settings/tenant/billing">Upgrade Now</Link>
                    </Button>
                </div>
            </Alert>
        )
    }

    // Only show banner if 7 or fewer days remaining, or if always showing for trial
    return (
        <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4 md:flex-row dark:bg-primary/10">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Rocket className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-primary">Free Trial Active</h4>
                    <p className="text-xs text-muted-foreground">
                        You have <span className="font-bold text-primary">{daysRemaining} days</span> remaining in your professional trial.
                        Unlock permanent access to all features today.
                    </p>
                </div>
            </div>
            <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" asChild className="h-8 border-primary/20 hover:bg-primary/10 hover:text-primary">
                    <Link href="/settings/tenant">Account Settings</Link>
                </Button>
                <Button variant="default" size="sm" asChild className="h-8 bg-primary">
                    <Link href="/settings/tenant/billing" className="flex items-center">
                        Upgrade
                        <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
