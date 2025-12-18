import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
  IsUUID,
  IsObject,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InfluencerCategory, InfluencerStatus, ApplicabilityStatus } from '../entities/influencer.entity';

export class CreateInfluencerDto {
  @IsString()
  @MaxLength(500)
  name: string;

  @IsEnum(InfluencerCategory)
  category: InfluencerCategory;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  sub_category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  issuing_authority?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  jurisdiction?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  reference_number?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  publication_date?: string;

  @IsOptional()
  @IsDateString()
  effective_date?: string;

  @IsOptional()
  @IsDateString()
  last_revision_date?: string;

  @IsOptional()
  @IsDateString()
  next_review_date?: string;

  @IsOptional()
  @IsEnum(InfluencerStatus)
  status?: InfluencerStatus;

  @IsOptional()
  @IsEnum(ApplicabilityStatus)
  applicability_status?: ApplicabilityStatus;

  @IsOptional()
  @IsString()
  applicability_justification?: string;

  @IsOptional()
  @IsDateString()
  applicability_assessment_date?: string;

  @IsOptional()
  @IsObject()
  applicability_criteria?: Record<string, any>;

  @IsOptional()
  @IsString()
  source_url?: string;

  @IsOptional()
  @IsUUID()
  owner_id?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  business_units_affected?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  custom_fields?: Record<string, any>;
}





