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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WorkflowTriggerRulesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowTriggerRulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const workflow_trigger_rule_entity_1 = require("../entities/workflow-trigger-rule.entity");
let WorkflowTriggerRulesService = WorkflowTriggerRulesService_1 = class WorkflowTriggerRulesService {
    constructor(ruleRepository) {
        this.ruleRepository = ruleRepository;
        this.logger = new common_1.Logger(WorkflowTriggerRulesService_1.name);
    }
    async create(dto, userId) {
        const rule = this.ruleRepository.create(Object.assign(Object.assign({}, dto), { created_by: userId }));
        return this.ruleRepository.save(rule);
    }
    async findAll() {
        return this.ruleRepository.find({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['workflow', 'creator'],
            order: { priority: 'DESC', created_at: 'DESC' },
        });
    }
    async findOne(id) {
        const rule = await this.ruleRepository.findOne({
            where: { id, deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['workflow', 'creator'],
        });
        if (!rule) {
            throw new common_1.NotFoundException(`Workflow rule with ID ${id} not found`);
        }
        return rule;
    }
    async update(id, dto, userId) {
        const rule = await this.findOne(id);
        Object.assign(rule, dto);
        return this.ruleRepository.save(rule);
    }
    async remove(id) {
        const rule = await this.findOne(id);
        await this.ruleRepository.softDelete(id);
    }
    async getMatchingWorkflows(entityType, trigger, entityData) {
        const rules = await this.ruleRepository.find({
            where: {
                entityType,
                trigger,
                isActive: true,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
            order: { priority: 'DESC' },
        });
        const matchingWorkflowIds = [];
        for (const rule of rules) {
            if (this.evaluateRule(rule, entityData)) {
                matchingWorkflowIds.push(rule.workflowId);
            }
        }
        return matchingWorkflowIds;
    }
    evaluateRule(rule, data) {
        if (!rule.conditions || rule.conditions.length === 0)
            return true;
        return rule.conditions.every((cond) => {
            const val = data[cond.field];
            const target = cond.value;
            switch (cond.operator) {
                case workflow_trigger_rule_entity_1.RuleOperator.EQUALS:
                    return val === target;
                case workflow_trigger_rule_entity_1.RuleOperator.NOT_EQUALS:
                    return val !== target;
                case workflow_trigger_rule_entity_1.RuleOperator.GREATER_THAN:
                    return val > target;
                case workflow_trigger_rule_entity_1.RuleOperator.LESS_THAN:
                    return val < target;
                case workflow_trigger_rule_entity_1.RuleOperator.CONTAINS:
                    return typeof val === 'string' && val.includes(target);
                case workflow_trigger_rule_entity_1.RuleOperator.IN:
                    return Array.isArray(target) && target.includes(val);
                default:
                    return false;
            }
        });
    }
};
exports.WorkflowTriggerRulesService = WorkflowTriggerRulesService;
exports.WorkflowTriggerRulesService = WorkflowTriggerRulesService = WorkflowTriggerRulesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(workflow_trigger_rule_entity_1.WorkflowTriggerRule)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WorkflowTriggerRulesService);
//# sourceMappingURL=workflow-trigger-rules.service.js.map