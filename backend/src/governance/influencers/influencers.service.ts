import { Injectable, NotFoundException, Logger, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Influencer, InfluencerStatus, ApplicabilityStatus } from './entities/influencer.entity';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';
import { InfluencerQueryDto } from './dto/influencer-query.dto';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';
import { InfluencerRevisionService } from './services/influencer-revision.service';
import { RevisionType } from './entities/influencer-revision.entity';

@Injectable()
export class InfluencersService {
  private readonly logger = new Logger(InfluencersService.name);

  constructor(
    @InjectRepository(Influencer)
    private influencerRepository: Repository<Influencer>,
    @Optional() private notificationService?: NotificationService,
    @Optional() private revisionService?: InfluencerRevisionService,
  ) {}

  async create(createInfluencerDto: CreateInfluencerDto, userId: string): Promise<Influencer> {
    const influencer = this.influencerRepository.create({
      ...createInfluencerDto,
      created_by: userId,
    });

    const savedInfluencer = await this.influencerRepository.save(influencer);

    // Create initial revision
    if (this.revisionService) {
      try {
        await this.revisionService.createRevision(
          savedInfluencer,
          RevisionType.CREATED,
          userId,
          'Influencer created',
        );
      } catch (error) {
        this.logger.error(`Failed to create revision for influencer ${savedInfluencer.id}:`, error);
      }
    }

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
    const { page = 1, limit = 25, category, status, applicability_status, search, sort, tags } = queryDto;
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

    // Handle tag filtering
    if (tags && tags.length > 0) {
      queryBuilder.andWhere('influencer.tags && :tags', { tags });
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
    const oldName = influencer.name;
    const oldDescription = influencer.description;

    // Track changes for revision
    const changesSummary: Record<string, { old: any; new: any }> = {};
    
    if (updateInfluencerDto.name && updateInfluencerDto.name !== oldName) {
      changesSummary.name = { old: oldName, new: updateInfluencerDto.name };
    }
    if (updateInfluencerDto.description && updateInfluencerDto.description !== oldDescription) {
      changesSummary.description = { old: oldDescription, new: updateInfluencerDto.description };
    }
    if (updateInfluencerDto.status && updateInfluencerDto.status !== oldStatus) {
      changesSummary.status = { old: oldStatus, new: updateInfluencerDto.status };
    }
    if (updateInfluencerDto.applicability_status && updateInfluencerDto.applicability_status !== oldApplicabilityStatus) {
      changesSummary.applicability_status = { old: oldApplicabilityStatus, new: updateInfluencerDto.applicability_status };
    }

    // Determine revision type
    let revisionType = RevisionType.UPDATED;
    if (updateInfluencerDto.status && updateInfluencerDto.status !== oldStatus) {
      revisionType = RevisionType.STATUS_CHANGED;
    } else if (updateInfluencerDto.applicability_status && updateInfluencerDto.applicability_status !== oldApplicabilityStatus) {
      revisionType = RevisionType.APPLICABILITY_CHANGED;
    }

    Object.assign(influencer, {
      ...updateInfluencerDto,
      updated_by: userId,
      last_revision_date: new Date(),
    });

    const savedInfluencer = await this.influencerRepository.save(influencer);

    // Create revision record
    if (this.revisionService && Object.keys(changesSummary).length > 0) {
      try {
        await this.revisionService.createRevision(
          savedInfluencer,
          revisionType,
          userId,
          updateInfluencerDto.revision_notes,
          changesSummary,
        );
      } catch (error) {
        this.logger.error(`Failed to create revision for influencer ${savedInfluencer.id}:`, error);
      }
    }

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

  async getAllTags(): Promise<string[]> {
    const influencers = await this.influencerRepository.find({
      select: ['tags'],
      where: { deleted_at: null },
    });

    const allTags = new Set<string>();
    influencers.forEach((influencer) => {
      if (influencer.tags && influencer.tags.length > 0) {
        influencer.tags.forEach((tag) => allTags.add(tag));
      }
    });

    return Array.from(allTags).sort();
  }

  async getTagStatistics(): Promise<Array<{ tag: string; count: number }>> {
    const influencers = await this.influencerRepository.find({
      select: ['tags'],
      where: { deleted_at: null },
    });

    const tagCounts = new Map<string, number>();
    influencers.forEach((influencer) => {
      if (influencer.tags && influencer.tags.length > 0) {
        influencer.tags.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  async reviewInfluencer(
    id: string,
    reviewData: {
      revision_notes?: string;
      next_review_date?: Date;
      review_frequency_days?: number;
      impact_assessment?: {
        affected_policies?: string[];
        affected_controls?: string[];
        business_units_impact?: string[];
        risk_level?: 'low' | 'medium' | 'high' | 'critical';
        notes?: string;
      };
    },
    userId: string,
  ): Promise<Influencer> {
    const influencer = await this.findOne(id);

    // Update review-related fields
    if (reviewData.next_review_date !== undefined) {
      influencer.next_review_date = reviewData.next_review_date;
    }
    if (reviewData.review_frequency_days !== undefined) {
      influencer.review_frequency_days = reviewData.review_frequency_days;
    }
    influencer.last_revision_date = new Date();
    influencer.revision_notes = reviewData.revision_notes || influencer.revision_notes;
    influencer.updated_by = userId;

    const savedInfluencer = await this.influencerRepository.save(influencer);

    // Create review revision
    if (this.revisionService) {
      try {
        await this.revisionService.createRevision(
          savedInfluencer,
          RevisionType.REVIEWED,
          userId,
          reviewData.revision_notes,
          undefined,
          reviewData.impact_assessment,
        );
      } catch (error) {
        this.logger.error(`Failed to create review revision for influencer ${savedInfluencer.id}:`, error);
      }
    }

    // Notify stakeholders if impact assessment indicates changes
    if (this.notificationService && reviewData.impact_assessment) {
      const { affected_policies, affected_controls, business_units_impact } = reviewData.impact_assessment;
      
      // Notify owner
      if (savedInfluencer.owner_id) {
        try {
          await this.notificationService.create({
            userId: savedInfluencer.owner_id,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.MEDIUM,
            title: 'Influencer Review Completed',
            message: `Influencer "${savedInfluencer.name}" has been reviewed. Impact assessment indicates changes may be needed.`,
            entityType: 'influencer',
            entityId: savedInfluencer.id,
            actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
            metadata: {
              impactAssessment: reviewData.impact_assessment,
            },
          });
        } catch (error) {
          this.logger.error(`Failed to send review notification:`, error);
        }
      }

      // TODO: Notify stakeholders for affected policies/controls
      // This would require querying policy/control owners
    }

    return savedInfluencer;
  }

  async getRevisionHistory(influencerId: string) {
    if (!this.revisionService) {
      return [];
    }
    return this.revisionService.getRevisionHistory(influencerId);
  }

  async bulkImport(data: Partial<Influencer>[], userId: string): Promise<{ created: number; skipped: number; errors: string[] }> {
    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of data) {
      try {
        if (!item.name || !item.category) {
          skipped++;
          errors.push(`Skipped: Missing name or category for item "${item.name || 'Unknown'}"`);
          continue;
        }

        // Check if already exists (by name and category)
        const existing = await this.influencerRepository.findOne({
          where: { name: item.name, category: item.category, deleted_at: null },
        });

        if (existing) {
          skipped++;
          errors.push(`Skipped: Influencer "${item.name}" already exists in category "${item.category}"`);
          continue;
        }

        const influencer = this.influencerRepository.create({
          ...item,
          created_by: userId,
        });

        await this.influencerRepository.save(influencer);
        created++;
      } catch (error) {
        skipped++;
        errors.push(`Error: Failed to import "${item.name || 'Unknown'}": ${error.message}`);
      }
    }

    return { created, skipped, errors };
  }
}

