import { IsString, IsOptional, IsUUID, IsEnum, IsNumber, IsBoolean, IsArray, IsDateString, MaxLength } from 'class-validator';
import { MeasurementFrequency } from '../../entities/kri.entity';

export class CreateKRIDto {
  @IsString()
  @MaxLength(300)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  category_id?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  measurement_unit?: string;

  @IsEnum(MeasurementFrequency)
  @IsOptional()
  measurement_frequency?: MeasurementFrequency;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  data_source?: string;

  @IsString()
  @IsOptional()
  calculation_method?: string;

  @IsNumber()
  @IsOptional()
  threshold_green?: number;

  @IsNumber()
  @IsOptional()
  threshold_amber?: number;

  @IsNumber()
  @IsOptional()
  threshold_red?: number;

  @IsString()
  @IsOptional()
  threshold_direction?: string;

  @IsUUID()
  @IsOptional()
  kri_owner_id?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsDateString()
  @IsOptional()
  next_measurement_due?: string;

  @IsNumber()
  @IsOptional()
  target_value?: number;

  @IsNumber()
  @IsOptional()
  baseline_value?: number;

  @IsArray()
  @IsOptional()
  tags?: string[];
}





