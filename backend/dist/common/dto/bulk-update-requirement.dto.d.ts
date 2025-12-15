import { RequirementStatus } from '../entities/compliance-requirement.entity';
export declare class BulkUpdateRequirementDto {
    ids: string[];
    status: RequirementStatus;
}
