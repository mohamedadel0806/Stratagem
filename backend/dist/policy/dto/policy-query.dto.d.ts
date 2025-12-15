import { PolicyStatus, PolicyType } from '../entities/policy.entity';
export declare class PolicyQueryDto {
    search?: string;
    status?: PolicyStatus;
    policyType?: PolicyType;
    page?: number;
    limit?: number;
}
