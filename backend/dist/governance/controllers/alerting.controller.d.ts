import { AlertingService, CreateAlertDto, CreateAlertRuleDto, CreateAlertSubscriptionDto } from '../services/alerting.service';
import { Alert, AlertSeverity, AlertStatus } from '../entities/alert.entity';
import { AlertRule } from '../entities/alert-rule.entity';
import { AlertSubscription } from '../entities/alert-subscription.entity';
import { AlertLog } from '../entities/alert-log.entity';
export declare class AlertingController {
    private readonly alertingService;
    constructor(alertingService: AlertingService);
    createAlert(dto: CreateAlertDto, req: any): Promise<Alert>;
    getAlerts(status?: AlertStatus, severity?: AlertSeverity, limit?: string, offset?: string): Promise<{
        alerts: Alert[];
        total: number;
    }>;
    getAlertById(id: string): Promise<Alert>;
    acknowledgeAlert(id: string, req: any): Promise<Alert>;
    resolveAlert(id: string, body: {
        resolution?: string;
    }, req: any): Promise<Alert>;
    createAlertRule(dto: CreateAlertRuleDto): Promise<AlertRule>;
    getAlertRules(isActive?: boolean): Promise<AlertRule[]>;
    updateAlertRule(id: string, dto: Partial<CreateAlertRuleDto>): Promise<AlertRule>;
    deleteAlertRule(id: string): Promise<void>;
    createAlertSubscription(dto: CreateAlertSubscriptionDto): Promise<AlertSubscription>;
    getUserSubscriptions(userId: string): Promise<AlertSubscription[]>;
    updateAlertSubscription(id: string, dto: Partial<CreateAlertSubscriptionDto>): Promise<AlertSubscription>;
    deleteAlertSubscription(id: string): Promise<void>;
    getAlertLogs(alertId: string): Promise<AlertLog[]>;
    evaluateAlertRules(): Promise<{
        message: string;
    }>;
}
