import { PolicyType, PolicyStatus } from '../entities/policy.entity';
export declare class CreatePolicyDto {
    title: string;
    description?: string;
    policyType: PolicyType;
    status?: PolicyStatus;
    version?: string;
    effectiveDate?: string;
    reviewDate?: string;
}
