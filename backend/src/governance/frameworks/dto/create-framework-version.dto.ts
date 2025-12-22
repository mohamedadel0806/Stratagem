import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsObject,
  MaxLength,
} from 'class-validator';

export class CreateFrameworkVersionDto {
  @IsString()
  @MaxLength(50)
  version: string;

  @IsOptional()
  @IsString()
  version_notes?: string;

  @IsOptional()
  @IsObject()
  structure?: {
    domains?: Array<{
      name: string;
      categories?: Array<{
        name: string;
        requirements?: Array<{
          identifier: string;
          title: string;
          text: string;
        }>;
      }>;
    }>;
  };

  @IsOptional()
  @IsDateString()
  effective_date?: string;

  @IsOptional()
  @IsBoolean()
  is_current?: boolean;
}


