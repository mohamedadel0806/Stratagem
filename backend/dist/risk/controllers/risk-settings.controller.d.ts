import { RiskSettingsService } from '../services/risk-settings.service';
import { UpdateRiskSettingsDto, RiskSettingsResponseDto } from '../dto/settings/risk-settings.dto';
export declare class RiskSettingsController {
    private readonly settingsService;
    constructor(settingsService: RiskSettingsService);
    getSettings(req: any, organizationId?: string): Promise<RiskSettingsResponseDto>;
    updateSettings(updateDto: UpdateRiskSettingsDto, req: any, organizationId?: string): Promise<RiskSettingsResponseDto>;
    resetToDefaults(req: any, organizationId?: string): Promise<RiskSettingsResponseDto>;
    getRiskLevel(score: number, req: any, organizationId?: string): Promise<{
        level: string;
        color: string;
        description: string;
        responseTime: string;
        escalation: boolean;
    } | {
        message: string;
    }>;
    checkRiskAppetite(score: number, req: any, organizationId?: string): Promise<{
        score: number;
        exceedsAppetite: boolean;
        maxAcceptable: number;
    }>;
    getAssessmentMethods(req: any, organizationId?: string): Promise<{
        id: string;
        name: string;
        description: string;
        likelihoodScale: number;
        impactScale: number;
        isDefault: boolean;
    }[]>;
    getLikelihoodScale(req: any, organizationId?: string): Promise<{
        value: number;
        label: string;
        description: string;
    }[]>;
    getImpactScale(req: any, organizationId?: string): Promise<{
        value: number;
        label: string;
        description: string;
    }[]>;
}
