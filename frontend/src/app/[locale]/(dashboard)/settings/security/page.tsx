import { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { ChangePasswordForm } from "@/components/forms/change-password-form"

export const metadata: Metadata = {
  title: "Security Settings | GRC Platform",
  description: "Manage your account security",
}

export default function SecuritySettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Security Settings</h2>
      </div>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <ChangePasswordForm />
      </Card>
    </div>
  )
}

