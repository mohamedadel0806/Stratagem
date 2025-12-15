import { RiskAssetType } from '../../entities/risk-asset-link.entity';
export declare class CreateRiskAssetLinkDto {
    risk_id: string;
    asset_type: RiskAssetType;
    asset_id: string;
    impact_description?: string;
}
export declare class BulkCreateRiskAssetLinksDto {
    risk_id: string;
    assets: {
        asset_type: RiskAssetType;
        asset_id: string;
        impact_description?: string;
    }[];
}
