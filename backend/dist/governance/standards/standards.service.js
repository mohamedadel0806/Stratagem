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
var StandardsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const standard_entity_1 = require("./entities/standard.entity");
const control_objective_entity_1 = require("../control-objectives/entities/control-objective.entity");
let StandardsService = StandardsService_1 = class StandardsService {
    constructor(standardRepository, controlObjectiveRepository) {
        this.standardRepository = standardRepository;
        this.controlObjectiveRepository = controlObjectiveRepository;
        this.logger = new common_1.Logger(StandardsService_1.name);
    }
    async create(createStandardDto, userId) {
        const standard = this.standardRepository.create(Object.assign(Object.assign({}, createStandardDto), { created_by: userId }));
        const savedStandard = await this.standardRepository.save(standard);
        if (createStandardDto.control_objective_ids && createStandardDto.control_objective_ids.length > 0) {
            const controlObjectives = await this.controlObjectiveRepository.find({
                where: { id: (0, typeorm_2.In)(createStandardDto.control_objective_ids) },
            });
            savedStandard.control_objectives = controlObjectives;
            await this.standardRepository.save(savedStandard);
        }
        return savedStandard;
    }
    async findAll(queryDto) {
        const { page = 1, limit = 25, status, policy_id, control_objective_id, owner_id, search, sort } = queryDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (policy_id) {
            where.policy_id = policy_id;
        }
        if (control_objective_id) {
            where.control_objective_id = control_objective_id;
        }
        if (owner_id) {
            where.owner_id = owner_id;
        }
        const queryBuilder = this.standardRepository
            .createQueryBuilder('standard')
            .leftJoinAndSelect('standard.owner', 'owner')
            .leftJoinAndSelect('standard.creator', 'creator')
            .leftJoinAndSelect('standard.updater', 'updater')
            .leftJoinAndSelect('standard.policy', 'policy')
            .leftJoinAndSelect('standard.control_objective', 'control_objective')
            .leftJoinAndSelect('standard.control_objectives', 'control_objectives');
        if (Object.keys(where).length > 0) {
            queryBuilder.where(where);
        }
        if (search) {
            queryBuilder.andWhere('(standard.title ILIKE :search OR standard.description ILIKE :search OR standard.content ILIKE :search)', { search: `%${search}%` });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`standard.${field}`, order.toUpperCase());
        }
        else {
            queryBuilder.orderBy('standard.created_at', 'DESC');
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
        const standard = await this.standardRepository.findOne({
            where: { id },
            relations: [
                'owner',
                'creator',
                'updater',
                'policy',
                'control_objective',
                'control_objectives',
            ],
        });
        if (!standard) {
            throw new common_1.NotFoundException(`Standard with ID ${id} not found`);
        }
        return standard;
    }
    async update(id, updateStandardDto, userId) {
        const standard = await this.findOne(id);
        Object.assign(standard, Object.assign(Object.assign({}, updateStandardDto), { updated_by: userId }));
        if (updateStandardDto.control_objective_ids !== undefined) {
            if (updateStandardDto.control_objective_ids.length > 0) {
                const controlObjectives = await this.controlObjectiveRepository.find({
                    where: { id: (0, typeorm_2.In)(updateStandardDto.control_objective_ids) },
                });
                standard.control_objectives = controlObjectives;
            }
            else {
                standard.control_objectives = [];
            }
        }
        return await this.standardRepository.save(standard);
    }
    async remove(id) {
        const standard = await this.findOne(id);
        await this.standardRepository.softRemove(standard);
    }
};
exports.StandardsService = StandardsService;
exports.StandardsService = StandardsService = StandardsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(standard_entity_1.Standard)),
    __param(1, (0, typeorm_1.InjectRepository)(control_objective_entity_1.ControlObjective)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StandardsService);
//# sourceMappingURL=standards.service.js.map