import { IsString, IsOptional, IsUUID, IsEnum, IsBoolean, IsInt, MaxLength, Min } from 'class-validator';
import { RiskTolerance } from '../../entities/risk-category.entity';

export class CreateRiskCategoryDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(50)
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  parent_category_id?: string;

  @IsEnum(RiskTolerance)
  @IsOptional()
  risk_tolerance?: RiskTolerance;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  display_order?: number;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  color?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  icon?: string;
}




