import { Injectable, NotFoundException, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Finding, FindingSeverity, FindingStatus } from './entities/finding.entity';
import { CreateFindingDto } from './dto/create-finding.dto';
import { FindingQueryDto } from './dto/finding-query.dto';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';

@Injectable()
export class FindingsService {
  private readonly logger = new Logger(FindingsService.name);

  constructor(
    @InjectRepository(Finding)
    private readonly findingRepository: Repository<Finding>,
    @Optional() private notificationService?: NotificationService,
  ) {}

  async create(createDto: CreateFindingDto, userId: string): Promise<Finding> {
    const finding = this.findingRepository.create({
      ...createDto,
      created_by: userId,
      status: createDto.status || FindingStatus.OPEN,
    });

    const savedFinding = await this.findingRepository.save(finding);

    // Send notifications based on severity and assigned owner
    if (this.notificationService) {
      try {
        const priorityMap: Record<FindingSeverity, NotificationPriority> = {
          [FindingSeverity.CRITICAL]: NotificationPriority.URGENT,
          [FindingSeverity.HIGH]: NotificationPriority.HIGH,
          [FindingSeverity.MEDIUM]: NotificationPriority.MEDIUM,
          [FindingSeverity.LOW]: NotificationPriority.LOW,
          [FindingSeverity.INFO]: NotificationPriority.LOW,
        };

        const priority = priorityMap[savedFinding.severity] || NotificationPriority.MEDIUM;

        // Notify remediation owner if assigned
        if (savedFinding.remediation_owner_id) {
          await this.notificationService.create({
            userId: savedFinding.remediation_owner_id,
            type: NotificationType.TASK_ASSIGNED,
            priority,
            title: 'New Finding Assigned',
            message: `A ${savedFinding.severity} severity finding "${savedFinding.title}" has been assigned to you for remediation.`,
            entityType: 'finding',
            entityId: savedFinding.id,
            actionUrl: `/dashboard/governance/findings/${savedFinding.id}`,
          });
        }

        // Notify risk acceptor if critical/high severity
        if (
          (savedFinding.severity === FindingSeverity.CRITICAL || savedFinding.severity === FindingSeverity.HIGH) &&
          savedFinding.risk_accepted_by
        ) {
          await this.notificationService.create({
            userId: savedFinding.risk_accepted_by,
            type: NotificationType.RISK_ESCALATED,
            priority: NotificationPriority.HIGH,
            title: 'High Severity Finding Requires Attention',
            message: `A ${savedFinding.severity} severity finding "${savedFinding.title}" requires your review and acceptance.`,
            entityType: 'finding',
            entityId: savedFinding.id,
            actionUrl: `/dashboard/governance/findings/${savedFinding.id}`,
          });
        }
      } catch (error) {
        this.logger.error(`Failed to send notification on finding creation: ${error.message}`, error.stack);
      }
    }

    return savedFinding;
  }

  async findAll(queryDto: FindingQueryDto) {
    const {
      page = 1,
      limit = 25,
      severity,
      status,
      assessment_id,
      unified_control_id,
      remediation_owner_id,
      search,
      sort,
    } = queryDto;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (severity) {
      where.severity = severity;
    }

    if (status) {
      where.status = status;
    }

    if (assessment_id) {
      where.assessment_id = assessment_id;
    }

    if (unified_control_id) {
      where.unified_control_id = unified_control_id;
    }

    if (remediation_owner_id) {
      where.remediation_owner_id = remediation_owner_id;
    }

    const queryBuilder = this.findingRepository
      .createQueryBuilder('finding')
      .leftJoinAndSelect('finding.assessment', 'assessment')
      .leftJoinAndSelect('finding.unified_control', 'unified_control')
      .leftJoinAndSelect('finding.remediation_owner', 'remediation_owner')
      .leftJoinAndSelect('finding.creator', 'creator')
      .leftJoinAndSelect('finding.updater', 'updater');

    if (Object.keys(where).length > 0) {
      queryBuilder.where(where);
    }

    if (search) {
      queryBuilder.andWhere(
        '(finding.title ILIKE :search OR finding.description ILIKE :search OR finding.finding_identifier ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Handle sorting
    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`finding.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('finding.finding_date', 'DESC');
    }

    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Finding> {
    const finding = await this.findingRepository.findOne({
      where: { id },
      relations: [
        'assessment',
        'assessment_result',
        'unified_control',
        'remediation_owner',
        'risk_acceptor',
        'creator',
        'updater',
      ],
    });

    if (!finding) {
      throw new NotFoundException(`Finding with ID ${id} not found`);
    }

    return finding;
  }

  async update(id: string, updateDto: Partial<CreateFindingDto>, userId: string): Promise<Finding> {
    const finding = await this.findOne(id);
    const oldStatus = finding.status;

    Object.assign(finding, {
      ...updateDto,
      updated_by: userId,
    });

    const savedFinding = await this.findingRepository.save(finding);

    // Send notification on status change (e.g., when remediated or closed)
    if (this.notificationService && oldStatus !== savedFinding.status) {
      try {
        if (savedFinding.status === FindingStatus.CLOSED) {
          // Notify creator when finding is closed
          if (savedFinding.created_by) {
            await this.notificationService.create({
              userId: savedFinding.created_by,
              type: NotificationType.GENERAL,
              priority: NotificationPriority.MEDIUM,
              title: 'Finding Closed',
              message: `Finding "${savedFinding.title}" has been closed.`,
              entityType: 'finding',
              entityId: savedFinding.id,
              actionUrl: `/dashboard/governance/findings/${savedFinding.id}`,
            });
          }

          // Notify remediation owner
          if (savedFinding.remediation_owner_id) {
            await this.notificationService.create({
              userId: savedFinding.remediation_owner_id,
              type: NotificationType.GENERAL,
              priority: NotificationPriority.MEDIUM,
              title: 'Finding Remediated',
              message: `Finding "${savedFinding.title}" has been successfully remediated and closed.`,
              entityType: 'finding',
              entityId: savedFinding.id,
              actionUrl: `/dashboard/governance/findings/${savedFinding.id}`,
            });
          }
        }
      } catch (error) {
        this.logger.error(`Failed to send notification on finding status change: ${error.message}`, error.stack);
      }
    }

    return savedFinding;
  }

  async remove(id: string): Promise<void> {
    const finding = await this.findOne(id);
    await this.findingRepository.softRemove(finding);
  }
}

