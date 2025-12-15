import { User } from '../../users/entities/user.entity';
export declare enum RiskTolerance {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export declare class RiskCategory {
    id: string;
    name: string;
    code: string;
    description: string;
    parent_category_id: string;
    parent_category: RiskCategory;
    sub_categories: RiskCategory[];
    risk_tolerance: RiskTolerance;
    is_active: boolean;
    display_order: number;
    color: string;
    icon: string;
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
