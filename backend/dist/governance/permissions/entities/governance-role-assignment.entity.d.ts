import { User } from '../../../users/entities/user.entity';
import { BusinessUnit } from '../../../common/entities/business-unit.entity';
export declare class GovernanceRoleAssignment {
    id: string;
    user_id: string;
    user: User;
    role: string;
    business_unit_id: string | null;
    business_unit: BusinessUnit | null;
    assigned_by: string | null;
    assigner: User | null;
    assigned_at: Date;
    expires_at: Date | null;
    created_at: Date;
}
