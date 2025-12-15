import { Finding } from './finding.entity';
import { User } from '../../../users/entities/user.entity';
export declare enum RemediationPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare class RemediationTracker {
    id: string;
    finding_id: string;
    finding: Finding;
    remediation_priority: RemediationPriority;
    sla_due_date: Date;
    remediation_steps: string;
    assigned_to_id: string;
    assigned_to: User;
    progress_percent: number;
    progress_notes: string;
    completion_date: Date;
    sla_met: boolean;
    days_to_completion: number;
    completion_evidence: Record<string, any>;
    completion_notes: string;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
}
