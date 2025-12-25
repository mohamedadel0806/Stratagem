import { IsOptional, IsEnum, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { FrameworkType } from '../../entities/governance-framework-config.entity';
import { Type } from 'class-transformer';

export class GovernanceFrameworkConfigQueryDto {
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
  @IsEnum(FrameworkType)
  framework_type?: FrameworkType;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active?: boolean;

  @IsOptional()
  search?: string;

  @IsOptional()
  sort?: string;
}
