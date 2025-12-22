import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Alert, AlertSeverity, AlertStatus, AlertType } from '../entities/alert.entity';
import { AlertRule, AlertRuleTriggerType, AlertRuleCondition } from '../entities/alert-rule.entity';
import { AlertSubscription, NotificationChannel, NotificationFrequency } from '../entities/alert-subscription.entity';
import { AlertLog, AlertLogAction } from '../entities/alert-log.entity';
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

@Injectable()
export class AlertingService {
  private readonly logger = new Logger(AlertingService.name);

  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    @InjectRepository(AlertRule)
    private alertRuleRepository: Repository<AlertRule>,
    @InjectRepository(AlertSubscription)
    private alertSubscriptionRepository: Repository<AlertSubscription>,
    @InjectRepository(AlertLog)
    private alertLogRepository: Repository<AlertLog>,
    private dashboardEmailService: DashboardEmailService,
  ) {}

  // Alert Management
  async createAlert(dto: CreateAlertDto, userId: string): Promise<Alert> {
    const alert = this.alertRepository.create({
      ...dto,
      status: AlertStatus.ACTIVE,
      createdById: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedAlert = await this.alertRepository.save(alert);

    // Log alert creation
    await this.logAlertAction(savedAlert.id, AlertLogAction.CREATED, 'Alert created');

    // Trigger notifications
    await this.notifySubscribers(savedAlert);

    return savedAlert;
  }

  async getAlerts(
    status?: AlertStatus,
    severity?: AlertSeverity,
    limit: number = 50,
    offset: number = 0,
  ): Promise<[Alert[], number]> {
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

  async getAlertById(id: string): Promise<Alert> {
    const alert = await this.alertRepository.findOne({
      where: { id },
    });

    if (!alert) {
      throw new Error(`Alert with ID ${id} not found`);
    }

    return alert;
  }

  async acknowledgeAlert(id: string, userId: string): Promise<Alert> {
    const alert = await this.getAlertById(id);

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedAt = new Date();
    alert.acknowledgedById = userId;
    alert.updatedAt = new Date();

    const updatedAlert = await this.alertRepository.save(alert);

    // Log acknowledgment
    await this.logAlertAction(id, AlertLogAction.ACKNOWLEDGED, `Alert acknowledged by user ${userId}`);

    return updatedAlert;
  }

  async resolveAlert(id: string, userId: string, resolution?: string): Promise<Alert> {
    const alert = await this.getAlertById(id);

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedAt = new Date();
    alert.resolvedById = userId;
    alert.resolutionNotes = resolution;
    alert.updatedAt = new Date();

    const updatedAlert = await this.alertRepository.save(alert);

    // Log resolution
    await this.logAlertAction(id, AlertLogAction.RESOLVED, `Alert resolved by user ${userId}`);

    return updatedAlert;
  }

  // Alert Rule Management
  async createAlertRule(dto: CreateAlertRuleDto): Promise<AlertRule> {
    const rule = this.alertRuleRepository.create({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.alertRuleRepository.save(rule);
  }

  async getAlertRules(isActive?: boolean): Promise<AlertRule[]> {
    const query = this.alertRuleRepository.createQueryBuilder('rule');

    if (isActive !== undefined) {
      query.andWhere('rule.isActive = :isActive', { isActive });
    }

    return query.orderBy('rule.createdAt', 'DESC').getMany();
  }

  async updateAlertRule(id: string, dto: Partial<CreateAlertRuleDto>): Promise<AlertRule> {
    const rule = await this.alertRuleRepository.findOne({ where: { id } });

    if (!rule) {
      throw new Error(`Alert rule with ID ${id} not found`);
    }

    Object.assign(rule, dto, { updatedAt: new Date() });

    return this.alertRuleRepository.save(rule);
  }

  async deleteAlertRule(id: string): Promise<void> {
    const result = await this.alertRuleRepository.delete(id);

    if (result.affected === 0) {
      throw new Error(`Alert rule with ID ${id} not found`);
    }
  }

  // Alert Subscription Management
  async createAlertSubscription(dto: CreateAlertSubscriptionDto): Promise<AlertSubscription> {
    const subscription = this.alertSubscriptionRepository.create({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.alertSubscriptionRepository.save(subscription);
  }

  async getUserSubscriptions(userId: string): Promise<AlertSubscription[]> {
    return this.alertSubscriptionRepository.find({
      where: { userId },
      relations: ['rule'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateAlertSubscription(id: string, dto: Partial<CreateAlertSubscriptionDto>): Promise<AlertSubscription> {
    const subscription = await this.alertSubscriptionRepository.findOne({ where: { id } });

    if (!subscription) {
      throw new Error(`Alert subscription with ID ${id} not found`);
    }

    Object.assign(subscription, dto, { updatedAt: new Date() });

    return this.alertSubscriptionRepository.save(subscription);
  }

  async deleteAlertSubscription(id: string): Promise<void> {
    const result = await this.alertSubscriptionRepository.delete(id);

    if (result.affected === 0) {
      throw new Error(`Alert subscription with ID ${id} not found`);
    }
  }

  // Rule Evaluation Engine
  async evaluateAlertRules(): Promise<void> {
    this.logger.log('Starting alert rule evaluation');

    const enabledRules = await this.getAlertRules(true);

    for (const rule of enabledRules) {
      try {
        await this.evaluateRule(rule);
      } catch (error) {
        this.logger.error(`Error evaluating rule ${rule.id}: ${error.message}`);
      }
    }

    this.logger.log('Alert rule evaluation completed');
  }

  private async evaluateRule(rule: AlertRule): Promise<void> {
    // This is a simplified evaluation engine
    // In a real implementation, this would evaluate specific conditions
    // based on the rule's triggerType, entityType, fieldName, and condition

    let shouldTrigger = false;
    let alertData: Partial<CreateAlertDto> = {
      title: rule.name,
      description: rule.alertMessage || rule.description || 'Alert triggered by rule evaluation',
      type: this.mapRuleToAlertType(rule),
      severity: this.mapSeverityScoreToSeverity(rule.severityScore),
    };

    // Simple evaluation based on rule type - this would be much more sophisticated
    switch (rule.triggerType) {
      case AlertRuleTriggerType.TIME_BASED:
        shouldTrigger = await this.checkTimeBasedRule(rule);
        break;

      case AlertRuleTriggerType.THRESHOLD_BASED:
        shouldTrigger = await this.checkThresholdBasedRule(rule);
        break;

      case AlertRuleTriggerType.STATUS_CHANGE:
        shouldTrigger = await this.checkStatusChangeRule(rule);
        break;

      case AlertRuleTriggerType.CUSTOM_CONDITION:
        shouldTrigger = await this.checkCustomConditionRule(rule);
        break;

      default:
        this.logger.warn(`Unknown alert rule trigger type: ${rule.triggerType}`);
        return;
    }

    if (shouldTrigger) {
      // Check if similar alert already exists and is active
      const existingAlert = await this.alertRepository.findOne({
        where: {
          relatedEntityId: rule.id, // Link to the rule that triggered it
          relatedEntityType: 'alert_rule',
          status: In([AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED]),
          createdAt: MoreThan(new Date(Date.now() - 24 * 60 * 60 * 1000)), // Last 24 hours
        },
      });

      if (!existingAlert) {
        await this.createAlert(alertData as CreateAlertDto, 'system');
        this.logger.log(`Alert triggered for rule: ${rule.name}`);
      }
    }
  }

  private mapRuleToAlertType(rule: AlertRule): AlertType {
    // Map rule entity type to alert type
    switch (rule.entityType.toLowerCase()) {
      case 'policy':
        return AlertType.POLICY_REVIEW_OVERDUE;
      case 'control':
        return AlertType.CONTROL_ASSESSMENT_PAST_DUE;
      case 'sop':
        return AlertType.SOP_EXECUTION_FAILURE;
      case 'audit':
        return AlertType.AUDIT_FINDING;
      case 'compliance':
        return AlertType.COMPLIANCE_VIOLATION;
      case 'risk':
        return AlertType.RISK_THRESHOLD_EXCEEDED;
      default:
        return AlertType.CUSTOM;
    }
  }

  private mapSeverityScoreToSeverity(score: number): AlertSeverity {
    if (score >= 4) return AlertSeverity.CRITICAL;
    if (score >= 3) return AlertSeverity.HIGH;
    if (score >= 2) return AlertSeverity.MEDIUM;
    return AlertSeverity.LOW;
  }

  // Placeholder methods for rule evaluation - these would be implemented based on specific business logic
  private async checkTimeBasedRule(rule: AlertRule): Promise<boolean> {
    // Implementation would check time-based conditions
    return false;
  }

  private async checkThresholdBasedRule(rule: AlertRule): Promise<boolean> {
    // Implementation would check threshold-based conditions
    return false;
  }

  private async checkStatusChangeRule(rule: AlertRule): Promise<boolean> {
    // Implementation would check status change conditions
    return false;
  }

  private async checkCustomConditionRule(rule: AlertRule): Promise<boolean> {
    // Implementation would check custom conditions
    return false;
  }

  // Notification System
  private async notifySubscribers(alert: Alert): Promise<void> {
    const subscriptions = await this.alertSubscriptionRepository.find({
      where: {
        isActive: true,
      },
      relations: ['user'],
    });

    for (const subscription of subscriptions) {
      // Check if subscription matches the alert type and severity
      if (subscription.alertType && subscription.alertType !== alert.type) {
        continue;
      }

      if (subscription.severity && subscription.severity !== alert.severity) {
        continue;
      }

      try {
        await this.sendNotification(subscription, alert);
      } catch (error) {
        this.logger.error(`Failed to send notification to user ${subscription.userId}: ${error.message}`);
      }
    }
  }

  private async sendNotification(subscription: AlertSubscription, alert: Alert): Promise<void> {
    const channels = subscription.channels;

    if (channels.includes(NotificationChannel.EMAIL)) {
      await this.sendEmailNotification(subscription.userId, alert);
    }

    if (channels.includes(NotificationChannel.IN_APP)) {
      // In-app notification would be handled by a separate service
      this.logger.log(`In-app notification sent to user ${subscription.userId} for alert ${alert.id}`);
    }

    if (channels.includes(NotificationChannel.SLACK)) {
      // Slack notification would be handled by a separate service
      this.logger.log(`Slack notification sent to user ${subscription.userId} for alert ${alert.id}`);
    }
  }

  private async sendEmailNotification(userId: string, alert: Alert): Promise<void> {
    // This would integrate with the existing email service
    // For now, we'll use the dashboard email service as a placeholder
    try {
      // Get user email - this would come from a user service
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

      // This is a placeholder - actual email sending would be implemented
      this.logger.log(`Email notification sent to ${userEmail} for alert ${alert.id}`);
    } catch (error) {
      this.logger.error(`Failed to send email notification: ${error.message}`);
    }
  }

  private async getUserEmail(userId: string): Promise<string> {
    // This would query the user service to get the email
    // For now, return a placeholder
    return `user${userId}@example.com`;
  }

  // Logging
  private async logAlertAction(alertId: string, action: AlertLogAction, details: string): Promise<void> {
    const log = this.alertLogRepository.create({
      alertId,
      action,
      details,
      createdAt: new Date(),
    });

    await this.alertLogRepository.save(log);
  }

  // Scheduled rule evaluation - runs every 5 minutes
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleScheduledRuleEvaluation(): Promise<void> {
    await this.evaluateAlertRules();
  }

  // Clean up old resolved alerts - runs daily
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldAlerts(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.alertRepository.delete({
      status: AlertStatus.RESOLVED,
      resolvedAt: LessThan(thirtyDaysAgo),
    });

    this.logger.log(`Cleaned up ${result.affected} old resolved alerts`);
  }
}