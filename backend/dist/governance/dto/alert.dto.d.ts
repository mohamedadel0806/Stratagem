import { AlertSeverity, AlertStatus, AlertType } from '../entities/alert.entity';
import { AlertRuleTriggerType, AlertRuleCondition } from '../entities/alert-rule.entity';
import { NotificationChannel, NotificationFrequency } from '../entities/alert-subscription.entity';
export declare class CreateAlertDto {
    title: string;
    description: string;
    type: AlertType;
    severity: AlertSeverity;
    relatedEntityId?: string;
    relatedEntityType?: string;
    metadata?: Record<string, any>;
}
export declare class UpdateAlertDto {
    status?: AlertStatus;
    resolution?: string;
}
export declare class AlertDto {
    id: string;
    title: string;
    description: string;
    type: AlertType;
    severity: AlertSeverity;
    status: AlertStatus;
    relatedEntityId?: string;
    relatedEntityType?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    acknowledgedAt?: Date;
    acknowledgedById?: string;
    resolvedAt?: Date;
    resolvedById?: string;
    resolutionNotes?: string;
}
export declare class AlertConditionDto {
    field: string;
    operator: string;
    value: any;
    logic?: string;
}
export declare class CreateAlertRuleDto {
    name: string;
    description?: string;
    isActive: boolean;
    triggerType: AlertRuleTriggerType;
    entityType: string;
    fieldName?: string;
    condition: AlertRuleCondition;
    conditionValue?: string;
    thresholdValue?: number;
    severityScore: number;
    alertMessage?: string;
    filters?: Record<string, any>;
}
export declare class UpdateAlertRuleDto {
    name?: string;
    description?: string;
    isActive?: boolean;
    triggerType?: AlertRuleTriggerType;
    entityType?: string;
    fieldName?: string;
    condition?: AlertRuleCondition;
    conditionValue?: string;
    thresholdValue?: number;
    severityScore?: number;
    alertMessage?: string;
    filters?: Record<string, any>;
}
export declare class AlertRuleDto {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    triggerType: AlertRuleTriggerType;
    entityType: string;
    fieldName?: string;
    condition: AlertRuleCondition;
    conditionValue?: string;
    thresholdValue?: number;
    severityScore: number;
    alertMessage?: string;
    filters?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CreateAlertSubscriptionDto {
    userId: string;
    alertType?: AlertType;
    severity?: AlertSeverity;
    channels: NotificationChannel[];
    frequency?: NotificationFrequency;
    isActive: boolean;
    filters?: Record<string, any>;
}
export declare class UpdateAlertSubscriptionDto {
    ruleId?: string;
    severityLevels?: AlertSeverity[];
    notificationChannels?: string[];
    enabled?: boolean;
}
export declare class AlertSubscriptionDto {
    id: string;
    userId: string;
    alertType?: AlertType;
    severity?: AlertSeverity;
    channels: NotificationChannel[];
    frequency: NotificationFrequency;
    isActive: boolean;
    filters?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AlertLogDto {
    id: string;
    alertId: string;
    action: string;
    details: string;
    timestamp: Date;
}
