import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { RiskAssetType } from '../../entities/risk-asset-link.entity';

export class CreateRiskAssetLinkDto {
  @IsUUID()
  risk_id: string;

  @IsEnum(RiskAssetType)
  asset_type: RiskAssetType;

  @IsUUID()
  asset_id: string;

  @IsString()
  @IsOptional()
  impact_description?: string;
}

export class BulkCreateRiskAssetLinksDto {
  @IsUUID()
  risk_id: string;

  assets: {
    asset_type: RiskAssetType;
    asset_id: string;
    impact_description?: string;
  }[];
}







