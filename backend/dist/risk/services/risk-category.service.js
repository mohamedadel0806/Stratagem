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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskCategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const risk_category_entity_1 = require("../entities/risk-category.entity");
let RiskCategoryService = class RiskCategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async findAll(includeInactive = false) {
        const where = {};
        if (!includeInactive) {
            where.is_active = true;
        }
        const categories = await this.categoryRepository.find({
            where,
            relations: ['parent_category', 'sub_categories'],
            order: { display_order: 'ASC', name: 'ASC' },
        });
        return categories.map(category => this.toResponseDto(category));
    }
    async findAllHierarchical(includeInactive = false) {
        const where = { parent_category_id: (0, typeorm_2.IsNull)() };
        if (!includeInactive) {
            where.is_active = true;
        }
        const rootCategories = await this.categoryRepository.find({
            where,
            relations: ['sub_categories'],
            order: { display_order: 'ASC', name: 'ASC' },
        });
        return rootCategories.map(category => this.toResponseDto(category, true));
    }
    async findOne(id) {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['parent_category', 'sub_categories'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Risk category with ID ${id} not found`);
        }
        return this.toResponseDto(category, true);
    }
    async findByCode(code) {
        const category = await this.categoryRepository.findOne({
            where: { code },
            relations: ['parent_category', 'sub_categories'],
        });
        return category ? this.toResponseDto(category) : null;
    }
    async create(createDto, userId) {
        const category = this.categoryRepository.create(Object.assign(Object.assign({}, createDto), { created_by: userId }));
        const savedCategory = await this.categoryRepository.save(category);
        return this.toResponseDto(savedCategory);
    }
    async update(id, updateDto, userId) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException(`Risk category with ID ${id} not found`);
        }
        Object.assign(category, updateDto, { updated_by: userId });
        const updatedCategory = await this.categoryRepository.save(category);
        return this.toResponseDto(updatedCategory);
    }
    async remove(id) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException(`Risk category with ID ${id} not found`);
        }
        await this.categoryRepository.softDelete(id);
    }
    async toggleActive(id, isActive, userId) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException(`Risk category with ID ${id} not found`);
        }
        category.is_active = isActive;
        category.updated_by = userId;
        const updatedCategory = await this.categoryRepository.save(category);
        return this.toResponseDto(updatedCategory);
    }
    async reorder(categoryOrders) {
        const updates = categoryOrders.map(({ id, display_order }) => this.categoryRepository.update(id, { display_order }));
        await Promise.all(updates);
    }
    toResponseDto(category, includeSubCategories = false) {
        var _a, _b;
        const dto = {
            id: category.id,
            name: category.name,
            code: category.code,
            description: category.description,
            parent_category_id: category.parent_category_id,
            risk_tolerance: category.risk_tolerance,
            is_active: category.is_active,
            display_order: category.display_order,
            color: category.color,
            icon: category.icon,
            created_at: (_a = category.created_at) === null || _a === void 0 ? void 0 : _a.toISOString(),
            updated_at: (_b = category.updated_at) === null || _b === void 0 ? void 0 : _b.toISOString(),
        };
        if (category.parent_category) {
            dto.parent_category = this.toResponseDto(category.parent_category);
        }
        if (includeSubCategories && category.sub_categories) {
            dto.sub_categories = category.sub_categories.map(sub => this.toResponseDto(sub));
        }
        return dto;
    }
};
exports.RiskCategoryService = RiskCategoryService;
exports.RiskCategoryService = RiskCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(risk_category_entity_1.RiskCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RiskCategoryService);
//# sourceMappingURL=risk-category.service.js.map