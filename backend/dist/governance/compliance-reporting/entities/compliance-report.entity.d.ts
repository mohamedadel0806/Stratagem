import { User } from '../../../users/entities/user.entity';
export declare enum ComplianceScore {
    EXCELLENT = "EXCELLENT",
    GOOD = "GOOD",
    FAIR = "FAIR",
    POOR = "POOR"
}
export declare enum ReportPeriod {
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    ANNUAL = "ANNUAL",
    CUSTOM = "CUSTOM"
}
export declare class ComplianceReport {
    id: string;
    report_name: string;
    report_period: ReportPeriod;
    period_start_date: Date;
    period_end_date: Date;
    overall_compliance_score: number;
    overall_compliance_rating: ComplianceScore;
    policies_compliance_score: number;
    controls_compliance_score: number;
    assets_compliance_score: number;
    total_policies: number;
    policies_published: number;
    policies_acknowledged: number;
    policy_acknowledgment_rate: number;
    total_controls: number;
    controls_implemented: number;
    controls_partial: number;
    controls_not_implemented: number;
    average_control_effectiveness: number;
    total_assets: number;
    assets_compliant: number;
    asset_compliance_percentage: number;
    critical_gaps: number;
    medium_gaps: number;
    low_gaps: number;
    gap_details: {
        description: string;
        severity: 'CRITICAL' | 'MEDIUM' | 'LOW';
        affected_count: number;
    }[];
    department_breakdown: {
        department: string;
        compliance_score: number;
        policies_count: number;
        controls_assigned: number;
        assets_managed: number;
    }[];
    compliance_trend: {
        date: string;
        score: number;
        policies_score: number;
        controls_score: number;
        assets_score: number;
    }[];
    projected_score_next_period: number;
    projected_days_to_excellent: number;
    trend_direction: 'IMPROVING' | 'STABLE' | 'DECLINING';
    executive_summary: string;
    key_findings: string;
    recommendations: string;
    is_final: boolean;
    is_archived: boolean;
    created_by: User;
    created_by_id: string;
    created_at: Date;
    updated_at: Date;
    generated_at: Date;
}
