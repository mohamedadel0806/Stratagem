import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, In } from 'typeorm';
import { Alert, AlertSeverity, AlertStatus, AlertType } from '../entities/alert.entity';
import { AlertRule, AlertRuleTriggerType, AlertRuleCondition } from '../entities/alert-rule.entity';
import { User } from '../../users/entities/user.entity';
import {
  CreateAlertDto,
  UpdateAlertDto,
  AlertDto,
  CreateAlertRuleDto,
  UpdateAlertRuleDto,
  AlertRuleDto,
} from '../dto/alert.dto';
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

@Injectable()
export class AlertingService {
  private readonly logger = new Logger(AlertingService.name);

  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(AlertRule)
    private readonly alertRuleRepository: Repository<AlertRule>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly escalationService: AlertEscalationService,
  ) {}

  // ============================================================================
  // ALERT MANAGEMENT METHODS
  // ============================================================================

  /**
   * Create a new alert
   */
  async createAlert(createAlertDto: CreateAlertDto, userId: string): Promise<AlertDto> {
    this.logger.log(`Creating alert: ${createAlertDto.title}`);

    const creator = await this.userRepository.findOne({ where: { id: userId } });
    if (!creator) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const alert = this.alertRepository.create({
      ...createAlertDto,
      createdById: userId,
      status: AlertStatus.ACTIVE,
    });

    const saved = await this.alertRepository.save(alert);

    // Auto-escalate critical alerts
    if (saved.severity === AlertSeverity.CRITICAL) {
      try {
        const escalationChain = await this.escalationService.createEscalationChain(
          {
            alertId: saved.id,
            escalationRules: [
              {
                level: 1,
                delayMinutes: 15, // Escalate to manager if not acknowledged in 15 min
                roles: ['manager'],
                notifyChannels: ['email', 'in_app'],
                description: 'Escalate critical alert to manager',
              },
              {
                level: 2,
                delayMinutes: 30, // Escalate to CISO if still unresolved in 30 min
                roles: ['ciso'],
                notifyChannels: ['email', 'sms', 'in_app'],
                description: 'Escalate critical alert to CISO',
              },
            ],
            escalationNotes: `Auto-escalation created for ${saved.severity} alert`,
          },
          userId,
        );

        // Update alert to link to escalation chain
        saved.escalationChainId = escalationChain.id;
        saved.hasEscalation = true;
        await this.alertRepository.save(saved);

        this.logger.log(`Created auto-escalation chain ${escalationChain.id} for critical alert ${saved.id}`);
      } catch (err) {
        this.logger.error(`Failed to create escalation chain for alert ${saved.id}: ${err.message}`);
        // Continue without escalation - it's not critical to alert creation
      }
    }

    return this.mapAlertToDto(saved);
  }

  /**
   * Get a single alert by ID
   */
  async getAlert(id: string): Promise<AlertDto> {
    const alert = await this.alertRepository.findOne({
      where: { id },
      relations: ['createdBy', 'acknowledgedBy', 'resolvedBy'],
    });

    if (!alert) {
      throw new NotFoundException(`Alert ${id} not found`);
    }

    return this.mapAlertToDto(alert);
  }

  /**
   * Get all alerts with pagination and filtering
   */
  async getAlerts(params?: AlertFilterParams): Promise<{ alerts: AlertDto[]; total: number }> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Alert> = {};

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.severity) {
      where.severity = params.severity;
    }

    if (params?.type) {
      where.type = params.type;
    }

    if (params?.search) {
      where.title = ILike(`%${params.search}%`);
    }

    const [alerts, total] = await this.alertRepository.findAndCount({
      where,
      relations: ['createdBy', 'acknowledgedBy', 'resolvedBy'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      alerts: alerts.map(a => this.mapAlertToDto(a)),
      total,
    };
  }

  /**
   * Get recent critical alerts (for widget)
   */
  async getRecentCriticalAlerts(limit: number = 5): Promise<AlertDto[]> {
    const alerts = await this.alertRepository.find({
      where: { status: In([AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED]) },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    // Filter for critical and high severity
    return alerts
      .filter(a => a.severity === AlertSeverity.CRITICAL || a.severity === AlertSeverity.HIGH)
      .slice(0, limit)
      .map(a => this.mapAlertToDto(a));
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(id: string, userId: string): Promise<AlertDto> {
    const alert = await this.alertRepository.findOne({ where: { id } });

    if (!alert) {
      throw new NotFoundException(`Alert ${id} not found`);
    }

    if (alert.status === AlertStatus.RESOLVED || alert.status === AlertStatus.DISMISSED) {
      throw new BadRequestException(`Cannot acknowledge ${alert.status} alert`);
    }

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedById = userId;
    alert.acknowledgedAt = new Date();

    const saved = await this.alertRepository.save(alert);
    this.logger.log(`Alert ${id} acknowledged by user ${userId}`);

    return this.mapAlertToDto(saved);
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(id: string, userId: string, resolutionNotes?: string): Promise<AlertDto> {
    const alert = await this.alertRepository.findOne({ where: { id } });

    if (!alert) {
      throw new NotFoundException(`Alert ${id} not found`);
    }

    if (alert.status === AlertStatus.DISMISSED) {
      throw new BadRequestException('Cannot resolve dismissed alert');
    }

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedById = userId;
    alert.resolvedAt = new Date();
    if (resolutionNotes) {
      alert.resolutionNotes = resolutionNotes;
    }

    const saved = await this.alertRepository.save(alert);

    // Also resolve associated escalation chain
    if (alert.escalationChainId) {
      try {
        await this.escalationService.resolveEscalationChain(alert.escalationChainId, resolutionNotes || 'Alert resolved', userId);
        this.logger.log(`Resolved escalation chain ${alert.escalationChainId} for alert ${id}`);
      } catch (err) {
        this.logger.error(`Failed to resolve escalation chain ${alert.escalationChainId}: ${err.message}`);
        // Continue even if escalation resolution fails
      }
    }

    this.logger.log(`Alert ${id} resolved by user ${userId}`);

    return this.mapAlertToDto(saved);
  }

  /**
   * Dismiss an alert
   */
  async dismissAlert(id: string): Promise<AlertDto> {
    const alert = await this.alertRepository.findOne({ where: { id } });

    if (!alert) {
      throw new NotFoundException(`Alert ${id} not found`);
    }

    alert.status = AlertStatus.DISMISSED;

    const saved = await this.alertRepository.save(alert);
    this.logger.log(`Alert ${id} dismissed`);

    return this.mapAlertToDto(saved);
  }

  /**
   * Mark all active alerts as acknowledged
   */
  async markAllAlertsAsAcknowledged(userId: string): Promise<{ updated: number }> {
    const result = await this.alertRepository.update(
      { status: AlertStatus.ACTIVE },
      {
        status: AlertStatus.ACKNOWLEDGED,
        acknowledgedById: userId,
        acknowledgedAt: new Date(),
      },
    );

    this.logger.log(`Marked ${result.affected || 0} alerts as acknowledged`);

    return { updated: result.affected || 0 };
  }

  /**
   * Delete an alert permanently
   */
  async deleteAlert(id: string): Promise<{ deleted: boolean }> {
    const alert = await this.alertRepository.findOne({ where: { id } });

    if (!alert) {
      throw new NotFoundException(`Alert ${id} not found`);
    }

    await this.alertRepository.remove(alert);
    this.logger.log(`Alert ${id} deleted`);

    return { deleted: true };
  }

  /**
   * Get alert statistics
   */
  async getAlertStatistics(): Promise<AlertStatistics> {
    const alerts = await this.alertRepository.find();

    const stats: AlertStatistics = {
      active: 0,
      acknowledged: 0,
      resolved: 0,
      dismissed: 0,
      total: alerts.length,
      by_severity: {
        [AlertSeverity.LOW]: 0,
        [AlertSeverity.MEDIUM]: 0,
        [AlertSeverity.HIGH]: 0,
        [AlertSeverity.CRITICAL]: 0,
      },
      by_type: {
        [AlertType.POLICY_REVIEW_OVERDUE]: 0,
        [AlertType.CONTROL_ASSESSMENT_PAST_DUE]: 0,
        [AlertType.SOP_EXECUTION_FAILURE]: 0,
        [AlertType.AUDIT_FINDING]: 0,
        [AlertType.COMPLIANCE_VIOLATION]: 0,
        [AlertType.RISK_THRESHOLD_EXCEEDED]: 0,
        [AlertType.CUSTOM]: 0,
      },
    };

    for (const alert of alerts) {
      // Count by status
      if (alert.status === AlertStatus.ACTIVE) stats.active++;
      else if (alert.status === AlertStatus.ACKNOWLEDGED) stats.acknowledged++;
      else if (alert.status === AlertStatus.RESOLVED) stats.resolved++;
      else if (alert.status === AlertStatus.DISMISSED) stats.dismissed++;

      // Count by severity
      stats.by_severity[alert.severity]++;

      // Count by type
      stats.by_type[alert.type]++;
    }

    return stats;
  }

  // ============================================================================
  // ALERT RULE MANAGEMENT METHODS
  // ============================================================================

  /**
   * Create a new alert rule
   */
  async createAlertRule(
    createRuleDto: CreateAlertRuleDto,
    userId: string,
  ): Promise<AlertRuleDto> {
    this.logger.log(`Creating alert rule: ${createRuleDto.name}`);

    const creator = await this.userRepository.findOne({ where: { id: userId } });
    if (!creator) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const rule = this.alertRuleRepository.create({
      ...createRuleDto,
      createdById: userId,
    });

    const saved = await this.alertRuleRepository.save(rule);
    return this.mapAlertRuleToDto(saved);
  }

  /**
   * Get a single alert rule by ID
   */
  async getAlertRule(id: string): Promise<AlertRuleDto> {
    const rule = await this.alertRuleRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!rule) {
      throw new NotFoundException(`Alert rule ${id} not found`);
    }

    return this.mapAlertRuleToDto(rule);
  }

  /**
   * Get all alert rules with pagination and filtering
   */
  async getAlertRules(
    params?: AlertFilterParams,
  ): Promise<{ rules: AlertRuleDto[]; total: number }> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<AlertRule> = {};

    // Filter by active status if provided
    if (params?.status === AlertStatus.ACTIVE) {
      where.isActive = true;
    } else if (params?.status === AlertStatus.ACKNOWLEDGED) {
      where.isActive = false;
    }

    if (params?.search) {
      where.name = ILike(`%${params.search}%`);
    }

    const [rules, total] = await this.alertRuleRepository.findAndCount({
      where,
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      rules: rules.map(r => this.mapAlertRuleToDto(r)),
      total,
    };
  }

  /**
   * Update an alert rule
   */
  async updateAlertRule(
    id: string,
    updateRuleDto: UpdateAlertRuleDto,
  ): Promise<AlertRuleDto> {
    const rule = await this.alertRuleRepository.findOne({ where: { id } });

    if (!rule) {
      throw new NotFoundException(`Alert rule ${id} not found`);
    }

    Object.assign(rule, updateRuleDto);
    const saved = await this.alertRuleRepository.save(rule);

    this.logger.log(`Alert rule ${id} updated`);
    return this.mapAlertRuleToDto(saved);
  }

  /**
   * Toggle alert rule active status
   */
  async toggleAlertRule(id: string, isActive: boolean): Promise<AlertRuleDto> {
    const rule = await this.alertRuleRepository.findOne({ where: { id } });

    if (!rule) {
      throw new NotFoundException(`Alert rule ${id} not found`);
    }

    rule.isActive = isActive;
    const saved = await this.alertRuleRepository.save(rule);

    this.logger.log(`Alert rule ${id} toggled to ${isActive ? 'active' : 'inactive'}`);
    return this.mapAlertRuleToDto(saved);
  }

  /**
   * Delete an alert rule
   */
  async deleteAlertRule(id: string): Promise<{ deleted: boolean }> {
    const rule = await this.alertRuleRepository.findOne({ where: { id } });

    if (!rule) {
      throw new NotFoundException(`Alert rule ${id} not found`);
    }

    await this.alertRuleRepository.remove(rule);
    this.logger.log(`Alert rule ${id} deleted`);

    return { deleted: true };
  }

  /**
   * Get alert rule statistics
   */
  async getAlertRuleStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    const rules = await this.alertRuleRepository.find();

    return {
      total: rules.length,
      active: rules.filter(r => r.isActive).length,
      inactive: rules.filter(r => !r.isActive).length,
    };
  }

  /**
   * Test an alert rule - simulates matching logic
   */
  async testAlertRule(ruleId: string): Promise<{
    matches: number;
    sampleMatches: Array<{ id: string; reason: string }>;
  }> {
    const rule = await this.alertRuleRepository.findOne({ where: { id: ruleId } });

    if (!rule) {
      throw new NotFoundException(`Alert rule ${ruleId} not found`);
    }

    this.logger.log(`Testing alert rule ${ruleId}`);

    // Simulate matching logic - in production this would evaluate against actual data
    const sampleMatches: Array<{ id: string; reason: string }> = [];

    // Example: time-based trigger
    if (rule.triggerType === AlertRuleTriggerType.TIME_BASED) {
      sampleMatches.push({
        id: 'sample-1',
        reason: `Entity overdue by ${rule.thresholdValue || 0} days`,
      });
    }

    // Example: threshold-based trigger
    if (rule.triggerType === AlertRuleTriggerType.THRESHOLD_BASED) {
      sampleMatches.push({
        id: 'sample-2',
        reason: `Value exceeded threshold of ${rule.thresholdValue}`,
      });
    }

    // Example: status change trigger
    if (rule.triggerType === AlertRuleTriggerType.STATUS_CHANGE) {
      sampleMatches.push({
        id: 'sample-3',
        reason: `Entity status changed to ${rule.conditionValue}`,
      });
    }

    return {
      matches: sampleMatches.length,
      sampleMatches,
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Map Alert entity to DTO
   */
  private mapAlertToDto(alert: Alert): AlertDto {
    return {
      id: alert.id,
      title: alert.title,
      description: alert.description,
      type: alert.type,
      severity: alert.severity,
      status: alert.status,
      relatedEntityId: alert.relatedEntityId,
      relatedEntityType: alert.relatedEntityType,
      metadata: alert.metadata,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt,
      acknowledgedAt: alert.acknowledgedAt,
      acknowledgedById: alert.acknowledgedById,
      resolvedAt: alert.resolvedAt,
      resolvedById: alert.resolvedById,
      resolutionNotes: alert.resolutionNotes,
    };
  }

  /**
   * Map AlertRule entity to DTO
   */
  private mapAlertRuleToDto(rule: AlertRule): AlertRuleDto {
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description,
      isActive: rule.isActive,
      triggerType: rule.triggerType,
      entityType: rule.entityType,
      fieldName: rule.fieldName,
      condition: rule.condition,
      conditionValue: rule.conditionValue,
      thresholdValue: rule.thresholdValue,
      severityScore: rule.severityScore,
      alertMessage: rule.alertMessage,
      filters: rule.filters,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    };
  }

  /**
   * Evaluate if data matches a rule condition
   * (Helper for external rule evaluation)
   */
  evaluateCondition(
    fieldValue: any,
    condition: AlertRuleCondition,
    conditionValue: string | number,
  ): boolean {
    switch (condition) {
      case AlertRuleCondition.EQUALS:
        return fieldValue === conditionValue;
      case AlertRuleCondition.NOT_EQUALS:
        return fieldValue !== conditionValue;
      case AlertRuleCondition.GREATER_THAN:
        return Number(fieldValue) > Number(conditionValue);
      case AlertRuleCondition.LESS_THAN:
        return Number(fieldValue) < Number(conditionValue);
      case AlertRuleCondition.CONTAINS:
        return String(fieldValue).includes(String(conditionValue));
      case AlertRuleCondition.NOT_CONTAINS:
        return !String(fieldValue).includes(String(conditionValue));
      case AlertRuleCondition.IS_NULL:
        return fieldValue === null || fieldValue === undefined;
      case AlertRuleCondition.IS_NOT_NULL:
        return fieldValue !== null && fieldValue !== undefined;
      case AlertRuleCondition.DAYS_OVERDUE:
        // Assumes fieldValue is a date, compares days difference
        if (!fieldValue) return false;
        const daysOverdue =
          (new Date().getTime() - new Date(fieldValue).getTime()) / (1000 * 60 * 60 * 24);
        return daysOverdue > Number(conditionValue);
      case AlertRuleCondition.STATUS_EQUALS:
        return String(fieldValue).toLowerCase() === String(conditionValue).toLowerCase();
      default:
        return false;
    }
  }
}
