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
var DeadlineWorkflowScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeadlineWorkflowScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const workflow_service_1 = require("../services/workflow.service");
const workflow_entity_1 = require("../entities/workflow.entity");
const compliance_requirement_entity_1 = require("../../common/entities/compliance-requirement.entity");
const policy_entity_1 = require("../../policy/entities/policy.entity");
const task_entity_1 = require("../../common/entities/task.entity");
let DeadlineWorkflowScheduler = DeadlineWorkflowScheduler_1 = class DeadlineWorkflowScheduler {
    constructor(workflowService, workflowRepository, requirementRepository, policyRepository, taskRepository) {
        this.workflowService = workflowService;
        this.workflowRepository = workflowRepository;
        this.requirementRepository = requirementRepository;
        this.policyRepository = policyRepository;
        this.taskRepository = taskRepository;
        this.logger = new common_1.Logger(DeadlineWorkflowScheduler_1.name);
    }
    async handleDeadlineWorkflows() {
        this.logger.log('Checking deadline workflows...');
        const workflows = await this.workflowRepository.find({
            where: {
                trigger: workflow_entity_1.WorkflowTrigger.ON_DEADLINE_APPROACHING,
                status: workflow_entity_1.WorkflowStatus.ACTIVE,
            },
        });
        for (const workflow of workflows) {
            try {
                await this.processDeadlineWorkflow(workflow);
            }
            catch (error) {
                this.logger.error(`Error processing deadline workflow ${workflow.id}:`, error);
            }
        }
        const passedDeadlineWorkflows = await this.workflowRepository.find({
            where: {
                trigger: workflow_entity_1.WorkflowTrigger.ON_DEADLINE_PASSED,
                status: workflow_entity_1.WorkflowStatus.ACTIVE,
            },
        });
        for (const workflow of passedDeadlineWorkflows) {
            try {
                await this.processPassedDeadlineWorkflow(workflow);
            }
            catch (error) {
                this.logger.error(`Error processing passed deadline workflow ${workflow.id}:`, error);
            }
        }
    }
    async processDeadlineWorkflow(workflow) {
        var _a;
        const daysBefore = workflow.daysBeforeDeadline || 30;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysBefore);
        let entities = [];
        switch (workflow.entityType) {
            case workflow_entity_1.EntityType.COMPLIANCE_REQUIREMENT:
                if ((_a = workflow.conditions) === null || _a === void 0 ? void 0 : _a.complianceDeadline) {
                    entities = await this.requirementRepository.find({
                        where: {
                            complianceDeadline: (0, typeorm_2.LessThanOrEqual)(targetDate.toISOString().split('T')[0]),
                        },
                    });
                }
                break;
            case workflow_entity_1.EntityType.POLICY:
                entities = await this.policyRepository.find({
                    where: {
                        reviewDate: (0, typeorm_2.LessThanOrEqual)(targetDate),
                    },
                });
                break;
            case workflow_entity_1.EntityType.TASK:
                entities = await this.taskRepository.find({
                    where: {
                        dueDate: (0, typeorm_2.LessThanOrEqual)(targetDate),
                    },
                });
                break;
        }
        for (const entity of entities) {
            const hasExecution = await this.workflowService.checkAndTriggerWorkflows(workflow.entityType, entity.id, workflow_entity_1.WorkflowTrigger.ON_DEADLINE_APPROACHING, Object.assign({}, entity));
        }
    }
    async processPassedDeadlineWorkflow(workflow) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let entities = [];
        switch (workflow.entityType) {
            case workflow_entity_1.EntityType.COMPLIANCE_REQUIREMENT:
                entities = await this.requirementRepository.find({
                    where: {
                        complianceDeadline: (0, typeorm_2.LessThanOrEqual)(today.toISOString().split('T')[0]),
                    },
                });
                break;
            case workflow_entity_1.EntityType.POLICY:
                entities = await this.policyRepository.find({
                    where: {
                        reviewDate: (0, typeorm_2.LessThanOrEqual)(today),
                    },
                });
                break;
            case workflow_entity_1.EntityType.TASK:
                entities = await this.taskRepository.find({
                    where: {
                        dueDate: (0, typeorm_2.LessThanOrEqual)(today),
                    },
                });
                break;
        }
        for (const entity of entities) {
            await this.workflowService.checkAndTriggerWorkflows(workflow.entityType, entity.id, workflow_entity_1.WorkflowTrigger.ON_DEADLINE_PASSED, Object.assign({}, entity));
        }
    }
};
exports.DeadlineWorkflowScheduler = DeadlineWorkflowScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeadlineWorkflowScheduler.prototype, "handleDeadlineWorkflows", null);
exports.DeadlineWorkflowScheduler = DeadlineWorkflowScheduler = DeadlineWorkflowScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(workflow_entity_1.Workflow)),
    __param(2, (0, typeorm_1.InjectRepository)(compliance_requirement_entity_1.ComplianceRequirement)),
    __param(3, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(4, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [workflow_service_1.WorkflowService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DeadlineWorkflowScheduler);
//# sourceMappingURL=deadline-workflow.scheduler.js.map