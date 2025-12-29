import { apiClient } from './client';

export interface ComplianceFramework {
  id: string;
  frameworkCode: string;
  name: string;
  version?: string;
  description?: string;
  issuingAuthority?: string;
  status: string;
}

export const complianceApi = {
  getGlobalFrameworks: async (): Promise<ComplianceFramework[]> => {
    const response = await apiClient.get<ComplianceFramework[]>('/compliance/frameworks/global');
    return response.data;
  },

  getTenantFrameworks: async (tenantId: string): Promise<ComplianceFramework[]> => {
    const response = await apiClient.get<ComplianceFramework[]>(`/compliance/frameworks/tenant/${tenantId}`);
    return response.data;
  },
};
