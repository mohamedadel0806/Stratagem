import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsUUID,
  IsObject,
  MaxLength,
} from 'class-validator';
import {
  ControlType,
  ControlComplexity,
  ControlCostImpact,
  ControlStatus,
  ImplementationStatus,
} from '../entities/unified-control.entity';

export class CreateUnifiedControlDto {
  @IsString()
  @MaxLength(100)
  control_identifier: string;

  @IsString()
  @MaxLength(500)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ControlType)
  control_type?: ControlType;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  control_category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  domain?: string;

  @IsOptional()
  @IsEnum(ControlComplexity)
  complexity?: ControlComplexity;

  @IsOptional()
  @IsEnum(ControlCostImpact)
  cost_impact?: ControlCostImpact;

  @IsOptional()
  @IsEnum(ControlStatus)
  status?: ControlStatus;

  @IsOptional()
  @IsEnum(ImplementationStatus)
  implementation_status?: ImplementationStatus;

  @IsOptional()
  @IsUUID()
  control_owner_id?: string;

  @IsOptional()
  @IsString()
  control_procedures?: string;

  @IsOptional()
  @IsString()
  testing_procedures?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  custom_fields?: Record<string, any>;
}







