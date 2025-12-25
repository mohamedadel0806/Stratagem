import { Policy } from './policy.entity';
import { User } from '../../../users/entities/user.entity';
export declare class PolicyVersion {
    id: string;
    policy_id: string;
    policy: Policy;
    version: string;
    version_number: number;
    content: string;
    change_summary: string;
    created_at: Date;
    created_by: string;
    creator: User;
}
