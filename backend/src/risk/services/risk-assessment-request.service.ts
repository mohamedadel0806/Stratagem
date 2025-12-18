import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RiskAssessmentRequest, RequestStatus } from '../entities/risk-assessment-request.entity';
import { Risk } from '../entities/risk.entity';
import { RiskAssessment } from '../entities/risk-assessment.entity';
import { User } from '../../users/entities/user.entity';
import { CreateRiskAssessmentRequestDto } from '../dto/request/create-risk-assessment-request.dto';
import { UpdateRiskAssessmentRequestDto } from '../dto/request/update-risk-assessment-request.dto';
import { RiskAssessmentRequestResponseDto } from '../dto/request/risk-assessment-request-response.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { EntityType, WorkflowTrigger } from '../../workflow/entities/workflow.entity';

@Injectable()
export class RiskAssessmentRequestService {
  constructor(
    @InjectRepository(RiskAssessmentRequest)
    private requestRepository: Repository<RiskAssessmentRequest>,
    @InjectRepository(Risk)
    private riskRepository: Repository<Risk>,
    @InjectRepository(RiskAssessment)
    private assessmentRepository: Repository<RiskAssessment>,
    @Inject(forwardRef(() => WorkflowService))
    private workflowService: WorkflowService,
  ) {}

  /**
   * Generate unique request identifier
   */
  private async generateRequestIdentifier(): Promise<string> {
    const prefix = 'REQ';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find latest request for this month
    const monthPrefix = `${prefix}-${year}${month}-`;
    const latest = await this.requestRepository
      .createQueryBuilder('request')
      .where('request.request_identifier LIKE :prefix', { prefix: `${monthPrefix}%` })
      .orderBy('request.created_at', 'DESC')
      .getOne();

    let sequence = 1;
    if (latest) {
      const match = latest.request_identifier.match(/REQ-\d{6}-(\d+)/);
      if (match) {
        sequence = parseInt(match[1], 10) + 1;
      }
    }

    return `${prefix}-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }

  /**
   * Convert entity to response DTO
   */
  private toResponseDto(request: RiskAssessmentRequest): RiskAssessmentRequestResponseDto {
    return {
      id: request.id,
      request_identifier: request.request_identifier,
      risk_id: request.risk_id,
      risk_title: request.risk?.title,
      risk_identifier: request.risk?.risk_id,
      requested_by_id: request.requested_by_id,
      requested_by_name: request.requested_by
        ? `${request.requested_by.firstName || ''} ${request.requested_by.lastName || ''}`.trim() || request.requested_by.email
        : undefined,
      requested_by_email: request.requested_by?.email,
      requested_for_id: request.requested_for_id,
      requested_for_name: request.requested_for
        ? `${request.requested_for.firstName || ''} ${request.requested_for.lastName || ''}`.trim() || request.requested_for.email
        : undefined,
      requested_for_email: request.requested_for?.email,
      assessment_type: request.assessment_type,
      priority: request.priority,
      status: request.status,
      due_date: request.due_date,
      justification: request.justification,
      notes: request.notes,
      approval_workflow_id: request.approval_workflow_id,
      approved_by_id: request.approved_by_id,
      approved_by_name: request.approved_by
        ? `${request.approved_by.firstName || ''} ${request.approved_by.lastName || ''}`.trim() || request.approved_by.email
        : undefined,
      approved_at: request.approved_at,
      rejected_by_id: request.rejected_by_id,
      rejected_by_name: request.rejected_by
        ? `${request.rejected_by.firstName || ''} ${request.rejected_by.lastName || ''}`.trim() || request.rejected_by.email
        : undefined,
      rejected_at: request.rejected_at,
      rejection_reason: request.rejection_reason,
      completed_at: request.completed_at,
      resulting_assessment_id: request.resulting_assessment_id,
      created_at: request.created_at,
      updated_at: request.updated_at,
    };
  }

  /**
   * Find all requests with optional filters
   */
  async findAll(filters?: {
    riskId?: string;
    requestedById?: string;
    requestedForId?: string;
    status?: RequestStatus;
    assessmentType?: string;
  }): Promise<RiskAssessmentRequestResponseDto[]> {
    const where: any = {};

    if (filters?.riskId) {
      where.risk_id = filters.riskId;
    }
    if (filters?.requestedById) {
      where.requested_by_id = filters.requestedById;
    }
    if (filters?.requestedForId) {
      where.requested_for_id = filters.requestedForId;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.assessmentType) {
      where.assessment_type = filters.assessmentType;
    }

    const requests = await this.requestRepository.find({
      where,
      relations: ['risk', 'requested_by', 'requested_for', 'approved_by', 'rejected_by', 'resulting_assessment'],
      order: { created_at: 'DESC' },
    });

    return requests.map((request) => this.toResponseDto(request));
  }

  /**
   * Find a single request by ID
   */
  async findOne(id: string): Promise<RiskAssessmentRequestResponseDto> {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['risk', 'requested_by', 'requested_for', 'approved_by', 'rejected_by', 'resulting_assessment'],
    });

    if (!request) {
      throw new NotFoundException(`Risk assessment request with ID ${id} not found`);
    }

    return this.toResponseDto(request);
  }

  /**
   * Find requests by risk ID
   */
  async findByRiskId(riskId: string): Promise<RiskAssessmentRequestResponseDto[]> {
    return this.findAll({ riskId });
  }

  /**
   * Find pending requests assigned to a user
   */
  async findPendingForUser(userId: string): Promise<RiskAssessmentRequestResponseDto[]> {
    return this.findAll({
      requestedForId: userId,
      status: RequestStatus.PENDING,
    });
  }

  /**
   * Create a new assessment request
   */
  async create(
    createDto: CreateRiskAssessmentRequestDto,
    userId: string,
    organizationId?: string,
  ): Promise<RiskAssessmentRequestResponseDto> {
    // Validate userId is provided
    if (!userId) {
      throw new UnauthorizedException('User ID is required. Please ensure you are authenticated.');
    }

    // Verify risk exists
    const risk = await this.riskRepository.findOne({ where: { id: createDto.risk_id } });
    if (!risk) {
      throw new NotFoundException(`Risk with ID ${createDto.risk_id} not found`);
    }

    // Generate request identifier
    const requestIdentifier = await this.generateRequestIdentifier();

    // Create request
    const request = this.requestRepository.create({
      request_identifier: requestIdentifier,
      risk_id: createDto.risk_id,
      requested_by_id: userId,
      requested_for_id: createDto.requested_for_id,
      assessment_type: createDto.assessment_type,
      priority: createDto.priority || 'medium' as any,
      status: RequestStatus.PENDING,
      due_date: createDto.due_date ? new Date(createDto.due_date) : undefined,
      justification: createDto.justification,
      notes: createDto.notes,
    });

    const savedRequest = await this.requestRepository.save(request);

    // Trigger workflow if configured (on_create trigger for risk assessment requests)
    try {
      await this.workflowService.checkAndTriggerWorkflows(
        EntityType.RISK,
        createDto.risk_id,
        WorkflowTrigger.ON_CREATE,
        {
          request_id: savedRequest.id,
          assessment_type: createDto.assessment_type,
          priority: createDto.priority,
          entityType: 'risk_assessment_request',
        },
        true, // useQueue
      );
    } catch (error) {
      // Log but don't fail request creation if workflow fails
      console.error('Failed to trigger workflow for assessment request:', error);
    }

    // Reload with relations
    const reloaded = await this.requestRepository.findOne({
      where: { id: savedRequest.id },
      relations: ['risk', 'requested_by', 'requested_for', 'approved_by', 'rejected_by'],
    });

    return this.toResponseDto(reloaded!);
  }

  /**
   * Update an assessment request
   */
  async update(
    id: string,
    updateDto: UpdateRiskAssessmentRequestDto,
    userId: string,
  ): Promise<RiskAssessmentRequestResponseDto> {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['risk', 'requested_by', 'requested_for'],
    });

    if (!request) {
      throw new NotFoundException(`Risk assessment request with ID ${id} not found`);
    }

    // Validate status transitions
    if (updateDto.status) {
      this.validateStatusTransition(request.status, updateDto.status);
    }

    // Update fields
    if (updateDto.requested_for_id !== undefined) {
      request.requested_for_id = updateDto.requested_for_id;
    }
    if (updateDto.priority !== undefined) {
      request.priority = updateDto.priority;
    }
    if (updateDto.due_date !== undefined) {
      request.due_date = updateDto.due_date ? new Date(updateDto.due_date) : null;
    }
    if (updateDto.justification !== undefined) {
      request.justification = updateDto.justification;
    }
    if (updateDto.notes !== undefined) {
      request.notes = updateDto.notes;
    }
    if (updateDto.rejection_reason !== undefined) {
      request.rejection_reason = updateDto.rejection_reason;
    }

    // Handle status changes
    if (updateDto.status) {
      const oldStatus = request.status;
      request.status = updateDto.status;

      switch (updateDto.status) {
        case RequestStatus.APPROVED:
          request.approved_by_id = userId;
          request.approved_at = new Date();
          break;
        case RequestStatus.REJECTED:
          request.rejected_by_id = userId;
          request.rejected_at = new Date();
          if (updateDto.rejection_reason) {
            request.rejection_reason = updateDto.rejection_reason;
          }
          break;
        case RequestStatus.COMPLETED:
          request.completed_at = new Date();
          break;
      }

      // Trigger workflow on status change
      try {
        await this.workflowService.checkAndTriggerWorkflows(
          EntityType.RISK,
          request.risk_id,
          WorkflowTrigger.ON_STATUS_CHANGE,
          {
            request_id: id,
            status: updateDto.status,
            oldStatus,
            entityType: 'risk_assessment_request',
          },
          true,
        );
      } catch (error) {
        console.error('Failed to trigger workflow for status change:', error);
      }
    }

    await this.requestRepository.save(request);

    // Reload with relations
    const reloaded = await this.requestRepository.findOne({
      where: { id },
      relations: ['risk', 'requested_by', 'requested_for', 'approved_by', 'rejected_by', 'resulting_assessment'],
    });

    return this.toResponseDto(reloaded!);
  }

  /**
   * Approve a request
   */
  async approve(id: string, userId: string): Promise<RiskAssessmentRequestResponseDto> {
    return this.update(id, { status: RequestStatus.APPROVED }, userId);
  }

  /**
   * Reject a request
   */
  async reject(id: string, userId: string, reason?: string): Promise<RiskAssessmentRequestResponseDto> {
    return this.update(id, { status: RequestStatus.REJECTED, rejection_reason: reason }, userId);
  }

  /**
   * Cancel a request
   */
  async cancel(id: string, userId: string): Promise<RiskAssessmentRequestResponseDto> {
    return this.update(id, { status: RequestStatus.CANCELLED }, userId);
  }

  /**
   * Mark request as in progress
   */
  async markInProgress(id: string, userId: string): Promise<RiskAssessmentRequestResponseDto> {
    return this.update(id, { status: RequestStatus.IN_PROGRESS }, userId);
  }

  /**
   * Complete a request and link to resulting assessment
   */
  async complete(id: string, assessmentId: string, userId: string): Promise<RiskAssessmentRequestResponseDto> {
    const request = await this.requestRepository.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException(`Risk assessment request with ID ${id} not found`);
    }

    // Verify assessment exists
    const assessment = await this.assessmentRepository.findOne({ where: { id: assessmentId } });
    if (!assessment) {
      throw new NotFoundException(`Risk assessment with ID ${assessmentId} not found`);
    }

    // Verify assessment matches request
    if (assessment.risk_id !== request.risk_id) {
      throw new BadRequestException('Assessment risk ID does not match request risk ID');
    }
    if (assessment.assessment_type !== request.assessment_type) {
      throw new BadRequestException('Assessment type does not match request type');
    }

    request.status = RequestStatus.COMPLETED;
    request.completed_at = new Date();
    request.resulting_assessment_id = assessmentId;

    await this.requestRepository.save(request);

    const reloaded = await this.requestRepository.findOne({
      where: { id },
      relations: ['risk', 'requested_by', 'requested_for', 'approved_by', 'rejected_by', 'resulting_assessment'],
    });

    return this.toResponseDto(reloaded!);
  }

  /**
   * Delete a request
   */
  async remove(id: string): Promise<void> {
    const request = await this.requestRepository.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException(`Risk assessment request with ID ${id} not found`);
    }

    // Only allow deletion of pending or cancelled requests
    if (request.status !== RequestStatus.PENDING && request.status !== RequestStatus.CANCELLED) {
      throw new BadRequestException('Cannot delete requests that are not pending or cancelled');
    }

    await this.requestRepository.remove(request);
  }

  /**
   * Validate status transitions
   */
  private validateStatusTransition(currentStatus: RequestStatus, newStatus: RequestStatus): void {
    const validTransitions: Record<RequestStatus, RequestStatus[]> = {
      [RequestStatus.PENDING]: [
        RequestStatus.APPROVED,
        RequestStatus.REJECTED,
        RequestStatus.CANCELLED,
        RequestStatus.IN_PROGRESS,
      ],
      [RequestStatus.APPROVED]: [RequestStatus.IN_PROGRESS, RequestStatus.CANCELLED],
      [RequestStatus.REJECTED]: [RequestStatus.PENDING], // Can resubmit
      [RequestStatus.IN_PROGRESS]: [RequestStatus.COMPLETED, RequestStatus.CANCELLED],
      [RequestStatus.COMPLETED]: [], // Terminal state
      [RequestStatus.CANCELLED]: [], // Terminal state
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}

