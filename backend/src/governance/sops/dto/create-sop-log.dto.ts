import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsArray } from 'class-validator';
import { ExecutionOutcome } from '../entities/sop.entity';

export class CreateSOPLogDto {
  @IsUUID()
  sop_id: string;

  @IsDateString()
  execution_date: string;

  @IsDateString()
  @IsOptional()
  start_time?: string;

  @IsDateString()
  @IsOptional()
  end_time?: string;

  @IsEnum(ExecutionOutcome)
  @IsOptional()
  outcome?: ExecutionOutcome;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  step_results?: Array<{ step: string; result: string; observations?: string }>;

  @IsUUID()
  @IsOptional()
  executor_id?: string;
}


