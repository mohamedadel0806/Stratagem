import { Job } from 'bull';
import { WorkflowService } from '../../../workflow/services/workflow.service';
import { WorkflowExecutionJob } from '../../../workflow/interfaces/workflow-job.interface';
export declare class WorkflowProcessor {
    private readonly workflowService;
    private readonly logger;
    constructor(workflowService: WorkflowService);
    onActive(job: Job): void;
    onCompleted(job: Job, result: any): void;
    onFailed(job: Job, error: Error): void;
    handleWorkflowExecution(job: Job<WorkflowExecutionJob>): Promise<{
        success: boolean;
        executionId: string;
        status: import("../../../workflow/entities/workflow-execution.entity").WorkflowExecutionStatus;
    }>;
}
