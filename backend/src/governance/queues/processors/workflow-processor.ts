import { Processor, Process, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { WorkflowService } from '../../../workflow/services/workflow.service';
import { WorkflowExecutionJob, WorkflowActionJob } from '../../../workflow/interfaces/workflow-job.interface';
import { EntityType } from '../../../workflow/entities/workflow.entity';
import { TenantContextService } from '../../../common/context/tenant-context.service';

/**
 * Workflow Processor
 * 
 * Processes workflow execution jobs asynchronously using Bull Queue.
 * This replaces synchronous workflow execution with async processing.
 */
@Processor('governance:policy')
export class WorkflowProcessor {
  private readonly logger = new Logger(WorkflowProcessor.name);

  constructor(
    private readonly workflowService: WorkflowService,
    private readonly tenantContextService: TenantContextService,
  ) { }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing workflow job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.log(`Workflow job ${job.id} completed: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Workflow job ${job.id} failed: ${error.message}`, error.stack);
  }

  /**
   * Execute a workflow asynchronously
   * 
   * This processes workflow execution jobs queued by WorkflowService.
   * The executionId should already exist in the database (created when queuing).
   */
  @Process('EXECUTE_WORKFLOW')
  async handleWorkflowExecution(job: Job<WorkflowExecutionJob>) {
    const { workflowId, entityType, entityId, executionId } = job.data;

    try {
      this.logger.log(`Executing workflow ${workflowId} for ${entityType}:${entityId} (execution: ${executionId}) for tenant ${job.data.tenantId}`);

      await job.progress(10);

      // Execute workflow actions using the existing execution record wrapped in tenant context
      const execution = await this.tenantContextService.run(
        { tenantId: job.data.tenantId },
        () => this.workflowService.executeWorkflowActionsForExecution(executionId)
      );

      await job.progress(100);

      this.logger.log(`Workflow execution ${executionId} completed successfully`);

      return {
        success: true,
        executionId: execution.id,
        status: execution.status,
      };
    } catch (error) {
      this.logger.error(
        `Failed to execute workflow ${workflowId} (execution: ${executionId}): ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

