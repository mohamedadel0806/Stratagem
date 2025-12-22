import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsDateString,
  IsBoolean,
  IsArray,
  IsObject,
  MaxLength,
  MinLength,
} from 'class-validator';
import { FindingSeverity, FindingStatus } from '../entities/finding.entity';

export class CreateFindingDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  finding_identifier: string;

  @IsOptional()
  @IsUUID()
  assessment_id?: string;

  @IsOptional()
  @IsUUID()
  assessment_result_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  source_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  source_name?: string;

  @IsOptional()
  @IsUUID()
  unified_control_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  asset_type?: string;

  @IsOptional()
  @IsUUID()
  asset_id?: string;

  @IsString()
  @MaxLength(500)
  title: string;

  @IsString()
  description: string;

  @IsEnum(FindingSeverity)
  severity: FindingSeverity;

  @IsOptional()
  @IsDateString()
  finding_date?: string;

  @IsOptional()
  @IsEnum(FindingStatus)
  status?: FindingStatus;

  @IsOptional()
  @IsUUID()
  remediation_owner_id?: string;

  @IsOptional()
  @IsString()
  remediation_plan?: string;

  @IsOptional()
  @IsDateString()
  remediation_due_date?: string;

  @IsOptional()
  @IsDateString()
  remediation_completed_date?: string;

  @IsOptional()
  @IsObject()
  remediation_evidence?: any;

  @IsOptional()
  @IsUUID()
  risk_accepted_by?: string;

  @IsOptional()
  @IsString()
  risk_acceptance_justification?: string;

  @IsOptional()
  @IsDateString()
  risk_acceptance_date?: string;

  @IsOptional()
  @IsDateString()
  risk_acceptance_expiry?: string;

  @IsOptional()
  @IsBoolean()
  retest_required?: boolean;

  @IsOptional()
  @IsDateString()
  retest_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  retest_result?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}







