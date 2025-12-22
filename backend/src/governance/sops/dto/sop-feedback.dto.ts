import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { FeedbackSentiment } from '../entities/sop-feedback.entity';

export class CreateSOPFeedbackDto {
  @IsUUID()
  sop_id: string;

  @IsOptional()
  @IsEnum(FeedbackSentiment)
  sentiment?: FeedbackSentiment;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  effectiveness_rating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  clarity_rating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  completeness_rating?: number;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsString()
  improvement_suggestions?: string;

  @IsOptional()
  tagged_issues?: string[];

  @IsOptional()
  @IsBoolean()
  follow_up_required?: boolean;
}

export class UpdateSOPFeedbackDto {
  @IsOptional()
  @IsEnum(FeedbackSentiment)
  sentiment?: FeedbackSentiment;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  effectiveness_rating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  clarity_rating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  completeness_rating?: number;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsString()
  improvement_suggestions?: string;

  @IsOptional()
  tagged_issues?: string[];

  @IsOptional()
  @IsBoolean()
  follow_up_required?: boolean;
}

export class SOPFeedbackQueryDto {
  @IsOptional()
  @IsUUID()
  sop_id?: string;

  @IsOptional()
  @IsEnum(FeedbackSentiment)
  sentiment?: FeedbackSentiment;

  @IsOptional()
  @IsBoolean()
  follow_up_required?: boolean;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  sort?: string;
}
