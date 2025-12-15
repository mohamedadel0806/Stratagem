import { Risk } from './risk.entity';
import { User } from '../../users/entities/user.entity';
import { TreatmentTask } from './treatment-task.entity';
export declare enum TreatmentStrategy {
    MITIGATE = "mitigate",
    TRANSFER = "transfer",
    AVOID = "avoid",
    ACCEPT = "accept"
}
export declare enum TreatmentStatus {
    PLANNED = "planned",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    DEFERRED = "deferred",
    CANCELLED = "cancelled"
}
export declare enum TreatmentPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare class RiskTreatment {
    id: string;
    treatment_id: string;
    risk_id: string;
    risk: Risk;
    strategy: TreatmentStrategy;
    title: string;
    description: string;
    treatment_owner_id: string;
    treatment_owner: User;
    status: TreatmentStatus;
    priority: TreatmentPriority;
    start_date: Date;
    target_completion_date: Date;
    actual_completion_date: Date;
    estimated_cost: number;
    actual_cost: number;
    expected_risk_reduction: string;
    residual_likelihood: number;
    residual_impact: number;
    residual_risk_score: number;
    progress_percentage: number;
    progress_notes: string;
    implementation_notes: string;
    linked_control_ids: string[];
    attachments: Record<string, any>[];
    tasks: TreatmentTask[];
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
