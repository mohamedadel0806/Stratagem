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
exports.AssetAuditLog = exports.AuditAction = exports.AssetType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var AssetType;
(function (AssetType) {
    AssetType["PHYSICAL"] = "physical";
    AssetType["INFORMATION"] = "information";
    AssetType["APPLICATION"] = "application";
    AssetType["SOFTWARE"] = "software";
    AssetType["SUPPLIER"] = "supplier";
})(AssetType || (exports.AssetType = AssetType = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "create";
    AuditAction["UPDATE"] = "update";
    AuditAction["DELETE"] = "delete";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
let AssetAuditLog = class AssetAuditLog {
};
exports.AssetAuditLog = AssetAuditLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssetAuditLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetType,
        name: 'asset_type',
    }),
    __metadata("design:type", String)
], AssetAuditLog.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
        name: 'asset_id',
    }),
    __metadata("design:type", String)
], AssetAuditLog.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AuditAction,
    }),
    __metadata("design:type", String)
], AssetAuditLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'field_name',
    }),
    __metadata("design:type", String)
], AssetAuditLog.prototype, "fieldName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'old_value',
    }),
    __metadata("design:type", String)
], AssetAuditLog.prototype, "oldValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'new_value',
    }),
    __metadata("design:type", String)
], AssetAuditLog.prototype, "newValue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'changed_by_id' }),
    __metadata("design:type", user_entity_1.User)
], AssetAuditLog.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
        name: 'changed_by_id',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetAuditLog.prototype, "changedById", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'change_reason',
    }),
    __metadata("design:type", String)
], AssetAuditLog.prototype, "changeReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], AssetAuditLog.prototype, "createdAt", void 0);
exports.AssetAuditLog = AssetAuditLog = __decorate([
    (0, typeorm_1.Entity)('asset_audit_logs'),
    (0, typeorm_1.Index)(['assetType', 'assetId']),
    (0, typeorm_1.Index)(['action']),
    (0, typeorm_1.Index)(['changedById']),
    (0, typeorm_1.Index)(['createdAt'])
], AssetAuditLog);
//# sourceMappingURL=asset-audit-log.entity.js.map