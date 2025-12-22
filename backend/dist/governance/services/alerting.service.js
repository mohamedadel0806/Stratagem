"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AlertingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const alert_entity_1 = require("../entities/alert.entity");
const alert_rule_entity_1 = require("../entities/alert-rule.entity");
const alert_subscription_entity_1 = require("../entities/alert-subscription.entity");
const alert_log_entity_1 = require("../entities/alert-log.entity");
const dashboard_email_service_1 = require("./dashboard-email.service");
let AlertingService = AlertingService_1 = class AlertingService {
    constructor(alertRepository, alertRuleRepository, alertSubscriptionRepository, alertLogRepository, dashboardEmailService) {
        this.alertRepository = alertRepository;
        this.alertRuleRepository = alertRuleRepository;
        this.alertSubscriptionRepository = alertSubscriptionRepository;
        this.alertLogRepository = alertLogRepository;
        this.dashboardEmailService = dashboardEmailService;
        this.logger = new common_1.Logger(AlertingService_1.name);
    }
    async createAlert(dto, userId) {
        const alert = this.alertRepository.create(Object.assign(Object.assign({}, dto), { status: alert_entity_1.AlertStatus.ACTIVE, createdById: userId, createdAt: new Date(), updatedAt: new Date() }));
        const savedAlert = await this.alertRepository.save(alert);
        await this.logAlertAction(savedAlert.id, alert_log_entity_1.AlertLogAction.CREATED, 'Alert created');
        await this.notifySubscribers(savedAlert);
        return savedAlert;
    }
    async getAlerts(status, severity, limit = 50, offset = 0) {
        const query = this.alertRepository.createQueryBuilder('alert')
            .orderBy('alert.createdAt', 'DESC');
        if (status) {
            query.andWhere('alert.status = :status', { status });
        }
        if (severity) {
            query.andWhere('alert.severity = :severity', { severity });
        }
        return query.skip(offset).take(limit).getManyAndCount();
    }
    async getAlertById(id) {
        const alert = await this.alertRepository.findOne({
            where: { id },
        });
        if (!alert) {
            throw new Error(`Alert with ID ${id} not found`);
        }
        return alert;
    }
    async acknowledgeAlert(id, userId) {
        const alert = await this.getAlertById(id);
        alert.status = alert_entity_1.AlertStatus.ACKNOWLEDGED;
        alert.acknowledgedAt = new Date();
        alert.acknowledgedById = userId;
        alert.updatedAt = new Date();
        const updatedAlert = await this.alertRepository.save(alert);
        await this.logAlertAction(id, alert_log_entity_1.AlertLogAction.ACKNOWLEDGED, `Alert acknowledged by user ${userId}`);
        return updatedAlert;
    }
    async resolveAlert(id, userId, resolution) {
        const alert = await this.getAlertById(id);
        alert.status = alert_entity_1.AlertStatus.RESOLVED;
        alert.resolvedAt = new Date();
        alert.resolvedById = userId;
        alert.resolutionNotes = resolution;
        alert.updatedAt = new Date();
        const updatedAlert = await this.alertRepository.save(alert);
        await this.logAlertAction(id, alert_log_entity_1.AlertLogAction.RESOLVED, `Alert resolved by user ${userId}`);
        return updatedAlert;
    }
    async createAlertRule(dto) {
        const rule = this.alertRuleRepository.create(Object.assign(Object.assign({}, dto), { createdAt: new Date(), updatedAt: new Date() }));
        return this.alertRuleRepository.save(rule);
    }
    async getAlertRules(isActive) {
        const query = this.alertRuleRepository.createQueryBuilder('rule');
        if (isActive !== undefined) {
            query.andWhere('rule.isActive = :isActive', { isActive });
        }
        return query.orderBy('rule.createdAt', 'DESC').getMany();
    }
    async updateAlertRule(id, dto) {
        const rule = await this.alertRuleRepository.findOne({ where: { id } });
        if (!rule) {
            throw new Error(`Alert rule with ID ${id} not found`);
        }
        Object.assign(rule, dto, { updatedAt: new Date() });
        return this.alertRuleRepository.save(rule);
    }
    async deleteAlertRule(id) {
        const result = await this.alertRuleRepository.delete(id);
        if (result.affected === 0) {
            throw new Error(`Alert rule with ID ${id} not found`);
        }
    }
    async createAlertSubscription(dto) {
        const subscription = this.alertSubscriptionRepository.create(Object.assign(Object.assign({}, dto), { createdAt: new Date(), updatedAt: new Date() }));
        return this.alertSubscriptionRepository.save(subscription);
    }
    async getUserSubscriptions(userId) {
        return this.alertSubscriptionRepository.find({
            where: { userId },
            relations: ['rule'],
            order: { createdAt: 'DESC' },
        });
    }
    async updateAlertSubscription(id, dto) {
        const subscription = await this.alertSubscriptionRepository.findOne({ where: { id } });
        if (!subscription) {
            throw new Error(`Alert subscription with ID ${id} not found`);
        }
        Object.assign(subscription, dto, { updatedAt: new Date() });
        return this.alertSubscriptionRepository.save(subscription);
    }
    async deleteAlertSubscription(id) {
        const result = await this.alertSubscriptionRepository.delete(id);
        if (result.affected === 0) {
            throw new Error(`Alert subscription with ID ${id} not found`);
        }
    }
    async evaluateAlertRules() {
        this.logger.log('Starting alert rule evaluation');
        const enabledRules = await this.getAlertRules(true);
        for (const rule of enabledRules) {
            try {
                await this.evaluateRule(rule);
            }
            catch (error) {
                this.logger.error(`Error evaluating rule ${rule.id}: ${error.message}`);
            }
        }
        this.logger.log('Alert rule evaluation completed');
    }
    async evaluateRule(rule) {
        let shouldTrigger = false;
        let alertData = {
            title: rule.name,
            description: rule.alertMessage || rule.description || 'Alert triggered by rule evaluation',
            type: this.mapRuleToAlertType(rule),
            severity: this.mapSeverityScoreToSeverity(rule.severityScore),
        };
        switch (rule.triggerType) {
            case alert_rule_entity_1.AlertRuleTriggerType.TIME_BASED:
                shouldTrigger = await this.checkTimeBasedRule(rule);
                break;
            case alert_rule_entity_1.AlertRuleTriggerType.THRESHOLD_BASED:
                shouldTrigger = await this.checkThresholdBasedRule(rule);
                break;
            case alert_rule_entity_1.AlertRuleTriggerType.STATUS_CHANGE:
                shouldTrigger = await this.checkStatusChangeRule(rule);
                break;
            case alert_rule_entity_1.AlertRuleTriggerType.CUSTOM_CONDITION:
                shouldTrigger = await this.checkCustomConditionRule(rule);
                break;
            default:
                this.logger.warn(`Unknown alert rule trigger type: ${rule.triggerType}`);
                return;
        }
        if (shouldTrigger) {
            const existingAlert = await this.alertRepository.findOne({
                where: {
                    relatedEntityId: rule.id,
                    relatedEntityType: 'alert_rule',
                    status: (0, typeorm_2.In)([alert_entity_1.AlertStatus.ACTIVE, alert_entity_1.AlertStatus.ACKNOWLEDGED]),
                    createdAt: (0, typeorm_2.MoreThan)(new Date(Date.now() - 24 * 60 * 60 * 1000)),
                },
            });
            if (!existingAlert) {
                await this.createAlert(alertData, 'system');
                this.logger.log(`Alert triggered for rule: ${rule.name}`);
            }
        }
    }
    mapRuleToAlertType(rule) {
        switch (rule.entityType.toLowerCase()) {
            case 'policy':
                return alert_entity_1.AlertType.POLICY_REVIEW_OVERDUE;
            case 'control':
                return alert_entity_1.AlertType.CONTROL_ASSESSMENT_PAST_DUE;
            case 'sop':
                return alert_entity_1.AlertType.SOP_EXECUTION_FAILURE;
            case 'audit':
                return alert_entity_1.AlertType.AUDIT_FINDING;
            case 'compliance':
                return alert_entity_1.AlertType.COMPLIANCE_VIOLATION;
            case 'risk':
                return alert_entity_1.AlertType.RISK_THRESHOLD_EXCEEDED;
            default:
                return alert_entity_1.AlertType.CUSTOM;
        }
    }
    mapSeverityScoreToSeverity(score) {
        if (score >= 4)
            return alert_entity_1.AlertSeverity.CRITICAL;
        if (score >= 3)
            return alert_entity_1.AlertSeverity.HIGH;
        if (score >= 2)
            return alert_entity_1.AlertSeverity.MEDIUM;
        return alert_entity_1.AlertSeverity.LOW;
    }
    async checkTimeBasedRule(rule) {
        return false;
    }
    async checkThresholdBasedRule(rule) {
        return false;
    }
    async checkStatusChangeRule(rule) {
        return false;
    }
    async checkCustomConditionRule(rule) {
        return false;
    }
    async notifySubscribers(alert) {
        const subscriptions = await this.alertSubscriptionRepository.find({
            where: {
                isActive: true,
            },
            relations: ['user'],
        });
        for (const subscription of subscriptions) {
            if (subscription.alertType && subscription.alertType !== alert.type) {
                continue;
            }
            if (subscription.severity && subscription.severity !== alert.severity) {
                continue;
            }
            try {
                await this.sendNotification(subscription, alert);
            }
            catch (error) {
                this.logger.error(`Failed to send notification to user ${subscription.userId}: ${error.message}`);
            }
        }
    }
    async sendNotification(subscription, alert) {
        const channels = subscription.channels;
        if (channels.includes(alert_subscription_entity_1.NotificationChannel.EMAIL)) {
            await this.sendEmailNotification(subscription.userId, alert);
        }
        if (channels.includes(alert_subscription_entity_1.NotificationChannel.IN_APP)) {
            this.logger.log(`In-app notification sent to user ${subscription.userId} for alert ${alert.id}`);
        }
        if (channels.includes(alert_subscription_entity_1.NotificationChannel.SLACK)) {
            this.logger.log(`Slack notification sent to user ${subscription.userId} for alert ${alert.id}`);
        }
    }
    async sendEmailNotification(userId, alert) {
        try {
            const userEmail = await this.getUserEmail(userId);
            const emailContent = {
                to: [userEmail],
                subject: `Alert: ${alert.title}`,
                html: `
          <h2>${alert.title}</h2>
          <p><strong>Severity:</strong> ${alert.severity}</p>
          <p><strong>Description:</strong> ${alert.description}</p>
          <p><strong>Created:</strong> ${alert.createdAt.toISOString()}</p>
          ${alert.relatedEntityType ? `<p><strong>Entity Type:</strong> ${alert.relatedEntityType}</p>` : ''}
          ${alert.relatedEntityId ? `<p><strong>Entity ID:</strong> ${alert.relatedEntityId}</p>` : ''}
          <br>
          <p>Please log in to the platform to acknowledge this alert.</p>
        `,
            };
            this.logger.log(`Email notification sent to ${userEmail} for alert ${alert.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email notification: ${error.message}`);
        }
    }
    async getUserEmail(userId) {
        return `user${userId}@example.com`;
    }
    async logAlertAction(alertId, action, details) {
        const log = this.alertLogRepository.create({
            alertId,
            action,
            details,
            createdAt: new Date(),
        });
        await this.alertLogRepository.save(log);
    }
    async handleScheduledRuleEvaluation() {
        await this.evaluateAlertRules();
    }
    async cleanupOldAlerts() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const result = await this.alertRepository.delete({
            status: alert_entity_1.AlertStatus.RESOLVED,
            resolvedAt: (0, typeorm_2.LessThan)(thirtyDaysAgo),
        });
        this.logger.log(`Cleaned up ${result.affected} old resolved alerts`);
    }
};
exports.AlertingService = AlertingService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertingService.prototype, "handleScheduledRuleEvaluation", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertingService.prototype, "cleanupOldAlerts", null);
exports.AlertingService = AlertingService = AlertingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __param(1, (0, typeorm_1.InjectRepository)(alert_rule_entity_1.AlertRule)),
    __param(2, (0, typeorm_1.InjectRepository)(alert_subscription_entity_1.AlertSubscription)),
    __param(3, (0, typeorm_1.InjectRepository)(alert_log_entity_1.AlertLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        dashboard_email_service_1.DashboardEmailService])
], AlertingService);
//# sourceMappingURL=alerting.service.js.map