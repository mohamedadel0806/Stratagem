import { Repository } from 'typeorm';
import { AlertEscalationChain, EscalationChainStatus, EscalationRule } from '../entities/alert-escalation-chain.entity';
import { Alert, AlertSeverity } from '../entities/alert.entity';
import { AlertRule } from '../entities/alert-rule.entity';
import { Workflow } from '../../workflow/entities/workflow.entity';
import { User } from '../../users/entities/user.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
interface CreateEscalationChainDto {
    alertId: string;
    alertRuleId?: string;
    escalationRules: EscalationRule[];
    escalationNotes?: string;
}
interface EscalationChainDto {
    id: string;
    alertId: string;
    status: EscalationChainStatus;
    currentLevel: number;
    maxLevels: number;
    nextEscalationAt: Date;
    escalationHistory: any[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class AlertEscalationService {
    private readonly escalationRepository;
    private readonly alertRepository;
    private readonly alertRuleRepository;
    private readonly workflowRepository;
    private readonly userRepository;
    private readonly schedulerRegistry;
    private readonly logger;
    constructor(escalationRepository: Repository<AlertEscalationChain>, alertRepository: Repository<Alert>, alertRuleRepository: Repository<AlertRule>, workflowRepository: Repository<Workflow>, userRepository: Repository<User>, schedulerRegistry: SchedulerRegistry);
    createEscalationChain(createDto: CreateEscalationChainDto, userId: string): Promise<EscalationChainDto>;
    getEscalationChain(id: string): Promise<EscalationChainDto>;
    getAlertEscalationChains(alertId: string): Promise<EscalationChainDto[]>;
    getActiveEscalationChains(): Promise<EscalationChainDto[]>;
    escalateAlert(chainId: string, escalatedById: string): Promise<EscalationChainDto>;
    resolveEscalationChain(chainId: string, resolutionNotes: string, resolvedById: string): Promise<EscalationChainDto>;
    cancelEscalationChain(chainId: string, cancelledById: string): Promise<EscalationChainDto>;
    getEscalationChainsBySeverity(severity: AlertSeverity): Promise<EscalationChainDto[]>;
    getEscalationStatistics(): Promise<{
        activeChains: number;
        pendingEscalations: number;
        escalatedAlerts: number;
        averageEscalationLevels: number;
    }>;
    private scheduleNextEscalation;
    private cancelScheduledEscalation;
    private triggerEscalationWorkflow;
    private mapChainToDto;
}
export {};
