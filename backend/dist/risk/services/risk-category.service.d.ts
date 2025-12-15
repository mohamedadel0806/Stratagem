import { Repository } from 'typeorm';
import { RiskCategory } from '../entities/risk-category.entity';
import { CreateRiskCategoryDto } from '../dto/category/create-risk-category.dto';
import { UpdateRiskCategoryDto } from '../dto/category/update-risk-category.dto';
import { RiskCategoryResponseDto } from '../dto/category/risk-category-response.dto';
export declare class RiskCategoryService {
    private categoryRepository;
    constructor(categoryRepository: Repository<RiskCategory>);
    findAll(includeInactive?: boolean): Promise<RiskCategoryResponseDto[]>;
    findAllHierarchical(includeInactive?: boolean): Promise<RiskCategoryResponseDto[]>;
    findOne(id: string): Promise<RiskCategoryResponseDto>;
    findByCode(code: string): Promise<RiskCategoryResponseDto | null>;
    create(createDto: CreateRiskCategoryDto, userId?: string): Promise<RiskCategoryResponseDto>;
    update(id: string, updateDto: UpdateRiskCategoryDto, userId?: string): Promise<RiskCategoryResponseDto>;
    remove(id: string): Promise<void>;
    toggleActive(id: string, isActive: boolean, userId?: string): Promise<RiskCategoryResponseDto>;
    reorder(categoryOrders: {
        id: string;
        display_order: number;
    }[]): Promise<void>;
    private toResponseDto;
}
