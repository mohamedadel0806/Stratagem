import { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { ProfileForm } from "@/components/forms/profile-form"

export const metadata: Metadata = {
  title: "Settings | GRC Platform",
  description: "Manage your account settings",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
          <ProfileForm />
        </Card>
      </div>
    </div>
  )
}

