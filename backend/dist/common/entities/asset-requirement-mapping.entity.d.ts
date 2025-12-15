import { ComplianceRequirement } from './compliance-requirement.entity';
import { User } from '../../users/entities/user.entity';
export declare enum ComplianceStatus {
    NOT_ASSESSED = "not_assessed",
    COMPLIANT = "compliant",
    NON_COMPLIANT = "non_compliant",
    PARTIALLY_COMPLIANT = "partially_compliant",
    NOT_APPLICABLE = "not_applicable",
    REQUIRES_REVIEW = "requires_review"
}
export declare enum AssetTypeEnum {
    PHYSICAL = "physical",
    INFORMATION = "information",
    APPLICATION = "application",
    SOFTWARE = "software",
    SUPPLIER = "supplier"
}
export type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';
export declare class AssetRequirementMapping {
    id: string;
    assetType: AssetType;
    assetId: string;
    requirement: ComplianceRequirement;
    requirementId: string;
    complianceStatus: ComplianceStatus;
    lastAssessedAt: Date;
    assessedBy: User;
    assessedById: string;
    evidenceUrls: string[];
    notes: string;
    autoAssessed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
