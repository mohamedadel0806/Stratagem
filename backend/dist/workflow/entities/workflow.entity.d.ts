import { User } from '../../users/entities/user.entity';
export declare enum WorkflowType {
    APPROVAL = "approval",
    NOTIFICATION = "notification",
    ESCALATION = "escalation",
    STATUS_CHANGE = "status_change",
    DEADLINE_REMINDER = "deadline_reminder"
}
export declare enum WorkflowStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ARCHIVED = "archived"
}
export declare enum WorkflowTrigger {
    MANUAL = "manual",
    ON_CREATE = "on_create",
    ON_UPDATE = "on_update",
    ON_STATUS_CHANGE = "on_status_change",
    ON_DEADLINE_APPROACHING = "on_deadline_approaching",
    ON_DEADLINE_PASSED = "on_deadline_passed",
    SCHEDULED = "scheduled"
}
export declare enum EntityType {
    RISK = "risk",
    POLICY = "policy",
    COMPLIANCE_REQUIREMENT = "compliance_requirement",
    TASK = "task",
    SOP = "sop"
}
export declare class Workflow {
    id: string;
    name: string;
    description: string;
    type: WorkflowType;
    status: WorkflowStatus;
    trigger: WorkflowTrigger;
    entityType: EntityType;
    conditions: Record<string, any>;
    actions: Record<string, any>;
    daysBeforeDeadline: number;
    organizationId: string;
    createdById: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
