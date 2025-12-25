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
var AlertRuleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertRuleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const alert_entity_1 = require("../entities/alert.entity");
const alert_rule_entity_1 = require("../entities/alert-rule.entity");
const alerting_service_1 = require("./alerting.service");
let AlertRuleService = AlertRuleService_1 = class AlertRuleService {
    constructor(alertRuleRepository, alertRepository, alertingService) {
        this.alertRuleRepository = alertRuleRepository;
        this.alertRepository = alertRepository;
        this.alertingService = alertingService;
        this.logger = new common_1.Logger(AlertRuleService_1.name);
    }
    async evaluateEntity(entityType, entityData, entityId) {
        this.logger.log(`Evaluating rules for entity type: ${entityType}, ID: ${entityId}`);
        const rules = await this.alertRuleRepository.find({
            where: { entityType, isActive: true },
        });
        const generatedAlerts = [];
        for (const rule of rules) {
            const shouldAlert = this.evaluateRule(rule, entityData);
            if (shouldAlert) {
                this.logger.log(`Rule ${rule.id} (${rule.name}) matched for entity ${entityId}`);
                const alert = await this.createAlertFromRule(rule, entityId, entityType, entityData);
                generatedAlerts.push(alert);
            }
        }
        return generatedAlerts;
    }
    evaluateRule(rule, entityData) {
        switch (rule.triggerType) {
            case alert_rule_entity_1.AlertRuleTriggerType.TIME_BASED:
                return this.evaluateTimeBased(rule, entityData);
            case alert_rule_entity_1.AlertRuleTriggerType.THRESHOLD_BASED:
                return this.evaluateThresholdBased(rule, entityData);
            case alert_rule_entity_1.AlertRuleTriggerType.STATUS_CHANGE:
                return this.evaluateStatusChange(rule, entityData);
            case alert_rule_entity_1.AlertRuleTriggerType.CUSTOM_CONDITION:
                return this.evaluateCustomCondition(rule, entityData);
            default:
                this.logger.warn(`Unknown trigger type: ${rule.triggerType}`);
                return false;
        }
    }
    evaluateTimeBased(rule, entityData) {
        if (!rule.fieldName)
            return false;
        const fieldValue = entityData[rule.fieldName];
        if (!fieldValue)
            return false;
        const targetDate = new Date(fieldValue);
        const now = new Date();
        const daysOverdue = (now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysOverdue > 0) {
            if (rule.thresholdValue !== null && rule.thresholdValue !== undefined) {
                return daysOverdue >= rule.thresholdValue;
            }
            return true;
        }
        return false;
    }
    evaluateThresholdBased(rule, entityData) {
        if (!rule.fieldName || rule.thresholdValue === null || rule.thresholdValue === undefined) {
            return false;
        }
        const fieldValue = entityData[rule.fieldName];
        if (fieldValue === null || fieldValue === undefined)
            return false;
        const numValue = Number(fieldValue);
        const threshold = Number(rule.thresholdValue);
        if (rule.condition === alert_rule_entity_1.AlertRuleCondition.GREATER_THAN) {
            return numValue > threshold;
        }
        else if (rule.condition === alert_rule_entity_1.AlertRuleCondition.LESS_THAN) {
            return numValue < threshold;
        }
        else if (rule.condition === alert_rule_entity_1.AlertRuleCondition.EQUALS) {
            return numValue === threshold;
        }
        return numValue >= threshold;
    }
    evaluateStatusChange(rule, entityData) {
        if (!rule.fieldName || !rule.conditionValue)
            return false;
        const fieldValue = entityData[rule.fieldName];
        if (fieldValue === null || fieldValue === undefined)
            return false;
        return String(fieldValue).toLowerCase() === String(rule.conditionValue).toLowerCase();
    }
    evaluateCustomCondition(rule, entityData) {
        if (!rule.fieldName)
            return false;
        const fieldValue = entityData[rule.fieldName];
        const conditionValue = rule.conditionValue;
        return this.evaluateCondition(fieldValue, rule.condition, conditionValue);
    }
    evaluateCondition(fieldValue, condition, conditionValue) {
        switch (condition) {
            case alert_rule_entity_1.AlertRuleCondition.EQUALS:
                return fieldValue === conditionValue;
            case alert_rule_entity_1.AlertRuleCondition.NOT_EQUALS:
                return fieldValue !== conditionValue;
            case alert_rule_entity_1.AlertRuleCondition.GREATER_THAN:
                return Number(fieldValue) > Number(conditionValue);
            case alert_rule_entity_1.AlertRuleCondition.LESS_THAN:
                return Number(fieldValue) < Number(conditionValue);
            case alert_rule_entity_1.AlertRuleCondition.CONTAINS:
                return String(fieldValue).includes(String(conditionValue || ''));
            case alert_rule_entity_1.AlertRuleCondition.NOT_CONTAINS:
                return !String(fieldValue).includes(String(conditionValue || ''));
            case alert_rule_entity_1.AlertRuleCondition.IS_NULL:
                return fieldValue === null || fieldValue === undefined;
            case alert_rule_entity_1.AlertRuleCondition.IS_NOT_NULL:
                return fieldValue !== null && fieldValue !== undefined;
            case alert_rule_entity_1.AlertRuleCondition.DAYS_OVERDUE:
                if (!fieldValue)
                    return false;
                const daysOverdue = (new Date().getTime() - new Date(fieldValue).getTime()) / (1000 * 60 * 60 * 24);
                return daysOverdue > Number(conditionValue || 0);
            case alert_rule_entity_1.AlertRuleCondition.STATUS_EQUALS:
                return String(fieldValue).toLowerCase() === String(conditionValue || '').toLowerCase();
            default:
                return false;
        }
    }
    async createAlertFromRule(rule, entityId, entityType, entityData) {
        const severity = this.determineSeverity(rule);
        const title = this.generateAlertTitle(rule, entityData);
        const description = this.generateAlertDescription(rule, entityData);
        const alertType = this.determineAlertType(rule, entityData);
        const existingAlert = await this.checkExistingAlert(entityId, entityType, alertType);
        if (existingAlert) {
            this.logger.log(`Similar alert already exists for entity ${entityId}`);
            return existingAlert;
        }
        const createAlertDto = {
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
        const alert = this.alertRepository.create(Object.assign(Object.assign({}, createAlertDto), { createdById: null, status: alert_entity_1.AlertStatus.ACTIVE }));
        const saved = await this.alertRepository.save(alert);
        this.logger.log(`Generated alert ${saved.id} from rule ${rule.id}`);
        return saved;
    }
    determineSeverity(rule) {
        const score = rule.severityScore || 1;
        if (score >= 4)
            return alert_entity_1.AlertSeverity.CRITICAL;
        if (score === 3)
            return alert_entity_1.AlertSeverity.HIGH;
        if (score === 2)
            return alert_entity_1.AlertSeverity.MEDIUM;
        return alert_entity_1.AlertSeverity.LOW;
    }
    determineAlertType(rule, entityData) {
        var _a;
        const entityType = ((_a = rule.entityType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        if (entityType.includes('policy') || entityType.includes('review')) {
            return alert_entity_1.AlertType.POLICY_REVIEW_OVERDUE;
        }
        if (entityType.includes('control') || entityType.includes('assessment')) {
            return alert_entity_1.AlertType.CONTROL_ASSESSMENT_PAST_DUE;
        }
        if (entityType.includes('sop') || entityType.includes('procedure')) {
            return alert_entity_1.AlertType.SOP_EXECUTION_FAILURE;
        }
        if (entityType.includes('audit') || entityType.includes('finding')) {
            return alert_entity_1.AlertType.AUDIT_FINDING;
        }
        if (entityType.includes('compliance') || entityType.includes('violation')) {
            return alert_entity_1.AlertType.COMPLIANCE_VIOLATION;
        }
        if (entityType.includes('risk') || entityType.includes('threat')) {
            return alert_entity_1.AlertType.RISK_THRESHOLD_EXCEEDED;
        }
        return alert_entity_1.AlertType.CUSTOM;
    }
    generateAlertTitle(rule, entityData) {
        var _a;
        if (rule.alertMessage) {
            return this.interpolateMessage(rule.alertMessage, entityData);
        }
        const entityType = ((_a = rule.entityType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'item';
        const fieldName = rule.fieldName || 'field';
        switch (rule.triggerType) {
            case alert_rule_entity_1.AlertRuleTriggerType.TIME_BASED:
                return `${entityType} is overdue (${fieldName})`;
            case alert_rule_entity_1.AlertRuleTriggerType.THRESHOLD_BASED:
                return `${entityType} threshold exceeded (${fieldName})`;
            case alert_rule_entity_1.AlertRuleTriggerType.STATUS_CHANGE:
                return `${entityType} status changed to ${rule.conditionValue}`;
            default:
                return `Alert: ${rule.name}`;
        }
    }
    generateAlertDescription(rule, entityData) {
        const fieldName = rule.fieldName || 'field';
        const fieldValue = entityData[fieldName] || 'unknown';
        switch (rule.triggerType) {
            case alert_rule_entity_1.AlertRuleTriggerType.TIME_BASED:
                const daysOverdue = this.calculateDaysOverdue(fieldValue);
                return `This item is overdue by ${daysOverdue} days. Please take immediate action.`;
            case alert_rule_entity_1.AlertRuleTriggerType.THRESHOLD_BASED:
                return `The threshold has been exceeded. Current value: ${fieldValue}. Threshold: ${rule.thresholdValue}`;
            case alert_rule_entity_1.AlertRuleTriggerType.STATUS_CHANGE:
                return `${rule.name}: Current status is ${rule.conditionValue}`;
            default:
                return rule.description || `Alert triggered: ${rule.name}`;
        }
    }
    async checkExistingAlert(entityId, entityType, alertType) {
        const existing = await this.alertRepository.findOne({
            where: {
                relatedEntityId: entityId,
                relatedEntityType: entityType,
                type: alertType,
                status: alert_entity_1.AlertStatus.ACTIVE,
            },
        });
        return existing || null;
    }
    calculateDaysOverdue(dateValue) {
        if (!dateValue)
            return 0;
        const date = new Date(dateValue);
        const now = new Date();
        const daysOverdue = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(0, daysOverdue);
    }
    interpolateMessage(message, data) {
        return message.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return String(data[key] || match);
        });
    }
    async evaluateBatch(entityType, entities) {
        this.logger.log(`Starting batch evaluation for ${entities.length} ${entityType} entities`);
        let alertsGenerated = 0;
        let errors = 0;
        for (const entity of entities) {
            try {
                const alerts = await this.evaluateEntity(entityType, entity.data, entity.id);
                alertsGenerated += alerts.length;
            }
            catch (error) {
                this.logger.error(`Error evaluating entity ${entity.id}: ${error instanceof Error ? error.message : String(error)}`);
                errors++;
            }
        }
        this.logger.log(`Batch evaluation complete: ${alertsGenerated} alerts generated, ${errors} errors`);
        return {
            processed: entities.length,
            alertsGenerated,
            errors,
        };
    }
    async autoResolveAlerts(entityId, entityType) {
        const activeAlerts = await this.alertRepository.find({
            where: {
                relatedEntityId: entityId,
                relatedEntityType: entityType,
                status: alert_entity_1.AlertStatus.ACTIVE,
            },
        });
        let resolvedCount = 0;
        for (const alert of activeAlerts) {
            alert.status = alert_entity_1.AlertStatus.RESOLVED;
            alert.resolutionNotes = 'Auto-resolved: triggering condition no longer exists';
            await this.alertRepository.save(alert);
            resolvedCount++;
        }
        if (resolvedCount > 0) {
            this.logger.log(`Auto-resolved ${resolvedCount} alerts for entity ${entityId}`);
        }
        return resolvedCount;
    }
    async cleanupOldAlerts(daysOld = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        const result = await this.alertRepository.delete({
            status: alert_entity_1.AlertStatus.DISMISSED,
            updatedAt: cutoffDate,
        });
        this.logger.log(`Cleaned up ${result.affected || 0} old dismissed alerts`);
        return result.affected || 0;
    }
};
exports.AlertRuleService = AlertRuleService;
exports.AlertRuleService = AlertRuleService = AlertRuleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alert_rule_entity_1.AlertRule)),
    __param(1, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        alerting_service_1.AlertingService])
], AlertRuleService);
//# sourceMappingURL=alert-rule.service.js.map