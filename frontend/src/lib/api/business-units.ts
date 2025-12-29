import { apiClient } from './client';

export interface BusinessUnit {
  id: string;
  name: string;
  code?: string;
  parentId?: string;
  description?: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export const businessUnitsApi = {
  getAll: async (): Promise<BusinessUnit[]> => {
    const response = await apiClient.get<BusinessUnit[]>('/business-units');
    return response.data;
  },

  getById: async (id: string): Promise<BusinessUnit> => {
    const response = await apiClient.get<BusinessUnit>(`/business-units/${id}`);
    return response.data;
  },

  create: async (data: Partial<BusinessUnit>): Promise<BusinessUnit> => {
    const response = await apiClient.post<BusinessUnit>('/business-units', data);
    return response.data;
  },

  update: async (id: string, data: Partial<BusinessUnit>): Promise<BusinessUnit> => {
    const response = await apiClient.put<BusinessUnit>(`/business-units/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/business-units/${id}`);
  },
};



