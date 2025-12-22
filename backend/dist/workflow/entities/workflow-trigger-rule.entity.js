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
exports.WorkflowTriggerRule = exports.RuleOperator = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const workflow_entity_1 = require("./workflow.entity");
const workflow_entity_2 = require("./workflow.entity");
var RuleOperator;
(function (RuleOperator) {
    RuleOperator["EQUALS"] = "eq";
    RuleOperator["NOT_EQUALS"] = "neq";
    RuleOperator["GREATER_THAN"] = "gt";
    RuleOperator["LESS_THAN"] = "lt";
    RuleOperator["CONTAINS"] = "contains";
    RuleOperator["IN"] = "in";
})(RuleOperator || (exports.RuleOperator = RuleOperator = {}));
let WorkflowTriggerRule = class WorkflowTriggerRule {
};
exports.WorkflowTriggerRule = WorkflowTriggerRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkflowTriggerRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], WorkflowTriggerRule.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkflowTriggerRule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: workflow_entity_2.EntityType,
    }),
    __metadata("design:type", String)
], WorkflowTriggerRule.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: workflow_entity_2.WorkflowTrigger,
    }),
    __metadata("design:type", String)
], WorkflowTriggerRule.prototype, "trigger", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'conditions' }),
    __metadata("design:type", Array)
], WorkflowTriggerRule.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'workflow_id' }),
    __metadata("design:type", String)
], WorkflowTriggerRule.prototype, "workflowId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => workflow_entity_1.Workflow, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'workflow_id' }),
    __metadata("design:type", workflow_entity_1.Workflow)
], WorkflowTriggerRule.prototype, "workflow", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], WorkflowTriggerRule.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], WorkflowTriggerRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], WorkflowTriggerRule.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], WorkflowTriggerRule.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WorkflowTriggerRule.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WorkflowTriggerRule.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], WorkflowTriggerRule.prototype, "deleted_at", void 0);
exports.WorkflowTriggerRule = WorkflowTriggerRule = __decorate([
    (0, typeorm_1.Entity)('workflow_trigger_rules'),
    (0, typeorm_1.Index)(['entityType', 'trigger']),
    (0, typeorm_1.Index)(['isActive'])
], WorkflowTriggerRule);
//# sourceMappingURL=workflow-trigger-rule.entity.js.map