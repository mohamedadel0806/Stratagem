"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceDashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const influencer_entity_1 = require("../influencers/entities/influencer.entity");
const policy_entity_1 = require("../policies/entities/policy.entity");
const unified_control_entity_1 = require("../unified-controls/entities/unified-control.entity");
const assessment_entity_1 = require("../assessments/entities/assessment.entity");
const finding_entity_1 = require("../findings/entities/finding.entity");
const evidence_entity_1 = require("../evidence/entities/evidence.entity");
const control_asset_mapping_entity_1 = require("../unified-controls/entities/control-asset-mapping.entity");
let GovernanceDashboardService = class GovernanceDashboardService {
    constructor(influencerRepository, policyRepository, unifiedControlRepository, assessmentRepository, findingRepository, evidenceRepository, controlAssetMappingRepository) {
        this.influencerRepository = influencerRepository;
        this.policyRepository = policyRepository;
        this.unifiedControlRepository = unifiedControlRepository;
        this.assessmentRepository = assessmentRepository;
        this.findingRepository = findingRepository;
        this.evidenceRepository = evidenceRepository;
        this.controlAssetMappingRepository = controlAssetMappingRepository;
    }
    async getDashboard(startDate, endDate) {
        const [summary, controlStats, policyStats, assessmentStats, findingStats, assetComplianceStats, upcomingReviews, recentActivity,] = await Promise.all([
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
    async getSummaryMetrics() {
        const [totalInfluencers, activeInfluencers, totalPolicies, publishedPolicies, policiesUnderReview, totalControls, implementedControls, totalAssessments, completedAssessments, inProgressAssessments, totalFindings, openFindings, criticalFindings, totalEvidence, approvedEvidence,] = await Promise.all([
            this.influencerRepository.count({ where: { deleted_at: (0, typeorm_2.IsNull)() } }),
            this.influencerRepository.count({
                where: { status: influencer_entity_1.InfluencerStatus.ACTIVE, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            this.policyRepository.count({ where: { deleted_at: (0, typeorm_2.IsNull)() } }),
            this.policyRepository.count({
                where: { status: policy_entity_1.PolicyStatus.PUBLISHED, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            this.policyRepository.count({
                where: { status: policy_entity_1.PolicyStatus.IN_REVIEW, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            this.unifiedControlRepository.count({ where: { deleted_at: (0, typeorm_2.IsNull)() } }),
            this.unifiedControlRepository.count({
                where: {
                    implementation_status: unified_control_entity_1.ImplementationStatus.IMPLEMENTED,
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            }),
            this.assessmentRepository.count({ where: { deleted_at: (0, typeorm_2.IsNull)() } }),
            this.assessmentRepository.count({
                where: { status: assessment_entity_1.AssessmentStatus.COMPLETED, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            this.assessmentRepository.count({
                where: { status: assessment_entity_1.AssessmentStatus.IN_PROGRESS, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            this.findingRepository.count({ where: { deleted_at: (0, typeorm_2.IsNull)() } }),
            this.findingRepository.count({
                where: {
                    status: finding_entity_1.FindingStatus.OPEN,
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            }),
            this.findingRepository.count({
                where: {
                    severity: finding_entity_1.FindingSeverity.CRITICAL,
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            }),
            this.evidenceRepository.count({ where: { deleted_at: (0, typeorm_2.IsNull)() } }),
            this.evidenceRepository.count({
                where: { status: evidence_entity_1.EvidenceStatus.APPROVED, deleted_at: (0, typeorm_2.IsNull)() },
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
    async getControlStats() {
        const total = await this.unifiedControlRepository.count({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
        });
        const byStatus = {
            active: await this.unifiedControlRepository.count({
                where: { status: unified_control_entity_1.ControlStatus.ACTIVE, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            draft: await this.unifiedControlRepository.count({
                where: { status: unified_control_entity_1.ControlStatus.DRAFT, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            retired: await this.unifiedControlRepository.count({
                where: { status: unified_control_entity_1.ControlStatus.DEPRECATED, deleted_at: (0, typeorm_2.IsNull)() },
            }),
        };
        const byImplementation = {
            implemented: await this.unifiedControlRepository.count({
                where: {
                    implementation_status: unified_control_entity_1.ImplementationStatus.IMPLEMENTED,
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            }),
            inProgress: await this.unifiedControlRepository.count({
                where: {
                    implementation_status: unified_control_entity_1.ImplementationStatus.IN_PROGRESS,
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            }),
            planned: await this.unifiedControlRepository.count({
                where: {
                    implementation_status: unified_control_entity_1.ImplementationStatus.PLANNED,
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            }),
            notImplemented: await this.unifiedControlRepository.count({
                where: {
                    implementation_status: unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED,
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            }),
        };
        const byType = {
            preventive: await this.unifiedControlRepository.count({
                where: { control_type: unified_control_entity_1.ControlType.PREVENTIVE, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            detective: await this.unifiedControlRepository.count({
                where: { control_type: unified_control_entity_1.ControlType.DETECTIVE, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            corrective: await this.unifiedControlRepository.count({
                where: { control_type: unified_control_entity_1.ControlType.CORRECTIVE, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            compensating: await this.unifiedControlRepository.count({
                where: { control_type: unified_control_entity_1.ControlType.COMPENSATING, deleted_at: (0, typeorm_2.IsNull)() },
            }),
        };
        return {
            total,
            byStatus,
            byImplementation,
            byType,
        };
    }
    async getPolicyStats() {
        const total = await this.policyRepository.count({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
        });
        const byStatus = {
            draft: await this.policyRepository.count({
                where: { status: policy_entity_1.PolicyStatus.DRAFT, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            inReview: await this.policyRepository.count({
                where: { status: policy_entity_1.PolicyStatus.IN_REVIEW, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            approved: await this.policyRepository.count({
                where: { status: policy_entity_1.PolicyStatus.APPROVED, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            published: await this.policyRepository.count({
                where: { status: policy_entity_1.PolicyStatus.PUBLISHED, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            archived: await this.policyRepository.count({
                where: { status: policy_entity_1.PolicyStatus.ARCHIVED, deleted_at: (0, typeorm_2.IsNull)() },
            }),
        };
        const now = new Date();
        const pendingReview = await this.policyRepository.count({
            where: {
                next_review_date: (0, typeorm_2.LessThanOrEqual)(now),
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        const overdueReview = await this.policyRepository
            .createQueryBuilder('policy')
            .where('policy.next_review_date < :now', { now })
            .andWhere('policy.deleted_at IS NULL')
            .andWhere('policy.status != :archived', { archived: policy_entity_1.PolicyStatus.ARCHIVED })
            .getCount();
        return {
            total,
            byStatus,
            pendingReview,
            overdueReview,
        };
    }
    async getAssessmentStats() {
        const total = await this.assessmentRepository.count({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
        });
        const byStatus = {
            notStarted: await this.assessmentRepository.count({
                where: { status: assessment_entity_1.AssessmentStatus.NOT_STARTED, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            inProgress: await this.assessmentRepository.count({
                where: { status: assessment_entity_1.AssessmentStatus.IN_PROGRESS, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            underReview: await this.assessmentRepository.count({
                where: { status: assessment_entity_1.AssessmentStatus.UNDER_REVIEW, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            completed: await this.assessmentRepository.count({
                where: { status: assessment_entity_1.AssessmentStatus.COMPLETED, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            cancelled: await this.assessmentRepository.count({
                where: { status: assessment_entity_1.AssessmentStatus.CANCELLED, deleted_at: (0, typeorm_2.IsNull)() },
            }),
        };
        const byType = {
            implementation: await this.assessmentRepository.count({
                where: { assessment_type: assessment_entity_1.AssessmentType.IMPLEMENTATION, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            designEffectiveness: await this.assessmentRepository.count({
                where: { assessment_type: assessment_entity_1.AssessmentType.DESIGN_EFFECTIVENESS, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            operatingEffectiveness: await this.assessmentRepository.count({
                where: { assessment_type: assessment_entity_1.AssessmentType.OPERATING_EFFECTIVENESS, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            compliance: await this.assessmentRepository.count({
                where: { assessment_type: assessment_entity_1.AssessmentType.COMPLIANCE, deleted_at: (0, typeorm_2.IsNull)() },
            }),
        };
        const completedAssessments = await this.assessmentRepository.find({
            where: { status: assessment_entity_1.AssessmentStatus.COMPLETED, deleted_at: (0, typeorm_2.IsNull)() },
            select: ['overall_score'],
        });
        const scores = completedAssessments
            .map((a) => a.overall_score)
            .filter((score) => score !== null && score !== undefined);
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
    async getFindingStats() {
        const total = await this.findingRepository.count({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
        });
        const byStatus = {
            open: await this.findingRepository.count({
                where: { status: finding_entity_1.FindingStatus.OPEN, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            inProgress: await this.findingRepository.count({
                where: { status: finding_entity_1.FindingStatus.IN_PROGRESS, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            closed: await this.findingRepository.count({
                where: { status: finding_entity_1.FindingStatus.CLOSED, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            riskAccepted: await this.findingRepository.count({
                where: { status: finding_entity_1.FindingStatus.ACCEPTED, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            falsePositive: await this.findingRepository.count({
                where: { status: finding_entity_1.FindingStatus.REJECTED, deleted_at: (0, typeorm_2.IsNull)() },
            }),
        };
        const bySeverity = {
            critical: await this.findingRepository.count({
                where: { severity: finding_entity_1.FindingSeverity.CRITICAL, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            high: await this.findingRepository.count({
                where: { severity: finding_entity_1.FindingSeverity.HIGH, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            medium: await this.findingRepository.count({
                where: { severity: finding_entity_1.FindingSeverity.MEDIUM, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            low: await this.findingRepository.count({
                where: { severity: finding_entity_1.FindingSeverity.LOW, deleted_at: (0, typeorm_2.IsNull)() },
            }),
            informational: await this.findingRepository.count({
                where: { severity: finding_entity_1.FindingSeverity.INFO, deleted_at: (0, typeorm_2.IsNull)() },
            }),
        };
        const now = new Date();
        const overdueRemediation = await this.findingRepository
            .createQueryBuilder('finding')
            .where('finding.remediation_due_date < :now', { now })
            .andWhere('finding.deleted_at IS NULL')
            .andWhere('finding.status IN (:...statuses)', {
            statuses: [finding_entity_1.FindingStatus.OPEN, finding_entity_1.FindingStatus.IN_PROGRESS],
        })
            .getCount();
        return {
            total,
            byStatus,
            bySeverity,
            overdueRemediation,
        };
    }
    async getUpcomingReviews() {
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const upcoming = [];
        const policies = await this.policyRepository.find({
            where: {
                next_review_date: (0, typeorm_2.LessThanOrEqual)(thirtyDaysFromNow),
                deleted_at: (0, typeorm_2.IsNull)(),
            },
            take: 10,
            order: { next_review_date: 'ASC' },
        });
        policies.forEach((policy) => {
            if (policy.next_review_date) {
                const reviewDate = policy.next_review_date instanceof Date
                    ? policy.next_review_date
                    : new Date(policy.next_review_date);
                if (isNaN(reviewDate.getTime())) {
                    return;
                }
                const daysUntil = Math.ceil((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                upcoming.push({
                    id: policy.id,
                    type: 'policy',
                    name: policy.title,
                    reviewDate,
                    daysUntil,
                });
            }
        });
        const influencers = await this.influencerRepository.find({
            where: {
                next_review_date: (0, typeorm_2.LessThanOrEqual)(thirtyDaysFromNow),
                deleted_at: (0, typeorm_2.IsNull)(),
            },
            take: 10,
            order: { next_review_date: 'ASC' },
        });
        influencers.forEach((influencer) => {
            if (influencer.next_review_date) {
                const reviewDate = influencer.next_review_date instanceof Date
                    ? influencer.next_review_date
                    : new Date(influencer.next_review_date);
                if (isNaN(reviewDate.getTime())) {
                    return;
                }
                const daysUntil = Math.ceil((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                upcoming.push({
                    id: influencer.id,
                    type: 'influencer',
                    name: influencer.name,
                    reviewDate,
                    daysUntil,
                });
            }
        });
        return upcoming.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 10);
    }
    async getRecentActivity() {
        const activities = [];
        const recentPolicies = await this.policyRepository.find({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
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
        const recentControls = await this.unifiedControlRepository.find({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
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
        const recentAssessments = await this.assessmentRepository.find({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
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
        const recentFindings = await this.findingRepository.find({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
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
        const recentEvidence = await this.evidenceRepository.find({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
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
        return activities
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 15);
    }
    async getAssetComplianceStats() {
        var _a;
        const assetMappings = await this.controlAssetMappingRepository
            .createQueryBuilder('cam')
            .select([
            'cam.asset_type',
            'cam.asset_id',
            'cam.implementation_status',
        ])
            .getRawMany();
        const assetMap = new Map();
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
            const asset = assetMap.get(key);
            asset.totalControls++;
            if (mapping.cam_implementation_status === unified_control_entity_1.ImplementationStatus.IMPLEMENTED) {
                asset.implementedControls++;
            }
        });
        const assetsWithControls = assetMap.size;
        let compliantAssets = 0;
        let partiallyCompliantAssets = 0;
        let nonCompliantAssets = 0;
        const nonCompliantList = [];
        assetMap.forEach((asset) => {
            const compliancePercentage = asset.totalControls > 0
                ? Math.round((asset.implementedControls / asset.totalControls) * 100)
                : 0;
            if (compliancePercentage >= 90) {
                compliantAssets++;
            }
            else if (compliancePercentage >= 50) {
                partiallyCompliantAssets++;
            }
            else {
                nonCompliantAssets++;
                nonCompliantList.push({
                    assetId: asset.assetId,
                    assetType: asset.assetType,
                    assetName: `${asset.assetType} Asset`,
                    controlsAssigned: asset.totalControls,
                    controlsImplemented: asset.implementedControls,
                    compliancePercentage,
                    criticalGaps: asset.totalControls - asset.implementedControls,
                });
            }
        });
        const topNonCompliantAssets = nonCompliantList
            .sort((a, b) => a.compliancePercentage - b.compliancePercentage)
            .slice(0, 10);
        const totalAssetsQuery = await this.controlAssetMappingRepository.manager.query(`
      SELECT 
        (SELECT COUNT(*) FROM physical_assets WHERE deleted_at IS NULL) +
        (SELECT COUNT(*) FROM information_assets WHERE deleted_at IS NULL) +
        (SELECT COUNT(*) FROM business_applications WHERE deleted_at IS NULL) +
        (SELECT COUNT(*) FROM software_assets WHERE deleted_at IS NULL) +
        (SELECT COUNT(*) FROM suppliers WHERE deleted_at IS NULL) as total
    `);
        const totalAssets = parseInt(((_a = totalAssetsQuery[0]) === null || _a === void 0 ? void 0 : _a.total) || '0', 10);
        const byAssetTypeMap = new Map();
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
        assetTypeCounts.forEach((row) => {
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
        assetMap.forEach((asset) => {
            const typeStats = byAssetTypeMap.get(asset.assetType);
            if (typeStats) {
                typeStats.assetsWithControls++;
                const compliancePercentage = asset.totalControls > 0
                    ? Math.round((asset.implementedControls / asset.totalControls) * 100)
                    : 0;
                if (compliancePercentage >= 90) {
                    typeStats.compliantAssets++;
                }
                else if (compliancePercentage >= 50) {
                    typeStats.partiallyCompliantAssets++;
                }
                else {
                    typeStats.nonCompliantAssets++;
                }
            }
        });
        byAssetTypeMap.forEach((stats) => {
            if (stats.assetsWithControls > 0) {
                stats.compliancePercentage = Math.round((stats.compliantAssets / stats.assetsWithControls) * 100);
            }
        });
        const byAssetType = Array.from(byAssetTypeMap.values()).filter(t => t.totalAssets > 0);
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
};
exports.GovernanceDashboardService = GovernanceDashboardService;
exports.GovernanceDashboardService = GovernanceDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(influencer_entity_1.Influencer)),
    __param(1, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(2, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __param(3, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __param(4, (0, typeorm_1.InjectRepository)(finding_entity_1.Finding)),
    __param(5, (0, typeorm_1.InjectRepository)(evidence_entity_1.Evidence)),
    __param(6, (0, typeorm_1.InjectRepository)(control_asset_mapping_entity_1.ControlAssetMapping)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GovernanceDashboardService);
//# sourceMappingURL=governance-dashboard.service.js.map