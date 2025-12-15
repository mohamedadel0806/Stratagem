import { Repository } from 'typeorm';
import { RiskAssetLink, RiskAssetType } from '../entities/risk-asset-link.entity';
import { Risk } from '../entities/risk.entity';
import { CreateRiskAssetLinkDto } from '../dto/links/create-risk-asset-link.dto';
export interface AssetInfo {
    id: string;
    type: RiskAssetType;
    name: string;
    description?: string;
    criticality?: string;
}
export interface RiskAssetLinkResponseDto {
    id: string;
    risk_id: string;
    asset_type: RiskAssetType;
    asset_id: string;
    impact_description?: string;
    asset_criticality_at_link?: string;
    linked_by?: string;
    linked_at: string;
    asset_info?: AssetInfo;
}
export declare class RiskAssetLinkService {
    private linkRepository;
    private riskRepository;
    constructor(linkRepository: Repository<RiskAssetLink>, riskRepository: Repository<Risk>);
    findByRiskId(riskId: string): Promise<RiskAssetLinkResponseDto[]>;
    findByAsset(assetType: RiskAssetType, assetId: string): Promise<RiskAssetLinkResponseDto[]>;
    getRisksForAsset(assetType: RiskAssetType, assetId: string): Promise<any[]>;
    getAssetRiskScore(assetType: RiskAssetType, assetId: string): Promise<{
        total_risks: number;
        total_risk_score: number;
        max_risk_level: string;
        risk_breakdown: {
            level: string;
            count: number;
        }[];
    }>;
    create(createDto: CreateRiskAssetLinkDto, userId?: string): Promise<RiskAssetLinkResponseDto>;
    bulkCreate(riskId: string, assets: {
        asset_type: RiskAssetType;
        asset_id: string;
        impact_description?: string;
    }[], userId?: string): Promise<RiskAssetLinkResponseDto[]>;
    updateImpactDescription(linkId: string, impactDescription: string): Promise<RiskAssetLinkResponseDto>;
    remove(linkId: string): Promise<void>;
    removeByRiskAndAsset(riskId: string, assetType: RiskAssetType, assetId: string): Promise<void>;
    countByRisk(riskId: string): Promise<Record<RiskAssetType, number>>;
    private compareLevels;
    private toResponseDto;
}
