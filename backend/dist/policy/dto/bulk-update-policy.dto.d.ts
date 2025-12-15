import { PolicyStatus } from '../entities/policy.entity';
export declare class BulkUpdatePolicyDto {
    ids: string[];
    status: PolicyStatus;
}
