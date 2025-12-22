import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { InfluencerCategory, InfluencerStatus, ApplicabilityStatus } from '../entities/influencer.entity';

export class InfluencerQueryDto {
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
  @IsEnum(InfluencerCategory)
  category?: InfluencerCategory;

  @IsOptional()
  @IsEnum(InfluencerStatus)
  status?: InfluencerStatus;

  @IsOptional()
  @IsEnum(ApplicabilityStatus)
  applicability_status?: ApplicabilityStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string; // e.g., "name:asc", "created_at:desc"

  @IsOptional()
  @IsString({ each: true })
  tags?: string[]; // Filter by tags (array of tag names)
}







