import { User } from '../../../users/entities/user.entity';
import { SOP } from './sop.entity';
export declare enum StepStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    SKIPPED = "skipped",
    FAILED = "failed"
}
export declare class SOPStep {
    id: string;
    sop_id: string;
    sop: SOP;
    step_number: number;
    title: string;
    description: string;
    expected_outcome: string;
    responsible_role: string;
    estimated_duration_minutes: number | null;
    notes: string;
    required_evidence: string[] | null;
    is_critical: boolean;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
