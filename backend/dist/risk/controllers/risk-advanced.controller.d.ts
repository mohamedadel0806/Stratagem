import { RiskAdvancedService } from '../services/risk-advanced.service';
import { RiskComparisonRequestDto, RiskComparisonResponseDto, WhatIfScenarioRequestDto, WhatIfScenarioResponseDto, BatchWhatIfRequestDto, CustomReportConfigDto } from '../dto/advanced/risk-comparison.dto';
export declare class RiskAdvancedController {
    private readonly advancedService;
    constructor(advancedService: RiskAdvancedService);
    compareRisks(request: RiskComparisonRequestDto, req: any): Promise<RiskComparisonResponseDto>;
    simulateWhatIf(request: WhatIfScenarioRequestDto, req: any): Promise<WhatIfScenarioResponseDto>;
    batchWhatIf(request: BatchWhatIfRequestDto, req: any): Promise<WhatIfScenarioResponseDto[]>;
    generateReport(config: CustomReportConfigDto, req: any): Promise<{
        report_name: string;
        generated_at: string;
        filters_applied: Record<string, any>;
        data: any[];
        summary?: Record<string, any>;
        grouped_data?: Record<string, any[]>;
    }>;
    getAvailableFields(): {
        field: string;
        label: string;
        category: string;
    }[];
    quickCompare(ids: string, req: any): Promise<RiskComparisonResponseDto>;
    quickWhatIf(riskId: string, likelihood?: string, impact?: string, controlEffectiveness?: string, additionalControls?: string, req?: any): Promise<WhatIfScenarioResponseDto>;
}
