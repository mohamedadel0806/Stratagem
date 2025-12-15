import { Repository } from 'typeorm';
import { Risk, RiskStatus, RiskLevel } from '../entities/risk.entity';
import { RiskAssetLink } from '../entities/risk-asset-link.entity';
import { RiskControlLink } from '../entities/risk-control-link.entity';
import { RiskTreatment } from '../entities/risk-treatment.entity';
import { KRIRiskLink } from '../entities/kri-risk-link.entity';
import { RiskResponseDto, RiskDashboardSummaryDto } from '../dto/risk-response.dto';
import { CreateRiskDto } from '../dto/create-risk.dto';
import { UpdateRiskDto } from '../dto/update-risk.dto';
import { RiskQueryDto } from '../dto/risk-query.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { RiskSettingsService } from './risk-settings.service';
export declare class RiskService {
    private riskRepository;
    private assetLinkRepository;
    private controlLinkRepository;
    private treatmentRepository;
    private kriLinkRepository;
    private workflowService;
    private riskSettingsService;
    constructor(riskRepository: Repository<Risk>, assetLinkRepository: Repository<RiskAssetLink>, controlLinkRepository: Repository<RiskControlLink>, treatmentRepository: Repository<RiskTreatment>, kriLinkRepository: Repository<KRIRiskLink>, workflowService: WorkflowService, riskSettingsService: RiskSettingsService);
    findAll(query?: RiskQueryDto): Promise<{
        data: RiskResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, organizationId?: string): Promise<RiskResponseDto>;
    create(createRiskDto: CreateRiskDto, userId?: string, organizationId?: string): Promise<RiskResponseDto>;
    update(id: string, updateRiskDto: UpdateRiskDto, userId?: string): Promise<RiskResponseDto>;
    remove(id: string): Promise<void>;
    bulkUpdateStatus(ids: string[], status: RiskStatus): Promise<{
        updated: number;
        risks: RiskResponseDto[];
    }>;
    getHeatmapData(): Promise<{
        cells: {
            likelihood: number;
            impact: number;
            count: number;
            riskScore: number;
            riskIds: string[];
            riskLevel: RiskLevel;
        }[];
        totalRisks: number;
        maxRiskScore: number;
    }>;
    getDashboardSummary(organizationId?: string): Promise<RiskDashboardSummaryDto>;
    getTopRisks(limit?: number): Promise<RiskResponseDto[]>;
    getRisksNeedingReview(days?: number): Promise<RiskResponseDto[]>;
    private getIntegrationCounts;
    private calculateRiskLevelFromSettings;
    private calculateRiskLevelDefault;
    private calculateRiskLevel;
    checkRiskAppetite(score: number, organizationId?: string): Promise<{
        exceeds: boolean;
        maxAcceptable: number;
        requiresEscalation: boolean;
    }>;
    private toResponseDto;
    private enrichWithRiskAppetite;
    getRisksExceedingAppetite(organizationId?: string): Promise<RiskResponseDto[]>;
}
