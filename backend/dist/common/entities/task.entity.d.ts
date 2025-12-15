import { User } from '../../users/entities/user.entity';
export declare enum TaskPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    REVIEW = "review",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum TaskType {
    POLICY_REVIEW = "policy_review",
    RISK_MITIGATION = "risk_mitigation",
    COMPLIANCE_REQUIREMENT = "compliance_requirement",
    AUDIT = "audit",
    VENDOR_ASSESSMENT = "vendor_assessment"
}
export declare class Task {
    id: string;
    title: string;
    description: string;
    taskType: TaskType;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: Date;
    assignedToId: string;
    assignedTo: User;
    relatedEntityType: string;
    relatedEntityId: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
}
