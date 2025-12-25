import { Repository } from 'typeorm';
import { Alert, AlertSeverity, AlertStatus, AlertType } from '../entities/alert.entity';
import { AlertRule, AlertRuleCondition } from '../entities/alert-rule.entity';
import { User } from '../../users/entities/user.entity';
import { CreateAlertDto, AlertDto, CreateAlertRuleDto, UpdateAlertRuleDto, AlertRuleDto } from '../dto/alert.dto';
import { AlertEscalationService } from './alert-escalation.service';
interface AlertFilterParams {
    page?: number;
    limit?: number;
    status?: AlertStatus;
    severity?: AlertSeverity;
    type?: AlertType;
    search?: string;
}
interface AlertStatistics {
    active: number;
    acknowledged: number;
    resolved: number;
    dismissed: number;
    total: number;
    by_severity: Record<AlertSeverity, number>;
    by_type: Record<AlertType, number>;
}
export declare class AlertingService {
    private readonly alertRepository;
    private readonly alertRuleRepository;
    private readonly userRepository;
    private readonly escalationService;
    private readonly logger;
    constructor(alertRepository: Repository<Alert>, alertRuleRepository: Repository<AlertRule>, userRepository: Repository<User>, escalationService: AlertEscalationService);
    createAlert(createAlertDto: CreateAlertDto, userId: string): Promise<AlertDto>;
    getAlert(id: string): Promise<AlertDto>;
    getAlerts(params?: AlertFilterParams): Promise<{
        alerts: AlertDto[];
        total: number;
    }>;
    getRecentCriticalAlerts(limit?: number): Promise<AlertDto[]>;
    acknowledgeAlert(id: string, userId: string): Promise<AlertDto>;
    resolveAlert(id: string, userId: string, resolutionNotes?: string): Promise<AlertDto>;
    dismissAlert(id: string): Promise<AlertDto>;
    markAllAlertsAsAcknowledged(userId: string): Promise<{
        updated: number;
    }>;
    deleteAlert(id: string): Promise<{
        deleted: boolean;
    }>;
    getAlertStatistics(): Promise<AlertStatistics>;
    createAlertRule(createRuleDto: CreateAlertRuleDto, userId: string): Promise<AlertRuleDto>;
    getAlertRule(id: string): Promise<AlertRuleDto>;
    getAlertRules(params?: AlertFilterParams): Promise<{
        rules: AlertRuleDto[];
        total: number;
    }>;
    updateAlertRule(id: string, updateRuleDto: UpdateAlertRuleDto): Promise<AlertRuleDto>;
    toggleAlertRule(id: string, isActive: boolean): Promise<AlertRuleDto>;
    deleteAlertRule(id: string): Promise<{
        deleted: boolean;
    }>;
    getAlertRuleStatistics(): Promise<{
        total: number;
        active: number;
        inactive: number;
    }>;
    testAlertRule(ruleId: string): Promise<{
        matches: number;
        sampleMatches: Array<{
            id: string;
            reason: string;
        }>;
    }>;
    private mapAlertToDto;
    private mapAlertRuleToDto;
    evaluateCondition(fieldValue: any, condition: AlertRuleCondition, conditionValue: string | number): boolean;
}
export {};
