import { Risk } from './risk.entity';
import { User } from '../../users/entities/user.entity';
export declare enum RiskAssetType {
    PHYSICAL = "physical",
    INFORMATION = "information",
    SOFTWARE = "software",
    APPLICATION = "application",
    SUPPLIER = "supplier"
}
export declare class RiskAssetLink {
    id: string;
    risk_id: string;
    risk: Risk;
    asset_type: RiskAssetType;
    asset_id: string;
    impact_description: string;
    asset_criticality_at_link: string;
    linked_by: string;
    linker: User;
    linked_at: Date;
    updated_at: Date;
}
