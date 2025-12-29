"use client"

import { Separator } from "@/components/ui/separator"
import { TenantSettingsForm } from "@/components/forms/tenant-settings-form"
import { NotificationSettingsForm } from "@/components/forms/notification-settings-form"
import { LookupsManagement } from "@/components/settings/lookups-management"
import { IntegrationSettings } from "@/components/settings/integration-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Bell, Zap, ListTree } from "lucide-react"

export default function TenantSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Organization Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your organization's configuration and notification preferences.
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="lookups" className="flex items-center gap-2">
                        <ListTree className="h-4 w-4" />
                        Lookups
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Integrations
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 pt-2">
                    <TenantSettingsForm />
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6 pt-2">
                    <NotificationSettingsForm />
                </TabsContent>

                <TabsContent value="lookups" className="pt-2">
                    <LookupsManagement />
                </TabsContent>

                <TabsContent value="integrations" className="pt-2">
                    <IntegrationSettings />
                </TabsContent>
            </Tabs>
        </div>
    )
}
