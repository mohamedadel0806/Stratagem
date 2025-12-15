import { IsOptional, IsEnum, IsString, IsInt, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { FindingSeverity, FindingStatus } from '../entities/finding.entity';

export class FindingQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 25;

  @IsOptional()
  @IsEnum(FindingSeverity)
  severity?: FindingSeverity;

  @IsOptional()
  @IsEnum(FindingStatus)
  status?: FindingStatus;

  @IsOptional()
  @IsUUID()
  assessment_id?: string;

  @IsOptional()
  @IsUUID()
  unified_control_id?: string;

  @IsOptional()
  @IsUUID()
  remediation_owner_id?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string; // e.g., "finding_date:desc", "severity:asc"
}




