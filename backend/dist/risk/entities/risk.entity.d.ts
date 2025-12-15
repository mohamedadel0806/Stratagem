import { User } from '../../users/entities/user.entity';
import { RiskCategory } from './risk-category.entity';
import { RiskAssessment } from './risk-assessment.entity';
import { RiskAssetLink } from './risk-asset-link.entity';
import { RiskControlLink } from './risk-control-link.entity';
import { RiskTreatment } from './risk-treatment.entity';
import { KRIRiskLink } from './kri-risk-link.entity';
export declare enum RiskStatus {
    IDENTIFIED = "identified",
    ASSESSED = "assessed",
    MITIGATED = "mitigated",
    ACCEPTED = "accepted",
    CLOSED = "closed"
}
export declare enum RiskStatusNew {
    ACTIVE = "active",
    MONITORING = "monitoring",
    CLOSED = "closed",
    ACCEPTED = "accepted"
}
export declare enum RiskCategory_OLD {
    CYBERSECURITY = "cybersecurity",
    DATA_PRIVACY = "data_privacy",
    COMPLIANCE = "compliance",
    OPERATIONAL = "operational",
    FINANCIAL = "financial",
    STRATEGIC = "strategic",
    REPUTATIONAL = "reputational"
}
export declare enum RiskLikelihood {
    VERY_LOW = 1,
    LOW = 2,
    MEDIUM = 3,
    HIGH = 4,
    VERY_HIGH = 5
}
export declare enum RiskImpact {
    VERY_LOW = 1,
    LOW = 2,
    MEDIUM = 3,
    HIGH = 4,
    VERY_HIGH = 5
}
export declare enum ThreatSource {
    INTERNAL = "internal",
    EXTERNAL = "external",
    NATURAL = "natural"
}
export declare enum RiskVelocity {
    SLOW = "slow",
    MEDIUM = "medium",
    FAST = "fast",
    IMMEDIATE = "immediate"
}
export declare enum RiskLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare class Risk {
    id: string;
    risk_id: string;
    title: string;
    description: string;
    risk_statement: string;
    category: RiskCategory_OLD;
    category_id: string;
    risk_category: RiskCategory;
    sub_category_id: string;
    risk_sub_category: RiskCategory;
    status: RiskStatus;
    likelihood: RiskLikelihood;
    impact: RiskImpact;
    organizationId: string;
    ownerId: string;
    owner: User;
    risk_analyst_id: string;
    risk_analyst: User;
    date_identified: Date;
    next_review_date: Date;
    last_review_date: Date;
    threat_source: ThreatSource;
    risk_velocity: RiskVelocity;
    early_warning_signs: string;
    status_notes: string;
    business_process: string;
    tags: string[];
    business_unit_ids: string[];
    version_number: number;
    inherent_likelihood: number;
    inherent_impact: number;
    inherent_risk_score: number;
    inherent_risk_level: RiskLevel;
    current_likelihood: number;
    current_impact: number;
    current_risk_score: number;
    current_risk_level: RiskLevel;
    target_likelihood: number;
    target_impact: number;
    target_risk_score: number;
    target_risk_level: RiskLevel;
    control_effectiveness: number;
    assessments: RiskAssessment[];
    asset_links: RiskAssetLink[];
    control_links: RiskControlLink[];
    treatments: RiskTreatment[];
    kri_links: KRIRiskLink[];
    created_by: string;
    creator: User;
    createdAt: Date;
    updated_by: string;
    updater: User;
    updatedAt: Date;
    deleted_at: Date;
}
