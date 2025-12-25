import { Alert } from './alert.entity';
import { AlertRule } from './alert-rule.entity';
import { User } from '../../users/entities/user.entity';
export declare enum EscalationChainStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    ESCALATED = "escalated",
    RESOLVED = "resolved",
    CANCELLED = "cancelled"
}
export interface EscalationRule {
    level: number;
    delayMinutes: number;
    roles: string[];
    workflowId?: string;
    notifyChannels: ('email' | 'sms' | 'in_app')[];
    description?: string;
}
export declare class AlertEscalationChain {
    id: string;
    alertId: string;
    alert: Alert;
    alertRuleId: string;
    alertRule: AlertRule;
    status: EscalationChainStatus;
    currentLevel: number;
    maxLevels: number;
    escalationRules: EscalationRule[];
    nextEscalationAt: Date;
    escalationHistory: Array<{
        level: number;
        escalatedAt: Date;
        escalatedToRoles: string[];
        escalatedToUsers?: string[];
        workflowTriggered?: string;
        notificationsSent?: {
            channel: 'email' | 'sms' | 'in_app';
            recipients: string[];
            sentAt: Date;
        }[];
    }>;
    workflowExecutionId: string;
    escalationNotes: string;
    resolvedById: string;
    resolvedBy: User;
    resolvedAt: Date;
    createdById: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
