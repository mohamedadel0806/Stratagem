import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThanOrEqual, In } from 'typeorm';
import { Influencer, InfluencerStatus } from '../influencers/entities/influencer.entity';
import { Policy, PolicyStatus } from '../policies/entities/policy.entity';
import { UnifiedControl, ControlStatus, ImplementationStatus, ControlType } from '../unified-controls/entities/unified-control.entity';
import { Assessment, AssessmentStatus, AssessmentType } from '../assessments/entities/assessment.entity';
import { Finding, FindingStatus, FindingSeverity } from '../findings/entities/finding.entity';
import { Evidence, EvidenceStatus } from '../evidence/entities/evidence.entity';
import { ControlAssetMapping, AssetType } from '../unified-controls/entities/control-asset-mapping.entity';
import { SOP, SOPStatus } from '../sops/entities/sop.entity';
import {
  GovernanceDashboardDto,
  GovernanceSummaryDto,
  ControlStatsDto,
  PolicyStatsDto,
  AssessmentStatsDto,
  FindingStatsDto,
  UpcomingReviewDto,
  RecentActivityDto,
  AssetComplianceStatsDto,
  AssetComplianceByTypeDto,
  NonCompliantAssetDto,
} from '../dto/governance-dashboard.dto';

@Injectable()
export class GovernanceDashboardService {
  constructor(
    @InjectRepository(Influencer)
    private influencerRepository: Repository<Influencer>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(UnifiedControl)
    private unifiedControlRepository: Repository<UnifiedControl>,
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    @InjectRepository(Finding)
    private findingRepository: Repository<Finding>,
    @InjectRepository(Evidence)
    private evidenceRepository: Repository<Evidence>,
    @InjectRepository(ControlAssetMapping)
    private controlAssetMappingRepository: Repository<ControlAssetMapping>,
    @InjectRepository(SOP)
    private sopRepository: Repository<SOP>,
  ) {}

  async getDashboard(startDate?: string, endDate?: string): Promise<GovernanceDashboardDto> {
    const [
      summary,
      controlStats,
      policyStats,
      assessmentStats,
      findingStats,
      assetComplianceStats,
      upcomingReviews,
      recentActivity,
    ] = await Promise.all([
      this.getSummaryMetrics(),
      this.getControlStats(),
      this.getPolicyStats(),
      this.getAssessmentStats(),
      this.getFindingStats(),
      this.getAssetComplianceStats(),
      this.getUpcomingReviews(),
      this.getRecentActivity(),
    ]);

    return {
      summary,
      controlStats,
      policyStats,
      assessmentStats,
      findingStats,
      assetComplianceStats,
      upcomingReviews,
      recentActivity,
    };
  }

  async getSummaryMetrics(): Promise<GovernanceSummaryDto> {
    const [
      totalInfluencers,
      activeInfluencers,
      totalPolicies,
      publishedPolicies,
      policiesUnderReview,
      totalControls,
      implementedControls,
      totalAssessments,
      completedAssessments,
      inProgressAssessments,
      totalFindings,
      openFindings,
      criticalFindings,
      totalEvidence,
      approvedEvidence,
    ] = await Promise.all([
      this.influencerRepository.count({ where: { deleted_at: IsNull() } }),
      this.influencerRepository.count({
        where: { status: InfluencerStatus.ACTIVE, deleted_at: IsNull() },
      }),
      this.policyRepository.count({ where: { deleted_at: IsNull() } }),
      this.policyRepository.count({
        where: { status: PolicyStatus.PUBLISHED, deleted_at: IsNull() },
      }),
      this.policyRepository.count({
        where: { status: PolicyStatus.IN_REVIEW, deleted_at: IsNull() },
      }),
      this.unifiedControlRepository.count({ where: { deleted_at: IsNull() } }),
      this.unifiedControlRepository.count({
        where: {
          implementation_status: ImplementationStatus.IMPLEMENTED,
          deleted_at: IsNull(),
        },
      }),
      this.assessmentRepository.count({ where: { deleted_at: IsNull() } }),
      this.assessmentRepository.count({
        where: { status: AssessmentStatus.COMPLETED, deleted_at: IsNull() },
      }),
      this.assessmentRepository.count({
        where: { status: AssessmentStatus.IN_PROGRESS, deleted_at: IsNull() },
      }),
      this.findingRepository.count({ where: { deleted_at: IsNull() } }),
      this.findingRepository.count({
        where: {
          status: FindingStatus.OPEN,
          deleted_at: IsNull(),
        },
      }),
      this.findingRepository.count({
        where: {
          severity: FindingSeverity.CRITICAL,
          deleted_at: IsNull(),
        },
      }),
      this.evidenceRepository.count({ where: { deleted_at: IsNull() } }),
      this.evidenceRepository.count({
        where: { status: EvidenceStatus.APPROVED, deleted_at: IsNull() },
      }),
    ]);

    return {
      totalInfluencers,
      activeInfluencers,
      totalPolicies,
      publishedPolicies,
      policiesUnderReview,
      totalControls,
      implementedControls,
      totalAssessments,
      completedAssessments,
      inProgressAssessments,
      totalFindings,
      openFindings,
      criticalFindings,
      totalEvidence,
      approvedEvidence,
    };
  }

  private async getControlStats(): Promise<ControlStatsDto> {
    const total = await this.unifiedControlRepository.count({
      where: { deleted_at: IsNull() },
    });

    const byStatus = {
      active: await this.unifiedControlRepository.count({
        where: { status: ControlStatus.ACTIVE, deleted_at: IsNull() },
      }),
      draft: await this.unifiedControlRepository.count({
        where: { status: ControlStatus.DRAFT, deleted_at: IsNull() },
      }),
      retired: await this.unifiedControlRepository.count({
        where: { status: ControlStatus.DEPRECATED, deleted_at: IsNull() },
      }),
    };

    const byImplementation = {
      implemented: await this.unifiedControlRepository.count({
        where: {
          implementation_status: ImplementationStatus.IMPLEMENTED,
          deleted_at: IsNull(),
        },
      }),
      inProgress: await this.unifiedControlRepository.count({
        where: {
          implementation_status: ImplementationStatus.IN_PROGRESS,
          deleted_at: IsNull(),
        },
      }),
      planned: await this.unifiedControlRepository.count({
        where: {
          implementation_status: ImplementationStatus.PLANNED,
          deleted_at: IsNull(),
        },
      }),
      notImplemented: await this.unifiedControlRepository.count({
        where: {
          implementation_status: ImplementationStatus.NOT_IMPLEMENTED,
          deleted_at: IsNull(),
        },
      }),
    };

    const byType = {
      preventive: await this.unifiedControlRepository.count({
        where: { control_type: ControlType.PREVENTIVE, deleted_at: IsNull() },
      }),
      detective: await this.unifiedControlRepository.count({
        where: { control_type: ControlType.DETECTIVE, deleted_at: IsNull() },
      }),
      corrective: await this.unifiedControlRepository.count({
        where: { control_type: ControlType.CORRECTIVE, deleted_at: IsNull() },
      }),
      compensating: await this.unifiedControlRepository.count({
        where: { control_type: ControlType.COMPENSATING, deleted_at: IsNull() },
      }),
    };

    return {
      total,
      byStatus,
      byImplementation,
      byType,
    };
  }

  private async getPolicyStats(): Promise<PolicyStatsDto> {
    const total = await this.policyRepository.count({
      where: { deleted_at: IsNull() },
    });

    const byStatus = {
      draft: await this.policyRepository.count({
        where: { status: PolicyStatus.DRAFT, deleted_at: IsNull() },
      }),
      inReview: await this.policyRepository.count({
        where: { status: PolicyStatus.IN_REVIEW, deleted_at: IsNull() },
      }),
      approved: await this.policyRepository.count({
        where: { status: PolicyStatus.APPROVED, deleted_at: IsNull() },
      }),
      published: await this.policyRepository.count({
        where: { status: PolicyStatus.PUBLISHED, deleted_at: IsNull() },
      }),
      archived: await this.policyRepository.count({
        where: { status: PolicyStatus.ARCHIVED, deleted_at: IsNull() },
      }),
    };

    const now = new Date();
    const pendingReview = await this.policyRepository.count({
      where: {
        next_review_date: LessThanOrEqual(now),
        deleted_at: IsNull(),
      },
    });

    const overdueReview = await this.policyRepository
      .createQueryBuilder('policy')
      .where('policy.next_review_date < :now', { now })
      .andWhere('policy.deleted_at IS NULL')
      .andWhere('policy.status != :archived', { archived: PolicyStatus.ARCHIVED })
      .getCount();

    return {
      total,
      byStatus,
      pendingReview,
      overdueReview,
    };
  }

  private async getAssessmentStats(): Promise<AssessmentStatsDto> {
    const total = await this.assessmentRepository.count({
      where: { deleted_at: IsNull() },
    });

    const byStatus = {
      notStarted: await this.assessmentRepository.count({
        where: { status: AssessmentStatus.NOT_STARTED, deleted_at: IsNull() },
      }),
      inProgress: await this.assessmentRepository.count({
        where: { status: AssessmentStatus.IN_PROGRESS, deleted_at: IsNull() },
      }),
      underReview: await this.assessmentRepository.count({
        where: { status: AssessmentStatus.UNDER_REVIEW, deleted_at: IsNull() },
      }),
      completed: await this.assessmentRepository.count({
        where: { status: AssessmentStatus.COMPLETED, deleted_at: IsNull() },
      }),
      cancelled: await this.assessmentRepository.count({
        where: { status: AssessmentStatus.CANCELLED, deleted_at: IsNull() },
      }),
    };

    const byType = {
      implementation: await this.assessmentRepository.count({
        where: { assessment_type: AssessmentType.IMPLEMENTATION, deleted_at: IsNull() },
      }),
      designEffectiveness: await this.assessmentRepository.count({
        where: { assessment_type: AssessmentType.DESIGN_EFFECTIVENESS, deleted_at: IsNull() },
      }),
      operatingEffectiveness: await this.assessmentRepository.count({
        where: { assessment_type: AssessmentType.OPERATING_EFFECTIVENESS, deleted_at: IsNull() },
      }),
      compliance: await this.assessmentRepository.count({
        where: { assessment_type: AssessmentType.COMPLIANCE, deleted_at: IsNull() },
      }),
    };

    // Calculate average score from completed assessments
    const completedAssessments = await this.assessmentRepository.find({
      where: { status: AssessmentStatus.COMPLETED, deleted_at: IsNull() },
      select: ['overall_score'],
    });

    const scores = completedAssessments
      .map((a) => a.overall_score)
      .filter((score) => score !== null && score !== undefined) as number[];

    const averageScore = scores.length > 0
      ? Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10
      : 0;

    return {
      total,
      byStatus,
      byType,
      averageScore,
    };
  }

  private async getFindingStats(): Promise<FindingStatsDto> {
    const total = await this.findingRepository.count({
      where: { deleted_at: IsNull() },
    });

    const byStatus = {
      open: await this.findingRepository.count({
        where: { status: FindingStatus.OPEN, deleted_at: IsNull() },
      }),
      inProgress: await this.findingRepository.count({
        where: { status: FindingStatus.IN_PROGRESS, deleted_at: IsNull() },
      }),
      closed: await this.findingRepository.count({
        where: { status: FindingStatus.CLOSED, deleted_at: IsNull() },
      }),
      riskAccepted: await this.findingRepository.count({
        where: { status: FindingStatus.ACCEPTED, deleted_at: IsNull() },
      }),
      falsePositive: await this.findingRepository.count({
        where: { status: FindingStatus.REJECTED, deleted_at: IsNull() },
      }),
    };

    const bySeverity = {
      critical: await this.findingRepository.count({
        where: { severity: FindingSeverity.CRITICAL, deleted_at: IsNull() },
      }),
      high: await this.findingRepository.count({
        where: { severity: FindingSeverity.HIGH, deleted_at: IsNull() },
      }),
      medium: await this.findingRepository.count({
        where: { severity: FindingSeverity.MEDIUM, deleted_at: IsNull() },
      }),
      low: await this.findingRepository.count({
        where: { severity: FindingSeverity.LOW, deleted_at: IsNull() },
      }),
      informational: await this.findingRepository.count({
        where: { severity: FindingSeverity.INFO, deleted_at: IsNull() },
      }),
    };

    const now = new Date();
    const overdueRemediation = await this.findingRepository
      .createQueryBuilder('finding')
      .where('finding.remediation_due_date < :now', { now })
      .andWhere('finding.deleted_at IS NULL')
      .andWhere('finding.status IN (:...statuses)', {
        statuses: [FindingStatus.OPEN, FindingStatus.IN_PROGRESS],
      })
      .getCount();

    return {
      total,
      byStatus,
      bySeverity,
      overdueRemediation,
    };
  }

  private async getUpcomingReviews(): Promise<UpcomingReviewDto[]> {
    const now = new Date();
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const upcoming: UpcomingReviewDto[] = [];

    // 1. Policies
    const policies = await this.policyRepository.find({
      where: {
        next_review_date: LessThanOrEqual(ninetyDaysFromNow),
        deleted_at: IsNull(),
      },
      take: 20,
      order: { next_review_date: 'ASC' },
    });

    policies.forEach((p) => {
      if (p.next_review_date) {
        const d = p.next_review_date instanceof Date ? p.next_review_date : new Date(p.next_review_date);
        if (!isNaN(d.getTime())) {
          upcoming.push({
            id: p.id,
            type: 'policy',
            name: p.title,
            reviewDate: d,
            daysUntil: Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          });
        }
      }
    });

    // 2. Influencers
    const influencers = await this.influencerRepository.find({
      where: {
        next_review_date: LessThanOrEqual(ninetyDaysFromNow),
        deleted_at: IsNull(),
      },
      take: 20,
      order: { next_review_date: 'ASC' },
    });

    influencers.forEach((i) => {
      if (i.next_review_date) {
        const d = i.next_review_date instanceof Date ? i.next_review_date : new Date(i.next_review_date);
        if (!isNaN(d.getTime())) {
          upcoming.push({
            id: i.id,
            type: 'influencer',
            name: i.name,
            reviewDate: d,
            daysUntil: Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          });
        }
      }
    });

    // 3. SOPs
    const sops = await this.sopRepository.find({
      where: {
        next_review_date: LessThanOrEqual(ninetyDaysFromNow),
        deleted_at: IsNull(),
      },
      take: 20,
      order: { next_review_date: 'ASC' },
    });

    sops.forEach((s) => {
      if (s.next_review_date) {
        const d = s.next_review_date instanceof Date ? s.next_review_date : new Date(s.next_review_date);
        if (!isNaN(d.getTime())) {
          upcoming.push({
            id: s.id,
            type: 'sop',
            name: s.title,
            reviewDate: d,
            daysUntil: Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          });
        }
      }
    });

    // 4. Assessments
    const assessments = await this.assessmentRepository.find({
      where: {
        end_date: LessThanOrEqual(ninetyDaysFromNow),
        deleted_at: IsNull(),
        status: In([AssessmentStatus.NOT_STARTED, AssessmentStatus.IN_PROGRESS]),
      },
      take: 20,
      order: { end_date: 'ASC' },
    });

    assessments.forEach((a) => {
      if (a.end_date) {
        const d = a.end_date instanceof Date ? a.end_date : new Date(a.end_date);
        if (!isNaN(d.getTime())) {
          upcoming.push({
            id: a.id,
            type: 'assessment',
            name: a.name,
            reviewDate: d,
            daysUntil: Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          });
        }
      }
    });

    return upcoming.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 20);
  }

  private async getRecentActivity(): Promise<RecentActivityDto[]> {
    const activities: RecentActivityDto[] = [];

    // Recent policies
    const recentPolicies = await this.policyRepository.find({
      where: { deleted_at: IsNull() },
      take: 5,
      order: { updated_at: 'DESC' },
      relations: ['updater'],
    });

    recentPolicies.forEach((policy) => {
      activities.push({
        id: policy.id,
        type: 'policy',
        action: 'updated',
        entityName: policy.title,
        userName: policy.updater
          ? `${policy.updater.firstName} ${policy.updater.lastName}`
          : undefined,
        createdAt: policy.updated_at,
      });
    });

    // Recent controls
    const recentControls = await this.unifiedControlRepository.find({
      where: { deleted_at: IsNull() },
      take: 5,
      order: { updated_at: 'DESC' },
      relations: ['updater'],
    });

    recentControls.forEach((control) => {
      activities.push({
        id: control.id,
        type: 'control',
        action: 'updated',
        entityName: control.title,
        userName: control.updater
          ? `${control.updater.firstName} ${control.updater.lastName}`
          : undefined,
        createdAt: control.updated_at,
      });
    });

    // Recent assessments
    const recentAssessments = await this.assessmentRepository.find({
      where: { deleted_at: IsNull() },
      take: 5,
      order: { updated_at: 'DESC' },
      relations: ['updater'],
    });

    recentAssessments.forEach((assessment) => {
      activities.push({
        id: assessment.id,
        type: 'assessment',
        action: 'updated',
        entityName: assessment.name,
        userName: assessment.updater
          ? `${assessment.updater.firstName} ${assessment.updater.lastName}`
          : undefined,
        createdAt: assessment.updated_at,
      });
    });

    // Recent findings
    const recentFindings = await this.findingRepository.find({
      where: { deleted_at: IsNull() },
      take: 5,
      order: { updated_at: 'DESC' },
      relations: ['updater'],
    });

    recentFindings.forEach((finding) => {
      activities.push({
        id: finding.id,
        type: 'finding',
        action: 'updated',
        entityName: finding.title,
        userName: finding.updater
          ? `${finding.updater.firstName} ${finding.updater.lastName}`
          : undefined,
        createdAt: finding.updated_at,
      });
    });

    // Recent evidence
    const recentEvidence = await this.evidenceRepository.find({
      where: { deleted_at: IsNull() },
      take: 5,
      order: { updated_at: 'DESC' },
      relations: ['creator'],
    });

    recentEvidence.forEach((evidence) => {
      activities.push({
        id: evidence.id,
        type: 'evidence',
        action: 'updated',
        entityName: evidence.title,
        userName: evidence.creator
          ? `${evidence.creator.firstName} ${evidence.creator.lastName}`
          : undefined,
        createdAt: evidence.updated_at,
      });
    });

    // Sort by date and return top 15
    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 15);
  }

  /**
   * Get asset compliance statistics for the dashboard widget
   */
  async getAssetComplianceStats(): Promise<AssetComplianceStatsDto> {
    // Get all unique assets with controls from control_asset_mappings
    const assetMappings = await this.controlAssetMappingRepository
      .createQueryBuilder('cam')
      .select([
        'cam.asset_type',
        'cam.asset_id',
        'cam.implementation_status',
      ])
      .getRawMany();

    // Group by asset_type and asset_id
    const assetMap = new Map<string, {
      assetType: string;
      assetId: string;
      totalControls: number;
      implementedControls: number;
    }>();

    assetMappings.forEach((mapping) => {
      const key = `${mapping.cam_asset_type}:${mapping.cam_asset_id}`;
      if (!assetMap.has(key)) {
        assetMap.set(key, {
          assetType: mapping.cam_asset_type,
          assetId: mapping.cam_asset_id,
          totalControls: 0,
          implementedControls: 0,
        });
      }
      const asset = assetMap.get(key)!;
      asset.totalControls++;
      if (mapping.cam_implementation_status === ImplementationStatus.IMPLEMENTED) {
        asset.implementedControls++;
      }
    });

    const assetsWithControls = assetMap.size;

    // Calculate compliance for each asset
    let compliantAssets = 0;
    let partiallyCompliantAssets = 0;
    let nonCompliantAssets = 0;
    const nonCompliantList: NonCompliantAssetDto[] = [];

    assetMap.forEach((asset) => {
      const compliancePercentage = asset.totalControls > 0
        ? Math.round((asset.implementedControls / asset.totalControls) * 100)
        : 0;

      if (compliancePercentage >= 90) {
        compliantAssets++;
      } else if (compliancePercentage >= 50) {
        partiallyCompliantAssets++;
      } else {
        nonCompliantAssets++;
        // Track non-compliant assets for the list
        nonCompliantList.push({
          assetId: asset.assetId,
          assetType: asset.assetType,
          assetName: `${asset.assetType} Asset`, // Will be enriched from asset tables if needed
          controlsAssigned: asset.totalControls,
          controlsImplemented: asset.implementedControls,
          compliancePercentage,
          criticalGaps: asset.totalControls - asset.implementedControls,
        });
      }
    });

    // Sort and limit non-compliant list
    const topNonCompliantAssets = nonCompliantList
      .sort((a, b) => a.compliancePercentage - b.compliancePercentage)
      .slice(0, 10);

    // Get total assets count from each asset table
    const totalAssetsQuery = await this.controlAssetMappingRepository.manager.query(`
      SELECT 
        (SELECT COUNT(*) FROM physical_assets WHERE deleted_at IS NULL) +
        (SELECT COUNT(*) FROM information_assets WHERE deleted_at IS NULL) +
        (SELECT COUNT(*) FROM business_applications WHERE deleted_at IS NULL) +
        (SELECT COUNT(*) FROM software_assets WHERE deleted_at IS NULL) +
        (SELECT COUNT(*) FROM suppliers WHERE deleted_at IS NULL) as total
    `);
    const totalAssets = parseInt(totalAssetsQuery[0]?.total || '0', 10);

    // Calculate by asset type
    const byAssetTypeMap = new Map<string, AssetComplianceByTypeDto>();
    
    // Initialize with asset type counts
    const assetTypeCounts = await this.controlAssetMappingRepository.manager.query(`
      SELECT 'physical' as asset_type, COUNT(*) as count FROM physical_assets WHERE deleted_at IS NULL
      UNION ALL
      SELECT 'information', COUNT(*) FROM information_assets WHERE deleted_at IS NULL
      UNION ALL
      SELECT 'application', COUNT(*) FROM business_applications WHERE deleted_at IS NULL
      UNION ALL
      SELECT 'software', COUNT(*) FROM software_assets WHERE deleted_at IS NULL
      UNION ALL
      SELECT 'supplier', COUNT(*) FROM suppliers WHERE deleted_at IS NULL
    `);

    assetTypeCounts.forEach((row: { asset_type: string; count: string }) => {
      byAssetTypeMap.set(row.asset_type, {
        assetType: row.asset_type,
        totalAssets: parseInt(row.count, 10),
        assetsWithControls: 0,
        compliantAssets: 0,
        partiallyCompliantAssets: 0,
        nonCompliantAssets: 0,
        compliancePercentage: 0,
      });
    });

    // Update with control mapping data
    assetMap.forEach((asset) => {
      const typeStats = byAssetTypeMap.get(asset.assetType);
      if (typeStats) {
        typeStats.assetsWithControls++;
        const compliancePercentage = asset.totalControls > 0
          ? Math.round((asset.implementedControls / asset.totalControls) * 100)
          : 0;

        if (compliancePercentage >= 90) {
          typeStats.compliantAssets++;
        } else if (compliancePercentage >= 50) {
          typeStats.partiallyCompliantAssets++;
        } else {
          typeStats.nonCompliantAssets++;
        }
      }
    });

    // Calculate compliance percentage per type
    byAssetTypeMap.forEach((stats) => {
      if (stats.assetsWithControls > 0) {
        stats.compliancePercentage = Math.round(
          (stats.compliantAssets / stats.assetsWithControls) * 100
        );
      }
    });

    const byAssetType = Array.from(byAssetTypeMap.values()).filter(t => t.totalAssets > 0);

    // Calculate overall compliance percentage
    const overallCompliancePercentage = assetsWithControls > 0
      ? Math.round((compliantAssets / assetsWithControls) * 100)
      : 0;

    return {
      totalAssets,
      assetsWithControls,
      assetsWithoutControls: totalAssets - assetsWithControls,
      compliantAssets,
      partiallyCompliantAssets,
      nonCompliantAssets,
      overallCompliancePercentage,
      byAssetType,
      topNonCompliantAssets,
    };
  }
}

