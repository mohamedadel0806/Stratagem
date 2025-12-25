import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert, AlertSeverity, AlertStatus, AlertType } from '../entities/alert.entity';
import { AlertRule, AlertRuleTriggerType, AlertRuleCondition } from '../entities/alert-rule.entity';
import { AlertingService } from './alerting.service';
import { CreateAlertDto } from '../dto/alert.dto';

/**
 * AlertRuleService
 * Handles alert rule management and evaluation logic for automated alert generation
 */
@Injectable()
export class AlertRuleService {
  private readonly logger = new Logger(AlertRuleService.name);

  constructor(
    @InjectRepository(AlertRule)
    private readonly alertRuleRepository: Repository<AlertRule>,
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    private readonly alertingService: AlertingService,
  ) {}

  // ============================================================================
  // RULE EVALUATION METHODS
  // ============================================================================

  /**
   * Evaluate all active rules against a data entity
   * Used to determine if an alert should be generated
   */
  async evaluateEntity(
    entityType: string,
    entityData: Record<string, any>,
    entityId: string,
  ): Promise<Alert[]> {
    this.logger.log(`Evaluating rules for entity type: ${entityType}, ID: ${entityId}`);

    // Get all active rules for this entity type
    const rules = await this.alertRuleRepository.find({
      where: { entityType, isActive: true },
    });

    const generatedAlerts: Alert[] = [];

    for (const rule of rules) {
      const shouldAlert = this.evaluateRule(rule, entityData);

      if (shouldAlert) {
        this.logger.log(
          `Rule ${rule.id} (${rule.name}) matched for entity ${entityId}`,
        );

        // Generate alert from matched rule
        const alert = await this.createAlertFromRule(rule, entityId, entityType, entityData);
        generatedAlerts.push(alert);
      }
    }

    return generatedAlerts;
  }

  /**
   * Evaluate a single rule against entity data
   */
  private evaluateRule(
    rule: AlertRule,
    entityData: Record<string, any>,
  ): boolean {
    switch (rule.triggerType) {
      case AlertRuleTriggerType.TIME_BASED:
        return this.evaluateTimeBased(rule, entityData);

      case AlertRuleTriggerType.THRESHOLD_BASED:
        return this.evaluateThresholdBased(rule, entityData);

      case AlertRuleTriggerType.STATUS_CHANGE:
        return this.evaluateStatusChange(rule, entityData);

      case AlertRuleTriggerType.CUSTOM_CONDITION:
        return this.evaluateCustomCondition(rule, entityData);

      default:
        this.logger.warn(`Unknown trigger type: ${rule.triggerType}`);
        return false;
    }
  }

  /**
   * Evaluate time-based triggers (e.g., overdue dates)
   */
  private evaluateTimeBased(rule: AlertRule, entityData: Record<string, any>): boolean {
    if (!rule.fieldName) return false;

    const fieldValue = entityData[rule.fieldName];
    if (!fieldValue) return false;

    const targetDate = new Date(fieldValue);
    const now = new Date();
    const daysOverdue = (now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24);

    // Check if overdue
    if (daysOverdue > 0) {
      // If threshold is set, check if it exceeds the threshold
      if (rule.thresholdValue !== null && rule.thresholdValue !== undefined) {
        return daysOverdue >= rule.thresholdValue;
      }
      return true; // Any overdue item triggers if no threshold
    }

    return false;
  }

  /**
   * Evaluate threshold-based triggers (e.g., risk scores, percentages)
   */
  private evaluateThresholdBased(rule: AlertRule, entityData: Record<string, any>): boolean {
    if (!rule.fieldName || rule.thresholdValue === null || rule.thresholdValue === undefined) {
      return false;
    }

    const fieldValue = entityData[rule.fieldName];
    if (fieldValue === null || fieldValue === undefined) return false;

    const numValue = Number(fieldValue);
    const threshold = Number(rule.thresholdValue);

    // Default to greater than, but check condition if specified
    if (rule.condition === AlertRuleCondition.GREATER_THAN) {
      return numValue > threshold;
    } else if (rule.condition === AlertRuleCondition.LESS_THAN) {
      return numValue < threshold;
    } else if (rule.condition === AlertRuleCondition.EQUALS) {
      return numValue === threshold;
    }

    // Default: threshold exceeded
    return numValue >= threshold;
  }

  /**
   * Evaluate status change triggers
   */
  private evaluateStatusChange(rule: AlertRule, entityData: Record<string, any>): boolean {
    if (!rule.fieldName || !rule.conditionValue) return false;

    const fieldValue = entityData[rule.fieldName];
    if (fieldValue === null || fieldValue === undefined) return false;

    return String(fieldValue).toLowerCase() === String(rule.conditionValue).toLowerCase();
  }

  /**
   * Evaluate custom conditions using the condition operator
   */
  private evaluateCustomCondition(rule: AlertRule, entityData: Record<string, any>): boolean {
    if (!rule.fieldName) return false;

    const fieldValue = entityData[rule.fieldName];
    const conditionValue = rule.conditionValue;

    return this.evaluateCondition(fieldValue, rule.condition, conditionValue);
  }

  /**
   * Core condition evaluation logic
   */
  private evaluateCondition(
    fieldValue: any,
    condition: AlertRuleCondition,
    conditionValue: string | number | null,
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
        return String(fieldValue).includes(String(conditionValue || ''));

      case AlertRuleCondition.NOT_CONTAINS:
        return !String(fieldValue).includes(String(conditionValue || ''));

      case AlertRuleCondition.IS_NULL:
        return fieldValue === null || fieldValue === undefined;

      case AlertRuleCondition.IS_NOT_NULL:
        return fieldValue !== null && fieldValue !== undefined;

      case AlertRuleCondition.DAYS_OVERDUE:
        if (!fieldValue) return false;
        const daysOverdue =
          (new Date().getTime() - new Date(fieldValue).getTime()) / (1000 * 60 * 60 * 24);
        return daysOverdue > Number(conditionValue || 0);

      case AlertRuleCondition.STATUS_EQUALS:
        return String(fieldValue).toLowerCase() === String(conditionValue || '').toLowerCase();

      default:
        return false;
    }
  }

  // ============================================================================
  // ALERT GENERATION FROM RULES
  // ============================================================================

  /**
   * Create an alert from a matched rule
   */
  private async createAlertFromRule(
    rule: AlertRule,
    entityId: string,
    entityType: string,
    entityData: Record<string, any>,
  ): Promise<Alert> {
    // Determine alert severity based on rule and data
    const severity = this.determineSeverity(rule);

    // Generate alert message
    const title = this.generateAlertTitle(rule, entityData);
    const description = this.generateAlertDescription(rule, entityData);

    // Determine alert type
    const alertType = this.determineAlertType(rule, entityData);

    // Check if similar alert already exists
    const existingAlert = await this.checkExistingAlert(
      entityId,
      entityType,
      alertType,
    );

    if (existingAlert) {
      this.logger.log(`Similar alert already exists for entity ${entityId}`);
      return existingAlert;
    }

    // Create new alert
    const createAlertDto: CreateAlertDto = {
      title,
      description,
      type: alertType,
      severity,
      relatedEntityId: entityId,
      relatedEntityType: entityType,
      metadata: {
        ruleId: rule.id,
        ruleName: rule.name,
        triggerType: rule.triggerType,
        evaluatedFields: entityData,
      },
    };

    // Create alert (system user: null)
    const alert = this.alertRepository.create({
      ...createAlertDto,
      createdById: null, // System-generated
      status: AlertStatus.ACTIVE,
    });

    const saved = await this.alertRepository.save(alert);
    this.logger.log(`Generated alert ${saved.id} from rule ${rule.id}`);

    return saved;
  }

  /**
   * Determine alert severity based on rule configuration
   */
  private determineSeverity(rule: AlertRule): AlertSeverity {
    const score = rule.severityScore || 1;

    if (score >= 4) return AlertSeverity.CRITICAL;
    if (score === 3) return AlertSeverity.HIGH;
    if (score === 2) return AlertSeverity.MEDIUM;
    return AlertSeverity.LOW;
  }

  /**
   * Determine alert type based on rule and entity type
   */
  private determineAlertType(
    rule: AlertRule,
    entityData: Record<string, any>,
  ): AlertType {
    const entityType = rule.entityType?.toLowerCase() || '';

    // Map entity types to alert types
    if (entityType.includes('policy') || entityType.includes('review')) {
      return AlertType.POLICY_REVIEW_OVERDUE;
    }

    if (entityType.includes('control') || entityType.includes('assessment')) {
      return AlertType.CONTROL_ASSESSMENT_PAST_DUE;
    }

    if (entityType.includes('sop') || entityType.includes('procedure')) {
      return AlertType.SOP_EXECUTION_FAILURE;
    }

    if (entityType.includes('audit') || entityType.includes('finding')) {
      return AlertType.AUDIT_FINDING;
    }

    if (entityType.includes('compliance') || entityType.includes('violation')) {
      return AlertType.COMPLIANCE_VIOLATION;
    }

    if (entityType.includes('risk') || entityType.includes('threat')) {
      return AlertType.RISK_THRESHOLD_EXCEEDED;
    }

    return AlertType.CUSTOM;
  }

  /**
   * Generate alert title from rule
   */
  private generateAlertTitle(rule: AlertRule, entityData: Record<string, any>): string {
    if (rule.alertMessage) {
      return this.interpolateMessage(rule.alertMessage, entityData);
    }

    // Default titles based on entity type
    const entityType = rule.entityType?.toLowerCase() || 'item';
    const fieldName = rule.fieldName || 'field';

    switch (rule.triggerType) {
      case AlertRuleTriggerType.TIME_BASED:
        return `${entityType} is overdue (${fieldName})`;

      case AlertRuleTriggerType.THRESHOLD_BASED:
        return `${entityType} threshold exceeded (${fieldName})`;

      case AlertRuleTriggerType.STATUS_CHANGE:
        return `${entityType} status changed to ${rule.conditionValue}`;

      default:
        return `Alert: ${rule.name}`;
    }
  }

  /**
   * Generate alert description from rule
   */
  private generateAlertDescription(rule: AlertRule, entityData: Record<string, any>): string {
    const fieldName = rule.fieldName || 'field';
    const fieldValue = entityData[fieldName] || 'unknown';

    switch (rule.triggerType) {
      case AlertRuleTriggerType.TIME_BASED:
        const daysOverdue = this.calculateDaysOverdue(fieldValue);
        return `This item is overdue by ${daysOverdue} days. Please take immediate action.`;

      case AlertRuleTriggerType.THRESHOLD_BASED:
        return `The threshold has been exceeded. Current value: ${fieldValue}. Threshold: ${rule.thresholdValue}`;

      case AlertRuleTriggerType.STATUS_CHANGE:
        return `${rule.name}: Current status is ${rule.conditionValue}`;

      default:
        return rule.description || `Alert triggered: ${rule.name}`;
    }
  }

  /**
   * Check if a similar alert already exists to prevent duplicates
   */
  private async checkExistingAlert(
    entityId: string,
    entityType: string,
    alertType: AlertType,
  ): Promise<Alert | null> {
    const existing = await this.alertRepository.findOne({
      where: {
        relatedEntityId: entityId,
        relatedEntityType: entityType,
        type: alertType,
        status: AlertStatus.ACTIVE,
      },
    });

    return existing || null;
  }

  /**
   * Utility: Calculate days overdue
   */
  private calculateDaysOverdue(dateValue: any): number {
    if (!dateValue) return 0;

    const date = new Date(dateValue);
    const now = new Date();
    const daysOverdue = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    return Math.max(0, daysOverdue);
  }

  /**
   * Utility: Simple message interpolation
   * e.g., "Policy {{name}} is overdue" with {name: "Security"} → "Policy Security is overdue"
   */
  private interpolateMessage(message: string, data: Record<string, any>): string {
    return message.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return String(data[key] || match);
    });
  }

  // ============================================================================
  // BATCH OPERATIONS
  // ============================================================================

  /**
   * Evaluate all entities of a given type against their rules
   * Used in scheduled evaluation runs
   */
  async evaluateBatch(
    entityType: string,
    entities: Array<{ id: string; data: Record<string, any> }>,
  ): Promise<{
    processed: number;
    alertsGenerated: number;
    errors: number;
  }> {
    this.logger.log(`Starting batch evaluation for ${entities.length} ${entityType} entities`);

    let alertsGenerated = 0;
    let errors = 0;

    for (const entity of entities) {
      try {
        const alerts = await this.evaluateEntity(entityType, entity.data, entity.id);
        alertsGenerated += alerts.length;
      } catch (error) {
        this.logger.error(
          `Error evaluating entity ${entity.id}: ${error instanceof Error ? error.message : String(error)}`,
        );
        errors++;
      }
    }

    this.logger.log(
      `Batch evaluation complete: ${alertsGenerated} alerts generated, ${errors} errors`,
    );

    return {
      processed: entities.length,
      alertsGenerated,
      errors,
    };
  }

  /**
   * Resolve old alerts when conditions are met
   */
  async autoResolveAlerts(entityId: string, entityType: string): Promise<number> {
    const activeAlerts = await this.alertRepository.find({
      where: {
        relatedEntityId: entityId,
        relatedEntityType: entityType,
        status: AlertStatus.ACTIVE,
      },
    });

    let resolvedCount = 0;

    for (const alert of activeAlerts) {
      // Check if the condition is still valid
      // If not, mark as resolved
      alert.status = AlertStatus.RESOLVED;
      alert.resolutionNotes = 'Auto-resolved: triggering condition no longer exists';
      await this.alertRepository.save(alert);
      resolvedCount++;
    }

    if (resolvedCount > 0) {
      this.logger.log(`Auto-resolved ${resolvedCount} alerts for entity ${entityId}`);
    }

    return resolvedCount;
  }

  /**
   * Cleanup old dismissed/resolved alerts (optional)
   */
  async cleanupOldAlerts(daysOld: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.alertRepository.delete({
      status: AlertStatus.DISMISSED,
      updatedAt: cutoffDate,
    });

    this.logger.log(`Cleaned up ${result.affected || 0} old dismissed alerts`);

    return result.affected || 0;
  }
}
