import { RiskService } from '../services/risk.service';
import { CreateRiskDto } from '../dto/create-risk.dto';
import { UpdateRiskDto } from '../dto/update-risk.dto';
import { RiskQueryDto } from '../dto/risk-query.dto';
import { BulkUpdateRiskDto } from '../dto/bulk-update-risk.dto';
export declare class RiskController {
    private readonly riskService;
    constructor(riskService: RiskService);
    findAll(query: RiskQueryDto): Promise<{
        data: import("../dto/risk-response.dto").RiskResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    getHeatmap(): Promise<{
        cells: {
            likelihood: number;
            impact: number;
            count: number;
            riskScore: number;
            riskIds: string[];
            riskLevel: import("../entities").RiskLevel;
        }[];
        totalRisks: number;
        maxRiskScore: number;
    }>;
    getDashboardSummary(req: any): Promise<import("../dto/risk-response.dto").RiskDashboardSummaryDto>;
    getTopRisks(limit?: number): Promise<import("../dto/risk-response.dto").RiskResponseDto[]>;
    getRisksNeedingReview(days?: number): Promise<import("../dto/risk-response.dto").RiskResponseDto[]>;
    getRisksExceedingAppetite(req: any): Promise<import("../dto/risk-response.dto").RiskResponseDto[]>;
    checkRiskAppetite(score: number, req: any): Promise<{
        exceeds: boolean;
        maxAcceptable: number;
        requiresEscalation: boolean;
    }>;
    findOne(id: string, req: any): Promise<import("../dto/risk-response.dto").RiskResponseDto>;
    create(createRiskDto: CreateRiskDto, req: any): Promise<import("../dto/risk-response.dto").RiskResponseDto>;
    update(id: string, updateRiskDto: UpdateRiskDto, req: any): Promise<import("../dto/risk-response.dto").RiskResponseDto>;
    bulkUpdateStatus(bulkUpdateDto: BulkUpdateRiskDto): Promise<{
        updated: number;
        risks: import("../dto/risk-response.dto").RiskResponseDto[];
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
