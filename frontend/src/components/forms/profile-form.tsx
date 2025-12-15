"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usersApi, UpdateProfileDto } from "@/lib/api/users"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// Toast will be implemented with a simple notification system

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = React.useState(false)

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => usersApi.getProfile(),
  })

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      avatarUrl: "",
    },
    values: profile ? {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone || "",
      avatarUrl: profile.avatarUrl || "",
    } : undefined,
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileDto) => usersApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      alert("Profile updated successfully")
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Failed to update profile")
    },
  })

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true)
    try {
      await updateProfileMutation.mutateAsync(values)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <Input
            id="firstName"
            placeholder="John"
            disabled={isLoading}
            {...form.register("firstName")}
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <Input
            id="lastName"
            placeholder="Doe"
            disabled={isLoading}
            {...form.register("lastName")}
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>
        <Input
          id="phone"
          placeholder="+1234567890"
          disabled={isLoading}
          {...form.register("phone")}
        />
        {form.formState.errors.phone && (
          <p className="text-sm text-red-500">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <label htmlFor="avatarUrl" className="text-sm font-medium">
          Avatar URL
        </label>
        <Input
          id="avatarUrl"
          placeholder="https://example.com/avatar.jpg"
          type="url"
          disabled={isLoading}
          {...form.register("avatarUrl")}
        />
        {form.formState.errors.avatarUrl && (
          <p className="text-sm text-red-500">
            {form.formState.errors.avatarUrl.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading && <span className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  )
}

