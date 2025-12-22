"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InfluencersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluencersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const influencer_entity_1 = require("./entities/influencer.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
const influencer_revision_service_1 = require("./services/influencer-revision.service");
const influencer_revision_entity_1 = require("./entities/influencer-revision.entity");
let InfluencersService = InfluencersService_1 = class InfluencersService {
    constructor(influencerRepository, notificationService, revisionService) {
        this.influencerRepository = influencerRepository;
        this.notificationService = notificationService;
        this.revisionService = revisionService;
        this.logger = new common_1.Logger(InfluencersService_1.name);
    }
    async create(createInfluencerDto, userId) {
        const influencer = this.influencerRepository.create(Object.assign(Object.assign({}, createInfluencerDto), { created_by: userId }));
        const savedInfluencer = await this.influencerRepository.save(influencer);
        if (this.revisionService) {
            try {
                await this.revisionService.createRevision(savedInfluencer, influencer_revision_entity_1.RevisionType.CREATED, userId, 'Influencer created');
            }
            catch (error) {
                this.logger.error(`Failed to create revision for influencer ${savedInfluencer.id}:`, error);
            }
        }
        if (this.notificationService && savedInfluencer.owner_id) {
            try {
                await this.notificationService.create({
                    userId: savedInfluencer.owner_id,
                    type: notification_entity_1.NotificationType.GENERAL,
                    priority: notification_entity_1.NotificationPriority.MEDIUM,
                    title: 'New Influencer Created',
                    message: `Influencer "${savedInfluencer.name}" has been created and assigned to you.`,
                    entityType: 'influencer',
                    entityId: savedInfluencer.id,
                    actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
                });
            }
            catch (error) {
                this.logger.error(`Failed to send notification on influencer creation: ${error.message}`, error.stack);
            }
        }
        return savedInfluencer;
    }
    async findAll(queryDto) {
        const { page = 1, limit = 25, category, status, applicability_status, search, sort, tags } = queryDto;
        const skip = (page - 1) * limit;
        const where = {};
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
            where.name = (0, typeorm_2.ILike)(`%${search}%`);
        }
        const queryBuilder = this.influencerRepository.createQueryBuilder('influencer');
        if (Object.keys(where).length > 0) {
            queryBuilder.where(where);
        }
        if (search) {
            queryBuilder.andWhere('(influencer.name ILIKE :search OR influencer.description ILIKE :search OR influencer.issuing_authority ILIKE :search)', { search: `%${search}%` });
        }
        if (tags && tags.length > 0) {
            queryBuilder.andWhere('influencer.tags && :tags', { tags });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`influencer.${field}`, order.toUpperCase());
        }
        else {
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
    async findOne(id) {
        const influencer = await this.influencerRepository.findOne({
            where: { id },
            relations: ['owner', 'creator', 'updater'],
        });
        if (!influencer) {
            throw new common_1.NotFoundException(`Influencer with ID ${id} not found`);
        }
        return influencer;
    }
    async update(id, updateInfluencerDto, userId) {
        const influencer = await this.findOne(id);
        const oldStatus = influencer.status;
        const oldApplicabilityStatus = influencer.applicability_status;
        const oldOwnerId = influencer.owner_id;
        const oldName = influencer.name;
        const oldDescription = influencer.description;
        const changesSummary = {};
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
        let revisionType = influencer_revision_entity_1.RevisionType.UPDATED;
        if (updateInfluencerDto.status && updateInfluencerDto.status !== oldStatus) {
            revisionType = influencer_revision_entity_1.RevisionType.STATUS_CHANGED;
        }
        else if (updateInfluencerDto.applicability_status && updateInfluencerDto.applicability_status !== oldApplicabilityStatus) {
            revisionType = influencer_revision_entity_1.RevisionType.APPLICABILITY_CHANGED;
        }
        Object.assign(influencer, Object.assign(Object.assign({}, updateInfluencerDto), { updated_by: userId, last_revision_date: new Date() }));
        const savedInfluencer = await this.influencerRepository.save(influencer);
        if (this.revisionService && Object.keys(changesSummary).length > 0) {
            try {
                await this.revisionService.createRevision(savedInfluencer, revisionType, userId, updateInfluencerDto.revision_notes, changesSummary);
            }
            catch (error) {
                this.logger.error(`Failed to create revision for influencer ${savedInfluencer.id}:`, error);
            }
        }
        if (this.notificationService) {
            try {
                if (oldStatus !== savedInfluencer.status && savedInfluencer.owner_id) {
                    await this.notificationService.create({
                        userId: savedInfluencer.owner_id,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.MEDIUM,
                        title: 'Influencer Status Changed',
                        message: `Influencer "${savedInfluencer.name}" status has changed from ${oldStatus} to ${savedInfluencer.status}.`,
                        entityType: 'influencer',
                        entityId: savedInfluencer.id,
                        actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
                    });
                }
                if (oldApplicabilityStatus !== savedInfluencer.applicability_status && savedInfluencer.owner_id) {
                    await this.notificationService.create({
                        userId: savedInfluencer.owner_id,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.MEDIUM,
                        title: 'Influencer Applicability Changed',
                        message: `Influencer "${savedInfluencer.name}" applicability has changed from ${oldApplicabilityStatus} to ${savedInfluencer.applicability_status}.`,
                        entityType: 'influencer',
                        entityId: savedInfluencer.id,
                        actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
                    });
                }
                if (oldOwnerId !== savedInfluencer.owner_id) {
                    if (savedInfluencer.owner_id) {
                        await this.notificationService.create({
                            userId: savedInfluencer.owner_id,
                            type: notification_entity_1.NotificationType.GENERAL,
                            priority: notification_entity_1.NotificationPriority.MEDIUM,
                            title: 'Influencer Assigned to You',
                            message: `Influencer "${savedInfluencer.name}" has been assigned to you.`,
                            entityType: 'influencer',
                            entityId: savedInfluencer.id,
                            actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
                        });
                    }
                    if (oldOwnerId) {
                        await this.notificationService.create({
                            userId: oldOwnerId,
                            type: notification_entity_1.NotificationType.GENERAL,
                            priority: notification_entity_1.NotificationPriority.LOW,
                            title: 'Influencer Assignment Changed',
                            message: `Influencer "${savedInfluencer.name}" has been reassigned.`,
                            entityType: 'influencer',
                            entityId: savedInfluencer.id,
                            actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
                        });
                    }
                }
                if (savedInfluencer.owner_id && oldStatus === savedInfluencer.status && oldApplicabilityStatus === savedInfluencer.applicability_status && oldOwnerId === savedInfluencer.owner_id) {
                    await this.notificationService.create({
                        userId: savedInfluencer.owner_id,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.LOW,
                        title: 'Influencer Updated',
                        message: `Influencer "${savedInfluencer.name}" has been updated.`,
                        entityType: 'influencer',
                        entityId: savedInfluencer.id,
                        actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
                    });
                }
            }
            catch (error) {
                this.logger.error(`Failed to send notification on influencer update: ${error.message}`, error.stack);
            }
        }
        return savedInfluencer;
    }
    async remove(id) {
        const influencer = await this.findOne(id);
        if (this.notificationService && influencer.owner_id) {
            try {
                await this.notificationService.create({
                    userId: influencer.owner_id,
                    type: notification_entity_1.NotificationType.GENERAL,
                    priority: notification_entity_1.NotificationPriority.MEDIUM,
                    title: 'Influencer Deleted',
                    message: `Influencer "${influencer.name}" has been deleted.`,
                    entityType: 'influencer',
                    entityId: influencer.id,
                });
            }
            catch (error) {
                this.logger.error(`Failed to send notification on influencer deletion: ${error.message}`, error.stack);
            }
        }
        await this.influencerRepository.softRemove(influencer);
    }
    async getAllTags() {
        const influencers = await this.influencerRepository.find({
            select: ['tags'],
            where: { deleted_at: null },
        });
        const allTags = new Set();
        influencers.forEach((influencer) => {
            if (influencer.tags && influencer.tags.length > 0) {
                influencer.tags.forEach((tag) => allTags.add(tag));
            }
        });
        return Array.from(allTags).sort();
    }
    async getTagStatistics() {
        const influencers = await this.influencerRepository.find({
            select: ['tags'],
            where: { deleted_at: null },
        });
        const tagCounts = new Map();
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
    async reviewInfluencer(id, reviewData, userId) {
        const influencer = await this.findOne(id);
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
        if (this.revisionService) {
            try {
                await this.revisionService.createRevision(savedInfluencer, influencer_revision_entity_1.RevisionType.REVIEWED, userId, reviewData.revision_notes, undefined, reviewData.impact_assessment);
            }
            catch (error) {
                this.logger.error(`Failed to create review revision for influencer ${savedInfluencer.id}:`, error);
            }
        }
        if (this.notificationService && reviewData.impact_assessment) {
            const { affected_policies, affected_controls, business_units_impact } = reviewData.impact_assessment;
            if (savedInfluencer.owner_id) {
                try {
                    await this.notificationService.create({
                        userId: savedInfluencer.owner_id,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.MEDIUM,
                        title: 'Influencer Review Completed',
                        message: `Influencer "${savedInfluencer.name}" has been reviewed. Impact assessment indicates changes may be needed.`,
                        entityType: 'influencer',
                        entityId: savedInfluencer.id,
                        actionUrl: `/dashboard/governance/influencers/${savedInfluencer.id}`,
                        metadata: {
                            impactAssessment: reviewData.impact_assessment,
                        },
                    });
                }
                catch (error) {
                    this.logger.error(`Failed to send review notification:`, error);
                }
            }
        }
        return savedInfluencer;
    }
    async getRevisionHistory(influencerId) {
        if (!this.revisionService) {
            return [];
        }
        return this.revisionService.getRevisionHistory(influencerId);
    }
    async bulkImport(data, userId) {
        let created = 0;
        let skipped = 0;
        const errors = [];
        for (const item of data) {
            try {
                if (!item.name || !item.category) {
                    skipped++;
                    errors.push(`Skipped: Missing name or category for item "${item.name || 'Unknown'}"`);
                    continue;
                }
                const existing = await this.influencerRepository.findOne({
                    where: { name: item.name, category: item.category, deleted_at: null },
                });
                if (existing) {
                    skipped++;
                    errors.push(`Skipped: Influencer "${item.name}" already exists in category "${item.category}"`);
                    continue;
                }
                const influencer = this.influencerRepository.create(Object.assign(Object.assign({}, item), { created_by: userId }));
                await this.influencerRepository.save(influencer);
                created++;
            }
            catch (error) {
                skipped++;
                errors.push(`Error: Failed to import "${item.name || 'Unknown'}": ${error.message}`);
            }
        }
        return { created, skipped, errors };
    }
};
exports.InfluencersService = InfluencersService;
exports.InfluencersService = InfluencersService = InfluencersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(influencer_entity_1.Influencer)),
    __param(1, (0, common_1.Optional)()),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService,
        influencer_revision_service_1.InfluencerRevisionService])
], InfluencersService);
//# sourceMappingURL=influencers.service.js.map