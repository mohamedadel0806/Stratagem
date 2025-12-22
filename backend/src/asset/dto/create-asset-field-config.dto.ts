import { IsString, IsEnum, IsBoolean, IsOptional, IsInt, IsArray } from 'class-validator';
import { AssetTypeEnum, FieldType } from '../entities/asset-field-config.entity';

export class CreateAssetFieldConfigDto {
  @IsEnum(AssetTypeEnum)
  assetType: AssetTypeEnum;

  @IsString()
  fieldName: string;

  @IsString()
  displayName: string;

  @IsEnum(FieldType)
  fieldType: FieldType;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsInt()
  @IsOptional()
  displayOrder?: number;

  @IsString()
  @IsOptional()
  validationRule?: string;

  @IsString()
  @IsOptional()
  validationMessage?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  selectOptions?: string[];

  @IsString()
  @IsOptional()
  defaultValue?: string;

  @IsString()
  @IsOptional()
  helpText?: string;

  @IsOptional()
  fieldDependencies?: Record<string, any>;
}











