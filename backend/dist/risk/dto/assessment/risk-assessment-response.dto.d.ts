import { AssessmentType, ImpactLevel, ConfidenceLevel } from '../../entities/risk-assessment.entity';
import { RiskLevel } from '../../entities/risk.entity';
export declare class RiskAssessmentResponseDto {
    id: string;
    risk_id: string;
    assessment_type: AssessmentType;
    likelihood: number;
    impact: number;
    risk_score: number;
    risk_level: RiskLevel;
    financial_impact?: ImpactLevel;
    financial_impact_amount?: number;
    operational_impact?: ImpactLevel;
    reputational_impact?: ImpactLevel;
    compliance_impact?: ImpactLevel;
    safety_impact?: ImpactLevel;
    assessment_date: string;
    assessor_id?: string;
    assessor_name?: string;
    assessment_method: string;
    assessment_notes?: string;
    assumptions?: string;
    confidence_level: ConfidenceLevel;
    evidence_attachments?: Record<string, any>[];
    is_latest: boolean;
    created_at: string;
    updated_at: string;
}
