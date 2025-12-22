import { IsOptional, IsEnum, IsUUID, IsInt, Min, IsString } from 'class-validator';
import { ExecutionOutcome } from '../entities/sop.entity';

export class SOPLogQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @IsUUID()
  @IsOptional()
  sop_id?: string;

  @IsUUID()
  @IsOptional()
  executor_id?: string;

  @IsEnum(ExecutionOutcome)
  @IsOptional()
  outcome?: ExecutionOutcome;

  @IsString()
  @IsOptional()
  search?: string;
}


