import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
} from 'class-validator';

export class ImportFrameworkStructureDto {
  @IsString()
  framework_id: string;

  @IsOptional()
  @IsString()
  version?: string;

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
          description?: string;
          domain?: string;
          category?: string;
          subcategory?: string;
          display_order?: number;
        }>;
      }>;
    }>;
  };

  @IsOptional()
  @IsBoolean()
  create_version?: boolean;

  @IsOptional()
  @IsBoolean()
  replace_existing?: boolean;
}


