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
exports.IntegrationSyncLog = exports.SyncStatus = void 0;
const typeorm_1 = require("typeorm");
const integration_config_entity_1 = require("./integration-config.entity");
var SyncStatus;
(function (SyncStatus) {
    SyncStatus["PENDING"] = "pending";
    SyncStatus["RUNNING"] = "running";
    SyncStatus["COMPLETED"] = "completed";
    SyncStatus["FAILED"] = "failed";
    SyncStatus["PARTIAL"] = "partial";
})(SyncStatus || (exports.SyncStatus = SyncStatus = {}));
let IntegrationSyncLog = class IntegrationSyncLog {
};
exports.IntegrationSyncLog = IntegrationSyncLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IntegrationSyncLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], IntegrationSyncLog.prototype, "integrationConfigId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => integration_config_entity_1.IntegrationConfig),
    (0, typeorm_1.JoinColumn)({ name: 'integration_config_id' }),
    __metadata("design:type", integration_config_entity_1.IntegrationConfig)
], IntegrationSyncLog.prototype, "integrationConfig", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SyncStatus,
        default: SyncStatus.PENDING,
    }),
    __metadata("design:type", String)
], IntegrationSyncLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], IntegrationSyncLog.prototype, "totalRecords", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], IntegrationSyncLog.prototype, "successfulSyncs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], IntegrationSyncLog.prototype, "failedSyncs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], IntegrationSyncLog.prototype, "skippedRecords", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], IntegrationSyncLog.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], IntegrationSyncLog.prototype, "syncDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], IntegrationSyncLog.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], IntegrationSyncLog.prototype, "completedAt", void 0);
exports.IntegrationSyncLog = IntegrationSyncLog = __decorate([
    (0, typeorm_1.Entity)('integration_sync_logs')
], IntegrationSyncLog);
//# sourceMappingURL=integration-sync-log.entity.js.map