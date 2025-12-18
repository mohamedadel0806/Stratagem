import { IsOptional, IsString, IsEnum, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StandardStatus } from '../entities/standard.entity';

export class StandardQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 25, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 25;

  @ApiPropertyOptional({ enum: StandardStatus, description: 'Filter by status' })
  @IsEnum(StandardStatus)
  @IsOptional()
  status?: StandardStatus;

  @ApiPropertyOptional({ description: 'Filter by policy ID' })
  @IsUUID()
  @IsOptional()
  policy_id?: string;

  @ApiPropertyOptional({ description: 'Filter by control objective ID' })
  @IsUUID()
  @IsOptional()
  control_objective_id?: string;

  @ApiPropertyOptional({ description: 'Filter by owner ID' })
  @IsUUID()
  @IsOptional()
  owner_id?: string;

  @ApiPropertyOptional({ description: 'Search in title, description, and content' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Sort field and order (e.g., "created_at:DESC" or "title:ASC")' })
  @IsString()
  @IsOptional()
  sort?: string;
}
