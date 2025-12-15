import { Injectable, NotFoundException, Logger, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Influencer, InfluencerStatus, ApplicabilityStatus } from './entities/influencer.entity';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';
import { InfluencerQueryDto } from './dto/influencer-query.dto';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';

@Injectable()
export class InfluencersService {
  private readonly logger = new Logger(InfluencersService.name);

  constructor(
    @InjectRepository(Influencer)
    private influencerRepository: Repository<Influencer>,
    @Optional() private notificationService?: NotificationService,
  ) {}

  async create(createInfluencerDto: CreateInfluencerDto, userId: string): Promise<Influencer> {
    const influencer = this.influencerRepository.create({
      ...createInfluencerDto,
      created_by: userId,
    });

    const savedInfluencer = await this.influencerRepository.save(influencer);

    // Send notifications for influencer creation
    if (this.notificationService && savedInfluencer.owner_id) {
      try {
        await this.notificationService.create({
          userId: savedInfluencer.owner_id,
          type: NotificationType.GENERAL,
          priority: NotificationPriority.MEDIUM,
          title: 'New Influencer Created',
          message: `Influencer "${savedInfluencer.name}" has been created and assigned to you.`,
          entityType: 'influencer',
          entityId: savedInfluencer.id,
          actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
        });
      } catch (error) {
        this.logger.error(`Failed to send notification on influencer creation: ${error.message}`, error.stack);
      }
    }

    return savedInfluencer;
  }

  async findAll(queryDto: InfluencerQueryDto) {
    const { page = 1, limit = 25, category, status, applicability_status, search, sort } = queryDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Influencer> = {};

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (applicability_status) {
      where.applicability_status = applicability_status;
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const queryBuilder = this.influencerRepository.createQueryBuilder('influencer');

    if (Object.keys(where).length > 0) {
      queryBuilder.where(where);
    }

    if (search) {
      queryBuilder.andWhere(
        '(influencer.name ILIKE :search OR influencer.description ILIKE :search OR influencer.issuing_authority ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Handle sorting
    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`influencer.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('influencer.created_at', 'DESC');
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

  async findOne(id: string): Promise<Influencer> {
    const influencer = await this.influencerRepository.findOne({
      where: { id },
      relations: ['owner', 'creator', 'updater'],
    });

    if (!influencer) {
      throw new NotFoundException(`Influencer with ID ${id} not found`);
    }

    return influencer;
  }

  async update(id: string, updateInfluencerDto: UpdateInfluencerDto, userId: string): Promise<Influencer> {
    const influencer = await this.findOne(id);
    const oldStatus = influencer.status;
    const oldApplicabilityStatus = influencer.applicability_status;
    const oldOwnerId = influencer.owner_id;

    Object.assign(influencer, {
      ...updateInfluencerDto,
      updated_by: userId,
    });

    const savedInfluencer = await this.influencerRepository.save(influencer);

    // Send notifications for status changes
    if (this.notificationService) {
      try {
        // Status change notification
        if (oldStatus !== savedInfluencer.status && savedInfluencer.owner_id) {
          await this.notificationService.create({
            userId: savedInfluencer.owner_id,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.MEDIUM,
            title: 'Influencer Status Changed',
            message: `Influencer "${savedInfluencer.name}" status has changed from ${oldStatus} to ${savedInfluencer.status}.`,
            entityType: 'influencer',
            entityId: savedInfluencer.id,
            actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
          });
        }

        // Applicability status change notification
        if (oldApplicabilityStatus !== savedInfluencer.applicability_status && savedInfluencer.owner_id) {
          await this.notificationService.create({
            userId: savedInfluencer.owner_id,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.MEDIUM,
            title: 'Influencer Applicability Changed',
            message: `Influencer "${savedInfluencer.name}" applicability has changed from ${oldApplicabilityStatus} to ${savedInfluencer.applicability_status}.`,
            entityType: 'influencer',
            entityId: savedInfluencer.id,
            actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
          });
        }

        // Owner change notification
        if (oldOwnerId !== savedInfluencer.owner_id) {
          // Notify new owner
          if (savedInfluencer.owner_id) {
            await this.notificationService.create({
              userId: savedInfluencer.owner_id,
              type: NotificationType.GENERAL,
              priority: NotificationPriority.MEDIUM,
              title: 'Influencer Assigned to You',
              message: `Influencer "${savedInfluencer.name}" has been assigned to you.`,
              entityType: 'influencer',
              entityId: savedInfluencer.id,
              actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
            });
          }
          // Notify old owner
          if (oldOwnerId) {
            await this.notificationService.create({
              userId: oldOwnerId,
              type: NotificationType.GENERAL,
              priority: NotificationPriority.LOW,
              title: 'Influencer Assignment Changed',
              message: `Influencer "${savedInfluencer.name}" has been reassigned.`,
              entityType: 'influencer',
              entityId: savedInfluencer.id,
              actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
            });
          }
        }

        // General update notification
        if (savedInfluencer.owner_id && oldStatus === savedInfluencer.status && oldApplicabilityStatus === savedInfluencer.applicability_status && oldOwnerId === savedInfluencer.owner_id) {
          await this.notificationService.create({
            userId: savedInfluencer.owner_id,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.LOW,
            title: 'Influencer Updated',
            message: `Influencer "${savedInfluencer.name}" has been updated.`,
            entityType: 'influencer',
            entityId: savedInfluencer.id,
            actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
          });
        }
      } catch (error) {
        this.logger.error(`Failed to send notification on influencer update: ${error.message}`, error.stack);
      }
    }

    return savedInfluencer;
  }

  async remove(id: string): Promise<void> {
    const influencer = await this.findOne(id);
    
    // Send notification before deletion
    if (this.notificationService && influencer.owner_id) {
      try {
        await this.notificationService.create({
          userId: influencer.owner_id,
          type: NotificationType.GENERAL,
          priority: NotificationPriority.MEDIUM,
          title: 'Influencer Deleted',
          message: `Influencer "${influencer.name}" has been deleted.`,
          entityType: 'influencer',
          entityId: influencer.id,
        });
      } catch (error) {
        this.logger.error(`Failed to send notification on influencer deletion: ${error.message}`, error.stack);
      }
    }

    await this.influencerRepository.softRemove(influencer);
  }
}

