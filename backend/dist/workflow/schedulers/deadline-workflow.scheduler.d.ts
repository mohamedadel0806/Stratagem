import { Repository } from 'typeorm';
import { WorkflowService } from '../services/workflow.service';
import { Workflow } from '../entities/workflow.entity';
import { ComplianceRequirement } from '../../common/entities/compliance-requirement.entity';
import { Policy } from '../../policy/entities/policy.entity';
import { Task } from '../../common/entities/task.entity';
export declare class DeadlineWorkflowScheduler {
    private readonly workflowService;
    private workflowRepository;
    private requirementRepository;
    private policyRepository;
    private taskRepository;
    private readonly logger;
    constructor(workflowService: WorkflowService, workflowRepository: Repository<Workflow>, requirementRepository: Repository<ComplianceRequirement>, policyRepository: Repository<Policy>, taskRepository: Repository<Task>);
    handleDeadlineWorkflows(): Promise<void>;
    private processDeadlineWorkflow;
    private processPassedDeadlineWorkflow;
}
