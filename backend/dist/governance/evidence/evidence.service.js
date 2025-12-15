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
var EvidenceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvidenceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const evidence_entity_1 = require("./entities/evidence.entity");
const evidence_linkage_entity_1 = require("./entities/evidence-linkage.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let EvidenceService = EvidenceService_1 = class EvidenceService {
    constructor(evidenceRepository, evidenceLinkageRepository, notificationService) {
        this.evidenceRepository = evidenceRepository;
        this.evidenceLinkageRepository = evidenceLinkageRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(EvidenceService_1.name);
    }
    async create(createDto, userId) {
        const evidence = this.evidenceRepository.create(Object.assign(Object.assign({}, createDto), { created_by: userId, collector_id: createDto.collector_id || userId }));
        const savedEvidence = await this.evidenceRepository.save(evidence);
        if (this.notificationService && savedEvidence.approved_by) {
            try {
                await this.notificationService.create({
                    userId: savedEvidence.approved_by,
                    type: notification_entity_1.NotificationType.GENERAL,
                    priority: notification_entity_1.NotificationPriority.MEDIUM,
                    title: 'Evidence Submitted for Approval',
                    message: `Evidence "${savedEvidence.title}" has been submitted and requires your approval.`,
                    entityType: 'evidence',
                    entityId: savedEvidence.id,
                    actionUrl: `/dashboard/governance/evidence/${savedEvidence.id}`,
                });
            }
            catch (error) {
                this.logger.error(`Failed to send notification on evidence creation: ${error.message}`, error.stack);
            }
        }
        return savedEvidence;
    }
    async findAll(query) {
        const { page = 1, limit = 25, evidence_type, status, search } = query || {};
        const skip = (page - 1) * limit;
        const where = {};
        if (evidence_type) {
            where.evidence_type = evidence_type;
        }
        if (status) {
            where.status = status;
        }
        const queryBuilder = this.evidenceRepository
            .createQueryBuilder('evidence')
            .leftJoinAndSelect('evidence.collector', 'collector')
            .leftJoinAndSelect('evidence.creator', 'creator')
            .leftJoinAndSelect('evidence.approver', 'approver');
        if (Object.keys(where).length > 0) {
            queryBuilder.where(where);
        }
        if (search) {
            queryBuilder.andWhere('(evidence.title ILIKE :search OR evidence.description ILIKE :search OR evidence.evidence_identifier ILIKE :search)', { search: `%${search}%` });
        }
        queryBuilder.orderBy('evidence.created_at', 'DESC');
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
        const evidence = await this.evidenceRepository.findOne({
            where: { id },
            relations: ['collector', 'creator', 'approver', 'linkages'],
        });
        if (!evidence) {
            throw new common_1.NotFoundException(`Evidence with ID ${id} not found`);
        }
        return evidence;
    }
    async update(id, updateDto, userId) {
        const evidence = await this.findOne(id);
        const oldStatus = evidence.status;
        Object.assign(evidence, updateDto);
        const savedEvidence = await this.evidenceRepository.save(evidence);
        if (this.notificationService && oldStatus !== savedEvidence.status) {
            try {
                if (savedEvidence.status === 'approved' || savedEvidence.status === 'rejected') {
                    const recipientId = savedEvidence.collector_id || savedEvidence.created_by;
                    if (recipientId) {
                        await this.notificationService.create({
                            userId: recipientId,
                            type: notification_entity_1.NotificationType.GENERAL,
                            priority: savedEvidence.status === 'approved' ? notification_entity_1.NotificationPriority.MEDIUM : notification_entity_1.NotificationPriority.HIGH,
                            title: savedEvidence.status === 'approved' ? 'Evidence Approved' : 'Evidence Rejected',
                            message: `Evidence "${savedEvidence.title}" has been ${savedEvidence.status}.`,
                            entityType: 'evidence',
                            entityId: savedEvidence.id,
                            actionUrl: `/dashboard/governance/evidence/${savedEvidence.id}`,
                        });
                    }
                }
                if (savedEvidence.status === 'approved' && savedEvidence.valid_until_date) {
                    const daysUntilExpiry = Math.ceil((new Date(savedEvidence.valid_until_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    if (daysUntilExpiry <= 30 && savedEvidence.created_by) {
                        await this.notificationService.create({
                            userId: savedEvidence.created_by,
                            type: notification_entity_1.NotificationType.DEADLINE_APPROACHING,
                            priority: notification_entity_1.NotificationPriority.MEDIUM,
                            title: 'Evidence Expiring Soon',
                            message: `Evidence "${savedEvidence.title}" will expire in ${daysUntilExpiry} day(s).`,
                            entityType: 'evidence',
                            entityId: savedEvidence.id,
                            actionUrl: `/dashboard/governance/evidence/${savedEvidence.id}`,
                        });
                    }
                }
            }
            catch (error) {
                this.logger.error(`Failed to send notification on evidence status change: ${error.message}`, error.stack);
            }
        }
        return savedEvidence;
    }
    async remove(id) {
        const evidence = await this.findOne(id);
        await this.evidenceRepository.softRemove(evidence);
    }
    async linkEvidence(evidenceId, linkType, linkedEntityId, description, userId) {
        const evidence = await this.findOne(evidenceId);
        const linkage = this.evidenceLinkageRepository.create({
            evidence_id: evidenceId,
            link_type: linkType,
            linked_entity_id: linkedEntityId,
            link_description: description,
            created_by: userId,
        });
        return this.evidenceLinkageRepository.save(linkage);
    }
    async getLinkedEvidence(linkType, linkedEntityId) {
        const linkages = await this.evidenceLinkageRepository.find({
            where: {
                link_type: linkType,
                linked_entity_id: linkedEntityId,
            },
            relations: ['evidence', 'evidence.collector'],
        });
        return linkages.map((linkage) => linkage.evidence);
    }
};
exports.EvidenceService = EvidenceService;
exports.EvidenceService = EvidenceService = EvidenceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(evidence_entity_1.Evidence)),
    __param(1, (0, typeorm_1.InjectRepository)(evidence_linkage_entity_1.EvidenceLinkage)),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], EvidenceService);
//# sourceMappingURL=evidence.service.js.map