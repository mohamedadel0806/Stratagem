import { RiskCategoryService } from '../services/risk-category.service';
import { CreateRiskCategoryDto } from '../dto/category/create-risk-category.dto';
import { UpdateRiskCategoryDto } from '../dto/category/update-risk-category.dto';
export declare class RiskCategoryController {
    private readonly categoryService;
    constructor(categoryService: RiskCategoryService);
    findAll(includeInactive?: string, hierarchical?: string): Promise<import("../dto/category/risk-category-response.dto").RiskCategoryResponseDto[]>;
    findOne(id: string): Promise<import("../dto/category/risk-category-response.dto").RiskCategoryResponseDto>;
    findByCode(code: string): Promise<import("../dto/category/risk-category-response.dto").RiskCategoryResponseDto>;
    create(createDto: CreateRiskCategoryDto, req: any): Promise<import("../dto/category/risk-category-response.dto").RiskCategoryResponseDto>;
    update(id: string, updateDto: UpdateRiskCategoryDto, req: any): Promise<import("../dto/category/risk-category-response.dto").RiskCategoryResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    toggleActive(id: string, isActive: boolean, req: any): Promise<import("../dto/category/risk-category-response.dto").RiskCategoryResponseDto>;
    reorder(categoryOrders: {
        id: string;
        display_order: number;
    }[]): Promise<{
        message: string;
    }>;
}
