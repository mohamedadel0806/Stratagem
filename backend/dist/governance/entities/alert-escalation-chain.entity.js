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
exports.AlertEscalationChain = exports.EscalationChainStatus = void 0;
const typeorm_1 = require("typeorm");
const alert_entity_1 = require("./alert.entity");
const alert_rule_entity_1 = require("./alert-rule.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var EscalationChainStatus;
(function (EscalationChainStatus) {
    EscalationChainStatus["PENDING"] = "pending";
    EscalationChainStatus["IN_PROGRESS"] = "in_progress";
    EscalationChainStatus["ESCALATED"] = "escalated";
    EscalationChainStatus["RESOLVED"] = "resolved";
    EscalationChainStatus["CANCELLED"] = "cancelled";
})(EscalationChainStatus || (exports.EscalationChainStatus = EscalationChainStatus = {}));
let AlertEscalationChain = class AlertEscalationChain {
};
exports.AlertEscalationChain = AlertEscalationChain;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AlertEscalationChain.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AlertEscalationChain.prototype, "alertId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => alert_entity_1.Alert, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'alert_id' }),
    __metadata("design:type", alert_entity_1.Alert)
], AlertEscalationChain.prototype, "alert", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AlertEscalationChain.prototype, "alertRuleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => alert_rule_entity_1.AlertRule, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'alert_rule_id' }),
    __metadata("design:type", alert_rule_entity_1.AlertRule)
], AlertEscalationChain.prototype, "alertRule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EscalationChainStatus, default: EscalationChainStatus.PENDING }),
    __metadata("design:type", String)
], AlertEscalationChain.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AlertEscalationChain.prototype, "currentLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AlertEscalationChain.prototype, "maxLevels", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Array)
], AlertEscalationChain.prototype, "escalationRules", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AlertEscalationChain.prototype, "nextEscalationAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], AlertEscalationChain.prototype, "escalationHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AlertEscalationChain.prototype, "workflowExecutionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AlertEscalationChain.prototype, "escalationNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AlertEscalationChain.prototype, "resolvedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'resolved_by_id' }),
    __metadata("design:type", user_entity_1.User)
], AlertEscalationChain.prototype, "resolvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AlertEscalationChain.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AlertEscalationChain.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], AlertEscalationChain.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AlertEscalationChain.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AlertEscalationChain.prototype, "updatedAt", void 0);
exports.AlertEscalationChain = AlertEscalationChain = __decorate([
    (0, typeorm_1.Entity)('alert_escalation_chains')
], AlertEscalationChain);
//# sourceMappingURL=alert-escalation-chain.entity.js.map