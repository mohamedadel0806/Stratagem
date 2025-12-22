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
var UnifiedControlsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedControlsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const unified_control_entity_1 = require("./entities/unified-control.entity");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
const domain_entity_1 = require("../../governance/domains/entities/domain.entity");
let UnifiedControlsService = UnifiedControlsService_1 = class UnifiedControlsService {
    constructor(controlRepository, domainRepository, notificationService) {
        this.controlRepository = controlRepository;
        this.domainRepository = domainRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(UnifiedControlsService_1.name);
    }
    async create(createDto, userId) {
        const control = this.controlRepository.create(Object.assign(Object.assign({}, createDto), { created_by: userId }));
        const savedControl = await this.controlRepository.save(control);
        if (this.notificationService && savedControl.control_owner_id) {
            try {
                await this.notificationService.create({
                    userId: savedControl.control_owner_id,
                    type: notification_entity_1.NotificationType.TASK_ASSIGNED,
                    priority: notification_entity_1.NotificationPriority.MEDIUM,
                    title: 'New Control Assigned',
                    message: `Control "${savedControl.title}" has been assigned to you as the control owner.`,
                    entityType: 'control',
                    entityId: savedControl.id,
                    actionUrl: `/dashboard/governance/controls/${savedControl.id}`,
                });
            }
            catch (error) {
                this.logger.error(`Failed to send notification on control creation: ${error.message}`, error.stack);
            }
        }
        return savedControl;
    }
    async findAll(queryDto) {
        const { page = 1, limit = 25, control_type, status, implementation_status, domain, control_owner_id, search, sort } = queryDto;
        const skip = (page - 1) * limit;
        const where = {};
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
            queryBuilder.andWhere('(control.title ILIKE :search OR control.description ILIKE :search OR control.control_identifier ILIKE :search)', { search: `%${search}%` });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`control.${field}`, order.toUpperCase());
        }
        else {
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
    async findOne(id) {
        const control = await this.controlRepository.findOne({
            where: { id },
            relations: ['control_owner', 'creator', 'updater'],
        });
        if (!control) {
            throw new common_1.NotFoundException(`Unified control with ID ${id} not found`);
        }
        return control;
    }
    async update(id, updateDto, userId) {
        const control = await this.findOne(id);
        const oldImplementationStatus = control.implementation_status;
        Object.assign(control, Object.assign(Object.assign({}, updateDto), { updated_by: userId }));
        const savedControl = await this.controlRepository.save(control);
        if (this.notificationService &&
            oldImplementationStatus !== savedControl.implementation_status &&
            savedControl.implementation_status === unified_control_entity_1.ImplementationStatus.IMPLEMENTED) {
            try {
                if (savedControl.control_owner_id) {
                    await this.notificationService.create({
                        userId: savedControl.control_owner_id,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.MEDIUM,
                        title: 'Control Implementation Completed',
                        message: `Control "${savedControl.title}" has been marked as implemented.`,
                        entityType: 'control',
                        entityId: savedControl.id,
                        actionUrl: `/dashboard/governance/controls/${savedControl.id}`,
                    });
                }
                if (savedControl.created_by) {
                    await this.notificationService.create({
                        userId: savedControl.created_by,
                        type: notification_entity_1.NotificationType.GENERAL,
                        priority: notification_entity_1.NotificationPriority.LOW,
                        title: 'Control Implementation Completed',
                        message: `Control "${savedControl.title}" has been successfully implemented.`,
                        entityType: 'control',
                        entityId: savedControl.id,
                        actionUrl: `/dashboard/governance/controls/${savedControl.id}`,
                    });
                }
            }
            catch (error) {
                this.logger.error(`Failed to send notification on control implementation: ${error.message}`, error.stack);
            }
        }
        return savedControl;
    }
    async remove(id) {
        const control = await this.findOne(id);
        await this.controlRepository.softRemove(control);
    }
    async getLibraryStatistics() {
        try {
            const [total, active, draft, deprecated] = await Promise.all([
                this.controlRepository.count(),
                this.controlRepository.count({ where: { status: unified_control_entity_1.ControlStatus.ACTIVE } }),
                this.controlRepository.count({ where: { status: unified_control_entity_1.ControlStatus.DRAFT } }),
                this.controlRepository.count({ where: { status: unified_control_entity_1.ControlStatus.DEPRECATED } }),
            ]);
            const byTypeResults = await this.controlRepository
                .createQueryBuilder('control')
                .select('control.control_type', 'type')
                .addSelect('COUNT(*)', 'count')
                .groupBy('control.control_type')
                .getRawMany();
            const byType = {};
            byTypeResults.forEach((row) => {
                byType[row.type] = parseInt(row.count, 10);
            });
            const byComplexityResults = await this.controlRepository
                .createQueryBuilder('control')
                .select('control.complexity', 'complexity')
                .addSelect('COUNT(*)', 'count')
                .groupBy('control.complexity')
                .getRawMany();
            const byComplexity = {};
            byComplexityResults.forEach((row) => {
                byComplexity[row.complexity] = parseInt(row.count, 10);
            });
            const implemented = await this.controlRepository.count({
                where: { implementation_status: unified_control_entity_1.ImplementationStatus.IMPLEMENTED },
            });
            const implementationRate = total > 0 ? Math.round((implemented / total) * 100) : 0;
            return {
                totalControls: total,
                activeControls: active,
                draftControls: draft,
                deprecatedControls: deprecated,
                byType,
                byComplexity,
                implementationRate,
            };
        }
        catch (error) {
            this.logger.error('Error getting control library statistics', error);
            return {
                totalControls: 0,
                activeControls: 0,
                draftControls: 0,
                deprecatedControls: 0,
                byType: {},
                byComplexity: {},
                implementationRate: 0,
            };
        }
    }
    async getControlsByDomain(domainId, includeArchived = false) {
        const query = this.controlRepository.createQueryBuilder('control')
            .leftJoinAndSelect('control.control_owner', 'control_owner')
            .where('control.domain = :domain', { domain: domainId });
        if (!includeArchived) {
            query.andWhere('control.deleted_at IS NULL');
        }
        query.orderBy('control.created_at', 'DESC');
        return query.getMany();
    }
    async getDomainHierarchyTree(parentId = null) {
        const query = this.domainRepository.createQueryBuilder('domain')
            .leftJoinAndSelect('domain.children', 'children')
            .where('domain.parent_id IS NULL');
        if (parentId) {
            query.where('domain.parent_id = :parentId', { parentId });
        }
        query.andWhere('domain.is_active = true')
            .orderBy('domain.display_order', 'ASC');
        const domains = await query.getMany();
        const tree = await Promise.all(domains.map(async (domain) => (Object.assign(Object.assign({}, domain), { controlCount: await this.controlRepository.count({ where: { domain: domain.id } }), children: await this.getDomainHierarchyTree(domain.id) }))));
        return tree;
    }
    async getControlTypes() {
        return Object.values(unified_control_entity_1.ControlType);
    }
    async getActiveDomains() {
        return this.domainRepository.find({
            where: { is_active: true },
            order: { display_order: 'ASC' },
        });
    }
    async browseLibrary(filters) {
        const { domain, type, complexity, status, implementationStatus, search, page = 1, limit = 50 } = filters;
        const skip = (page - 1) * limit;
        const query = this.controlRepository.createQueryBuilder('control')
            .leftJoinAndSelect('control.control_owner', 'control_owner')
            .where('control.deleted_at IS NULL');
        if (domain) {
            query.andWhere('control.domain = :domain', { domain });
        }
        if (type) {
            query.andWhere('control.control_type = :type', { type });
        }
        if (complexity) {
            query.andWhere('control.complexity = :complexity', { complexity });
        }
        if (status) {
            query.andWhere('control.status = :status', { status });
        }
        if (implementationStatus) {
            query.andWhere('control.implementation_status = :implementationStatus', { implementationStatus });
        }
        if (search) {
            query.andWhere('(control.title ILIKE :search OR control.description ILIKE :search OR control.control_identifier ILIKE :search)', { search: `%${search}%` });
        }
        query.orderBy('control.created_at', 'DESC')
            .skip(skip)
            .take(limit);
        const [data, total] = await query.getManyAndCount();
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
    async getRelatedControls(controlId, limit = 5) {
        const control = await this.findOne(controlId);
        const relatedControls = await this.controlRepository
            .createQueryBuilder('control')
            .where('control.id != :controlId', { controlId })
            .andWhere('control.deleted_at IS NULL')
            .andWhere('(control.domain = :domain OR control.control_type = :type)', { domain: control.domain, type: control.control_type })
            .orderBy('control.created_at', 'DESC')
            .take(limit)
            .getMany();
        return relatedControls;
    }
    async getControlEffectiveness(controlId) {
        const control = await this.findOne(controlId);
        return {
            controlId: control.id,
            title: control.title,
            implementationStatus: control.implementation_status,
            lastUpdated: control.updated_at,
            avgEffectiveness: 0,
            testHistory: [],
        };
    }
    async exportControls(filters) {
        let query = this.controlRepository
            .createQueryBuilder('control')
            .select([
            'control.control_identifier',
            'control.title',
            'control.domain',
            'control.control_type',
            'control.complexity',
            'control.cost_impact',
            'control.status',
            'control.implementation_status',
        ])
            .where('control.deleted_at IS NULL');
        if (filters === null || filters === void 0 ? void 0 : filters.domain) {
            query = query.andWhere('control.domain = :domain', { domain: filters.domain });
        }
        if (filters === null || filters === void 0 ? void 0 : filters.type) {
            query = query.andWhere('control.control_type = :type', { type: filters.type });
        }
        if (filters === null || filters === void 0 ? void 0 : filters.status) {
            query = query.andWhere('control.status = :status', { status: filters.status });
        }
        const controls = await query.getRawMany();
        const headers = [
            'Control ID',
            'Title',
            'Domain',
            'Type',
            'Complexity',
            'Cost Impact',
            'Status',
            'Implementation Status',
        ];
        const rows = controls.map((c) => [
            c.control_control_identifier,
            c.control_title,
            c.control_domain,
            c.control_control_type,
            c.control_complexity,
            c.control_cost_impact,
            c.control_status,
            c.control_implementation_status,
        ]);
        const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell || ''}"`).join(',')).join('\n');
        return csv;
    }
    async importControls(controlsData, userId) {
        const result = { created: 0, skipped: 0, errors: [] };
        for (let i = 0; i < controlsData.length; i++) {
            try {
                const data = controlsData[i];
                const existing = await this.controlRepository.findOne({
                    where: { control_identifier: data.control_identifier },
                });
                if (existing) {
                    result.skipped++;
                    continue;
                }
                const control = this.controlRepository.create({
                    control_identifier: data.control_identifier,
                    title: data.title,
                    domain: data.domain,
                    control_type: data.control_type,
                    complexity: data.complexity,
                    cost_impact: data.cost_impact,
                    description: data.description,
                    control_procedures: data.control_procedures,
                    testing_procedures: data.testing_procedures,
                });
                await this.controlRepository.save(control);
                result.created++;
            }
            catch (error) {
                result.errors.push({
                    row: i + 1,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
        return result;
    }
    async getControlsDashboard() {
        const [recentControls, draftControls, implementedControls, deprecatedControls] = await Promise.all([
            this.controlRepository
                .createQueryBuilder('control')
                .where('control.deleted_at IS NULL')
                .orderBy('control.created_at', 'DESC')
                .take(5)
                .getMany(),
            this.controlRepository
                .createQueryBuilder('control')
                .where('control.status = :status', { status: unified_control_entity_1.ControlStatus.DRAFT })
                .orderBy('control.created_at', 'DESC')
                .take(10)
                .getMany(),
            this.controlRepository
                .createQueryBuilder('control')
                .where('control.implementation_status = :status', { status: unified_control_entity_1.ImplementationStatus.IMPLEMENTED })
                .orderBy('control.updated_at', 'DESC')
                .take(10)
                .getMany(),
            this.controlRepository
                .createQueryBuilder('control')
                .where('control.status = :status', { status: unified_control_entity_1.ControlStatus.DEPRECATED })
                .orderBy('control.created_at', 'DESC')
                .take(10)
                .getMany(),
        ]);
        return {
            recentControls,
            draftControls,
            implementedControls,
            deprecatedControls,
        };
    }
};
exports.UnifiedControlsService = UnifiedControlsService;
exports.UnifiedControlsService = UnifiedControlsService = UnifiedControlsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __param(1, (0, typeorm_1.InjectRepository)(domain_entity_1.ControlDomain)),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], UnifiedControlsService);
//# sourceMappingURL=unified-controls.service.js.map