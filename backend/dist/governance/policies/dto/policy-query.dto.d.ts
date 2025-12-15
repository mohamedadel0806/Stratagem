import { PolicyStatus } from '../entities/policy.entity';
export declare class PolicyQueryDto {
    page?: number;
    limit?: number;
    status?: PolicyStatus;
    policy_type?: string;
    owner_id?: string;
    search?: string;
    sort?: string;
}
