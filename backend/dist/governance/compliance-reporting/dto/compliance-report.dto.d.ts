import { ReportPeriod, ComplianceScore } from '../entities/compliance-report.entity';
export declare class CreateComplianceReportDto {
    report_name?: string;
    report_period: ReportPeriod;
    period_start_date: string;
    period_end_date: string;
}
export declare class ComplianceReportFilterDto {
    report_period?: ReportPeriod;
    start_date?: string;
    end_date?: string;
    rating?: ComplianceScore;
    skip?: number;
    take?: number;
}
export declare class ComplianceReportDto {
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
    gap_details?: any[];
    department_breakdown?: any[];
    compliance_trend?: any[];
    projected_score_next_period?: number;
    projected_days_to_excellent?: number;
    trend_direction?: 'IMPROVING' | 'STABLE' | 'DECLINING';
    executive_summary?: string;
    key_findings?: string;
    recommendations?: string;
    is_final: boolean;
    is_archived: boolean;
    created_at: Date;
    generated_at?: Date;
}
export declare class ComplianceDashboardDto {
    overall_score: number;
    overall_rating: ComplianceScore;
    policies: {
        total: number;
        published: number;
        acknowledged: number;
        acknowledgment_rate: number;
    };
    controls: {
        total: number;
        implemented: number;
        partial: number;
        not_implemented: number;
        effectiveness: number;
    };
    assets: {
        total: number;
        compliant: number;
        compliance_percentage: number;
    };
    gaps: {
        critical: number;
        medium: number;
        low: number;
    };
    trend: {
        direction: string;
        projected_score: number;
        days_to_excellent: number;
    };
}
export declare class ComplianceTrendDto {
    date: string;
    overall_score: number;
    policies_score: number;
    controls_score: number;
    assets_score: number;
}
export declare class DepartmentComplianceDto {
    department: string;
    compliance_score: number;
    policies_count: number;
    controls_assigned: number;
    assets_managed: number;
    rating: ComplianceScore;
}
