import { Injectable, NotFoundException, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { UnifiedControl, ImplementationStatus } from './entities/unified-control.entity';
import { CreateUnifiedControlDto } from './dto/create-unified-control.dto';
import { UnifiedControlQueryDto } from './dto/unified-control-query.dto';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';

@Injectable()
export class UnifiedControlsService {
  private readonly logger = new Logger(UnifiedControlsService.name);

  constructor(
    @InjectRepository(UnifiedControl)
    private controlRepository: Repository<UnifiedControl>,
    @Optional() private notificationService?: NotificationService,
  ) {}

  async create(createDto: CreateUnifiedControlDto, userId: string): Promise<UnifiedControl> {
    const control = this.controlRepository.create({
      ...createDto,
      created_by: userId,
    });

    const savedControl = await this.controlRepository.save(control);

    // Send notification to control owner if assigned
    if (this.notificationService && savedControl.control_owner_id) {
      try {
        await this.notificationService.create({
          userId: savedControl.control_owner_id,
          type: NotificationType.TASK_ASSIGNED,
          priority: NotificationPriority.MEDIUM,
          title: 'New Control Assigned',
          message: `Control "${savedControl.title}" has been assigned to you as the control owner.`,
          entityType: 'control',
          entityId: savedControl.id,
          actionUrl: `/dashboard/governance/controls/${savedControl.id}`,
        });
      } catch (error) {
        this.logger.error(`Failed to send notification on control creation: ${error.message}`, error.stack);
      }
    }

    return savedControl;
  }

  async findAll(queryDto: UnifiedControlQueryDto) {
    const { page = 1, limit = 25, control_type, status, implementation_status, domain, control_owner_id, search, sort } = queryDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<UnifiedControl> = {};

    if (control_type) {
      where.control_type = control_type;
    }

    if (status) {
      where.status = status;
    }

    if (implementation_status) {
      where.implementation_status = implementation_status;
    }

    if (domain) {
      where.domain = domain;
    }

    if (control_owner_id) {
      where.control_owner_id = control_owner_id;
    }

    const queryBuilder = this.controlRepository
      .createQueryBuilder('control')
      .leftJoinAndSelect('control.control_owner', 'control_owner')
      .leftJoinAndSelect('control.creator', 'creator')
      .leftJoinAndSelect('control.updater', 'updater');

    if (Object.keys(where).length > 0) {
      queryBuilder.where(where);
    }

    if (search) {
      queryBuilder.andWhere(
        '(control.title ILIKE :search OR control.description ILIKE :search OR control.control_identifier ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`control.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('control.created_at', 'DESC');
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

  async findOne(id: string): Promise<UnifiedControl> {
    const control = await this.controlRepository.findOne({
      where: { id },
      relations: ['control_owner', 'creator', 'updater'],
    });

    if (!control) {
      throw new NotFoundException(`Unified control with ID ${id} not found`);
    }

    return control;
  }

  async update(id: string, updateDto: Partial<CreateUnifiedControlDto>, userId: string): Promise<UnifiedControl> {
    const control = await this.findOne(id);
    const oldImplementationStatus = control.implementation_status;

    Object.assign(control, {
      ...updateDto,
      updated_by: userId,
    });

    const savedControl = await this.controlRepository.save(control);

    // Send notification when implementation status changes to implemented
    if (
      this.notificationService &&
      oldImplementationStatus !== savedControl.implementation_status &&
      savedControl.implementation_status === ImplementationStatus.IMPLEMENTED
    ) {
      try {
        // Notify control owner
        if (savedControl.control_owner_id) {
          await this.notificationService.create({
            userId: savedControl.control_owner_id,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.MEDIUM,
            title: 'Control Implementation Completed',
            message: `Control "${savedControl.title}" has been marked as implemented.`,
            entityType: 'control',
            entityId: savedControl.id,
            actionUrl: `/dashboard/governance/controls/${savedControl.id}`,
          });
        }

        // Notify creator
        if (savedControl.created_by) {
          await this.notificationService.create({
            userId: savedControl.created_by,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.LOW,
            title: 'Control Implementation Completed',
            message: `Control "${savedControl.title}" has been successfully implemented.`,
            entityType: 'control',
            entityId: savedControl.id,
            actionUrl: `/dashboard/governance/controls/${savedControl.id}`,
          });
        }
      } catch (error) {
        this.logger.error(`Failed to send notification on control implementation: ${error.message}`, error.stack);
      }
    }

    return savedControl;
  }

  async remove(id: string): Promise<void> {
    const control = await this.findOne(id);
    await this.controlRepository.softRemove(control);
  }
}

