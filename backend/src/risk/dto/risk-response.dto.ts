import { ApiProperty } from '@nestjs/swagger';
import {
  RiskStatus,
  RiskCategoryLegacy,
  RiskLikelihood,
  RiskImpact,
  ThreatSource,
  RiskVelocity,
  RiskLevel,
} from '../entities/risk.entity';

export class RiskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'Auto-generated risk identifier (RISK-XXXX)' })
  risk_id?: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, description: 'Risk statement in If/Then/Resulting format' })
  risk_statement?: string;

  @ApiProperty({ enum: RiskCategoryLegacy })
  category: RiskCategoryLegacy;

  @ApiProperty({ required: false })
  category_id?: string;

  @ApiProperty({ required: false })
  category_name?: string;

  @ApiProperty({ required: false })
  sub_category_id?: string;

  @ApiProperty({ required: false })
  sub_category_name?: string;

  @ApiProperty({ enum: RiskStatus })
  status: RiskStatus;

  @ApiProperty({ enum: RiskLikelihood })
  likelihood: RiskLikelihood;

  @ApiProperty({ enum: RiskImpact })
  impact: RiskImpact;

  // Owner information
  @ApiProperty({ required: false })
  ownerId?: string;

  @ApiProperty({ required: false })
  owner_name?: string;

  @ApiProperty({ required: false })
  risk_analyst_id?: string;

  @ApiProperty({ required: false })
  risk_analyst_name?: string;

  // Dates
  @ApiProperty({ required: false })
  date_identified?: string;

  @ApiProperty({ required: false })
  next_review_date?: string;

  @ApiProperty({ required: false })
  last_review_date?: string;

  // Risk characteristics
  @ApiProperty({ enum: ThreatSource, required: false })
  threat_source?: ThreatSource;

  @ApiProperty({ enum: RiskVelocity, required: false })
  risk_velocity?: RiskVelocity;

  @ApiProperty({ required: false })
  early_warning_signs?: string;

  @ApiProperty({ required: false })
  status_notes?: string;

  @ApiProperty({ required: false })
  business_process?: string;

  @ApiProperty({ required: false, type: [String] })
  tags?: string[];

  @ApiProperty({ required: false, type: [String] })
  business_unit_ids?: string[];

  // Version tracking
  @ApiProperty({ required: false })
  version_number?: number;

  // Inherent risk assessment
  @ApiProperty({ required: false })
  inherent_likelihood?: number;

  @ApiProperty({ required: false })
  inherent_impact?: number;

  @ApiProperty({ required: false })
  inherent_risk_score?: number;

  @ApiProperty({ enum: RiskLevel, required: false })
  inherent_risk_level?: RiskLevel;

  // Current risk assessment
  @ApiProperty({ required: false })
  current_likelihood?: number;

  @ApiProperty({ required: false })
  current_impact?: number;

  @ApiProperty({ required: false })
  current_risk_score?: number;

  @ApiProperty({ enum: RiskLevel, required: false })
  current_risk_level?: RiskLevel;

  // Target risk assessment
  @ApiProperty({ required: false })
  target_likelihood?: number;

  @ApiProperty({ required: false })
  target_impact?: number;

  @ApiProperty({ required: false })
  target_risk_score?: number;

  @ApiProperty({ enum: RiskLevel, required: false })
  target_risk_level?: RiskLevel;

  // Control effectiveness
  @ApiProperty({ required: false, description: 'Overall control effectiveness percentage (0-100)' })
  control_effectiveness?: number;

  // Integration counts
  @ApiProperty({ required: false })
  linked_assets_count?: number;

  @ApiProperty({ required: false })
  linked_controls_count?: number;

  @ApiProperty({ required: false })
  active_treatments_count?: number;

  @ApiProperty({ required: false })
  kri_count?: number;

  // Risk appetite warnings (from settings)
  @ApiProperty({ required: false, description: 'Whether this risk exceeds the organization risk appetite' })
  exceeds_risk_appetite?: boolean;

  @ApiProperty({ required: false, description: 'Whether this risk requires escalation based on risk level settings' })
  requires_escalation?: boolean;

  @ApiProperty({ required: false, description: 'Recommended response time from settings' })
  recommended_response_time?: string;

  @ApiProperty({ required: false, description: 'Risk level color from settings' })
  risk_level_color?: string;

  // Audit fields
  @ApiProperty()
  createdAt: string;

  @ApiProperty({ required: false })
  updatedAt?: string;

  @ApiProperty({ required: false })
  tenant_id?: string;
}

export class RiskListResponseDto {
  @ApiProperty({ type: [RiskResponseDto] })
  data: RiskResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class RiskHeatmapCellDto {
  @ApiProperty()
  likelihood: number;

  @ApiProperty()
  impact: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  riskScore: number;

  @ApiProperty({ type: [String] })
  riskIds: string[];

  @ApiProperty({ enum: RiskLevel })
  riskLevel: RiskLevel;
}

export class RiskHeatmapResponseDto {
  @ApiProperty({ type: [RiskHeatmapCellDto] })
  cells: RiskHeatmapCellDto[];

  @ApiProperty()
  totalRisks: number;

  @ApiProperty()
  maxRiskScore: number;
}

export class RiskDashboardSummaryDto {
  @ApiProperty()
  total_risks: number;

  @ApiProperty()
  critical_risks: number;

  @ApiProperty()
  high_risks: number;

  @ApiProperty()
  medium_risks: number;

  @ApiProperty()
  low_risks: number;

  @ApiProperty({ description: 'Number of risks exceeding organization risk appetite threshold' })
  risks_exceeding_appetite: number;

  @ApiProperty({ description: 'Maximum acceptable risk score from settings', required: false })
  max_acceptable_score?: number;

  @ApiProperty({ description: 'Whether risk appetite checking is enabled', required: false })
  risk_appetite_enabled?: boolean;

  @ApiProperty()
  overdue_reviews: number;

  @ApiProperty()
  active_treatments: number;

  @ApiProperty()
  kri_red_count: number;

  @ApiProperty()
  kri_amber_count: number;
}
