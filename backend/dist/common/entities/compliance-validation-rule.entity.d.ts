import { ComplianceRequirement } from './compliance-requirement.entity';
import { User } from '../../users/entities/user.entity';
export type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';
export interface ValidationLogic {
    conditions: Array<{
        field: string;
        operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'exists' | 'not_exists';
        value: any;
    }>;
    complianceCriteria: Array<{
        field: string;
        operator: string;
        value: any;
    }>;
    nonComplianceCriteria?: Array<{
        field: string;
        operator: string;
        value: any;
    }>;
    partialComplianceCriteria?: Array<{
        field: string;
        operator: string;
        value: any;
    }>;
}
export declare class ComplianceValidationRule {
    id: string;
    requirement: ComplianceRequirement;
    requirementId: string;
    assetType: AssetType;
    ruleName: string;
    ruleDescription: string;
    validationLogic: ValidationLogic;
    priority: number;
    isActive: boolean;
    createdBy: User;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
}
