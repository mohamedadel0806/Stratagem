import { PolicyStatus, PolicyType } from '../entities/policy.entity';
export declare class PolicyResponseDto {
    id: string;
    title: string;
    description?: string;
    policyType: PolicyType;
    status: PolicyStatus;
    version?: string;
    effectiveDate?: string;
    reviewDate?: string;
    documentUrl?: string;
    documentName?: string;
    documentMimeType?: string;
    createdAt: string;
}
