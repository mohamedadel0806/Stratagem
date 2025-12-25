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
exports.EscalationStatisticsDto = exports.ResolveEscalationChainDto = exports.EscalateAlertDto = exports.EscalationChainDto = exports.EscalationHistoryDto = exports.CreateEscalationChainDto = exports.EscalationRuleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const alert_escalation_chain_entity_1 = require("../entities/alert-escalation-chain.entity");
class EscalationRuleDto {
}
exports.EscalationRuleDto = EscalationRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Escalation level number', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EscalationRuleDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minutes to wait before escalating', example: 30 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EscalationRuleDto.prototype, "delayMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role IDs to escalate to', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], EscalationRuleDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Workflow ID to trigger', example: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], EscalationRuleDto.prototype, "workflowId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification channels',
        enum: ['email', 'sms', 'in_app'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], EscalationRuleDto.prototype, "notifyChannels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rule description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EscalationRuleDto.prototype, "description", void 0);
class CreateEscalationChainDto {
}
exports.CreateEscalationChainDto = CreateEscalationChainDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alert ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEscalationChainDto.prototype, "alertId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Alert Rule ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEscalationChainDto.prototype, "alertRuleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Escalation rules', type: [EscalationRuleDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EscalationRuleDto),
    __metadata("design:type", Array)
], CreateEscalationChainDto.prototype, "escalationRules", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Escalation notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEscalationChainDto.prototype, "escalationNotes", void 0);
class EscalationHistoryDto {
}
exports.EscalationHistoryDto = EscalationHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Escalation level' }),
    __metadata("design:type", Number)
], EscalationHistoryDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'When escalated' }),
    __metadata("design:type", Date)
], EscalationHistoryDto.prototype, "escalatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Roles escalated to', type: [String] }),
    __metadata("design:type", Array)
], EscalationHistoryDto.prototype, "escalatedToRoles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Users escalated to', type: [String] }),
    __metadata("design:type", Array)
], EscalationHistoryDto.prototype, "escalatedToUsers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Workflow execution ID' }),
    __metadata("design:type", String)
], EscalationHistoryDto.prototype, "workflowTriggered", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Notifications sent',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                channel: { type: 'string' },
                recipients: { type: 'array', items: { type: 'string' } },
                sentAt: { type: 'string', format: 'date-time' },
            },
        },
    }),
    __metadata("design:type", Array)
], EscalationHistoryDto.prototype, "notificationsSent", void 0);
class EscalationChainDto {
}
exports.EscalationChainDto = EscalationChainDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Escalation chain ID' }),
    __metadata("design:type", String)
], EscalationChainDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alert ID' }),
    __metadata("design:type", String)
], EscalationChainDto.prototype, "alertId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_escalation_chain_entity_1.EscalationChainStatus, description: 'Current status' }),
    __metadata("design:type", String)
], EscalationChainDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current escalation level' }),
    __metadata("design:type", Number)
], EscalationChainDto.prototype, "currentLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum escalation levels' }),
    __metadata("design:type", Number)
], EscalationChainDto.prototype, "maxLevels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Next escalation time' }),
    __metadata("design:type", Date)
], EscalationChainDto.prototype, "nextEscalationAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Escalation history', type: [EscalationHistoryDto] }),
    __metadata("design:type", Array)
], EscalationChainDto.prototype, "escalationHistory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], EscalationChainDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], EscalationChainDto.prototype, "updatedAt", void 0);
class EscalateAlertDto {
}
exports.EscalateAlertDto = EscalateAlertDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Escalation notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EscalateAlertDto.prototype, "notes", void 0);
class ResolveEscalationChainDto {
}
exports.ResolveEscalationChainDto = ResolveEscalationChainDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resolution notes' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResolveEscalationChainDto.prototype, "resolutionNotes", void 0);
class EscalationStatisticsDto {
}
exports.EscalationStatisticsDto = EscalationStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of active escalation chains' }),
    __metadata("design:type", Number)
], EscalationStatisticsDto.prototype, "activeChains", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of pending escalations' }),
    __metadata("design:type", Number)
], EscalationStatisticsDto.prototype, "pendingEscalations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of escalated alerts' }),
    __metadata("design:type", Number)
], EscalationStatisticsDto.prototype, "escalatedAlerts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average escalation levels' }),
    __metadata("design:type", Number)
], EscalationStatisticsDto.prototype, "averageEscalationLevels", void 0);
//# sourceMappingURL=alert-escalation.dto.js.map