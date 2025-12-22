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
exports.GovernanceIntegrationLog = exports.GovernanceIntegrationHook = exports.HookAction = exports.HookType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/entities/user.entity");
var HookType;
(function (HookType) {
    HookType["SIEM"] = "siem";
    HookType["VULNERABILITY_SCANNER"] = "vulnerability_scanner";
    HookType["CLOUD_MONITOR"] = "cloud_monitor";
    HookType["CUSTOM"] = "custom";
})(HookType || (exports.HookType = HookType = {}));
var HookAction;
(function (HookAction) {
    HookAction["CREATE_EVIDENCE"] = "create_evidence";
    HookAction["CREATE_FINDING"] = "create_finding";
    HookAction["UPDATE_CONTROL_STATUS"] = "update_control_status";
})(HookAction || (exports.HookAction = HookAction = {}));
let GovernanceIntegrationHook = class GovernanceIntegrationHook {
};
exports.GovernanceIntegrationHook = GovernanceIntegrationHook;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GovernanceIntegrationHook.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], GovernanceIntegrationHook.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GovernanceIntegrationHook.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: HookType,
        default: HookType.CUSTOM,
    }),
    __metadata("design:type", String)
], GovernanceIntegrationHook.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: HookAction,
        default: HookAction.CREATE_EVIDENCE,
    }),
    __metadata("design:type", String)
], GovernanceIntegrationHook.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 128, unique: true, name: 'secret_key' }),
    __metadata("design:type", String)
], GovernanceIntegrationHook.prototype, "secretKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], GovernanceIntegrationHook.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], GovernanceIntegrationHook.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GovernanceIntegrationLog, (log) => log.hook),
    __metadata("design:type", Array)
], GovernanceIntegrationHook.prototype, "logs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], GovernanceIntegrationHook.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], GovernanceIntegrationHook.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GovernanceIntegrationHook.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], GovernanceIntegrationHook.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], GovernanceIntegrationHook.prototype, "deleted_at", void 0);
exports.GovernanceIntegrationHook = GovernanceIntegrationHook = __decorate([
    (0, typeorm_1.Entity)('governance_integration_hooks'),
    (0, typeorm_1.Index)(['type']),
    (0, typeorm_1.Index)(['isActive'])
], GovernanceIntegrationHook);
let GovernanceIntegrationLog = class GovernanceIntegrationLog {
};
exports.GovernanceIntegrationLog = GovernanceIntegrationLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GovernanceIntegrationLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'hook_id' }),
    __metadata("design:type", String)
], GovernanceIntegrationLog.prototype, "hook_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GovernanceIntegrationHook, (hook) => hook.logs, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'hook_id' }),
    __metadata("design:type", GovernanceIntegrationHook)
], GovernanceIntegrationLog.prototype, "hook", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], GovernanceIntegrationLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], GovernanceIntegrationLog.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], GovernanceIntegrationLog.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GovernanceIntegrationLog.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], GovernanceIntegrationLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GovernanceIntegrationLog.prototype, "created_at", void 0);
exports.GovernanceIntegrationLog = GovernanceIntegrationLog = __decorate([
    (0, typeorm_1.Entity)('governance_integration_logs'),
    (0, typeorm_1.Index)(['hook_id']),
    (0, typeorm_1.Index)(['status'])
], GovernanceIntegrationLog);
//# sourceMappingURL=integration-hook.entity.js.map