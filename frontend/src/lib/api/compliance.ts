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

export type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';

export type ComplianceStatusEnum =
  | 'compliant'
  | 'non_compliant'
  | 'partially_compliant'
  | 'not_assessed'
  | 'requires_review'
  | 'not_applicable';

export interface AssetComplianceSummary {
  assetId: string;
  assetName: string;
  assetIdentifier: string;
  assetType: string | { name?: string; code?: string; id?: string };
  criticality?: string;
  businessUnit?: string;
  totalRequirements: number;
  compliantCount: number;
  nonCompliantCount: number;
  partiallyCompliantCount: number;
  notAssessedCount: number;
  requiresReviewCount: number;
  overallCompliancePercentage: number;
  overallComplianceStatus: ComplianceStatusEnum;
  controlsLinkedCount: number;
}

export interface ComplianceListResponse {
  assets: AssetComplianceSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  complianceSummary?: {
    totalAssets: number;
    compliantAssets: number;
    nonCompliantAssets: number;
    partiallyCompliantAssets: number;
    averageCompliancePercentage: number;
  };
}

export interface AssetComplianceStatus {
  assetId: string;
  assetType: AssetType;
  totalRequirements: number;
  compliantCount: number;
  nonCompliantCount: number;
  partiallyCompliantCount: number;
  requiresReviewCount: number;
  overallCompliancePercentage: number;
  requirements: RequirementAssessment[];
}

export interface RequirementAssessment {
  requirementId: string;
  requirementTitle: string;
  status: ComplianceStatusEnum;
  assessedAt?: string;
  ruleResults?: RuleResult[];
  recommendations?: string[];
}

export interface RuleResult {
  ruleName: string;
  status: ComplianceStatusEnum;
  message: string;
}

export interface ComplianceGap {
  requirementId: string;
  requirementTitle: string;
  gapDescription: string;
  recommendations?: string[];
}

export interface ValidationRule {
  id: string;
  ruleName: string;
  ruleDescription?: string;
  requirementId: string;
  requirementTitle?: string;
  requirementCode?: string;
  assetType: AssetType;
  priority: number;
  isActive: boolean;
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

  getFrameworks: async (): Promise<ComplianceFramework[]> => {
    const response = await apiClient.get<ComplianceFramework[]>('/compliance/frameworks');
    return response.data;
  },

  getRequirements: async (filters?: { frameworkId?: string }): Promise<{ data: any[] }> => {
    const response = await apiClient.get<{ data: any[] }>('/compliance/requirements', { params: filters });
    return response.data;
  },
};

export const assetComplianceListApi = {
  getAssetComplianceList: async (
    filters: {
      assetType?: AssetType;
      complianceStatus?: ComplianceStatusEnum;
      businessUnit?: string;
      criticality?: string;
      searchQuery?: string;
    },
    pagination: { page: number; pageSize: number }
  ): Promise<ComplianceListResponse> => {
    const response = await apiClient.get<ComplianceListResponse>('/compliance/assets', {
      params: {
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize,
      },
    });
    return response.data;
  },
};

export const complianceAssessmentApi = {
  getAssetComplianceStatus: async (
    assetType: AssetType,
    assetId: string
  ): Promise<AssetComplianceStatus> => {
    const response = await apiClient.get<AssetComplianceStatus>(
      `/compliance/assets/${assetType}/${assetId}/status`
    );
    return response.data;
  },

  getComplianceGaps: async (
    assetType: AssetType,
    assetId: string
  ): Promise<ComplianceGap[]> => {
    const response = await apiClient.get<ComplianceGap[]>(
      `/compliance/assets/${assetType}/${assetId}/gaps`
    );
    return response.data;
  },

  assessAsset: async (assetType: AssetType, assetId: string): Promise<void> => {
    await apiClient.post(`/compliance/assets/${assetType}/${assetId}/assess`);
  },
};

export const validationRulesApi = {
  getAll: async (
    requirementId?: string,
    assetType?: AssetType
  ): Promise<ValidationRule[]> => {
    const response = await apiClient.get<ValidationRule[]>('/compliance/validation-rules', {
      params: {
        requirementId,
        assetType,
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/compliance/validation-rules/${id}`);
  },

  create: async (data: Partial<ValidationRule>): Promise<ValidationRule> => {
    const response = await apiClient.post<ValidationRule>('/compliance/validation-rules', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ValidationRule>): Promise<ValidationRule> => {
    const response = await apiClient.put<ValidationRule>(`/compliance/validation-rules/${id}`, data);
    return response.data;
  },
};
