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
exports.Workflow = exports.EntityType = exports.WorkflowTrigger = exports.WorkflowStatus = exports.WorkflowType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var WorkflowType;
(function (WorkflowType) {
    WorkflowType["APPROVAL"] = "approval";
    WorkflowType["NOTIFICATION"] = "notification";
    WorkflowType["ESCALATION"] = "escalation";
    WorkflowType["STATUS_CHANGE"] = "status_change";
    WorkflowType["DEADLINE_REMINDER"] = "deadline_reminder";
})(WorkflowType || (exports.WorkflowType = WorkflowType = {}));
var WorkflowStatus;
(function (WorkflowStatus) {
    WorkflowStatus["ACTIVE"] = "active";
    WorkflowStatus["INACTIVE"] = "inactive";
    WorkflowStatus["ARCHIVED"] = "archived";
})(WorkflowStatus || (exports.WorkflowStatus = WorkflowStatus = {}));
var WorkflowTrigger;
(function (WorkflowTrigger) {
    WorkflowTrigger["MANUAL"] = "manual";
    WorkflowTrigger["ON_CREATE"] = "on_create";
    WorkflowTrigger["ON_UPDATE"] = "on_update";
    WorkflowTrigger["ON_STATUS_CHANGE"] = "on_status_change";
    WorkflowTrigger["ON_DEADLINE_APPROACHING"] = "on_deadline_approaching";
    WorkflowTrigger["ON_DEADLINE_PASSED"] = "on_deadline_passed";
    WorkflowTrigger["SCHEDULED"] = "scheduled";
})(WorkflowTrigger || (exports.WorkflowTrigger = WorkflowTrigger = {}));
var EntityType;
(function (EntityType) {
    EntityType["RISK"] = "risk";
    EntityType["POLICY"] = "policy";
    EntityType["COMPLIANCE_REQUIREMENT"] = "compliance_requirement";
    EntityType["TASK"] = "task";
    EntityType["SOP"] = "sop";
})(EntityType || (exports.EntityType = EntityType = {}));
let Workflow = class Workflow {
};
exports.Workflow = Workflow;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Workflow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Workflow.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Workflow.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WorkflowType,
    }),
    __metadata("design:type", String)
], Workflow.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WorkflowStatus,
        default: WorkflowStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Workflow.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WorkflowTrigger,
    }),
    __metadata("design:type", String)
], Workflow.prototype, "trigger", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EntityType,
    }),
    __metadata("design:type", String)
], Workflow.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Workflow.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Workflow.prototype, "actions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Workflow.prototype, "daysBeforeDeadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Workflow.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Workflow.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], Workflow.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Workflow.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Workflow.prototype, "updatedAt", void 0);
exports.Workflow = Workflow = __decorate([
    (0, typeorm_1.Entity)('workflows')
], Workflow);
//# sourceMappingURL=workflow.entity.js.map