import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// Risk Level Configuration DTO
export class RiskLevelConfigDto {
  @IsString()
  level: string;

  @IsNumber()
  @Min(1)
  @Max(25)
  minScore: number;

  @IsNumber()
  @Min(1)
  @Max(25)
  maxScore: number;

  @IsString()
  color: string;

  @IsString()
  description: string;

  @IsString()
  responseTime: string;

  @IsBoolean()
  escalation: boolean;
}

// Assessment Method Configuration DTO
export class AssessmentMethodConfigDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(3)
  @Max(10)
  likelihoodScale: number;

  @IsNumber()
  @Min(3)
  @Max(10)
  impactScale: number;

  @IsBoolean()
  isDefault: boolean;

  @IsBoolean()
  isActive: boolean;
}

// Scale Description DTO
export class ScaleDescriptionDto {
  @IsNumber()
  @Min(1)
  @Max(10)
  value: number;

  @IsString()
  label: string;

  @IsString()
  description: string;
}

// Update Risk Settings DTO
export class UpdateRiskSettingsDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RiskLevelConfigDto)
  risk_levels?: RiskLevelConfigDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssessmentMethodConfigDto)
  assessment_methods?: AssessmentMethodConfigDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScaleDescriptionDto)
  likelihood_scale?: ScaleDescriptionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScaleDescriptionDto)
  impact_scale?: ScaleDescriptionDto[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(25)
  max_acceptable_risk_score?: number;

  @IsOptional()
  @IsString()
  risk_acceptance_authority?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  default_review_period_days?: number;

  @IsOptional()
  @IsBoolean()
  auto_calculate_risk_score?: boolean;

  @IsOptional()
  @IsBoolean()
  require_assessment_evidence?: boolean;

  @IsOptional()
  @IsBoolean()
  enable_risk_appetite?: boolean;

  @IsOptional()
  @IsString()
  default_assessment_method?: string;

  @IsOptional()
  @IsBoolean()
  notify_on_high_risk?: boolean;

  @IsOptional()
  @IsBoolean()
  notify_on_critical_risk?: boolean;

  @IsOptional()
  @IsBoolean()
  notify_on_review_due?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  review_reminder_days?: number;
}

// Risk Settings Response DTO
export class RiskSettingsResponseDto {
  id: string;
  organization_id?: string;
  
  // Risk Level Configuration
  risk_levels: RiskLevelConfigDto[];
  
  // Assessment Methods
  assessment_methods: AssessmentMethodConfigDto[];
  
  // Scales
  likelihood_scale: ScaleDescriptionDto[];
  impact_scale: ScaleDescriptionDto[];
  
  // Risk Appetite
  max_acceptable_risk_score: number;
  risk_acceptance_authority: string;
  
  // General Settings
  default_review_period_days: number;
  auto_calculate_risk_score: boolean;
  require_assessment_evidence: boolean;
  enable_risk_appetite: boolean;
  default_assessment_method: string;
  
  // Notification Settings
  notify_on_high_risk: boolean;
  notify_on_critical_risk: boolean;
  notify_on_review_due: boolean;
  review_reminder_days: number;
  
  // Metadata
  version: number;
  created_at: string;
  updated_at: string;
  updated_by_name?: string;
}





