"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usersApi } from "@/lib/api/users"
import { FileDown, Loader2, ShieldCheck } from "lucide-react"

export function ProfileDataExport() {
    const [isExporting, setIsExporting] = React.useState(false)

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const data = await usersApi.exportData()
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `my-stratagem-data-${new Date().toISOString().split('T')[0]}.json`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            alert("Failed to export personal data")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <div>
                        <CardTitle>Data Portability</CardTitle>
                        <CardDescription>
                            Export all your personal data stored in Stratagem (GDPR compliance)
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Export My Data</p>
                        <p className="text-sm text-muted-foreground">
                            Download a JSON file containing your profile, assigned tasks, and activity history.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        disabled={isExporting}
                        onClick={handleExport}
                        className="shrink-0"
                    >
                        {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                        Export JSON
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
