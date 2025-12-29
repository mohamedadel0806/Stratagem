"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Shield, Rocket, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface UpgradeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentTier?: 'starter' | 'professional' | 'enterprise'
    restrictedFeature?: string  // Feature that triggered the dialog
}

// Feature-to-tier mapping
const FEATURE_TIER_MAP: Record<string, string> = {
    'advanced_analytics': 'Professional',
    'custom_lookups': 'Professional',
    'rest_integrations': 'Professional',
    'data_export': 'Starter',
    'webhooks': 'Enterprise',
    'saml_sso': 'Enterprise',
    'custom_domains': 'Enterprise',
}

// Feature-to-display-name mapping
const FEATURE_DISPLAY_NAMES: Record<string, string> = {
    'advanced_analytics': 'Advanced Analytics & KRIs',
    'custom_lookups': 'Custom Lookups & Taxonomy',
    'rest_integrations': 'REST Integrations',
    'data_export': 'Data Export',
    'webhooks': 'Webhooks & Event Streaming',
    'saml_sso': 'SAML SSO',
    'custom_domains': 'Custom Domains',
    'premium': 'Premium Features',
}

const TIER_FEATURES = [
    {
        name: "Starter",
        tier: "starter",
        price: "Free",
        description: "Best for small teams and evaluation.",
        icon: <Rocket className="h-5 w-5 text-blue-500" />,
        features: [
            "Up to 5 Users",
            "500MB Storage",
            "Basic Asset Management",
            "Data Export (GDPR)",
        ],
        cta: "Current Plan",
        highlight: false,
    },
    {
        name: "Professional",
        tier: "professional",
        price: "$499/mo",
        description: "Perfect for growing compliance teams.",
        icon: <Zap className="h-5 w-5 text-amber-500" />,
        features: [
            "Up to 25 Users",
            "5GB Storage",
            "Custom Lookups & Taxonomy",
            "REST Integrations (Jira, ServiceNow)",
            "Advanced Analytics & KRIs",
            "Priority Email Support",
        ],
        cta: "Upgrade Now",
        highlight: true,
    },
    {
        name: "Enterprise",
        tier: "enterprise",
        price: "Custom",
        description: "For organizations requiring total control.",
        icon: <Shield className="h-5 w-5 text-purple-500" />,
        features: [
            "Unlimited Users",
            "100GB+ Storage",
            "Webhooks & Event Stream",
            "SAML SSO & Custom Domains",
            "Full API Access",
            "Dedicated Account Manager",
        ],
        cta: "Contact Sales",
        highlight: false,
    },
]

export function UpgradeDialog({ open, onOpenChange, currentTier = 'starter', restrictedFeature }: UpgradeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-background border-none">
                {/* Feature restriction banner */}
                {restrictedFeature && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800 px-6 py-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                                <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                                    Feature Restricted
                                </h4>
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    <strong>{FEATURE_DISPLAY_NAMES[restrictedFeature] || 'This feature'}</strong> requires a{' '}
                                    <strong>{FEATURE_TIER_MAP[restrictedFeature] || 'higher'}</strong> subscription tier.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {TIER_FEATURES.map((tier) => (
                        <div
                            key={tier.tier}
                            className={cn(
                                "relative flex flex-col p-6 transition-all",
                                tier.highlight
                                    ? "bg-primary/[0.03] dark:bg-primary/[0.08] shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)] border-x border-primary/10"
                                    : "bg-background",
                                tier.tier === 'starter' && "md:rounded-l-lg",
                                tier.tier === 'enterprise' && "md:rounded-r-lg"
                            )}
                        >
                            {tier.highlight && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
                            )}
                            {tier.tier === currentTier && (
                                <Badge variant="secondary" className="absolute top-3 right-3 text-[10px] uppercase font-bold">
                                    Current
                                </Badge>
                            )}

                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border shadow-sm">
                                        {tier.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight">{tier.name}</h3>
                                        <div className="text-xl font-bold">{tier.price}</div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {tier.description}
                                </p>
                            </div>

                            <div className="flex-1 space-y-3 mb-6">
                                {tier.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-2">
                                        <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Check className="h-2.5 w-2.5" />
                                        </div>
                                        <span className="text-xs">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={tier.highlight ? "default" : "outline"}
                                size="lg"
                                className={cn(
                                    "w-full font-bold transition-all",
                                    tier.highlight && "shadow-lg hover:shadow-xl",
                                    tier.tier === currentTier && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={tier.tier === currentTier}
                            >
                                {tier.tier === 'enterprise' ? (
                                    <a href="mailto:sales@stratagem.com" className="flex items-center gap-2">
                                        {tier.cta}
                                    </a>
                                ) : (
                                    tier.cta
                                )}
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="bg-muted/30 p-4 border-t flex flex-col items-center justify-center text-center gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>All plans include encryption at rest and role-based access control.</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
