import { WorkflowService } from '../services/workflow.service';
import { WorkflowTemplatesService } from '../services/workflow-templates.service';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { WorkflowResponseDto } from '../dto/workflow-response.dto';
import { ApproveRequestDto } from '../dto/approve-request.dto';
import { ApprovalResponseDto } from '../dto/approval-response.dto';
import { CurrentUserData } from '../../auth/decorators/current-user.decorator';
import { EntityType } from '../entities/workflow.entity';
import { WorkflowExecutionStatus } from '../entities/workflow-execution.entity';
export declare class WorkflowController {
    private readonly workflowService;
    private readonly templatesService;
    constructor(workflowService: WorkflowService, templatesService: WorkflowTemplatesService);
    create(createDto: CreateWorkflowDto, user: CurrentUserData): Promise<WorkflowResponseDto>;
    findAll(): Promise<WorkflowResponseDto[]>;
    getMyPendingApprovals(user: CurrentUserData): Promise<any[]>;
    findOne(id: string): Promise<WorkflowResponseDto>;
    update(id: string, updateDto: Partial<CreateWorkflowDto>): Promise<WorkflowResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    execute(id: string, body: {
        entityType: string;
        entityId: string;
        inputData?: Record<string, any>;
    }): Promise<{
        message: string;
        executionId: string;
    }>;
    getExecutionHistory(workflowId?: string, entityType?: EntityType, status?: WorkflowExecutionStatus, limit?: number): Promise<any[]>;
    getExecutionById(executionId: string): Promise<any>;
    getApprovals(executionId: string): Promise<ApprovalResponseDto[]>;
    approve(approvalId: string, approveDto: ApproveRequestDto, user: CurrentUserData): Promise<{
        message: string;
    }>;
    getSignature(approvalId: string): Promise<any>;
    getTemplates(): Promise<import("../services/workflow-templates.service").WorkflowTemplate[]>;
    getTemplate(id: string): Promise<import("../services/workflow-templates.service").WorkflowTemplate>;
    instantiateTemplate(id: string, body: {
        name: string;
        description?: string;
        [key: string]: any;
    }, user: CurrentUserData): Promise<WorkflowResponseDto>;
}
