import { User } from '../../users/entities/user.entity';
export declare enum AlertSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum AlertStatus {
    ACTIVE = "active",
    ACKNOWLEDGED = "acknowledged",
    RESOLVED = "resolved",
    DISMISSED = "dismissed"
}
export declare enum AlertType {
    POLICY_REVIEW_OVERDUE = "policy_review_overdue",
    CONTROL_ASSESSMENT_PAST_DUE = "control_assessment_past_due",
    SOP_EXECUTION_FAILURE = "sop_execution_failure",
    AUDIT_FINDING = "audit_finding",
    COMPLIANCE_VIOLATION = "compliance_violation",
    RISK_THRESHOLD_EXCEEDED = "risk_threshold_exceeded",
    CUSTOM = "custom"
}
export declare class Alert {
    id: string;
    title: string;
    description: string;
    type: AlertType;
    severity: AlertSeverity;
    status: AlertStatus;
    metadata: Record<string, any>;
    relatedEntityId: string;
    relatedEntityType: string;
    createdById: string;
    createdBy: User;
    acknowledgedById: string;
    acknowledgedBy: User;
    acknowledgedAt: Date;
    resolvedById: string;
    resolvedBy: User;
    resolvedAt: Date;
    resolutionNotes: string;
    createdAt: Date;
    updatedAt: Date;
}
