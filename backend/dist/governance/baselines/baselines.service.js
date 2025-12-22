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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var BaselinesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaselinesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const baseline_entity_1 = require("./entities/baseline.entity");
const control_objective_entity_1 = require("../control-objectives/entities/control-objective.entity");
let BaselinesService = BaselinesService_1 = class BaselinesService {
    constructor(baselineRepository, requirementRepository, controlObjectiveRepository) {
        this.baselineRepository = baselineRepository;
        this.requirementRepository = requirementRepository;
        this.controlObjectiveRepository = controlObjectiveRepository;
        this.logger = new common_1.Logger(BaselinesService_1.name);
    }
    async create(dto, userId) {
        let identifier = dto.baseline_identifier;
        if (!identifier) {
            identifier = await this.generateIdentifier();
        }
        const { requirements, control_objective_ids } = dto, baselineData = __rest(dto, ["requirements", "control_objective_ids"]);
        const baseline = this.baselineRepository.create(Object.assign(Object.assign({}, baselineData), { baseline_identifier: identifier, created_by: userId }));
        if (control_objective_ids && control_objective_ids.length > 0) {
            baseline.control_objectives = await this.controlObjectiveRepository.find({
                where: { id: (0, typeorm_2.In)(control_objective_ids) },
            });
        }
        const savedBaseline = await this.baselineRepository.save(baseline);
        if (requirements && requirements.length > 0) {
            const requirementEntities = requirements.map((req) => this.requirementRepository.create(Object.assign(Object.assign({}, req), { baseline_id: savedBaseline.id })));
            await this.requirementRepository.save(requirementEntities);
        }
        return this.findOne(savedBaseline.id);
    }
    async findAll(query) {
        const { page = 1, limit = 25, status, category, search, sort } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.baselineRepository
            .createQueryBuilder('baseline')
            .leftJoinAndSelect('baseline.owner', 'owner')
            .leftJoinAndSelect('baseline.creator', 'creator')
            .where('baseline.deleted_at IS NULL');
        if (status) {
            queryBuilder.andWhere('baseline.status = :status', { status });
        }
        if (category) {
            queryBuilder.andWhere('baseline.category = :category', { category });
        }
        if (search) {
            queryBuilder.andWhere('(baseline.name ILIKE :search OR baseline.description ILIKE :search OR baseline.baseline_identifier ILIKE :search)', { search: `%${search}%` });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`baseline.${field}`, order.toUpperCase());
        }
        else {
            queryBuilder.orderBy('baseline.created_at', 'DESC');
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
        const baseline = await this.baselineRepository.findOne({
            where: { id, deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['requirements', 'control_objectives', 'owner', 'creator', 'updater'],
        });
        if (!baseline) {
            throw new common_1.NotFoundException(`Secure baseline with ID ${id} not found`);
        }
        return baseline;
    }
    async update(id, dto, userId) {
        const baseline = await this.findOne(id);
        const { requirements, control_objective_ids } = dto, baselineData = __rest(dto, ["requirements", "control_objective_ids"]);
        Object.assign(baseline, Object.assign(Object.assign({}, baselineData), { updated_by: userId }));
        if (control_objective_ids) {
            baseline.control_objectives = await this.controlObjectiveRepository.find({
                where: { id: (0, typeorm_2.In)(control_objective_ids) },
            });
        }
        const updatedBaseline = await this.baselineRepository.save(baseline);
        if (requirements) {
            await this.requirementRepository.delete({ baseline_id: id });
            const requirementEntities = requirements.map((req) => this.requirementRepository.create(Object.assign(Object.assign({}, req), { baseline_id: id })));
            await this.requirementRepository.save(requirementEntities);
        }
        return this.findOne(id);
    }
    async remove(id) {
        const baseline = await this.findOne(id);
        await this.baselineRepository.softDelete(id);
    }
    async generateIdentifier() {
        const prefix = 'BSL';
        const year = new Date().getFullYear();
        const count = await this.baselineRepository.count({
            where: {
                baseline_identifier: (0, typeorm_2.Like)(`${prefix}-${year}-%`),
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        return `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`;
    }
};
exports.BaselinesService = BaselinesService;
exports.BaselinesService = BaselinesService = BaselinesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(baseline_entity_1.SecureBaseline)),
    __param(1, (0, typeorm_1.InjectRepository)(baseline_entity_1.BaselineRequirement)),
    __param(2, (0, typeorm_1.InjectRepository)(control_objective_entity_1.ControlObjective)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BaselinesService);
//# sourceMappingURL=baselines.service.js.map