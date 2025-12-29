"use client"

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { AuditLog, AuditLogAction } from "@/lib/api/audit-logs"
import { ChevronDown, ChevronRight, User, Globe, Clock, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuditLogTableProps {
    logs: AuditLog[]
    isLoading: boolean
}

const actionColors: Record<AuditLogAction, string> = {
    created: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    updated: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    deleted: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    status_changed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    subscription_changed: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    user_added: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    user_removed: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
}

export function AuditLogTable({ logs, isLoading }: AuditLogTableProps) {
    const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())

    const toggleRow = (id: string) => {
        const next = new Set(expandedRows)
        if (next.has(id)) {
            next.delete(id)
        } else {
            next.add(id)
        }
        setExpandedRows(next)
    }

    if (isLoading) {
        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>IP Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={6} className="h-12 animate-pulse bg-muted/20" />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    if (logs.length === 0) {
        return (
            <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed text-muted-foreground">
                <p>No audit logs found matching your criteria.</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>IP Address</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <React.Fragment key={log.id}>
                            <TableRow
                                className={cn(
                                    "cursor-pointer transition-colors hover:bg-muted/50",
                                    expandedRows.has(log.id) && "bg-muted/30"
                                )}
                                onClick={() => toggleRow(log.id)}
                            >
                                <TableCell>
                                    {log.changes ? (
                                        expandedRows.has(log.id) ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )
                                    ) : null}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                                            <User className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {log.performedByUser?.firstName} {log.performedByUser?.lastName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {log.performedByUser?.email}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={cn("capitalize shadow-none border-none", actionColors[log.action])}>
                                        {log.action.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell className="max-w-[300px] truncate">
                                    {log.description}
                                </TableCell>
                                <TableCell className="text-xs font-mono text-muted-foreground">
                                    {log.ipAddress}
                                </TableCell>
                            </TableRow>
                            {expandedRows.has(log.id) && log.changes && (
                                <TableRow className="bg-muted/10">
                                    <TableCell colSpan={6} className="p-4">
                                        <div className="rounded-lg border bg-background/50 p-4 shadow-sm">
                                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                                                <FileText className="h-4 w-4 text-primary" />
                                                Detailed Changes
                                            </div>
                                            <pre className="overflow-x-auto rounded bg-muted/60 p-3 text-[11px] font-mono leading-relaxed">
                                                {JSON.stringify(log.changes, null, 2)}
                                            </pre>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
