import { IsString, IsEnum, IsOptional, IsInt, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { RiskStatus, RiskCategory_OLD as RiskCategory, RiskLevel } from '../entities/risk.entity';

export class RiskQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(RiskStatus)
  status?: RiskStatus;

  @IsOptional()
  @IsEnum(RiskCategory)
  category?: RiskCategory;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsEnum(RiskLevel)
  current_risk_level?: RiskLevel;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  likelihood?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  impact?: number;

  @IsOptional()
  @IsUUID()
  ownerId?: string;

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
  limit?: number = 20;
}
