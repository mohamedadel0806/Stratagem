import { ComplianceStatus } from '../entities/asset-requirement-mapping.entity';
import { AssessmentType } from '../entities/compliance-assessment.entity';
export interface ValidationResults {
    ruleId: string;
    ruleName: string;
    applicable: boolean;
    status: ComplianceStatus;
    message: string;
    details?: Record<string, any>;
}
export declare class RuleEvaluationResultDto {
    ruleId: string;
    ruleName: string;
    applicable: boolean;
    status: ComplianceStatus;
    message: string;
    details?: Record<string, any>;
}
export declare class AssessmentResultDto {
    assetType: string;
    assetId: string;
    requirementId: string;
    requirementTitle: string;
    status: ComplianceStatus;
    ruleResults: RuleEvaluationResultDto[];
    recommendations?: string[];
    assessedAt: string;
    assessmentType: AssessmentType;
}
export declare class AssetComplianceStatusDto {
    assetType: string;
    assetId: string;
    totalRequirements: number;
    compliantCount: number;
    nonCompliantCount: number;
    partiallyCompliantCount: number;
    notAssessedCount: number;
    requiresReviewCount: number;
    notApplicableCount: number;
    overallCompliancePercentage: number;
    requirements: AssessmentResultDto[];
}
export declare class ComplianceGapDto {
    requirementId: string;
    requirementTitle: string;
    requirementCode: string;
    currentStatus: ComplianceStatus;
    gapDescription: string;
    recommendations: string[];
    missingFields: string[];
    failedRules: RuleEvaluationResultDto[];
}
export declare class BulkAssessmentResultDto {
    totalAssessed: number;
    successful: number;
    failed: number;
    errors: string[];
    results: AssessmentResultDto[];
}
export declare class LinkedControlDto {
    controlId: string;
    controlName: string;
    controlDescription?: string;
    implementationStatus: string;
    implementationDate?: string;
    lastTestDate?: string;
    lastTestResult?: string;
    effectivenessScore?: number;
    isAutomated: boolean;
    implementationNotes?: string;
}
export declare class AssetComplianceSummaryDto {
    assetId: string;
    assetType: string;
    assetName: string;
    assetIdentifier?: string;
    description?: string;
    criticality?: string;
    businessUnit?: string;
    totalRequirements: number;
    compliantCount: number;
    nonCompliantCount: number;
    partiallyCompliantCount: number;
    notAssessedCount: number;
    overallCompliancePercentage: number;
    controlsLinkedCount: number;
    linkedControls: LinkedControlDto[];
    lastAssessmentDate?: string;
    overallComplianceStatus: ComplianceStatus;
}
export declare class AssetComplianceListResponseDto {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    assets: AssetComplianceSummaryDto[];
    complianceSummary: {
        totalAssets: number;
        compliantAssets: number;
        nonCompliantAssets: number;
        partiallyCompliantAssets: number;
        averageCompliancePercentage: number;
    };
}
