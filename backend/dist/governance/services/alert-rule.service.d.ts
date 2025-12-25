import { Repository } from 'typeorm';
import { Alert } from '../entities/alert.entity';
import { AlertRule } from '../entities/alert-rule.entity';
import { AlertingService } from './alerting.service';
export declare class AlertRuleService {
    private readonly alertRuleRepository;
    private readonly alertRepository;
    private readonly alertingService;
    private readonly logger;
    constructor(alertRuleRepository: Repository<AlertRule>, alertRepository: Repository<Alert>, alertingService: AlertingService);
    evaluateEntity(entityType: string, entityData: Record<string, any>, entityId: string): Promise<Alert[]>;
    private evaluateRule;
    private evaluateTimeBased;
    private evaluateThresholdBased;
    private evaluateStatusChange;
    private evaluateCustomCondition;
    private evaluateCondition;
    private createAlertFromRule;
    private determineSeverity;
    private determineAlertType;
    private generateAlertTitle;
    private generateAlertDescription;
    private checkExistingAlert;
    private calculateDaysOverdue;
    private interpolateMessage;
    evaluateBatch(entityType: string, entities: Array<{
        id: string;
        data: Record<string, any>;
    }>): Promise<{
        processed: number;
        alertsGenerated: number;
        errors: number;
    }>;
    autoResolveAlerts(entityId: string, entityType: string): Promise<number>;
    cleanupOldAlerts(daysOld?: number): Promise<number>;
}
