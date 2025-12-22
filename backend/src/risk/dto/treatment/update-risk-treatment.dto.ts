import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateRiskTreatmentDto } from './create-risk-treatment.dto';
import { IsNumber, IsOptional, IsString, IsInt, Min, Max, IsDateString, IsArray } from 'class-validator';

export class UpdateRiskTreatmentDto extends PartialType(
  OmitType(CreateRiskTreatmentDto, ['risk_id'] as const),
) {
  @IsNumber()
  @IsOptional()
  actual_cost?: number;

  @IsDateString()
  @IsOptional()
  actual_completion_date?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress_percentage?: number;

  @IsString()
  @IsOptional()
  progress_notes?: string;

  @IsArray()
  @IsOptional()
  attachments?: Record<string, any>[];
}







