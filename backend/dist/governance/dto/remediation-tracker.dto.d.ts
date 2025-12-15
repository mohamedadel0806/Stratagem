import { RemediationPriority } from '../findings/entities/remediation-tracker.entity';
export declare class RemediationTrackerDto {
    id: string;
    finding_id: string;
    finding_identifier: string;
    finding_title: string;
    remediation_priority: RemediationPriority;
    sla_due_date: string;
    remediation_steps?: string;
    assigned_to_id?: string;
    assigned_to_name?: string;
    progress_percent: number;
    progress_notes?: string;
    completion_date?: string;
    sla_met: boolean;
    days_to_completion?: number;
    days_until_due?: number;
    status: 'on_track' | 'at_risk' | 'overdue' | 'completed';
    created_at: string;
    updated_at: string;
}
export declare class RemediationDashboardDto {
    total_open_findings: number;
    findings_on_track: number;
    findings_at_risk: number;
    findings_overdue: number;
    average_days_to_completion: number;
    sla_compliance_rate: number;
    critical_findings: RemediationTrackerDto[];
    overdue_findings: RemediationTrackerDto[];
    upcoming_due: RemediationTrackerDto[];
}
export declare class CreateRemediationTrackerDto {
    finding_id: string;
    remediation_priority?: RemediationPriority;
    sla_due_date: string;
    remediation_steps?: string;
    assigned_to_id?: string;
}
export declare class UpdateRemediationTrackerDto {
    remediation_priority?: RemediationPriority;
    progress_percent?: number;
    progress_notes?: string;
    remediation_steps?: string;
    assigned_to_id?: string;
}
export declare class CompleteRemediationDto {
    completion_notes: string;
    completion_evidence?: Record<string, any>;
}
