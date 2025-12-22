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
var SOPTemplatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOPTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sop_template_entity_1 = require("../entities/sop-template.entity");
let SOPTemplatesService = SOPTemplatesService_1 = class SOPTemplatesService {
    constructor(templateRepository) {
        this.templateRepository = templateRepository;
        this.logger = new common_1.Logger(SOPTemplatesService_1.name);
    }
    async create(createDto, userId) {
        const existing = await this.templateRepository.findOne({
            where: { template_key: createDto.template_key },
        });
        if (existing) {
            throw new Error(`Template with key ${createDto.template_key} already exists`);
        }
        const template = this.templateRepository.create(Object.assign(Object.assign({}, createDto), { created_by: userId, status: createDto.status || sop_template_entity_1.TemplateStatus.DRAFT }));
        return this.templateRepository.save(template);
    }
    async findAll(queryDto) {
        const { page = 1, limit = 25, status, category, search, sort } = queryDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.templateRepository
            .createQueryBuilder('template')
            .leftJoinAndSelect('template.owner', 'owner')
            .leftJoinAndSelect('template.creator', 'creator')
            .leftJoinAndSelect('template.updater', 'updater');
        if (status) {
            queryBuilder.andWhere('template.status = :status', { status });
        }
        if (category) {
            queryBuilder.andWhere('template.category = :category', { category });
        }
        if (search) {
            queryBuilder.andWhere('(template.title ILIKE :search OR template.description ILIKE :search OR template.template_key ILIKE :search)', { search: `%${search}%` });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`template.${field}`, order.toUpperCase());
        }
        else {
            queryBuilder.orderBy('template.created_at', 'DESC');
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
        const template = await this.templateRepository.findOne({
            where: { id },
            relations: ['owner', 'creator', 'updater'],
        });
        if (!template) {
            throw new common_1.NotFoundException(`SOP template with ID ${id} not found`);
        }
        return template;
    }
    async findByKey(templateKey) {
        const template = await this.templateRepository.findOne({
            where: { template_key: templateKey },
            relations: ['owner', 'creator', 'updater'],
        });
        if (!template) {
            throw new common_1.NotFoundException(`SOP template with key ${templateKey} not found`);
        }
        return template;
    }
    async update(id, updateDto, userId) {
        const template = await this.findOne(id);
        Object.assign(template, Object.assign(Object.assign({}, updateDto), { updated_by: userId }));
        return this.templateRepository.save(template);
    }
    async remove(id) {
        const template = await this.findOne(id);
        await this.templateRepository.softRemove(template);
    }
    async getActiveTemplates() {
        return this.templateRepository.find({
            where: { status: sop_template_entity_1.TemplateStatus.ACTIVE },
            relations: ['owner'],
            order: { title: 'ASC' },
        });
    }
    async getTemplatesByCategory(category) {
        return this.templateRepository.find({
            where: {
                category,
                status: sop_template_entity_1.TemplateStatus.ACTIVE,
            },
            relations: ['owner'],
            order: { title: 'ASC' },
        });
    }
    async cloneTemplate(id, newKey, userId) {
        const original = await this.findOne(id);
        const cloned = this.templateRepository.create({
            template_key: newKey,
            title: `${original.title} (Clone)`,
            category: original.category,
            description: original.description,
            purpose_template: original.purpose_template,
            scope_template: original.scope_template,
            content_template: original.content_template,
            success_criteria_template: original.success_criteria_template,
            status: sop_template_entity_1.TemplateStatus.DRAFT,
            tags: [...(original.tags || [])],
            metadata: Object.assign({}, original.metadata),
            created_by: userId,
        });
        return this.templateRepository.save(cloned);
    }
};
exports.SOPTemplatesService = SOPTemplatesService;
exports.SOPTemplatesService = SOPTemplatesService = SOPTemplatesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sop_template_entity_1.SOPTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SOPTemplatesService);
//# sourceMappingURL=sop-templates.service.js.map