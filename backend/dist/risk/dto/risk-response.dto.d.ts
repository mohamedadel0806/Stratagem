import { RiskStatus, RiskCategory_OLD as RiskCategory, RiskLikelihood, RiskImpact, ThreatSource, RiskVelocity, RiskLevel } from '../entities/risk.entity';
export declare class RiskResponseDto {
    id: string;
    risk_id?: string;
    title: string;
    description?: string;
    risk_statement?: string;
    category: RiskCategory;
    category_id?: string;
    category_name?: string;
    sub_category_id?: string;
    sub_category_name?: string;
    status: RiskStatus;
    likelihood: RiskLikelihood;
    impact: RiskImpact;
    ownerId?: string;
    owner_name?: string;
    risk_analyst_id?: string;
    risk_analyst_name?: string;
    date_identified?: string;
    next_review_date?: string;
    last_review_date?: string;
    threat_source?: ThreatSource;
    risk_velocity?: RiskVelocity;
    early_warning_signs?: string;
    status_notes?: string;
    business_process?: string;
    tags?: string[];
    business_unit_ids?: string[];
    version_number?: number;
    inherent_likelihood?: number;
    inherent_impact?: number;
    inherent_risk_score?: number;
    inherent_risk_level?: RiskLevel;
    current_likelihood?: number;
    current_impact?: number;
    current_risk_score?: number;
    current_risk_level?: RiskLevel;
    target_likelihood?: number;
    target_impact?: number;
    target_risk_score?: number;
    target_risk_level?: RiskLevel;
    control_effectiveness?: number;
    linked_assets_count?: number;
    linked_controls_count?: number;
    active_treatments_count?: number;
    kri_count?: number;
    exceeds_risk_appetite?: boolean;
    requires_escalation?: boolean;
    recommended_response_time?: string;
    risk_level_color?: string;
    createdAt: string;
    updatedAt?: string;
}
export declare class RiskListResponseDto {
    data: RiskResponseDto[];
    total: number;
    page: number;
    limit: number;
}
export declare class RiskHeatmapCellDto {
    likelihood: number;
    impact: number;
    count: number;
    riskScore: number;
    riskIds: string[];
    riskLevel: RiskLevel;
}
export declare class RiskHeatmapResponseDto {
    cells: RiskHeatmapCellDto[];
    totalRisks: number;
    maxRiskScore: number;
}
export declare class RiskDashboardSummaryDto {
    total_risks: number;
    critical_risks: number;
    high_risks: number;
    medium_risks: number;
    low_risks: number;
    risks_exceeding_appetite: number;
    max_acceptable_score?: number;
    risk_appetite_enabled?: boolean;
    overdue_reviews: number;
    active_treatments: number;
    kri_red_count: number;
    kri_amber_count: number;
}
