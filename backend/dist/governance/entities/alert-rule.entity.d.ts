import { User } from '../../users/entities/user.entity';
export declare enum AlertRuleTriggerType {
    TIME_BASED = "time_based",
    THRESHOLD_BASED = "threshold_based",
    STATUS_CHANGE = "status_change",
    CUSTOM_CONDITION = "custom_condition"
}
export declare enum AlertRuleCondition {
    EQUALS = "equals",
    NOT_EQUALS = "not_equals",
    GREATER_THAN = "greater_than",
    LESS_THAN = "less_than",
    CONTAINS = "contains",
    NOT_CONTAINS = "not_contains",
    IS_NULL = "is_null",
    IS_NOT_NULL = "is_not_null",
    DAYS_OVERDUE = "days_overdue",
    STATUS_EQUALS = "status_equals"
}
export declare class AlertRule {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    triggerType: AlertRuleTriggerType;
    entityType: string;
    fieldName: string;
    condition: AlertRuleCondition;
    conditionValue: string;
    thresholdValue: number;
    severityScore: number;
    alertMessage: string;
    filters: Record<string, any>;
    createdById: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
