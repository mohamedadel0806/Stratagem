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
var GovernanceFrameworkConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceFrameworkConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const governance_framework_config_entity_1 = require("../entities/governance-framework-config.entity");
const compliance_framework_entity_1 = require("../../common/entities/compliance-framework.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let GovernanceFrameworkConfigService = GovernanceFrameworkConfigService_1 = class GovernanceFrameworkConfigService {
    constructor(frameworkConfigRepository, complianceFrameworkRepository, userRepository) {
        this.frameworkConfigRepository = frameworkConfigRepository;
        this.complianceFrameworkRepository = complianceFrameworkRepository;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(GovernanceFrameworkConfigService_1.name);
    }
    async create(createFrameworkConfigDto, userId) {
        if (createFrameworkConfigDto.linked_framework_id) {
            const linkedFramework = await this.complianceFrameworkRepository.findOne({
                where: { id: createFrameworkConfigDto.linked_framework_id },
            });
            if (!linkedFramework) {
                throw new common_1.BadRequestException(`Compliance framework with ID ${createFrameworkConfigDto.linked_framework_id} not found`);
            }
        }
        const existingConfig = await this.frameworkConfigRepository.findOne({
            where: { name: createFrameworkConfigDto.name, deleted_at: null },
        });
        if (existingConfig) {
            throw new common_1.ConflictException(`A governance framework configuration with name "${createFrameworkConfigDto.name}" already exists`);
        }
        const frameworkConfig = this.frameworkConfigRepository.create(Object.assign(Object.assign({}, createFrameworkConfigDto), { created_by: userId, updated_by: userId }));
        const savedConfig = await this.frameworkConfigRepository.save(frameworkConfig);
        this.logger.log(`Created governance framework config: ${savedConfig.id} (${savedConfig.name})`);
        return savedConfig;
    }
    async findAll(queryDto) {
        const { page = 1, limit = 25, framework_type, is_active, search, sort = 'created_at:DESC', } = queryDto;
        const skip = (page - 1) * limit;
        const where = {
            deleted_at: null,
        };
        if (framework_type) {
            where.framework_type = framework_type;
        }
        if (is_active !== undefined) {
            where.is_active = is_active;
        }
        if (search) {
            where.name = (0, typeorm_2.ILike)(`%${search}%`);
        }
        const [data, total] = await this.frameworkConfigRepository.findAndCount({
            where,
            order: this.parseSortQuery(sort),
            skip,
            take: limit,
            relations: ['linked_framework', 'creator', 'updater'],
        });
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const config = await this.frameworkConfigRepository.findOne({
            where: { id, deleted_at: null },
            relations: ['linked_framework', 'creator', 'updater'],
        });
        if (!config) {
            throw new common_1.NotFoundException(`Governance framework configuration with ID ${id} not found`);
        }
        return config;
    }
    async update(id, updateFrameworkConfigDto, userId) {
        const config = await this.findOne(id);
        if (updateFrameworkConfigDto.linked_framework_id &&
            updateFrameworkConfigDto.linked_framework_id !==
                config.linked_framework_id) {
            const linkedFramework = await this.complianceFrameworkRepository.findOne({
                where: { id: updateFrameworkConfigDto.linked_framework_id },
            });
            if (!linkedFramework) {
                throw new common_1.BadRequestException(`Compliance framework with ID ${updateFrameworkConfigDto.linked_framework_id} not found`);
            }
        }
        if (updateFrameworkConfigDto.name && updateFrameworkConfigDto.name !== config.name) {
            const existingConfig = await this.frameworkConfigRepository.findOne({
                where: { name: updateFrameworkConfigDto.name, deleted_at: null },
            });
            if (existingConfig) {
                throw new common_1.ConflictException(`A governance framework configuration with name "${updateFrameworkConfigDto.name}" already exists`);
            }
        }
        const updatedConfig = this.frameworkConfigRepository.merge(config, Object.assign(Object.assign({}, updateFrameworkConfigDto), { updated_by: userId }));
        const savedConfig = await this.frameworkConfigRepository.save(updatedConfig);
        this.logger.log(`Updated governance framework config: ${savedConfig.id} (${savedConfig.name})`);
        return savedConfig;
    }
    async remove(id) {
        const config = await this.findOne(id);
        await this.frameworkConfigRepository.update(id, {
            deleted_at: new Date(),
        });
        this.logger.log(`Soft deleted governance framework config: ${id} (${config.name})`);
    }
    async hardDelete(id) {
        const config = await this.frameworkConfigRepository.findOne({
            where: { id },
        });
        if (!config) {
            throw new common_1.NotFoundException(`Governance framework configuration with ID ${id} not found`);
        }
        await this.frameworkConfigRepository.remove(config);
        this.logger.log(`Hard deleted governance framework config: ${id} (${config.name})`);
    }
    async activate(id, userId) {
        const config = await this.findOne(id);
        if (config.is_active) {
            throw new common_1.BadRequestException('Configuration is already active');
        }
        return this.update(id, { is_active: true }, userId);
    }
    async deactivate(id, userId) {
        const config = await this.findOne(id);
        if (!config.is_active) {
            throw new common_1.BadRequestException('Configuration is already inactive');
        }
        return this.update(id, { is_active: false }, userId);
    }
    async findByFrameworkType(frameworkType) {
        return this.frameworkConfigRepository.find({
            where: { framework_type: frameworkType, deleted_at: null },
            relations: ['linked_framework', 'creator', 'updater'],
            order: { created_at: 'DESC' },
        });
    }
    async findActiveConfigs() {
        return this.frameworkConfigRepository.find({
            where: { is_active: true, deleted_at: null },
            relations: ['linked_framework', 'creator', 'updater'],
            order: { created_at: 'DESC' },
        });
    }
    parseSortQuery(sort) {
        const parts = sort.split(':');
        const field = parts[0];
        const direction = (parts[1] || 'ASC').toUpperCase();
        return { [field]: direction };
    }
};
exports.GovernanceFrameworkConfigService = GovernanceFrameworkConfigService;
exports.GovernanceFrameworkConfigService = GovernanceFrameworkConfigService = GovernanceFrameworkConfigService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(governance_framework_config_entity_1.GovernanceFrameworkConfig)),
    __param(1, (0, typeorm_1.InjectRepository)(compliance_framework_entity_1.ComplianceFramework)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GovernanceFrameworkConfigService);
//# sourceMappingURL=governance-framework-config.service.js.map