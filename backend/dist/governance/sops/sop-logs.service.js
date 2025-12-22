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
var SOPLogsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOPLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sop_log_entity_1 = require("./entities/sop-log.entity");
let SOPLogsService = SOPLogsService_1 = class SOPLogsService {
    constructor(logRepository) {
        this.logRepository = logRepository;
        this.logger = new common_1.Logger(SOPLogsService_1.name);
    }
    async create(dto, userId) {
        const log = this.logRepository.create(Object.assign(Object.assign({}, dto), { created_by: userId, executor_id: dto.executor_id || userId }));
        return this.logRepository.save(log);
    }
    async findAll(query) {
        const { page = 1, limit = 20, sop_id, executor_id, outcome, search } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.logRepository
            .createQueryBuilder('log')
            .leftJoinAndSelect('log.sop', 'sop')
            .leftJoinAndSelect('log.executor', 'executor')
            .leftJoinAndSelect('log.creator', 'creator')
            .where('log.deleted_at IS NULL');
        if (sop_id) {
            queryBuilder.andWhere('log.sop_id = :sop_id', { sop_id });
        }
        if (executor_id) {
            queryBuilder.andWhere('log.executor_id = :executor_id', { executor_id });
        }
        if (outcome) {
            queryBuilder.andWhere('log.outcome = :outcome', { outcome });
        }
        if (search) {
            queryBuilder.andWhere('(sop.title ILIKE :search OR log.notes ILIKE :search)', { search: `%${search}%` });
        }
        const [data, total] = await queryBuilder
            .orderBy('log.execution_date', 'DESC')
            .addOrderBy('log.created_at', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
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
        const log = await this.logRepository.findOne({
            where: { id, deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['sop', 'executor', 'creator', 'updater'],
        });
        if (!log) {
            throw new common_1.NotFoundException(`SOP execution log with ID ${id} not found`);
        }
        return log;
    }
    async update(id, dto, userId) {
        const log = await this.findOne(id);
        Object.assign(log, Object.assign(Object.assign({}, dto), { updated_by: userId }));
        return this.logRepository.save(log);
    }
    async remove(id) {
        const log = await this.findOne(id);
        await this.logRepository.softDelete(id);
    }
    async getStatistics() {
        const stats = await this.logRepository
            .createQueryBuilder('log')
            .select('log.outcome', 'outcome')
            .addSelect('COUNT(*)', 'count')
            .where('log.deleted_at IS NULL')
            .groupBy('log.outcome')
            .getRawMany();
        return {
            byOutcome: stats,
        };
    }
};
exports.SOPLogsService = SOPLogsService;
exports.SOPLogsService = SOPLogsService = SOPLogsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sop_log_entity_1.SOPLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SOPLogsService);
//# sourceMappingURL=sop-logs.service.js.map