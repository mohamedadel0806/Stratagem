import { AlertingService } from '../services/alerting.service';
import { AlertRuleService } from '../services/alert-rule.service';
import { CreateAlertDto, CreateAlertRuleDto, UpdateAlertRuleDto, AlertDto, AlertRuleDto } from '../dto/alert.dto';
import { AlertSeverity, AlertStatus, AlertType } from '../entities/alert.entity';
export declare class AlertingController {
    private readonly alertingService;
    private readonly alertRuleService;
    constructor(alertingService: AlertingService, alertRuleService: AlertRuleService);
    createAlert(dto: CreateAlertDto, req: any): Promise<AlertDto>;
    getAlerts(status?: AlertStatus, severity?: AlertSeverity, type?: AlertType, search?: string, page?: string, limit?: string): Promise<{
        alerts: AlertDto[];
        total: number;
    }>;
    getAlert(id: string): Promise<AlertDto>;
    getRecentCriticalAlerts(limit?: string): Promise<AlertDto[]>;
    acknowledgeAlert(id: string, req: any): Promise<AlertDto>;
    resolveAlert(id: string, body: {
        resolutionNotes?: string;
    }, req: any): Promise<AlertDto>;
    dismissAlert(id: string): Promise<AlertDto>;
    markAllAlertsAsAcknowledged(req: any): Promise<{
        updated: number;
    }>;
    deleteAlert(id: string): Promise<{
        deleted: boolean;
    }>;
    getAlertStatistics(): Promise<any>;
    createAlertRule(dto: CreateAlertRuleDto, req: any): Promise<AlertRuleDto>;
    getAlertRules(search?: string, page?: string, limit?: string): Promise<{
        rules: AlertRuleDto[];
        total: number;
    }>;
    getAlertRule(id: string): Promise<AlertRuleDto>;
    updateAlertRule(id: string, dto: UpdateAlertRuleDto): Promise<AlertRuleDto>;
    toggleAlertRule(id: string, body: {
        isActive: boolean;
    }): Promise<AlertRuleDto>;
    deleteAlertRule(id: string): Promise<{
        deleted: boolean;
    }>;
    testAlertRule(id: string): Promise<any>;
    getAlertRuleStatistics(): Promise<any>;
}
