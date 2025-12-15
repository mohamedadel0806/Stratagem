export declare class RiskComparisonRequestDto {
    risk_ids: string[];
}
export declare class RiskComparisonDataDto {
    id: string;
    risk_id: string;
    title: string;
    category_name?: string;
    status?: string;
    owner_name?: string;
    inherent_likelihood?: number;
    inherent_impact?: number;
    inherent_risk_score?: number;
    inherent_risk_level?: string;
    current_likelihood?: number;
    current_impact?: number;
    current_risk_score?: number;
    current_risk_level?: string;
    target_likelihood?: number;
    target_impact?: number;
    target_risk_score?: number;
    target_risk_level?: string;
    control_effectiveness?: number;
    linked_controls_count?: number;
    linked_assets_count?: number;
    active_treatments_count?: number;
    kri_count?: number;
    risk_reduction_percentage?: number;
    gap_to_target?: number;
}
export declare class RiskComparisonResponseDto {
    risks: RiskComparisonDataDto[];
    summary: {
        total_risks: number;
        average_current_score: number;
        highest_risk: {
            id: string;
            title: string;
            score: number;
        };
        lowest_risk: {
            id: string;
            title: string;
            score: number;
        };
        average_control_effectiveness: number;
        total_linked_controls: number;
        total_active_treatments: number;
    };
    comparison_matrix: {
        metric: string;
        values: {
            risk_id: string;
            value: number | string;
        }[];
        variance?: number;
    }[];
}
export declare class WhatIfScenarioRequestDto {
    risk_id: string;
    simulated_likelihood?: number;
    simulated_impact?: number;
    simulated_control_effectiveness?: number;
    additional_controls?: number;
}
export declare class WhatIfScenarioResponseDto {
    original: {
        likelihood: number;
        impact: number;
        risk_score: number;
        risk_level: string;
        control_effectiveness: number;
    };
    simulated: {
        likelihood: number;
        impact: number;
        risk_score: number;
        risk_level: string;
        control_effectiveness: number;
    };
    impact_analysis: {
        score_change: number;
        score_change_percentage: number;
        level_changed: boolean;
        old_level: string;
        new_level: string;
        exceeds_appetite: boolean;
        appetite_threshold: number;
        recommendation: string;
    };
    risk_level_details?: {
        color: string;
        description: string;
        response_time: string;
        requires_escalation: boolean;
    };
}
export declare class BatchWhatIfRequestDto {
    risk_id: string;
    scenarios: Omit<WhatIfScenarioRequestDto, 'risk_id'>[];
}
export declare class CustomReportConfigDto {
    name: string;
    fields: string[];
    risk_levels?: string[];
    categories?: string[];
    statuses?: string[];
    owner_ids?: string[];
    exceeds_appetite_only?: boolean;
    sort_by?: string;
    sort_direction?: 'ASC' | 'DESC';
    group_by?: string;
    include_summary?: boolean;
}
