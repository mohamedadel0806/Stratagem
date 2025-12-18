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
exports.IntegrationConfig = exports.ConflictResolutionStrategy = exports.AuthenticationType = exports.IntegrationStatus = exports.IntegrationType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var IntegrationType;
(function (IntegrationType) {
    IntegrationType["CMDB"] = "cmdb";
    IntegrationType["ASSET_MANAGEMENT_SYSTEM"] = "asset_management_system";
    IntegrationType["REST_API"] = "rest_api";
    IntegrationType["WEBHOOK"] = "webhook";
})(IntegrationType || (exports.IntegrationType = IntegrationType = {}));
var IntegrationStatus;
(function (IntegrationStatus) {
    IntegrationStatus["ACTIVE"] = "active";
    IntegrationStatus["INACTIVE"] = "inactive";
    IntegrationStatus["ERROR"] = "error";
})(IntegrationStatus || (exports.IntegrationStatus = IntegrationStatus = {}));
var AuthenticationType;
(function (AuthenticationType) {
    AuthenticationType["API_KEY"] = "api_key";
    AuthenticationType["BEARER_TOKEN"] = "bearer_token";
    AuthenticationType["BASIC_AUTH"] = "basic_auth";
    AuthenticationType["OAUTH2"] = "oauth2";
})(AuthenticationType || (exports.AuthenticationType = AuthenticationType = {}));
var ConflictResolutionStrategy;
(function (ConflictResolutionStrategy) {
    ConflictResolutionStrategy["SKIP"] = "skip";
    ConflictResolutionStrategy["OVERWRITE"] = "overwrite";
    ConflictResolutionStrategy["MERGE"] = "merge";
})(ConflictResolutionStrategy || (exports.ConflictResolutionStrategy = ConflictResolutionStrategy = {}));
let IntegrationConfig = class IntegrationConfig {
};
exports.IntegrationConfig = IntegrationConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: IntegrationType,
    }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "integrationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "endpointUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AuthenticationType,
    }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "authenticationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "apiKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "bearerToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], IntegrationConfig.prototype, "fieldMapping", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "syncInterval", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: IntegrationStatus,
        default: IntegrationStatus.INACTIVE,
    }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "lastSyncError", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], IntegrationConfig.prototype, "lastSyncAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], IntegrationConfig.prototype, "nextSyncAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], IntegrationConfig.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ConflictResolutionStrategy,
        default: ConflictResolutionStrategy.SKIP,
        nullable: true,
    }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "conflictResolutionStrategy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], IntegrationConfig.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], IntegrationConfig.prototype, "updatedAt", void 0);
exports.IntegrationConfig = IntegrationConfig = __decorate([
    (0, typeorm_1.Entity)('integration_configs')
], IntegrationConfig);
//# sourceMappingURL=integration-config.entity.js.map