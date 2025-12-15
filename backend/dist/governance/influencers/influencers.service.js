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
let InfluencersService = InfluencersService_1 = class InfluencersService {
    constructor(influencerRepository, notificationService) {
        this.influencerRepository = influencerRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(InfluencersService_1.name);
    }
    async create(createInfluencerDto, userId) {
        const influencer = this.influencerRepository.create(Object.assign(Object.assign({}, createInfluencerDto), { created_by: userId }));
        const savedInfluencer = await this.influencerRepository.save(influencer);
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
        const { page = 1, limit = 25, category, status, applicability_status, search, sort } = queryDto;
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
        Object.assign(influencer, Object.assign(Object.assign({}, updateInfluencerDto), { updated_by: userId }));
        const savedInfluencer = await this.influencerRepository.save(influencer);
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
};
exports.InfluencersService = InfluencersService;
exports.InfluencersService = InfluencersService = InfluencersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(influencer_entity_1.Influencer)),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService])
], InfluencersService);
//# sourceMappingURL=influencers.service.js.map