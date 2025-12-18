import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { RiskCategory } from '../entities/risk-category.entity';
import { CreateRiskCategoryDto } from '../dto/category/create-risk-category.dto';
import { UpdateRiskCategoryDto } from '../dto/category/update-risk-category.dto';
import { RiskCategoryResponseDto } from '../dto/category/risk-category-response.dto';

@Injectable()
export class RiskCategoryService {
  constructor(
    @InjectRepository(RiskCategory)
    private categoryRepository: Repository<RiskCategory>,
  ) {}

  async findAll(includeInactive = false): Promise<RiskCategoryResponseDto[]> {
    const where: any = {};
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

  async findAllHierarchical(includeInactive = false): Promise<RiskCategoryResponseDto[]> {
    const where: any = { parent_category_id: IsNull() };
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

  async findOne(id: string): Promise<RiskCategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent_category', 'sub_categories'],
    });

    if (!category) {
      throw new NotFoundException(`Risk category with ID ${id} not found`);
    }

    return this.toResponseDto(category, true);
  }

  async findByCode(code: string): Promise<RiskCategoryResponseDto | null> {
    const category = await this.categoryRepository.findOne({
      where: { code },
      relations: ['parent_category', 'sub_categories'],
    });

    return category ? this.toResponseDto(category) : null;
  }

  async create(createDto: CreateRiskCategoryDto, userId?: string): Promise<RiskCategoryResponseDto> {
    const category = this.categoryRepository.create({
      ...createDto,
      created_by: userId,
    });

    const savedCategory = await this.categoryRepository.save(category);
    return this.toResponseDto(savedCategory);
  }

  async update(id: string, updateDto: UpdateRiskCategoryDto, userId?: string): Promise<RiskCategoryResponseDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    
    if (!category) {
      throw new NotFoundException(`Risk category with ID ${id} not found`);
    }

    Object.assign(category, updateDto, { updated_by: userId });
    const updatedCategory = await this.categoryRepository.save(category);

    return this.toResponseDto(updatedCategory);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    
    if (!category) {
      throw new NotFoundException(`Risk category with ID ${id} not found`);
    }

    // Soft delete
    await this.categoryRepository.softDelete(id);
  }

  async toggleActive(id: string, isActive: boolean, userId?: string): Promise<RiskCategoryResponseDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    
    if (!category) {
      throw new NotFoundException(`Risk category with ID ${id} not found`);
    }

    category.is_active = isActive;
    category.updated_by = userId;
    const updatedCategory = await this.categoryRepository.save(category);

    return this.toResponseDto(updatedCategory);
  }

  async reorder(categoryOrders: { id: string; display_order: number }[]): Promise<void> {
    const updates = categoryOrders.map(({ id, display_order }) =>
      this.categoryRepository.update(id, { display_order }),
    );
    await Promise.all(updates);
  }

  private toResponseDto(category: RiskCategory, includeSubCategories = false): RiskCategoryResponseDto {
    const dto: RiskCategoryResponseDto = {
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
      created_at: category.created_at?.toISOString(),
      updated_at: category.updated_at?.toISOString(),
    };

    if (category.parent_category) {
      dto.parent_category = this.toResponseDto(category.parent_category);
    }

    if (includeSubCategories && category.sub_categories) {
      dto.sub_categories = category.sub_categories.map(sub => this.toResponseDto(sub));
    }

    return dto;
  }
}





