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
var SOPStepsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOPStepsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sop_step_entity_1 = require("../entities/sop-step.entity");
const sop_entity_1 = require("../entities/sop.entity");
let SOPStepsService = SOPStepsService_1 = class SOPStepsService {
    constructor(stepRepository, sopRepository) {
        this.stepRepository = stepRepository;
        this.sopRepository = sopRepository;
        this.logger = new common_1.Logger(SOPStepsService_1.name);
    }
    async create(createDto, userId) {
        const sop = await this.sopRepository.findOne({ where: { id: createDto.sop_id } });
        if (!sop) {
            throw new common_1.NotFoundException(`SOP with ID ${createDto.sop_id} not found`);
        }
        const step = this.stepRepository.create(Object.assign(Object.assign({}, createDto), { created_by: userId }));
        return this.stepRepository.save(step);
    }
    async findAll(queryDto) {
        const { page = 1, limit = 25, sop_id, sort } = queryDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.stepRepository
            .createQueryBuilder('step')
            .leftJoinAndSelect('step.sop', 'sop')
            .leftJoinAndSelect('step.creator', 'creator')
            .leftJoinAndSelect('step.updater', 'updater');
        if (sop_id) {
            queryBuilder.andWhere('step.sop_id = :sop_id', { sop_id });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`step.${field}`, order.toUpperCase());
        }
        else {
            queryBuilder.orderBy('step.step_number', 'ASC');
        }
        const [data, total] = await queryBuilder
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
        const step = await this.stepRepository.findOne({
            where: { id },
            relations: ['sop', 'creator', 'updater'],
        });
        if (!step) {
            throw new common_1.NotFoundException(`SOP step with ID ${id} not found`);
        }
        return step;
    }
    async update(id, updateDto, userId) {
        const step = await this.findOne(id);
        Object.assign(step, Object.assign(Object.assign({}, updateDto), { updated_by: userId }));
        return this.stepRepository.save(step);
    }
    async remove(id) {
        const step = await this.findOne(id);
        await this.stepRepository.softRemove(step);
    }
    async getStepsForSOP(sopId) {
        return this.stepRepository.find({
            where: { sop_id: sopId },
            order: { step_number: 'ASC' },
        });
    }
    async getCriticalSteps(sopId) {
        return this.stepRepository.find({
            where: {
                sop_id: sopId,
                is_critical: true,
            },
            order: { step_number: 'ASC' },
        });
    }
    async reorderSteps(sopId, stepIds, userId) {
        const steps = await this.stepRepository.find({
            where: { sop_id: sopId },
        });
        if (steps.length !== stepIds.length) {
            throw new Error('Mismatch in step count');
        }
        const updatedSteps = [];
        for (let i = 0; i < stepIds.length; i++) {
            const step = steps.find((s) => s.id === stepIds[i]);
            if (!step) {
                throw new common_1.NotFoundException(`Step with ID ${stepIds[i]} not found`);
            }
            step.step_number = i + 1;
            step.updated_by = userId;
            updatedSteps.push(step);
        }
        await this.stepRepository.save(updatedSteps);
        return updatedSteps;
    }
    async getTotalEstimatedDuration(sopId) {
        const steps = await this.getStepsForSOP(sopId);
        return steps.reduce((total, step) => total + (step.estimated_duration_minutes || 0), 0);
    }
};
exports.SOPStepsService = SOPStepsService;
exports.SOPStepsService = SOPStepsService = SOPStepsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sop_step_entity_1.SOPStep)),
    __param(1, (0, typeorm_1.InjectRepository)(sop_entity_1.SOP)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SOPStepsService);
//# sourceMappingURL=sop-steps.service.js.map