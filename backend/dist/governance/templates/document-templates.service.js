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
var DocumentTemplatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_template_entity_1 = require("./entities/document-template.entity");
let DocumentTemplatesService = DocumentTemplatesService_1 = class DocumentTemplatesService {
    constructor(templateRepository) {
        this.templateRepository = templateRepository;
        this.logger = new common_1.Logger(DocumentTemplatesService_1.name);
    }
    async create(dto, userId) {
        const template = this.templateRepository.create(Object.assign(Object.assign({}, dto), { created_by: userId }));
        return this.templateRepository.save(template);
    }
    async findAll(query) {
        const { type, category, isActive, search } = query;
        const queryBuilder = this.templateRepository
            .createQueryBuilder('template')
            .leftJoinAndSelect('template.creator', 'creator')
            .where('template.deleted_at IS NULL');
        if (type) {
            queryBuilder.andWhere('template.type = :type', { type });
        }
        if (category) {
            queryBuilder.andWhere('template.category = :category', { category });
        }
        if (isActive !== undefined) {
            queryBuilder.andWhere('template.isActive = :isActive', { isActive });
        }
        if (search) {
            queryBuilder.andWhere('(template.name ILIKE :search OR template.description ILIKE :search)', { search: `%${search}%` });
        }
        return queryBuilder.orderBy('template.name', 'ASC').getMany();
    }
    async findOne(id) {
        const template = await this.templateRepository.findOne({
            where: { id, deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['creator', 'updater'],
        });
        if (!template) {
            throw new common_1.NotFoundException(`Template with ID ${id} not found`);
        }
        return template;
    }
    async update(id, dto, userId) {
        const template = await this.findOne(id);
        Object.assign(template, Object.assign(Object.assign({}, dto), { updated_by: userId }));
        return this.templateRepository.save(template);
    }
    async remove(id) {
        const template = await this.findOne(id);
        await this.templateRepository.softDelete(id);
    }
};
exports.DocumentTemplatesService = DocumentTemplatesService;
exports.DocumentTemplatesService = DocumentTemplatesService = DocumentTemplatesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_template_entity_1.DocumentTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DocumentTemplatesService);
//# sourceMappingURL=document-templates.service.js.map