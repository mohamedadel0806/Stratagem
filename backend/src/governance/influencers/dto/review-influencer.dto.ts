import { IsOptional, IsString, IsDateString, IsInt, IsObject } from 'class-validator';

export class ReviewInfluencerDto {
  @IsOptional()
  @IsString()
  revision_notes?: string;

  @IsOptional()
  @IsDateString()
  next_review_date?: string;

  @IsOptional()
  @IsInt()
  review_frequency_days?: number;

  @IsOptional()
  @IsObject()
  impact_assessment?: {
    affected_policies?: string[];
    affected_controls?: string[];
    business_units_impact?: string[];
    risk_level?: 'low' | 'medium' | 'high' | 'critical';
    notes?: string;
  };
}


