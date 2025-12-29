import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber, IsUUID, IsArray, IsDateString, Min, Max, MaxLength } from 'class-validator';
import {
  RiskCategoryLegacy,
  RiskStatus,
  RiskLikelihood,
  RiskImpact,
  ThreatSource,
  RiskVelocity,
} from '../entities/risk.entity';

export class CreateRiskDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: 'Risk statement in If/Then/Resulting format' })
  @IsOptional()
  @IsString()
  risk_statement?: string;

  @ApiProperty({ enum: RiskCategoryLegacy })
  @IsEnum(RiskCategoryLegacy)
  category: RiskCategoryLegacy;

  @ApiProperty({ required: false, description: 'Reference to risk_categories table' })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiProperty({ required: false, description: 'Reference to sub-category in risk_categories table' })
  @IsOptional()
  @IsUUID()
  sub_category_id?: string;

  @ApiProperty({ enum: RiskStatus, required: false, default: RiskStatus.IDENTIFIED })
  @IsOptional()
  @IsEnum(RiskStatus)
  status?: RiskStatus;

  @ApiProperty({ enum: RiskLikelihood, required: false, default: RiskLikelihood.MEDIUM })
  @IsOptional()
  @IsEnum(RiskLikelihood)
  likelihood?: RiskLikelihood;

  @ApiProperty({ enum: RiskImpact, required: false, default: RiskImpact.MEDIUM })
  @IsOptional()
  @IsEnum(RiskImpact)
  impact?: RiskImpact;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  risk_analyst_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date_identified?: string;

  @ApiProperty({ enum: ThreatSource, required: false })
  @IsOptional()
  @IsEnum(ThreatSource)
  threat_source?: ThreatSource;

  @ApiProperty({ enum: RiskVelocity, required: false })
  @IsOptional()
  @IsEnum(RiskVelocity)
  risk_velocity?: RiskVelocity;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  early_warning_signs?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status_notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  business_process?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  business_unit_ids?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  next_review_date?: string;

  // Inherent risk values
  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  inherent_likelihood?: number;

  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  inherent_impact?: number;

  // Current risk values
  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  current_likelihood?: number;

  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  current_impact?: number;

  // Target risk values
  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  target_likelihood?: number;

  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  target_impact?: number;
}
