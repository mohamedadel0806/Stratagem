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
exports.PolicyApproval = exports.ApprovalStatus = void 0;
const typeorm_1 = require("typeorm");
const policy_entity_1 = require("./policy.entity");
const user_entity_1 = require("../../../users/entities/user.entity");
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "pending";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
    ApprovalStatus["REVOKED"] = "revoked";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
let PolicyApproval = class PolicyApproval {
};
exports.PolicyApproval = PolicyApproval;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PolicyApproval.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'policy_id' }),
    __metadata("design:type", String)
], PolicyApproval.prototype, "policy_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => policy_entity_1.Policy, (policy) => policy.approvals, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'policy_id' }),
    __metadata("design:type", policy_entity_1.Policy)
], PolicyApproval.prototype, "policy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'approver_id' }),
    __metadata("design:type", String)
], PolicyApproval.prototype, "approver_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'approver_id' }),
    __metadata("design:type", user_entity_1.User)
], PolicyApproval.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ApprovalStatus,
        default: ApprovalStatus.PENDING,
    }),
    __metadata("design:type", String)
], PolicyApproval.prototype, "approval_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], PolicyApproval.prototype, "sequence_order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PolicyApproval.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PolicyApproval.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'approved_at' }),
    __metadata("design:type", Date)
], PolicyApproval.prototype, "approved_at", void 0);
exports.PolicyApproval = PolicyApproval = __decorate([
    (0, typeorm_1.Entity)('policy_approvals'),
    (0, typeorm_1.Index)(['policy_id', 'approval_status']),
    (0, typeorm_1.Index)(['approver_id']),
    (0, typeorm_1.Index)(['approval_status'])
], PolicyApproval);
//# sourceMappingURL=policy-approval.entity.js.map