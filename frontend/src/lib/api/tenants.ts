import { apiClient } from './client';

export interface TenantSettings {
    theme?: 'light' | 'dark' | 'system';
    locale?: string;
    custom_branding?: boolean;
    risk_methodology?: string;
    max_risk_score?: number;
    [key: string]: any;
}

export interface Tenant {
    id: string;
    name: string;
    code: string;
    status: 'active' | 'suspended' | 'trial' | 'deleted';
    subscriptionTier: 'starter' | 'professional' | 'enterprise';
    settings: TenantSettings;
    industry?: string;
    regulatoryScope?: string;
    userCount?: number;
    storageUsedMB?: number;
    lastActivityAt?: string;
    trialStartedAt?: string;
    trialEndsAt?: string;
    onboardingProgress?: {
        completed: string[];
        skipped: string[];
        lastUpdated: string;
    };
    allowedDomains: string[];
    createdAt: string;
    updatedAt: string;
}

export interface UpdateTenantData {
    name?: string;
    industry?: string;
    regulatoryScope?: string;
    settings?: TenantSettings;
    allowedDomains?: string[];
}

export interface SmtpConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    fromEmail: string;
    fromName: string;
}

export interface NotificationBranding {
    logoUrl?: string;
    companyName?: string;
    primaryColor?: string;
    supportEmail?: string;
    footerText?: string;
}

export interface NotificationSettings {
    smtpConfig?: SmtpConfig;
    notificationBranding?: NotificationBranding;
}

export const tenantsApi = {
    getById: async (id: string): Promise<Tenant> => {
        const response = await apiClient.get<Tenant>(`/tenants/${id}`);
        return response.data;
    },

    update: async (id: string, data: UpdateTenantData): Promise<Tenant> => {
        const response = await apiClient.patch<Tenant>(`/tenants/${id}`, data);
        return response.data;
    },

    updateOnboardingProgress: async (id: string, data: { completed?: string; skipped?: string }): Promise<Tenant> => {
        const response = await apiClient.patch<Tenant>(`/tenants/${id}/onboarding-progress`, data);
        return response.data;
    },

    getNotificationSettings: async (tenantId: string): Promise<NotificationSettings> => {
        const response = await apiClient.get<NotificationSettings>(`/tenants/${tenantId}/notification-settings`);
        return response.data;
    },

    updateNotificationSettings: async (tenantId: string, data: NotificationSettings): Promise<Tenant> => {
        const response = await apiClient.patch<Tenant>(`/tenants/${tenantId}/notification-settings`, data);
        return response.data;
    },

    testNotificationSettings: async (tenantId: string, data: NotificationSettings): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.post<{ success: boolean; message: string }>(`/tenants/${tenantId}/notification-settings/test`, data);
        return response.data;
    },

    exportData: async (tenantId: string): Promise<any> => {
        const response = await apiClient.post<any>(`/tenants/${tenantId}/export`);
        return response.data;
    },
};
