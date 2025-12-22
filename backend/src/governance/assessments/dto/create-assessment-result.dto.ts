import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsUUID,
  IsInt,
  IsBoolean,
  IsObject,
  Min,
  Max,
} from 'class-validator';
import { AssessmentResultEnum } from '../entities/assessment-result.entity';

export class CreateAssessmentResultDto {
  @IsUUID()
  assessment_id: string;

  @IsUUID()
  unified_control_id: string;

  @IsOptional()
  @IsUUID()
  assessor_id?: string;

  @IsOptional()
  @IsDateString()
  assessment_date?: string;

  @IsOptional()
  @IsString()
  assessment_procedure_followed?: string;

  @IsEnum(AssessmentResultEnum)
  result: AssessmentResultEnum;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  effectiveness_rating?: number;

  @IsOptional()
  @IsString()
  findings?: string;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsOptional()
  @IsString()
  recommendations?: string;

  @IsOptional()
  @IsObject()
  evidence_collected?: Array<{ filename: string; path: string; description: string }>;

  @IsOptional()
  @IsBoolean()
  requires_remediation?: boolean;

  @IsOptional()
  @IsDateString()
  remediation_due_date?: string;
}







