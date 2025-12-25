import { EscalationChainStatus } from '../entities/alert-escalation-chain.entity';
export declare class EscalationRuleDto {
    level: number;
    delayMinutes: number;
    roles: string[];
    workflowId?: string;
    notifyChannels: ('email' | 'sms' | 'in_app')[];
    description?: string;
}
export declare class CreateEscalationChainDto {
    alertId: string;
    alertRuleId?: string;
    escalationRules: EscalationRuleDto[];
    escalationNotes?: string;
}
export declare class EscalationHistoryDto {
    level: number;
    escalatedAt: Date;
    escalatedToRoles: string[];
    escalatedToUsers?: string[];
    workflowTriggered?: string;
    notificationsSent?: Array<{
        channel: 'email' | 'sms' | 'in_app';
        recipients: string[];
        sentAt: Date;
    }>;
}
export declare class EscalationChainDto {
    id: string;
    alertId: string;
    status: EscalationChainStatus;
    currentLevel: number;
    maxLevels: number;
    nextEscalationAt?: Date;
    escalationHistory: EscalationHistoryDto[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class EscalateAlertDto {
    notes?: string;
}
export declare class ResolveEscalationChainDto {
    resolutionNotes: string;
}
export declare class EscalationStatisticsDto {
    activeChains: number;
    pendingEscalations: number;
    escalatedAlerts: number;
    averageEscalationLevels: number;
}
