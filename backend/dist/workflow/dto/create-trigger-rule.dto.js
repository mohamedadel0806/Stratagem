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
exports.CreateWorkflowTriggerRuleDto = exports.TriggerConditionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const workflow_entity_1 = require("../entities/workflow.entity");
const workflow_trigger_rule_entity_1 = require("../entities/workflow-trigger-rule.entity");
class TriggerConditionDto {
}
exports.TriggerConditionDto = TriggerConditionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriggerConditionDto.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(workflow_trigger_rule_entity_1.RuleOperator),
    __metadata("design:type", String)
], TriggerConditionDto.prototype, "operator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], TriggerConditionDto.prototype, "value", void 0);
class CreateWorkflowTriggerRuleDto {
}
exports.CreateWorkflowTriggerRuleDto = CreateWorkflowTriggerRuleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkflowTriggerRuleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWorkflowTriggerRuleDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(workflow_entity_1.EntityType),
    __metadata("design:type", String)
], CreateWorkflowTriggerRuleDto.prototype, "entityType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(workflow_entity_1.WorkflowTrigger),
    __metadata("design:type", String)
], CreateWorkflowTriggerRuleDto.prototype, "trigger", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TriggerConditionDto),
    __metadata("design:type", Array)
], CreateWorkflowTriggerRuleDto.prototype, "conditions", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateWorkflowTriggerRuleDto.prototype, "workflowId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateWorkflowTriggerRuleDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateWorkflowTriggerRuleDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-trigger-rule.dto.js.map