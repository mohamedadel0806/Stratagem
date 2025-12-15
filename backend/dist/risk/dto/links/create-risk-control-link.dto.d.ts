export declare class CreateRiskControlLinkDto {
    risk_id: string;
    control_id: string;
    effectiveness_rating?: number;
    effectiveness_type?: string;
    control_type_for_risk?: string;
    notes?: string;
}
export declare class UpdateRiskControlLinkDto {
    effectiveness_rating?: number;
    effectiveness_type?: string;
    control_type_for_risk?: string;
    notes?: string;
    last_effectiveness_review?: string;
}
