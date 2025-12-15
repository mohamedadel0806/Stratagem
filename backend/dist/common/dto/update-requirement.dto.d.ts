import { RequirementStatus } from '../entities/compliance-requirement.entity';
export declare class UpdateRequirementDto {
    title?: string;
    description?: string;
    requirementCode?: string;
    category?: string;
    complianceDeadline?: string;
    applicability?: string;
    frameworkId?: string;
    status?: RequirementStatus;
}
