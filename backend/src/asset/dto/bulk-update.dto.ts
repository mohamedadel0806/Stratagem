import { IsArray, IsString, IsEnum, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { CriticalityLevel } from '../entities/physical-asset.entity';

export class BulkUpdateDto {
  @IsArray()
  @IsUUID('4', { each: true })
  assetIds: string[];

  @IsString()
  @IsOptional()
  ownerId?: string;

  @IsEnum(CriticalityLevel)
  @IsOptional()
  criticalityLevel?: CriticalityLevel;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  complianceTags?: string[];

  @IsString()
  @IsOptional()
  businessUnit?: string;

  @IsString()
  @IsOptional()
  department?: string;
}

export class BulkUpdateResponseDto {
  successful: number;
  failed: number;
  errors: Array<{ assetId: string; error: string }>;
}








