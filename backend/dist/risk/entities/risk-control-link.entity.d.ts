import { Risk } from './risk.entity';
import { UnifiedControl } from '../../governance/unified-controls/entities/unified-control.entity';
import { User } from '../../users/entities/user.entity';
export declare class RiskControlLink {
    id: string;
    risk_id: string;
    risk: Risk;
    control_id: string;
    control: UnifiedControl;
    effectiveness_rating: number;
    effectiveness_type: string;
    control_type_for_risk: string;
    notes: string;
    linked_by: string;
    linker: User;
    linked_at: Date;
    last_effectiveness_review: Date;
    updated_at: Date;
}
