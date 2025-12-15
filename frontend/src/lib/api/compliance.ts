import { apiClient } from './client';
import { ImplementationStatus } from './governance';

export interface ComplianceStatus {
  overallCompliance: number;
  frameworks: Array<{
    name: string;
    compliancePercentage: number;
    requirementsMet: number;
    totalRequirements: number;
    trend: 'improving' | 'stable' | 'declining';
  }>;
}

export interface Framework {
  id: string;
  name: string;
  code?: string;
  description?: string;
  region?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Requirement {
  id: string;
  title: string;
  description?: string;
  requirementCode?: string;
  category?: string;
  complianceDeadline?: string;
  applicability?: string;
  frameworkId: string;
  status: 'not_started' | 'in_progress' | 'compliant' | 'non_compliant' | 'partially_compliant';
  createdAt: string;
  updatedAt: string;
}

export interface CreateFrameworkData {
  name: string;
  code?: string;
  description?: string;
  region?: string;
}

export interface UpdateFrameworkData {
  name?: string;
  code?: string;
  description?: string;
  region?: string;
}

export interface CreateRequirementData {
  title: string;
  description?: string;
  requirementCode?: string;
  category?: string;
  complianceDeadline?: string;
  applicability?: string;
  frameworkId: string;
  status?: string;
}

export interface UpdateRequirementData {
  title?: string;
  description?: string;
  requirementCode?: string;
  category?: string;
  complianceDeadline?: string;
  applicability?: string;
  frameworkId?: string;
  status?: string;
}

export const complianceApi = {
  getStatus: async (): Promise<ComplianceStatus> => {
    try {
      const response = await apiClient.get<ComplianceStatus>('/compliance/status');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch compliance status:', error);
      // Return mock data as fallback if API fails
      return {
        overallCompliance: 78.5,
        frameworks: [
          {
            name: 'NCA',
            compliancePercentage: 92,
            requirementsMet: 128,
            totalRequirements: 156,
            trend: 'improving',
          },
          {
            name: 'SAMA',
            compliancePercentage: 78,
            requirementsMet: 67,
            totalRequirements: 89,
            trend: 'stable',
          },
          {
            name: 'ADGM',
            compliancePercentage: 85,
            requirementsMet: 105,
            totalRequirements: 124,
            trend: 'improving',
          },
        ],
      };
    }
  },
  // Framework methods
  getFrameworks: async (): Promise<Framework[]> => {
    try {
      const response = await apiClient.get<Framework[]>('/compliance/frameworks');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch frameworks:', error);
      return [];
    }
  },
  getFramework: async (id: string): Promise<Framework> => {
    try {
      const response = await apiClient.get<Framework>(`/compliance/frameworks/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch framework:', error);
      throw error;
    }
  },
  createFramework: async (data: CreateFrameworkData): Promise<Framework> => {
    try {
      const response = await apiClient.post<Framework>('/compliance/frameworks', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create framework:', error);
      throw error;
    }
  },
  updateFramework: async (id: string, data: UpdateFrameworkData): Promise<Framework> => {
    try {
      const response = await apiClient.put<Framework>(`/compliance/frameworks/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update framework:', error);
      throw error;
    }
  },
  deleteFramework: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/compliance/frameworks/${id}`);
    } catch (error: any) {
      console.error('Failed to delete framework:', error);
      throw error;
    }
  },
  // Requirement methods
  getRequirements: async (queryParams?: { search?: string; status?: string; frameworkId?: string; category?: string; page?: number; limit?: number }): Promise<{ data: Requirement[]; total: number; page: number; limit: number }> => {
    try {
      // Ensure limit is reasonable to prevent timeouts
      const safeParams = {
        ...queryParams,
        limit: queryParams?.limit ? Math.min(queryParams.limit, 500) : 20,
      };
      
      // Filter out undefined or null values to prevent 400 errors
      const filteredParams = Object.fromEntries(
        Object.entries(safeParams).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      );
      
      const response = await apiClient.get<{ data: Requirement[]; total: number; page: number; limit: number }>('/compliance/requirements', {
        params: filteredParams,
        timeout: 30000, // 30 second timeout for this specific request
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch requirements:', error);
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.error('Request timed out. Try reducing the limit or check backend performance.');
      }
      return { data: [], total: 0, page: 1, limit: 20 };
    }
  },
  getRequirement: async (id: string): Promise<Requirement> => {
    try {
      const response = await apiClient.get<Requirement>(`/compliance/requirements/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch requirement:', error);
      throw error;
    }
  },
  createRequirement: async (data: CreateRequirementData): Promise<Requirement> => {
    try {
      const response = await apiClient.post<Requirement>('/compliance/requirements', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create requirement:', error);
      throw error;
    }
  },
  updateRequirement: async (id: string, data: UpdateRequirementData): Promise<Requirement> => {
    try {
      const response = await apiClient.put<Requirement>(`/compliance/requirements/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update requirement:', error);
      throw error;
    }
  },
  deleteRequirement: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/compliance/requirements/${id}`);
    } catch (error: any) {
      console.error('Failed to delete requirement:', error);
      throw error;
    }
  },
  bulkUpdateRequirementStatus: async (ids: string[], status: string): Promise<{ updated: number; requirements: Requirement[] }> => {
    try {
      const response = await apiClient.patch<{ updated: number; requirements: Requirement[] }>('/compliance/requirements/bulk-update', { ids, status });
      return response.data;
    } catch (error: any) {
      console.error('Failed to bulk update requirements:', error);
      throw error;
    }
  },
};

// Compliance Assessment Types
export type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';

export type ComplianceStatusEnum = 
  | 'not_assessed' 
  | 'compliant' 
  | 'non_compliant' 
  | 'partially_compliant' 
  | 'not_applicable' 
  | 'requires_review';

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  applicable: boolean;
  status: ComplianceStatusEnum;
  message: string;
  details?: Record<string, any>;
}

export interface AssessmentResult {
  assetType: string;
  assetId: string;
  requirementId: string;
  requirementTitle: string;
  status: ComplianceStatusEnum;
  ruleResults: RuleEvaluationResult[];
  recommendations?: string[];
  assessedAt: string;
  assessmentType: 'automatic' | 'manual' | 'scheduled';
}

export interface AssetComplianceStatus {
  assetType: string;
  assetId: string;
  totalRequirements: number;
  compliantCount: number;
  nonCompliantCount: number;
  partiallyCompliantCount: number;
  notAssessedCount: number;
  requiresReviewCount: number;
  notApplicableCount: number;
  overallCompliancePercentage: number;
  requirements: AssessmentResult[];
}

export interface ComplianceGap {
  requirementId: string;
  requirementTitle: string;
  requirementCode: string;
  currentStatus: ComplianceStatusEnum;
  gapDescription: string;
  recommendations: string[];
  missingFields: string[];
  failedRules: RuleEvaluationResult[];
}

export interface BulkAssessmentResult {
  totalAssessed: number;
  successful: number;
  failed: number;
  errors: string[];
  results: AssessmentResult[];
}

// Compliance Assessment API
export const complianceAssessmentApi = {
  assessAssetRequirement: async (
    assetType: AssetType,
    assetId: string,
    requirementId: string
  ): Promise<AssessmentResult> => {
    const response = await apiClient.post<AssessmentResult>(
      `/compliance/assessments/assets/${assetType}/${assetId}/requirements/${requirementId}`
    );
    return response.data;
  },

  assessAsset: async (assetType: AssetType, assetId: string): Promise<AssessmentResult[]> => {
    const response = await apiClient.post<AssessmentResult[]>(
      `/compliance/assessments/assets/${assetType}/${assetId}`
    );
    return response.data;
  },

  getAssetComplianceStatus: async (
    assetType: AssetType,
    assetId: string
  ): Promise<AssetComplianceStatus> => {
    const response = await apiClient.get<AssetComplianceStatus>(
      `/compliance/assessments/assets/${assetType}/${assetId}`
    );
    return response.data;
  },

  getComplianceGaps: async (assetType: AssetType, assetId: string): Promise<ComplianceGap[]> => {
    const response = await apiClient.get<ComplianceGap[]>(
      `/compliance/assessments/assets/${assetType}/${assetId}/gaps`
    );
    return response.data;
  },

  bulkAssess: async (
    assetType: AssetType,
    assetIds: string[]
  ): Promise<BulkAssessmentResult> => {
    const response = await apiClient.post<BulkAssessmentResult>('/compliance/assessments/bulk-assess', {
      assetType,
      assetIds,
    });
    return response.data;
  },
};

// Validation Rule Types
export interface ValidationRuleLogic {
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'exists' | 'not_exists';
    value: any;
  }>;
  complianceCriteria: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  nonComplianceCriteria?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  partialComplianceCriteria?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
}

export interface ValidationRule {
  id: string;
  requirementId: string;
  requirementTitle?: string;
  requirementCode?: string;
  assetType: AssetType;
  ruleName: string;
  ruleDescription?: string;
  validationLogic: ValidationRuleLogic;
  priority: number;
  isActive: boolean;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateValidationRuleData {
  requirementId: string;
  assetType: AssetType;
  ruleName: string;
  ruleDescription?: string;
  validationLogic: ValidationRuleLogic;
  priority?: number;
  isActive?: boolean;
}

export interface UpdateValidationRuleData {
  ruleName?: string;
  ruleDescription?: string;
  validationLogic?: ValidationRuleLogic;
  priority?: number;
  isActive?: boolean;
}

// Validation Rules API
export const validationRulesApi = {
  create: async (data: CreateValidationRuleData): Promise<ValidationRule> => {
    const response = await apiClient.post<ValidationRule>('/compliance/assessments/rules', data);
    return response.data;
  },

  getAll: async (requirementId?: string, assetType?: AssetType): Promise<ValidationRule[]> => {
    const params: any = {};
    if (requirementId) params.requirementId = requirementId;
    if (assetType) params.assetType = assetType;
    
    const response = await apiClient.get<ValidationRule[]>('/compliance/assessments/rules', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ValidationRule> => {
    const response = await apiClient.get<ValidationRule>(`/compliance/assessments/rules/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateValidationRuleData): Promise<ValidationRule> => {
    const response = await apiClient.put<ValidationRule>(`/compliance/assessments/rules/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/compliance/assessments/rules/${id}`);
  },
};

// Asset Compliance List Types
export interface LinkedControl {
  controlId: string;
  controlName: string;
  controlDescription?: string;
  implementationStatus: ImplementationStatus;
  implementationDate?: string;
  lastTestDate?: string;
  lastTestResult?: string;
  effectivenessScore?: number;
  isAutomated: boolean;
  implementationNotes?: string;
}

export interface AssetComplianceSummary {
  assetId: string;
  assetType: AssetType;
  assetName: string;
  assetIdentifier?: string;
  description?: string;
  criticality?: string;
  businessUnit?: string;
  totalRequirements: number;
  compliantCount: number;
  nonCompliantCount: number;
  partiallyCompliantCount: number;
  notAssessedCount: number;
  overallCompliancePercentage: number;
  controlsLinkedCount: number;
  linkedControls: LinkedControl[];
  lastAssessmentDate?: string;
  overallComplianceStatus: ComplianceStatusEnum;
}

export interface AssetComplianceListResponse {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  assets: AssetComplianceSummary[];
  complianceSummary: {
    totalAssets: number;
    compliantAssets: number;
    nonCompliantAssets: number;
    partiallyCompliantAssets: number;
    averageCompliancePercentage: number;
  };
}

// Asset Compliance List API
export const assetComplianceListApi = {
  getAssetComplianceList: async (
    filters?: {
      assetType?: AssetType;
      complianceStatus?: ComplianceStatusEnum;
      businessUnit?: string;
      criticality?: string;
      searchQuery?: string;
    },
    pagination?: { page?: number; pageSize?: number }
  ): Promise<AssetComplianceListResponse> => {
    try {
      const params: any = {
        page: pagination?.page || 1,
        pageSize: pagination?.pageSize || 20,
      };
      if (filters?.assetType) params.assetType = filters.assetType;
      if (filters?.complianceStatus) params.complianceStatus = filters.complianceStatus;
      if (filters?.businessUnit) params.businessUnit = filters.businessUnit;
      if (filters?.criticality) params.criticality = filters.criticality;
      if (filters?.searchQuery) params.searchQuery = filters.searchQuery;

      const response = await apiClient.get<AssetComplianceListResponse>(
        '/compliance/assessments/assets-compliance-list',
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch asset compliance list:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      });
      throw error;
    }
  },
}

