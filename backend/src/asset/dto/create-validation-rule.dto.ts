import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsArray, IsObject } from 'class-validator';
import { AssetType, ValidationType, ValidationSeverity } from '../entities/validation-rule.entity';

export class CreateValidationRuleDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(AssetType)
  assetType: AssetType;

  @IsString()
  fieldName: string;

  @IsEnum(ValidationType)
  validationType: ValidationType;

  @IsString()
  @IsOptional()
  regexPattern?: string;

  @IsNumber()
  @IsOptional()
  minLength?: number;

  @IsNumber()
  @IsOptional()
  maxLength?: number;

  @IsNumber()
  @IsOptional()
  minValue?: number;

  @IsNumber()
  @IsOptional()
  maxValue?: number;

  @IsString()
  @IsOptional()
  customValidationScript?: string;

  @IsString()
  @IsOptional()
  errorMessage?: string;

  @IsEnum(ValidationSeverity)
  @IsOptional()
  severity?: ValidationSeverity;

  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  dependencies?: Array<{ field: string; condition: string; value: any }>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  applyToImport?: boolean;
}

