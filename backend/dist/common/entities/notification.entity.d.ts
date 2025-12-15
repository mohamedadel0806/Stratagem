import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    WORKFLOW_APPROVAL_REQUIRED = "workflow_approval_required",
    WORKFLOW_APPROVED = "workflow_approved",
    WORKFLOW_REJECTED = "workflow_rejected",
    WORKFLOW_COMPLETED = "workflow_completed",
    TASK_ASSIGNED = "task_assigned",
    TASK_DUE_SOON = "task_due_soon",
    DEADLINE_APPROACHING = "deadline_approaching",
    DEADLINE_PASSED = "deadline_passed",
    RISK_ESCALATED = "risk_escalated",
    POLICY_REVIEW_REQUIRED = "policy_review_required",
    GENERAL = "general"
}
export declare enum NotificationPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class Notification {
    id: string;
    userId: string;
    user: User;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    isRead: boolean;
    entityType: string;
    entityId: string;
    actionUrl: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    readAt: Date;
}
