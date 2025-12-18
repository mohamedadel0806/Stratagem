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

  @IsString()
  @IsOptional()
  versionNumber?: string;

  @IsString()
  @IsOptional()
  patchLevel?: string;

  @IsBoolean()
  @IsOptional()
  rollbackOnError?: boolean; // If true, rollback all changes if any update fails
}

export class BulkUpdateResponseDto {
  successful: number;
  failed: number;
  errors: Array<{ assetId: string; error: string }>;
  rolledBack?: boolean; // Indicates if rollback was performed
}









