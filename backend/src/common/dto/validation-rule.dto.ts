import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsBoolean, IsNumber, IsObject, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidationLogic } from '../entities/compliance-validation-rule.entity';

export type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';

export class ConditionDto {
  @ApiProperty()
  @IsString()
  field: string;

  @ApiProperty({ enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'in', 'not_in', 'exists', 'not_exists'] })
  @IsEnum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'in', 'not_in', 'exists', 'not_exists'])
  operator: string;

  @ApiProperty()
  value: any;
}

export class CreateValidationRuleDto {
  @ApiProperty()
  @IsUUID()
  requirementId: string;

  @ApiProperty({ enum: ['physical', 'information', 'application', 'software', 'supplier'] })
  @IsEnum(['physical', 'information', 'application', 'software', 'supplier'])
  assetType: AssetType;

  @ApiProperty()
  @IsString()
  ruleName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ruleDescription?: string;

  @ApiProperty({ type: Object })
  @IsObject()
  validationLogic: ValidationLogic;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateValidationRuleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ruleName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ruleDescription?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  validationLogic?: ValidationLogic;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ValidationRuleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  requirementId: string;

  @ApiPropertyOptional()
  requirementTitle?: string;

  @ApiPropertyOptional()
  requirementCode?: string;

  @ApiProperty()
  assetType: AssetType;

  @ApiProperty()
  ruleName: string;

  @ApiPropertyOptional()
  ruleDescription?: string;

  @ApiProperty({ type: Object })
  validationLogic: ValidationLogic;

  @ApiProperty()
  priority: number;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  createdById?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}









