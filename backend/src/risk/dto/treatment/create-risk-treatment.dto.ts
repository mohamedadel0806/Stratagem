import { IsString, IsOptional, IsUUID, IsEnum, IsInt, IsNumber, Min, Max, IsArray, IsDateString, MaxLength } from 'class-validator';
import { TreatmentStrategy, TreatmentStatus, TreatmentPriority } from '../../entities/risk-treatment.entity';

export class CreateRiskTreatmentDto {
  @IsUUID()
  risk_id: string;

  @IsEnum(TreatmentStrategy)
  strategy: TreatmentStrategy;

  @IsString()
  @MaxLength(300)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  treatment_owner_id?: string;

  @IsEnum(TreatmentStatus)
  @IsOptional()
  status?: TreatmentStatus;

  @IsEnum(TreatmentPriority)
  @IsOptional()
  priority?: TreatmentPriority;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  target_completion_date?: string;

  @IsNumber()
  @IsOptional()
  estimated_cost?: number;

  @IsString()
  @IsOptional()
  expected_risk_reduction?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  residual_likelihood?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  residual_impact?: number;

  @IsString()
  @IsOptional()
  implementation_notes?: string;

  @IsArray()
  @IsOptional()
  linked_control_ids?: string[];
}





