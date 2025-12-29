import { Injectable, NotFoundException, Logger, Inject, Optional, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Workflow, WorkflowType, WorkflowTrigger, EntityType, WorkflowStatus } from '../entities/workflow.entity';
import { WorkflowExecution, WorkflowExecutionStatus } from '../entities/workflow-execution.entity';
import { WorkflowApproval, ApprovalStatus } from '../entities/workflow-approval.entity';
import { WorkflowTriggerRulesService } from './workflow-trigger-rules.service';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { WorkflowResponseDto } from '../dto/workflow-response.dto';
import { Policy } from '../../policy/entities/policy.entity';
import { Risk } from '../../risk/entities/risk.entity';
import { ComplianceRequirement } from '../../common/entities/compliance-requirement.entity';
import { TenantContextService } from '../../common/context/tenant-context.service';
import { Task } from '../../common/entities/task.entity';
import { User } from '../../users/entities/user.entity';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';
import { WorkflowExecutionJob } from '../interfaces/workflow-job.interface';

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
    @InjectRepository(WorkflowExecution)
    private executionRepository: Repository<WorkflowExecution>,
    @InjectRepository(WorkflowApproval)
    private approvalRepository: Repository<WorkflowApproval>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(Risk)
    private riskRepository: Repository<Risk>,
    @InjectRepository(ComplianceRequirement)
    private requirementRepository: Repository<ComplianceRequirement>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private workflowRulesService: WorkflowTriggerRulesService,
    private notificationService: NotificationService,
    private tenantContextService: TenantContextService,
    @Optional() @InjectQueue('governance:policy') private workflowQueue?: Queue<WorkflowExecutionJob>,
  ) { }

  async create(createDto: CreateWorkflowDto, userId: string): Promise<WorkflowResponseDto> {
    const tenantId = this.tenantContextService.getTenantId();
    const workflow = this.workflowRepository.create({
      ...createDto,
      tenantId: tenantId,
      organizationId: tenantId, // Keeping for backward compatibility
      createdById: userId,
    });

    const saved = await this.workflowRepository.save(workflow);
    return this.toResponseDto(saved);
  }

  async findAll(): Promise<WorkflowResponseDto[]> {
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
        } catch (error) {
          this.logger.error(`Error mapping workflow ${w.id}:`, error);
          // Return minimal valid data if mapping fails
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
    } catch (error) {
      this.logger.error('Error getting all workflows:', error);
      // Return empty array instead of throwing to prevent 500 error
      return [];
    }
  }

  async findOne(id: string): Promise<WorkflowResponseDto> {
    const workflow = await this.workflowRepository.findOne({ where: { id } });
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }
    return this.toResponseDto(workflow);
  }

  async update(id: string, updateDto: Partial<CreateWorkflowDto>): Promise<WorkflowResponseDto> {
    const workflow = await this.workflowRepository.findOne({ where: { id } });
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }

    Object.assign(workflow, updateDto);
    const updated = await this.workflowRepository.save(workflow);
    return this.toResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const workflow = await this.workflowRepository.findOne({ where: { id } });
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }
    await this.workflowRepository.remove(workflow);
  }

  /**
   * Execute a workflow for a given entity
   */
  async executeWorkflow(
    workflowId: string,
    entityType: EntityType,
    entityId: string,
    inputData?: Record<string, any>,
  ): Promise<WorkflowExecution> {
    const workflow = await this.workflowRepository.findOne({ where: { id: workflowId } });
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${workflowId} not found`);
    }

    if (workflow.status !== WorkflowStatus.ACTIVE) {
      throw new Error('Workflow is not active');
    }

    // Create execution record
    const execution = this.executionRepository.create({
      workflowId: workflow.id,
      entityType,
      entityId,
      status: WorkflowExecutionStatus.IN_PROGRESS,
      inputData,
      startedAt: new Date(),
    });

    const savedExecution = await this.executionRepository.save(execution);

    try {
      // Execute workflow actions
      await this.executeActions(workflow, entityType, entityId, savedExecution.id);

      // Mark as completed
      savedExecution.status = WorkflowExecutionStatus.COMPLETED;
      savedExecution.completedAt = new Date();
      await this.executionRepository.save(savedExecution);

      return savedExecution;
    } catch (error: any) {
      savedExecution.status = WorkflowExecutionStatus.FAILED;
      savedExecution.errorMessage = error.message;
      savedExecution.completedAt = new Date();
      await this.executionRepository.save(savedExecution);
      throw error;
    }
  }

  /**
   * Queue a workflow execution via Bull Queue (async)
   * This method queues the workflow for asynchronous processing
   */
  async queueWorkflowExecution(
    workflowId: string,
    entityType: EntityType,
    entityId: string,
    inputData?: Record<string, any>,
    triggeredBy?: string,
  ): Promise<{ executionId: string; jobId: string }> {
    const workflow = await this.workflowRepository.findOne({ where: { id: workflowId } });
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${workflowId} not found`);
    }

    if (workflow.status !== WorkflowStatus.ACTIVE) {
      throw new Error('Workflow is not active');
    }

    // Create execution record
    const execution = this.executionRepository.create({
      workflowId: workflow.id,
      entityType,
      entityId,
      status: WorkflowExecutionStatus.IN_PROGRESS,
      inputData,
      startedAt: new Date(),
    });

    const savedExecution = await this.executionRepository.save(execution);

    // Queue job if queue is available, otherwise execute synchronously
    if (this.workflowQueue) {
      try {
        const job = await this.workflowQueue.add(
          'EXECUTE_WORKFLOW',
          {
            tenantId: this.tenantContextService.getTenantId(),
            workflowId,
            entityType,
            entityId,
            executionId: savedExecution.id,
            inputData,
            triggeredBy,
            triggerType: triggeredBy ? 'manual' : 'automatic',
          },
          {
            attempts: 5,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
            removeOnComplete: true,
            removeOnFail: false,
          },
        );

        this.logger.log(`Queued workflow ${workflowId} execution as job ${job.id}`);
        return {
          executionId: savedExecution.id,
          jobId: String(job.id),
        };
      } catch (error) {
        this.logger.error(`Failed to queue workflow execution: ${error.message}`, error.stack);
        // Fall back to synchronous execution
        this.logger.warn('Falling back to synchronous workflow execution');
      }
    }

    // Fallback: Execute synchronously if queue is not available
    try {
      await this.executeWorkflow(workflowId, entityType, entityId, inputData);
      return {
        executionId: savedExecution.id,
        jobId: 'sync',
      };
    } catch (error) {
      savedExecution.status = WorkflowExecutionStatus.FAILED;
      savedExecution.errorMessage = error.message;
      savedExecution.completedAt = new Date();
      await this.executionRepository.save(savedExecution);
      throw error;
    }
  }

  /**
   * Check and trigger workflows based on entity changes
   * Updated to use queue for async execution
   */
  async checkAndTriggerWorkflows(
    entityType: EntityType,
    entityId: string,
    trigger: WorkflowTrigger,
    entityData?: Record<string, any>,
    useQueue: boolean = true, // Option to use queue or execute synchronously
  ): Promise<void> {
    // 1. Get explicit workflows for this trigger/type
    const workflows = await this.workflowRepository.find({
      where: {
        entityType,
        trigger,
        status: WorkflowStatus.ACTIVE,
      },
    });

    // 2. Get matching workflows from dynamic rules
    const matchingRuleWorkflowIds = await this.workflowRulesService.getMatchingWorkflows(
      entityType,
      trigger,
      entityData || {},
    );

    if (matchingRuleWorkflowIds.length > 0) {
      const ruleWorkflows = await this.workflowRepository.find({
        where: { id: In(matchingRuleWorkflowIds), status: WorkflowStatus.ACTIVE },
      });
      workflows.push(...ruleWorkflows);
    }

    // Use a Set to avoid double-triggering the same workflow
    const uniqueWorkflows = Array.from(new Set(workflows.map(w => w.id)))
      .map(id => workflows.find(w => w.id === id)!);

    for (const workflow of uniqueWorkflows) {
      // Check if legacy conditions match (backward compatibility)
      if (this.checkConditions(workflow.conditions, entityData)) {
        if (useQueue && this.workflowQueue) {
          // Queue workflow for async execution
          await this.queueWorkflowExecution(
            workflow.id,
            entityType,
            entityId,
            entityData,
          );
        } else {
          // Execute synchronously (backward compatibility)
          await this.executeWorkflow(workflow.id, entityType, entityId, entityData);
        }
      }
    }
  }

  /**
   * Check deadline-based workflows
   */
  async checkDeadlineWorkflows(): Promise<void> {
    const workflows = await this.workflowRepository.find({
      where: {
        trigger: In(['on_deadline_approaching', 'on_deadline_passed']),
        status: WorkflowStatus.ACTIVE,
      },
    });

    for (const workflow of workflows) {
      await this.processDeadlineWorkflow(workflow);
    }
  }

  /**
   * Execute workflow actions for an existing execution record
   * This is used when workflows are executed asynchronously via Bull Queue
   */
  async executeWorkflowActionsForExecution(
    executionId: string,
  ): Promise<WorkflowExecution> {
    const execution = await this.executionRepository.findOne({
      where: { id: executionId },
      relations: ['workflow'],
    });

    if (!execution) {
      throw new NotFoundException(`Workflow execution with ID ${executionId} not found`);
    }

    if (execution.status !== WorkflowExecutionStatus.IN_PROGRESS) {
      this.logger.warn(`Execution ${executionId} is not in progress, current status: ${execution.status}`);
    }

    const workflow = execution.workflow;
    if (!workflow) {
      throw new NotFoundException(`Workflow for execution ${executionId} not found`);
    }

    if (workflow.status !== WorkflowStatus.ACTIVE) {
      throw new Error('Workflow is not active');
    }

    try {
      // Execute workflow actions using existing execution record
      await this.executeActions(
        workflow,
        execution.entityType as EntityType,
        execution.entityId,
        execution.id,
      );

      // Mark as completed
      execution.status = WorkflowExecutionStatus.COMPLETED;
      execution.completedAt = new Date();
      await this.executionRepository.save(execution);

      return execution;
    } catch (error: any) {
      execution.status = WorkflowExecutionStatus.FAILED;
      execution.errorMessage = error.message;
      execution.completedAt = new Date();
      await this.executionRepository.save(execution);
      throw error;
    }
  }

  private async executeActions(
    workflow: Workflow,
    entityType: EntityType,
    entityId: string,
    executionId: string,
  ): Promise<void> {
    const actions = workflow.actions || {};

    // Handle approval workflow
    if (workflow.type === WorkflowType.APPROVAL && actions.approvers && actions.approvers.length > 0) {
      await this.createApprovalSteps(executionId, actions.approvers, workflow.name, entityType, entityId);
    }

    // Handle status change
    if (actions.changeStatus) {
      await this.changeEntityStatus(entityType, entityId, actions.changeStatus);
    }

    // Handle assignment
    if (actions.assignTo) {
      await this.assignEntity(entityType, entityId, actions.assignTo);
    }

    // Handle notification - send to specified users
    if (actions.notify && Array.isArray(actions.notify) && actions.notify.length > 0) {
      await this.sendNotifications(actions.notify, workflow.name, entityType, entityId);
    }

    // Handle task creation
    if (actions.createTask) {
      await this.createTaskFromWorkflow(entityType, entityId, actions.createTask, actions.assignTo);
    }
  }

  private async createApprovalSteps(
    executionId: string,
    approvers: string[],
    workflowName: string,
    entityType: EntityType,
    entityId: string,
  ): Promise<void> {
    for (let i = 0; i < approvers.length; i++) {
      await this.approvalRepository.save({
        workflowExecutionId: executionId,
        approverId: approvers[i],
        status: ApprovalStatus.PENDING,
        stepOrder: i + 1,
      });

      // Send notification to approver
      try {
        await this.notificationService.sendApprovalRequest(
          approvers[i],
          workflowName,
          entityType,
          entityId,
          executionId,
        );
      } catch (error) {
        this.logger.error(`Failed to send approval notification to ${approvers[i]}:`, error);
      }
    }
  }

  private async sendNotifications(
    userIds: string[],
    workflowName: string,
    entityType: EntityType,
    entityId: string,
  ): Promise<void> {
    for (const userId of userIds) {
      try {
        await this.notificationService.create({
          userId,
          type: NotificationType.GENERAL,
          priority: NotificationPriority.MEDIUM,
          title: 'Workflow Notification',
          message: `Workflow "${workflowName}" has been triggered`,
          entityType,
          entityId,
          actionUrl: `/dashboard/${entityType}s/${entityId}`,
        });
      } catch (error) {
        this.logger.error(`Failed to send notification to ${userId}:`, error);
      }
    }
  }

  private async changeEntityStatus(
    entityType: EntityType,
    entityId: string,
    newStatus: string,
  ): Promise<void> {
    switch (entityType) {
      case EntityType.POLICY:
        const policy = await this.policyRepository.findOne({ where: { id: entityId } });
        if (policy) {
          policy.status = newStatus as any;
          await this.policyRepository.save(policy);
        }
        break;
      case EntityType.RISK:
        const risk = await this.riskRepository.findOne({ where: { id: entityId } });
        if (risk) {
          risk.status = newStatus as any;
          await this.riskRepository.save(risk);
        }
        break;
      case EntityType.COMPLIANCE_REQUIREMENT:
        const requirement = await this.requirementRepository.findOne({ where: { id: entityId } });
        if (requirement) {
          requirement.status = newStatus as any;
          await this.requirementRepository.save(requirement);
        }
        break;
    }
  }

  private async assignEntity(
    entityType: EntityType,
    entityId: string,
    assignToId: string,
  ): Promise<void> {
    // Update execution assignment
    const execution = await this.executionRepository.findOne({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
    });

    if (execution) {
      execution.assignedToId = assignToId;
      await this.executionRepository.save(execution);
    }
  }

  private async createTaskFromWorkflow(
    entityType: EntityType,
    entityId: string,
    taskConfig: { title: string; description?: string; priority?: string; dueDate?: string; assigneeId?: string },
    assignToId?: string,
  ): Promise<void> {
    const taskAssigneeId = taskConfig.assigneeId || assignToId;

    const task = this.taskRepository.create({
      title: taskConfig.title,
      description: taskConfig.description || null,
      priority: (taskConfig.priority as any) || 'medium',
      dueDate: taskConfig.dueDate ? new Date(taskConfig.dueDate) : null,
      relatedEntityType: entityType,
      relatedEntityId: entityId,
      status: 'todo' as any,
      assignedToId: taskAssigneeId || null,
    });

    const savedTask = await this.taskRepository.save(task);

    // Send notification to assignee if specified
    if (taskAssigneeId) {
      try {
        await this.notificationService.sendTaskAssigned(
          taskAssigneeId,
          taskConfig.title,
          savedTask.id,
        );
      } catch (error) {
        this.logger.error(`Failed to send task notification to ${taskAssigneeId}:`, error);
      }
    }
  }

  private checkConditions(conditions: Record<string, any> | null, entityData: Record<string, any> | undefined): boolean {
    if (!conditions || !entityData) {
      return true; // No conditions means always match
    }

    for (const [key, value] of Object.entries(conditions)) {
      if (entityData[key] !== value) {
        return false;
      }
    }

    return true;
  }

  private async processDeadlineWorkflow(workflow: Workflow): Promise<void> {
    // This would check entities for approaching/passed deadlines
    // Handled by DeadlineWorkflowScheduler
    this.logger.debug(`Processing deadline workflow: ${workflow.name}`);
  }

  /**
   * Get all pending approvals for a user
   */
  async getPendingApprovalsForUser(userId: string): Promise<any[]> {
    try {
      // Try to load approvals with relations, but handle gracefully if relations fail
      let approvals;
      try {
        approvals = await this.approvalRepository.find({
          where: { approverId: userId, status: ApprovalStatus.PENDING },
          relations: ['workflowExecution', 'workflowExecution.workflow'],
          order: { createdAt: 'DESC' },
        });
      } catch (queryError) {
        this.logger.warn(`Failed to load approvals with relations, trying without relations:`, queryError);
        // Fallback: load without relations
        approvals = await this.approvalRepository.find({
          where: { approverId: userId, status: ApprovalStatus.PENDING },
          order: { createdAt: 'DESC' },
        });
      }

      if (!approvals || approvals.length === 0) {
        return [];
      }

      return approvals.map(a => {
        try {
          const execution = a.workflowExecution;
          const workflow = execution?.workflow;

          return {
            id: a.id || '',
            workflowExecutionId: a.workflowExecutionId || '',
            workflowName: workflow?.name || execution?.workflowId || 'Unknown Workflow',
            workflowType: workflow?.type || null,
            entityType: execution?.entityType || null,  // Use camelCase property from entity
            entityId: execution?.entityId || null,      // Use camelCase property from entity
            status: a.status || 'pending',
            stepOrder: a.stepOrder || 0,
            createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString(),
          };
        } catch (error) {
          this.logger.error(`Error mapping approval ${a?.id}:`, error);
          // Return minimal data if mapping fails
          return {
            id: a?.id || '',
            workflowExecutionId: a?.workflowExecutionId || '',
            workflowName: 'Unknown',
            workflowType: null,
            entityType: null,
            entityId: null,
            status: a?.status || 'pending',
            stepOrder: a?.stepOrder || 0,
            createdAt: a?.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString(),
          };
        }
      });
    } catch (error) {
      this.logger.error(`Error getting pending approvals for user ${userId}:`, error);
      // Return empty array instead of throwing to prevent 500 error
      return [];
    }
  }

  /**
   * Get workflow execution history
   */
  async getExecutionHistory(
    options?: {
      workflowId?: string;
      entityType?: EntityType;
      status?: WorkflowExecutionStatus;
      limit?: number;
    },
  ): Promise<any[]> {
    try {
      const queryBuilder = this.executionRepository
        .createQueryBuilder('execution')
        .leftJoinAndSelect('execution.workflow', 'workflow')
        .orderBy('execution.createdAt', 'DESC');

      if (options?.workflowId) {
        queryBuilder.andWhere('execution.workflowId = :workflowId', { workflowId: options.workflowId });
      }

      if (options?.entityType) {
        queryBuilder.andWhere('execution.entityType = :entityType', { entityType: options.entityType });
      }

      if (options?.status) {
        queryBuilder.andWhere('execution.status = :status', { status: options.status });
      }

      queryBuilder.take(options?.limit || 50);

      const executions = await queryBuilder.getMany();

      if (!executions || executions.length === 0) {
        return [];
      }

      return executions.map(e => {
        try {
          return {
            id: e.id,
            workflowId: e.workflowId,
            workflowName: e.workflow?.name || 'Unknown',
            workflowType: e.workflow?.type || null,
            entityType: e.entityType || null,
            entityId: e.entityId || null,
            status: e.status,
            errorMessage: e.errorMessage || undefined,
            startedAt: e.startedAt?.toISOString() || null,
            completedAt: e.completedAt?.toISOString() || null,
            createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
          };
        } catch (error) {
          this.logger.error(`Error mapping execution ${e?.id}:`, error);
          return {
            id: e?.id || '',
            workflowId: e?.workflowId || '',
            workflowName: 'Unknown',
            workflowType: null,
            entityType: null,
            entityId: null,
            status: e?.status || 'pending',
            errorMessage: undefined,
            startedAt: null,
            completedAt: null,
            createdAt: new Date().toISOString(),
          };
        }
      });
    } catch (error) {
      this.logger.error('Error getting execution history:', error);
      // Return empty array instead of throwing to prevent 500 error
      return [];
    }
  }

  /**
   * Get execution details by ID
   */
  async getExecutionById(executionId: string): Promise<any> {
    const execution = await this.executionRepository.findOne({
      where: { id: executionId },
      relations: ['workflow'],
    });

    if (!execution) {
      throw new NotFoundException(`Execution with ID ${executionId} not found`);
    }

    const approvals = await this.getApprovals(executionId);

    return {
      id: execution.id,
      workflowId: execution.workflowId,
      workflowName: execution.workflow?.name || 'Unknown',
      workflowType: execution.workflow?.type,
      entityType: execution.entityType,
      entityId: execution.entityId,
      status: execution.status,
      errorMessage: execution.errorMessage || undefined,
      inputData: execution.inputData || undefined,
      startedAt: execution.startedAt?.toISOString(),
      completedAt: execution.completedAt?.toISOString(),
      createdAt: execution.createdAt.toISOString(),
      approvals,
    };
  }

  async getApprovals(executionId: string): Promise<any[]> {
    const approvals = await this.approvalRepository.find({
      where: { workflowExecutionId: executionId },
      relations: ['approver'],
      order: { stepOrder: 'ASC' },
    });

    return approvals.map(a => ({
      id: a.id,
      workflowExecutionId: a.workflowExecutionId,
      approverId: a.approverId,
      approverName: `${a.approver?.firstName || ''} ${a.approver?.lastName || ''}`.trim() || a.approver?.email || 'Unknown',
      status: a.status,
      comments: a.comments || undefined,
      stepOrder: a.stepOrder,
      respondedAt: a.respondedAt?.toISOString() || undefined,
      createdAt: a.createdAt.toISOString(),
      signatureData: a.signatureData,
      signatureTimestamp: a.signatureTimestamp?.toISOString() || undefined,
      signatureMethod: a.signatureMethod,
      signatureMetadata: a.signatureMetadata,
    }));
  }

  async getApprovalById(approvalId: string): Promise<any> {
    const approval = await this.approvalRepository.findOne({
      where: { id: approvalId },
      relations: ['approver'],
    });

    if (!approval) {
      throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    }

    return {
      id: approval.id,
      workflowExecutionId: approval.workflowExecutionId,
      approverId: approval.approverId,
      approverName: `${approval.approver?.firstName || ''} ${approval.approver?.lastName || ''}`.trim() || approval.approver?.email || 'Unknown',
      status: approval.status,
      comments: approval.comments || undefined,
      stepOrder: approval.stepOrder,
      respondedAt: approval.respondedAt?.toISOString() || undefined,
      createdAt: approval.createdAt.toISOString(),
      signatureData: approval.signatureData,
      signatureTimestamp: approval.signatureTimestamp?.toISOString() || undefined,
      signatureMethod: approval.signatureMethod,
      signatureMetadata: approval.signatureMetadata,
    };
  }

  async approve(approvalId: string, userId: string, status: ApprovalStatus, comments?: string, signatureData?: any): Promise<void> {
    try {
      // Load approval with minimal relations first
      const approval = await this.approvalRepository.findOne({
        where: { id: approvalId },
        relations: ['approver'],
      });

      if (!approval) {
        throw new NotFoundException(`Approval with ID ${approvalId} not found`);
      }

      if (approval.approverId !== userId) {
        throw new ForbiddenException('You are not authorized to approve this step');
      }

      if (approval.status !== ApprovalStatus.PENDING) {
        throw new BadRequestException('This approval has already been processed');
      }

      approval.status = status;
      approval.comments = comments;
      approval.respondedAt = new Date();

      // Handle signature data if provided
      if (signatureData) {
        approval.signatureData = signatureData.signatureData;
        approval.signatureMethod = signatureData.signatureMethod;
        approval.signatureMetadata = signatureData.signatureMetadata;
        approval.signatureTimestamp = new Date();
      }

      await this.approvalRepository.save(approval);

      // Load execution separately to avoid TypeORM alias issues
      const execution = await this.executionRepository.findOne({
        where: { id: approval.workflowExecutionId },
        relations: ['workflow'],
      });

      if (!execution || !execution.workflow) {
        this.logger.error(`Failed to load execution or workflow for approval ${approvalId}`);
        return;
      }

      const workflow = execution.workflow;
      const approverName = `${approval.approver?.firstName || ''} ${approval.approver?.lastName || ''}`.trim() || approval.approver?.email || 'Unknown';

      // Check if all approvals are complete
      const allApprovals = await this.approvalRepository.find({
        where: { workflowExecutionId: approval.workflowExecutionId },
      });

      const allApproved = allApprovals.every(a => a.status === ApprovalStatus.APPROVED);
      const anyRejected = allApprovals.some(a => a.status === ApprovalStatus.REJECTED);

      // Get workflow creator to notify
      const workflowCreatorId = workflow.createdById;

      if (anyRejected) {
        // Mark execution as failed
        execution.status = WorkflowExecutionStatus.FAILED;
        execution.completedAt = new Date();
        await this.executionRepository.save(execution);

        // Send rejection notification to workflow creator
        if (workflowCreatorId) {
          try {
            await this.notificationService.sendWorkflowRejected(
              workflowCreatorId,
              workflow.name,
              execution.entityType,
              execution.entityId,
              approverName,
              comments,
            );
          } catch (error) {
            this.logger.error('Failed to send rejection notification:', error);
          }
        }
      } else if (allApproved) {
        // All approvals complete, continue workflow execution
        // Execute final actions with error handling
        try {
          await this.executeActions(
            workflow,
            execution.entityType as EntityType,
            execution.entityId,
            execution.id,
          );

          execution.status = WorkflowExecutionStatus.COMPLETED;
          execution.completedAt = new Date();
          await this.executionRepository.save(execution);

          // Send approval notification to workflow creator
          if (workflowCreatorId) {
            try {
              await this.notificationService.sendWorkflowApproved(
                workflowCreatorId,
                workflow.name,
                execution.entityType,
                execution.entityId,
                approverName,
              );
            } catch (error) {
              this.logger.error('Failed to send approval notification:', error);
            }
          }
        } catch (actionError: any) {
          // Mark execution as failed if workflow actions fail
          execution.status = WorkflowExecutionStatus.FAILED;
          execution.errorMessage = actionError.message || 'Error executing workflow actions';
          execution.completedAt = new Date();
          await this.executionRepository.save(execution);

          // Log the error but don't throw to allow approval to be recorded
          this.logger.error('Error executing workflow actions:', actionError);

          // Notify workflow creator of the failure
          if (workflowCreatorId) {
            try {
              await this.notificationService.sendWorkflowRejected(
                workflowCreatorId,
                workflow.name,
                execution.entityType,
                execution.entityId,
                approverName,
                `Workflow actions failed: ${actionError.message}`,
              );
            } catch (notifyError) {
              this.logger.error('Failed to send workflow failure notification:', notifyError);
            }
          }
        }
      }
    } catch (error: any) {
      this.logger.error(`Error approving workflow approval ${approvalId}:`, error);
      // Re-throw NestJS exceptions (NotFoundException, ForbiddenException, BadRequestException)
      if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      // Wrap other errors as BadRequestException for proper HTTP response
      throw new BadRequestException(error.message || 'Failed to process approval');
    }
  }

  private toResponseDto(workflow: Workflow): WorkflowResponseDto {
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
}

