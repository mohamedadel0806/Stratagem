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
exports.GovernancePermission = exports.GovernanceAction = exports.GovernanceModule = void 0;
const typeorm_1 = require("typeorm");
var GovernanceModule;
(function (GovernanceModule) {
    GovernanceModule["INFLUENCERS"] = "influencers";
    GovernanceModule["POLICIES"] = "policies";
    GovernanceModule["STANDARDS"] = "standards";
    GovernanceModule["CONTROLS"] = "controls";
    GovernanceModule["ASSESSMENTS"] = "assessments";
    GovernanceModule["EVIDENCE"] = "evidence";
    GovernanceModule["FINDINGS"] = "findings";
    GovernanceModule["SOPS"] = "sops";
    GovernanceModule["REPORTING"] = "reporting";
    GovernanceModule["ADMIN"] = "admin";
})(GovernanceModule || (exports.GovernanceModule = GovernanceModule = {}));
var GovernanceAction;
(function (GovernanceAction) {
    GovernanceAction["CREATE"] = "create";
    GovernanceAction["READ"] = "read";
    GovernanceAction["UPDATE"] = "update";
    GovernanceAction["DELETE"] = "delete";
    GovernanceAction["PUBLISH"] = "publish";
    GovernanceAction["APPROVE"] = "approve";
    GovernanceAction["ASSIGN"] = "assign";
    GovernanceAction["EXPORT"] = "export";
    GovernanceAction["CONFIGURE"] = "configure";
})(GovernanceAction || (exports.GovernanceAction = GovernanceAction = {}));
let GovernancePermission = class GovernancePermission {
};
exports.GovernancePermission = GovernancePermission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GovernancePermission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], GovernancePermission.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: GovernanceModule,
    }),
    __metadata("design:type", String)
], GovernancePermission.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: GovernanceAction,
    }),
    __metadata("design:type", String)
], GovernancePermission.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, name: 'resource_type' }),
    __metadata("design:type", String)
], GovernancePermission.prototype, "resource_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], GovernancePermission.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GovernancePermission.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], GovernancePermission.prototype, "updated_at", void 0);
exports.GovernancePermission = GovernancePermission = __decorate([
    (0, typeorm_1.Entity)('governance_permissions'),
    (0, typeorm_1.Index)(['role']),
    (0, typeorm_1.Index)(['module']),
    (0, typeorm_1.Index)(['role', 'module', 'action'])
], GovernancePermission);
//# sourceMappingURL=governance-permission.entity.js.map