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
var WorkflowProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const workflow_service_1 = require("../../../workflow/services/workflow.service");
let WorkflowProcessor = WorkflowProcessor_1 = class WorkflowProcessor {
    constructor(workflowService) {
        this.workflowService = workflowService;
        this.logger = new common_1.Logger(WorkflowProcessor_1.name);
    }
    onActive(job) {
        this.logger.debug(`Processing workflow job ${job.id} of type ${job.name}`);
    }
    onCompleted(job, result) {
        this.logger.log(`Workflow job ${job.id} completed: ${JSON.stringify(result)}`);
    }
    onFailed(job, error) {
        this.logger.error(`Workflow job ${job.id} failed: ${error.message}`, error.stack);
    }
    async handleWorkflowExecution(job) {
        const { workflowId, entityType, entityId, executionId } = job.data;
        try {
            this.logger.log(`Executing workflow ${workflowId} for ${entityType}:${entityId} (execution: ${executionId})`);
            await job.progress(10);
            const execution = await this.workflowService.executeWorkflowActionsForExecution(executionId);
            await job.progress(100);
            this.logger.log(`Workflow execution ${executionId} completed successfully`);
            return {
                success: true,
                executionId: execution.id,
                status: execution.status,
            };
        }
        catch (error) {
            this.logger.error(`Failed to execute workflow ${workflowId} (execution: ${executionId}): ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.WorkflowProcessor = WorkflowProcessor;
__decorate([
    (0, bull_1.OnQueueActive)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkflowProcessor.prototype, "onActive", null);
__decorate([
    (0, bull_1.OnQueueCompleted)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WorkflowProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bull_1.OnQueueFailed)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", void 0)
], WorkflowProcessor.prototype, "onFailed", null);
__decorate([
    (0, bull_1.Process)('EXECUTE_WORKFLOW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkflowProcessor.prototype, "handleWorkflowExecution", null);
exports.WorkflowProcessor = WorkflowProcessor = WorkflowProcessor_1 = __decorate([
    (0, bull_1.Processor)('governance:policy'),
    __metadata("design:paramtypes", [workflow_service_1.WorkflowService])
], WorkflowProcessor);
//# sourceMappingURL=workflow-processor.js.map