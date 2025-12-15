import { Repository } from 'typeorm';
import { Risk } from '../entities/risk.entity';
import { RiskAssetLink } from '../entities/risk-asset-link.entity';
import { RiskControlLink } from '../entities/risk-control-link.entity';
import { RiskTreatment } from '../entities/risk-treatment.entity';
import { KRIRiskLink } from '../entities/kri-risk-link.entity';
import { RiskSettingsService } from './risk-settings.service';
import { RiskComparisonRequestDto, RiskComparisonResponseDto, WhatIfScenarioRequestDto, WhatIfScenarioResponseDto, BatchWhatIfRequestDto, CustomReportConfigDto } from '../dto/advanced/risk-comparison.dto';
export declare class RiskAdvancedService {
    private riskRepository;
    private assetLinkRepository;
    private controlLinkRepository;
    private treatmentRepository;
    private kriLinkRepository;
    private riskSettingsService;
    constructor(riskRepository: Repository<Risk>, assetLinkRepository: Repository<RiskAssetLink>, controlLinkRepository: Repository<RiskControlLink>, treatmentRepository: Repository<RiskTreatment>, kriLinkRepository: Repository<KRIRiskLink>, riskSettingsService: RiskSettingsService);
    compareRisks(request: RiskComparisonRequestDto, organizationId?: string): Promise<RiskComparisonResponseDto>;
    simulateWhatIf(request: WhatIfScenarioRequestDto, organizationId?: string): Promise<WhatIfScenarioResponseDto>;
    batchWhatIf(request: BatchWhatIfRequestDto, organizationId?: string): Promise<WhatIfScenarioResponseDto[]>;
    generateCustomReport(config: CustomReportConfigDto, organizationId?: string): Promise<{
        report_name: string;
        generated_at: string;
        filters_applied: Record<string, any>;
        data: any[];
        summary?: Record<string, any>;
        grouped_data?: Record<string, any[]>;
    }>;
    getAvailableReportFields(): {
        field: string;
        label: string;
        category: string;
    }[];
    private getRiskLevelFromSettings;
    private getDefaultRiskLevel;
    private generateRecommendation;
    private getIntegrationCounts;
}
