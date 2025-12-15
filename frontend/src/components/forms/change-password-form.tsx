"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usersApi, ChangePasswordDto } from "@/lib/api/users"
import { useMutation } from "@tanstack/react-query"
// Toast will be implemented with a simple notification system

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordDto) => usersApi.changePassword(data),
    onSuccess: () => {
      alert("Password changed successfully")
      form.reset()
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Failed to change password")
    },
  })

  async function onSubmit(values: PasswordFormValues) {
    setIsLoading(true)
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <label htmlFor="currentPassword" className="text-sm font-medium">
          Current Password
        </label>
        <Input
          id="currentPassword"
          type="password"
          placeholder="Enter current password"
          disabled={isLoading}
          {...form.register("currentPassword")}
        />
        {form.formState.errors.currentPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.currentPassword.message}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <label htmlFor="newPassword" className="text-sm font-medium">
          New Password
        </label>
        <Input
          id="newPassword"
          type="password"
          placeholder="Enter new password"
          disabled={isLoading}
          {...form.register("newPassword")}
        />
        {form.formState.errors.newPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.newPassword.message}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm New Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          disabled={isLoading}
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading && <span className="mr-2 h-4 w-4 animate-spin" />}
        Change Password
      </Button>
    </form>
  )
}

