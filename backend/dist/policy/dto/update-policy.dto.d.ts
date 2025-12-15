import { PolicyType, PolicyStatus } from '../entities/policy.entity';
export declare class UpdatePolicyDto {
    title?: string;
    description?: string;
    policyType?: PolicyType;
    status?: PolicyStatus;
    version?: string;
    effectiveDate?: string;
    reviewDate?: string;
    documentUrl?: string;
    documentName?: string;
    documentMimeType?: string;
}
