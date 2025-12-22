import { IsString, IsOptional, IsUUID, IsEnum, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { BaselineStatus } from '../entities/baseline.entity';

export class CreateBaselineRequirementDto {
  @IsString()
  requirement_identifier: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  configuration_value?: string;

  @IsString()
  @IsOptional()
  validation_method?: string;

  @IsInt()
  @IsOptional()
  display_order?: number;
}

export class CreateSecureBaselineDto {
  @IsString()
  @IsOptional()
  baseline_identifier?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsEnum(BaselineStatus)
  @IsOptional()
  status?: BaselineStatus;

  @IsUUID()
  @IsOptional()
  owner_id?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateBaselineRequirementDto)
  requirements?: CreateBaselineRequirementDto[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  control_objective_ids?: string[];
}


