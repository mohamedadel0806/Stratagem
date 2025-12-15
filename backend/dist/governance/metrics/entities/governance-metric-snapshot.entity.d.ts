export declare class GovernanceMetricSnapshot {
    id: string;
    snapshot_date: string;
    compliance_rate: number;
    implemented_controls: number;
    total_controls: number;
    open_findings: number;
    critical_findings: number;
    assessment_completion_rate: number;
    risk_closure_rate: number;
    completed_assessments: number;
    total_assessments: number;
    approved_evidence: number;
    metadata?: Record<string, any>;
    created_at: Date;
    updated_at: Date;
}
