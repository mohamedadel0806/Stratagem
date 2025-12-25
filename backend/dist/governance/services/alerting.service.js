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
const alert_entity_1 = require("../entities/alert.entity");
const alert_rule_entity_1 = require("../entities/alert-rule.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const alert_escalation_service_1 = require("./alert-escalation.service");
let AlertingService = AlertingService_1 = class AlertingService {
    constructor(alertRepository, alertRuleRepository, userRepository, escalationService) {
        this.alertRepository = alertRepository;
        this.alertRuleRepository = alertRuleRepository;
        this.userRepository = userRepository;
        this.escalationService = escalationService;
        this.logger = new common_1.Logger(AlertingService_1.name);
    }
    async createAlert(createAlertDto, userId) {
        this.logger.log(`Creating alert: ${createAlertDto.title}`);
        const creator = await this.userRepository.findOne({ where: { id: userId } });
        if (!creator) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        const alert = this.alertRepository.create(Object.assign(Object.assign({}, createAlertDto), { createdById: userId, status: alert_entity_1.AlertStatus.ACTIVE }));
        const saved = await this.alertRepository.save(alert);
        if (saved.severity === alert_entity_1.AlertSeverity.CRITICAL) {
            try {
                const escalationChain = await this.escalationService.createEscalationChain({
                    alertId: saved.id,
                    escalationRules: [
                        {
                            level: 1,
                            delayMinutes: 15,
                            roles: ['manager'],
                            notifyChannels: ['email', 'in_app'],
                            description: 'Escalate critical alert to manager',
                        },
                        {
                            level: 2,
                            delayMinutes: 30,
                            roles: ['ciso'],
                            notifyChannels: ['email', 'sms', 'in_app'],
                            description: 'Escalate critical alert to CISO',
                        },
                    ],
                    escalationNotes: `Auto-escalation created for ${saved.severity} alert`,
                }, userId);
                saved.escalationChainId = escalationChain.id;
                saved.hasEscalation = true;
                await this.alertRepository.save(saved);
                this.logger.log(`Created auto-escalation chain ${escalationChain.id} for critical alert ${saved.id}`);
            }
            catch (err) {
                this.logger.error(`Failed to create escalation chain for alert ${saved.id}: ${err.message}`);
            }
        }
        return this.mapAlertToDto(saved);
    }
    async getAlert(id) {
        const alert = await this.alertRepository.findOne({
            where: { id },
            relations: ['createdBy', 'acknowledgedBy', 'resolvedBy'],
        });
        if (!alert) {
            throw new common_1.NotFoundException(`Alert ${id} not found`);
        }
        return this.mapAlertToDto(alert);
    }
    async getAlerts(params) {
        var _a, _b;
        const page = (_a = params === null || params === void 0 ? void 0 : params.page) !== null && _a !== void 0 ? _a : 1;
        const limit = (_b = params === null || params === void 0 ? void 0 : params.limit) !== null && _b !== void 0 ? _b : 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (params === null || params === void 0 ? void 0 : params.status) {
            where.status = params.status;
        }
        if (params === null || params === void 0 ? void 0 : params.severity) {
            where.severity = params.severity;
        }
        if (params === null || params === void 0 ? void 0 : params.type) {
            where.type = params.type;
        }
        if (params === null || params === void 0 ? void 0 : params.search) {
            where.title = (0, typeorm_2.ILike)(`%${params.search}%`);
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
    async getRecentCriticalAlerts(limit = 5) {
        const alerts = await this.alertRepository.find({
            where: { status: (0, typeorm_2.In)([alert_entity_1.AlertStatus.ACTIVE, alert_entity_1.AlertStatus.ACKNOWLEDGED]) },
            order: { createdAt: 'DESC' },
            take: limit,
        });
        return alerts
            .filter(a => a.severity === alert_entity_1.AlertSeverity.CRITICAL || a.severity === alert_entity_1.AlertSeverity.HIGH)
            .slice(0, limit)
            .map(a => this.mapAlertToDto(a));
    }
    async acknowledgeAlert(id, userId) {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException(`Alert ${id} not found`);
        }
        if (alert.status === alert_entity_1.AlertStatus.RESOLVED || alert.status === alert_entity_1.AlertStatus.DISMISSED) {
            throw new common_1.BadRequestException(`Cannot acknowledge ${alert.status} alert`);
        }
        alert.status = alert_entity_1.AlertStatus.ACKNOWLEDGED;
        alert.acknowledgedById = userId;
        alert.acknowledgedAt = new Date();
        const saved = await this.alertRepository.save(alert);
        this.logger.log(`Alert ${id} acknowledged by user ${userId}`);
        return this.mapAlertToDto(saved);
    }
    async resolveAlert(id, userId, resolutionNotes) {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException(`Alert ${id} not found`);
        }
        if (alert.status === alert_entity_1.AlertStatus.DISMISSED) {
            throw new common_1.BadRequestException('Cannot resolve dismissed alert');
        }
        alert.status = alert_entity_1.AlertStatus.RESOLVED;
        alert.resolvedById = userId;
        alert.resolvedAt = new Date();
        if (resolutionNotes) {
            alert.resolutionNotes = resolutionNotes;
        }
        const saved = await this.alertRepository.save(alert);
        if (alert.escalationChainId) {
            try {
                await this.escalationService.resolveEscalationChain(alert.escalationChainId, resolutionNotes || 'Alert resolved', userId);
                this.logger.log(`Resolved escalation chain ${alert.escalationChainId} for alert ${id}`);
            }
            catch (err) {
                this.logger.error(`Failed to resolve escalation chain ${alert.escalationChainId}: ${err.message}`);
            }
        }
        this.logger.log(`Alert ${id} resolved by user ${userId}`);
        return this.mapAlertToDto(saved);
    }
    async dismissAlert(id) {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException(`Alert ${id} not found`);
        }
        alert.status = alert_entity_1.AlertStatus.DISMISSED;
        const saved = await this.alertRepository.save(alert);
        this.logger.log(`Alert ${id} dismissed`);
        return this.mapAlertToDto(saved);
    }
    async markAllAlertsAsAcknowledged(userId) {
        const result = await this.alertRepository.update({ status: alert_entity_1.AlertStatus.ACTIVE }, {
            status: alert_entity_1.AlertStatus.ACKNOWLEDGED,
            acknowledgedById: userId,
            acknowledgedAt: new Date(),
        });
        this.logger.log(`Marked ${result.affected || 0} alerts as acknowledged`);
        return { updated: result.affected || 0 };
    }
    async deleteAlert(id) {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException(`Alert ${id} not found`);
        }
        await this.alertRepository.remove(alert);
        this.logger.log(`Alert ${id} deleted`);
        return { deleted: true };
    }
    async getAlertStatistics() {
        const alerts = await this.alertRepository.find();
        const stats = {
            active: 0,
            acknowledged: 0,
            resolved: 0,
            dismissed: 0,
            total: alerts.length,
            by_severity: {
                [alert_entity_1.AlertSeverity.LOW]: 0,
                [alert_entity_1.AlertSeverity.MEDIUM]: 0,
                [alert_entity_1.AlertSeverity.HIGH]: 0,
                [alert_entity_1.AlertSeverity.CRITICAL]: 0,
            },
            by_type: {
                [alert_entity_1.AlertType.POLICY_REVIEW_OVERDUE]: 0,
                [alert_entity_1.AlertType.CONTROL_ASSESSMENT_PAST_DUE]: 0,
                [alert_entity_1.AlertType.SOP_EXECUTION_FAILURE]: 0,
                [alert_entity_1.AlertType.AUDIT_FINDING]: 0,
                [alert_entity_1.AlertType.COMPLIANCE_VIOLATION]: 0,
                [alert_entity_1.AlertType.RISK_THRESHOLD_EXCEEDED]: 0,
                [alert_entity_1.AlertType.CUSTOM]: 0,
            },
        };
        for (const alert of alerts) {
            if (alert.status === alert_entity_1.AlertStatus.ACTIVE)
                stats.active++;
            else if (alert.status === alert_entity_1.AlertStatus.ACKNOWLEDGED)
                stats.acknowledged++;
            else if (alert.status === alert_entity_1.AlertStatus.RESOLVED)
                stats.resolved++;
            else if (alert.status === alert_entity_1.AlertStatus.DISMISSED)
                stats.dismissed++;
            stats.by_severity[alert.severity]++;
            stats.by_type[alert.type]++;
        }
        return stats;
    }
    async createAlertRule(createRuleDto, userId) {
        this.logger.log(`Creating alert rule: ${createRuleDto.name}`);
        const creator = await this.userRepository.findOne({ where: { id: userId } });
        if (!creator) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        const rule = this.alertRuleRepository.create(Object.assign(Object.assign({}, createRuleDto), { createdById: userId }));
        const saved = await this.alertRuleRepository.save(rule);
        return this.mapAlertRuleToDto(saved);
    }
    async getAlertRule(id) {
        const rule = await this.alertRuleRepository.findOne({
            where: { id },
            relations: ['createdBy'],
        });
        if (!rule) {
            throw new common_1.NotFoundException(`Alert rule ${id} not found`);
        }
        return this.mapAlertRuleToDto(rule);
    }
    async getAlertRules(params) {
        var _a, _b;
        const page = (_a = params === null || params === void 0 ? void 0 : params.page) !== null && _a !== void 0 ? _a : 1;
        const limit = (_b = params === null || params === void 0 ? void 0 : params.limit) !== null && _b !== void 0 ? _b : 10;
        const skip = (page - 1) * limit;
        const where = {};
        if ((params === null || params === void 0 ? void 0 : params.status) === alert_entity_1.AlertStatus.ACTIVE) {
            where.isActive = true;
        }
        else if ((params === null || params === void 0 ? void 0 : params.status) === alert_entity_1.AlertStatus.ACKNOWLEDGED) {
            where.isActive = false;
        }
        if (params === null || params === void 0 ? void 0 : params.search) {
            where.name = (0, typeorm_2.ILike)(`%${params.search}%`);
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
    async updateAlertRule(id, updateRuleDto) {
        const rule = await this.alertRuleRepository.findOne({ where: { id } });
        if (!rule) {
            throw new common_1.NotFoundException(`Alert rule ${id} not found`);
        }
        Object.assign(rule, updateRuleDto);
        const saved = await this.alertRuleRepository.save(rule);
        this.logger.log(`Alert rule ${id} updated`);
        return this.mapAlertRuleToDto(saved);
    }
    async toggleAlertRule(id, isActive) {
        const rule = await this.alertRuleRepository.findOne({ where: { id } });
        if (!rule) {
            throw new common_1.NotFoundException(`Alert rule ${id} not found`);
        }
        rule.isActive = isActive;
        const saved = await this.alertRuleRepository.save(rule);
        this.logger.log(`Alert rule ${id} toggled to ${isActive ? 'active' : 'inactive'}`);
        return this.mapAlertRuleToDto(saved);
    }
    async deleteAlertRule(id) {
        const rule = await this.alertRuleRepository.findOne({ where: { id } });
        if (!rule) {
            throw new common_1.NotFoundException(`Alert rule ${id} not found`);
        }
        await this.alertRuleRepository.remove(rule);
        this.logger.log(`Alert rule ${id} deleted`);
        return { deleted: true };
    }
    async getAlertRuleStatistics() {
        const rules = await this.alertRuleRepository.find();
        return {
            total: rules.length,
            active: rules.filter(r => r.isActive).length,
            inactive: rules.filter(r => !r.isActive).length,
        };
    }
    async testAlertRule(ruleId) {
        const rule = await this.alertRuleRepository.findOne({ where: { id: ruleId } });
        if (!rule) {
            throw new common_1.NotFoundException(`Alert rule ${ruleId} not found`);
        }
        this.logger.log(`Testing alert rule ${ruleId}`);
        const sampleMatches = [];
        if (rule.triggerType === alert_rule_entity_1.AlertRuleTriggerType.TIME_BASED) {
            sampleMatches.push({
                id: 'sample-1',
                reason: `Entity overdue by ${rule.thresholdValue || 0} days`,
            });
        }
        if (rule.triggerType === alert_rule_entity_1.AlertRuleTriggerType.THRESHOLD_BASED) {
            sampleMatches.push({
                id: 'sample-2',
                reason: `Value exceeded threshold of ${rule.thresholdValue}`,
            });
        }
        if (rule.triggerType === alert_rule_entity_1.AlertRuleTriggerType.STATUS_CHANGE) {
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
    mapAlertToDto(alert) {
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
    mapAlertRuleToDto(rule) {
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
                return String(fieldValue).includes(String(conditionValue));
            case alert_rule_entity_1.AlertRuleCondition.NOT_CONTAINS:
                return !String(fieldValue).includes(String(conditionValue));
            case alert_rule_entity_1.AlertRuleCondition.IS_NULL:
                return fieldValue === null || fieldValue === undefined;
            case alert_rule_entity_1.AlertRuleCondition.IS_NOT_NULL:
                return fieldValue !== null && fieldValue !== undefined;
            case alert_rule_entity_1.AlertRuleCondition.DAYS_OVERDUE:
                if (!fieldValue)
                    return false;
                const daysOverdue = (new Date().getTime() - new Date(fieldValue).getTime()) / (1000 * 60 * 60 * 24);
                return daysOverdue > Number(conditionValue);
            case alert_rule_entity_1.AlertRuleCondition.STATUS_EQUALS:
                return String(fieldValue).toLowerCase() === String(conditionValue).toLowerCase();
            default:
                return false;
        }
    }
};
exports.AlertingService = AlertingService;
exports.AlertingService = AlertingService = AlertingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __param(1, (0, typeorm_1.InjectRepository)(alert_rule_entity_1.AlertRule)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        alert_escalation_service_1.AlertEscalationService])
], AlertingService);
//# sourceMappingURL=alerting.service.js.map