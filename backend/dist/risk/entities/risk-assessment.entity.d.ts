import { Risk, RiskLevel } from './risk.entity';
import { User } from '../../users/entities/user.entity';
export declare enum AssessmentType {
    INHERENT = "inherent",
    CURRENT = "current",
    TARGET = "target"
}
export declare enum ImpactLevel {
    NEGLIGIBLE = "negligible",
    MINOR = "minor",
    MODERATE = "moderate",
    MAJOR = "major",
    CATASTROPHIC = "catastrophic"
}
export declare enum ConfidenceLevel {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare class RiskAssessment {
    id: string;
    risk_id: string;
    risk: Risk;
    assessment_type: AssessmentType;
    likelihood: number;
    impact: number;
    risk_score: number;
    risk_level: RiskLevel;
    financial_impact: ImpactLevel;
    financial_impact_amount: number;
    operational_impact: ImpactLevel;
    reputational_impact: ImpactLevel;
    compliance_impact: ImpactLevel;
    safety_impact: ImpactLevel;
    assessment_date: Date;
    assessor_id: string;
    assessor: User;
    assessment_method: string;
    assessment_notes: string;
    assumptions: string;
    confidence_level: ConfidenceLevel;
    evidence_attachments: Record<string, any>[];
    is_latest: boolean;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_at: Date;
}
