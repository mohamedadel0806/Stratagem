import { Policy } from './policy.entity';
import { User } from '../../../users/entities/user.entity';
import { BusinessUnit } from '../../../common/entities/business-unit.entity';
export declare class PolicyAssignment {
    id: string;
    policy_id: string;
    policy: Policy;
    user_id: string | null;
    user: User | null;
    role: string | null;
    business_unit_id: string | null;
    business_unit: BusinessUnit | null;
    assigned_at: Date;
    assigned_by: string | null;
    assigner: User | null;
    notification_sent: boolean;
    notification_sent_at: Date | null;
    acknowledged: boolean;
    acknowledged_at: Date | null;
    created_at: Date;
}
