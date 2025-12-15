import { RiskCategory_OLD as RiskCategory, RiskStatus, RiskLikelihood, RiskImpact, ThreatSource, RiskVelocity } from '../entities/risk.entity';
export declare class CreateRiskDto {
    title: string;
    description?: string;
    risk_statement?: string;
    category: RiskCategory;
    category_id?: string;
    sub_category_id?: string;
    status?: RiskStatus;
    likelihood?: RiskLikelihood;
    impact?: RiskImpact;
    ownerId?: string;
    risk_analyst_id?: string;
    date_identified?: string;
    threat_source?: ThreatSource;
    risk_velocity?: RiskVelocity;
    early_warning_signs?: string;
    status_notes?: string;
    business_process?: string;
    tags?: string[];
    business_unit_ids?: string[];
    next_review_date?: string;
    inherent_likelihood?: number;
    inherent_impact?: number;
    current_likelihood?: number;
    current_impact?: number;
    target_likelihood?: number;
    target_impact?: number;
}
