import { AssessmentType, ImpactLevel, ConfidenceLevel } from '../../entities/risk-assessment.entity';
export declare class CreateRiskAssessmentDto {
    risk_id: string;
    assessment_type: AssessmentType;
    likelihood: number;
    impact: number;
    financial_impact?: ImpactLevel;
    financial_impact_amount?: number;
    operational_impact?: ImpactLevel;
    reputational_impact?: ImpactLevel;
    compliance_impact?: ImpactLevel;
    safety_impact?: ImpactLevel;
    assessment_date?: string;
    assessment_method?: string;
    assessment_notes?: string;
    assumptions?: string;
    confidence_level?: ConfidenceLevel;
    evidence_attachments?: Record<string, any>[];
    is_latest?: boolean;
}
