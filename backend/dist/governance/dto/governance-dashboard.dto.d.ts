export declare class GovernanceSummaryDto {
    totalInfluencers: number;
    activeInfluencers: number;
    totalPolicies: number;
    publishedPolicies: number;
    policiesUnderReview: number;
    totalControls: number;
    implementedControls: number;
    totalAssessments: number;
    completedAssessments: number;
    inProgressAssessments: number;
    totalFindings: number;
    openFindings: number;
    criticalFindings: number;
    totalEvidence: number;
    approvedEvidence: number;
}
export declare class ControlStatsDto {
    total: number;
    byStatus: {
        active: number;
        draft: number;
        retired: number;
    };
    byImplementation: {
        implemented: number;
        inProgress: number;
        planned: number;
        notImplemented: number;
    };
    byType: {
        preventive: number;
        detective: number;
        corrective: number;
        compensating: number;
    };
}
export declare class PolicyStatsDto {
    total: number;
    byStatus: {
        draft: number;
        inReview: number;
        approved: number;
        published: number;
        archived: number;
    };
    pendingReview: number;
    overdueReview: number;
}
export declare class AssessmentStatsDto {
    total: number;
    byStatus: {
        notStarted: number;
        inProgress: number;
        underReview: number;
        completed: number;
        cancelled: number;
    };
    byType: {
        implementation: number;
        designEffectiveness: number;
        operatingEffectiveness: number;
        compliance: number;
    };
    averageScore: number;
}
export declare class FindingStatsDto {
    total: number;
    byStatus: {
        open: number;
        inProgress: number;
        closed: number;
        riskAccepted: number;
        falsePositive: number;
    };
    bySeverity: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        informational: number;
    };
    overdueRemediation: number;
}
export declare class UpcomingReviewDto {
    id: string;
    type: 'policy' | 'influencer' | 'control' | 'sop' | 'assessment';
    name: string;
    reviewDate: Date;
    daysUntil: number;
}
export declare class RecentActivityDto {
    id: string;
    type: 'policy' | 'control' | 'assessment' | 'finding' | 'evidence';
    action: string;
    entityName: string;
    userName?: string;
    createdAt: Date;
}
export declare class AssetComplianceByTypeDto {
    assetType: string;
    totalAssets: number;
    assetsWithControls: number;
    compliantAssets: number;
    partiallyCompliantAssets: number;
    nonCompliantAssets: number;
    compliancePercentage: number;
}
export declare class NonCompliantAssetDto {
    assetId: string;
    assetType: string;
    assetName: string;
    controlsAssigned: number;
    controlsImplemented: number;
    compliancePercentage: number;
    criticalGaps: number;
}
export declare class AssetComplianceStatsDto {
    totalAssets: number;
    assetsWithControls: number;
    assetsWithoutControls: number;
    compliantAssets: number;
    partiallyCompliantAssets: number;
    nonCompliantAssets: number;
    overallCompliancePercentage: number;
    byAssetType: AssetComplianceByTypeDto[];
    topNonCompliantAssets: NonCompliantAssetDto[];
}
export declare class GovernanceDashboardDto {
    summary: GovernanceSummaryDto;
    controlStats: ControlStatsDto;
    policyStats: PolicyStatsDto;
    assessmentStats: AssessmentStatsDto;
    findingStats: FindingStatsDto;
    assetComplianceStats?: AssetComplianceStatsDto;
    upcomingReviews: UpcomingReviewDto[];
    recentActivity: RecentActivityDto[];
}
