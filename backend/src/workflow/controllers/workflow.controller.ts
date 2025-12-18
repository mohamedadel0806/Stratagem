import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { WorkflowService } from '../services/workflow.service';
import { WorkflowTemplatesService } from '../services/workflow-templates.service';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { WorkflowResponseDto } from '../dto/workflow-response.dto';
import { ApproveRequestDto } from '../dto/approve-request.dto';
import { ApprovalResponseDto } from '../dto/approval-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { EntityType } from '../entities/workflow.entity';
import { WorkflowExecutionStatus } from '../entities/workflow-execution.entity';

@ApiTags('workflows')
@Controller('workflows')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkflowController {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly templatesService: WorkflowTemplatesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  @ApiResponse({ status: 201, description: 'Workflow created successfully', type: WorkflowResponseDto })
  async create(
    @Body() createDto: CreateWorkflowDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<WorkflowResponseDto> {
    return this.workflowService.create(createDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflows' })
  @ApiResponse({ status: 200, description: 'List of workflows', type: [WorkflowResponseDto] })
  async findAll(): Promise<WorkflowResponseDto[]> {
    try {
      return await this.workflowService.findAll();
    } catch (error) {
      console.error('Error getting workflows:', error);
      // Return empty array instead of throwing to prevent 500 error
      return [];
    }
  }

  @Get('my-approvals')
  @ApiOperation({ summary: 'Get pending approvals for current user' })
  @ApiResponse({ status: 200, description: 'List of pending approvals' })
  async getMyPendingApprovals(@CurrentUser() user: CurrentUserData): Promise<any[]> {
    try {
      if (!user?.userId) {
        console.error('No user ID found in request');
        return [];
      }
      return await this.workflowService.getPendingApprovalsForUser(user.userId);
    } catch (error) {
      console.error('Error getting pending approvals:', error);
      // Return empty array instead of throwing to prevent 500 error
      return [];
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow by ID' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiResponse({ status: 200, description: 'Workflow details', type: WorkflowResponseDto })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async findOne(@Param('id') id: string): Promise<WorkflowResponseDto> {
    return this.workflowService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a workflow' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiResponse({ status: 200, description: 'Workflow updated successfully', type: WorkflowResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateWorkflowDto>,
  ): Promise<WorkflowResponseDto> {
    return this.workflowService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiResponse({ status: 200, description: 'Workflow deleted successfully' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.workflowService.remove(id);
    return { message: 'Workflow deleted successfully' };
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Manually execute a workflow' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiResponse({ status: 200, description: 'Workflow executed successfully' })
  async execute(
    @Param('id') id: string,
    @Body() body: { entityType: string; entityId: string; inputData?: Record<string, any> },
  ): Promise<{ message: string; executionId: string }> {
    const execution = await this.workflowService.executeWorkflow(
      id,
      body.entityType as any,
      body.entityId,
      body.inputData,
    );
    return {
      message: 'Workflow executed successfully',
      executionId: execution.id,
    };
  }


  @Get('executions')
  @ApiOperation({ summary: 'Get workflow execution history' })
  @ApiQuery({ name: 'workflowId', required: false })
  @ApiQuery({ name: 'entityType', required: false, enum: EntityType })
  @ApiQuery({ name: 'status', required: false, enum: WorkflowExecutionStatus })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of workflow executions' })
  async getExecutionHistory(
    @Query('workflowId') workflowId?: string,
    @Query('entityType') entityType?: EntityType,
    @Query('status') status?: WorkflowExecutionStatus,
    @Query('limit') limit?: number,
  ): Promise<any[]> {
    return this.workflowService.getExecutionHistory({
      workflowId,
      entityType,
      status,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('executions/:executionId')
  @ApiOperation({ summary: 'Get workflow execution details' })
  @ApiParam({ name: 'executionId', description: 'Workflow execution ID' })
  @ApiResponse({ status: 200, description: 'Execution details with approvals' })
  async getExecutionById(@Param('executionId') executionId: string): Promise<any> {
    return this.workflowService.getExecutionById(executionId);
  }

  @Get('executions/:executionId/approvals')
  @ApiOperation({ summary: 'Get approvals for a workflow execution' })
  @ApiParam({ name: 'executionId', description: 'Workflow execution ID' })
  @ApiResponse({ status: 200, description: 'List of approvals', type: [ApprovalResponseDto] })
  async getApprovals(@Param('executionId') executionId: string): Promise<ApprovalResponseDto[]> {
    return this.workflowService.getApprovals(executionId);
  }

  @Patch('approvals/:approvalId')
  @ApiOperation({ summary: 'Approve or reject a workflow step' })
  @ApiParam({ name: 'approvalId', description: 'Approval ID' })
  @ApiResponse({ status: 200, description: 'Approval updated successfully' })
  async approve(
    @Param('approvalId') approvalId: string,
    @Body() approveDto: ApproveRequestDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ message: string }> {
    await this.workflowService.approve(
      approvalId,
      user.userId,
      approveDto.status,
      approveDto.comments,
      approveDto.signature
    );
    return { message: 'Approval updated successfully' };
  }

  @Get('approvals/:approvalId/signature')
  @ApiOperation({ summary: 'Get signature for an approval' })
  @ApiParam({ name: 'approvalId', description: 'Approval ID' })
  @ApiResponse({ status: 200, description: 'Signature data' })
  async getSignature(@Param('approvalId') approvalId: string): Promise<any> {
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

  @Get('templates')
  @ApiOperation({ summary: 'Get workflow templates' })
  @ApiResponse({ status: 200, description: 'List of workflow templates' })
  async getTemplates() {
    try {
      const templates = this.templatesService.getTemplates();
      return templates || [];
    } catch (error) {
      console.error('Error getting workflow templates:', error);
      console.error('Error stack:', error?.stack);
      console.error('Error details:', {
        message: error?.message,
        name: error?.name,
        cause: error?.cause,
      });
      // Return empty array instead of throwing to prevent 500 error
      return [];
    }
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get workflow template by ID' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Workflow template details' })
  async getTemplate(@Param('id') id: string) {
    return this.templatesService.getTemplateById(id);
  }

  @Post('templates/:id/instantiate')
  @ApiOperation({ summary: 'Create workflow from template' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 201, description: 'Workflow created from template', type: WorkflowResponseDto })
  async instantiateTemplate(
    @Param('id') id: string,
    @Body() body: { name: string; description?: string; [key: string]: any },
    @CurrentUser() user: CurrentUserData,
  ): Promise<WorkflowResponseDto> {
    const template = this.templatesService.getTemplateById(id);
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    const workflowData: CreateWorkflowDto = {
      ...template.workflow,
      name: body.name || template.name,
      description: body.description || template.description,
      // Allow overriding actions from template
      actions: body.actions || template.workflow.actions,
    };

    return this.workflowService.create(workflowData, user.userId);
  }
}

