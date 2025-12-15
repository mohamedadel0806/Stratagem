import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
  IsUUID,
  IsObject,
  IsBoolean,
  IsInt,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { PolicyStatus, ReviewFrequency } from '../entities/policy.entity';

export class CreatePolicyDto {
  @IsString()
  @MaxLength(200)
  policy_type: string;

  @IsString()
  @MaxLength(500)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @IsUUID()
  owner_id?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  business_units?: string[];

  @IsOptional()
  @IsEnum(PolicyStatus)
  status?: PolicyStatus;

  @IsOptional()
  @IsDateString()
  approval_date?: string;

  @IsOptional()
  @IsDateString()
  effective_date?: string;

  @IsOptional()
  @IsEnum(ReviewFrequency)
  review_frequency?: ReviewFrequency;

  @IsOptional()
  @IsDateString()
  next_review_date?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  linked_influencers?: string[];

  @IsOptional()
  @IsUUID()
  supersedes_policy_id?: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  attachments?: Array<{ filename: string; path: string; upload_date: string; uploaded_by: string }>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  custom_fields?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  requires_acknowledgment?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  acknowledgment_due_days?: number;
}




