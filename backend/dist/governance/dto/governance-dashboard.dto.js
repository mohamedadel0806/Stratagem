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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceDashboardDto = exports.AssetComplianceStatsDto = exports.NonCompliantAssetDto = exports.AssetComplianceByTypeDto = exports.RecentActivityDto = exports.UpcomingReviewDto = exports.FindingStatsDto = exports.AssessmentStatsDto = exports.PolicyStatsDto = exports.ControlStatsDto = exports.GovernanceSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GovernanceSummaryDto {
}
exports.GovernanceSummaryDto = GovernanceSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "totalInfluencers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "activeInfluencers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "totalPolicies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "publishedPolicies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "policiesUnderReview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "totalControls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "implementedControls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "totalAssessments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "completedAssessments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "inProgressAssessments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "totalFindings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "openFindings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "criticalFindings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "totalEvidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GovernanceSummaryDto.prototype, "approvedEvidence", void 0);
class ControlStatsDto {
}
exports.ControlStatsDto = ControlStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ControlStatsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ControlStatsDto.prototype, "byStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ControlStatsDto.prototype, "byImplementation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ControlStatsDto.prototype, "byType", void 0);
class PolicyStatsDto {
}
exports.PolicyStatsDto = PolicyStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PolicyStatsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], PolicyStatsDto.prototype, "byStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PolicyStatsDto.prototype, "pendingReview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PolicyStatsDto.prototype, "overdueReview", void 0);
class AssessmentStatsDto {
}
exports.AssessmentStatsDto = AssessmentStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssessmentStatsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssessmentStatsDto.prototype, "byStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AssessmentStatsDto.prototype, "byType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssessmentStatsDto.prototype, "averageScore", void 0);
class FindingStatsDto {
}
exports.FindingStatsDto = FindingStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FindingStatsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], FindingStatsDto.prototype, "byStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], FindingStatsDto.prototype, "bySeverity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FindingStatsDto.prototype, "overdueRemediation", void 0);
class UpcomingReviewDto {
}
exports.UpcomingReviewDto = UpcomingReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpcomingReviewDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpcomingReviewDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpcomingReviewDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], UpcomingReviewDto.prototype, "reviewDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpcomingReviewDto.prototype, "daysUntil", void 0);
class RecentActivityDto {
}
exports.RecentActivityDto = RecentActivityDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "entityName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RecentActivityDto.prototype, "createdAt", void 0);
class AssetComplianceByTypeDto {
}
exports.AssetComplianceByTypeDto = AssetComplianceByTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AssetComplianceByTypeDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceByTypeDto.prototype, "totalAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceByTypeDto.prototype, "assetsWithControls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceByTypeDto.prototype, "compliantAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceByTypeDto.prototype, "partiallyCompliantAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceByTypeDto.prototype, "nonCompliantAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceByTypeDto.prototype, "compliancePercentage", void 0);
class NonCompliantAssetDto {
}
exports.NonCompliantAssetDto = NonCompliantAssetDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NonCompliantAssetDto.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NonCompliantAssetDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NonCompliantAssetDto.prototype, "assetName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NonCompliantAssetDto.prototype, "controlsAssigned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NonCompliantAssetDto.prototype, "controlsImplemented", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NonCompliantAssetDto.prototype, "compliancePercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NonCompliantAssetDto.prototype, "criticalGaps", void 0);
class AssetComplianceStatsDto {
}
exports.AssetComplianceStatsDto = AssetComplianceStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatsDto.prototype, "totalAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatsDto.prototype, "assetsWithControls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatsDto.prototype, "assetsWithoutControls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatsDto.prototype, "compliantAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatsDto.prototype, "partiallyCompliantAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatsDto.prototype, "nonCompliantAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AssetComplianceStatsDto.prototype, "overallCompliancePercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AssetComplianceByTypeDto] }),
    __metadata("design:type", Array)
], AssetComplianceStatsDto.prototype, "byAssetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [NonCompliantAssetDto] }),
    __metadata("design:type", Array)
], AssetComplianceStatsDto.prototype, "topNonCompliantAssets", void 0);
class GovernanceDashboardDto {
}
exports.GovernanceDashboardDto = GovernanceDashboardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: GovernanceSummaryDto }),
    __metadata("design:type", GovernanceSummaryDto)
], GovernanceDashboardDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ControlStatsDto }),
    __metadata("design:type", ControlStatsDto)
], GovernanceDashboardDto.prototype, "controlStats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PolicyStatsDto }),
    __metadata("design:type", PolicyStatsDto)
], GovernanceDashboardDto.prototype, "policyStats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AssessmentStatsDto }),
    __metadata("design:type", AssessmentStatsDto)
], GovernanceDashboardDto.prototype, "assessmentStats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FindingStatsDto }),
    __metadata("design:type", FindingStatsDto)
], GovernanceDashboardDto.prototype, "findingStats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AssetComplianceStatsDto, required: false }),
    __metadata("design:type", AssetComplianceStatsDto)
], GovernanceDashboardDto.prototype, "assetComplianceStats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UpcomingReviewDto] }),
    __metadata("design:type", Array)
], GovernanceDashboardDto.prototype, "upcomingReviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RecentActivityDto] }),
    __metadata("design:type", Array)
], GovernanceDashboardDto.prototype, "recentActivity", void 0);
//# sourceMappingURL=governance-dashboard.dto.js.map