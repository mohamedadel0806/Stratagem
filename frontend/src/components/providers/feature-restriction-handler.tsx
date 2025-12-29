"use client"

import { useEffect, useState } from 'react'
import { UpgradeDialog } from '@/components/settings/upgrade-dialog'
import { useSession } from 'next-auth/react'

interface FeatureRestrictedEvent extends CustomEvent {
    detail: {
        feature: string
        message: string
        endpoint?: string
        currentTier?: string
        requiredTier?: string
    }
}

export function FeatureRestrictionHandler() {
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [restrictedFeature, setRestrictedFeature] = useState<string>('')
    const { data: session } = useSession()

    useEffect(() => {
        const handleFeatureRestricted = (event: Event) => {
            const customEvent = event as FeatureRestrictedEvent
            setRestrictedFeature(customEvent.detail.feature)
            setShowUpgrade(true)

            // Log for debugging
            console.log('Feature restricted:', customEvent.detail)
        }

        window.addEventListener('feature-restricted', handleFeatureRestricted)
        return () => {
            window.removeEventListener('feature-restricted', handleFeatureRestricted)
        }
    }, [])

    // Access subscription tier from session user (with type assertion)
    const currentTier = ((session?.user as any)?.subscriptionTier || 'starter') as 'starter' | 'professional' | 'enterprise'

    return (
        <UpgradeDialog
            open={showUpgrade}
            onOpenChange={setShowUpgrade}
            currentTier={currentTier}
            restrictedFeature={restrictedFeature}
        />
    )
}
