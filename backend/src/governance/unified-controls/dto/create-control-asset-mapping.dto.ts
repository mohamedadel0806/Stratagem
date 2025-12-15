import { IsEnum, IsUUID, IsOptional, IsDateString, IsString, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { AssetType } from '../entities/control-asset-mapping.entity';
import { ImplementationStatus } from '../entities/unified-control.entity';

export class CreateControlAssetMappingDto {
  @IsEnum(AssetType)
  asset_type: AssetType;

  @IsUUID()
  asset_id: string;

  @IsOptional()
  @IsDateString()
  implementation_date?: string;

  @IsOptional()
  @IsEnum(ImplementationStatus)
  implementation_status?: ImplementationStatus;

  @IsOptional()
  @IsString()
  implementation_notes?: string;

  @IsOptional()
  @IsDateString()
  last_test_date?: string;

  @IsOptional()
  @IsString()
  last_test_result?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  effectiveness_score?: number;

  @IsOptional()
  @IsBoolean()
  is_automated?: boolean;
}

export class BulkCreateControlAssetMappingDto {
  @IsEnum(AssetType)
  asset_type: AssetType;

  @IsUUID('4', { each: true })
  asset_ids: string[];

  @IsOptional()
  @IsDateString()
  implementation_date?: string;

  @IsOptional()
  @IsEnum(ImplementationStatus)
  implementation_status?: ImplementationStatus;

  @IsOptional()
  @IsString()
  implementation_notes?: string;
}




