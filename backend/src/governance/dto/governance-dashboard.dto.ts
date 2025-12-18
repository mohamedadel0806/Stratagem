import { ApiProperty } from '@nestjs/swagger';

export class GovernanceSummaryDto {
  @ApiProperty()
  totalInfluencers: number;

  @ApiProperty()
  activeInfluencers: number;

  @ApiProperty()
  totalPolicies: number;

  @ApiProperty()
  publishedPolicies: number;

  @ApiProperty()
  policiesUnderReview: number;

  @ApiProperty()
  totalControls: number;

  @ApiProperty()
  implementedControls: number;

  @ApiProperty()
  totalAssessments: number;

  @ApiProperty()
  completedAssessments: number;

  @ApiProperty()
  inProgressAssessments: number;

  @ApiProperty()
  totalFindings: number;

  @ApiProperty()
  openFindings: number;

  @ApiProperty()
  criticalFindings: number;

  @ApiProperty()
  totalEvidence: number;

  @ApiProperty()
  approvedEvidence: number;
}

export class ControlStatsDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  byStatus: {
    active: number;
    draft: number;
    retired: number;
  };

  @ApiProperty()
  byImplementation: {
    implemented: number;
    inProgress: number;
    planned: number;
    notImplemented: number;
  };

  @ApiProperty()
  byType: {
    preventive: number;
    detective: number;
    corrective: number;
    compensating: number;
  };
}

export class PolicyStatsDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  byStatus: {
    draft: number;
    inReview: number;
    approved: number;
    published: number;
    archived: number;
  };

  @ApiProperty()
  pendingReview: number;

  @ApiProperty()
  overdueReview: number;
}

export class AssessmentStatsDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  byStatus: {
    notStarted: number;
    inProgress: number;
    underReview: number;
    completed: number;
    cancelled: number;
  };

  @ApiProperty()
  byType: {
    implementation: number;
    designEffectiveness: number;
    operatingEffectiveness: number;
    compliance: number;
  };

  @ApiProperty()
  averageScore: number;
}

export class FindingStatsDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  byStatus: {
    open: number;
    inProgress: number;
    closed: number;
    riskAccepted: number;
    falsePositive: number;
  };

  @ApiProperty()
  bySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
  };

  @ApiProperty()
  overdueRemediation: number;
}

export class UpcomingReviewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: 'policy' | 'influencer' | 'control';

  @ApiProperty()
  name: string;

  @ApiProperty()
  reviewDate: Date;

  @ApiProperty()
  daysUntil: number;
}

export class RecentActivityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: 'policy' | 'control' | 'assessment' | 'finding' | 'evidence';

  @ApiProperty()
  action: string;

  @ApiProperty()
  entityName: string;

  @ApiProperty()
  userName?: string;

  @ApiProperty()
  createdAt: Date;
}

export class AssetComplianceByTypeDto {
  @ApiProperty()
  assetType: string;

  @ApiProperty()
  totalAssets: number;

  @ApiProperty()
  assetsWithControls: number;

  @ApiProperty()
  compliantAssets: number;

  @ApiProperty()
  partiallyCompliantAssets: number;

  @ApiProperty()
  nonCompliantAssets: number;

  @ApiProperty()
  compliancePercentage: number;
}

export class NonCompliantAssetDto {
  @ApiProperty()
  assetId: string;

  @ApiProperty()
  assetType: string;

  @ApiProperty()
  assetName: string;

  @ApiProperty()
  controlsAssigned: number;

  @ApiProperty()
  controlsImplemented: number;

  @ApiProperty()
  compliancePercentage: number;

  @ApiProperty()
  criticalGaps: number;
}

export class AssetComplianceStatsDto {
  @ApiProperty()
  totalAssets: number;

  @ApiProperty()
  assetsWithControls: number;

  @ApiProperty()
  assetsWithoutControls: number;

  @ApiProperty()
  compliantAssets: number;

  @ApiProperty()
  partiallyCompliantAssets: number;

  @ApiProperty()
  nonCompliantAssets: number;

  @ApiProperty()
  overallCompliancePercentage: number;

  @ApiProperty({ type: [AssetComplianceByTypeDto] })
  byAssetType: AssetComplianceByTypeDto[];

  @ApiProperty({ type: [NonCompliantAssetDto] })
  topNonCompliantAssets: NonCompliantAssetDto[];
}

export class GovernanceDashboardDto {
  @ApiProperty({ type: GovernanceSummaryDto })
  summary: GovernanceSummaryDto;

  @ApiProperty({ type: ControlStatsDto })
  controlStats: ControlStatsDto;

  @ApiProperty({ type: PolicyStatsDto })
  policyStats: PolicyStatsDto;

  @ApiProperty({ type: AssessmentStatsDto })
  assessmentStats: AssessmentStatsDto;

  @ApiProperty({ type: FindingStatsDto })
  findingStats: FindingStatsDto;

  @ApiProperty({ type: AssetComplianceStatsDto, required: false })
  assetComplianceStats?: AssetComplianceStatsDto;

  @ApiProperty({ type: [UpcomingReviewDto] })
  upcomingReviews: UpcomingReviewDto[];

  @ApiProperty({ type: [RecentActivityDto] })
  recentActivity: RecentActivityDto[];
}





