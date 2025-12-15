import { apiClient } from './client';

// Enums
export type RiskStatus = 'identified' | 'assessed' | 'mitigated' | 'accepted' | 'closed';
export type RiskCategory = 'cybersecurity' | 'data_privacy' | 'compliance' | 'operational' | 'financial' | 'strategic' | 'reputational';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ThreatSource = 'internal' | 'external' | 'natural';
export type RiskVelocity = 'slow' | 'medium' | 'fast' | 'immediate';
export type AssessmentType = 'inherent' | 'current' | 'target';
export type TreatmentStrategy = 'mitigate' | 'transfer' | 'avoid' | 'accept';
export type TreatmentStatus = 'planned' | 'in_progress' | 'completed' | 'deferred' | 'cancelled';
export type TreatmentPriority = 'critical' | 'high' | 'medium' | 'low';
export type KRIStatus = 'green' | 'amber' | 'red';
export type KRITrend = 'improving' | 'stable' | 'worsening';
export type RiskAssetType = 'physical' | 'information' | 'software' | 'application' | 'supplier';

// Risk interfaces
export interface Risk {
  id: string;
  risk_id?: string;
  title: string;
  description?: string;
  risk_statement?: string;
  category: RiskCategory;
  category_id?: string;
  category_name?: string;
  sub_category_id?: string;
  sub_category_name?: string;
  status: RiskStatus;
  likelihood: number;
  impact: number;
  ownerId?: string;
  owner_name?: string;
  risk_analyst_id?: string;
  risk_analyst_name?: string;
  date_identified?: string;
  next_review_date?: string;
  last_review_date?: string;
  threat_source?: ThreatSource;
  risk_velocity?: RiskVelocity;
  early_warning_signs?: string;
  status_notes?: string;
  business_process?: string;
  tags?: string[];
  business_unit_ids?: string[];
  version_number?: number;
  inherent_likelihood?: number;
  inherent_impact?: number;
  inherent_risk_score?: number;
  inherent_risk_level?: RiskLevel;
  current_likelihood?: number;
  current_impact?: number;
  current_risk_score?: number;
  current_risk_level?: RiskLevel;
  target_likelihood?: number;
  target_impact?: number;
  target_risk_score?: number;
  target_risk_level?: RiskLevel;
  control_effectiveness?: number;
  linked_assets_count?: number;
  linked_controls_count?: number;
  active_treatments_count?: number;
  kri_count?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRiskData {
  title: string;
  description?: string;
  risk_statement?: string;
  category: RiskCategory;
  category_id?: string;
  sub_category_id?: string;
  status?: RiskStatus;
  likelihood?: number;
  impact?: number;
  ownerId?: string;
  risk_analyst_id?: string;
  date_identified?: string;
  threat_source?: ThreatSource;
  risk_velocity?: RiskVelocity;
  early_warning_signs?: string;
  status_notes?: string;
  business_process?: string;
  tags?: string[];
  business_unit_ids?: string[];
  next_review_date?: string;
  inherent_likelihood?: number;
  inherent_impact?: number;
  current_likelihood?: number;
  current_impact?: number;
  target_likelihood?: number;
  target_impact?: number;
}

export interface UpdateRiskData extends Partial<CreateRiskData> {}

export interface RiskQueryParams {
  search?: string;
  status?: string;
  category?: string;
  category_id?: string;
  current_risk_level?: RiskLevel;
  likelihood?: number;
  impact?: number;
  ownerId?: string;
  page?: number;
  limit?: number;
}

export interface RiskListResponse {
  data: Risk[];
  total: number;
  page: number;
  limit: number;
}

export interface RiskHeatmapCell {
  likelihood: number;
  impact: number;
  count: number;
  riskScore: number;
  riskIds: string[];
  riskLevel: RiskLevel;
}

export interface RiskHeatmapData {
  cells: RiskHeatmapCell[];
  totalRisks: number;
  maxRiskScore: number;
  heatmap?: {
    cells: RiskHeatmapCell[];
    total_risks: number;
    critical_count: number;
    high_count: number;
    medium_count: number;
    low_count: number;
  };
}

export interface RiskDashboardSummary {
  total_risks: number;
  critical_risks: number;
  high_risks: number;
  medium_risks: number;
  low_risks: number;
  risks_exceeding_appetite: number;
  overdue_reviews: number;
  active_treatments: number;
  kri_red_count: number;
  kri_amber_count: number;
}

// Risk Category interfaces
export interface RiskCategoryData {
  id: string;
  name: string;
  code: string;
  description?: string;
  parent_category_id?: string;
  risk_tolerance: 'low' | 'medium' | 'high';
  is_active: boolean;
  display_order: number;
  color?: string;
  icon?: string;
  sub_categories?: RiskCategoryData[];
  created_at: string;
  updated_at: string;
}

// Risk Assessment interfaces
export interface RiskAssessment {
  id: string;
  risk_id: string;
  assessment_type: AssessmentType;
  likelihood: number;
  impact: number;
  risk_score: number;
  risk_level: RiskLevel;
  financial_impact?: string;
  financial_impact_amount?: number;
  operational_impact?: string;
  reputational_impact?: string;
  compliance_impact?: string;
  safety_impact?: string;
  assessment_date: string;
  assessor_id?: string;
  assessor_name?: string;
  assessment_method: string;
  assessment_notes?: string;
  assumptions?: string;
  confidence_level: 'high' | 'medium' | 'low';
  is_latest: boolean;
  created_at: string;
}

export interface CreateAssessmentData {
  risk_id: string;
  assessment_type: AssessmentType;
  likelihood: number;
  impact: number;
  financial_impact?: string;
  financial_impact_amount?: number;
  operational_impact?: string;
  reputational_impact?: string;
  compliance_impact?: string;
  safety_impact?: string;
  assessment_date?: string;
  assessment_method?: string;
  assessment_notes?: string;
  assumptions?: string;
  confidence_level?: 'high' | 'medium' | 'low';
}

// Risk Treatment interfaces
export interface RiskTreatment {
  id: string;
  treatment_id: string;
  risk_id: string;
  risk_title?: string;
  strategy: TreatmentStrategy;
  title: string;
  description?: string;
  treatment_owner_id?: string;
  treatment_owner_name?: string;
  status: TreatmentStatus;
  priority: TreatmentPriority;
  start_date?: string;
  target_completion_date?: string;
  actual_completion_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  expected_risk_reduction?: string;
  residual_likelihood?: number;
  residual_impact?: number;
  residual_risk_score?: number;
  progress_percentage: number;
  progress_notes?: string;
  implementation_notes?: string;
  linked_control_ids?: string[];
  tasks?: TreatmentTask[];
  total_tasks?: number;
  completed_tasks?: number;
  due_status?: 'on_track' | 'due_soon' | 'overdue' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface TreatmentTask {
  id: string;
  title: string;
  description?: string;
  assignee_id?: string;
  assignee_name?: string;
  status: string;
  due_date?: string;
  completed_date?: string;
  display_order: number;
}

export interface CreateTreatmentData {
  risk_id: string;
  strategy: TreatmentStrategy;
  title: string;
  description?: string;
  treatment_owner_id?: string;
  status?: TreatmentStatus;
  priority?: TreatmentPriority;
  start_date?: string;
  target_completion_date?: string;
  estimated_cost?: number;
  expected_risk_reduction?: string;
  residual_likelihood?: number;
  residual_impact?: number;
  implementation_notes?: string;
  linked_control_ids?: string[];
}

// KRI interfaces
export interface KRI {
  id: string;
  kri_id: string;
  name: string;
  description?: string;
  category_id?: string;
  category_name?: string;
  measurement_unit?: string;
  measurement_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  data_source?: string;
  calculation_method?: string;
  threshold_green?: number;
  threshold_amber?: number;
  threshold_red?: number;
  threshold_direction: string;
  current_value?: number;
  current_status?: KRIStatus;
  trend?: KRITrend;
  kri_owner_id?: string;
  owner_name?: string;
  is_active: boolean;
  last_measured_at?: string;
  next_measurement_due?: string;
  target_value?: number;
  baseline_value?: number;
  tags?: string[];
  linked_risks_count?: number;
  measurement_due_status?: 'on_track' | 'due_soon' | 'overdue';
  created_at: string;
  updated_at: string;
}

export interface KRIMeasurement {
  id: string;
  kri_id: string;
  measurement_date: string;
  value: number;
  status?: KRIStatus;
  notes?: string;
  measured_by?: string;
  measurer_name?: string;
  created_at: string;
}

// Risk Link interfaces
export interface RiskAssetLink {
  id: string;
  risk_id: string;
  asset_type: RiskAssetType;
  asset_id: string;
  impact_description?: string;
  asset_criticality_at_link?: string;
  linked_by?: string;
  linked_at: string;
}

export interface RiskControlLink {
  id: string;
  risk_id: string;
  control_id: string;
  effectiveness_rating?: number;
  effectiveness_type: string;
  effectiveness_percentage?: number;
  control_type_for_risk?: string;
  notes?: string;
  linked_by?: string;
  linked_at: string;
  control_info?: {
    control_identifier: string;
    title: string;
    control_type?: string;
    implementation_status?: string;
  };
}

export type RiskFindingRelationshipType = 'identified' | 'contributes_to' | 'mitigates' | 'exacerbates' | 'related';

export interface RiskFindingLink {
  id: string;
  risk_id: string;
  finding_id: string;
  relationship_type?: RiskFindingRelationshipType;
  notes?: string;
  linked_by?: string;
  linked_at: string;
  risk_info?: {
    risk_id: string;
    title: string;
    current_risk_level?: string;
    current_risk_score?: number;
  };
  finding_info?: {
    finding_identifier: string;
    title: string;
    severity?: string;
    status?: string;
  };
}

export interface CreateRiskFindingLinkData {
  risk_id: string;
  finding_id: string;
  relationship_type?: RiskFindingRelationshipType;
  notes?: string;
}

export interface UpdateRiskFindingLinkData {
  relationship_type?: RiskFindingRelationshipType;
  notes?: string;
}

// API functions
// Helper to validate enum values
const isValidRiskStatus = (value: any): value is RiskStatus => {
  return ['identified', 'assessed', 'mitigated', 'accepted', 'closed'].includes(value);
};

const isValidRiskCategory = (value: any): value is RiskCategory => {
  return ['cybersecurity', 'data_privacy', 'compliance', 'operational', 'financial', 'strategic', 'reputational'].includes(value);
};

const isValidRiskLevel = (value: any): value is RiskLevel => {
  return ['low', 'medium', 'high', 'critical'].includes(value);
};

export const risksApi = {
  // Risk CRUD
  getAll: async (params?: RiskQueryParams): Promise<RiskListResponse> => {
    try {
      // Clean up params - remove undefined, null, and empty string values
      const cleanParams: Record<string, any> = {};
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          // Skip undefined, null, empty strings, and empty arrays
          if (value === undefined || value === null || value === '') {
            return;
          }
          
          // Convert page and limit to numbers, ensure they're valid
          if (key === 'page' || key === 'limit') {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue > 0) {
              cleanParams[key] = numValue;
            }
          } 
          // Validate enum values
          else if (key === 'status' && !isValidRiskStatus(value)) {
            console.warn(`Invalid status value: ${value}, skipping`);
            return;
          }
          else if (key === 'category' && !isValidRiskCategory(value)) {
            console.warn(`Invalid category value: ${value}, skipping`);
            return;
          }
          else if (key === 'current_risk_level' && !isValidRiskLevel(value)) {
            console.warn(`Invalid risk level value: ${value}, skipping`);
            return;
          }
          // Validate UUIDs
          else if ((key === 'category_id' || key === 'ownerId') && typeof value === 'string') {
            // Basic UUID validation
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(value)) {
              console.warn(`Invalid UUID for ${key}: ${value}, skipping`);
              return;
            }
            cleanParams[key] = value;
          }
          // Validate numeric enums (likelihood, impact)
          else if ((key === 'likelihood' || key === 'impact') && typeof value === 'number') {
            if (value >= 1 && value <= 5) {
              cleanParams[key] = value;
            } else {
              console.warn(`Invalid ${key} value: ${value}, must be between 1-5, skipping`);
              return;
            }
          }
          else {
            cleanParams[key] = value;
          }
        });
      }
      
      // Ensure page and limit have sane defaults and constraints
      if (!cleanParams.page || cleanParams.page < 1) cleanParams.page = 1;
      if (!cleanParams.limit || cleanParams.limit < 1) cleanParams.limit = 20;
      // Backend validation caps limit at 100; clamp to avoid 400 errors
      if (cleanParams.limit > 100) cleanParams.limit = 100;
      
      // Log what we're sending for debugging
      console.log('Sending params to /risks:', cleanParams);
      
      const response = await apiClient.get<RiskListResponse>('/risks', { params: cleanParams });
      console.log('Risks API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch risks:', error);
      console.error('Error details:', error.response?.data || error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error config:', error.config?.url);
      console.error('Full error response:', JSON.stringify(error.response?.data, null, 2));
      console.error('Request headers:', JSON.stringify(error.config?.headers, null, 2));
      console.error('Request params:', JSON.stringify(error.config?.params, null, 2));
      console.error('Request URL:', error.config?.url);
      console.error('Full error object:', error);
      
      // If it's a 401, throw the error so the app can handle authentication
      if (error.response?.status === 401) {
        throw error;
      }
      
      // Return empty array but log the error for debugging
      return { data: [], total: 0, page: 1, limit: 20 };
    }
  },

  getById: async (id: string): Promise<Risk> => {
    const response = await apiClient.get<Risk>(`/risks/${id}`);
    return response.data;
  },

  create: async (data: CreateRiskData): Promise<Risk> => {
    const response = await apiClient.post<Risk>('/risks', data);
    return response.data;
  },

  update: async (id: string, data: UpdateRiskData): Promise<Risk> => {
    const response = await apiClient.put<Risk>(`/risks/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/risks/${id}`);
  },

  bulkUpdateStatus: async (ids: string[], status: string): Promise<{ updated: number; risks: Risk[] }> => {
    const response = await apiClient.patch<{ updated: number; risks: Risk[] }>('/risks/bulk-update', { ids, status });
    return response.data;
  },

  // Heatmap and Dashboard
  getHeatmap: async (): Promise<RiskHeatmapData> => {
    const response = await apiClient.get<RiskHeatmapData>('/risks/heatmap');
    return response.data;
  },

  getDashboardSummary: async (): Promise<RiskDashboardSummary> => {
    const response = await apiClient.get<RiskDashboardSummary>('/risks/dashboard/summary');
    return response.data;
  },

  getTopRisks: async (limit = 10): Promise<Risk[]> => {
    const response = await apiClient.get<Risk[]>('/risks/dashboard/top', { params: { limit } });
    return response.data;
  },

  getRisksNeedingReview: async (days = 7): Promise<Risk[]> => {
    const response = await apiClient.get<Risk[]>('/risks/dashboard/review-due', { params: { days } });
    return response.data;
  },
};

// Risk Categories API
export const riskCategoriesApi = {
  getAll: async (includeInactive = false, hierarchical = false): Promise<RiskCategoryData[]> => {
    const response = await apiClient.get<RiskCategoryData[]>('/risk-categories', {
      params: { includeInactive, hierarchical },
    });
    return response.data;
  },

  getById: async (id: string): Promise<RiskCategoryData> => {
    const response = await apiClient.get<RiskCategoryData>(`/risk-categories/${id}`);
    return response.data;
  },

  create: async (data: Partial<RiskCategoryData>): Promise<RiskCategoryData> => {
    const response = await apiClient.post<RiskCategoryData>('/risk-categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<RiskCategoryData>): Promise<RiskCategoryData> => {
    const response = await apiClient.put<RiskCategoryData>(`/risk-categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/risk-categories/${id}`);
  },

  toggleActive: async (id: string, isActive: boolean): Promise<RiskCategoryData> => {
    const response = await apiClient.patch<RiskCategoryData>(`/risk-categories/${id}/toggle-active`, { isActive });
    return response.data;
  },
};

// Risk Assessment Requests API
export interface RiskAssessmentRequest {
  id: string;
  request_identifier: string;
  risk_id: string;
  risk_title?: string;
  risk_identifier?: string;
  requested_by_id: string;
  requested_by_name?: string;
  requested_by_email?: string;
  requested_for_id?: string;
  requested_for_name?: string;
  requested_for_email?: string;
  assessment_type: AssessmentType;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  justification?: string;
  notes?: string;
  approval_workflow_id?: string;
  approved_by_id?: string;
  approved_by_name?: string;
  approved_at?: string;
  rejected_by_id?: string;
  rejected_by_name?: string;
  rejected_at?: string;
  rejection_reason?: string;
  completed_at?: string;
  resulting_assessment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRiskAssessmentRequestData {
  risk_id: string;
  requested_for_id?: string;
  assessment_type: AssessmentType;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  due_date?: string;
  justification?: string;
  notes?: string;
}

export interface UpdateRiskAssessmentRequestData {
  requested_for_id?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  status?: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  justification?: string;
  notes?: string;
  rejection_reason?: string;
}

export const riskAssessmentRequestsApi = {
  getAll: async (params?: {
    riskId?: string;
    requestedById?: string;
    requestedForId?: string;
    status?: string;
    assessmentType?: string;
  }): Promise<RiskAssessmentRequest[]> => {
    const response = await apiClient.get<RiskAssessmentRequest[]>('/risk-assessment-requests', { params });
    return response.data;
  },

  getById: async (id: string): Promise<RiskAssessmentRequest> => {
    const response = await apiClient.get<RiskAssessmentRequest>(`/risk-assessment-requests/${id}`);
    return response.data;
  },

  getByRiskId: async (riskId: string): Promise<RiskAssessmentRequest[]> => {
    const response = await apiClient.get<RiskAssessmentRequest[]>(`/risk-assessment-requests/risk/${riskId}`);
    return response.data;
  },

  getPending: async (): Promise<RiskAssessmentRequest[]> => {
    const response = await apiClient.get<RiskAssessmentRequest[]>('/risk-assessment-requests/pending');
    return response.data;
  },

  create: async (data: CreateRiskAssessmentRequestData): Promise<RiskAssessmentRequest> => {
    const response = await apiClient.post<RiskAssessmentRequest>('/risk-assessment-requests', data);
    return response.data;
  },

  update: async (id: string, data: UpdateRiskAssessmentRequestData): Promise<RiskAssessmentRequest> => {
    const response = await apiClient.put<RiskAssessmentRequest>(`/risk-assessment-requests/${id}`, data);
    return response.data;
  },

  approve: async (id: string): Promise<RiskAssessmentRequest> => {
    const response = await apiClient.patch<RiskAssessmentRequest>(`/risk-assessment-requests/${id}/approve`);
    return response.data;
  },

  reject: async (id: string, reason?: string): Promise<RiskAssessmentRequest> => {
    const response = await apiClient.patch<RiskAssessmentRequest>(`/risk-assessment-requests/${id}/reject`, { reason });
    return response.data;
  },

  cancel: async (id: string): Promise<RiskAssessmentRequest> => {
    const response = await apiClient.patch<RiskAssessmentRequest>(`/risk-assessment-requests/${id}/cancel`);
    return response.data;
  },

  markInProgress: async (id: string): Promise<RiskAssessmentRequest> => {
    const response = await apiClient.patch<RiskAssessmentRequest>(`/risk-assessment-requests/${id}/in-progress`);
    return response.data;
  },

  complete: async (id: string, assessmentId: string): Promise<RiskAssessmentRequest> => {
    const response = await apiClient.patch<RiskAssessmentRequest>(`/risk-assessment-requests/${id}/complete`, { assessmentId });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/risk-assessment-requests/${id}`);
  },
};

// Risk Assessments API
export const riskAssessmentsApi = {
  getByRiskId: async (riskId: string, type?: AssessmentType): Promise<RiskAssessment[]> => {
    const response = await apiClient.get<RiskAssessment[]>(`/risk-assessments/risk/${riskId}`, {
      params: type ? { type } : undefined,
    });
    return response.data;
  },

  getLatest: async (riskId: string): Promise<{ inherent?: RiskAssessment; current?: RiskAssessment; target?: RiskAssessment }> => {
    const response = await apiClient.get(`/risk-assessments/risk/${riskId}/latest`);
    return response.data;
  },

  compare: async (riskId: string): Promise<any> => {
    const response = await apiClient.get(`/risk-assessments/risk/${riskId}/compare`);
    return response.data;
  },

  create: async (data: CreateAssessmentData): Promise<RiskAssessment> => {
    const response = await apiClient.post<RiskAssessment>('/risk-assessments', data);
    return response.data;
  },
};

// Risk Treatments API
export const riskTreatmentsApi = {
  getAll: async (params?: { status?: TreatmentStatus; priority?: TreatmentPriority; riskId?: string }): Promise<RiskTreatment[]> => {
    // Clean up params - remove undefined, null, and empty string values
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanParams[key] = value;
        }
      });
    }
    const response = await apiClient.get<RiskTreatment[]>('/risk-treatments', { params: cleanParams });
    return response.data;
  },

  getByRiskId: async (riskId: string): Promise<RiskTreatment[]> => {
    const response = await apiClient.get<RiskTreatment[]>(`/risk-treatments/risk/${riskId}`);
    return response.data;
  },

  getById: async (id: string): Promise<RiskTreatment> => {
    const response = await apiClient.get<RiskTreatment>(`/risk-treatments/${id}`);
    return response.data;
  },

  getSummary: async (): Promise<any> => {
    const response = await apiClient.get('/risk-treatments/summary');
    return response.data;
  },

  getOverdue: async (): Promise<RiskTreatment[]> => {
    const response = await apiClient.get<RiskTreatment[]>('/risk-treatments/overdue');
    return response.data;
  },

  create: async (data: CreateTreatmentData): Promise<RiskTreatment> => {
    const response = await apiClient.post<RiskTreatment>('/risk-treatments', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateTreatmentData>): Promise<RiskTreatment> => {
    const response = await apiClient.put<RiskTreatment>(`/risk-treatments/${id}`, data);
    return response.data;
  },

  updateProgress: async (id: string, progress: number, notes?: string): Promise<RiskTreatment> => {
    const response = await apiClient.patch<RiskTreatment>(`/risk-treatments/${id}/progress`, { progress, notes });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/risk-treatments/${id}`);
  },

  // Task management
  addTask: async (treatmentId: string, task: { title: string; description?: string; assignee_id?: string; due_date?: string }): Promise<TreatmentTask> => {
    const response = await apiClient.post<TreatmentTask>(`/risk-treatments/${treatmentId}/tasks`, task);
    return response.data;
  },

  updateTask: async (taskId: string, data: Partial<TreatmentTask>): Promise<TreatmentTask> => {
    const response = await apiClient.put<TreatmentTask>(`/risk-treatments/tasks/${taskId}`, data);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await apiClient.delete(`/risk-treatments/tasks/${taskId}`);
  },
};

// KRIs API
export const krisApi = {
  getAll: async (params?: { categoryId?: string; status?: KRIStatus; isActive?: boolean }): Promise<KRI[]> => {
    const response = await apiClient.get<KRI[]>('/kris', { params });
    return response.data;
  },

  getById: async (id: string): Promise<KRI> => {
    const response = await apiClient.get<KRI>(`/kris/${id}`);
    return response.data;
  },

  getByRiskId: async (riskId: string): Promise<KRI[]> => {
    const response = await apiClient.get<KRI[]>(`/kris/risk/${riskId}`);
    return response.data;
  },

  getSummary: async (): Promise<any> => {
    const response = await apiClient.get('/kris/summary');
    return response.data;
  },

  getRequiringAttention: async (): Promise<KRI[]> => {
    const response = await apiClient.get<KRI[]>('/kris/attention');
    return response.data;
  },

  create: async (data: Partial<KRI>): Promise<KRI> => {
    const response = await apiClient.post<KRI>('/kris', data);
    return response.data;
  },

  update: async (id: string, data: Partial<KRI>): Promise<KRI> => {
    const response = await apiClient.put<KRI>(`/kris/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/kris/${id}`);
  },

  // Measurements
  getMeasurements: async (kriId: string, limit = 50): Promise<KRIMeasurement[]> => {
    const response = await apiClient.get<KRIMeasurement[]>(`/kris/${kriId}/measurements`, { params: { limit } });
    return response.data;
  },

  addMeasurement: async (kriId: string, data: { measurement_date: string; value: number; notes?: string }): Promise<KRIMeasurement> => {
    const response = await apiClient.post<KRIMeasurement>(`/kris/${kriId}/measure`, data);
    return response.data;
  },

  // Risk links
  linkToRisk: async (kriId: string, riskId: string, data?: { relationship_type?: string; notes?: string }): Promise<void> => {
    await apiClient.post(`/kris/${kriId}/risks/${riskId}`, data || {});
  },

  unlinkFromRisk: async (kriId: string, riskId: string): Promise<void> => {
    await apiClient.delete(`/kris/${kriId}/risks/${riskId}`);
  },
};

// Risk Links API
export const riskLinksApi = {
  // Asset links
  getAssetsByRisk: async (riskId: string): Promise<RiskAssetLink[]> => {
    const response = await apiClient.get<RiskAssetLink[]>(`/risk-links/assets/risk/${riskId}`);
    return response.data;
  },

  getRisksByAsset: async (assetType: RiskAssetType, assetId: string): Promise<any[]> => {
    const response = await apiClient.get(`/risk-links/assets/asset/${assetType}/${assetId}`);
    return response.data;
  },

  getAssetRiskScore: async (assetType: RiskAssetType, assetId: string): Promise<any> => {
    const response = await apiClient.get(`/risk-links/assets/asset/${assetType}/${assetId}/score`);
    return response.data;
  },

  linkAsset: async (data: { risk_id: string; asset_type: RiskAssetType; asset_id: string; impact_description?: string }): Promise<RiskAssetLink> => {
    const response = await apiClient.post<RiskAssetLink>('/risk-links/assets', data);
    return response.data;
  },

  bulkLinkAssets: async (riskId: string, assets: { asset_type: RiskAssetType; asset_id: string; impact_description?: string }[]): Promise<RiskAssetLink[]> => {
    const response = await apiClient.post<RiskAssetLink[]>('/risk-links/assets/bulk', { risk_id: riskId, assets });
    return response.data;
  },

  unlinkAsset: async (linkId: string): Promise<void> => {
    await apiClient.delete(`/risk-links/assets/${linkId}`);
  },

  // Control links
  getControlsByRisk: async (riskId: string): Promise<RiskControlLink[]> => {
    const response = await apiClient.get<RiskControlLink[]>(`/risk-links/controls/risk/${riskId}`);
    return response.data;
  },

  getRisksByControl: async (controlId: string): Promise<any[]> => {
    const response = await apiClient.get(`/risk-links/controls/control/${controlId}`);
    return response.data;
  },

  getControlEffectiveness: async (riskId: string): Promise<any> => {
    const response = await apiClient.get(`/risk-links/controls/risk/${riskId}/effectiveness`);
    return response.data;
  },

  getRisksWithoutControls: async (): Promise<any[]> => {
    const response = await apiClient.get('/risk-links/controls/without-controls');
    return response.data;
  },

  linkControl: async (data: { risk_id: string; control_id: string; effectiveness_rating?: number; notes?: string }): Promise<RiskControlLink> => {
    const response = await apiClient.post<RiskControlLink>('/risk-links/controls', data);
    return response.data;
  },

  updateControlLink: async (linkId: string, data: { effectiveness_rating?: number; notes?: string }): Promise<RiskControlLink> => {
    const response = await apiClient.put<RiskControlLink>(`/risk-links/controls/${linkId}`, data);
    return response.data;
  },

  unlinkControl: async (linkId: string): Promise<void> => {
    await apiClient.delete(`/risk-links/controls/${linkId}`);
  },

  // Finding links
  getFindingsByRisk: async (riskId: string): Promise<any[]> => {
    const response = await apiClient.get(`/risk-links/findings/risk/${riskId}`);
    return response.data;
  },

  getRisksByFinding: async (findingId: string): Promise<any[]> => {
    const response = await apiClient.get(`/risk-links/findings/finding/${findingId}`);
    return response.data;
  },

  linkFinding: async (data: CreateRiskFindingLinkData): Promise<RiskFindingLink> => {
    const response = await apiClient.post<RiskFindingLink>('/risk-links/findings', data);
    return response.data;
  },

  updateFindingLink: async (linkId: string, data: UpdateRiskFindingLinkData): Promise<RiskFindingLink> => {
    const response = await apiClient.put<RiskFindingLink>(`/risk-links/findings/${linkId}`, data);
    return response.data;
  },

  unlinkFinding: async (linkId: string): Promise<void> => {
    await apiClient.delete(`/risk-links/findings/${linkId}`);
  },
};

// =====================
// Risk Settings Types
// =====================

export interface RiskLevelConfig {
  level: string;
  minScore: number;
  maxScore: number;
  color: string;
  description: string;
  responseTime: string;
  escalation: boolean;
}

export interface AssessmentMethodConfig {
  id: string;
  name: string;
  description: string;
  likelihoodScale: number;
  impactScale: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface ScaleDescription {
  value: number;
  label: string;
  description: string;
}

export interface RiskSettings {
  id: string;
  organization_id?: string;
  risk_levels: RiskLevelConfig[];
  assessment_methods: AssessmentMethodConfig[];
  likelihood_scale: ScaleDescription[];
  impact_scale: ScaleDescription[];
  max_acceptable_risk_score: number;
  risk_acceptance_authority: string;
  default_review_period_days: number;
  auto_calculate_risk_score: boolean;
  require_assessment_evidence: boolean;
  enable_risk_appetite: boolean;
  default_assessment_method: string;
  notify_on_high_risk: boolean;
  notify_on_critical_risk: boolean;
  notify_on_review_due: boolean;
  review_reminder_days: number;
  version: number;
  created_at: string;
  updated_at: string;
  updated_by_name?: string;
}

export interface UpdateRiskSettingsData {
  risk_levels?: RiskLevelConfig[];
  assessment_methods?: AssessmentMethodConfig[];
  likelihood_scale?: ScaleDescription[];
  impact_scale?: ScaleDescription[];
  max_acceptable_risk_score?: number;
  risk_acceptance_authority?: string;
  default_review_period_days?: number;
  auto_calculate_risk_score?: boolean;
  require_assessment_evidence?: boolean;
  enable_risk_appetite?: boolean;
  default_assessment_method?: string;
  notify_on_high_risk?: boolean;
  notify_on_critical_risk?: boolean;
  notify_on_review_due?: boolean;
  review_reminder_days?: number;
}

// =====================
// Risk Settings API
// =====================

export const riskSettingsApi = {
  // Get current risk settings
  getSettings: async (): Promise<RiskSettings> => {
    const response = await apiClient.get<RiskSettings>('/risk-settings');
    return response.data;
  },

  // Update risk settings
  updateSettings: async (data: UpdateRiskSettingsData): Promise<RiskSettings> => {
    const response = await apiClient.put<RiskSettings>('/risk-settings', data);
    return response.data;
  },

  // Reset settings to defaults
  resetToDefaults: async (): Promise<RiskSettings> => {
    const response = await apiClient.post<RiskSettings>('/risk-settings/reset');
    return response.data;
  },

  // Get risk level for a score
  getRiskLevelForScore: async (score: number): Promise<{
    level: string;
    color: string;
    description: string;
    responseTime: string;
    escalation: boolean;
  } | null> => {
    const response = await apiClient.get(`/risk-settings/risk-level`, { params: { score } });
    return response.data;
  },

  // Check if score exceeds risk appetite
  checkRiskAppetite: async (score: number): Promise<{
    score: number;
    exceedsAppetite: boolean;
    maxAcceptable: number;
  }> => {
    const response = await apiClient.get(`/risk-settings/check-appetite`, { params: { score } });
    return response.data;
  },

  // Get active assessment methods
  getAssessmentMethods: async (): Promise<{
    id: string;
    name: string;
    description: string;
    likelihoodScale: number;
    impactScale: number;
    isDefault: boolean;
  }[]> => {
    const response = await apiClient.get('/risk-settings/assessment-methods');
    return response.data;
  },

  // Get likelihood scale
  getLikelihoodScale: async (): Promise<ScaleDescription[]> => {
    const response = await apiClient.get('/risk-settings/likelihood-scale');
    return response.data;
  },

  // Get impact scale
  getImpactScale: async (): Promise<ScaleDescription[]> => {
    const response = await apiClient.get('/risk-settings/impact-scale');
    return response.data;
  },
};

// =====================
// Advanced Features Types
// =====================

export interface RiskComparisonData {
  id: string;
  risk_id: string;
  title: string;
  category_name?: string;
  status?: string;
  owner_name?: string;
  inherent_likelihood?: number;
  inherent_impact?: number;
  inherent_risk_score?: number;
  inherent_risk_level?: string;
  current_likelihood?: number;
  current_impact?: number;
  current_risk_score?: number;
  current_risk_level?: string;
  target_likelihood?: number;
  target_impact?: number;
  target_risk_score?: number;
  target_risk_level?: string;
  control_effectiveness?: number;
  linked_controls_count?: number;
  linked_assets_count?: number;
  active_treatments_count?: number;
  kri_count?: number;
  risk_reduction_percentage?: number;
  gap_to_target?: number;
}

export interface RiskComparisonResponse {
  risks: RiskComparisonData[];
  summary: {
    total_risks: number;
    average_current_score: number;
    highest_risk: { id: string; title: string; score: number };
    lowest_risk: { id: string; title: string; score: number };
    average_control_effectiveness: number;
    total_linked_controls: number;
    total_active_treatments: number;
  };
  comparison_matrix: {
    metric: string;
    values: { risk_id: string; value: number | string }[];
    variance?: number;
  }[];
}

export interface WhatIfScenarioRequest {
  risk_id: string;
  simulated_likelihood?: number;
  simulated_impact?: number;
  simulated_control_effectiveness?: number;
  additional_controls?: number;
}

export interface WhatIfScenarioResponse {
  original: {
    likelihood: number;
    impact: number;
    risk_score: number;
    risk_level: string;
    control_effectiveness: number;
  };
  simulated: {
    likelihood: number;
    impact: number;
    risk_score: number;
    risk_level: string;
    control_effectiveness: number;
  };
  impact_analysis: {
    score_change: number;
    score_change_percentage: number;
    level_changed: boolean;
    old_level: string;
    new_level: string;
    exceeds_appetite: boolean;
    appetite_threshold: number;
    recommendation: string;
  };
  risk_level_details?: {
    color: string;
    description: string;
    response_time: string;
    requires_escalation: boolean;
  };
}

export interface CustomReportConfig {
  name: string;
  fields: string[];
  risk_levels?: string[];
  categories?: string[];
  statuses?: string[];
  owner_ids?: string[];
  exceeds_appetite_only?: boolean;
  sort_by?: string;
  sort_direction?: 'ASC' | 'DESC';
  group_by?: string;
  include_summary?: boolean;
}

export interface ReportField {
  field: string;
  label: string;
  category: string;
}

export interface CustomReportResponse {
  report_name: string;
  generated_at: string;
  filters_applied: Record<string, any>;
  data: any[];
  summary?: Record<string, any>;
  grouped_data?: Record<string, any[]>;
}

// =====================
// Risk Advanced API
// =====================

export const riskAdvancedApi = {
  // Compare multiple risks
  compareRisks: async (riskIds: string[]): Promise<RiskComparisonResponse> => {
    const response = await apiClient.post<RiskComparisonResponse>('/risks/advanced/compare', {
      risk_ids: riskIds,
    });
    return response.data;
  },

  // Quick compare using GET
  quickCompare: async (riskIds: string[]): Promise<RiskComparisonResponse> => {
    const response = await apiClient.get<RiskComparisonResponse>('/risks/advanced/quick-compare', {
      params: { ids: riskIds.join(',') },
    });
    return response.data;
  },

  // What-If Analysis
  simulateWhatIf: async (request: WhatIfScenarioRequest): Promise<WhatIfScenarioResponse> => {
    const response = await apiClient.post<WhatIfScenarioResponse>('/risks/advanced/what-if', request);
    return response.data;
  },

  // Quick What-If using GET
  quickWhatIf: async (
    riskId: string,
    params: {
      likelihood?: number;
      impact?: number;
      control_effectiveness?: number;
      additional_controls?: number;
    }
  ): Promise<WhatIfScenarioResponse> => {
    const response = await apiClient.get<WhatIfScenarioResponse>('/risks/advanced/quick-whatif', {
      params: { risk_id: riskId, ...params },
    });
    return response.data;
  },

  // Batch What-If (multiple scenarios)
  batchWhatIf: async (
    riskId: string,
    scenarios: Omit<WhatIfScenarioRequest, 'risk_id'>[]
  ): Promise<WhatIfScenarioResponse[]> => {
    const response = await apiClient.post<WhatIfScenarioResponse[]>('/risks/advanced/what-if/batch', {
      risk_id: riskId,
      scenarios,
    });
    return response.data;
  },

  // Generate Custom Report
  generateReport: async (config: CustomReportConfig): Promise<CustomReportResponse> => {
    const response = await apiClient.post<CustomReportResponse>('/risks/advanced/reports/generate', config);
    return response.data;
  },

  // Get available report fields
  getReportFields: async (): Promise<ReportField[]> => {
    const response = await apiClient.get<ReportField[]>('/risks/advanced/reports/fields');
    return response.data;
  },
};
