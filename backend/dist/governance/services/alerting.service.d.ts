import { Repository } from 'typeorm';
import { Alert, AlertSeverity, AlertStatus, AlertType } from '../entities/alert.entity';
import { AlertRule, AlertRuleTriggerType, AlertRuleCondition } from '../entities/alert-rule.entity';
import { AlertSubscription, NotificationChannel, NotificationFrequency } from '../entities/alert-subscription.entity';
import { AlertLog } from '../entities/alert-log.entity';
import { DashboardEmailService } from './dashboard-email.service';
export interface CreateAlertDto {
    title: string;
    description: string;
    type: AlertType;
    severity: AlertSeverity;
    relatedEntityId?: string;
    relatedEntityType?: string;
    metadata?: Record<string, any>;
}
export interface CreateAlertRuleDto {
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
export interface CreateAlertSubscriptionDto {
    userId: string;
    alertType?: AlertType;
    severity?: AlertSeverity;
    channels: NotificationChannel[];
    frequency?: NotificationFrequency;
    isActive: boolean;
    filters?: Record<string, any>;
}
export declare class AlertingService {
    private alertRepository;
    private alertRuleRepository;
    private alertSubscriptionRepository;
    private alertLogRepository;
    private dashboardEmailService;
    private readonly logger;
    constructor(alertRepository: Repository<Alert>, alertRuleRepository: Repository<AlertRule>, alertSubscriptionRepository: Repository<AlertSubscription>, alertLogRepository: Repository<AlertLog>, dashboardEmailService: DashboardEmailService);
    createAlert(dto: CreateAlertDto, userId: string): Promise<Alert>;
    getAlerts(status?: AlertStatus, severity?: AlertSeverity, limit?: number, offset?: number): Promise<[Alert[], number]>;
    getAlertById(id: string): Promise<Alert>;
    acknowledgeAlert(id: string, userId: string): Promise<Alert>;
    resolveAlert(id: string, userId: string, resolution?: string): Promise<Alert>;
    createAlertRule(dto: CreateAlertRuleDto): Promise<AlertRule>;
    getAlertRules(isActive?: boolean): Promise<AlertRule[]>;
    updateAlertRule(id: string, dto: Partial<CreateAlertRuleDto>): Promise<AlertRule>;
    deleteAlertRule(id: string): Promise<void>;
    createAlertSubscription(dto: CreateAlertSubscriptionDto): Promise<AlertSubscription>;
    getUserSubscriptions(userId: string): Promise<AlertSubscription[]>;
    updateAlertSubscription(id: string, dto: Partial<CreateAlertSubscriptionDto>): Promise<AlertSubscription>;
    deleteAlertSubscription(id: string): Promise<void>;
    evaluateAlertRules(): Promise<void>;
    private evaluateRule;
    private mapRuleToAlertType;
    private mapSeverityScoreToSeverity;
    private checkTimeBasedRule;
    private checkThresholdBasedRule;
    private checkStatusChangeRule;
    private checkCustomConditionRule;
    private notifySubscribers;
    private sendNotification;
    private sendEmailNotification;
    private getUserEmail;
    private logAlertAction;
    handleScheduledRuleEvaluation(): Promise<void>;
    cleanupOldAlerts(): Promise<void>;
}
