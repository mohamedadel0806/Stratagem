import { apiClient } from './client';

export type AuditLogAction =
    | 'created'
    | 'updated'
    | 'deleted'
    | 'status_changed'
    | 'subscription_changed'
    | 'user_added'
    | 'user_removed';

export interface AuditLog {
    id: string;
    tenantId: string;
    performedBy: string;
    performedByUser?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    action: AuditLogAction;
    changes?: Record<string, any>;
    description?: string;
    ipAddress?: string;
    createdAt: string;
}

export interface GetAuditLogsParams {
    limit?: number;
    offset?: number;
    action?: AuditLogAction;
    performedBy?: string;
    startDate?: string;
    endDate?: string;
}

export interface AuditLogsResponse {
    logs: AuditLog[];
    total: number;
}

export const auditLogsApi = {
    getLogs: async (tenantId: string, params?: GetAuditLogsParams): Promise<AuditLogsResponse> => {
        const response = await apiClient.get<AuditLogsResponse>(`/tenants/${tenantId}/audit-logs`, { params });
        return response.data;
    },
};
