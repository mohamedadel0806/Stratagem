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
exports.WorkflowApproval = exports.ApprovalStatus = void 0;
const typeorm_1 = require("typeorm");
const workflow_execution_entity_1 = require("./workflow-execution.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "pending";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
    ApprovalStatus["CANCELLED"] = "cancelled";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
let WorkflowApproval = class WorkflowApproval {
};
exports.WorkflowApproval = WorkflowApproval;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkflowApproval.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'workflowExecutionId' }),
    __metadata("design:type", String)
], WorkflowApproval.prototype, "workflowExecutionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => workflow_execution_entity_1.WorkflowExecution),
    (0, typeorm_1.JoinColumn)({ name: 'workflowExecutionId' }),
    __metadata("design:type", workflow_execution_entity_1.WorkflowExecution)
], WorkflowApproval.prototype, "workflowExecution", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'approverId' }),
    __metadata("design:type", String)
], WorkflowApproval.prototype, "approverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'approverId' }),
    __metadata("design:type", user_entity_1.User)
], WorkflowApproval.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ApprovalStatus,
        default: ApprovalStatus.PENDING,
    }),
    __metadata("design:type", String)
], WorkflowApproval.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkflowApproval.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'signature_data' }),
    __metadata("design:type", String)
], WorkflowApproval.prototype, "signatureData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'signature_timestamp' }),
    __metadata("design:type", Date)
], WorkflowApproval.prototype, "signatureTimestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true, name: 'signature_method' }),
    __metadata("design:type", String)
], WorkflowApproval.prototype, "signatureMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'signature_metadata' }),
    __metadata("design:type", Object)
], WorkflowApproval.prototype, "signatureMetadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'stepOrder' }),
    __metadata("design:type", Number)
], WorkflowApproval.prototype, "stepOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'respondedAt' }),
    __metadata("design:type", Date)
], WorkflowApproval.prototype, "respondedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], WorkflowApproval.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt' }),
    __metadata("design:type", Date)
], WorkflowApproval.prototype, "updatedAt", void 0);
exports.WorkflowApproval = WorkflowApproval = __decorate([
    (0, typeorm_1.Entity)('workflow_approvals')
], WorkflowApproval);
//# sourceMappingURL=workflow-approval.entity.js.map