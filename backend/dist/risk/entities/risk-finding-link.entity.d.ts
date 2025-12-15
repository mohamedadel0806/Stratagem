import { Risk } from './risk.entity';
import { Finding } from '../../governance/findings/entities/finding.entity';
import { User } from '../../users/entities/user.entity';
export declare enum RiskFindingRelationshipType {
    IDENTIFIED = "identified",
    CONTRIBUTES_TO = "contributes_to",
    MITIGATES = "mitigates",
    EXACERBATES = "exacerbates",
    RELATED = "related"
}
export declare class RiskFindingLink {
    id: string;
    risk_id: string;
    risk: Risk;
    finding_id: string;
    finding: Finding;
    relationship_type: RiskFindingRelationshipType;
    notes: string;
    linked_by: string;
    linker: User;
    linked_at: Date;
    updated_at: Date;
}
