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
exports.AuditLog = exports.AuditAction = void 0;
const typeorm_1 = require("typeorm");
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["APPROVE"] = "APPROVE";
    AuditAction["REJECT"] = "REJECT";
    AuditAction["PUBLISH"] = "PUBLISH";
    AuditAction["ARCHIVE"] = "ARCHIVE";
    AuditAction["EXPORT"] = "EXPORT";
    AuditAction["IMPORT"] = "IMPORT";
    AuditAction["VIEW"] = "VIEW";
    AuditAction["ASSIGN"] = "ASSIGN";
    AuditAction["COMMENT"] = "COMMENT";
    AuditAction["STATUS_CHANGE"] = "STATUS_CHANGE";
    AuditAction["PERMISSION_GRANT"] = "PERMISSION_GRANT";
    AuditAction["PERMISSION_REVOKE"] = "PERMISSION_REVOKE";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
let AuditLog = class AuditLog {
    static trackChanges(oldValue, newValue) {
        if (typeof oldValue !== 'object' || typeof newValue !== 'object') {
            return { old: oldValue, new: newValue };
        }
        const changes = {};
        const allKeys = new Set([...Object.keys(oldValue || {}), ...Object.keys(newValue || {})]);
        allKeys.forEach(key => {
            if (JSON.stringify(oldValue === null || oldValue === void 0 ? void 0 : oldValue[key]) !== JSON.stringify(newValue === null || newValue === void 0 ? void 0 : newValue[key])) {
                changes[key] = {
                    old: oldValue === null || oldValue === void 0 ? void 0 : oldValue[key],
                    new: newValue === null || newValue === void 0 ? void 0 : newValue[key],
                };
            }
        });
        return changes;
    }
};
exports.AuditLog = AuditLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], AuditLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AuditAction,
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AuditLog.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], AuditLog.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "changes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], AuditLog.prototype, "timestamp", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, typeorm_1.Entity)('audit_logs'),
    (0, typeorm_1.Index)(['entityType', 'entityId']),
    (0, typeorm_1.Index)(['userId', 'timestamp']),
    (0, typeorm_1.Index)(['action', 'timestamp']),
    (0, typeorm_1.Index)(['timestamp'])
], AuditLog);
//# sourceMappingURL=audit-log.entity.js.map