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
var ObligationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObligationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const compliance_obligation_entity_1 = require("./entities/compliance-obligation.entity");
let ObligationsService = ObligationsService_1 = class ObligationsService {
    constructor(obligationRepository) {
        this.obligationRepository = obligationRepository;
        this.logger = new common_1.Logger(ObligationsService_1.name);
    }
    async create(dto, userId) {
        let identifier = dto.obligation_identifier;
        if (!identifier) {
            identifier = await this.generateIdentifier();
        }
        const obligation = this.obligationRepository.create(Object.assign(Object.assign({}, dto), { obligation_identifier: identifier, created_by: userId }));
        return this.obligationRepository.save(obligation);
    }
    async findAll(query) {
        const { page = 1, limit = 25, status, priority, influencer_id, owner_id, business_unit_id, search, sort } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.obligationRepository
            .createQueryBuilder('obligation')
            .leftJoinAndSelect('obligation.influencer', 'influencer')
            .leftJoinAndSelect('obligation.owner', 'owner')
            .leftJoinAndSelect('obligation.business_unit', 'business_unit')
            .leftJoinAndSelect('obligation.creator', 'creator')
            .where('obligation.deleted_at IS NULL');
        if (status) {
            queryBuilder.andWhere('obligation.status = :status', { status });
        }
        if (priority) {
            queryBuilder.andWhere('obligation.priority = :priority', { priority });
        }
        if (influencer_id) {
            queryBuilder.andWhere('obligation.influencer_id = :influencer_id', { influencer_id });
        }
        if (owner_id) {
            queryBuilder.andWhere('obligation.owner_id = :owner_id', { owner_id });
        }
        if (business_unit_id) {
            queryBuilder.andWhere('obligation.business_unit_id = :business_unit_id', { business_unit_id });
        }
        if (search) {
            queryBuilder.andWhere('(obligation.title ILIKE :search OR obligation.description ILIKE :search OR obligation.obligation_identifier ILIKE :search)', { search: `%${search}%` });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`obligation.${field}`, order.toUpperCase());
        }
        else {
            queryBuilder.orderBy('obligation.created_at', 'DESC');
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
        const obligation = await this.obligationRepository.findOne({
            where: { id, deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['influencer', 'owner', 'business_unit', 'creator', 'updater'],
        });
        if (!obligation) {
            throw new common_1.NotFoundException(`Obligation with ID ${id} not found`);
        }
        return obligation;
    }
    async update(id, dto, userId) {
        const obligation = await this.findOne(id);
        if (dto.status === compliance_obligation_entity_1.ObligationStatus.MET && obligation.status !== compliance_obligation_entity_1.ObligationStatus.MET) {
            obligation.completion_date = new Date();
        }
        Object.assign(obligation, Object.assign(Object.assign({}, dto), { updated_by: userId }));
        return this.obligationRepository.save(obligation);
    }
    async remove(id) {
        const obligation = await this.findOne(id);
        await this.obligationRepository.softDelete(id);
    }
    async getStatistics() {
        const stats = await this.obligationRepository
            .createQueryBuilder('obligation')
            .select('obligation.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where('obligation.deleted_at IS NULL')
            .groupBy('obligation.status')
            .getRawMany();
        const priorityStats = await this.obligationRepository
            .createQueryBuilder('obligation')
            .select('obligation.priority', 'priority')
            .addSelect('COUNT(*)', 'count')
            .where('obligation.deleted_at IS NULL')
            .groupBy('obligation.priority')
            .getRawMany();
        return {
            byStatus: stats,
            byPriority: priorityStats,
        };
    }
    async generateIdentifier() {
        const prefix = 'OBL';
        const year = new Date().getFullYear();
        const count = await this.obligationRepository.count({
            where: {
                obligation_identifier: (0, typeorm_2.Like)(`${prefix}-${year}-%`),
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        return `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`;
    }
};
exports.ObligationsService = ObligationsService;
exports.ObligationsService = ObligationsService = ObligationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(compliance_obligation_entity_1.ComplianceObligation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ObligationsService);
//# sourceMappingURL=obligations.service.js.map