export declare enum GapType {
    FRAMEWORK = "framework",
    CONTROL = "control",
    ASSET = "asset",
    EVIDENCE = "evidence",
    ASSESSMENT = "assessment"
}
export declare class RequirementGapDto {
    requirementId: string;
    requirementIdentifier: string;
    requirementText: string;
    frameworkId: string;
    frameworkName?: string;
    domain?: string;
    category?: string;
    priority?: string;
    coverageLevel?: 'full' | 'partial' | 'none';
    mappedControlsCount: number;
    gapSeverity: 'critical' | 'high' | 'medium' | 'low';
}
export declare class FrameworkGapSummaryDto {
    frameworkId: string;
    frameworkName: string;
    totalRequirements: number;
    mappedRequirements: number;
    unmappedRequirements: number;
    partialCoverageRequirements: number;
    coveragePercentage: number;
    gaps: RequirementGapDto[];
    criticalGapsCount: number;
    highPriorityGapsCount: number;
}
export declare class GapAnalysisDto {
    generatedAt: Date;
    totalFrameworks: number;
    totalRequirements: number;
    totalMappedRequirements: number;
    totalUnmappedRequirements: number;
    overallCoveragePercentage: number;
    frameworks: FrameworkGapSummaryDto[];
    allGaps: RequirementGapDto[];
    criticalGapsCount: number;
    recommendations: string[];
}
export declare class GapAnalysisQueryDto {
    frameworkIds?: string;
    gapType?: GapType;
    domain?: string;
    category?: string;
    priorityOnly?: boolean;
}
