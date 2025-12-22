import { IsString, IsOptional, IsEnum, IsBoolean, IsArray, IsUUID } from 'class-validator';
import { TemplateType } from '../entities/document-template.entity';

export class CreateDocumentTemplateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TemplateType)
  type: TemplateType;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  content: string;

  @IsOptional()
  structure?: any;

  @IsString()
  @IsOptional()
  version?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  restricted_to_roles?: string[];
}


