import { ComplianceRequirement } from './compliance-requirement.entity';
import { User } from '../../users/entities/user.entity';
import { ComplianceStatus } from './asset-requirement-mapping.entity';
export declare enum AssessmentType {
    AUTOMATIC = "automatic",
    MANUAL = "manual",
    SCHEDULED = "scheduled"
}
export type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';
export interface ValidationResults {
    ruleId: string;
    ruleName: string;
    applicable: boolean;
    status: ComplianceStatus;
    message: string;
    details?: Record<string, any>;
}
export declare class ComplianceAssessment {
    id: string;
    assetType: AssetType;
    assetId: string;
    requirement: ComplianceRequirement;
    requirementId: string;
    assessmentType: AssessmentType;
    previousStatus: ComplianceStatus;
    newStatus: ComplianceStatus;
    validationResults: ValidationResults[];
    assessedBy: User;
    assessedById: string;
    assessedAt: Date;
    notes: string;
}
