import { User } from '../../../users/entities/user.entity';
export declare enum ControlType {
    PREVENTIVE = "preventive",
    DETECTIVE = "detective",
    CORRECTIVE = "corrective",
    COMPENSATING = "compensating",
    ADMINISTRATIVE = "administrative",
    TECHNICAL = "technical",
    PHYSICAL = "physical"
}
export declare enum ControlComplexity {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare enum ControlCostImpact {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare enum ControlStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    DEPRECATED = "deprecated"
}
export declare enum ImplementationStatus {
    NOT_IMPLEMENTED = "not_implemented",
    PLANNED = "planned",
    IN_PROGRESS = "in_progress",
    IMPLEMENTED = "implemented",
    NOT_APPLICABLE = "not_applicable"
}
export declare class UnifiedControl {
    id: string;
    control_identifier: string;
    title: string;
    description: string;
    control_type: ControlType;
    control_category: string;
    domain: string;
    complexity: ControlComplexity;
    cost_impact: ControlCostImpact;
    status: ControlStatus;
    implementation_status: ImplementationStatus;
    control_owner_id: string;
    control_owner: User;
    control_procedures: string;
    testing_procedures: string;
    tags: string[];
    custom_fields: Record<string, any>;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
