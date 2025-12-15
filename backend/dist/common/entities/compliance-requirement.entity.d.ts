import { ComplianceFramework } from './compliance-framework.entity';
export declare enum RequirementStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLIANT = "compliant",
    NON_COMPLIANT = "non_compliant",
    PARTIALLY_COMPLIANT = "partially_compliant"
}
export declare class ComplianceRequirement {
    id: string;
    title: string;
    description: string;
    requirementCode: string;
    category: string;
    complianceDeadline: string;
    applicability: string;
    framework: ComplianceFramework;
    frameworkId: string;
    status: RequirementStatus;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
}
