import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsArray, IsBoolean, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AlertSeverity, AlertStatus, AlertType } from '../entities/alert.entity';
import { AlertRuleTriggerType, AlertRuleCondition } from '../entities/alert-rule.entity';
import { NotificationChannel, NotificationFrequency } from '../entities/alert-subscription.entity';
import { AlertLogAction } from '../entities/alert-log.entity';

export class CreateAlertDto {
  @ApiProperty({ description: 'Alert title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Alert description' })
  @IsString()
  description: string;

  @ApiProperty({ enum: AlertType, description: 'Alert type' })
  @IsEnum(AlertType)
  type: AlertType;

  @ApiProperty({ enum: AlertSeverity, description: 'Alert severity level' })
  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @ApiPropertyOptional({ description: 'Related entity ID' })
  @IsOptional()
  @IsString()
  relatedEntityId?: string;

  @ApiPropertyOptional({ description: 'Related entity type' })
  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @ApiPropertyOptional({ description: 'Additional metadata', type: 'object' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateAlertDto {
  @ApiPropertyOptional({ enum: AlertStatus, description: 'Alert status' })
  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;

  @ApiPropertyOptional({ description: 'Resolution notes' })
  @IsOptional()
  @IsString()
  resolution?: string;
}

export class AlertDto {
  @ApiProperty({ description: 'Alert ID' })
  id: string;

  @ApiProperty({ description: 'Alert title' })
  title: string;

  @ApiProperty({ description: 'Alert description' })
  description: string;

  @ApiProperty({ enum: AlertType, description: 'Alert type' })
  type: AlertType;

  @ApiProperty({ enum: AlertSeverity, description: 'Alert severity level' })
  severity: AlertSeverity;

  @ApiProperty({ enum: AlertStatus, description: 'Alert status' })
  status: AlertStatus;

  @ApiPropertyOptional({ description: 'Related entity ID' })
  relatedEntityId?: string;

  @ApiPropertyOptional({ description: 'Related entity type' })
  relatedEntityType?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Acknowledgment timestamp' })
  acknowledgedAt?: Date;

  @ApiPropertyOptional({ description: 'User who acknowledged the alert' })
  acknowledgedById?: string;

  @ApiPropertyOptional({ description: 'Resolution timestamp' })
  resolvedAt?: Date;

  @ApiPropertyOptional({ description: 'User who resolved the alert' })
  resolvedById?: string;

  @ApiPropertyOptional({ description: 'Resolution notes' })
  resolutionNotes?: string;
}

export class AlertConditionDto {
  @ApiProperty({ description: 'Condition field (e.g., status, dueDate, riskLevel)' })
  @IsString()
  field: string;

  @ApiProperty({ description: 'Condition operator (e.g., equals, greaterThan, lessThan)' })
  @IsString()
  operator: string;

  @ApiProperty({ description: 'Condition value' })
  value: any;

  @ApiPropertyOptional({ description: 'Additional condition logic' })
  @IsOptional()
  @IsString()
  logic?: string;
}

export class CreateAlertRuleDto {
  @ApiProperty({ description: 'Rule name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Rule description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Whether the rule is active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ enum: AlertRuleTriggerType, description: 'Rule trigger type' })
  @IsEnum(AlertRuleTriggerType)
  triggerType: AlertRuleTriggerType;

  @ApiProperty({ description: 'Entity type this rule applies to' })
  @IsString()
  entityType: string;

  @ApiPropertyOptional({ description: 'Field name to check' })
  @IsOptional()
  @IsString()
  fieldName?: string;

  @ApiProperty({ enum: AlertRuleCondition, description: 'Condition to evaluate' })
  @IsEnum(AlertRuleCondition)
  condition: AlertRuleCondition;

  @ApiPropertyOptional({ description: 'Condition value to compare against' })
  @IsOptional()
  @IsString()
  conditionValue?: string;

  @ApiPropertyOptional({ description: 'Numeric threshold value' })
  @IsOptional()
  thresholdValue?: number;

  @ApiProperty({ description: 'Severity score (1-4)' })
  severityScore: number;

  @ApiPropertyOptional({ description: 'Alert message template' })
  @IsOptional()
  @IsString()
  alertMessage?: string;

  @ApiPropertyOptional({ description: 'Additional filters', type: 'object' })
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}

export class UpdateAlertRuleDto {
  @ApiPropertyOptional({ description: 'Rule name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Rule description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether the rule is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ enum: AlertRuleTriggerType, description: 'Rule trigger type' })
  @IsOptional()
  @IsEnum(AlertRuleTriggerType)
  triggerType?: AlertRuleTriggerType;

  @ApiPropertyOptional({ description: 'Entity type this rule applies to' })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({ description: 'Field name to check' })
  @IsOptional()
  @IsString()
  fieldName?: string;

  @ApiPropertyOptional({ enum: AlertRuleCondition, description: 'Condition to evaluate' })
  @IsOptional()
  @IsEnum(AlertRuleCondition)
  condition?: AlertRuleCondition;

  @ApiPropertyOptional({ description: 'Condition value to compare against' })
  @IsOptional()
  @IsString()
  conditionValue?: string;

  @ApiPropertyOptional({ description: 'Numeric threshold value' })
  @IsOptional()
  thresholdValue?: number;

  @ApiPropertyOptional({ description: 'Severity score (1-4)' })
  @IsOptional()
  severityScore?: number;

  @ApiPropertyOptional({ description: 'Alert message template' })
  @IsOptional()
  @IsString()
  alertMessage?: string;

  @ApiPropertyOptional({ description: 'Additional filters', type: 'object' })
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}

export class AlertRuleDto {
  @ApiProperty({ description: 'Rule ID' })
  id: string;

  @ApiProperty({ description: 'Rule name' })
  name: string;

  @ApiPropertyOptional({ description: 'Rule description' })
  description?: string;

  @ApiProperty({ description: 'Whether the rule is active' })
  isActive: boolean;

  @ApiProperty({ enum: AlertRuleTriggerType, description: 'Rule trigger type' })
  triggerType: AlertRuleTriggerType;

  @ApiProperty({ description: 'Entity type this rule applies to' })
  entityType: string;

  @ApiPropertyOptional({ description: 'Field name to check' })
  fieldName?: string;

  @ApiProperty({ enum: AlertRuleCondition, description: 'Condition to evaluate' })
  condition: AlertRuleCondition;

  @ApiPropertyOptional({ description: 'Condition value to compare against' })
  conditionValue?: string;

  @ApiPropertyOptional({ description: 'Numeric threshold value' })
  thresholdValue?: number;

  @ApiProperty({ description: 'Severity score (1-4)' })
  severityScore: number;

  @ApiPropertyOptional({ description: 'Alert message template' })
  alertMessage?: string;

  @ApiPropertyOptional({ description: 'Additional filters' })
  filters?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class CreateAlertSubscriptionDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ enum: AlertType, description: 'Alert type to subscribe to (null for all types)' })
  @IsOptional()
  @IsEnum(AlertType)
  alertType?: AlertType;

  @ApiPropertyOptional({ enum: AlertSeverity, description: 'Severity level to subscribe to (null for all severities)' })
  @IsOptional()
  @IsEnum(AlertSeverity)
  severity?: AlertSeverity;

  @ApiProperty({ description: 'Notification channels', enum: NotificationChannel, isArray: true })
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels: NotificationChannel[];

  @ApiPropertyOptional({ enum: NotificationFrequency, description: 'Notification frequency' })
  @IsOptional()
  @IsEnum(NotificationFrequency)
  frequency?: NotificationFrequency;

  @ApiProperty({ description: 'Whether the subscription is active' })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Additional filters', type: 'object' })
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}

export class UpdateAlertSubscriptionDto {
  @ApiPropertyOptional({ description: 'Specific rule ID to subscribe to (null for all rules)' })
  @IsOptional()
  @IsString()
  ruleId?: string;

  @ApiPropertyOptional({ description: 'Severity levels to subscribe to', enum: AlertSeverity, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(AlertSeverity, { each: true })
  severityLevels?: AlertSeverity[];

  @ApiPropertyOptional({ description: 'Notification channels', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notificationChannels?: string[];

  @ApiPropertyOptional({ description: 'Whether the subscription is enabled' })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class AlertSubscriptionDto {
  @ApiProperty({ description: 'Subscription ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiPropertyOptional({ enum: AlertType, description: 'Alert type (null for all types)' })
  alertType?: AlertType;

  @ApiPropertyOptional({ enum: AlertSeverity, description: 'Severity level (null for all severities)' })
  severity?: AlertSeverity;

  @ApiProperty({ description: 'Notification channels' })
  channels: NotificationChannel[];

  @ApiProperty({ enum: NotificationFrequency, description: 'Notification frequency' })
  frequency: NotificationFrequency;

  @ApiProperty({ description: 'Whether the subscription is active' })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Additional filters' })
  filters?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class AlertLogDto {
  @ApiProperty({ description: 'Log ID' })
  id: string;

  @ApiProperty({ description: 'Alert ID' })
  alertId: string;

  @ApiProperty({ enum: AlertLogAction, description: 'Action performed' })
  action: string;

  @ApiProperty({ description: 'Action details' })
  details: string;

  @ApiProperty({ description: 'Action timestamp' })
  timestamp: Date;
}