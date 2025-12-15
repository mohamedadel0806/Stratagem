import { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { ProfileForm } from "@/components/forms/profile-form"

export const metadata: Metadata = {
  title: "Profile Settings | GRC Platform",
  description: "Update your profile information",
}

export default function ProfileSettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
      </div>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <ProfileForm />
      </Card>
    </div>
  )
}

