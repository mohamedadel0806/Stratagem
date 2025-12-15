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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const workflow_service_1 = require("../services/workflow.service");
const workflow_templates_service_1 = require("../services/workflow-templates.service");
const create_workflow_dto_1 = require("../dto/create-workflow.dto");
const workflow_response_dto_1 = require("../dto/workflow-response.dto");
const approve_request_dto_1 = require("../dto/approve-request.dto");
const approval_response_dto_1 = require("../dto/approval-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const workflow_entity_1 = require("../entities/workflow.entity");
const workflow_execution_entity_1 = require("../entities/workflow-execution.entity");
let WorkflowController = class WorkflowController {
    constructor(workflowService, templatesService) {
        this.workflowService = workflowService;
        this.templatesService = templatesService;
    }
    async create(createDto, user) {
        return this.workflowService.create(createDto, user.userId);
    }
    async findAll() {
        try {
            return await this.workflowService.findAll();
        }
        catch (error) {
            console.error('Error getting workflows:', error);
            return [];
        }
    }
    async getMyPendingApprovals(user) {
        try {
            if (!(user === null || user === void 0 ? void 0 : user.userId)) {
                console.error('No user ID found in request');
                return [];
            }
            return await this.workflowService.getPendingApprovalsForUser(user.userId);
        }
        catch (error) {
            console.error('Error getting pending approvals:', error);
            return [];
        }
    }
    async findOne(id) {
        return this.workflowService.findOne(id);
    }
    async update(id, updateDto) {
        return this.workflowService.update(id, updateDto);
    }
    async remove(id) {
        await this.workflowService.remove(id);
        return { message: 'Workflow deleted successfully' };
    }
    async execute(id, body) {
        const execution = await this.workflowService.executeWorkflow(id, body.entityType, body.entityId, body.inputData);
        return {
            message: 'Workflow executed successfully',
            executionId: execution.id,
        };
    }
    async getExecutionHistory(workflowId, entityType, status, limit) {
        return this.workflowService.getExecutionHistory({
            workflowId,
            entityType,
            status,
            limit: limit ? Number(limit) : undefined,
        });
    }
    async getExecutionById(executionId) {
        return this.workflowService.getExecutionById(executionId);
    }
    async getApprovals(executionId) {
        return this.workflowService.getApprovals(executionId);
    }
    async approve(approvalId, approveDto, user) {
        await this.workflowService.approve(approvalId, user.userId, approveDto.status, approveDto.comments, approveDto.signature);
        return { message: 'Approval updated successfully' };
    }
    async getSignature(approvalId) {
        const approval = await this.workflowService.getApprovalById(approvalId);
        return {
            id: approval.id,
            signatureData: approval.signatureData,
            signatureTimestamp: approval.signatureTimestamp,
            signatureMethod: approval.signatureMethod,
            signatureMetadata: approval.signatureMetadata,
            approverName: approval.approverName,
        };
    }
    async getTemplates() {
        try {
            const templates = this.templatesService.getTemplates();
            return templates || [];
        }
        catch (error) {
            console.error('Error getting workflow templates:', error);
            console.error('Error stack:', error === null || error === void 0 ? void 0 : error.stack);
            console.error('Error details:', {
                message: error === null || error === void 0 ? void 0 : error.message,
                name: error === null || error === void 0 ? void 0 : error.name,
                cause: error === null || error === void 0 ? void 0 : error.cause,
            });
            return [];
        }
    }
    async getTemplate(id) {
        return this.templatesService.getTemplateById(id);
    }
    async instantiateTemplate(id, body, user) {
        const template = this.templatesService.getTemplateById(id);
        if (!template) {
            throw new common_1.NotFoundException(`Template with ID ${id} not found`);
        }
        const workflowData = Object.assign(Object.assign({}, template.workflow), { name: body.name || template.name, description: body.description || template.description, actions: body.actions || template.workflow.actions });
        return this.workflowService.create(workflowData, user.userId);
    }
};
exports.WorkflowController = WorkflowController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new workflow' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Workflow created successfully', type: workflow_response_dto_1.WorkflowResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_workflow_dto_1.CreateWorkflowDto, Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all workflows' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of workflows', type: [workflow_response_dto_1.WorkflowResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-approvals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending approvals for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of pending approvals' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getMyPendingApprovals", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workflow by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Workflow ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow details', type: workflow_response_dto_1.WorkflowResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a workflow' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Workflow ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow updated successfully', type: workflow_response_dto_1.WorkflowResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a workflow' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Workflow ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/execute'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually execute a workflow' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Workflow ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow executed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "execute", null);
__decorate([
    (0, common_1.Get)('executions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workflow execution history' }),
    (0, swagger_1.ApiQuery)({ name: 'workflowId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'entityType', required: false, enum: workflow_entity_1.EntityType }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: workflow_execution_entity_1.WorkflowExecutionStatus }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of workflow executions' }),
    __param(0, (0, common_1.Query)('workflowId')),
    __param(1, (0, common_1.Query)('entityType')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getExecutionHistory", null);
__decorate([
    (0, common_1.Get)('executions/:executionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workflow execution details' }),
    (0, swagger_1.ApiParam)({ name: 'executionId', description: 'Workflow execution ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Execution details with approvals' }),
    __param(0, (0, common_1.Param)('executionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getExecutionById", null);
__decorate([
    (0, common_1.Get)('executions/:executionId/approvals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get approvals for a workflow execution' }),
    (0, swagger_1.ApiParam)({ name: 'executionId', description: 'Workflow execution ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of approvals', type: [approval_response_dto_1.ApprovalResponseDto] }),
    __param(0, (0, common_1.Param)('executionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getApprovals", null);
__decorate([
    (0, common_1.Patch)('approvals/:approvalId'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or reject a workflow step' }),
    (0, swagger_1.ApiParam)({ name: 'approvalId', description: 'Approval ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Approval updated successfully' }),
    __param(0, (0, common_1.Param)('approvalId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_request_dto_1.ApproveRequestDto, Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "approve", null);
__decorate([
    (0, common_1.Get)('approvals/:approvalId/signature'),
    (0, swagger_1.ApiOperation)({ summary: 'Get signature for an approval' }),
    (0, swagger_1.ApiParam)({ name: 'approvalId', description: 'Approval ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Signature data' }),
    __param(0, (0, common_1.Param)('approvalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getSignature", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workflow templates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of workflow templates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)('templates/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workflow template by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Template ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow template details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Post)('templates/:id/instantiate'),
    (0, swagger_1.ApiOperation)({ summary: 'Create workflow from template' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Template ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Workflow created from template', type: workflow_response_dto_1.WorkflowResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "instantiateTemplate", null);
exports.WorkflowController = WorkflowController = __decorate([
    (0, swagger_1.ApiTags)('workflows'),
    (0, common_1.Controller)('api/v1/workflows'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [workflow_service_1.WorkflowService,
        workflow_templates_service_1.WorkflowTemplatesService])
], WorkflowController);
//# sourceMappingURL=workflow.controller.js.map