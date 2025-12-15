import { RiskTolerance } from '../../entities/risk-category.entity';

export class RiskCategoryResponseDto {
  id: string;
  name: string;
  code: string;
  description?: string;
  parent_category_id?: string;
  parent_category?: RiskCategoryResponseDto;
  sub_categories?: RiskCategoryResponseDto[];
  risk_tolerance: RiskTolerance;
  is_active: boolean;
  display_order: number;
  color?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}




