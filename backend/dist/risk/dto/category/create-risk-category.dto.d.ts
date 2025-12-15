import { RiskTolerance } from '../../entities/risk-category.entity';
export declare class CreateRiskCategoryDto {
    name: string;
    code: string;
    description?: string;
    parent_category_id?: string;
    risk_tolerance?: RiskTolerance;
    is_active?: boolean;
    display_order?: number;
    color?: string;
    icon?: string;
}
