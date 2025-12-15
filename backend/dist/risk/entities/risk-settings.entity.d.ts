import { User } from '../../users/entities/user.entity';
export declare class RiskSettings {
    id: string;
    organization_id: string;
    risk_levels: {
        level: string;
        minScore: number;
        maxScore: number;
        color: string;
        description: string;
        responseTime: string;
        escalation: boolean;
    }[];
    assessment_methods: {
        id: string;
        name: string;
        description: string;
        likelihoodScale: number;
        impactScale: number;
        isDefault: boolean;
        isActive: boolean;
    }[];
    likelihood_scale: {
        value: number;
        label: string;
        description: string;
    }[];
    impact_scale: {
        value: number;
        label: string;
        description: string;
    }[];
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
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
}
