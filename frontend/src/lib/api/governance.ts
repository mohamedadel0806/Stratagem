import { apiClient } from './client';

// Influencer Types
export enum InfluencerCategory {
  INTERNAL = 'internal',
  CONTRACTUAL = 'contractual',
  STATUTORY = 'statutory',
  REGULATORY = 'regulatory',
  INDUSTRY_STANDARD = 'industry_standard',
}

export enum InfluencerStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUPERSEDED = 'superseded',
  RETIRED = 'retired',
}

export enum ApplicabilityStatus {
  APPLICABLE = 'applicable',
  NOT_APPLICABLE = 'not_applicable',
  UNDER_REVIEW = 'under_review',
}

export interface Influencer {
  id: string;
  name: string;
  category: InfluencerCategory;
  sub_category?: string;
  issuing_authority?: string;
  jurisdiction?: string;
  reference_number?: string;
  description?: string;
  publication_date?: string;
  effective_date?: string;
  last_revision_date?: string;
  next_review_date?: string;
  status: InfluencerStatus;
  applicability_status: ApplicabilityStatus;
  applicability_justification?: string;
  applicability_assessment_date?: string;
  applicability_criteria?: Record<string, any>;
  source_url?: string;
  source_document_path?: string;
  owner_id?: string;
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  business_units_affected?: string[];
  tags?: string[];
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateInfluencerData {
  name: string;
  category: InfluencerCategory;
  sub_category?: string;
  issuing_authority?: string;
  jurisdiction?: string;
  reference_number?: string;
  description?: string;
  publication_date?: string;
  effective_date?: string;
  last_revision_date?: string;
  next_review_date?: string;
  status?: InfluencerStatus;
  applicability_status?: ApplicabilityStatus;
  applicability_justification?: string;
  applicability_assessment_date?: string;
  applicability_criteria?: Record<string, any>;
  source_url?: string;
  owner_id?: string;
  business_units_affected?: string[];
  tags?: string[];
  custom_fields?: Record<string, any>;
}

export interface InfluencerQueryParams {
  page?: number;
  limit?: number;
  category?: InfluencerCategory;
  status?: InfluencerStatus;
  applicability_status?: ApplicabilityStatus;
  search?: string;
  sort?: string;
}

export interface InfluencerListResponse {
  data: Influencer[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Policy Types
export enum PolicyStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum ReviewFrequency {
  ANNUAL = 'annual',
  BIENNIAL = 'biennial',
  TRIENNIAL = 'triennial',
  QUARTERLY = 'quarterly',
  MONTHLY = 'monthly',
  AS_NEEDED = 'as_needed',
}

export interface Policy {
  id: string;
  policy_type: string;
  title: string;
  version: string;
  version_number: number;
  content?: string;
  purpose?: string;
  scope?: string;
  owner_id?: string;
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  business_units?: string[];
  status: PolicyStatus;
  approval_date?: string;
  effective_date?: string;
  review_frequency: ReviewFrequency;
  next_review_date?: string;
  published_date?: string;
  linked_influencers?: string[];
  supersedes_policy_id?: string;
  attachments?: Array<{ filename: string; path: string; upload_date: string; uploaded_by: string }>;
  tags?: string[];
  custom_fields?: Record<string, any>;
  requires_acknowledgment: boolean;
  acknowledgment_due_days: number;
  control_objectives?: ControlObjective[];
  created_at: string;
  updated_at: string;
}

export interface CreatePolicyData {
  policy_type: string;
  title: string;
  content?: string;
  purpose?: string;
  scope?: string;
  owner_id?: string;
  business_units?: string[];
  status?: PolicyStatus;
  approval_date?: string;
  effective_date?: string;
  review_frequency?: ReviewFrequency;
  next_review_date?: string;
  linked_influencers?: string[];
  supersedes_policy_id?: string;
  attachments?: Array<{ filename: string; path: string; upload_date: string; uploaded_by: string }>;
  tags?: string[];
  custom_fields?: Record<string, any>;
  requires_acknowledgment?: boolean;
  acknowledgment_due_days?: number;
}

export interface PolicyQueryParams {
  page?: number;
  limit?: number;
  status?: PolicyStatus;
  policy_type?: string;
  owner_id?: string;
  search?: string;
  sort?: string;
}

export interface PolicyListResponse {
  data: Policy[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Control Objective Types
export enum ImplementationStatus {
  NOT_IMPLEMENTED = 'not_implemented',
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  IMPLEMENTED = 'implemented',
  NOT_APPLICABLE = 'not_applicable',
}

export interface ControlObjective {
  id: string;
  objective_identifier: string;
  policy_id: string;
  statement: string;
  rationale?: string;
  domain?: string;
  priority?: string;
  mandatory: boolean;
  responsible_party_id?: string;
  responsible_party?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  implementation_status: ImplementationStatus;
  target_implementation_date?: string;
  actual_implementation_date?: string;
  linked_influencers?: string[];
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateControlObjectiveData {
  objective_identifier: string;
  policy_id: string;
  statement: string;
  rationale?: string;
  domain?: string;
  priority?: string;
  mandatory?: boolean;
  responsible_party_id?: string;
  implementation_status?: ImplementationStatus;
  target_implementation_date?: string;
  actual_implementation_date?: string;
  linked_influencers?: string[];
  display_order?: number;
}

// Unified Control Types
export enum ControlType {
  PREVENTIVE = 'preventive',
  DETECTIVE = 'detective',
  CORRECTIVE = 'corrective',
  COMPENSATING = 'compensating',
  ADMINISTRATIVE = 'administrative',
  TECHNICAL = 'technical',
  PHYSICAL = 'physical',
}

export enum ControlComplexity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum ControlCostImpact {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum ControlStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
}

export interface UnifiedControl {
  id: string;
  control_identifier: string;
  title: string;
  description?: string;
  control_type?: ControlType;
  control_category?: string;
  domain?: string;
  complexity?: ControlComplexity;
  cost_impact?: ControlCostImpact;
  status: ControlStatus;
  implementation_status: ImplementationStatus;
  control_owner_id?: string;
  control_owner?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  control_procedures?: string;
  testing_procedures?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateUnifiedControlData {
  control_identifier: string;
  title: string;
  description?: string;
  control_type?: ControlType;
  control_category?: string;
  domain?: string;
  complexity?: ControlComplexity;
  cost_impact?: ControlCostImpact;
  status?: ControlStatus;
  implementation_status?: ImplementationStatus;
  control_owner_id?: string;
  control_procedures?: string;
  testing_procedures?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

export interface UnifiedControlQueryParams {
  page?: number;
  limit?: number;
  control_type?: ControlType;
  status?: ControlStatus;
  implementation_status?: ImplementationStatus;
  domain?: string;
  control_owner_id?: string;
  search?: string;
  sort?: string;
}

export interface UnifiedControlListResponse {
  data: UnifiedControl[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Assessment Types
export enum AssessmentType {
  IMPLEMENTATION = 'implementation',
  DESIGN_EFFECTIVENESS = 'design_effectiveness',
  OPERATING_EFFECTIVENESS = 'operating_effectiveness',
  COMPLIANCE = 'compliance',
}

export enum AssessmentStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  UNDER_REVIEW = 'under_review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum AssessmentResultEnum {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PARTIALLY_COMPLIANT = 'partially_compliant',
  NOT_APPLICABLE = 'not_applicable',
  NOT_TESTED = 'not_tested',
}

export interface Assessment {
  id: string;
  assessment_identifier: string;
  name: string;
  description?: string;
  assessment_type: AssessmentType;
  scope_description?: string;
  selected_control_ids?: string[];
  selected_framework_ids?: string[];
  start_date?: string;
  end_date?: string;
  status: AssessmentStatus;
  lead_assessor_id?: string;
  lead_assessor?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  assessor_ids?: string[];
  controls_assessed: number;
  controls_total?: number;
  findings_critical: number;
  findings_high: number;
  findings_medium: number;
  findings_low: number;
  overall_score?: number;
  assessment_procedures?: string;
  report_path?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateAssessmentData {
  assessment_identifier: string;
  name: string;
  description?: string;
  assessment_type: AssessmentType;
  scope_description?: string;
  selected_control_ids?: string[];
  selected_framework_ids?: string[];
  start_date?: string;
  end_date?: string;
  status?: AssessmentStatus;
  lead_assessor_id?: string;
  assessor_ids?: string[];
  controls_total?: number;
  assessment_procedures?: string;
  tags?: string[];
}

export interface AssessmentQueryParams {
  page?: number;
  limit?: number;
  status?: AssessmentStatus;
  assessment_type?: AssessmentType;
  search?: string;
  sort?: string;
}

export interface AssessmentResult {
  id: string;
  assessment_id: string;
  unified_control_id: string;
  unified_control?: UnifiedControl;
  assessor_id?: string;
  assessor?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  assessment_date?: string;
  assessment_procedure_followed?: string;
  result: AssessmentResultEnum;
  effectiveness_rating?: number;
  findings?: string;
  observations?: string;
  recommendations?: string;
  evidence_collected?: Array<{ filename: string; path: string; description: string }>;
  requires_remediation: boolean;
  remediation_due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAssessmentResultData {
  assessment_id: string;
  unified_control_id: string;
  assessor_id?: string;
  assessment_date?: string;
  assessment_procedure_followed?: string;
  result: AssessmentResultEnum;
  effectiveness_rating?: number;
  findings?: string;
  observations?: string;
  recommendations?: string;
  evidence_collected?: Array<{ filename: string; path: string; description: string }>;
  requires_remediation?: boolean;
  remediation_due_date?: string;
}

// Evidence Types
export enum EvidenceType {
  POLICY_DOCUMENT = 'policy_document',
  CONFIGURATION_SCREENSHOT = 'configuration_screenshot',
  SYSTEM_LOG = 'system_log',
  SCAN_REPORT = 'scan_report',
  TEST_RESULT = 'test_result',
  CERTIFICATION = 'certification',
  TRAINING_RECORD = 'training_record',
  MEETING_MINUTES = 'meeting_minutes',
  EMAIL_CORRESPONDENCE = 'email_correspondence',
  CONTRACT = 'contract',
  OTHER = 'other',
}

export enum EvidenceStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  EXPIRED = 'expired',
  REJECTED = 'rejected',
}

export enum EvidenceLinkType {
  CONTROL = 'control',
  ASSESSMENT = 'assessment',
  FINDING = 'finding',
  ASSET = 'asset',
  POLICY = 'policy',
  STANDARD = 'standard',
}

export interface Evidence {
  id: string;
  evidence_identifier: string;
  title: string;
  description?: string;
  evidence_type: EvidenceType;
  filename?: string;
  file_path: string;
  file_size?: number | string;
  mime_type?: string;
  file_hash?: string;
  collection_date: string;
  valid_from_date?: string;
  valid_until_date?: string;
  collector_id?: string;
  collector?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  status: EvidenceStatus;
  approved_by?: string;
  approval_date?: string;
  rejection_reason?: string;
  tags?: string[];
  custom_metadata?: Record<string, any>;
  confidential: boolean;
  restricted_to_roles?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateEvidenceData {
  evidence_identifier: string;
  title: string;
  description?: string;
  evidence_type: EvidenceType;
  filename?: string;
  file_path: string;
  file_size?: number | string;
  mime_type?: string;
  file_hash?: string;
  collection_date?: string;
  valid_from_date?: string;
  valid_until_date?: string;
  collector_id?: string;
  status?: EvidenceStatus;
  approval_date?: string;
  rejection_reason?: string;
  tags?: string[];
  custom_metadata?: Record<string, any>;
  confidential?: boolean;
  restricted_to_roles?: string[];
}

export interface EvidenceQueryParams {
  page?: number;
  limit?: number;
  evidence_type?: EvidenceType;
  status?: EvidenceStatus;
  search?: string;
  sort?: string;
}

// Finding Types
export enum FindingSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'informational',
}

export enum FindingStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ACCEPTED = 'risk_accepted',
  REJECTED = 'false_positive',
}

export interface Finding {
  id: string;
  finding_identifier: string;
  assessment_id?: string;
  assessment?: Assessment;
  assessment_result_id?: string;
  source_type?: string;
  source_name?: string;
  unified_control_id?: string;
  unified_control?: UnifiedControl;
  asset_type?: string;
  asset_id?: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  finding_date: string;
  status: FindingStatus;
  remediation_owner_id?: string;
  remediation_owner?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  remediation_plan?: string;
  remediation_due_date?: string;
  remediation_completed_date?: string;
  remediation_evidence?: any;
  risk_accepted_by?: string;
  risk_acceptance_justification?: string;
  risk_acceptance_date?: string;
  risk_acceptance_expiry?: string;
  retest_required: boolean;
  retest_date?: string;
  retest_result?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateFindingData {
  finding_identifier: string;
  assessment_id?: string;
  assessment_result_id?: string;
  source_type?: string;
  source_name?: string;
  unified_control_id?: string;
  asset_type?: string;
  asset_id?: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  finding_date?: string;
  status?: FindingStatus;
  remediation_owner_id?: string;
  remediation_plan?: string;
  remediation_due_date?: string;
  remediation_completed_date?: string;
  remediation_evidence?: any;
  risk_accepted_by?: string;
  risk_acceptance_justification?: string;
  risk_acceptance_date?: string;
  risk_acceptance_expiry?: string;
  retest_required?: boolean;
  retest_date?: string;
  retest_result?: string;
  tags?: string[];
}

export interface FindingQueryParams {
  page?: number;
  limit?: number;
  severity?: FindingSeverity;
  status?: FindingStatus;
  assessment_id?: string;
  unified_control_id?: string;
  remediation_owner_id?: string;
  search?: string;
  sort?: string;
}

// Governance API Client
export const governanceApi = {
  // Influencers
  getInfluencers: async (params?: InfluencerQueryParams): Promise<InfluencerListResponse> => {
    const response = await apiClient.get('/api/v1/governance/influencers', { params });
    return response.data;
  },

  getInfluencer: async (id: string): Promise<{ data: Influencer }> => {
    const response = await apiClient.get(`/api/v1/governance/influencers/${id}`);
    // Backend returns influencer directly, wrap it for consistency
    return { data: response.data };
  },

  createInfluencer: async (data: CreateInfluencerData): Promise<{ data: Influencer }> => {
    const response = await apiClient.post('/api/v1/governance/influencers', data);
    return response.data;
  },

  updateInfluencer: async (id: string, data: Partial<CreateInfluencerData>): Promise<{ data: Influencer }> => {
    const response = await apiClient.patch(`/api/v1/governance/influencers/${id}`, data);
    return response.data;
  },

  deleteInfluencer: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/influencers/${id}`);
  },

  // Policies
  getPolicies: async (params?: PolicyQueryParams): Promise<PolicyListResponse> => {
    const response = await apiClient.get('/api/v1/governance/policies', { params });
    return response.data;
  },

  getPolicy: async (id: string): Promise<{ data: Policy }> => {
    const response = await apiClient.get(`/api/v1/governance/policies/${id}`);
    return response.data;
  },

  getPolicyVersions: async (id: string): Promise<{ data: Policy[] }> => {
    const response = await apiClient.get(`/api/v1/governance/policies/${id}/versions`);
    return response.data;
  },

  createPolicy: async (data: CreatePolicyData): Promise<{ data: Policy }> => {
    const response = await apiClient.post('/api/v1/governance/policies', data);
    return response.data;
  },

  updatePolicy: async (id: string, data: Partial<CreatePolicyData>): Promise<{ data: Policy }> => {
    const response = await apiClient.patch(`/api/v1/governance/policies/${id}`, data);
    return response.data;
  },

  deletePolicy: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/policies/${id}`);
  },

  // Control Objectives
  getControlObjectives: async (policyId?: string): Promise<ControlObjective[]> => {
    const response = await apiClient.get('/api/v1/governance/control-objectives', {
      params: policyId ? { policy_id: policyId } : {},
    });
    return response.data;
  },

  getControlObjective: async (id: string): Promise<ControlObjective> => {
    const response = await apiClient.get(`/api/v1/governance/control-objectives/${id}`);
    return response.data;
  },

  createControlObjective: async (data: CreateControlObjectiveData): Promise<ControlObjective> => {
    const response = await apiClient.post('/api/v1/governance/control-objectives', data);
    return response.data;
  },

  updateControlObjective: async (id: string, data: Partial<CreateControlObjectiveData>): Promise<ControlObjective> => {
    const response = await apiClient.patch(`/api/v1/governance/control-objectives/${id}`, data);
    return response.data;
  },

  deleteControlObjective: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/control-objectives/${id}`);
  },

  // Unified Controls
  getUnifiedControls: async (params?: UnifiedControlQueryParams): Promise<UnifiedControlListResponse> => {
    const response = await apiClient.get('/api/v1/governance/unified-controls', { params });
    return response.data;
  },

  getUnifiedControl: async (id: string): Promise<{ data: UnifiedControl }> => {
    const response = await apiClient.get(`/api/v1/governance/unified-controls/${id}`);
    return { data: response.data };
  },

  createUnifiedControl: async (data: CreateUnifiedControlData): Promise<{ data: UnifiedControl }> => {
    const response = await apiClient.post('/api/v1/governance/unified-controls', data);
    return response.data;
  },

  updateUnifiedControl: async (id: string, data: Partial<CreateUnifiedControlData>): Promise<{ data: UnifiedControl }> => {
    const response = await apiClient.patch(`/api/v1/governance/unified-controls/${id}`, data);
    return response.data;
  },

  deleteUnifiedControl: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/unified-controls/${id}`);
  },

  // Assessments
  getAssessments: async (params?: {
    page?: number;
    limit?: number;
    status?: AssessmentStatus;
    assessment_type?: AssessmentType;
    search?: string;
  }): Promise<{ data: Assessment[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
    const response = await apiClient.get('/api/v1/governance/assessments', { params });
    return response.data;
  },

  getAssessment: async (id: string): Promise<{ data: Assessment }> => {
    const response = await apiClient.get(`/api/v1/governance/assessments/${id}`);
    return response.data;
  },

  createAssessment: async (data: CreateAssessmentData): Promise<{ data: Assessment }> => {
    const response = await apiClient.post('/api/v1/governance/assessments', data);
    return response.data;
  },

  updateAssessment: async (id: string, data: Partial<CreateAssessmentData>): Promise<{ data: Assessment }> => {
    const response = await apiClient.patch(`/api/v1/governance/assessments/${id}`, data);
    return response.data;
  },

  deleteAssessment: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/assessments/${id}`);
  },

  addAssessmentResult: async (assessmentId: string, data: CreateAssessmentResultData): Promise<AssessmentResult> => {
    const response = await apiClient.post(`/api/v1/governance/assessments/${assessmentId}/results`, data);
    return response.data;
  },

  getAssessmentResults: async (assessmentId: string): Promise<AssessmentResult[]> => {
    const response = await apiClient.get(`/api/v1/governance/assessments/${assessmentId}/results`);
    return response.data;
  },

  // Evidence
  getEvidence: async (params?: {
    page?: number;
    limit?: number;
    evidence_type?: EvidenceType;
    status?: EvidenceStatus;
    search?: string;
  }): Promise<{ data: Evidence[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
    const response = await apiClient.get('/api/v1/governance/evidence', { params });
    return response.data;
  },

  getEvidenceItem: async (id: string): Promise<{ data: Evidence }> => {
    const response = await apiClient.get(`/api/v1/governance/evidence/${id}`);
    return response.data;
  },

  createEvidence: async (data: CreateEvidenceData): Promise<{ data: Evidence }> => {
    const response = await apiClient.post('/api/v1/governance/evidence', data);
    return response.data;
  },

  updateEvidence: async (id: string, data: Partial<CreateEvidenceData>): Promise<{ data: Evidence }> => {
    const response = await apiClient.patch(`/api/v1/governance/evidence/${id}`, data);
    return response.data;
  },

  deleteEvidence: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/evidence/${id}`);
  },

  linkEvidence: async (
    evidenceId: string,
    linkType: EvidenceLinkType,
    linkedEntityId: string,
    description?: string,
  ): Promise<void> => {
    await apiClient.post(`/api/v1/governance/evidence/${evidenceId}/link`, {
      link_type: linkType,
      linked_entity_id: linkedEntityId,
      description,
    });
  },

  getLinkedEvidence: async (linkType: EvidenceLinkType, linkedEntityId: string): Promise<Evidence[]> => {
    const response = await apiClient.get(`/api/v1/governance/evidence/linked/${linkType}/${linkedEntityId}`);
    return response.data;
  },

  uploadEvidenceFile: async (file: File, metadata?: Record<string, any>): Promise<{
    filename: string;
    originalName: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    file_hash: string;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    const response = await apiClient.post('/api/v1/governance/evidence/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadEvidenceFile: async (filename: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/v1/governance/evidence/download/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Findings
  getFindings: async (params?: {
    page?: number;
    limit?: number;
    severity?: FindingSeverity;
    status?: FindingStatus;
    assessment_id?: string;
    unified_control_id?: string;
    search?: string;
  }): Promise<{ data: Finding[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
    const response = await apiClient.get('/api/v1/governance/findings', { params });
    return response.data;
  },

  getFinding: async (id: string): Promise<{ data: Finding }> => {
    const response = await apiClient.get(`/api/v1/governance/findings/${id}`);
    return response.data;
  },

  createFinding: async (data: CreateFindingData): Promise<{ data: Finding }> => {
    const response = await apiClient.post('/api/v1/governance/findings', data);
    return response.data;
  },

  updateFinding: async (id: string, data: Partial<CreateFindingData>): Promise<{ data: Finding }> => {
    const response = await apiClient.patch(`/api/v1/governance/findings/${id}`, data);
    return response.data;
  },

  deleteFinding: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/findings/${id}`);
  },

  getFindingRisks: async (findingId: string): Promise<any[]> => {
    const response = await apiClient.get(`/api/v1/governance/findings/${findingId}/risks`);
    return response.data;
  },
};

// Governance Dashboard Types
export interface GovernanceSummary {
  totalInfluencers: number;
  activeInfluencers: number;
  totalPolicies: number;
  publishedPolicies: number;
  policiesUnderReview: number;
  totalControls: number;
  implementedControls: number;
  totalAssessments: number;
  completedAssessments: number;
  inProgressAssessments: number;
  totalFindings: number;
  openFindings: number;
  criticalFindings: number;
  totalEvidence: number;
  approvedEvidence: number;
}

export interface ControlStats {
  total: number;
  byStatus: {
    active: number;
    draft: number;
    retired: number;
  };
  byImplementation: {
    implemented: number;
    inProgress: number;
    planned: number;
    notImplemented: number;
  };
  byType: {
    preventive: number;
    detective: number;
    corrective: number;
    compensating: number;
  };
}

export interface PolicyStats {
  total: number;
  byStatus: {
    draft: number;
    inReview: number;
    approved: number;
    published: number;
    archived: number;
  };
  pendingReview: number;
  overdueReview: number;
}

export interface AssessmentStats {
  total: number;
  byStatus: {
    notStarted: number;
    inProgress: number;
    underReview: number;
    completed: number;
    cancelled: number;
  };
  byType: {
    implementation: number;
    designEffectiveness: number;
    operatingEffectiveness: number;
    compliance: number;
  };
  averageScore: number;
}

export interface FindingStats {
  total: number;
  byStatus: {
    open: number;
    inProgress: number;
    closed: number;
    riskAccepted: number;
    falsePositive: number;
  };
  bySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
  };
  overdueRemediation: number;
}

export interface UpcomingReview {
  id: string;
  type: 'policy' | 'influencer' | 'control';
  name: string;
  reviewDate: string;
  daysUntil: number;
}

export interface RecentActivity {
  id: string;
  type: 'policy' | 'control' | 'assessment' | 'finding' | 'evidence';
  action: string;
  entityName: string;
  userName?: string;
  createdAt: string;
}

// Asset Compliance Types
export interface AssetComplianceByType {
  assetType: string;
  totalAssets: number;
  assetsWithControls: number;
  compliantAssets: number;
  partiallyCompliantAssets: number;
  nonCompliantAssets: number;
  compliancePercentage: number;
}

export interface NonCompliantAsset {
  assetId: string;
  assetType: string;
  assetName: string;
  controlsAssigned: number;
  controlsImplemented: number;
  compliancePercentage: number;
  criticalGaps: number;
}

export interface AssetComplianceStats {
  totalAssets: number;
  assetsWithControls: number;
  assetsWithoutControls: number;
  compliantAssets: number;
  partiallyCompliantAssets: number;
  nonCompliantAssets: number;
  overallCompliancePercentage: number;
  byAssetType: AssetComplianceByType[];
  topNonCompliantAssets: NonCompliantAsset[];
}

export interface GovernanceDashboard {
  summary: GovernanceSummary;
  controlStats: ControlStats;
  policyStats: PolicyStats;
  assessmentStats: AssessmentStats;
  findingStats: FindingStats;
  assetComplianceStats?: AssetComplianceStats;
  upcomingReviews: UpcomingReview[];
  recentActivity: RecentActivity[];
}

export interface GovernanceTrendPoint {
  date: string;
  complianceRate: number;
  implementedControls: number;
  totalControls: number;
  openFindings: number;
  assessmentCompletionRate: number;
  riskClosureRate: number;
}

export interface GovernanceForecastPoint {
  date: string;
  projectedComplianceRate: number;
  projectedOpenFindings: number;
}

export interface GovernacyTrendResponse {
  history: GovernanceTrendPoint[];
  forecast: GovernanceForecastPoint[];
  latestSnapshot: GovernanceTrendPoint;
  lastUpdatedAt: string;
}

// Remediation Tracking Types
export enum RemediationPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export type RemediationStatus = 'on_track' | 'at_risk' | 'overdue' | 'completed';

export interface RemediationTracker {
  id: string;
  finding_id: string;
  finding_identifier: string;
  finding_title: string;
  remediation_priority: RemediationPriority;
  sla_due_date: string;
  remediation_steps?: string;
  assigned_to_id?: string;
  assigned_to_name?: string;
  progress_percent: number;
  progress_notes?: string;
  completion_date?: string;
  sla_met: boolean;
  days_to_completion?: number;
  days_until_due?: number;
  status: RemediationStatus;
  created_at: string;
  updated_at: string;
}

export interface RemediationDashboard {
  total_open_findings: number;
  findings_on_track: number;
  findings_at_risk: number;
  findings_overdue: number;
  average_days_to_completion: number;
  sla_compliance_rate: number;
  critical_findings: RemediationTracker[];
  overdue_findings: RemediationTracker[];
  upcoming_due: RemediationTracker[];
}

// Governance Dashboard API
export const governanceDashboardApi = {
  getDashboard: async (): Promise<GovernanceDashboard> => {
    const response = await apiClient.get<GovernanceDashboard>('/api/v1/governance/dashboard');
    return response.data;
  },
  getTrends: async (): Promise<GovernacyTrendResponse> => {
    const response = await apiClient.get<GovernacyTrendResponse>('/api/v1/governance/dashboard/trends');
    return response.data;
  },
};

// Remediation Tracking API
export const remediationTrackingApi = {
  getDashboard: async (): Promise<RemediationDashboard> => {
    const response = await apiClient.get<RemediationDashboard>('/api/v1/governance/remediation/dashboard');
    return response.data;
  },
};

// Governance Reporting Types
export enum ReportType {
  POLICY_COMPLIANCE = 'policy_compliance',
  INFLUENCER = 'influencer',
  CONTROL_IMPLEMENTATION = 'control_implementation',
  ASSESSMENT = 'assessment',
  FINDINGS = 'findings',
  CONTROL_STATUS = 'control_status',
}

export enum ExportFormat {
  CSV = 'csv',
  EXCEL = 'xlsx',
  PDF = 'pdf',
}

export interface ReportQuery {
  type: ReportType;
  format?: ExportFormat;
  startDate?: string;
  endDate?: string;
  status?: string;
}

// Governance Reporting API
export const governanceReportingApi = {
  exportReport: async (query: ReportQuery): Promise<void> => {
    const params = new URLSearchParams();
    params.append('type', query.type);
    if (query.format) params.append('format', query.format);
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);
    if (query.status) params.append('status', query.status);

    const response = await apiClient.get(`/api/v1/governance/reports/export?${params.toString()}`, {
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = `${query.type}_report.csv`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  exportPolicyCompliance: async (filters?: { format?: ExportFormat; startDate?: string; endDate?: string; status?: string }): Promise<void> => {
    const params = new URLSearchParams();
    if (filters?.format) params.append('format', filters.format);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);

    const response = await apiClient.get(`/api/v1/governance/reports/policy-compliance?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'policy_compliance_report.csv';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) filename = filenameMatch[1];
    }
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  exportInfluencer: async (filters?: { format?: ExportFormat; startDate?: string; endDate?: string; status?: string }): Promise<void> => {
    const params = new URLSearchParams();
    if (filters?.format) params.append('format', filters.format);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);

    const response = await apiClient.get(`/api/v1/governance/reports/influencer?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'influencer_report.csv';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) filename = filenameMatch[1];
    }
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  exportControlImplementation: async (filters?: { format?: ExportFormat; status?: string }): Promise<void> => {
    const params = new URLSearchParams();
    if (filters?.format) params.append('format', filters.format);
    if (filters?.status) params.append('status', filters.status);

    const response = await apiClient.get(`/api/v1/governance/reports/control-implementation?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'control_implementation_report.csv';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) filename = filenameMatch[1];
    }
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  exportAssessment: async (filters?: { format?: ExportFormat; startDate?: string; endDate?: string; status?: string }): Promise<void> => {
    const params = new URLSearchParams();
    if (filters?.format) params.append('format', filters.format);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);

    const response = await apiClient.get(`/api/v1/governance/reports/assessment?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'assessment_report.csv';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) filename = filenameMatch[1];
    }
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  exportFindings: async (filters?: { format?: ExportFormat; startDate?: string; endDate?: string; status?: string }): Promise<void> => {
    const params = new URLSearchParams();
    if (filters?.format) params.append('format', filters.format);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);

    const response = await apiClient.get(`/api/v1/governance/reports/findings?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'findings_report.csv';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) filename = filenameMatch[1];
    }
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  exportControlStatus: async (filters?: { format?: ExportFormat }): Promise<void> => {
    const params = new URLSearchParams();
    if (filters?.format) params.append('format', filters.format);

    const response = await apiClient.get(`/api/v1/governance/reports/control-status?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'control_status_report.csv';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) filename = filenameMatch[1];
    }
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

// Control-Asset Mapping Types
export enum AssetType {
  PHYSICAL = 'physical',
  INFORMATION = 'information',
  APPLICATION = 'application',
  SOFTWARE = 'software',
  SUPPLIER = 'supplier',
}

export interface ControlAssetMapping {
  id: string;
  unified_control_id: string;
  unified_control?: UnifiedControl;
  asset_type: AssetType;
  asset_id: string;
  implementation_date?: string;
  implementation_status: ImplementationStatus;
  implementation_notes?: string;
  last_test_date?: string;
  last_test_result?: string;
  effectiveness_score?: number;
  is_automated: boolean;
  mapped_by?: string;
  mapper?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  mapped_at: string;
  updated_at: string;
}

export interface CreateControlAssetMappingData {
  asset_type: AssetType;
  asset_id: string;
  implementation_date?: string;
  implementation_status?: ImplementationStatus;
  implementation_notes?: string;
  last_test_date?: string;
  last_test_result?: string;
  effectiveness_score?: number;
  is_automated?: boolean;
}

export interface BulkCreateControlAssetMappingData {
  asset_type: AssetType;
  asset_ids: string[];
  implementation_date?: string;
  implementation_status?: ImplementationStatus;
  implementation_notes?: string;
}

export interface ControlAssetMappingQueryParams {
  asset_type?: AssetType;
  asset_id?: string;
  implementation_status?: ImplementationStatus;
}

// Control-Asset Mapping API
export const controlAssetMappingApi = {
  linkAsset: async (
    controlId: string,
    data: CreateControlAssetMappingData,
  ): Promise<ControlAssetMapping> => {
    const response = await apiClient.post<ControlAssetMapping>(
      `/api/v1/governance/unified-controls/${controlId}/assets`,
      data,
    );
    return response.data;
  },

  bulkLinkAssets: async (
    controlId: string,
    data: BulkCreateControlAssetMappingData,
  ): Promise<ControlAssetMapping[]> => {
    const response = await apiClient.post<ControlAssetMapping[]>(
      `/api/v1/governance/unified-controls/${controlId}/assets/bulk`,
      data,
    );
    return response.data;
  },

  getLinkedAssets: async (
    controlId: string,
    params?: ControlAssetMappingQueryParams,
  ): Promise<ControlAssetMapping[]> => {
    const queryParams = new URLSearchParams();
    if (params?.asset_type) queryParams.append('asset_type', params.asset_type);
    if (params?.asset_id) queryParams.append('asset_id', params.asset_id);
    if (params?.implementation_status)
      queryParams.append('implementation_status', params.implementation_status);

    const url = `/api/v1/governance/unified-controls/${controlId}/assets${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    const response = await apiClient.get<ControlAssetMapping[]>(url);
    return response.data;
  },

  getMapping: async (controlId: string, mappingId: string): Promise<ControlAssetMapping> => {
    const response = await apiClient.get<ControlAssetMapping>(
      `/api/v1/governance/unified-controls/${controlId}/assets/${mappingId}`,
    );
    return response.data;
  },

  updateMapping: async (
    controlId: string,
    mappingId: string,
    data: Partial<CreateControlAssetMappingData>,
  ): Promise<ControlAssetMapping> => {
    const response = await apiClient.patch<ControlAssetMapping>(
      `/api/v1/governance/unified-controls/${controlId}/assets/${mappingId}`,
      data,
    );
    return response.data;
  },

  unlinkAsset: async (controlId: string, mappingId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/unified-controls/${controlId}/assets/${mappingId}`);
  },

  bulkUnlinkAssets: async (
    controlId: string,
    mappingIds: string[],
  ): Promise<{ deleted: number; notFound: string[] }> => {
    const response = await apiClient.delete<{ deleted: number; notFound: string[] }>(
      `/api/v1/governance/unified-controls/${controlId}/assets/bulk`,
      {
        data: { mapping_ids: mappingIds },
      },
    );
    return response.data;
  },

  getControlsForAsset: async (
    assetType: AssetType,
    assetId: string,
    params?: ControlAssetMappingQueryParams,
  ): Promise<ControlAssetMapping[]> => {
    const queryParams = new URLSearchParams();
    if (params?.implementation_status)
      queryParams.append('implementation_status', params.implementation_status);

    const url = `/api/v1/governance/unified-controls/assets/${assetType}/${assetId}/controls${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    const response = await apiClient.get<ControlAssetMapping[]>(url);
    return response.data;
  },

  linkControlsToAsset: async (
    assetType: AssetType,
    assetId: string,
    controlIds: string[],
    implementationStatus?: ImplementationStatus,
    implementationNotes?: string,
  ): Promise<{ created: ControlAssetMapping[]; alreadyLinked: string[] }> => {
    const response = await apiClient.post<{ created: ControlAssetMapping[]; alreadyLinked: string[] }>(
      `/api/v1/governance/unified-controls/assets/${assetType}/${assetId}/controls`,
      {
        control_ids: controlIds,
        implementation_status: implementationStatus,
        implementation_notes: implementationNotes,
      },
    );
    return response.data;
  },

  unlinkControlFromAsset: async (
    assetType: AssetType,
    assetId: string,
    controlId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/api/v1/governance/unified-controls/assets/${assetType}/${assetId}/controls/${controlId}`,
    );
  },
};
