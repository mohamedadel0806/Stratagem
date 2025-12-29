"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { complianceApi, ComplianceFramework } from "@/lib/api/compliance"
import { tenantsApi } from "@/lib/api/tenants"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Shield, Globe, Landmark, ShieldCheck } from "lucide-react"

interface FrameworkSelectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FrameworkSelector({ open, onOpenChange }: FrameworkSelectorProps) {
    const { data: session } = useSession()
    const tenantId = (session?.user as any)?.tenantId
    const queryClient = useQueryClient()
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

    const { data: frameworks, isLoading } = useQuery({
        queryKey: ['global-frameworks'],
        queryFn: complianceApi.getGlobalFrameworks,
        enabled: open,
    })

    const updateProgress = useMutation({
        mutationFn: () => tenantsApi.updateOnboardingProgress(tenantId, { completed: "framework" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenant-onboarding', tenantId] })
            onOpenChange(false)
        }
    })

    const toggleFramework = (id: string) => {
        const next = new Set(selectedIds)
        if (next.has(id)) {
            next.delete(id)
        } else {
            next.add(id)
        }
        setSelectedIds(next)
    }

    const handleConfirm = () => {
        // In a real implementation, we would also call an API to link these frameworks
        // For now, we just update the onboarding progress
        updateProgress.mutate()
    }

    const getIcon = (code: string) => {
        if (code.includes('ISO')) return <ShieldCheck className="h-4 w-4" />
        if (code.includes('NIST') || code.includes('SOC')) return <Landmark className="h-4 w-4" />
        return <Globe className="h-4 w-4" />
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Select Compliance Frameworks</DialogTitle>
                    <DialogDescription>
                        Choose the standards and regulations your organization needs to comply with.
                        This will set up your initial compliance dashboard.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="mt-4 h-[400px] pr-4">
                    <div className="grid gap-4">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
                            ))
                        ) : frameworks?.map((framework) => (
                            <div
                                key={framework.id}
                                className={React.useMemo(() => `
                  relative flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-all
                  ${selectedIds.has(framework.id)
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "hover:border-primary/50 hover:bg-muted/50"}
                `, [selectedIds.has(framework.id)])}
                                onClick={() => toggleFramework(framework.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-md ${selectedIds.has(framework.id) ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            {getIcon(framework.frameworkCode)}
                                        </div>
                                        <span className="font-semibold text-sm">{framework.name}</span>
                                    </div>
                                    {selectedIds.has(framework.id) && (
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {framework.description || "Comprehensive framework for managing and protecting information security."}
                                </p>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="text-[10px] h-4">
                                        {framework.frameworkCode}
                                    </Badge>
                                    {framework.version && (
                                        <Badge variant="secondary" className="text-[10px] h-4">
                                            v{framework.version}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={selectedIds.size === 0 || updateProgress.isPending}
                        onClick={handleConfirm}
                    >
                        {updateProgress.isPending ? "Setting up..." : `Activate ${selectedIds.size} ${selectedIds.size === 1 ? 'Framework' : 'Frameworks'}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
