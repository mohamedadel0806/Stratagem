"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Smartphone, AlertTriangle, CheckCircle2, ChevronRight, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api/client"
import { useSession } from "next-auth/react"

export function MfaSettings() {
    const { data: session, update } = useSession()
    const { toast } = useToast()
    const [status, setStatus] = React.useState<"idle" | "setup" | "confirm" | "enabled">("idle")
    const [qrCode, setQrCode] = React.useState<string>("")
    const [secret, setSecret] = React.useState<string>("")
    const [code, setCode] = React.useState<string>("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [recoveryCodes, setRecoveryCodes] = React.useState<string[]>([])

    // In a real app, we'd fetch the user's current MFA status
    // For now, we'll just check the session if mfaEnabled is there
    const isMfaEnabled = (session?.user as any)?.mfaEnabled || false

    const startSetup = async () => {
        setIsLoading(true)
        try {
            const response = await apiClient.post("/auth/mfa/setup")
            setQrCode(response.data.qrCode)
            setSecret(response.data.secret)
            setStatus("setup")
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to initiate MFA setup",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const confirmSetup = async () => {
        if (code.length !== 6) return
        setIsLoading(true)
        try {
            const response = await apiClient.post("/auth/mfa/confirm", { code })
            setRecoveryCodes(response.data.recoveryCodes)
            setStatus("enabled")
            toast({
                title: "Success",
                description: "MFA has been successfully enabled",
            })
            // Update session to reflect MFA enabled
            await update({ mfaEnabled: true })
        } catch (err: any) {
            toast({
                title: "Verification Failed",
                description: err.response?.data?.message || "Invalid code. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            description: "Recovery codes copied to clipboard",
        })
    }

    if (status === "setup") {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Set Up Authenticator
                    </CardTitle>
                    <CardDescription>
                        Scan the QR code below with your authenticator app (e.g., Google Authenticator, Authy).
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 py-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        {qrCode ? (
                            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                        ) : (
                            <div className="w-48 h-48 bg-muted animate-pulse rounded" />
                        )}
                    </div>
                    <div className="w-full space-y-2">
                        <p className="text-sm font-medium">Text Setup Key</p>
                        <div className="flex gap-2">
                            <code className="flex-1 p-2 bg-muted rounded text-xs break-all">{secret}</code>
                            <Button size="icon" variant="ghost" onClick={() => copyToClipboard(secret)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="ghost" onClick={() => setStatus("idle")}>Cancel</Button>
                    <Button onClick={() => setStatus("confirm")}>Next: Verify Code</Button>
                </CardFooter>
            </Card>
        )
    }

    if (status === "confirm") {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Verify Setup</CardTitle>
                    <CardDescription>
                        Enter the 6-digit code presented in your authenticator app to complete the setup.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="000 000"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            className="text-center text-3xl font-bold tracking-[0.5em] h-14"
                            autoFocus
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="ghost" onClick={() => setStatus("setup")}>Back</Button>
                    <Button onClick={confirmSetup} disabled={isLoading || code.length !== 6}>
                        {isLoading && <span className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm & Enable
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    if (status === "enabled") {
        return (
            <Card className="border-green-100 bg-green-50/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        Two-Factor Authentication Enabled
                    </CardTitle>
                    <CardDescription>
                        Save these recovery codes. They allow you to access your account if you lose your phone.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        {recoveryCodes.map((code, i) => (
                            <code key={i} className="p-2 bg-muted rounded text-sm text-center">{code}</code>
                        ))}
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg text-amber-800 text-sm">
                        <AlertTriangle className="h-5 w-5 shrink-0" />
                        <p>
                            Recovery codes should be stored securely. Each code can only be used once.
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => setStatus("idle")}>Finish</Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Two-Factor Authentication (MFA)
                </CardTitle>
                <CardDescription>
                    {isMfaEnabled
                        ? "MFA is currently active for your account."
                        : "Add an extra layer of security to your account."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                    <div className="space-y-1">
                        <p className="font-medium">Authenticator App</p>
                        <p className="text-sm text-muted-foreground">
                            Use a mobile app like Google Authenticator or Authy to generate security codes.
                        </p>
                    </div>
                    <Badge variant={isMfaEnabled ? "default" : "secondary"}>
                        {isMfaEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                </div>
            </CardContent>
            <CardFooter>
                {!isMfaEnabled && (
                    <Button onClick={startSetup} disabled={isLoading}>
                        {isLoading && <span className="mr-2 h-4 w-4 animate-spin" />}
                        Enable MFA
                    </Button>
                )}
                {isMfaEnabled && (
                    <Button variant="outline" className="text-destructive hover:bg-destructive/10">
                        Disable MFA
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
