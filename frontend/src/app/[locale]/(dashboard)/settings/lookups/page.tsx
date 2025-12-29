"use client"

import { LookupsManagement } from "@/components/settings/lookups-management"

export default function LookupsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories & Taxonomy</h2>
                    <p className="text-muted-foreground">
                        Manage lookup values, categories, and organizational structure.
                    </p>
                </div>
            </div>

            <LookupsManagement />
        </div>
    )
}
