import { IsString, IsOptional, IsEnum, IsArray, IsUUID, IsJSON } from 'class-validator';
import { TemplateStatus } from '../entities/sop-template.entity';

export class CreateSOPTemplateDto {
  @IsString()
  template_key: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  purpose_template: string;

  @IsString()
  scope_template: string;

  @IsString()
  content_template: string;

  @IsOptional()
  @IsString()
  success_criteria_template?: string;

  @IsOptional()
  @IsEnum(TemplateStatus)
  status?: TemplateStatus;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsJSON()
  metadata?: Record<string, any>;
}

export class UpdateSOPTemplateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  purpose_template?: string;

  @IsOptional()
  @IsString()
  scope_template?: string;

  @IsOptional()
  @IsString()
  content_template?: string;

  @IsOptional()
  @IsString()
  success_criteria_template?: string;

  @IsOptional()
  @IsEnum(TemplateStatus)
  status?: TemplateStatus;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsJSON()
  metadata?: Record<string, any>;
}

export class SOPTemplateQueryDto {
  @IsOptional()
  @IsString()
  status?: TemplateStatus;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  sort?: string;
}
