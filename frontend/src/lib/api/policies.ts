import { apiClient } from './client';

export interface Policy {
  id: string;
  title: string;
  description?: string;
  policyType: string;
  status: string;
  version?: string;
  effectiveDate?: string;
  reviewDate?: string;
  documentUrl?: string;
  documentName?: string;
  documentMimeType?: string;
  createdAt: string;
}

export interface CreatePolicyData {
  title: string;
  description?: string;
  policyType: string;
  status?: string;
  version?: string;
  effectiveDate?: string;
  reviewDate?: string;
}

export interface UpdatePolicyData {
  title?: string;
  description?: string;
  policyType?: string;
  status?: string;
  version?: string;
  effectiveDate?: string;
  reviewDate?: string;
}

export interface PolicyQueryParams {
  search?: string;
  status?: string;
  policyType?: string;
  page?: number;
  limit?: number;
}

export interface PolicyListResponse {
  data: Policy[];
  total: number;
  page: number;
  limit: number;
}

export const policiesApi = {
  getAll: async (params?: PolicyQueryParams): Promise<PolicyListResponse> => {
    try {
      const response = await apiClient.get<PolicyListResponse>('/policies', { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch policies:', error);
      return { data: [], total: 0, page: 1, limit: 20 };
    }
  },
  getById: async (id: string): Promise<Policy> => {
    try {
      const response = await apiClient.get<Policy>(`/policies/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch policy:', error);
      throw error;
    }
  },
  create: async (data: CreatePolicyData): Promise<Policy> => {
    try {
      const response = await apiClient.post<Policy>('/policies', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create policy:', error);
      throw error;
    }
  },
  update: async (id: string, data: UpdatePolicyData): Promise<Policy> => {
    try {
      const response = await apiClient.put<Policy>(`/policies/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update policy:', error);
      throw error;
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/policies/${id}`);
    } catch (error: any) {
      console.error('Failed to delete policy:', error);
      throw error;
    }
  },
  uploadDocument: async (id: string, file: File): Promise<Policy> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Use the backend API path - gateway handles auth server-side
      const response = await fetch(`/api/policies/${id}/document`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Send cookies
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    } catch (error: any) {
      console.error('Failed to upload document:', error);
      throw error;
    }
  },
  downloadDocument: (id: string): string => {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/policies/${id}/document`;
  },
  bulkUpdateStatus: async (ids: string[], status: string): Promise<{ updated: number; policies: Policy[] }> => {
    try {
      const response = await apiClient.patch<{ updated: number; policies: Policy[] }>('/policies/bulk-update', { ids, status });
      return response.data;
    } catch (error: any) {
      console.error('Failed to bulk update policies:', error);
      throw error;
    }
  },
};

