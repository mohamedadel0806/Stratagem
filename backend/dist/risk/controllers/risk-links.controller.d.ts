import { RiskAssetLinkService } from '../services/risk-asset-link.service';
import { RiskControlLinkService } from '../services/risk-control-link.service';
import { RiskFindingLinkService } from '../services/risk-finding-link.service';
import { CreateRiskAssetLinkDto } from '../dto/links/create-risk-asset-link.dto';
import { CreateRiskControlLinkDto, UpdateRiskControlLinkDto } from '../dto/links/create-risk-control-link.dto';
import { CreateRiskFindingLinkDto, UpdateRiskFindingLinkDto } from '../dto/links/create-risk-finding-link.dto';
import { RiskAssetType } from '../entities/risk-asset-link.entity';
export declare class RiskLinksController {
    private readonly assetLinkService;
    private readonly controlLinkService;
    private readonly findingLinkService;
    constructor(assetLinkService: RiskAssetLinkService, controlLinkService: RiskControlLinkService, findingLinkService: RiskFindingLinkService);
    getAssetsByRisk(riskId: string): Promise<import("../services/risk-asset-link.service").RiskAssetLinkResponseDto[]>;
    getRisksByAsset(assetType: RiskAssetType, assetId: string): Promise<any[]>;
    getAssetRiskScore(assetType: RiskAssetType, assetId: string): Promise<{
        total_risks: number;
        total_risk_score: number;
        max_risk_level: string;
        risk_breakdown: {
            level: string;
            count: number;
        }[];
    }>;
    countAssetsByRisk(riskId: string): Promise<Record<RiskAssetType, number>>;
    createAssetLink(createDto: CreateRiskAssetLinkDto, req: any): Promise<import("../services/risk-asset-link.service").RiskAssetLinkResponseDto>;
    bulkCreateAssetLinks(body: {
        risk_id: string;
        assets: {
            asset_type: RiskAssetType;
            asset_id: string;
            impact_description?: string;
        }[];
    }, req: any): Promise<import("../services/risk-asset-link.service").RiskAssetLinkResponseDto[]>;
    updateAssetLinkDescription(linkId: string, impactDescription: string): Promise<import("../services/risk-asset-link.service").RiskAssetLinkResponseDto>;
    removeAssetLink(linkId: string): Promise<{
        message: string;
    }>;
    getControlsByRisk(riskId: string): Promise<import("../services/risk-control-link.service").RiskControlLinkResponseDto[]>;
    getRisksByControl(controlId: string): Promise<any[]>;
    getControlEffectiveness(riskId: string): Promise<{
        total_controls: number;
        average_effectiveness: number;
        effectiveness_by_type: {
            type: string;
            count: number;
            avg_effectiveness: number;
        }[];
    }>;
    getRisksWithoutControls(): Promise<any[]>;
    createControlLink(createDto: CreateRiskControlLinkDto, req: any): Promise<import("../services/risk-control-link.service").RiskControlLinkResponseDto>;
    updateControlLink(linkId: string, updateDto: UpdateRiskControlLinkDto, req: any): Promise<import("../services/risk-control-link.service").RiskControlLinkResponseDto>;
    removeControlLink(linkId: string): Promise<{
        message: string;
    }>;
    getFindingsByRisk(riskId: string): Promise<any[]>;
    getRisksByFinding(findingId: string): Promise<any[]>;
    createFindingLink(createDto: CreateRiskFindingLinkDto, req: any): Promise<import("../services/risk-finding-link.service").RiskFindingLinkResponseDto>;
    updateFindingLink(linkId: string, updateDto: UpdateRiskFindingLinkDto, req: any): Promise<import("../services/risk-finding-link.service").RiskFindingLinkResponseDto>;
    removeFindingLink(linkId: string): Promise<{
        message: string;
    }>;
}
