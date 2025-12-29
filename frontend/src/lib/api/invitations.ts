import { apiClient } from './client';
import { UserRole } from './users';

export interface Invitation {
    id: string;
    email: string;
    token: string;
    role: UserRole;
    tenantId: string;
    status: 'pending' | 'accepted' | 'expired' | 'revoked';
    expiresAt: string;
    createdAt: string;
}

export const invitationsApi = {
    create: async (email: string, role: UserRole): Promise<Invitation> => {
        const response = await apiClient.post<Invitation>('/invitations', { email, role });
        return response.data;
    },

    getAll: async (): Promise<Invitation[]> => {
        const response = await apiClient.get<Invitation[]>('/invitations');
        return response.data;
    },

    getByToken: async (token: string): Promise<Invitation> => {
        const response = await apiClient.get<Invitation>(`/invitations/${token}`);
        return response.data;
    },

    accept: async (token: string, data: { password: string; firstName: string; lastName: string }): Promise<Invitation> => {
        const response = await apiClient.post<Invitation>(`/invitations/${token}/accept`, data);
        return response.data;
    },

    revoke: async (id: string): Promise<void> => {
        await apiClient.delete(`/invitations/${id}`);
    },
};
