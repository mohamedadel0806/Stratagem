import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  IsArray,
  Min,
} from 'class-validator';

export class CreateSOPStepDto {
  @IsUUID()
  sop_id: string;

  @IsNumber()
  step_number: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  expected_outcome?: string;

  @IsOptional()
  @IsString()
  responsible_role?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  estimated_duration_minutes?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  required_evidence?: string[];

  @IsOptional()
  @IsBoolean()
  is_critical?: boolean;
}

export class UpdateSOPStepDto {
  @IsOptional()
  @IsNumber()
  step_number?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  expected_outcome?: string;

  @IsOptional()
  @IsString()
  responsible_role?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  estimated_duration_minutes?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  required_evidence?: string[];

  @IsOptional()
  @IsBoolean()
  is_critical?: boolean;
}

export class SOPStepQueryDto {
  @IsOptional()
  @IsUUID()
  sop_id?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  sort?: string;
}
