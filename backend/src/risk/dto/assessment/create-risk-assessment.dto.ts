import { IsString, IsOptional, IsUUID, IsEnum, IsInt, IsNumber, Min, Max, IsBoolean, IsArray } from 'class-validator';
import { AssessmentType, ImpactLevel, ConfidenceLevel } from '../../entities/risk-assessment.entity';

export class CreateRiskAssessmentDto {
  @IsUUID()
  risk_id: string;

  @IsEnum(AssessmentType)
  assessment_type: AssessmentType;

  @IsInt()
  @Min(1)
  @Max(5)
  likelihood: number;

  @IsInt()
  @Min(1)
  @Max(5)
  impact: number;

  @IsEnum(ImpactLevel)
  @IsOptional()
  financial_impact?: ImpactLevel;

  @IsNumber()
  @IsOptional()
  financial_impact_amount?: number;

  @IsEnum(ImpactLevel)
  @IsOptional()
  operational_impact?: ImpactLevel;

  @IsEnum(ImpactLevel)
  @IsOptional()
  reputational_impact?: ImpactLevel;

  @IsEnum(ImpactLevel)
  @IsOptional()
  compliance_impact?: ImpactLevel;

  @IsEnum(ImpactLevel)
  @IsOptional()
  safety_impact?: ImpactLevel;

  @IsString()
  @IsOptional()
  assessment_date?: string;

  @IsString()
  @IsOptional()
  assessment_method?: string;

  @IsString()
  @IsOptional()
  assessment_notes?: string;

  @IsString()
  @IsOptional()
  assumptions?: string;

  @IsEnum(ConfidenceLevel)
  @IsOptional()
  confidence_level?: ConfidenceLevel;

  @IsArray()
  @IsOptional()
  evidence_attachments?: Record<string, any>[];

  @IsBoolean()
  @IsOptional()
  is_latest?: boolean;
}





