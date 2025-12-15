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
var WorkflowService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const workflow_entity_1 = require("../entities/workflow.entity");
const workflow_execution_entity_1 = require("../entities/workflow-execution.entity");
const workflow_approval_entity_1 = require("../entities/workflow-approval.entity");
const policy_entity_1 = require("../../policy/entities/policy.entity");
const risk_entity_1 = require("../../risk/entities/risk.entity");
const compliance_requirement_entity_1 = require("../../common/entities/compliance-requirement.entity");
const task_entity_1 = require("../../common/entities/task.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let WorkflowService = WorkflowService_1 = class WorkflowService {
    constructor(workflowRepository, executionRepository, approvalRepository, policyRepository, riskRepository, requirementRepository, taskRepository, userRepository, notificationService, workflowQueue) {
        this.workflowRepository = workflowRepository;
        this.executionRepository = executionRepository;
        this.approvalRepository = approvalRepository;
        this.policyRepository = policyRepository;
        this.riskRepository = riskRepository;
        this.requirementRepository = requirementRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.workflowQueue = workflowQueue;
        this.logger = new common_1.Logger(WorkflowService_1.name);
    }
    async create(createDto, userId) {
        const workflow = this.workflowRepository.create(Object.assign(Object.assign({}, createDto), { createdById: userId }));
        const saved = await this.workflowRepository.save(workflow);
        return this.toResponseDto(saved);
    }
    async findAll() {
        try {
            const workflows = await this.workflowRepository.find({
                order: { createdAt: 'DESC' },
            });
            if (!workflows || workflows.length === 0) {
                return [];
            }
            return workflows.map(w => {
                try {
                    return this.toResponseDto(w);
                }
                catch (error) {
                    this.logger.error(`Error mapping workflow ${w.id}:`, error);
                    return {
                        id: w.id,
                        name: w.name || 'Unknown',
                        description: w.description || undefined,
                        type: w.type,
                        status: w.status,
                        trigger: w.trigger,
                        entityType: w.entityType,
                        conditions: w.conditions || undefined,
                        actions: w.actions || {},
                        daysBeforeDeadline: w.daysBeforeDeadline || undefined,
                        createdAt: w.createdAt ? new Date(w.createdAt).toISOString() : new Date().toISOString(),
                        updatedAt: w.updatedAt ? new Date(w.updatedAt).toISOString() : new Date().toISOString(),
                    };
                }
            });
        }
        catch (error) {
            this.logger.error('Error getting all workflows:', error);
            return [];
        }
    }
    async findOne(id) {
        const workflow = await this.workflowRepository.findOne({ where: { id } });
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow with ID ${id} not found`);
        }
        return this.toResponseDto(workflow);
    }
    async update(id, updateDto) {
        const workflow = await this.workflowRepository.findOne({ where: { id } });
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow with ID ${id} not found`);
        }
        Object.assign(workflow, updateDto);
        const updated = await this.workflowRepository.save(workflow);
        return this.toResponseDto(updated);
    }
    async remove(id) {
        const workflow = await this.workflowRepository.findOne({ where: { id } });
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow with ID ${id} not found`);
        }
        await this.workflowRepository.remove(workflow);
    }
    async executeWorkflow(workflowId, entityType, entityId, inputData) {
        const workflow = await this.workflowRepository.findOne({ where: { id: workflowId } });
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow with ID ${workflowId} not found`);
        }
        if (workflow.status !== workflow_entity_1.WorkflowStatus.ACTIVE) {
            throw new Error('Workflow is not active');
        }
        const execution = this.executionRepository.create({
            workflowId: workflow.id,
            entityType,
            entityId,
            status: workflow_execution_entity_1.WorkflowExecutionStatus.IN_PROGRESS,
            inputData,
            startedAt: new Date(),
        });
        const savedExecution = await this.executionRepository.save(execution);
        try {
            await this.executeActions(workflow, entityType, entityId, savedExecution.id);
            savedExecution.status = workflow_execution_entity_1.WorkflowExecutionStatus.COMPLETED;
            savedExecution.completedAt = new Date();
            await this.executionRepository.save(savedExecution);
            return savedExecution;
        }
        catch (error) {
            savedExecution.status = workflow_execution_entity_1.WorkflowExecutionStatus.FAILED;
            savedExecution.errorMessage = error.message;
            savedExecution.completedAt = new Date();
            await this.executionRepository.save(savedExecution);
            throw error;
        }
    }
    async queueWorkflowExecution(workflowId, entityType, entityId, inputData, triggeredBy) {
        const workflow = await this.workflowRepository.findOne({ where: { id: workflowId } });
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow with ID ${workflowId} not found`);
        }
        if (workflow.status !== workflow_entity_1.WorkflowStatus.ACTIVE) {
            throw new Error('Workflow is not active');
        }
        const execution = this.executionRepository.create({
            workflowId: workflow.id,
            entityType,
            entityId,
            status: workflow_execution_entity_1.WorkflowExecutionStatus.IN_PROGRESS,
            inputData,
            startedAt: new Date(),
        });
        const savedExecution = await this.executionRepository.save(execution);
        if (this.workflowQueue) {
            try {
                const job = await this.workflowQueue.add('EXECUTE_WORKFLOW', {
                    workflowId,
                    entityType,
                    entityId,
                    executionId: savedExecution.id,
                    inputData,
                    triggeredBy,
                    triggerType: triggeredBy ? 'manual' : 'automatic',
                }, {
                    attempts: 5,
                    backoff: {
                        type: 'exponential',
                        delay: 2000,
                    },
                    removeOnComplete: true,
                    removeOnFail: false,
                });
                this.logger.log(`Queued workflow ${workflowId} execution as job ${job.id}`);
                return {
                    executionId: savedExecution.id,
                    jobId: String(job.id),
                };
            }
            catch (error) {
                this.logger.error(`Failed to queue workflow execution: ${error.message}`, error.stack);
                this.logger.warn('Falling back to synchronous workflow execution');
            }
        }
        try {
            await this.executeWorkflow(workflowId, entityType, entityId, inputData);
            return {
                executionId: savedExecution.id,
                jobId: 'sync',
            };
        }
        catch (error) {
            savedExecution.status = workflow_execution_entity_1.WorkflowExecutionStatus.FAILED;
            savedExecution.errorMessage = error.message;
            savedExecution.completedAt = new Date();
            await this.executionRepository.save(savedExecution);
            throw error;
        }
    }
    async checkAndTriggerWorkflows(entityType, entityId, trigger, entityData, useQueue = true) {
        const workflows = await this.workflowRepository.find({
            where: {
                entityType,
                trigger,
                status: workflow_entity_1.WorkflowStatus.ACTIVE,
            },
        });
        for (const workflow of workflows) {
            if (this.checkConditions(workflow.conditions, entityData)) {
                if (useQueue && this.workflowQueue) {
                    await this.queueWorkflowExecution(workflow.id, entityType, entityId, entityData);
                }
                else {
                    await this.executeWorkflow(workflow.id, entityType, entityId, entityData);
                }
            }
        }
    }
    async checkDeadlineWorkflows() {
        const workflows = await this.workflowRepository.find({
            where: {
                trigger: (0, typeorm_2.In)(['on_deadline_approaching', 'on_deadline_passed']),
                status: workflow_entity_1.WorkflowStatus.ACTIVE,
            },
        });
        for (const workflow of workflows) {
            await this.processDeadlineWorkflow(workflow);
        }
    }
    async executeWorkflowActionsForExecution(executionId) {
        const execution = await this.executionRepository.findOne({
            where: { id: executionId },
            relations: ['workflow'],
        });
        if (!execution) {
            throw new common_1.NotFoundException(`Workflow execution with ID ${executionId} not found`);
        }
        if (execution.status !== workflow_execution_entity_1.WorkflowExecutionStatus.IN_PROGRESS) {
            this.logger.warn(`Execution ${executionId} is not in progress, current status: ${execution.status}`);
        }
        const workflow = execution.workflow;
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow for execution ${executionId} not found`);
        }
        if (workflow.status !== workflow_entity_1.WorkflowStatus.ACTIVE) {
            throw new Error('Workflow is not active');
        }
        try {
            await this.executeActions(workflow, execution.entityType, execution.entityId, execution.id);
            execution.status = workflow_execution_entity_1.WorkflowExecutionStatus.COMPLETED;
            execution.completedAt = new Date();
            await this.executionRepository.save(execution);
            return execution;
        }
        catch (error) {
            execution.status = workflow_execution_entity_1.WorkflowExecutionStatus.FAILED;
            execution.errorMessage = error.message;
            execution.completedAt = new Date();
            await this.executionRepository.save(execution);
            throw error;
        }
    }
    async executeActions(workflow, entityType, entityId, executionId) {
        const actions = workflow.actions || {};
        if (workflow.type === workflow_entity_1.WorkflowType.APPROVAL && actions.approvers && actions.approvers.length > 0) {
            await this.createApprovalSteps(executionId, actions.approvers, workflow.name, entityType, entityId);
        }
        if (actions.changeStatus) {
            await this.changeEntityStatus(entityType, entityId, actions.changeStatus);
        }
        if (actions.assignTo) {
            await this.assignEntity(entityType, entityId, actions.assignTo);
        }
        if (actions.notify && Array.isArray(actions.notify) && actions.notify.length > 0) {
            await this.sendNotifications(actions.notify, workflow.name, entityType, entityId);
        }
        if (actions.createTask) {
            await this.createTaskFromWorkflow(entityType, entityId, actions.createTask, actions.assignTo);
        }
    }
    async createApprovalSteps(executionId, approvers, workflowName, entityType, entityId) {
        for (let i = 0; i < approvers.length; i++) {
            await this.approvalRepository.save({
                workflowExecutionId: executionId,
                approverId: approvers[i],
                status: workflow_approval_entity_1.ApprovalStatus.PENDING,
                stepOrder: i + 1,
            });
            try {
                await this.notificationService.sendApprovalRequest(approvers[i], workflowName, entityType, entityId, executionId);
            }
            catch (error) {
                this.logger.error(`Failed to send approval notification to ${approvers[i]}:`, error);
            }
        }
    }
    async sendNotifications(userIds, workflowName, entityType, entityId) {
        for (const userId of userIds) {
            try {
                await this.notificationService.create({
                    userId,
                    type: notification_entity_1.NotificationType.GENERAL,
                    priority: notification_entity_1.NotificationPriority.MEDIUM,
                    title: 'Workflow Notification',
                    message: `Workflow "${workflowName}" has been triggered`,
                    entityType,
                    entityId,
                    actionUrl: `/dashboard/${entityType}s/${entityId}`,
                });
            }
            catch (error) {
                this.logger.error(`Failed to send notification to ${userId}:`, error);
            }
        }
    }
    async changeEntityStatus(entityType, entityId, newStatus) {
        switch (entityType) {
            case workflow_entity_1.EntityType.POLICY:
                const policy = await this.policyRepository.findOne({ where: { id: entityId } });
                if (policy) {
                    policy.status = newStatus;
                    await this.policyRepository.save(policy);
                }
                break;
            case workflow_entity_1.EntityType.RISK:
                const risk = await this.riskRepository.findOne({ where: { id: entityId } });
                if (risk) {
                    risk.status = newStatus;
                    await this.riskRepository.save(risk);
                }
                break;
            case workflow_entity_1.EntityType.COMPLIANCE_REQUIREMENT:
                const requirement = await this.requirementRepository.findOne({ where: { id: entityId } });
                if (requirement) {
                    requirement.status = newStatus;
                    await this.requirementRepository.save(requirement);
                }
                break;
        }
    }
    async assignEntity(entityType, entityId, assignToId) {
        const execution = await this.executionRepository.findOne({
            where: { entityType, entityId },
            order: { createdAt: 'DESC' },
        });
        if (execution) {
            execution.assignedToId = assignToId;
            await this.executionRepository.save(execution);
        }
    }
    async createTaskFromWorkflow(entityType, entityId, taskConfig, assignToId) {
        const taskAssigneeId = taskConfig.assigneeId || assignToId;
        const task = this.taskRepository.create({
            title: taskConfig.title,
            description: taskConfig.description || null,
            priority: taskConfig.priority || 'medium',
            dueDate: taskConfig.dueDate ? new Date(taskConfig.dueDate) : null,
            relatedEntityType: entityType,
            relatedEntityId: entityId,
            status: 'todo',
            assignedToId: taskAssigneeId || null,
        });
        const savedTask = await this.taskRepository.save(task);
        if (taskAssigneeId) {
            try {
                await this.notificationService.sendTaskAssigned(taskAssigneeId, taskConfig.title, savedTask.id);
            }
            catch (error) {
                this.logger.error(`Failed to send task notification to ${taskAssigneeId}:`, error);
            }
        }
    }
    checkConditions(conditions, entityData) {
        if (!conditions || !entityData) {
            return true;
        }
        for (const [key, value] of Object.entries(conditions)) {
            if (entityData[key] !== value) {
                return false;
            }
        }
        return true;
    }
    async processDeadlineWorkflow(workflow) {
        this.logger.debug(`Processing deadline workflow: ${workflow.name}`);
    }
    async getPendingApprovalsForUser(userId) {
        try {
            let approvals;
            try {
                approvals = await this.approvalRepository.find({
                    where: { approverId: userId, status: workflow_approval_entity_1.ApprovalStatus.PENDING },
                    relations: ['workflowExecution', 'workflowExecution.workflow'],
                    order: { createdAt: 'DESC' },
                });
            }
            catch (queryError) {
                this.logger.warn(`Failed to load approvals with relations, trying without relations:`, queryError);
                approvals = await this.approvalRepository.find({
                    where: { approverId: userId, status: workflow_approval_entity_1.ApprovalStatus.PENDING },
                    order: { createdAt: 'DESC' },
                });
            }
            if (!approvals || approvals.length === 0) {
                return [];
            }
            return approvals.map(a => {
                try {
                    const execution = a.workflowExecution;
                    const workflow = execution === null || execution === void 0 ? void 0 : execution.workflow;
                    return {
                        id: a.id || '',
                        workflowExecutionId: a.workflowExecutionId || '',
                        workflowName: (workflow === null || workflow === void 0 ? void 0 : workflow.name) || (execution === null || execution === void 0 ? void 0 : execution.workflowId) || 'Unknown Workflow',
                        workflowType: (workflow === null || workflow === void 0 ? void 0 : workflow.type) || null,
                        entityType: (execution === null || execution === void 0 ? void 0 : execution.entityType) || null,
                        entityId: (execution === null || execution === void 0 ? void 0 : execution.entityId) || null,
                        status: a.status || 'pending',
                        stepOrder: a.stepOrder || 0,
                        createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString(),
                    };
                }
                catch (error) {
                    this.logger.error(`Error mapping approval ${a === null || a === void 0 ? void 0 : a.id}:`, error);
                    return {
                        id: (a === null || a === void 0 ? void 0 : a.id) || '',
                        workflowExecutionId: (a === null || a === void 0 ? void 0 : a.workflowExecutionId) || '',
                        workflowName: 'Unknown',
                        workflowType: null,
                        entityType: null,
                        entityId: null,
                        status: (a === null || a === void 0 ? void 0 : a.status) || 'pending',
                        stepOrder: (a === null || a === void 0 ? void 0 : a.stepOrder) || 0,
                        createdAt: (a === null || a === void 0 ? void 0 : a.createdAt) ? new Date(a.createdAt).toISOString() : new Date().toISOString(),
                    };
                }
            });
        }
        catch (error) {
            this.logger.error(`Error getting pending approvals for user ${userId}:`, error);
            return [];
        }
    }
    async getExecutionHistory(options) {
        try {
            const queryBuilder = this.executionRepository
                .createQueryBuilder('execution')
                .leftJoinAndSelect('execution.workflow', 'workflow')
                .orderBy('execution.createdAt', 'DESC');
            if (options === null || options === void 0 ? void 0 : options.workflowId) {
                queryBuilder.andWhere('execution.workflowId = :workflowId', { workflowId: options.workflowId });
            }
            if (options === null || options === void 0 ? void 0 : options.entityType) {
                queryBuilder.andWhere('execution.entityType = :entityType', { entityType: options.entityType });
            }
            if (options === null || options === void 0 ? void 0 : options.status) {
                queryBuilder.andWhere('execution.status = :status', { status: options.status });
            }
            queryBuilder.take((options === null || options === void 0 ? void 0 : options.limit) || 50);
            const executions = await queryBuilder.getMany();
            if (!executions || executions.length === 0) {
                return [];
            }
            return executions.map(e => {
                var _a, _b, _c, _d;
                try {
                    return {
                        id: e.id,
                        workflowId: e.workflowId,
                        workflowName: ((_a = e.workflow) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                        workflowType: ((_b = e.workflow) === null || _b === void 0 ? void 0 : _b.type) || null,
                        entityType: e.entityType || null,
                        entityId: e.entityId || null,
                        status: e.status,
                        errorMessage: e.errorMessage || undefined,
                        startedAt: ((_c = e.startedAt) === null || _c === void 0 ? void 0 : _c.toISOString()) || null,
                        completedAt: ((_d = e.completedAt) === null || _d === void 0 ? void 0 : _d.toISOString()) || null,
                        createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
                    };
                }
                catch (error) {
                    this.logger.error(`Error mapping execution ${e === null || e === void 0 ? void 0 : e.id}:`, error);
                    return {
                        id: (e === null || e === void 0 ? void 0 : e.id) || '',
                        workflowId: (e === null || e === void 0 ? void 0 : e.workflowId) || '',
                        workflowName: 'Unknown',
                        workflowType: null,
                        entityType: null,
                        entityId: null,
                        status: (e === null || e === void 0 ? void 0 : e.status) || 'pending',
                        errorMessage: undefined,
                        startedAt: null,
                        completedAt: null,
                        createdAt: new Date().toISOString(),
                    };
                }
            });
        }
        catch (error) {
            this.logger.error('Error getting execution history:', error);
            return [];
        }
    }
    async getExecutionById(executionId) {
        var _a, _b, _c, _d;
        const execution = await this.executionRepository.findOne({
            where: { id: executionId },
            relations: ['workflow'],
        });
        if (!execution) {
            throw new common_1.NotFoundException(`Execution with ID ${executionId} not found`);
        }
        const approvals = await this.getApprovals(executionId);
        return {
            id: execution.id,
            workflowId: execution.workflowId,
            workflowName: ((_a = execution.workflow) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
            workflowType: (_b = execution.workflow) === null || _b === void 0 ? void 0 : _b.type,
            entityType: execution.entityType,
            entityId: execution.entityId,
            status: execution.status,
            errorMessage: execution.errorMessage || undefined,
            inputData: execution.inputData || undefined,
            startedAt: (_c = execution.startedAt) === null || _c === void 0 ? void 0 : _c.toISOString(),
            completedAt: (_d = execution.completedAt) === null || _d === void 0 ? void 0 : _d.toISOString(),
            createdAt: execution.createdAt.toISOString(),
            approvals,
        };
    }
    async getApprovals(executionId) {
        const approvals = await this.approvalRepository.find({
            where: { workflowExecutionId: executionId },
            relations: ['approver'],
            order: { stepOrder: 'ASC' },
        });
        return approvals.map(a => {
            var _a, _b, _c, _d, _e;
            return ({
                id: a.id,
                workflowExecutionId: a.workflowExecutionId,
                approverId: a.approverId,
                approverName: `${((_a = a.approver) === null || _a === void 0 ? void 0 : _a.firstName) || ''} ${((_b = a.approver) === null || _b === void 0 ? void 0 : _b.lastName) || ''}`.trim() || ((_c = a.approver) === null || _c === void 0 ? void 0 : _c.email) || 'Unknown',
                status: a.status,
                comments: a.comments || undefined,
                stepOrder: a.stepOrder,
                respondedAt: ((_d = a.respondedAt) === null || _d === void 0 ? void 0 : _d.toISOString()) || undefined,
                createdAt: a.createdAt.toISOString(),
                signatureData: a.signatureData,
                signatureTimestamp: ((_e = a.signatureTimestamp) === null || _e === void 0 ? void 0 : _e.toISOString()) || undefined,
                signatureMethod: a.signatureMethod,
                signatureMetadata: a.signatureMetadata,
            });
        });
    }
    async getApprovalById(approvalId) {
        var _a, _b, _c, _d, _e;
        const approval = await this.approvalRepository.findOne({
            where: { id: approvalId },
            relations: ['approver'],
        });
        if (!approval) {
            throw new common_1.NotFoundException(`Approval with ID ${approvalId} not found`);
        }
        return {
            id: approval.id,
            workflowExecutionId: approval.workflowExecutionId,
            approverId: approval.approverId,
            approverName: `${((_a = approval.approver) === null || _a === void 0 ? void 0 : _a.firstName) || ''} ${((_b = approval.approver) === null || _b === void 0 ? void 0 : _b.lastName) || ''}`.trim() || ((_c = approval.approver) === null || _c === void 0 ? void 0 : _c.email) || 'Unknown',
            status: approval.status,
            comments: approval.comments || undefined,
            stepOrder: approval.stepOrder,
            respondedAt: ((_d = approval.respondedAt) === null || _d === void 0 ? void 0 : _d.toISOString()) || undefined,
            createdAt: approval.createdAt.toISOString(),
            signatureData: approval.signatureData,
            signatureTimestamp: ((_e = approval.signatureTimestamp) === null || _e === void 0 ? void 0 : _e.toISOString()) || undefined,
            signatureMethod: approval.signatureMethod,
            signatureMetadata: approval.signatureMetadata,
        };
    }
    async approve(approvalId, userId, status, comments, signatureData) {
        var _a, _b, _c;
        try {
            const approval = await this.approvalRepository.findOne({
                where: { id: approvalId },
                relations: ['approver'],
            });
            if (!approval) {
                throw new common_1.NotFoundException(`Approval with ID ${approvalId} not found`);
            }
            if (approval.approverId !== userId) {
                throw new common_1.ForbiddenException('You are not authorized to approve this step');
            }
            if (approval.status !== workflow_approval_entity_1.ApprovalStatus.PENDING) {
                throw new common_1.BadRequestException('This approval has already been processed');
            }
            approval.status = status;
            approval.comments = comments;
            approval.respondedAt = new Date();
            if (signatureData) {
                approval.signatureData = signatureData.signatureData;
                approval.signatureMethod = signatureData.signatureMethod;
                approval.signatureMetadata = signatureData.signatureMetadata;
                approval.signatureTimestamp = new Date();
            }
            await this.approvalRepository.save(approval);
            const execution = await this.executionRepository.findOne({
                where: { id: approval.workflowExecutionId },
                relations: ['workflow'],
            });
            if (!execution || !execution.workflow) {
                this.logger.error(`Failed to load execution or workflow for approval ${approvalId}`);
                return;
            }
            const workflow = execution.workflow;
            const approverName = `${((_a = approval.approver) === null || _a === void 0 ? void 0 : _a.firstName) || ''} ${((_b = approval.approver) === null || _b === void 0 ? void 0 : _b.lastName) || ''}`.trim() || ((_c = approval.approver) === null || _c === void 0 ? void 0 : _c.email) || 'Unknown';
            const allApprovals = await this.approvalRepository.find({
                where: { workflowExecutionId: approval.workflowExecutionId },
            });
            const allApproved = allApprovals.every(a => a.status === workflow_approval_entity_1.ApprovalStatus.APPROVED);
            const anyRejected = allApprovals.some(a => a.status === workflow_approval_entity_1.ApprovalStatus.REJECTED);
            const workflowCreatorId = workflow.createdById;
            if (anyRejected) {
                execution.status = workflow_execution_entity_1.WorkflowExecutionStatus.FAILED;
                execution.completedAt = new Date();
                await this.executionRepository.save(execution);
                if (workflowCreatorId) {
                    try {
                        await this.notificationService.sendWorkflowRejected(workflowCreatorId, workflow.name, execution.entityType, execution.entityId, approverName, comments);
                    }
                    catch (error) {
                        this.logger.error('Failed to send rejection notification:', error);
                    }
                }
            }
            else if (allApproved) {
                try {
                    await this.executeActions(workflow, execution.entityType, execution.entityId, execution.id);
                    execution.status = workflow_execution_entity_1.WorkflowExecutionStatus.COMPLETED;
                    execution.completedAt = new Date();
                    await this.executionRepository.save(execution);
                    if (workflowCreatorId) {
                        try {
                            await this.notificationService.sendWorkflowApproved(workflowCreatorId, workflow.name, execution.entityType, execution.entityId, approverName);
                        }
                        catch (error) {
                            this.logger.error('Failed to send approval notification:', error);
                        }
                    }
                }
                catch (actionError) {
                    execution.status = workflow_execution_entity_1.WorkflowExecutionStatus.FAILED;
                    execution.errorMessage = actionError.message || 'Error executing workflow actions';
                    execution.completedAt = new Date();
                    await this.executionRepository.save(execution);
                    this.logger.error('Error executing workflow actions:', actionError);
                    if (workflowCreatorId) {
                        try {
                            await this.notificationService.sendWorkflowRejected(workflowCreatorId, workflow.name, execution.entityType, execution.entityId, approverName, `Workflow actions failed: ${actionError.message}`);
                        }
                        catch (notifyError) {
                            this.logger.error('Failed to send workflow failure notification:', notifyError);
                        }
                    }
                }
            }
        }
        catch (error) {
            this.logger.error(`Error approving workflow approval ${approvalId}:`, error);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(error.message || 'Failed to process approval');
        }
    }
    toResponseDto(workflow) {
        return {
            id: workflow.id,
            name: workflow.name || 'Unknown',
            description: workflow.description || undefined,
            type: workflow.type,
            status: workflow.status,
            trigger: workflow.trigger,
            entityType: workflow.entityType,
            conditions: workflow.conditions || undefined,
            actions: workflow.actions || {},
            daysBeforeDeadline: workflow.daysBeforeDeadline || undefined,
            createdAt: workflow.createdAt ? new Date(workflow.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: workflow.updatedAt ? new Date(workflow.updatedAt).toISOString() : new Date().toISOString(),
        };
    }
};
exports.WorkflowService = WorkflowService;
exports.WorkflowService = WorkflowService = WorkflowService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(workflow_entity_1.Workflow)),
    __param(1, (0, typeorm_1.InjectRepository)(workflow_execution_entity_1.WorkflowExecution)),
    __param(2, (0, typeorm_1.InjectRepository)(workflow_approval_entity_1.WorkflowApproval)),
    __param(3, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(4, (0, typeorm_1.InjectRepository)(risk_entity_1.Risk)),
    __param(5, (0, typeorm_1.InjectRepository)(compliance_requirement_entity_1.ComplianceRequirement)),
    __param(6, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(7, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(9, (0, common_1.Optional)()),
    __param(9, (0, bull_1.InjectQueue)('governance:policy')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService, Object])
], WorkflowService);
//# sourceMappingURL=workflow.service.js.map