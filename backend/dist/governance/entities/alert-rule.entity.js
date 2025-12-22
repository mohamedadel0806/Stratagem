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
exports.AlertRule = exports.AlertRuleCondition = exports.AlertRuleTriggerType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var AlertRuleTriggerType;
(function (AlertRuleTriggerType) {
    AlertRuleTriggerType["TIME_BASED"] = "time_based";
    AlertRuleTriggerType["THRESHOLD_BASED"] = "threshold_based";
    AlertRuleTriggerType["STATUS_CHANGE"] = "status_change";
    AlertRuleTriggerType["CUSTOM_CONDITION"] = "custom_condition";
})(AlertRuleTriggerType || (exports.AlertRuleTriggerType = AlertRuleTriggerType = {}));
var AlertRuleCondition;
(function (AlertRuleCondition) {
    AlertRuleCondition["EQUALS"] = "equals";
    AlertRuleCondition["NOT_EQUALS"] = "not_equals";
    AlertRuleCondition["GREATER_THAN"] = "greater_than";
    AlertRuleCondition["LESS_THAN"] = "less_than";
    AlertRuleCondition["CONTAINS"] = "contains";
    AlertRuleCondition["NOT_CONTAINS"] = "not_contains";
    AlertRuleCondition["IS_NULL"] = "is_null";
    AlertRuleCondition["IS_NOT_NULL"] = "is_not_null";
    AlertRuleCondition["DAYS_OVERDUE"] = "days_overdue";
    AlertRuleCondition["STATUS_EQUALS"] = "status_equals";
})(AlertRuleCondition || (exports.AlertRuleCondition = AlertRuleCondition = {}));
let AlertRule = class AlertRule {
};
exports.AlertRule = AlertRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AlertRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AlertRule.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AlertRule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], AlertRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AlertRuleTriggerType }),
    __metadata("design:type", String)
], AlertRule.prototype, "triggerType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AlertRule.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AlertRule.prototype, "fieldName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AlertRuleCondition }),
    __metadata("design:type", String)
], AlertRule.prototype, "condition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AlertRule.prototype, "conditionValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AlertRule.prototype, "thresholdValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], AlertRule.prototype, "severityScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], AlertRule.prototype, "alertMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AlertRule.prototype, "filters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AlertRule.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], AlertRule.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AlertRule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AlertRule.prototype, "updatedAt", void 0);
exports.AlertRule = AlertRule = __decorate([
    (0, typeorm_1.Entity)('alert_rules')
], AlertRule);
//# sourceMappingURL=alert-rule.entity.js.map