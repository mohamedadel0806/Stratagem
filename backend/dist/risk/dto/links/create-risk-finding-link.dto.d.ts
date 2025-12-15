import { RiskFindingRelationshipType } from '../../entities/risk-finding-link.entity';
export declare class CreateRiskFindingLinkDto {
    risk_id: string;
    finding_id: string;
    relationship_type?: RiskFindingRelationshipType;
    notes?: string;
}
export declare class UpdateRiskFindingLinkDto {
    relationship_type?: RiskFindingRelationshipType;
    notes?: string;
}
