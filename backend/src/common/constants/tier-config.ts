import { SubscriptionTier } from '../entities/tenant.entity';

export enum TenantFeature {
    ADVANCED_ANALYTICS = 'advanced_analytics',
    CUSTOM_LOOKUPS = 'custom_lookups',
    REST_INTEGRATIONS = 'rest_integrations',
    WEBHOOKS = 'webhooks',
    CUSTOM_DOMAINS = 'custom_domains',
    SAML_SSO = 'saml_sso',
    DATA_EXPORT = 'data_export',
}

export interface TierLimits {
    maxUsers: number;
    maxStorageMB: number;
    features: TenantFeature[];
}

export const TIER_CONFIG: Record<SubscriptionTier, TierLimits> = {
    [SubscriptionTier.STARTER]: {
        maxUsers: 5,
        maxStorageMB: 500,
        features: [
            TenantFeature.DATA_EXPORT,
        ],
    },
    [SubscriptionTier.PROFESSIONAL]: {
        maxUsers: 25,
        maxStorageMB: 5120, // 5GB
        features: [
            TenantFeature.DATA_EXPORT,
            TenantFeature.CUSTOM_LOOKUPS,
            TenantFeature.REST_INTEGRATIONS,
            TenantFeature.ADVANCED_ANALYTICS,
        ],
    },
    [SubscriptionTier.ENTERPRISE]: {
        maxUsers: 1000, // Effectively unlimited
        maxStorageMB: 102400, // 100GB
        features: Object.values(TenantFeature),
    },
};
