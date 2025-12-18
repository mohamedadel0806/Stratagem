"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const emailInputRef = React.useRef<HTMLInputElement>(null)
  const passwordInputRef = React.useRef<HTMLInputElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  // Check for OAuth errors in URL parameters
  React.useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      // Map NextAuth error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        keycloak: "Keycloak SSO authentication failed. Please try again or use email login.",
        Configuration: "Authentication configuration error. Please contact support.",
        AccessDenied: "Access denied. Please check your account permissions.",
        Verification: "Email verification required. Please check your email.",
        Default: "Authentication failed. Please try again.",
      }
      setError(errorMessages[errorParam] || errorMessages.Default)
      
      // Clear error from URL after displaying, but keep callbackUrl
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete("error")
      const newUrl = `${window.location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`
      router.replace(newUrl)
    }
  }, [searchParams, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Merge refs helper function
  const mergeRefs = React.useCallback(<T,>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> => {
    return (value: T) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(value)
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = value
        }
      })
    }
  }, [])

  const emailRegister = form.register("email")
  const passwordRegister = form.register("password")

  // #region agent log
  // Detect and sync browser autofill values to React Hook Form
  React.useEffect(() => {
    const syncAutofillValues = () => {
      const emailEl = emailInputRef.current
      const passwordEl = passwordInputRef.current
      
      if (emailEl && emailEl.value && emailEl.value !== form.getValues("email")) {
        const domValue = emailEl.value
        form.setValue("email", domValue, { shouldValidate: false, shouldDirty: true })
      }
      
      if (passwordEl && passwordEl.value && passwordEl.value !== form.getValues("password")) {
        const domValue = passwordEl.value
        form.setValue("password", domValue, { shouldValidate: false, shouldDirty: true })
      }
    }

    // Check periodically for autofill
    const interval = setInterval(syncAutofillValues, 200)
    
    // Also check on various events that might indicate autofill
    const emailEl = emailInputRef.current
    const passwordEl = passwordInputRef.current
    const formEl = formRef.current

    const cleanup: Array<() => void> = [() => clearInterval(interval)]

    if (emailEl) {
      // Listen for animationstart (webkit-autofill triggers this)
      const handleEmailAnimationStart = (e: AnimationEvent) => {
        if (e.animationName === 'onAutoFillStart' || e.animationName.includes('autofill')) {
          setTimeout(syncAutofillValues, 50)
        }
      }
      emailEl.addEventListener('animationstart', handleEmailAnimationStart as any)
      
      // Listen for input changes (might be autofill)
      const handleEmailInput = () => syncAutofillValues()
      emailEl.addEventListener('input', handleEmailInput)
      emailEl.addEventListener('change', handleEmailInput)
      
      cleanup.push(() => {
        emailEl.removeEventListener('animationstart', handleEmailAnimationStart as any)
        emailEl.removeEventListener('input', handleEmailInput)
        emailEl.removeEventListener('change', handleEmailInput)
      })
    }

    if (passwordEl) {
      const handlePasswordAnimationStart = (e: AnimationEvent) => {
        if (e.animationName === 'onAutoFillStart' || e.animationName.includes('autofill')) {
          setTimeout(syncAutofillValues, 50)
        }
      }
      passwordEl.addEventListener('animationstart', handlePasswordAnimationStart as any)
      
      const handlePasswordInput = () => syncAutofillValues()
      passwordEl.addEventListener('input', handlePasswordInput)
      passwordEl.addEventListener('change', handlePasswordInput)
      
      cleanup.push(() => {
        passwordEl.removeEventListener('animationstart', handlePasswordAnimationStart as any)
        passwordEl.removeEventListener('input', handlePasswordInput)
        passwordEl.removeEventListener('change', handlePasswordInput)
      })
    }

    // Also check on form focus
    if (formEl) {
      const handleFocus = () => setTimeout(syncAutofillValues, 100)
      formEl.addEventListener('focusin', handleFocus)
      cleanup.push(() => formEl.removeEventListener('focusin', handleFocus))
    }

    return () => cleanup.forEach(fn => fn())
  }, [form])
  // #endregion

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else if (result?.ok) {
        // Redirect to dashboard or callback URL
        const callbackUrl = searchParams.get("from") || searchParams.get("callbackUrl") || "/en/dashboard"
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...emailRegister}
              ref={mergeRefs(emailInputRef, emailRegister.ref)}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              {...passwordRegister}
              ref={mergeRefs(passwordInputRef, passwordRegister.ref)}
            />
             {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}
          <Button disabled={isLoading}>
            {isLoading && (
              <span className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button 
        variant="outline" 
        type="button" 
        disabled={isLoading} 
        onClick={() => {
          setIsLoading(true)
          // Use window.location for direct redirect to avoid NextAuth issues
          window.location.href = `/api/auth/signin/keycloak?callbackUrl=${encodeURIComponent(
            searchParams.get("callbackUrl") || searchParams.get("from") || "/en/dashboard"
          )}`
        }}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          // <Icons.keycloak className="mr-2 h-4 w-4" /> // Placeholder
          <span className="mr-2">🔐</span>
        )}{" "}
        Keycloak SSO
      </Button>
    </div>
  )
}