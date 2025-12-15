import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, IsOptional, IsNumber, Min, Max } from 'class-validator';

/**
 * Request DTO for comparing multiple risks
 */
export class RiskComparisonRequestDto {
  @ApiProperty({ description: 'Array of risk IDs to compare', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  risk_ids: string[];
}

/**
 * Single risk comparison data
 */
export class RiskComparisonDataDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  risk_id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  category_name?: string;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  owner_name?: string;

  // Inherent Risk
  @ApiProperty({ required: false })
  inherent_likelihood?: number;

  @ApiProperty({ required: false })
  inherent_impact?: number;

  @ApiProperty({ required: false })
  inherent_risk_score?: number;

  @ApiProperty({ required: false })
  inherent_risk_level?: string;

  // Current Risk
  @ApiProperty({ required: false })
  current_likelihood?: number;

  @ApiProperty({ required: false })
  current_impact?: number;

  @ApiProperty({ required: false })
  current_risk_score?: number;

  @ApiProperty({ required: false })
  current_risk_level?: string;

  // Target Risk
  @ApiProperty({ required: false })
  target_likelihood?: number;

  @ApiProperty({ required: false })
  target_impact?: number;

  @ApiProperty({ required: false })
  target_risk_score?: number;

  @ApiProperty({ required: false })
  target_risk_level?: string;

  // Control Effectiveness
  @ApiProperty({ required: false })
  control_effectiveness?: number;

  // Integration counts
  @ApiProperty({ required: false })
  linked_controls_count?: number;

  @ApiProperty({ required: false })
  linked_assets_count?: number;

  @ApiProperty({ required: false })
  active_treatments_count?: number;

  @ApiProperty({ required: false })
  kri_count?: number;

  // Calculated metrics
  @ApiProperty({ description: 'Risk reduction from inherent to current (%)' })
  risk_reduction_percentage?: number;

  @ApiProperty({ description: 'Gap between current and target score' })
  gap_to_target?: number;
}

/**
 * Risk comparison response
 */
export class RiskComparisonResponseDto {
  @ApiProperty({ type: [RiskComparisonDataDto] })
  risks: RiskComparisonDataDto[];

  @ApiProperty({ description: 'Summary statistics for the compared risks' })
  summary: {
    total_risks: number;
    average_current_score: number;
    highest_risk: { id: string; title: string; score: number };
    lowest_risk: { id: string; title: string; score: number };
    average_control_effectiveness: number;
    total_linked_controls: number;
    total_active_treatments: number;
  };

  @ApiProperty({ description: 'Comparison matrix showing differences between risks' })
  comparison_matrix: {
    metric: string;
    values: { risk_id: string; value: number | string }[];
    variance?: number;
  }[];
}

/**
 * What-If Scenario Request
 */
export class WhatIfScenarioRequestDto {
  @ApiProperty({ description: 'Risk ID to simulate' })
  @IsUUID('4')
  risk_id: string;

  @ApiProperty({ description: 'Simulated likelihood value', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  simulated_likelihood?: number;

  @ApiProperty({ description: 'Simulated impact value', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  simulated_impact?: number;

  @ApiProperty({ description: 'Simulated control effectiveness (%)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  simulated_control_effectiveness?: number;

  @ApiProperty({ description: 'Number of additional controls to simulate', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  additional_controls?: number;
}

/**
 * What-If Scenario Response
 */
export class WhatIfScenarioResponseDto {
  @ApiProperty({ description: 'Original risk data' })
  original: {
    likelihood: number;
    impact: number;
    risk_score: number;
    risk_level: string;
    control_effectiveness: number;
  };

  @ApiProperty({ description: 'Simulated risk data' })
  simulated: {
    likelihood: number;
    impact: number;
    risk_score: number;
    risk_level: string;
    control_effectiveness: number;
  };

  @ApiProperty({ description: 'Impact analysis' })
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

  @ApiProperty({ description: 'Risk level details from settings' })
  risk_level_details?: {
    color: string;
    description: string;
    response_time: string;
    requires_escalation: boolean;
  };
}

/**
 * Batch What-If Request (for comparing multiple scenarios)
 */
export class BatchWhatIfRequestDto {
  @ApiProperty({ description: 'Risk ID to simulate' })
  @IsUUID('4')
  risk_id: string;

  @ApiProperty({ description: 'Array of scenarios to simulate', type: [WhatIfScenarioRequestDto] })
  @IsArray()
  scenarios: Omit<WhatIfScenarioRequestDto, 'risk_id'>[];
}

/**
 * Custom Report Configuration
 */
export class CustomReportConfigDto {
  @ApiProperty({ description: 'Report name' })
  name: string;

  @ApiProperty({ description: 'Fields to include in report', type: [String] })
  @IsArray()
  fields: string[];

  @ApiProperty({ description: 'Filter by risk levels', type: [String], required: false })
  @IsOptional()
  @IsArray()
  risk_levels?: string[];

  @ApiProperty({ description: 'Filter by categories', type: [String], required: false })
  @IsOptional()
  @IsArray()
  categories?: string[];

  @ApiProperty({ description: 'Filter by status', type: [String], required: false })
  @IsOptional()
  @IsArray()
  statuses?: string[];

  @ApiProperty({ description: 'Filter by owner IDs', type: [String], required: false })
  @IsOptional()
  @IsArray()
  owner_ids?: string[];

  @ApiProperty({ description: 'Include only risks exceeding appetite', required: false })
  @IsOptional()
  exceeds_appetite_only?: boolean;

  @ApiProperty({ description: 'Sort field', required: false })
  @IsOptional()
  sort_by?: string;

  @ApiProperty({ description: 'Sort direction', required: false })
  @IsOptional()
  sort_direction?: 'ASC' | 'DESC';

  @ApiProperty({ description: 'Group by field', required: false })
  @IsOptional()
  group_by?: string;

  @ApiProperty({ description: 'Include summary statistics', required: false })
  @IsOptional()
  include_summary?: boolean;
}




