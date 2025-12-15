import { Repository } from 'typeorm';
import { RiskSettings } from '../entities/risk-settings.entity';
import { UpdateRiskSettingsDto, RiskSettingsResponseDto } from '../dto/settings/risk-settings.dto';
export declare class RiskSettingsService {
    private settingsRepository;
    constructor(settingsRepository: Repository<RiskSettings>);
    getSettings(organizationId?: string): Promise<RiskSettingsResponseDto>;
    updateSettings(updateDto: UpdateRiskSettingsDto, userId?: string, organizationId?: string): Promise<RiskSettingsResponseDto>;
    resetToDefaults(userId?: string, organizationId?: string): Promise<RiskSettingsResponseDto>;
    getRiskLevelForScore(score: number, organizationId?: string): Promise<{
        level: string;
        color: string;
        description: string;
        responseTime: string;
        escalation: boolean;
    } | null>;
    exceedsRiskAppetite(score: number, organizationId?: string): Promise<boolean>;
    getActiveAssessmentMethods(organizationId?: string): Promise<{
        id: string;
        name: string;
        description: string;
        likelihoodScale: number;
        impactScale: number;
        isDefault: boolean;
    }[]>;
    getDefaultAssessmentMethod(organizationId?: string): Promise<string>;
    getLikelihoodScale(organizationId?: string): Promise<{
        value: number;
        label: string;
        description: string;
    }[]>;
    getImpactScale(organizationId?: string): Promise<{
        value: number;
        label: string;
        description: string;
    }[]>;
    private createDefaultSettings;
    private toResponseDto;
}
