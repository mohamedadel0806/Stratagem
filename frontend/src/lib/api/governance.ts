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
  revision_notes?: string;
  next_review_date?: string;
  review_frequency_days?: number;
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

export enum RevisionType {
  CREATED = 'created',
  UPDATED = 'updated',
  STATUS_CHANGED = 'status_changed',
  APPLICABILITY_CHANGED = 'applicability_changed',
  REVIEWED = 'reviewed',
  ARCHIVED = 'archived',
}

export interface InfluencerRevision {
  id: string;
  influencer_id: string;
  revision_type: RevisionType;
  revision_notes?: string;
  revision_date: string;
  changes_summary?: Record<string, { old: any; new: any }>;
  impact_assessment?: {
    affected_policies?: string[];
    affected_controls?: string[];
    business_units_impact?: string[];
    risk_level?: 'low' | 'medium' | 'high' | 'critical';
    notes?: string;
  };
  reviewed_by?: string;
  reviewer?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_by?: string;
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

export interface ReviewInfluencerData {
  revision_notes?: string;
  next_review_date?: string;
  review_frequency_days?: number;
  impact_assessment?: {
    affected_policies?: string[];
    affected_controls?: string[];
    business_units_impact?: string[];
    risk_level?: 'low' | 'medium' | 'high' | 'critical';
    notes?: string;
  };
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
  revision_notes?: string;
  review_frequency_days?: number;
}

export interface InfluencerQueryParams {
  page?: number;
  limit?: number;
  category?: InfluencerCategory;
  status?: InfluencerStatus;
  applicability_status?: ApplicabilityStatus;
  search?: string;
  sort?: string;
  tags?: string[];
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
  policy?: Policy;
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
  unified_controls?: UnifiedControl[];
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

export enum MappingCoverage {
  FULL = 'full',
  PARTIAL = 'partial',
  NOT_APPLICABLE = 'not_applicable',
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

// Control Domain Types
export interface ControlDomain {
  id: string;
  name: string;
  description?: string;
  parent_id?: string | null;
  parent?: ControlDomain;
  children?: ControlDomain[];
  owner_id?: string | null;
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  code?: string;
  display_order: number;
  is_active: boolean;
  tenantId?: string;
  tenant_id?: string;
  created_by?: string;
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_by?: string;
  updater?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  updated_at: string;
}

export interface CreateDomainData {
  name: string;
  description?: string;
  parent_id?: string;
  owner_id?: string;
  code?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface DomainStatistics {
  total: number;
  active: number;
  withChildren: number;
  withOwner: number;
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

// Standard Types
export enum StandardStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface Standard {
  id: string;
  standard_identifier: string;
  title: string;
  policy_id?: string;
  policy?: Policy;
  control_objective_id?: string;
  control_objective?: ControlObjective;
  description?: string;
  content?: string;
  scope?: string;
  applicability?: string;
  compliance_measurement_criteria?: string;
  version?: string;
  status: StandardStatus;
  owner_id?: string;
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  control_objectives?: ControlObjective[];
  created_at: string;
  updated_at: string;
  tenantId?: string;
  tenant_id?: string;
}

export interface CreateStandardData {
  standard_identifier: string;
  title: string;
  policy_id?: string;
  control_objective_id?: string;
  description?: string;
  content?: string;
  scope?: string;
  applicability?: string;
  compliance_measurement_criteria?: string;
  version?: string;
  status?: StandardStatus;
  owner_id?: string;
  control_objective_ids?: string[];
}

export interface UpdateStandardData extends Partial<CreateStandardData> { }

export interface StandardQueryParams {
  page?: number;
  limit?: number;
  status?: StandardStatus;
  policy_id?: string;
  control_objective_id?: string;
  owner_id?: string;
  search?: string;
  sort?: string;
}

export interface StandardListResponse {
  data: Standard[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// SOP Types
export enum SOPStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum SOPCategory {
  OPERATIONAL = 'operational',
  SECURITY = 'security',
  COMPLIANCE = 'compliance',
  THIRD_PARTY = 'third_party',
}

export enum ExecutionOutcome {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  PARTIALLY_COMPLETED = 'partially_completed',
}

export interface SOP {
  id: string;
  sop_identifier: string;
  title: string;
  category?: SOPCategory;
  subcategory?: string;
  purpose?: string;
  scope?: string;
  content?: string;
  version?: string;
  version_number: number;
  status: SOPStatus;
  owner_id?: string;
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  review_frequency?: string;
  next_review_date?: string;
  approval_date?: string;
  published_date?: string;
  linked_policies?: string[];
  linked_standards?: string[];
  tags?: string[];
  controls?: UnifiedControl[];
  created_at: string;
  updated_at: string;
}

export interface CreateSOPData {
  sop_identifier: string;
  title: string;
  category?: SOPCategory;
  subcategory?: string;
  purpose?: string;
  scope?: string;
  content?: string;
  version?: string;
  status?: SOPStatus;
  owner_id?: string;
  review_frequency?: string;
  next_review_date?: string;
  linked_policies?: string[];
  linked_standards?: string[];
  control_ids?: string[];
  tags?: string[];
}

export interface UpdateSOPData extends Partial<CreateSOPData> { }

export interface SOPQueryParams {
  page?: number;
  limit?: number;
  status?: SOPStatus;
  category?: SOPCategory;
  owner_id?: string;
  search?: string;
  sort?: string;
}

export interface SOPListResponse {
  data: SOP[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Compliance Scorecard Types
export enum ComplianceStatus {
  MET = 'met',
  NOT_MET = 'not_met',
  PARTIALLY_MET = 'partially_met',
  NOT_APPLICABLE = 'not_applicable',
}

export interface DomainBreakdown {
  domain: string;
  totalRequirements: number;
  met: number;
  notMet: number;
  partiallyMet: number;
  notApplicable: number;
  compliancePercentage: number;
}

export interface FrameworkScorecard {
  frameworkId: string;
  frameworkName: string;
  frameworkCode: string;
  overallCompliance: number;
  totalRequirements: number;
  metRequirements: number;
  notMetRequirements: number;
  partiallyMetRequirements: number;
  notApplicableRequirements: number;
  breakdownByDomain: DomainBreakdown[];
  controlImplementationStatus: {
    implemented: number;
    inProgress: number;
    planned: number;
    notImplemented: number;
  };
  assessmentResults: {
    completed: number;
    inProgress: number;
    averageScore: number;
  };
  gaps: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  trend?: {
    previousPeriod: number;
    change: number;
    trend: 'improving' | 'declining' | 'stable';
  };
}

export interface ComplianceScorecardResponse {
  generatedAt: string;
  frameworks: FrameworkScorecard[];
  overallCompliance: number;
  summary: {
    totalFrameworks: number;
    totalRequirements: number;
    totalMet: number;
    totalNotMet: number;
    averageCompliance: number;
  };
}

// Compliance Report Types (Story 6.1)
export enum ComplianceScore {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
}

export enum ReportPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
  CUSTOM = 'CUSTOM',
}

export interface ComplianceReportTrend {
  date: string;
  overall_score: number;
  policies_score: number;
  controls_score: number;
  assets_score: number;
}

export interface DepartmentCompliance {
  department: string;
  policies_score: number;
  controls_score: number;
  assets_score: number;
  overall_score: number;
  total_policies: number;
  total_controls: number;
  total_assets: number;
}

export interface ComplianceGap {
  gap_id: string;
  type: string;
  severity: 'critical' | 'medium' | 'low';
  description: string;
  affected_item: string;
  remediation_steps?: string;
}

export interface ComplianceReport {
  id: string;
  report_name: string;
  report_period: ReportPeriod;
  period_start_date: string;
  period_end_date: string;
  overall_compliance_score: number;
  overall_compliance_rating: ComplianceScore;
  policies_compliance_score: number;
  controls_compliance_score: number;
  assets_compliance_score: number;
  total_policies: number;
  policies_published: number;
  policies_acknowledged: number;
  total_controls: number;
  controls_implemented: number;
  controls_partial: number;
  controls_not_implemented: number;
  total_assets: number;
  assets_compliant: number;
  asset_compliance_percentage: number;
  critical_gaps: number;
  medium_gaps: number;
  low_gaps: number;
  gap_details: ComplianceGap[];
  department_breakdown: DepartmentCompliance[];
  compliance_trend: ComplianceReportTrend[];
  projected_score_next_period: number;
  projected_days_to_excellent: number;
  trend_direction: 'IMPROVING' | 'STABLE' | 'DECLINING';
  executive_summary: string;
  key_findings: string;
  recommendations: string;
  is_final: boolean;
  is_archived: boolean;
  created_by_id?: string;
  created_by?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  generated_at: string;
}

export interface ComplianceDashboardData {
  latest_report: ComplianceReport | null;
  current_score: number;
  current_rating: ComplianceScore;
  score_trend: number; // percentage change from last report
  policies_score: number;
  controls_score: number;
  assets_score: number;
  critical_gaps_count: number;
  policy_completion_rate: number;
  control_implementation_rate: number;
  asset_compliance_rate: number;
  days_since_last_report: number;
  next_report_due: string;
}

// Governance Permissions Types
export enum GovernanceModule {
  INFLUENCERS = 'influencers',
  POLICIES = 'policies',
  STANDARDS = 'standards',
  CONTROLS = 'controls',
  ASSESSMENTS = 'assessments',
  EVIDENCE = 'evidence',
  FINDINGS = 'findings',
  SOPS = 'sops',
  REPORTING = 'reporting',
  ADMIN = 'admin',
}

export enum GovernanceAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  PUBLISH = 'publish',
  APPROVE = 'approve',
  ASSIGN = 'assign',
  EXPORT = 'export',
  CONFIGURE = 'configure',
}

export interface GovernancePermission {
  id: string;
  role: string;
  module: GovernanceModule;
  action: GovernanceAction;
  resource_type?: string;
  conditions?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateGovernancePermissionData {
  role: string;
  module: GovernanceModule;
  action: GovernanceAction;
  resource_type?: string;
  conditions?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  business_unit_id?: string;
}

export interface BusinessUnit {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface GovernanceRoleAssignment {
  id: string;
  user_id: string;
  user?: User;
  role: string;
  business_unit_id?: string;
  business_unit?: BusinessUnit;
  assigned_by?: string;
  assigner?: User;
  assigned_at: string;
  expires_at?: string;
  created_at: string;
}

export interface AssignRoleData {
  user_id: string;
  role: string;
  business_unit_id?: string;
  expires_at?: string;
}

export interface BulkAssignRoleData {
  user_ids: string[];
  role: string;
  business_unit_id?: string;
  expires_at?: string;
}

export interface UserPermissionTestResult {
  userId: string;
  roles: string[];
  permissions: Array<{
    module: GovernanceModule;
    action: GovernanceAction;
    allowed: boolean;
    reason?: string;
  }>;
}

// Policy Exceptions Types
export enum ExceptionStatus {
  REQUESTED = 'requested',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export enum ExceptionType {
  POLICY = 'policy',
  STANDARD = 'standard',
  CONTROL = 'control',
  BASELINE = 'baseline',
}

export interface PolicyException {
  id: string;
  exception_identifier: string;
  exception_type?: ExceptionType;
  entity_id: string;
  entity_type?: string;
  requested_by?: string;
  requester?: User;
  requesting_business_unit_id?: string;
  requesting_business_unit?: BusinessUnit;
  request_date: string;
  business_justification: string;
  compensating_controls?: string;
  risk_assessment?: string;
  start_date?: string;
  end_date?: string;
  auto_expire: boolean;
  status: ExceptionStatus;
  approved_by?: string;
  approver?: User;
  approval_date?: string;
  approval_conditions?: string;
  rejection_reason?: string;
  last_review_date?: string;
  next_review_date?: string;
  supporting_documents?: Record<string, any>;
  created_at: string;
  updated_by?: string;
  updater?: User;
  updated_at: string;
}

export interface CreatePolicyExceptionData {
  exception_identifier?: string;
  exception_type?: ExceptionType;
  entity_id: string;
  entity_type?: string;
  requesting_business_unit_id?: string;
  business_justification: string;
  compensating_controls?: string;
  risk_assessment?: string;
  start_date?: string;
  end_date?: string;
  auto_expire?: boolean;
  next_review_date?: string;
  supporting_documents?: Record<string, any>;
}

export interface UpdatePolicyExceptionData {
  exception_type?: ExceptionType;
  business_justification?: string;
  compensating_controls?: string;
  risk_assessment?: string;
  start_date?: string;
  end_date?: string;
  auto_expire?: boolean;
  status?: ExceptionStatus;
  rejection_reason?: string;
  approval_conditions?: string;
  next_review_date?: string;
  supporting_documents?: Record<string, any>;
}

export interface PolicyExceptionQueryParams {
  page?: number;
  limit?: number;
  status?: ExceptionStatus;
  exception_type?: ExceptionType;
  entity_id?: string;
  entity_type?: string;
  requested_by?: string;
  requesting_business_unit_id?: string;
  search?: string;
}

export interface PolicyExceptionListResponse {
  data: PolicyException[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SOPPublicationStatistics {
  total_sops: number;
  published_sops: number;
  draft_sops: number;
  in_review_sops: number;
  category_breakdown: Record<string, number>;
  publication_trends: Array<{
    month: string;
    published: number;
  }>;
}

// Alert Types
export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

export enum AlertType {
  POLICY_REVIEW_OVERDUE = 'policy_review_overdue',
  CONTROL_ASSESSMENT_PAST_DUE = 'control_assessment_past_due',
  SOP_EXECUTION_FAILURE = 'sop_execution_failure',
  AUDIT_FINDING = 'audit_finding',
  COMPLIANCE_VIOLATION = 'compliance_violation',
  RISK_THRESHOLD_EXCEEDED = 'risk_threshold_exceeded',
  CUSTOM = 'custom',
}

export enum AlertRuleTriggerType {
  TIME_BASED = 'time_based',
  THRESHOLD_BASED = 'threshold_based',
  STATUS_CHANGE = 'status_change',
  CUSTOM_CONDITION = 'custom_condition',
}

export enum AlertRuleCondition {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null',
  DAYS_OVERDUE = 'days_overdue',
  STATUS_EQUALS = 'status_equals',
}

export enum NotificationChannel {
  EMAIL = 'email',
  IN_APP = 'in_app',
  SLACK = 'slack',
}

export enum NotificationFrequency {
  IMMEDIATE = 'immediate',
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  metadata?: Record<string, any>;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdById: string;
  createdBy?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  acknowledgedById?: string;
  acknowledgedBy?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  acknowledgedAt?: string;
  resolvedById?: string;
  resolvedBy?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  resolvedAt?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  triggerType: AlertRuleTriggerType;
  entityType: string;
  fieldName?: string;
  condition: AlertRuleCondition;
  conditionValue?: string;
  thresholdValue?: number;
  severityScore: number;
  alertMessage?: string;
  filters?: Record<string, any>;
  createdById: string;
  createdBy?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AlertSubscription {
  id: string;
  userId: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  alertType?: AlertType;
  severity?: AlertSeverity;
  notificationChannel: NotificationChannel;
  frequency: NotificationFrequency;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertDto {
  title: string;
  description: string;
  type: AlertType;
  severity: AlertSeverity;
  metadata?: Record<string, any>;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface CreateAlertRuleDto {
  name: string;
  description?: string;
  triggerType: AlertRuleTriggerType;
  entityType: string;
  fieldName?: string;
  condition: AlertRuleCondition;
  conditionValue?: string;
  thresholdValue?: number;
  severityScore: number;
  alertMessage?: string;
  filters?: Record<string, any>;
  isActive?: boolean;
}

export interface CreateAlertSubscriptionDto {
  alertType?: AlertType;
  severity?: AlertSeverity;
  notificationChannel: NotificationChannel;
  frequency: NotificationFrequency;
  isActive?: boolean;
}

export interface AlertListResponse {
  alerts: Alert[];
  total: number;
}

export interface AlertRuleListResponse {
  rules: AlertRule[];
  total: number;
}

export interface AlertSubscriptionListResponse {
  subscriptions: AlertSubscription[];
  total: number;
}

// Governance API Client
export const governanceApi = {
  // SOPs
  createSOP: async (data: CreateSOPData): Promise<SOP> => {
    const response = await apiClient.post<SOP>('/api/v1/governance/sops', data);
    return response.data;
  },

  getSOPs: async (params?: SOPQueryParams): Promise<SOPListResponse> => {
    const response = await apiClient.get<SOPListResponse>('/api/v1/governance/sops', { params });
    return response.data;
  },

  getSOP: async (id: string): Promise<SOP> => {
    const response = await apiClient.get<SOP>(`/api/v1/governance/sops/${id}`);
    return response.data;
  },

  updateSOP: async (id: string, data: UpdateSOPData): Promise<SOP> => {
    const response = await apiClient.patch<SOP>(`/api/v1/governance/sops/${id}`, data);
    return response.data;
  },

  deleteSOP: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/sops/${id}`);
  },

  publishSOP: async (id: string, assignToUserIds?: string[], assignToRoleIds?: string[]): Promise<SOP> => {
    const response = await apiClient.post<SOP>(`/api/v1/governance/sops/${id}/publish`, {
      assign_to_user_ids: assignToUserIds,
      assign_to_role_ids: assignToRoleIds,
    });
    return response.data;
  },

  getMyAssignedSOPs: async (params?: SOPQueryParams): Promise<SOPListResponse> => {
    const response = await apiClient.get<SOPListResponse>('/api/v1/governance/sops/my-assigned', { params });
    return response.data;
  },

  getSOPPublicationStatistics: async (): Promise<SOPPublicationStatistics> => {
    const response = await apiClient.get<SOPPublicationStatistics>('/api/v1/governance/sops/statistics/publication');
    return response.data;
  },

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

  getAllTags: async (): Promise<string[]> => {
    const response = await apiClient.get('/api/v1/governance/influencers/tags/all');
    return response.data;
  },

  getTagStatistics: async (): Promise<Array<{ tag: string; count: number }>> => {
    const response = await apiClient.get('/api/v1/governance/influencers/tags/statistics');
    return response.data;
  },

  reviewInfluencer: async (id: string, data: ReviewInfluencerData): Promise<{ data: Influencer }> => {
    const response = await apiClient.post(`/api/v1/governance/influencers/${id}/review`, data);
    return response.data;
  },

  getInfluencerRevisions: async (id: string): Promise<InfluencerRevision[]> => {
    const response = await apiClient.get(`/api/v1/governance/influencers/${id}/revisions`);
    return response.data;
  },

  importInfluencers: async (file: File): Promise<{ created: number; skipped: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/v1/governance/influencers/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
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

  getPolicyWorkflows: async (id: string): Promise<{ data: any[] }> => {
    const response = await apiClient.get(`/api/v1/governance/policies/${id}/workflows`);
    return response.data;
  },

  getPolicyPendingApprovals: async (id: string): Promise<{ data: any[] }> => {
    const response = await apiClient.get(`/api/v1/governance/policies/${id}/workflows/pending-approvals`);
    return response.data;
  },

  publishPolicy: async (
    id: string,
    assignToUserIds?: string[],
    assignToRoleIds?: string[],
    assignToBusinessUnitIds?: string[],
    notificationMessage?: string,
  ): Promise<{ data: Policy }> => {
    const response = await apiClient.post(`/api/v1/governance/policies/${id}/publish`, {
      assign_to_user_ids: assignToUserIds,
      assign_to_role_ids: assignToRoleIds,
      assign_to_business_unit_ids: assignToBusinessUnitIds,
      notification_message: notificationMessage,
    });
    return response.data;
  },

  getMyAssignedPolicies: async (): Promise<PolicyListResponse> => {
    const response = await apiClient.get('/api/v1/governance/policies/assigned/my');
    return response.data;
  },

  // Policy Review API
  getPendingPolicyReviews: async (daysAhead?: number): Promise<{ data: Policy[] }> => {
    const params = daysAhead ? { daysAhead: daysAhead.toString() } : {};
    const response = await apiClient.get('/api/v1/governance/policies/reviews/pending', { params });
    return response.data;
  },

  getPoliciesDueForReview: async (days?: number): Promise<{ data: Policy[] }> => {
    const params = days !== undefined ? { days: days.toString() } : {};
    const response = await apiClient.get('/api/v1/governance/policies/reviews/due', { params });
    return response.data;
  },

  getPolicyReviewStatistics: async (): Promise<{
    data: {
      pending: number;
      overdue: number;
      dueIn30Days: number;
      dueIn60Days: number;
      dueIn90Days: number;
    };
  }> => {
    const response = await apiClient.get('/api/v1/governance/policies/reviews/statistics');
    return response.data;
  },

  initiatePolicyReview: async (policyId: string, reviewDate: string): Promise<{ data: any }> => {
    const response = await apiClient.post(`/api/v1/governance/policies/${policyId}/reviews`, {
      review_date: reviewDate,
    });
    return response.data;
  },

  getPolicyReviewHistory: async (policyId: string): Promise<{ data: any[] }> => {
    const response = await apiClient.get(`/api/v1/governance/policies/${policyId}/reviews`);
    return response.data;
  },

  getActivePolicyReview: async (policyId: string): Promise<{ data: any | null }> => {
    const response = await apiClient.get(`/api/v1/governance/policies/${policyId}/reviews/active`);
    return response.data;
  },

  completePolicyReview: async (
    reviewId: string,
    data: {
      outcome: string;
      notes?: string;
      review_summary?: string;
      recommended_changes?: string;
      next_review_date?: string;
    },
  ): Promise<{ data: any }> => {
    const response = await apiClient.patch(`/api/v1/governance/policies/reviews/${reviewId}/complete`, data);
    return response.data;
  },

  getPolicyPublicationStatistics: async (): Promise<{
    totalPublished: number;
    publishedThisMonth: number;
    publishedThisYear: number;
    assignmentsCount: number;
    acknowledgedCount: number;
    acknowledgmentRate: number;
  }> => {
    const response = await apiClient.get('/api/v1/governance/policies/statistics/publication');
    return response.data;
  },

  // Policy Hierarchy API (Story 2.1)
  getHierarchyTree: async (policyId: string, includeArchived?: boolean): Promise<any> => {
    const params = includeArchived ? { includeArchived: 'true' } : {};
    const response = await apiClient.get(`/api/v1/governance/policies/${policyId}/hierarchy/tree`, { params });
    return response.data?.data;
  },

  getCompleteHierarchy: async (policyId: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/governance/policies/${policyId}/hierarchy`);
    return response.data?.data;
  },

  getHierarchyParent: async (policyId: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/governance/policies/${policyId}/hierarchy/parent`);
    return response.data?.data;
  },

  getHierarchyChildren: async (policyId: string, includeArchived?: boolean): Promise<any[]> => {
    const params = includeArchived ? { includeArchived: 'true' } : {};
    const response = await apiClient.get(`/api/v1/governance/policies/${policyId}/hierarchy/children`, { params });
    return response.data?.data || [];
  },

  getHierarchyAncestors: async (policyId: string): Promise<any[]> => {
    const response = await apiClient.get(`/api/v1/governance/policies/${policyId}/hierarchy/ancestors`);
    return response.data?.data || [];
  },

  getHierarchyDescendants: async (policyId: string): Promise<any[]> => {
    const response = await apiClient.get(`/api/v1/governance/policies/${policyId}/hierarchy/descendants`);
    return response.data?.data || [];
  },

  getHierarchyLevel: async (policyId: string): Promise<number> => {
    const response = await apiClient.get(`/api/v1/governance/policies/${policyId}/hierarchy/level`);
    return response.data?.data?.level || 0;
  },

  getHierarchyRoot: async (policyId: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/governance/policies/${policyId}/hierarchy/root`);
    return response.data?.data;
  },

  getHierarchyRoots: async (includeArchived?: boolean): Promise<any[]> => {
    const params = includeArchived ? { includeArchived: 'true' } : {};
    const response = await apiClient.get('/api/v1/governance/policies/hierarchy/roots', { params });
    return response.data?.data || [];
  },

  getAllHierarchies: async (includeArchived?: boolean): Promise<any[]> => {
    const params = includeArchived ? { includeArchived: 'true' } : {};
    const response = await apiClient.get('/api/v1/governance/policies/hierarchy/all', { params });
    return response.data?.data || [];
  },

  setHierarchyParent: async (policyId: string, data: { parent_policy_id?: string | null; reason?: string }): Promise<{ data: Policy }> => {
    const response = await apiClient.patch(`/api/v1/governance/policies/${policyId}/hierarchy/parent`, data);
    return response.data;
  },

  // Governance Permissions API
  getGovernancePermissions: async (role?: string): Promise<{ data: GovernancePermission[] }> => {
    const params = role ? { role } : {};
    const response = await apiClient.get('/api/v1/governance/permissions', { params });
    return response.data;
  },

  createGovernancePermission: async (data: CreateGovernancePermissionData): Promise<{ data: GovernancePermission }> => {
    const response = await apiClient.post('/api/v1/governance/permissions', data);
    return response.data;
  },

  deleteGovernancePermission: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/permissions/${id}`);
  },

  assignRole: async (data: AssignRoleData): Promise<{ data: GovernanceRoleAssignment }> => {
    const response = await apiClient.post('/api/v1/governance/permissions/assign-role', data);
    return response.data;
  },

  bulkAssignRole: async (data: BulkAssignRoleData): Promise<{ data: GovernanceRoleAssignment[] }> => {
    const response = await apiClient.post('/api/v1/governance/permissions/bulk-assign-role', data);
    return response.data;
  },

  getUserRoleAssignments: async (userId: string): Promise<{ data: GovernanceRoleAssignment[] }> => {
    const response = await apiClient.get(`/api/v1/governance/permissions/user/${userId}/assignments`);
    return response.data;
  },

  removeRoleAssignment: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/permissions/assignments/${id}`);
  },

  testUserPermissions: async (userId: string): Promise<{ data: UserPermissionTestResult }> => {
    const response = await apiClient.get(`/api/v1/governance/permissions/test/${userId}`);
    return response.data;
  },

  checkPermission: async (module: string, action: string, resourceType?: string): Promise<{ hasPermission: boolean }> => {
    const params: Record<string, string> = { module, action };
    if (resourceType) params.resourceType = resourceType;
    const response = await apiClient.get('/api/v1/governance/permissions/check', { params });
    return response.data;
  },

  // Policy Exceptions API
  getPolicyExceptions: async (params?: PolicyExceptionQueryParams): Promise<PolicyExceptionListResponse> => {
    const response = await apiClient.get('/api/v1/governance/policy-exceptions', { params });
    return response.data;
  },

  getPolicyException: async (id: string): Promise<{ data: PolicyException }> => {
    const response = await apiClient.get(`/api/v1/governance/policy-exceptions/${id}`);
    return response.data;
  },

  createPolicyException: async (data: CreatePolicyExceptionData): Promise<{ data: PolicyException }> => {
    const response = await apiClient.post('/api/v1/governance/policy-exceptions', data);
    return response.data;
  },

  updatePolicyException: async (id: string, data: UpdatePolicyExceptionData): Promise<{ data: PolicyException }> => {
    const response = await apiClient.put(`/api/v1/governance/policy-exceptions/${id}`, data);
    return response.data;
  },

  deletePolicyException: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/policy-exceptions/${id}`);
  },

  approvePolicyException: async (id: string, conditions?: string): Promise<{ data: PolicyException }> => {
    const response = await apiClient.post(`/api/v1/governance/policy-exceptions/${id}/approve`, { conditions });
    return response.data;
  },

  rejectPolicyException: async (id: string, reason: string): Promise<{ data: PolicyException }> => {
    const response = await apiClient.post(`/api/v1/governance/policy-exceptions/${id}/reject`, { reason });
    return response.data;
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

  getControlObjectivesByPolicy: async (policyId: string): Promise<ControlObjective[]> => {
    const response = await apiClient.get('/api/v1/governance/control-objectives', {
      params: { policy_id: policyId },
    });
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

  linkUnifiedControlsToObjective: async (id: string, controlIds: string[]): Promise<any> => {
    const response = await apiClient.post(`/api/v1/governance/control-objectives/${id}/unified-controls`, {
      control_ids: controlIds,
    });
    return response.data;
  },

  unlinkUnifiedControlsFromObjective: async (id: string, controlIds: string[]): Promise<any> => {
    const response = await apiClient.delete(`/api/v1/governance/control-objectives/${id}/unified-controls`, {
      data: { control_ids: controlIds },
    });
    return response.data;
  },

  getUnifiedControlsByObjective: async (id: string): Promise<UnifiedControl[]> => {
    const response = await apiClient.get(`/api/v1/governance/control-objectives/${id}/unified-controls`);
    return response.data;
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

  generateEvidencePackage: async (options: {
    evidenceIds?: string[];
    controlId?: string;
    assessmentId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<void> => {
    const response = await apiClient.post('/api/v1/governance/evidence/generate-package', options, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    const contentDisposition = response.headers['content-disposition'];
    let filename = `evidence_package_${new Date().toISOString().split('T')[0]}.zip`;
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

  // ==================== UNIFIED CONTROLS LIBRARY (Story 3.1) ====================

  getLibraryStatistics: async (): Promise<any> => {
    const response = await apiClient.get('/api/v1/governance/unified-controls/library/statistics');
    return response.data;
  },

  getDomainTree: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/v1/governance/unified-controls/library/domains/tree');
    return response.data;
  },

  getActiveDomains: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/v1/governance/unified-controls/library/domains');
    return response.data;
  },

  getControlTypes: async (): Promise<string[]> => {
    const response = await apiClient.get('/api/v1/governance/unified-controls/library/types');
    return response.data;
  },

  browseLibrary: async (filters: {
    domain?: string;
    type?: string;
    complexity?: string;
    status?: string;
    implementationStatus?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<any> => {
    const params = new URLSearchParams();
    if (filters.domain) params.append('domain', filters.domain);
    if (filters.type) params.append('type', filters.type);
    if (filters.complexity) params.append('complexity', filters.complexity);
    if (filters.status) params.append('status', filters.status);
    if (filters.implementationStatus) params.append('implementationStatus', filters.implementationStatus);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get(`/api/v1/governance/unified-controls/library/browse?${params.toString()}`);
    return response.data;
  },

  getControlsDashboard: async (): Promise<any> => {
    const response = await apiClient.get('/api/v1/governance/unified-controls/library/dashboard');
    return response.data;
  },

  exportControls: async (filters?: {
    domain?: string;
    type?: string;
    status?: string;
  }): Promise<string> => {
    const params = new URLSearchParams();
    if (filters?.domain) params.append('domain', filters.domain);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);

    const response = await apiClient.get(`/api/v1/governance/unified-controls/library/export?${params.toString()}`);
    return response.data;
  },

  importControls: async (importData: any[]): Promise<any> => {
    const response = await apiClient.post('/api/v1/governance/unified-controls/library/import', { controls: importData });
    return response.data;
  },

  getControlsByDomain: async (domainId: string): Promise<any[]> => {
    const response = await apiClient.get(`/api/v1/governance/unified-controls/${domainId}/domain`);
    return response.data;
  },

  getRelatedControls: async (controlId: string, limit?: number): Promise<any[]> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await apiClient.get(`/api/v1/governance/unified-controls/${controlId}/related${params}`);
    return response.data;
  },

  getControlEffectiveness: async (controlId: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/governance/unified-controls/${controlId}/effectiveness`);
    return response.data;
  },

  // Compliance Reporting (Story 6.1)
  generateComplianceReport: async (data: {
    report_period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM';
    period_start_date?: string;
    period_end_date?: string;
  }): Promise<{ data: any }> => {
    const response = await apiClient.post('/api/v1/governance/compliance/reports/generate', data);
    return response.data;
  },

  getComplianceReport: async (id: string): Promise<{ data: any }> => {
    const response = await apiClient.get(`/api/v1/governance/compliance/reports/${id}`);
    return response.data;
  },

  getComplianceReports: async (params?: {
    page?: number;
    limit?: number;
    period?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM';
    rating?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    period_start_date?: string;
    period_end_date?: string;
    search?: string;
    sort?: string;
  }): Promise<{ data: any[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
    const response = await apiClient.get('/api/v1/governance/compliance/reports', { params });
    return response.data;
  },

  getLatestComplianceReport: async (): Promise<{ data: any }> => {
    const response = await apiClient.get('/api/v1/governance/compliance/reports/latest/current');
    return response.data;
  },

  getComplianceDashboard: async (): Promise<{ data: any }> => {
    const response = await apiClient.get('/api/v1/governance/compliance/dashboard');
    return response.data;
  },

  archiveComplianceReport: async (id: string): Promise<{ data: any }> => {
    const response = await apiClient.patch(`/api/v1/governance/compliance/reports/${id}/archive`);
    return response.data;
  },

  // Control Domains
  getDomains: async (includeInactive?: boolean): Promise<ControlDomain[]> => {
    const response = await apiClient.get('/api/v1/governance/domains', {
      params: { includeInactive },
    });
    return response.data;
  },

  getDomainHierarchy: async (): Promise<ControlDomain[]> => {
    const response = await apiClient.get('/api/v1/governance/domains/hierarchy');
    return response.data;
  },

  getDomain: async (id: string): Promise<ControlDomain> => {
    const response = await apiClient.get(`/api/v1/governance/domains/${id}`);
    return response.data;
  },

  createDomain: async (data: CreateDomainData): Promise<ControlDomain> => {
    const response = await apiClient.post('/api/v1/governance/domains', data);
    return response.data;
  },

  updateDomain: async (id: string, data: Partial<CreateDomainData>): Promise<ControlDomain> => {
    const response = await apiClient.patch(`/api/v1/governance/domains/${id}`, data);
    return response.data;
  },

  deleteDomain: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/domains/${id}`);
  },

  getDomainStatistics: async (): Promise<DomainStatistics> => {
    const response = await apiClient.get('/api/v1/governance/domains/statistics');
    return response.data;
  },

  // Standards API
  getStandards: async (params?: StandardQueryParams): Promise<StandardListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.policy_id) queryParams.append('policy_id', params.policy_id);
    if (params?.control_objective_id) queryParams.append('control_objective_id', params.control_objective_id);
    if (params?.owner_id) queryParams.append('owner_id', params.owner_id);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);

    const url = `/api/v1/governance/standards${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<StandardListResponse>(url);
    return response.data;
  },

  getStandard: async (id: string): Promise<Standard> => {
    const response = await apiClient.get<Standard>(`/api/v1/governance/standards/${id}`);
    return response.data;
  },

  createStandard: async (data: CreateStandardData): Promise<Standard> => {
    const response = await apiClient.post<Standard>('/api/v1/governance/standards', data);
    return response.data;
  },

  updateStandard: async (id: string, data: UpdateStandardData): Promise<Standard> => {
    const response = await apiClient.patch<Standard>(`/api/v1/governance/standards/${id}`, data);
    return response.data;
  },

  deleteStandard: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/standards/${id}`);
  },

  // Alerts
  getAlerts: async (status?: AlertStatus, severity?: AlertSeverity, limit?: number, offset?: number): Promise<AlertListResponse> => {
    const params: Record<string, any> = {};
    if (status) params.status = status;
    if (severity) params.severity = severity;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    const response = await apiClient.get<AlertListResponse>('/api/v1/governance/alerts', { params });
    return response.data;
  },

  createAlert: async (data: CreateAlertDto): Promise<{ data: Alert }> => {
    const response = await apiClient.post<{ data: Alert }>('/api/v1/governance/alerts', data);
    return response.data;
  },

  acknowledgeAlert: async (id: string): Promise<{ data: Alert }> => {
    const response = await apiClient.post<{ data: Alert }>(`/api/v1/governance/alerts/${id}/acknowledge`);
    return response.data;
  },

  resolveAlert: async (id: string, resolution: string): Promise<{ data: Alert }> => {
    const response = await apiClient.post<{ data: Alert }>(`/api/v1/governance/alerts/${id}/resolve`, { resolution });
    return response.data;
  },

  // Alert Rules
  getAlertRules: async (): Promise<AlertRuleListResponse> => {
    const response = await apiClient.get<AlertRuleListResponse>('/api/v1/governance/alerts/rules');
    return response.data;
  },

  createAlertRule: async (data: CreateAlertRuleDto): Promise<AlertRule> => {
    const response = await apiClient.post<AlertRule>('/api/v1/governance/alerting/rules', data);
    return response.data;
  },

  updateAlertRule: async (id: string, data: Partial<CreateAlertRuleDto>): Promise<AlertRule> => {
    const response = await apiClient.patch<AlertRule>(`/api/v1/governance/alerts/rules/${id}`, data);
    return response.data;
  },

  deleteAlertRule: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/alerts/rules/${id}`);
  },

  triggerAlertRule: async (id: string): Promise<void> => {
    await apiClient.post(`/api/v1/governance/alerts/rules/${id}/trigger`);
  },

  // Alert Subscriptions
  getAlertSubscriptions: async (): Promise<AlertSubscriptionListResponse> => {
    const response = await apiClient.get<AlertSubscriptionListResponse>('/api/v1/governance/alerts/subscriptions');
    return response.data;
  },

  createAlertSubscription: async (data: CreateAlertSubscriptionDto): Promise<AlertSubscription> => {
    const response = await apiClient.post<AlertSubscription>('/api/v1/governance/alerts/subscriptions', data);
    return response.data;
  },

  updateAlertSubscription: async (id: string, data: Partial<CreateAlertSubscriptionDto>): Promise<AlertSubscription> => {
    const response = await apiClient.patch<AlertSubscription>(`/api/v1/governance/alerts/subscriptions/${id}`, data);
    return response.data;
  },

  deleteAlertSubscription: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/alerts/subscriptions/${id}`);
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
  getDashboard: async (startDate?: string, endDate?: string): Promise<GovernanceDashboard> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const queryParams = new URLSearchParams(params);
    const url = `/api/v1/governance/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<GovernanceDashboard>(url);
    return response.data;
  },

  exportDashboard: async (startDate?: string, endDate?: string): Promise<Blob> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const queryParams = new URLSearchParams(params);
    const url = `/api/v1/governance/dashboard/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url, { responseType: 'blob' });
    return response.data;
  },

  getDashboardOld: async (): Promise<GovernanceDashboard> => {
    const response = await apiClient.get<GovernanceDashboard>('/api/v1/governance/dashboard');
    return response.data;
  },
  getTrends: async (): Promise<GovernacyTrendResponse> => {
    const response = await apiClient.get<GovernacyTrendResponse>('/api/v1/governance/dashboard/trends');
    return response.data;
  },

  getEffectivenessTrends: async (controlId?: string, rangeDays?: number): Promise<Array<{ date: string; score: number }>> => {
    const params = { controlId, rangeDays };
    const response = await apiClient.get('/api/v1/governance/dashboard/effectiveness/trends', { params });
    return response.data;
  },
};

export interface CreateRemediationTrackerData {
  remediation_priority: RemediationPriority;
  sla_due_date: string;
  remediation_steps?: string;
  assigned_to_id?: string;
}

export interface UpdateRemediationTrackerData {
  remediation_priority?: RemediationPriority;
  sla_due_date?: string;
  remediation_steps?: string;
  assigned_to_id?: string;
  progress_percent?: number;
  progress_notes?: string;
}

export interface CompleteRemediationData {
  completion_notes: string;
  completion_evidence?: Record<string, any>;
}

// Remediation Tracking API
export const remediationTrackingApi = {
  getDashboard: async (): Promise<RemediationDashboard> => {
    const response = await apiClient.get<RemediationDashboard>('/api/v1/governance/remediation/dashboard');
    return response.data;
  },

  createTracker: async (findingId: string, data: CreateRemediationTrackerData): Promise<{ data: RemediationTracker }> => {
    const response = await apiClient.post(`/api/v1/governance/remediation/finding/${findingId}`, data);
    return response.data;
  },

  updateTracker: async (trackerId: string, data: UpdateRemediationTrackerData): Promise<{ data: RemediationTracker }> => {
    const response = await apiClient.put(`/api/v1/governance/remediation/${trackerId}`, data);
    return response.data;
  },

  completeRemediation: async (trackerId: string, data: CompleteRemediationData): Promise<{ data: RemediationTracker }> => {
    const response = await apiClient.patch(`/api/v1/governance/remediation/${trackerId}/complete`, data);
    return response.data;
  },

  getTrackersByFinding: async (findingId: string): Promise<{ data: RemediationTracker[] }> => {
    const response = await apiClient.get(`/api/v1/governance/remediation/finding/${findingId}/trackers`);
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

  getPolicyComplianceStats: async (): Promise<{
    byPolicy: Array<{ id: string; title: string; totalAssignments: number; acknowledged: number; rate: number }>;
    byDepartment: Array<{ department: string; total: number; acknowledged: number; rate: number }>;
  }> => {
    const response = await apiClient.get('/api/v1/governance/reports/policy-compliance/stats');
    return response.data;
  },

  getExecutiveSummary: async (): Promise<GovernanceDashboard> => {
    const response = await apiClient.get('/api/v1/governance/reports/executive/summary');
    return response.data;
  },

  exportExecutiveReport: async (filters?: { format?: ExportFormat }): Promise<void> => {
    const params = new URLSearchParams();
    params.append('type', 'executive_governance');
    if (filters?.format) params.append('format', filters.format);

    const response = await apiClient.get(`/api/v1/governance/reports/export?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'executive_governance_report.csv';
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

    const url = `/api/v1/governance/unified-controls/${controlId}/assets${queryParams.toString() ? `?${queryParams.toString()}` : ''
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

    const url = `/api/v1/governance/unified-controls/assets/${assetType}/${assetId}/controls${queryParams.toString() ? `?${queryParams.toString()}` : ''
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

  // ==================== ASSET COMPLIANCE METHODS (Story 5.1) ====================

  getAssetCompliancePosture: async (
    assetType: AssetType,
    assetId: string,
  ): Promise<any> => {
    const response = await apiClient.get(
      `/api/v1/governance/unified-controls/assets/${assetType}/${assetId}/compliance`,
    );
    return response.data;
  },

  getAssetTypeComplianceOverview: async (assetType: AssetType): Promise<any> => {
    const response = await apiClient.get(
      `/api/v1/governance/unified-controls/assets/${assetType}/compliance-overview`,
    );
    return response.data;
  },

  getControlAssetMatrix: async (filters?: {
    assetType?: AssetType;
    controlDomain?: string;
    implementationStatus?: ImplementationStatus;
  }): Promise<any> => {
    const params = new URLSearchParams();
    if (filters?.assetType) params.append('assetType', filters.assetType);
    if (filters?.controlDomain) params.append('controlDomain', filters.controlDomain);
    if (filters?.implementationStatus) params.append('implementationStatus', filters.implementationStatus);

    const url = `/api/v1/governance/unified-controls/matrix${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  getControlEffectivenessSummary: async (controlId: string): Promise<any> => {
    const response = await apiClient.get(
      `/api/v1/governance/unified-controls/${controlId}/effectiveness-summary`,
    );
    return response.data;
  },

  bulkUpdateImplementationStatus: async (
    updates: Array<{
      controlId: string;
      assetType: AssetType;
      assetId: string;
      implementationStatus: ImplementationStatus;
      implementationNotes?: string;
      effectivenessScore?: number;
    }>,
  ): Promise<any> => {
    const response = await apiClient.patch(
      '/api/v1/governance/unified-controls/assets/bulk-update-status',
      { updates },
    );
    return response.data;
  },


  // SOPs API
  getSOPs: async (params?: SOPQueryParams): Promise<SOPListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.owner_id) queryParams.append('owner_id', params.owner_id);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);

    const url = `/api/v1/governance/sops${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<SOPListResponse>(url);
    return response.data;
  },

  getSOP: async (id: string): Promise<SOP> => {
    const response = await apiClient.get<SOP>(`/api/v1/governance/sops/${id}`);
    return response.data;
  },

  createSOP: async (data: CreateSOPData): Promise<SOP> => {
    const response = await apiClient.post<SOP>('/api/v1/governance/sops', data);
    return response.data;
  },

  updateSOP: async (id: string, data: UpdateSOPData): Promise<SOP> => {
    const response = await apiClient.patch<SOP>(`/api/v1/governance/sops/${id}`, data);
    return response.data;
  },

  deleteSOP: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/sops/${id}`);
  },

  publishSOP: async (
    id: string,
    assignToUserIds?: string[],
    assignToRoleIds?: string[],
  ): Promise<SOP> => {
    const response = await apiClient.post<SOP>(`/api/v1/governance/sops/${id}/publish`, {
      assign_to_user_ids: assignToUserIds,
      assign_to_role_ids: assignToRoleIds,
    });
    return response.data;
  },

  getMyAssignedSOPs: async (params?: SOPQueryParams): Promise<SOPListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);

    const url = `/api/v1/governance/sops/my-assigned${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<SOPListResponse>(url);
    return response.data;
  },

  getSOPPublicationStatistics: async (): Promise<{
    totalPublished: number;
    publishedThisMonth: number;
    publishedThisYear: number;
    assignmentsCount: number;
    acknowledgedCount: number;
    acknowledgmentRate: number;
  }> => {
    const response = await apiClient.get('/api/v1/governance/sops/statistics/publication');
    return response.data;
  },

  // Compliance Scorecard API
  getComplianceScorecard: async (frameworkIds?: string[]): Promise<ComplianceScorecardResponse> => {
    const params: Record<string, string> = {};
    if (frameworkIds && frameworkIds.length > 0) {
      params.frameworkIds = frameworkIds.join(',');
    }

    const queryParams = new URLSearchParams(params);
    const url = `/api/v1/governance/scorecard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<ComplianceScorecardResponse>(url);
    return response.data;
  },

  // Framework-Control Mapping API
  getControlFrameworkMappings: async (controlId: string): Promise<any[]> => {
    const response = await apiClient.get(`/api/v1/governance/unified-controls/${controlId}/framework-mappings`);
    return response.data;
  },

  // Framework Version Control API
  createFrameworkVersion: async (frameworkId: string, data: {
    version: string;
    version_notes?: string;
    structure?: any;
    effective_date?: string;
    is_current?: boolean;
  }): Promise<FrameworkVersion> => {
    const response = await apiClient.post(`/api/v1/governance/frameworks/${frameworkId}/versions`, data);
    return response.data;
  },

  getFrameworkVersions: async (frameworkId: string): Promise<FrameworkVersion[]> => {
    const response = await apiClient.get(`/api/v1/governance/frameworks/${frameworkId}/versions`);
    return response.data;
  },

  getFrameworkVersion: async (frameworkId: string, version: string): Promise<FrameworkVersion> => {
    const response = await apiClient.get(`/api/v1/governance/frameworks/${frameworkId}/versions/${version}`);
    return response.data;
  },

  setCurrentFrameworkVersion: async (frameworkId: string, version: string): Promise<FrameworkVersion> => {
    const response = await apiClient.post(`/api/v1/governance/frameworks/${frameworkId}/versions/${version}/set-current`);
    return response.data;
  },

  importFrameworkStructure: async (frameworkId: string, data: {
    structure: any;
    version?: string;
    create_version?: boolean;
    replace_existing?: boolean;
  }): Promise<{ framework: any; requirementsCreated: number; version?: FrameworkVersion }> => {
    const response = await apiClient.post(`/api/v1/governance/frameworks/${frameworkId}/import-structure`, data);
    return response.data;
  },

  importFrameworkStructureFromFile: async (
    frameworkId: string,
    file: File,
    options?: { version?: string; create_version?: boolean; replace_existing?: boolean }
  ): Promise<{ framework: any; requirementsCreated: number; version?: FrameworkVersion }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options?.version) formData.append('version', options.version);
    if (options?.create_version) formData.append('create_version', 'true');
    if (options?.replace_existing) formData.append('replace_existing', 'true');

    const response = await apiClient.post(
      `/api/v1/governance/frameworks/${frameworkId}/import-structure-file`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getFrameworkWithStructure: async (frameworkId: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/governance/frameworks/${frameworkId}/structure`);
    return response.data;
  },

  createControlFrameworkMapping: async (
    controlId: string,
    data: { requirement_id: string; coverage_level: string; mapping_notes?: string },
  ): Promise<any> => {
    const response = await apiClient.post(`/api/v1/governance/unified-controls/${controlId}/framework-mappings`, data);
    return response.data;
  },

  bulkCreateControlFrameworkMappings: async (
    controlId: string,
    data: { requirement_ids: string[]; coverage_level: string; mapping_notes?: string },
  ): Promise<any> => {
    const response = await apiClient.post(
      `/api/v1/governance/unified-controls/${controlId}/framework-mappings/bulk`,
      data,
    );
    return response.data;
  },

  updateControlFrameworkMapping: async (
    mappingId: string,
    data: { coverage_level?: string; mapping_notes?: string },
  ): Promise<any> => {
    const response = await apiClient.patch(`/api/v1/governance/unified-controls/framework-mappings/${mappingId}`, data);
    return response.data;
  },

  deleteControlFrameworkMapping: async (mappingId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/unified-controls/framework-mappings/${mappingId}`);
  },

  getCoverageMatrix: async (frameworkId: string): Promise<Array<{
    requirementId: string;
    requirementIdentifier: string;
    requirementTitle: string;
    controlId: string;
    controlIdentifier: string;
    controlTitle: string;
    coverageLevel: MappingCoverage;
  }>> => {
    const response = await apiClient.get(`/api/v1/governance/unified-controls/frameworks/${frameworkId}/coverage-matrix`);
    return response.data;
  },


  // Audit Logs
  getAuditLogs: async (params?: AuditLogQueryParams): Promise<AuditLogListResponse> => {
    const response = await apiClient.get('/api/v1/audit-logs', { params });
    return response.data;
  },

  getEntityAuditLogs: async (
    entityType: string,
    entityId: string,
    limit?: number,
  ): Promise<AuditLog[]> => {
    const response = await apiClient.get(`/api/v1/audit-logs/entity/${entityType}/${entityId}`, {
      params: { limit },
    });
    return response.data;
  },

  getUserAuditLogs: async (userId: string, limit?: number): Promise<AuditLog[]> => {
    const response = await apiClient.get(`/api/v1/audit-logs/user/${userId}`, {
      params: { limit },
    });
    return response.data;
  },

  getActionAuditLogs: async (action: string, limit?: number): Promise<AuditLog[]> => {
    const response = await apiClient.get(`/api/v1/audit-logs/action/${action}`, {
      params: { limit },
    });
    return response.data;
  },

  searchAuditLogs: async (query: string, limit?: number): Promise<AuditLog[]> => {
    const response = await apiClient.get('/api/v1/audit-logs/search', {
      params: { q: query, limit },
    });
    return response.data;
  },

  getAuditLogSummary: async (): Promise<AuditLogSummary> => {
    const response = await apiClient.get('/api/v1/audit-logs/summary/stats');
    return response.data;
  },

  exportAuditLogs: async (entityType?: string, entityId?: string): Promise<void> => {
    const params: any = {};
    if (entityType) params.entityType = entityType;
    if (entityId) params.entityId = entityId;

    const response = await apiClient.get('/api/v1/audit-logs/export/csv', {
      params,
    });

    const { content, filename } = response.data;
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Obligations
  getObligations: async (params?: ObligationQueryParams): Promise<ObligationListResponse> => {
    const response = await apiClient.get('/api/v1/governance/obligations', { params });
    return response.data;
  },

  getObligation: async (id: string): Promise<ComplianceObligation> => {
    const response = await apiClient.get(`/api/v1/governance/obligations/${id}`);
    return response.data;
  },

  createObligation: async (data: CreateComplianceObligationData): Promise<ComplianceObligation> => {
    const response = await apiClient.post('/api/v1/governance/obligations', data);
    return response.data;
  },

  updateObligation: async (id: string, data: Partial<CreateComplianceObligationData>): Promise<ComplianceObligation> => {
    const response = await apiClient.patch(`/api/v1/governance/obligations/${id}`, data);
    return response.data;
  },

  deleteObligation: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/obligations/${id}`);
  },

  getObligationStatistics: async (): Promise<any> => {
    const response = await apiClient.get('/api/v1/governance/obligations/statistics');
    return response.data;
  },

  // Baselines
  getBaselines: async (params?: BaselineQueryParams): Promise<BaselineListResponse> => {
    const response = await apiClient.get('/api/v1/governance/baselines', { params });
    return response.data;
  },

  getBaseline: async (id: string): Promise<SecureBaseline> => {
    const response = await apiClient.get(`/api/v1/governance/baselines/${id}`);
    return response.data;
  },

  createBaseline: async (data: CreateSecureBaselineData): Promise<SecureBaseline> => {
    const response = await apiClient.post('/api/v1/governance/baselines', data);
    return response.data;
  },

  updateBaseline: async (id: string, data: Partial<CreateSecureBaselineData>): Promise<SecureBaseline> => {
    const response = await apiClient.patch(`/api/v1/governance/baselines/${id}`, data);
    return response.data;
  },

  deleteBaseline: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/baselines/${id}`);
  },

  // Control Testing
  getControlTests: async (params?: ControlTestQueryParams): Promise<ControlTestListResponse> => {
    const response = await apiClient.get('/api/v1/governance/control-tests', { params });
    return response.data;
  },

  getControlTest: async (id: string): Promise<ControlTest> => {
    const response = await apiClient.get(`/api/v1/governance/control-tests/${id}`);
    return response.data;
  },

  createControlTest: async (data: CreateControlTestData): Promise<ControlTest> => {
    const response = await apiClient.post('/api/v1/governance/control-tests', data);
    return response.data;
  },

  updateControlTest: async (id: string, data: Partial<CreateControlTestData>): Promise<ControlTest> => {
    const response = await apiClient.patch(`/api/v1/governance/control-tests/${id}`, data);
    return response.data;
  },

  deleteControlTest: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/control-tests/${id}`);
  },

  // SOP Logs
  getSOPLogs: async (params?: SOPLogQueryParams): Promise<SOPLogListResponse> => {
    const response = await apiClient.get('/api/v1/governance/sop-logs', { params });
    return response.data;
  },

  getSOPLog: async (id: string): Promise<SOPLog> => {
    const response = await apiClient.get(`/api/v1/governance/sop-logs/${id}`);
    return response.data;
  },

  createSOPLog: async (data: CreateSOPLogData): Promise<SOPLog> => {
    const response = await apiClient.post('/api/v1/governance/sop-logs', data);
    return response.data;
  },

  updateSOPLog: async (id: string, data: Partial<CreateSOPLogData>): Promise<SOPLog> => {
    const response = await apiClient.patch(`/api/v1/governance/sop-logs/${id}`, data);
    return response.data;
  },

  deleteSOPLog: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/sop-logs/${id}`);
  },

  getSOPLogStatistics: async (): Promise<any> => {
    const response = await apiClient.get('/api/v1/governance/sop-logs/statistics');
    return response.data;
  },

  getTraceabilityGraph: async (rootId?: string, rootType?: string): Promise<TraceabilityGraph> => {
    const params = { rootId, rootType };
    const response = await apiClient.get('/api/v1/governance/traceability/graph', { params });
    return response.data;
  },

  getPolicyHierarchy: async (): Promise<HierarchyNode[]> => {
    const response = await apiClient.get('/api/v1/governance/hierarchy/policy');
    return response.data;
  },

  importGovernanceData: async (type: 'policies' | 'controls', file: File): Promise<{ created: number; skipped: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/api/v1/governance/data/import/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  exportGovernanceData: async (type: 'policies' | 'controls' | 'influencers'): Promise<any[]> => {
    const response = await apiClient.get(`/api/v1/governance/data/export/${type}`);
    return response.data;
  },

  // AI
  getAIMappingSuggestions: async (influencerId: string): Promise<AISuggestion[]> => {
    const response = await apiClient.get(`/api/v1/governance/ai/suggest-mappings/${influencerId}`);
    return response.data;
  },

  predictControlEffectiveness: async (controlId: string): Promise<{
    forecast: Array<{ date: string; score: number }>;
    reasoning: string;
    riskWarnings: string[];
  }> => {
    const response = await apiClient.get(`/api/v1/governance/ai/predict-effectiveness/${controlId}`);
    return response.data;
  },

  simulatePolicyImpact: async (policyId: string, changes: any): Promise<{
    affectedAreas: Array<{ entityType: string; entityId: string; label: string; impactDescription: string; severity: 'low' | 'medium' | 'high' }>;
    effortEstimate: 'low' | 'medium' | 'high';
    riskSummary: string;
    recommendations: string[];
  }> => {
    const response = await apiClient.post(`/api/v1/governance/ai/simulate-policy-impact/${policyId}`, changes);
    return response.data;
  },

  // Document Templates
  getDocumentTemplates: async (params?: TemplateQueryParams): Promise<DocumentTemplate[]> => {
    const response = await apiClient.get('/api/v1/governance/templates', { params });
    return response.data;
  },

  getDocumentTemplate: async (id: string): Promise<DocumentTemplate> => {
    const response = await apiClient.get(`/api/v1/governance/templates/${id}`);
    return response.data;
  },

  createDocumentTemplate: async (data: CreateDocumentTemplateData): Promise<DocumentTemplate> => {
    const response = await apiClient.post('/api/v1/governance/templates', data);
    return response.data;
  },

  updateDocumentTemplate: async (id: string, data: Partial<CreateDocumentTemplateData>): Promise<DocumentTemplate> => {
    const response = await apiClient.patch(`/api/v1/governance/templates/${id}`, data);
    return response.data;
  },

  deleteDocumentTemplate: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/templates/${id}`);
  },

  // Integrations
  getIntegrationHooks: async (): Promise<IntegrationHook[]> => {
    const response = await apiClient.get('/api/v1/governance/integrations/hooks');
    return response.data;
  },

  createIntegrationHook: async (data: CreateIntegrationHookData): Promise<IntegrationHook> => {
    const response = await apiClient.post('/api/v1/governance/integrations/hooks', data);
    return response.data;
  },

  getIntegrationLogs: async (id: string): Promise<IntegrationLog[]> => {
    const response = await apiClient.get(`/api/v1/governance/integrations/hooks/${id}/logs`);
    return response.data;
  },
};

// Integration Types
export enum HookType {
  SIEM = 'siem',
  VULNERABILITY_SCANNER = 'vulnerability_scanner',
  CLOUD_MONITOR = 'cloud_monitor',
  CUSTOM = 'custom',
}

export enum HookAction {
  CREATE_EVIDENCE = 'create_evidence',
  CREATE_FINDING = 'create_finding',
  UPDATE_CONTROL_STATUS = 'update_control_status',
}

export interface IntegrationHook {
  id: string;
  name: string;
  description?: string;
  type: HookType;
  action: HookAction;
  secretKey: string;
  config: {
    mapping: Record<string, string>;
    filters?: Array<{ field: string; operator: string; value: any }>;
    defaultValues?: Record<string, any>;
  };
  isActive: boolean;
  created_at: string;
}

export interface CreateIntegrationHookData {
  name: string;
  description?: string;
  type: HookType;
  action: HookAction;
  config?: any;
  isActive?: boolean;
}

export interface IntegrationLog {
  id: string;
  hook_id: string;
  status: 'success' | 'failed';
  payload: any;
  result: any;
  errorMessage?: string;
  ipAddress?: string;
  created_at: string;
}

// Template Types
export enum TemplateType {
  POLICY = 'policy',
  SOP = 'sop',
  STANDARD = 'standard',
  REPORT = 'report',
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  type: TemplateType;
  category?: string;
  content: string;
  structure?: any;
  version: string;
  isActive: boolean;
  restricted_to_roles?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentTemplateData {
  name: string;
  description?: string;
  type: TemplateType;
  category?: string;
  content: string;
  structure?: any;
  version?: string;
  isActive?: boolean;
}

export interface TemplateQueryParams {
  type?: TemplateType;
  category?: string;
  isActive?: boolean;
  search?: string;
}

// AI Types
export interface AISuggestion {
  targetId: string;
  targetType: 'policy' | 'control';
  confidence: number;
  reasoning: string;
  matchScore: number;
}

// Hierarchy Types
export interface HierarchyNode {
  id: string;
  type: 'policy' | 'standard' | 'sop' | 'objective';
  label: string;
  identifier: string;
  status: string;
  children?: HierarchyNode[];
}

// Traceability Types
export interface TraceabilityNode {
  id: string;
  type: 'influencer' | 'policy' | 'objective' | 'control' | 'baseline';
  label: string;
  identifier: string;
  status: string;
}

export interface TraceabilityLink {
  source: string;
  target: string;
  type: string;
}

export interface TraceabilityGraph {
  nodes: TraceabilityNode[];
  links: TraceabilityLink[];
}

// SOP Log Types
export interface SOPLog {
  id: string;
  sop_id: string;
  sop?: SOP;
  execution_date: string;
  start_time?: string;
  end_time?: string;
  outcome: ExecutionOutcome;
  notes?: string;
  step_results?: Array<{ step: string; result: string; observations?: string }>;
  executor_id: string;
  executor?: User;
  created_at: string;
  updated_at: string;
}

export interface CreateSOPLogData {
  sop_id: string;
  execution_date: string;
  start_time?: string;
  end_time?: string;
  outcome?: ExecutionOutcome;
  notes?: string;
  step_results?: Array<{ step: string; result: string; observations?: string }>;
  executor_id?: string;
}

export interface SOPLogQueryParams {
  page?: number;
  limit?: number;
  sop_id?: string;
  executor_id?: string;
  outcome?: ExecutionOutcome;
  search?: string;
}

export interface SOPLogListResponse {
  data: SOPLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Control Test Types
export enum ControlTestType {
  DESIGN = 'design',
  OPERATING = 'operating',
  TECHNICAL = 'technical',
  MANAGEMENT = 'management',
}

export enum ControlTestStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ControlTestResult {
  PASS = 'pass',
  FAIL = 'fail',
  INCONCLUSIVE = 'inconclusive',
  NOT_APPLICABLE = 'not_applicable',
}

export interface ControlTest {
  id: string;
  unified_control_id: string;
  unified_control?: UnifiedControl;
  control_asset_mapping_id?: string;
  control_asset_mapping?: ControlAssetMapping;
  test_type: ControlTestType;
  test_date: string;
  status: ControlTestStatus;
  result?: ControlTestResult;
  effectiveness_score?: number;
  test_procedure?: string;
  observations?: string;
  recommendations?: string;
  evidence_links?: Array<{ title: string; url: string; uploaded_at: string }>;
  tester_id?: string;
  tester?: User;
  created_at: string;
  updated_at: string;
}

export interface CreateControlTestData {
  unified_control_id: string;
  control_asset_mapping_id?: string;
  test_type?: ControlTestType;
  test_date: string;
  status?: ControlTestStatus;
  result?: ControlTestResult;
  effectiveness_score?: number;
  test_procedure?: string;
  observations?: string;
  recommendations?: string;
  evidence_links?: Array<{ title: string; url: string; uploaded_at: string }>;
  tester_id?: string;
}

export interface ControlTestQueryParams {
  page?: number;
  limit?: number;
  unified_control_id?: string;
  tester_id?: string;
  test_type?: ControlTestType;
  status?: ControlTestStatus;
  result?: ControlTestResult;
  search?: string;
}

export interface ControlTestListResponse {
  data: ControlTest[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Baseline Types
export enum BaselineStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
  ARCHIVED = 'archived',
}

export interface BaselineRequirement {
  id: string;
  requirement_identifier: string;
  title: string;
  description?: string;
  configuration_value?: string;
  validation_method?: string;
  display_order?: number;
}

export interface SecureBaseline {
  id: string;
  baseline_identifier: string;
  name: string;
  description?: string;
  category?: string;
  version?: string;
  status: BaselineStatus;
  owner_id?: string;
  owner?: User;
  requirements: BaselineRequirement[];
  control_objectives: ControlObjective[];
  created_at: string;
  updated_at: string;
}

export interface CreateSecureBaselineData {
  name: string;
  description?: string;
  category?: string;
  version?: string;
  status?: BaselineStatus;
  owner_id?: string;
  requirements?: Omit<BaselineRequirement, 'id'>[];
  control_objective_ids?: string[];
}

export interface BaselineQueryParams {
  page?: number;
  limit?: number;
  status?: BaselineStatus;
  category?: string;
  search?: string;
  sort?: string;
}

export interface BaselineListResponse {
  data: SecureBaseline[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Obligation Types
export enum ObligationStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  MET = 'met',
  PARTIALLY_MET = 'partially_met',
  NOT_MET = 'not_met',
  NOT_APPLICABLE = 'not_applicable',
  OVERDUE = 'overdue',
}

export enum ObligationPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export interface ComplianceObligation {
  id: string;
  obligation_identifier: string;
  title: string;
  description?: string;
  influencer_id?: string;
  influencer?: Influencer;
  source_reference?: string;
  owner_id?: string;
  owner?: User;
  business_unit_id?: string;
  business_unit?: BusinessUnit;
  status: ObligationStatus;
  priority: ObligationPriority;
  due_date?: string;
  completion_date?: string;
  evidence_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateComplianceObligationData {
  title: string;
  description?: string;
  influencer_id?: string;
  source_reference?: string;
  owner_id?: string;
  business_unit_id?: string;
  status?: ObligationStatus;
  priority?: ObligationPriority;
  due_date?: string;
  evidence_summary?: string;
}

export interface ObligationQueryParams {
  page?: number;
  limit?: number;
  status?: ObligationStatus;
  priority?: ObligationPriority;
  influencer_id?: string;
  owner_id?: string;
  business_unit_id?: string;
  search?: string;
  sort?: string;
}

export interface ObligationListResponse {
  data: ComplianceObligation[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Audit Log Types
export enum AuditActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  PUBLISH = 'PUBLISH',
  ARCHIVE = 'ARCHIVE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  VIEW = 'VIEW',
  ASSIGN = 'ASSIGN',
  COMMENT = 'COMMENT',
  STATUS_CHANGE = 'STATUS_CHANGE',
  PERMISSION_GRANT = 'PERMISSION_GRANT',
  PERMISSION_REVOKE = 'PERMISSION_REVOKE',
}

export interface AuditLog {
  id: string;
  userId: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  action: AuditActionType;
  entityType: string;
  entityId: string;
  description: string;
  changes?: Record<string, { old: any; new: any }>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AuditLogQueryParams {
  skip?: number;
  take?: number;
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: AuditActionType;
  startDate?: string;
  endDate?: string;
}

export interface AuditLogListResponse {
  data: AuditLog[];
  total: number;
  skip: number;
  take: number;
}

export interface AuditLogSummary {
  totalLogs: number;
  uniqueUsers: number;
  uniqueActions: number;
  uniqueEntities: number;
  oldestLog?: string;
  newestLog?: string;
}


// Framework Version Types
export interface FrameworkVersion {
  id: string;
  framework_id: string;
  version: string;
  version_notes?: string;
  structure?: {
    domains?: Array<{
      name: string;
      categories?: Array<{
        name: string;
        requirements?: Array<{
          identifier: string;
          title: string;
          text: string;
        }>;
      }>;
    }>;
  };
  effective_date?: string;
  is_current: boolean;
  created_by?: string;
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

// Dashboard Email Schedule API
export interface DashboardEmailSchedule {
  id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  dayOfWeek?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  dayOfMonth?: number;
  sendTime: string;
  recipientEmails: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastSentAt?: string;
  createdBy?: User;
  updatedBy?: User;
}

export interface CreateDashboardEmailScheduleData {
  name: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  dayOfWeek?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  dayOfMonth?: number;
  sendTime: string;
  recipientEmails: string[];
  isActive?: boolean;
}

export interface UpdateDashboardEmailScheduleData {
  name?: string;
  description?: string;
  frequency?: "daily" | "weekly" | "monthly";
  dayOfWeek?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  dayOfMonth?: number;
  sendTime?: string;
  recipientEmails?: string[];
  isActive?: boolean;
}

export const dashboardEmailApi = {
  createSchedule: async (data: CreateDashboardEmailScheduleData): Promise<DashboardEmailSchedule> => {
    const response = await apiClient.post<DashboardEmailSchedule>("/api/v1/governance/dashboard/email-schedules", data);
    return response.data;
  },

  getAllSchedules: async (): Promise<DashboardEmailSchedule[]> => {
    const response = await apiClient.get<DashboardEmailSchedule[]>("/api/v1/governance/dashboard/email-schedules");
    return response.data;
  },

  getScheduleById: async (id: string): Promise<DashboardEmailSchedule> => {
    const response = await apiClient.get<DashboardEmailSchedule>(`/api/v1/governance/dashboard/email-schedules/${id}`);
    return response.data;
  },

  updateSchedule: async (id: string, data: UpdateDashboardEmailScheduleData): Promise<DashboardEmailSchedule> => {
    const response = await apiClient.put<DashboardEmailSchedule>(`/api/v1/governance/dashboard/email-schedules/${id}`, data);
    return response.data;
  },

  deleteSchedule: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/dashboard/email-schedules/${id}`);
  },

  toggleScheduleStatus: async (id: string): Promise<DashboardEmailSchedule> => {
    const response = await apiClient.put<DashboardEmailSchedule>(`/api/v1/governance/dashboard/email-schedules/${id}/toggle`);
    return response.data;
  },

  sendTestEmail: async (id: string): Promise<void> => {
    await apiClient.post(`/api/v1/governance/dashboard/email-schedules/test-send/${id}`);
  },

  // Alert Subscriptions
  createAlertSubscription: async (data: CreateAlertSubscriptionDto): Promise<AlertSubscription> => {
    const response = await apiClient.post<AlertSubscription>('/api/v1/governance/alerting/subscriptions', data);
    return response.data;
  },

  getAlertSubscriptions: async (): Promise<AlertSubscriptionListResponse> => {
    const response = await apiClient.get<AlertSubscriptionListResponse>('/api/v1/governance/alerting/subscriptions');
    return response.data;
  },

  updateAlertSubscription: async (id: string, data: Partial<CreateAlertSubscriptionDto>): Promise<AlertSubscription> => {
    const response = await apiClient.put<AlertSubscription>(`/api/v1/governance/alerting/subscriptions/${id}`, data);
    return response.data;
  },

  deleteAlertSubscription: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/alerting/subscriptions/${id}`);
  },

  // SOP Versions
  getSOPVersions: async (sopId: string): Promise<any[]> => {
    try {
      const response = await apiClient.get(
        `/api/v1/governance/sop-versions/sop/${sopId}/history`
      );
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('Error fetching SOP versions:', error);
      return [];
    }
  },

  approveSOPVersion: async (data: {
    id: string;
    status: 'approved' | 'rejected';
    approval_comments?: string;
  }): Promise<any> => {
    const endpoint = data.status === 'approved'
      ? `/api/v1/governance/sop-versions/${data.id}/approve`
      : `/api/v1/governance/sop-versions/${data.id}/reject`;

    const response = await apiClient.post(endpoint, {
      approval_comments: data.approval_comments
    });
    return response.data;
  },

  rejectSOPVersion: async (data: {
    id: string;
    rejection_reason?: string;
  }): Promise<any> => {
    const response = await apiClient.post(
      `/api/v1/governance/sop-versions/${data.id}/reject`,
      { rejection_reason: data.rejection_reason }
    );
    return response.data;
  },

  // SOP Schedules
  getSOPSchedules: async (params: { sop_id: string }): Promise<any[]> => {
    try {
      const response = await apiClient.get(
        `/api/v1/governance/sop-schedules/sop/${params.sop_id}`
      );
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('Error fetching SOP schedules:', error);
      return [];
    }
  },

  createSOPSchedule: async (data: {
    sop_id: string;
    frequency: string;
    next_review_date?: string;
    cron_expression?: string;
  }): Promise<any> => {
    const response = await apiClient.post(
      '/api/v1/governance/sop-schedules',
      data
    );
    return response.data;
  },

  updateSOPSchedule: async (id: string, data: any): Promise<any> => {
    const response = await apiClient.patch(
      `/api/v1/governance/sop-schedules/${id}`,
      data
    );
    return response.data;
  },

  deleteSOPSchedule: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/sop-schedules/${id}`);
  },


  // SOP Feedback
  getSOPFeedback: async (sopId: string): Promise<any[]> => {
    try {
      const response = await apiClient.get(
        `/api/v1/governance/sop-feedback/sop/${sopId}`
      );
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('Error fetching SOP feedback:', error);
      return [];
    }
  },

  createSOPFeedback: async (data: {
    sop_id: string;
    rating: number;
    comment?: string;
  }): Promise<any> => {
    const response = await apiClient.post(
      '/api/v1/governance/sop-feedback',
      data
    );
    return response.data;
  },

  deleteSOPFeedback: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/sop-feedback/${id}`);
  },

  // SOP Assignments
  getSOPAssignments: async (sopId: string): Promise<any[]> => {
    try {
      const response = await apiClient.get(
        `/api/v1/governance/sop-assignments/sop/${sopId}`
      );
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('Error fetching SOP assignments:', error);
      return [];
    }
  },

  createSOPAssignment: async (data: {
    sop_id: string;
    user_id?: string;
    role_id?: string;
    assigned_by?: string;
  }): Promise<any> => {
    const response = await apiClient.post(
      '/api/v1/governance/sop-assignments',
      data
    );
    return response.data;
  },

  deleteSOPAssignment: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/sop-assignments/${id}`);
  },

  // Helper methods for dropdowns
  getUsers: async (params?: any): Promise<any[]> => {
    try {
      const response = await apiClient.get('/api/v1/governance/users', { params });
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  getRoles: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/api/v1/governance/roles');
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },

  // ==================== ALERTS & ESCALATIONS (Story 8.3) ====================

  // Alerts
  createAlert: async (data: CreateAlertDto): Promise<{ data: Alert }> => {
    const response = await apiClient.post('/api/v1/governance/alerts', data);
    return response.data;
  },

  getAlert: async (id: string): Promise<{ data: Alert }> => {
    const response = await apiClient.get(`/api/v1/governance/alerts/${id}`);
    return response.data;
  },

  getAlerts: async (params?: {
    page?: number;
    limit?: number;
    status?: AlertStatus;
    severity?: AlertSeverity;
    type?: AlertType;
    search?: string;
    sort?: string;
  }): Promise<AlertListResponse> => {
    const response = await apiClient.get('/api/v1/governance/alerts', { params });
    return response.data;
  },

  getRecentCriticalAlerts: async (limit: number = 5): Promise<Alert[]> => {
    const response = await apiClient.get('/api/v1/governance/alerts/recent/critical', {
      params: { limit },
    });
    return Array.isArray(response.data) ? response.data : response.data?.data || [];
  },

  acknowledgeAlert: async (id: string): Promise<{ data: Alert }> => {
    const response = await apiClient.patch(`/api/v1/governance/alerts/${id}/acknowledge`);
    return response.data;
  },

  resolveAlert: async (id: string, resolutionNotes?: string): Promise<{ data: Alert }> => {
    const response = await apiClient.patch(`/api/v1/governance/alerts/${id}/resolve`, {
      resolution_notes: resolutionNotes,
    });
    return response.data;
  },

  dismissAlert: async (id: string): Promise<{ data: Alert }> => {
    const response = await apiClient.patch(`/api/v1/governance/alerts/${id}/dismiss`);
    return response.data;
  },

  markAllAlertsAsAcknowledged: async (): Promise<{ updated: number }> => {
    const response = await apiClient.patch('/api/v1/governance/alerts/mark-all-acknowledged');
    return response.data;
  },

  deleteAlert: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/alerts/${id}`);
  },

  getAlertStatistics: async (): Promise<{
    total: number;
    active: number;
    acknowledged: number;
    resolved: number;
    dismissed: number;
    by_severity: Record<string, number>;
    by_type: Record<string, number>;
  }> => {
    const response = await apiClient.get('/api/v1/governance/alerts/statistics');
    return response.data;
  },

  // Alert Escalation
  escalateAlert: async (chainId: string): Promise<{ data: any }> => {
    const response = await apiClient.put(`/api/v1/governance/alert-escalation/chains/${chainId}/escalate`);
    return response.data;
  },

  resolveEscalationChain: async (chainId: string, notes?: string): Promise<{ data: any }> => {
    const response = await apiClient.put(`/api/v1/governance/alert-escalation/chains/${chainId}/resolve`, {
      resolution_notes: notes,
    });
    return response.data;
  },

  getEscalationChains: async (alertId: string): Promise<{ data: any[] }> => {
    const response = await apiClient.get(`/api/v1/governance/alert-escalation/alerts/${alertId}/chains`);
    return response.data;
  },

  // Alert Rules

  getAlertRule: async (id: string): Promise<{ data: AlertRule }> => {
    const response = await apiClient.get(`/api/v1/governance/alert-rules/${id}`);
    return response.data;
  },

  getAlertRules: async (params?: {
    page?: number;
    limit?: number;
    is_active?: boolean;
    trigger_type?: AlertRuleTriggerType;
    entity_type?: string;
    search?: string;
    sort?: string;
  }): Promise<AlertRuleListResponse> => {
    const response = await apiClient.get('/api/v1/governance/alert-rules', { params });
    return response.data;
  },

  updateAlertRule: async (id: string, data: Partial<CreateAlertRuleDto>): Promise<{ data: AlertRule }> => {
    const response = await apiClient.patch(`/api/v1/governance/alert-rules/${id}`, data);
    return response.data;
  },

  toggleAlertRule: async (id: string, isActive: boolean): Promise<{ data: AlertRule }> => {
    const response = await apiClient.patch(`/api/v1/governance/alert-rules/${id}/toggle`, {
      is_active: isActive,
    });
    return response.data;
  },

  deleteAlertRule: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/alert-rules/${id}`);
  },

  getAlertRuleStatistics: async (): Promise<{
    total: number;
    active: number;
    inactive: number;
    by_trigger_type: Record<string, number>;
    by_entity_type: Record<string, number>;
  }> => {
    const response = await apiClient.get('/api/v1/governance/alert-rules/statistics');
    return response.data;
  },

  testAlertRule: async (ruleId: string): Promise<{ matched_count: number; sample_alerts: any[] }> => {
    const response = await apiClient.post(`/api/v1/governance/alert-rules/${ruleId}/test`);
    return response.data;
  },

  // Asset-Control Integration
  mapControlToAsset: async (
    controlId: string,
    data: {
      asset_id: string;
      asset_type: AssetType;
      implementation_status?: ImplementationStatus;
      implementation_notes?: string;
      is_automated?: boolean;
    },
  ): Promise<any> => {
    const response = await apiClient.post(
      `/api/v1/governance/asset-control/controls/${controlId}/map-asset`,
      data,
    );
    return response.data;
  },

  mapControlToAssets: async (
    controlId: string,
    data: {
      asset_ids: string[];
      asset_type: AssetType;
    },
  ): Promise<any[]> => {
    const response = await apiClient.post(
      `/api/v1/governance/asset-control/controls/${controlId}/map-assets`,
      data,
    );
    return response.data;
  },

  getAssetControls: async (
    assetId: string,
    assetType: AssetType,
    params?: { page?: number; limit?: number },
  ): Promise<{ mappings: any[]; total: number }> => {
    const response = await apiClient.get(
      `/api/v1/governance/asset-control/assets/${assetId}/controls`,
      { params: { assetType, ...params } },
    );
    return response.data;
  },

  getControlAssets: async (
    controlId: string,
    params?: { page?: number; limit?: number },
  ): Promise<{ mappings: any[]; total: number }> => {
    const response = await apiClient.get(
      `/api/v1/governance/asset-control/controls/${controlId}/assets`,
      { params },
    );
    return response.data;
  },

  updateAssetControlMapping: async (
    controlId: string,
    assetId: string,
    data: {
      implementation_status?: ImplementationStatus;
      implementation_notes?: string;
      last_test_date?: Date;
      last_test_result?: string;
      effectiveness_score?: number;
    },
  ): Promise<any> => {
    const response = await apiClient.put(
      `/api/v1/governance/asset-control/controls/${controlId}/assets/${assetId}`,
      data,
    );
    return response.data;
  },

  deleteAssetControlMapping: async (controlId: string, assetId: string): Promise<void> => {
    await apiClient.delete(
      `/api/v1/governance/asset-control/controls/${controlId}/assets/${assetId}`,
    );
  },

  getAssetComplianceScore: async (
    assetId: string,
    assetType: AssetType,
  ): Promise<{
    asset_id: string;
    asset_type: AssetType;
    total_controls: number;
    implemented_controls: number;
    compliance_percentage: number;
    implementation_status_breakdown: Record<string, number>;
  }> => {
    const response = await apiClient.get(
      `/api/v1/governance/asset-control/assets/${assetId}/compliance-score`,
      { params: { assetType } },
    );
    return response.data;
  },

  getControlEffectiveness: async (
    controlId: string,
  ): Promise<{
    control_id: string;
    control_identifier: string;
    total_assets: number;
    average_effectiveness: number;
    implementation_status_breakdown: Record<string, number>;
  }> => {
    const response = await apiClient.get(
      `/api/v1/governance/asset-control/controls/${controlId}/effectiveness`,
    );
    return response.data;
  },

  getAssetControlMatrix: async (params?: {
    assetType?: AssetType;
    domain?: string;
    status?: ImplementationStatus;
  }): Promise<any[]> => {
    const response = await apiClient.get('/api/v1/governance/asset-control/matrix', {
      params,
    });
    return response.data;
  },

  getMatrixStatistics: async (): Promise<{
    total_mappings: number;
    by_implementation_status: Record<string, number>;
    by_asset_type: Record<string, number>;
    average_effectiveness: number;
    unmapped_controls_count: number;
    unmapped_assets_count: number;
  }> => {
    const response = await apiClient.get('/api/v1/governance/asset-control/matrix/statistics');
    return response.data;
  },

  bulkUpdateAssetControlStatus: async (data: {
    mapping_ids: string[];
    implementation_status: ImplementationStatus;
  }): Promise<{ updated: number }> => {
    const response = await apiClient.post(
      '/api/v1/governance/asset-control/mappings/bulk-update-status',
      data,
    );
    return response.data;
  },

  getUnmappedControls: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ controls: any[]; total: number }> => {
    const response = await apiClient.get('/api/v1/governance/asset-control/controls/unmapped', {
      params,
    });
    return response.data;
  },

  getAssetControlStatistics: async (): Promise<{
    total_controls: number;
    total_mappings: number;
    average_compliance_score: number;
    average_effectiveness_score: number;
    implementation_distribution: Record<string, number>;
  }> => {
    const response = await apiClient.get('/api/v1/governance/asset-control/statistics/comprehensive');
    return response.data;
  },

  getComplianceByAssetType: async (): Promise<
    Array<{
      asset_type: AssetType;
      total_mappings: number;
      implemented: number;
      compliance_percentage: number;
    }>
  > => {
    const response = await apiClient.get(
      '/api/v1/governance/asset-control/statistics/by-asset-type',
    );
    return response.data;
  },

  // Framework Configuration API
  createFrameworkConfig: async (data: {
    name: string;
    description?: string;
    framework_type: string;
    scope?: string;
    linked_framework_id?: string;
    is_active?: boolean;
    metadata?: {
      require_policy_approval?: boolean;
      require_control_testing?: boolean;
      policy_review_frequency?: string;
      control_review_frequency?: string;
      risk_assessment_required?: boolean;
      audit_required?: boolean;
      integration_points?: string[];
    };
  }): Promise<any> => {
    const response = await apiClient.post('/api/v1/governance/framework-configs', data);
    return response.data;
  },

  getFrameworkConfigs: async (params?: {
    page?: number;
    limit?: number;
    framework_type?: string;
    is_active?: boolean;
    search?: string;
    sort?: string;
  }): Promise<{ data: any[]; total: number; page: number; limit: number }> => {
    const response = await apiClient.get('/api/v1/governance/framework-configs', { params });
    return response.data;
  },

  getFrameworkConfig: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/governance/framework-configs/${id}`);
    return response.data;
  },

  getFrameworkConfigsByType: async (frameworkType: string): Promise<any[]> => {
    const response = await apiClient.get(
      `/api/v1/governance/framework-configs/by-type/${frameworkType}`,
    );
    return response.data;
  },

  getActiveFrameworkConfigs: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/v1/governance/framework-configs/active/all');
    return response.data;
  },

  updateFrameworkConfig: async (
    id: string,
    data: {
      name?: string;
      description?: string;
      scope?: string;
      is_active?: boolean;
      linked_framework_id?: string;
      metadata?: {
        require_policy_approval?: boolean;
        require_control_testing?: boolean;
        policy_review_frequency?: string;
        control_review_frequency?: string;
        risk_assessment_required?: boolean;
        audit_required?: boolean;
        integration_points?: string[];
      };
    },
  ): Promise<any> => {
    const response = await apiClient.patch(`/api/v1/governance/framework-configs/${id}`, data);
    return response.data;
  },

  activateFrameworkConfig: async (id: string): Promise<any> => {
    const response = await apiClient.post(`/api/v1/governance/framework-configs/${id}/activate`);
    return response.data;
  },

  deactivateFrameworkConfig: async (id: string): Promise<any> => {
    const response = await apiClient.post(
      `/api/v1/governance/framework-configs/${id}/deactivate`,
    );
    return response.data;
  },

  deleteFrameworkConfig: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/framework-configs/${id}`);
  },

  hardDeleteFrameworkConfig: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/governance/framework-configs/${id}/hard`);
  },

  // Get all available frameworks (ComplianceFramework entities)
  getAllFrameworks: async (): Promise<
    Array<{
      id: string;
      framework_code: string;
      name: string;
      version?: string;
      issuing_authority?: string;
      description?: string;
      effective_date?: string;
      url?: string;
      status: string;
      tags?: string[];
    }>
  > => {
    const response = await apiClient.get('/api/v1/governance/frameworks');
    return response.data;
  },

  getFramework: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/governance/frameworks/${id}`);
    return response.data;
  },

};
