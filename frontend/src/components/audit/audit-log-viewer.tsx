"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { auditLogsApi, AuditLogAction } from "@/lib/api/audit-logs"
import { AuditLogTable } from "@/components/audit/audit-log-table"
import { AuditLogFilters } from "@/components/audit/audit-log-filters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, AlertCircle } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AuditLogViewerProps {
    tenantId: string
}

export function AuditLogViewer({ tenantId }: AuditLogViewerProps) {
    const [search, setSearch] = React.useState("")
    const [action, setAction] = React.useState<AuditLogAction | "">("")
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
    const [limit] = React.useState(50)
    const [offset] = React.useState(0)

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['audit-logs', tenantId, search, action, dateRange?.from, dateRange?.to],
        queryFn: () => auditLogsApi.getLogs(tenantId, {
            limit,
            offset,
            action: action === "" ? undefined : (action as AuditLogAction),
            startDate: dateRange?.from?.toISOString(),
            endDate: dateRange?.to?.toISOString(),
        }),
        enabled: !!tenantId,
    })

    const exportCsv = () => {
        if (!data?.logs) return

        const headers = ["Time", "User", "Action", "Description", "IP Address"]
        const rows = data.logs.map(log => [
            new Date(log.createdAt).toISOString(),
            `${log.performedByUser?.firstName || ''} ${log.performedByUser?.lastName || ''} <${log.performedByUser?.email || ''}>`,
            log.action,
            log.description || "",
            log.ipAddress || ""
        ])

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `audit-logs-${tenantId}-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleReset = () => {
        setSearch("")
        setAction("")
        setDateRange(undefined)
    }

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Organization Activity</CardTitle>
                        <CardDescription>
                            Track all significant actions and configuration changes within your organization.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            disabled={isFetching}
                        >
                            <RefreshCw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
                            Refresh
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={exportCsv}
                            disabled={!data?.logs || data.logs.length === 0}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
                <AuditLogFilters
                    onSearchChange={setSearch}
                    onActionChange={(val) => setAction(val as AuditLogAction)}
                    onDateRangeChange={setDateRange}
                    onReset={handleReset}
                />

                {isError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Failed to load audit logs. Please try again later.
                        </AlertDescription>
                    </Alert>
                )}

                <AuditLogTable
                    logs={data?.logs || []}
                    isLoading={isLoading}
                />

                {data && (
                    <div className="text-xs text-muted-foreground italic">
                        Showing {data.logs.length} of {data.total} total logs
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
