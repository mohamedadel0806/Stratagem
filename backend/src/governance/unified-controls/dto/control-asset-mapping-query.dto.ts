import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { AssetType } from '../entities/control-asset-mapping.entity';
import { ImplementationStatus } from '../entities/unified-control.entity';

export class ControlAssetMappingQueryDto {
  @IsOptional()
  @IsEnum(AssetType)
  asset_type?: AssetType;

  @IsOptional()
  @IsUUID()
  asset_id?: string;

  @IsOptional()
  @IsEnum(ImplementationStatus)
  implementation_status?: ImplementationStatus;
}







