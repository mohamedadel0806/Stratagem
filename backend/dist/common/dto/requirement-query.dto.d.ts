import { RequirementStatus } from '../entities/compliance-requirement.entity';
export declare class RequirementQueryDto {
    search?: string;
    status?: RequirementStatus;
    frameworkId?: string;
    category?: string;
    page?: number;
    limit?: number;
}
