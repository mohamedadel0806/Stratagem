import { IsOptional, IsEnum, IsString, IsBoolean } from 'class-validator';
import { TemplateType } from '../entities/document-template.entity';

export class TemplateQueryDto {
  @IsEnum(TemplateType)
  @IsOptional()
  type?: TemplateType;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  search?: string;
}


