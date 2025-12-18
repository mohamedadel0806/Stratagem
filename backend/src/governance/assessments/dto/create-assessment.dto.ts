import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
  IsUUID,
  IsInt,
  IsNumber,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { AssessmentType, AssessmentStatus } from '../entities/assessment.entity';

export class CreateAssessmentDto {
  @IsString()
  @MaxLength(100)
  assessment_identifier: string;

  @IsString()
  @MaxLength(500)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(AssessmentType)
  assessment_type: AssessmentType;

  @IsOptional()
  @IsString()
  scope_description?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  selected_control_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  selected_framework_ids?: string[];

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsEnum(AssessmentStatus)
  status?: AssessmentStatus;

  @IsOptional()
  @IsUUID()
  lead_assessor_id?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assessor_ids?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  controls_total?: number;

  @IsOptional()
  @IsString()
  assessment_procedures?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}





