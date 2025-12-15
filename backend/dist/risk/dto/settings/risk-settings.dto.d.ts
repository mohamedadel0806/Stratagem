export declare class RiskLevelConfigDto {
    level: string;
    minScore: number;
    maxScore: number;
    color: string;
    description: string;
    responseTime: string;
    escalation: boolean;
}
export declare class AssessmentMethodConfigDto {
    id: string;
    name: string;
    description: string;
    likelihoodScale: number;
    impactScale: number;
    isDefault: boolean;
    isActive: boolean;
}
export declare class ScaleDescriptionDto {
    value: number;
    label: string;
    description: string;
}
export declare class UpdateRiskSettingsDto {
    risk_levels?: RiskLevelConfigDto[];
    assessment_methods?: AssessmentMethodConfigDto[];
    likelihood_scale?: ScaleDescriptionDto[];
    impact_scale?: ScaleDescriptionDto[];
    max_acceptable_risk_score?: number;
    risk_acceptance_authority?: string;
    default_review_period_days?: number;
    auto_calculate_risk_score?: boolean;
    require_assessment_evidence?: boolean;
    enable_risk_appetite?: boolean;
    default_assessment_method?: string;
    notify_on_high_risk?: boolean;
    notify_on_critical_risk?: boolean;
    notify_on_review_due?: boolean;
    review_reminder_days?: number;
}
export declare class RiskSettingsResponseDto {
    id: string;
    organization_id?: string;
    risk_levels: RiskLevelConfigDto[];
    assessment_methods: AssessmentMethodConfigDto[];
    likelihood_scale: ScaleDescriptionDto[];
    impact_scale: ScaleDescriptionDto[];
    max_acceptable_risk_score: number;
    risk_acceptance_authority: string;
    default_review_period_days: number;
    auto_calculate_risk_score: boolean;
    require_assessment_evidence: boolean;
    enable_risk_appetite: boolean;
    default_assessment_method: string;
    notify_on_high_risk: boolean;
    notify_on_critical_risk: boolean;
    notify_on_review_due: boolean;
    review_reminder_days: number;
    version: number;
    created_at: string;
    updated_at: string;
    updated_by_name?: string;
}
