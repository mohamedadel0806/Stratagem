import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsInt, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { RequirementStatus } from '../entities/compliance-requirement.entity';

export class RequirementQueryDto {
  @ApiPropertyOptional({ description: 'Search term for title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: RequirementStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(RequirementStatus)
  status?: RequirementStatus;

  @ApiPropertyOptional({ description: 'Filter by framework ID' })
  @IsOptional()
  @IsUUID('4', { message: 'frameworkId must be a valid UUID' })
  frameworkId?: string;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Page number (1-based)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

