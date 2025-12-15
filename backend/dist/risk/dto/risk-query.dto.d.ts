import { RiskStatus, RiskCategory_OLD as RiskCategory, RiskLevel } from '../entities/risk.entity';
export declare class RiskQueryDto {
    search?: string;
    status?: RiskStatus;
    category?: RiskCategory;
    category_id?: string;
    current_risk_level?: RiskLevel;
    likelihood?: number;
    impact?: number;
    ownerId?: string;
    page?: number;
    limit?: number;
}
