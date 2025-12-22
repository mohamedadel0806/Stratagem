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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertLogDto = exports.AlertSubscriptionDto = exports.UpdateAlertSubscriptionDto = exports.CreateAlertSubscriptionDto = exports.AlertRuleDto = exports.UpdateAlertRuleDto = exports.CreateAlertRuleDto = exports.AlertConditionDto = exports.AlertDto = exports.UpdateAlertDto = exports.CreateAlertDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const alert_entity_1 = require("../entities/alert.entity");
const alert_rule_entity_1 = require("../entities/alert-rule.entity");
const alert_subscription_entity_1 = require("../entities/alert-subscription.entity");
class CreateAlertDto {
}
exports.CreateAlertDto = CreateAlertDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alert title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alert description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_entity_1.AlertType, description: 'Alert type' }),
    (0, class_validator_1.IsEnum)(alert_entity_1.AlertType),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_entity_1.AlertSeverity, description: 'Alert severity level' }),
    (0, class_validator_1.IsEnum)(alert_entity_1.AlertSeverity),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related entity ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "relatedEntityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related entity type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "relatedEntityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata', type: 'object' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateAlertDto.prototype, "metadata", void 0);
class UpdateAlertDto {
}
exports.UpdateAlertDto = UpdateAlertDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: alert_entity_1.AlertStatus, description: 'Alert status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(alert_entity_1.AlertStatus),
    __metadata("design:type", String)
], UpdateAlertDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resolution notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertDto.prototype, "resolution", void 0);
class AlertDto {
}
exports.AlertDto = AlertDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alert ID' }),
    __metadata("design:type", String)
], AlertDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alert title' }),
    __metadata("design:type", String)
], AlertDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alert description' }),
    __metadata("design:type", String)
], AlertDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_entity_1.AlertType, description: 'Alert type' }),
    __metadata("design:type", String)
], AlertDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_entity_1.AlertSeverity, description: 'Alert severity level' }),
    __metadata("design:type", String)
], AlertDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_entity_1.AlertStatus, description: 'Alert status' }),
    __metadata("design:type", String)
], AlertDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related entity ID' }),
    __metadata("design:type", String)
], AlertDto.prototype, "relatedEntityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related entity type' }),
    __metadata("design:type", String)
], AlertDto.prototype, "relatedEntityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }),
    __metadata("design:type", Object)
], AlertDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], AlertDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], AlertDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Acknowledgment timestamp' }),
    __metadata("design:type", Date)
], AlertDto.prototype, "acknowledgedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User who acknowledged the alert' }),
    __metadata("design:type", String)
], AlertDto.prototype, "acknowledgedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resolution timestamp' }),
    __metadata("design:type", Date)
], AlertDto.prototype, "resolvedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User who resolved the alert' }),
    __metadata("design:type", String)
], AlertDto.prototype, "resolvedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resolution notes' }),
    __metadata("design:type", String)
], AlertDto.prototype, "resolutionNotes", void 0);
class AlertConditionDto {
}
exports.AlertConditionDto = AlertConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Condition field (e.g., status, dueDate, riskLevel)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AlertConditionDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Condition operator (e.g., equals, greaterThan, lessThan)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AlertConditionDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Condition value' }),
    __metadata("design:type", Object)
], AlertConditionDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional condition logic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AlertConditionDto.prototype, "logic", void 0);
class CreateAlertRuleDto {
}
exports.CreateAlertRuleDto = CreateAlertRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rule name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rule description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the rule is active' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAlertRuleDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_rule_entity_1.AlertRuleTriggerType, description: 'Rule trigger type' }),
    (0, class_validator_1.IsEnum)(alert_rule_entity_1.AlertRuleTriggerType),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "triggerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entity type this rule applies to' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field name to check' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "fieldName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_rule_entity_1.AlertRuleCondition, description: 'Condition to evaluate' }),
    (0, class_validator_1.IsEnum)(alert_rule_entity_1.AlertRuleCondition),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Condition value to compare against' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "conditionValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Numeric threshold value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAlertRuleDto.prototype, "thresholdValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Severity score (1-4)' }),
    __metadata("design:type", Number)
], CreateAlertRuleDto.prototype, "severityScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Alert message template' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "alertMessage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional filters', type: 'object' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateAlertRuleDto.prototype, "filters", void 0);
class UpdateAlertRuleDto {
}
exports.UpdateAlertRuleDto = UpdateAlertRuleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rule name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rule description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether the rule is active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAlertRuleDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: alert_rule_entity_1.AlertRuleTriggerType, description: 'Rule trigger type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(alert_rule_entity_1.AlertRuleTriggerType),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "triggerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Entity type this rule applies to' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field name to check' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "fieldName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: alert_rule_entity_1.AlertRuleCondition, description: 'Condition to evaluate' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(alert_rule_entity_1.AlertRuleCondition),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Condition value to compare against' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "conditionValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Numeric threshold value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAlertRuleDto.prototype, "thresholdValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Severity score (1-4)' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAlertRuleDto.prototype, "severityScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Alert message template' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "alertMessage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional filters', type: 'object' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateAlertRuleDto.prototype, "filters", void 0);
class AlertRuleDto {
}
exports.AlertRuleDto = AlertRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rule ID' }),
    __metadata("design:type", String)
], AlertRuleDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rule name' }),
    __metadata("design:type", String)
], AlertRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rule description' }),
    __metadata("design:type", String)
], AlertRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the rule is active' }),
    __metadata("design:type", Boolean)
], AlertRuleDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_rule_entity_1.AlertRuleTriggerType, description: 'Rule trigger type' }),
    __metadata("design:type", String)
], AlertRuleDto.prototype, "triggerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entity type this rule applies to' }),
    __metadata("design:type", String)
], AlertRuleDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field name to check' }),
    __metadata("design:type", String)
], AlertRuleDto.prototype, "fieldName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_rule_entity_1.AlertRuleCondition, description: 'Condition to evaluate' }),
    __metadata("design:type", String)
], AlertRuleDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Condition value to compare against' }),
    __metadata("design:type", String)
], AlertRuleDto.prototype, "conditionValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Numeric threshold value' }),
    __metadata("design:type", Number)
], AlertRuleDto.prototype, "thresholdValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Severity score (1-4)' }),
    __metadata("design:type", Number)
], AlertRuleDto.prototype, "severityScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Alert message template' }),
    __metadata("design:type", String)
], AlertRuleDto.prototype, "alertMessage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional filters' }),
    __metadata("design:type", Object)
], AlertRuleDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], AlertRuleDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], AlertRuleDto.prototype, "updatedAt", void 0);
class CreateAlertSubscriptionDto {
}
exports.CreateAlertSubscriptionDto = CreateAlertSubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertSubscriptionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: alert_entity_1.AlertType, description: 'Alert type to subscribe to (null for all types)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(alert_entity_1.AlertType),
    __metadata("design:type", String)
], CreateAlertSubscriptionDto.prototype, "alertType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: alert_entity_1.AlertSeverity, description: 'Severity level to subscribe to (null for all severities)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(alert_entity_1.AlertSeverity),
    __metadata("design:type", String)
], CreateAlertSubscriptionDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification channels', enum: alert_subscription_entity_1.NotificationChannel, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(alert_subscription_entity_1.NotificationChannel, { each: true }),
    __metadata("design:type", Array)
], CreateAlertSubscriptionDto.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: alert_subscription_entity_1.NotificationFrequency, description: 'Notification frequency' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(alert_subscription_entity_1.NotificationFrequency),
    __metadata("design:type", String)
], CreateAlertSubscriptionDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the subscription is active' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAlertSubscriptionDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional filters', type: 'object' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateAlertSubscriptionDto.prototype, "filters", void 0);
class UpdateAlertSubscriptionDto {
}
exports.UpdateAlertSubscriptionDto = UpdateAlertSubscriptionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Specific rule ID to subscribe to (null for all rules)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertSubscriptionDto.prototype, "ruleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Severity levels to subscribe to', enum: alert_entity_1.AlertSeverity, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(alert_entity_1.AlertSeverity, { each: true }),
    __metadata("design:type", Array)
], UpdateAlertSubscriptionDto.prototype, "severityLevels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notification channels', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateAlertSubscriptionDto.prototype, "notificationChannels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether the subscription is enabled' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAlertSubscriptionDto.prototype, "enabled", void 0);
class AlertSubscriptionDto {
}
exports.AlertSubscriptionDto = AlertSubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subscription ID' }),
    __metadata("design:type", String)
], AlertSubscriptionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], AlertSubscriptionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: alert_entity_1.AlertType, description: 'Alert type (null for all types)' }),
    __metadata("design:type", String)
], AlertSubscriptionDto.prototype, "alertType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: alert_entity_1.AlertSeverity, description: 'Severity level (null for all severities)' }),
    __metadata("design:type", String)
], AlertSubscriptionDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification channels' }),
    __metadata("design:type", Array)
], AlertSubscriptionDto.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_subscription_entity_1.NotificationFrequency, description: 'Notification frequency' }),
    __metadata("design:type", String)
], AlertSubscriptionDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the subscription is active' }),
    __metadata("design:type", Boolean)
], AlertSubscriptionDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional filters' }),
    __metadata("design:type", Object)
], AlertSubscriptionDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], AlertSubscriptionDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], AlertSubscriptionDto.prototype, "updatedAt", void 0);
class AlertLogDto {
}
exports.AlertLogDto = AlertLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Log ID' }),
    __metadata("design:type", String)
], AlertLogDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alert ID' }),
    __metadata("design:type", String)
], AlertLogDto.prototype, "alertId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_log_entity_1.AlertLogAction, description: 'Action performed' }),
    __metadata("design:type", String)
], AlertLogDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Action details' }),
    __metadata("design:type", String)
], AlertLogDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Action timestamp' }),
    __metadata("design:type", Date)
], AlertLogDto.prototype, "timestamp", void 0);
const alert_log_entity_1 = require("../entities/alert-log.entity");
//# sourceMappingURL=alert.dto.js.map