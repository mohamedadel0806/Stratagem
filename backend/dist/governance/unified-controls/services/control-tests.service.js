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
var ControlTestsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlTestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const control_test_entity_1 = require("../entities/control-test.entity");
const control_asset_mapping_entity_1 = require("../entities/control-asset-mapping.entity");
let ControlTestsService = ControlTestsService_1 = class ControlTestsService {
    constructor(testRepository, mappingRepository) {
        this.testRepository = testRepository;
        this.mappingRepository = mappingRepository;
        this.logger = new common_1.Logger(ControlTestsService_1.name);
    }
    async create(dto, userId) {
        const test = this.testRepository.create(Object.assign(Object.assign({}, dto), { created_by: userId }));
        const savedTest = await this.testRepository.save(test);
        if (savedTest.status === control_test_entity_1.ControlTestStatus.COMPLETED && savedTest.control_asset_mapping_id) {
            await this.updateMappingTestInfo(savedTest);
        }
        return this.findOne(savedTest.id);
    }
    async findAll(query) {
        const { page = 1, limit = 20, unified_control_id, tester_id, test_type, status, result, search } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.testRepository
            .createQueryBuilder('test')
            .leftJoinAndSelect('test.unified_control', 'control')
            .leftJoinAndSelect('test.tester', 'tester')
            .leftJoinAndSelect('test.creator', 'creator')
            .where('test.deleted_at IS NULL');
        if (unified_control_id) {
            queryBuilder.andWhere('test.unified_control_id = :unified_control_id', { unified_control_id });
        }
        if (tester_id) {
            queryBuilder.andWhere('test.tester_id = :tester_id', { tester_id });
        }
        if (test_type) {
            queryBuilder.andWhere('test.test_type = :test_type', { test_type });
        }
        if (status) {
            queryBuilder.andWhere('test.status = :status', { status });
        }
        if (result) {
            queryBuilder.andWhere('test.result = :result', { result });
        }
        if (search) {
            queryBuilder.andWhere('(control.title ILIKE :search OR test.test_procedure ILIKE :search OR test.observations ILIKE :search)', { search: `%${search}%` });
        }
        const [data, total] = await queryBuilder
            .orderBy('test.test_date', 'DESC')
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
        const test = await this.testRepository.findOne({
            where: { id, deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['unified_control', 'control_asset_mapping', 'tester', 'creator', 'updater'],
        });
        if (!test) {
            throw new common_1.NotFoundException(`Control test with ID ${id} not found`);
        }
        return test;
    }
    async update(id, dto, userId) {
        const test = await this.findOne(id);
        const oldStatus = test.status;
        Object.assign(test, Object.assign(Object.assign({}, dto), { updated_by: userId }));
        const updatedTest = await this.testRepository.save(test);
        if (updatedTest.status === control_test_entity_1.ControlTestStatus.COMPLETED &&
            oldStatus !== control_test_entity_1.ControlTestStatus.COMPLETED &&
            updatedTest.control_asset_mapping_id) {
            await this.updateMappingTestInfo(updatedTest);
        }
        return updatedTest;
    }
    async remove(id) {
        const test = await this.findOne(id);
        await this.testRepository.softDelete(id);
    }
    async updateMappingTestInfo(test) {
        if (!test.control_asset_mapping_id)
            return;
        await this.mappingRepository.update(test.control_asset_mapping_id, {
            last_test_date: test.test_date,
            last_test_result: test.result,
            effectiveness_score: test.effectiveness_score,
        });
    }
};
exports.ControlTestsService = ControlTestsService;
exports.ControlTestsService = ControlTestsService = ControlTestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(control_test_entity_1.ControlTest)),
    __param(1, (0, typeorm_1.InjectRepository)(control_asset_mapping_entity_1.ControlAssetMapping)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ControlTestsService);
//# sourceMappingURL=control-tests.service.js.map