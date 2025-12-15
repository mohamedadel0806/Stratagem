import { KRI } from './kri.entity';
import { Risk } from './risk.entity';
import { User } from '../../users/entities/user.entity';
export declare class KRIRiskLink {
    id: string;
    kri_id: string;
    kri: KRI;
    risk_id: string;
    risk: Risk;
    relationship_type: string;
    notes: string;
    linked_by: string;
    linker: User;
    linked_at: Date;
}
