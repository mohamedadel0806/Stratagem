import { IsOptional, IsString, IsEnum, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SOPStatus, SOPCategory } from '../entities/sop.entity';

export class SOPQueryDto {
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

  @ApiPropertyOptional({ enum: SOPStatus, description: 'Filter by status' })
  @IsEnum(SOPStatus)
  @IsOptional()
  status?: SOPStatus;

  @ApiPropertyOptional({ enum: SOPCategory, description: 'Filter by category' })
  @IsEnum(SOPCategory)
  @IsOptional()
  category?: SOPCategory;

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


