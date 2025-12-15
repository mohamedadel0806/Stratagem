import { RequirementStatus } from '../entities/compliance-requirement.entity';
export declare class CreateRequirementDto {
    title: string;
    description?: string;
    requirementCode?: string;
    category?: string;
    complianceDeadline?: string;
    applicability?: string;
    frameworkId: string;
    status?: RequirementStatus;
}
