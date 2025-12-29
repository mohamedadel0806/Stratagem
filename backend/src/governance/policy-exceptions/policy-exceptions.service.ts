import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like, ILike } from 'typeorm';
import { PolicyException, ExceptionStatus } from './entities/policy-exception.entity';
import { CreatePolicyExceptionDto } from './dto/create-policy-exception.dto';
import { UpdatePolicyExceptionDto } from './dto/update-policy-exception.dto';
import { QueryPolicyExceptionDto } from './dto/query-policy-exception.dto';
import { WorkflowService } from '../../workflow/services/workflow.service';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';
import { EntityType, WorkflowTrigger } from '../../workflow/entities/workflow.entity';

@Injectable()
export class PolicyExceptionsService {
  private readonly logger = new Logger(PolicyExceptionsService.name);

  constructor(
    @InjectRepository(PolicyException)
    private exceptionRepository: Repository<PolicyException>,
    private workflowService: WorkflowService,
    private notificationService: NotificationService,
  ) { }

  async create(dto: CreatePolicyExceptionDto, userId: string, tenantId: string): Promise<PolicyException> {
    // Generate exception identifier if not provided
    let identifier = dto.exception_identifier;
    if (!identifier) {
      identifier = await this.generateExceptionIdentifier();
    }

    // Check for duplicate identifier
    const existing = await this.exceptionRepository.findOne({
      where: { exception_identifier: identifier, deleted_at: IsNull() },
    });

    if (existing) {
      throw new BadRequestException(`Exception with identifier ${identifier} already exists`);
    }

    const exception = this.exceptionRepository.create({
      ...dto,
      exception_identifier: identifier,
      requested_by: userId,
      tenant_id: tenantId,
      request_date: new Date(),
      status: ExceptionStatus.REQUESTED,
      start_date: dto.start_date ? new Date(dto.start_date) : null,
      end_date: dto.end_date ? new Date(dto.end_date) : null,
      next_review_date: dto.next_review_date ? new Date(dto.next_review_date) : null,
    });

    const saved = await this.exceptionRepository.save(exception);

    // Trigger approval workflow
    try {
      await this.workflowService.checkAndTriggerWorkflows(
        'POLICY_EXCEPTION' as any,
        saved.id,
        'ON_CREATE' as any,
        {
          exception_id: saved.id,
          entity_id: dto.entity_id,
          entity_type: dto.entity_type || 'policy',
        },
        true, // useQueue: true
      );
    } catch (error) {
      this.logger.warn(`Failed to trigger workflow for exception ${saved.id}: ${error.message}`);
    }

    // Send notification
    await this.notificationService.create({
      userId,
      type: NotificationType.GENERAL,
      priority: NotificationPriority.MEDIUM,
      title: 'Policy Exception Requested',
      message: `Policy exception ${identifier} has been requested and is pending approval.`,
      entityType: 'policy_exception',
      entityId: saved.id,
      actionUrl: `/dashboard/governance/exceptions/${saved.id}`,
    });

    return saved;
  }

  async findAll(query: QueryPolicyExceptionDto): Promise<{
    data: PolicyException[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 20, status, exception_type, entity_id, entity_type, requested_by, requesting_business_unit_id, search } = query;

    const queryBuilder = this.exceptionRepository
      .createQueryBuilder('exception')
      .leftJoinAndSelect('exception.requester', 'requester')
      .leftJoinAndSelect('exception.approver', 'approver')
      .leftJoinAndSelect('exception.requesting_business_unit', 'business_unit')
      .where('exception.deleted_at IS NULL');

    if (status) {
      queryBuilder.andWhere('exception.status = :status', { status });
    }

    if (exception_type) {
      queryBuilder.andWhere('exception.exception_type = :exception_type', { exception_type });
    }

    if (entity_id) {
      queryBuilder.andWhere('exception.entity_id = :entity_id', { entity_id });
    }

    if (entity_type) {
      queryBuilder.andWhere('exception.entity_type = :entity_type', { entity_type });
    }

    if (requested_by) {
      queryBuilder.andWhere('exception.requested_by = :requested_by', { requested_by });
    }

    if (requesting_business_unit_id) {
      queryBuilder.andWhere('exception.requesting_business_unit_id = :requesting_business_unit_id', {
        requesting_business_unit_id,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(exception.exception_identifier ILIKE :search OR exception.business_justification ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const total = await queryBuilder.getCount();

    const exceptions = await queryBuilder
      .orderBy('exception.request_date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: exceptions,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<PolicyException> {
    const exception = await this.exceptionRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['requester', 'approver', 'requesting_business_unit', 'updater'],
    });

    if (!exception) {
      throw new NotFoundException(`Policy exception with ID ${id} not found`);
    }

    return exception;
  }

  async update(id: string, dto: UpdatePolicyExceptionDto, userId: string): Promise<PolicyException> {
    const exception = await this.findOne(id);

    // If status is changing to approved, set approval date and approver
    if (dto.status === ExceptionStatus.APPROVED && exception.status !== ExceptionStatus.APPROVED) {
      exception.approval_date = new Date();
      exception.approved_by = userId;
    }

    // If status is changing to rejected, ensure rejection reason is provided
    if (dto.status === ExceptionStatus.REJECTED && !dto.rejection_reason) {
      throw new BadRequestException('Rejection reason is required when rejecting an exception');
    }

    Object.assign(exception, {
      ...dto,
      updated_by: userId,
      start_date: dto.start_date ? new Date(dto.start_date) : exception.start_date,
      end_date: dto.end_date ? new Date(dto.end_date) : exception.end_date,
      next_review_date: dto.next_review_date ? new Date(dto.next_review_date) : exception.next_review_date,
    });

    const updated = await this.exceptionRepository.save(exception);

    // Trigger workflow on status change
    if (dto.status && dto.status !== exception.status) {
      try {
        await this.workflowService.checkAndTriggerWorkflows(
          'POLICY_EXCEPTION' as any,
          id,
          WorkflowTrigger.ON_STATUS_CHANGE,
          {
            exception_id: id,
            old_status: exception.status,
            new_status: dto.status,
          },
          true, // useQueue: true
        );
      } catch (error) {
        this.logger.warn(`Failed to trigger workflow for exception ${id}: ${error.message}`);
      }
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const exception = await this.findOne(id);
    await this.exceptionRepository.softDelete(id);
  }

  async approve(id: string, userId: string, conditions?: string): Promise<PolicyException> {
    const exception = await this.findOne(id);

    if (exception.status !== ExceptionStatus.REQUESTED && exception.status !== ExceptionStatus.UNDER_REVIEW) {
      throw new BadRequestException('Only requested or under review exceptions can be approved');
    }

    return this.update(
      id,
      {
        status: ExceptionStatus.APPROVED,
        approval_conditions: conditions,
      },
      userId,
    );
  }

  async reject(id: string, userId: string, reason: string): Promise<PolicyException> {
    const exception = await this.findOne(id);

    if (exception.status !== ExceptionStatus.REQUESTED && exception.status !== ExceptionStatus.UNDER_REVIEW) {
      throw new BadRequestException('Only requested or under review exceptions can be rejected');
    }

    return this.update(
      id,
      {
        status: ExceptionStatus.REJECTED,
        rejection_reason: reason,
      },
      userId,
    );
  }

  private async generateExceptionIdentifier(): Promise<string> {
    const prefix = 'EXC';
    const year = new Date().getFullYear();
    const count = await this.exceptionRepository.count({
      where: {
        exception_identifier: Like(`${prefix}-${year}-%`),
        deleted_at: IsNull(),
      },
    });

    return `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`;
  }
}


