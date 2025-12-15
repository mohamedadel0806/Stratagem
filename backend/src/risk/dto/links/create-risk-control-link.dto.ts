import { IsString, IsOptional, IsUUID, IsInt, Min, Max } from 'class-validator';

export class CreateRiskControlLinkDto {
  @IsUUID()
  risk_id: string;

  @IsUUID()
  control_id: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  effectiveness_rating?: number;

  @IsString()
  @IsOptional()
  effectiveness_type?: string;

  @IsString()
  @IsOptional()
  control_type_for_risk?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateRiskControlLinkDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  effectiveness_rating?: number;

  @IsString()
  @IsOptional()
  effectiveness_type?: string;

  @IsString()
  @IsOptional()
  control_type_for_risk?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  last_effectiveness_review?: string;
}




