"use client"

import { useSession } from "next-auth/react"
import { AuditLogViewer } from "@/components/audit/audit-log-viewer"
import { Skeleton } from "@/components/ui/skeleton"

export default function AuditLogsPage() {
    const { data: session, status } = useSession()
    const tenantId = (session?.user as any)?.tenantId

    if (status === "loading") {
        return (
            <div className="space-y-6 py-6">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        )
    }

    if (!tenantId) {
        return (
            <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">You must be logged in to view audit logs.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <AuditLogViewer tenantId={tenantId} />
        </div>
    )
}
